import Quiz from '../models/Quiz.js';
import Question from '../models/Question.js';
import QuizResult from '../models/QuizResult.js';
import User from '../models/User.js';
import { calculateLevelProgress } from '../utils/calculateXP.js';
import { updateUserStreak } from '../utils/updateStreak.js';

// @desc    Get all quizzes
// @route   GET /api/quizzes
// @access  Public
export const getQuizzes = async (req, res) => {
  try {
    const quizzes = await Quiz.find().sort({ createdAt: -1 });
    
    // Get user results if authenticated
    let quizzesWithResults = quizzes;
    if (req.user) {
      const results = await QuizResult.find({ user: req.user._id });
      
      quizzesWithResults = await Promise.all(
        quizzes.map(async (quiz) => {
          const result = results.find(
            r => r.quiz.toString() === quiz._id.toString()
          );
          const questionCount = await Question.countDocuments({ quiz: quiz._id });
          
          return {
            ...quiz.toObject(),
            questions: questionCount,
            completed: !!result,
            score: result ? result.score : null,
          };
        })
      );
    } else {
      // For non-authenticated users, just add question count
      quizzesWithResults = await Promise.all(
        quizzes.map(async (quiz) => {
          const questionCount = await Question.countDocuments({ quiz: quiz._id });
          return {
            ...quiz.toObject(),
            questions: questionCount,
            completed: false,
            score: null,
          };
        })
      );
    }
    
    res.json(quizzesWithResults);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single quiz
// @route   GET /api/quizzes/:id
// @access  Public
export const getQuiz = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }
    
    const questionCount = await Question.countDocuments({ quiz: quiz._id });
    
    res.json({
      ...quiz.toObject(),
      questions: questionCount,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get quiz questions
// @route   GET /api/quizzes/:id/questions
// @access  Public
export const getQuizQuestions = async (req, res) => {
  try {
    const questions = await Question.find({ quiz: req.params.id })
      .sort({ order: 1 })
      .select('-correct'); // Don't send correct answer
    
    res.json(questions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Submit quiz answers
// @route   POST /api/quizzes/:id/submit
// @access  Private
export const submitQuiz = async (req, res) => {
  try {
    const { answers } = req.body;
    const quiz = await Quiz.findById(req.params.id);
    
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }
    
    // Get all questions with correct answers
    const questions = await Question.find({ quiz: quiz._id }).sort({ order: 1 });
    
    if (answers.length !== questions.length) {
      return res.status(400).json({ message: 'Invalid number of answers' });
    }
    
    // Calculate score
    let correctCount = 0;
    questions.forEach((question, index) => {
      if (answers[index] === question.correct) {
        correctCount++;
      }
    });
    
    const score = Math.round((correctCount / questions.length) * 100);
    const xpEarned = Math.round(quiz.xp * (score / 100));
    
    // Save or update result
    const result = await QuizResult.findOneAndUpdate(
      { user: req.user._id, quiz: quiz._id },
      {
        user: req.user._id,
        quiz: quiz._id,
        answers,
        score,
        xpEarned,
        completed: true,
      },
      { upsert: true, new: true }
    );
    
    // Award XP to user
    const user = await User.findById(req.user._id);
    const previousResult = await QuizResult.findOne({
      user: req.user._id,
      quiz: quiz._id,
    });
    
    // Only award XP if this is first completion or better score
    let leveledUp = false;
    let previousLevel = user.level;
    
    if (!previousResult || score > previousResult.score) {
      if (previousResult) {
        user.totalXp -= previousResult.xpEarned; // Remove old XP
      }
      previousLevel = calculateLevelProgress(user.totalXp).level;
      user.totalXp += xpEarned;
      
      // Update level
      const levelData = calculateLevelProgress(user.totalXp);
      const newLevel = levelData.level;
      leveledUp = newLevel > previousLevel;
      user.level = newLevel;
      
      // Update quiz stats
      if (!previousResult) {
        user.quizzesPassed += 1;
      }
      user.totalQuizzes = Math.max(user.totalQuizzes, await Quiz.countDocuments());
      
      // Update streak
      await updateUserStreak(req.user._id);
      
      await user.save();
    }
    
    const finalLevelData = calculateLevelProgress(user.totalXp);
    
    res.json({
      score,
      correctCount,
      totalQuestions: questions.length,
      xpEarned,
      level: finalLevelData.level,
      xp: finalLevelData.xp,
      xpToNextLevel: finalLevelData.xpToNextLevel,
      leveledUp: leveledUp,
      previousLevel: previousLevel,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create quiz
// @route   POST /api/quizzes
// @access  Private/Admin
export const createQuiz = async (req, res) => {
  try {
    const { questions, ...quizData } = req.body;
    
    const quiz = await Quiz.create({
      ...quizData,
      createdBy: req.user._id,
    });
    
    // Create questions
    if (questions && questions.length > 0) {
      const questionPromises = questions.map((q, index) =>
        Question.create({
          ...q,
          quiz: quiz._id,
          order: index + 1,
        })
      );
      await Promise.all(questionPromises);
    }
    
    res.status(201).json(quiz);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update quiz
// @route   PUT /api/quizzes/:id
// @access  Private/Admin
export const updateQuiz = async (req, res) => {
  try {
    const quiz = await Quiz.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }
    
    res.json(quiz);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete quiz
// @route   DELETE /api/quizzes/:id
// @access  Private/Admin
export const deleteQuiz = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }
    
    // Delete associated questions and results
    await Question.deleteMany({ quiz: quiz._id });
    await QuizResult.deleteMany({ quiz: quiz._id });
    
    await quiz.deleteOne();
    
    res.json({ message: 'Quiz deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};




