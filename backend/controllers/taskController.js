import Task from '../models/Task.js';
import TaskCompletion from '../models/TaskCompletion.js';
import User from '../models/User.js';
import { calculateLevelProgress } from '../utils/calculateXP.js';
import { updateUserStreak } from '../utils/updateStreak.js';

// @desc    Get all daily tasks
// @route   GET /api/tasks
// @access  Private
export const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ active: true }).sort({ createdAt: 1 });
    
    // Get today's date (start of day)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    // Get user's completions for today only
    const completions = await TaskCompletion.find({
      user: req.user._id,
      date: {
        $gte: today,
        $lt: tomorrow,
      },
    });
    
    const tasksWithCompletion = tasks.map(task => {
      const completion = completions.find(
        c => c.task.toString() === task._id.toString()
      );
      
      return {
        ...task.toObject(),
        completed: completion ? completion.completed : false,
        completionId: completion ? completion._id : null,
      };
    });
    
    res.json(tasksWithCompletion);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Complete a task
// @route   POST /api/tasks/:id/complete
// @access  Private
export const completeTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    
    // Get today's date (start of day)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    // Check if already completed today
    let completion = await TaskCompletion.findOne({
      user: req.user._id,
      task: task._id,
      date: {
        $gte: today,
        $lt: tomorrow,
      },
    });
    
    if (completion && completion.completed) {
      return res.status(400).json({ message: 'Task already completed today' });
    }
    
    // Create or update completion
    if (!completion) {
      completion = await TaskCompletion.create({
        user: req.user._id,
        task: task._id,
        completed: true,
        completedAt: new Date(),
        date: today,
      });
    } else {
      completion.completed = true;
      completion.completedAt = new Date();
      await completion.save();
    }
    
    // Award XP
    const user = await User.findById(req.user._id);
    const previousLevel = user.level;
    user.totalXp += task.xp;
    user.tasksCompleted += 1;
    
    // Update level
    const levelData = calculateLevelProgress(user.totalXp);
    const newLevel = levelData.level;
    const leveledUp = newLevel > previousLevel;
    user.level = newLevel;
    
    // Update streak
    await updateUserStreak(req.user._id);
    
    await user.save();
    
    res.json({
      message: 'Task completed',
      xpEarned: task.xp,
      level: levelData.level,
      xp: levelData.xp,
      xpToNextLevel: levelData.xpToNextLevel,
      leveledUp: leveledUp,
      previousLevel: previousLevel,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Upload proof for task
// @route   POST /api/tasks/:id/upload
// @access  Private
export const uploadProof = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    
    // In a real app, you would handle file upload here using multer
    // For now, we'll just accept a proof URL
    const { proofUrl } = req.body;
    
    // Get today's date (start of day)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    // Check if already completed today
    let completion = await TaskCompletion.findOne({
      user: req.user._id,
      task: task._id,
      date: {
        $gte: today,
        $lt: tomorrow,
      },
    });
    
    if (completion && completion.completed) {
      return res.status(400).json({ message: 'Task already completed today' });
    }
    
    if (!completion) {
      completion = await TaskCompletion.create({
        user: req.user._id,
        task: task._id,
        proofUrl: proofUrl || '',
        date: today,
      });
    } else {
      completion.proofUrl = proofUrl || '';
      await completion.save();
    }
    
    // Auto-complete when proof is uploaded (for all tasks)
    completion.completed = true;
    completion.completedAt = new Date();
    await completion.save();
    
    // Award XP
    const user = await User.findById(req.user._id);
    const previousLevel = user.level;
    user.totalXp += task.xp;
    user.tasksCompleted += 1;
    
    const levelData = calculateLevelProgress(user.totalXp);
    const newLevel = levelData.level;
    const leveledUp = newLevel > previousLevel;
    user.level = newLevel;
    
    await updateUserStreak(req.user._id);
    await user.save();
    
    res.json({
      message: 'Proof uploaded and task completed',
      xpEarned: task.xp,
      level: levelData.level,
      xp: levelData.xp,
      xpToNextLevel: levelData.xpToNextLevel,
      leveledUp: leveledUp,
      previousLevel: previousLevel,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

