import Lesson from '../models/Lesson.js';
import Course from '../models/Course.js';
import UserProgress from '../models/UserProgress.js';
import User from '../models/User.js';
import { calculateLevelProgress } from '../utils/calculateXP.js';
import { updateUserStreak } from '../utils/updateStreak.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// @desc    Get lessons for a course
// @route   GET /api/courses/:courseId/lessons
// @access  Public
export const getLessons = async (req, res) => {
  try {
    const lessons = await Lesson.find({ course: req.params.courseId })
      .sort({ order: 1 });
    
    // Get user progress if authenticated
    let lessonsWithProgress = lessons;
    if (req.user) {
      const progressData = await UserProgress.find({ 
        user: req.user._id,
        lesson: { $in: lessons.map(l => l._id) }
      });
      
      lessonsWithProgress = lessons.map(lesson => {
        const progress = progressData.find(
          p => p.lesson.toString() === lesson._id.toString()
        );
        return {
          ...lesson.toObject(),
          completed: progress ? progress.completed : false,
          notes: progress ? progress.notes : '',
        };
      });
    }
    
    res.json(lessonsWithProgress);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single lesson
// @route   GET /api/lessons/:id
// @access  Public
export const getLesson = async (req, res) => {
  try {
    const lesson = await Lesson.findById(req.params.id);
    
    if (!lesson) {
      return res.status(404).json({ message: 'Lesson not found' });
    }
    
    // Get user progress if authenticated
    let lessonData = lesson.toObject();
    if (req.user && req.user._id) {
      const progress = await UserProgress.findOne({
        user: req.user._id,
        lesson: lesson._id,
      });
      
      if (progress) {
        lessonData.completed = progress.completed || false;
        lessonData.notes = progress.notes || '';
      } else {
        // If no progress exists, set defaults
        lessonData.completed = false;
        lessonData.notes = '';
      }
    } else {
      // If not authenticated, set defaults
      lessonData.completed = false;
      lessonData.notes = '';
    }
    
    res.json(lessonData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create lesson
// @route   POST /api/lessons
// @access  Private/Admin
export const createLesson = async (req, res) => {
  try {
    const course = await Course.findById(req.body.course);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    
    // Get next order number
    const lessonCount = await Lesson.countDocuments({ course: req.body.course });
    
    const lesson = await Lesson.create({
      ...req.body,
      order: lessonCount + 1,
      createdBy: req.user._id,
    });
    
    // Note: We don't update Course.lessons field anymore - it's calculated dynamically
    // This ensures data consistency and prevents stale data
    
    res.status(201).json(lesson);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update lesson
// @route   PUT /api/lessons/:id
// @access  Private/Admin
export const updateLesson = async (req, res) => {
  try {
    const lesson = await Lesson.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!lesson) {
      return res.status(404).json({ message: 'Lesson not found' });
    }
    
    res.json(lesson);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete lesson
// @route   DELETE /api/lessons/:id
// @access  Private/Admin
export const deleteLesson = async (req, res) => {
  try {
    const lesson = await Lesson.findById(req.params.id);
    
    if (!lesson) {
      return res.status(404).json({ message: 'Lesson not found' });
    }
    
    // Delete user progress for this lesson
    await UserProgress.deleteMany({ lesson: lesson._id });
    
    await lesson.deleteOne();
    
    res.json({ message: 'Lesson deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Upload video file
// @route   POST /api/lessons/upload
// @access  Private/Admin
export const uploadVideo = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No video file uploaded' });
    }

    // Generate URL for the uploaded file
    // In production, you'd upload to cloud storage (S3, Cloudinary, etc.)
    // For now, we'll serve it from the uploads directory
    const fileUrl = `/uploads/videos/${req.file.filename}`;
    
    res.json({
      message: 'Video uploaded successfully',
      videoUrl: fileUrl,
      filename: req.file.filename,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Mark lesson as complete
// @route   POST /api/lessons/:id/complete
// @access  Private
export const completeLesson = async (req, res) => {
  try {
    const lesson = await Lesson.findById(req.params.id);
    if (!lesson) {
      return res.status(404).json({ message: 'Lesson not found' });
    }
    
    // Update or create user progress
    let progress = await UserProgress.findOne({
      user: req.user._id,
      lesson: lesson._id,
    });
    
    // Check if already completed - if so, don't award XP again
    const wasAlreadyCompleted = progress && progress.completed;
    
    if (!progress) {
      progress = await UserProgress.create({
        user: req.user._id,
        lesson: lesson._id,
        course: lesson.course,
        completed: true,
        progress: 100,
      });
    } else {
      progress.completed = true;
      progress.progress = 100;
      await progress.save();
    }
    
    // Award XP only if lesson was not already completed
    let xpReward = 0;
    let leveledUp = false;
    let previousLevel = 1;
    let levelData = { level: 1, xp: 0, xpToNextLevel: 1000 };
    
    if (!wasAlreadyCompleted) {
      const user = await User.findById(req.user._id);
      previousLevel = user.level;
      xpReward = 50;
      user.totalXp += xpReward;
      
      // Update level
      levelData = calculateLevelProgress(user.totalXp);
      const newLevel = levelData.level;
      leveledUp = newLevel > previousLevel;
      user.level = newLevel;
      
      // Update streak
      await updateUserStreak(req.user._id);
      
      await user.save();
    } else {
      // Get current user data for response (without awarding XP)
      const user = await User.findById(req.user._id);
      previousLevel = user.level;
      levelData = calculateLevelProgress(user.totalXp);
    }
    
    // Update course progress
    const courseLessons = await Lesson.countDocuments({ course: lesson.course });
    const completedLessons = await UserProgress.countDocuments({
      user: req.user._id,
      course: lesson.course,
      completed: true,
    });
    const courseProgress = Math.floor((completedLessons / courseLessons) * 100);
    
    await UserProgress.findOneAndUpdate(
      { user: req.user._id, course: lesson.course },
      { progress: courseProgress },
      { upsert: true }
    );
    
    res.json({
      message: wasAlreadyCompleted ? 'Lesson already completed' : 'Lesson completed',
      xpEarned: xpReward,
      level: levelData.level,
      xp: levelData.xp,
      xpToNextLevel: levelData.xpToNextLevel,
      leveledUp: leveledUp,
      previousLevel: previousLevel,
      alreadyCompleted: wasAlreadyCompleted,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Save lesson notes
// @route   POST /api/lessons/:id/notes
// @access  Private
export const saveNotes = async (req, res) => {
  try {
    const { notes } = req.body;
    
    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: 'User not authenticated' });
    }
    
    const lesson = await Lesson.findById(req.params.id);
    if (!lesson) {
      return res.status(404).json({ message: 'Lesson not found' });
    }
    
    // Update or create user progress with notes
    const progress = await UserProgress.findOneAndUpdate(
      {
        user: req.user._id,
        lesson: lesson._id,
      },
      {
        user: req.user._id,
        lesson: lesson._id,
        course: lesson.course,
        notes: notes || '',
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    
    // Verify notes were saved
    const savedProgress = await UserProgress.findOne({
      user: req.user._id,
      lesson: lesson._id,
    });
    
    res.json({ 
      message: 'Notes saved successfully',
      notes: savedProgress ? savedProgress.notes : (notes || ''),
      saved: true
    });
  } catch (error) {
    console.error('Error saving notes:', error);
    res.status(500).json({ message: error.message });
  }
};




