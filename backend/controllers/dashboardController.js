import User from '../models/User.js';
import Task from '../models/Task.js';
import TaskCompletion from '../models/TaskCompletion.js';
import QuizResult from '../models/QuizResult.js';
import { calculateLevelProgress } from '../utils/calculateXP.js';
import { seedTasks } from '../utils/seedTasks.js';

// @desc    Get dashboard stats
// @route   GET /api/dashboard/stats
// @access  Private
export const getDashboardStats = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const levelData = calculateLevelProgress(user.totalXp);
    
    // Ensure tasks are seeded
    await seedTasks();
    
    // Get total active tasks
    const totalTasks = await Task.countDocuments({ active: true });
    
    // Calculate today's completed tasks
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const todayTasksCompleted = await TaskCompletion.countDocuments({
      user: req.user._id,
      completed: true,
      date: {
        $gte: today,
        $lt: tomorrow,
      },
    });
    
    // Calculate remaining tasks
    const remainingTasks = totalTasks - todayTasksCompleted;
    
    // Calculate average quiz score
    const quizResults = await QuizResult.find({ user: req.user._id });
    let averageScore = 0;
    if (quizResults.length > 0) {
      const totalScore = quizResults.reduce((sum, result) => sum + result.score, 0);
      averageScore = Math.round(totalScore / quizResults.length);
    }
    
    res.json({
      level: levelData.level,
      xp: levelData.xp,
      xpToNextLevel: levelData.xpToNextLevel,
      totalXp: user.totalXp,
      streak: user.streak,
      tasksCompleted: todayTasksCompleted, // Today's completed tasks instead of cumulative
      totalTasks: totalTasks, // Total tasks available
      remainingTasks: remainingTasks, // Tasks remaining for today
      quizzesPassed: user.quizzesPassed,
      totalQuizzes: user.totalQuizzes,
      averageQuizScore: averageScore,
      carbonScore: user.carbonScore,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};




