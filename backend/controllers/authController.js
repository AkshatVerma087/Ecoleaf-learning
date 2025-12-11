import User from '../models/User.js';
import generateToken from '../utils/generateToken.js';
import { calculateLevelProgress } from '../utils/calculateXP.js';
import { updateUserStreak } from '../utils/updateStreak.js';

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password,
      role: 'student',
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`,
    });

    if (user) {
      const levelData = calculateLevelProgress(user.totalXp);
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        level: levelData.level,
        xp: levelData.xp,
        xpToNextLevel: levelData.xpToNextLevel,
        totalXp: user.totalXp,
        streak: user.streak,
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check for user email
    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      // Reject admin users - they must use admin login
      if (user.role === 'admin') {
        return res.status(403).json({ 
          message: 'Admin users must login through the admin portal. Please use /admin/login' 
        });
      }
      
      // Update streak on login
      await updateUserStreak(user._id);
      
      // Refresh user data to get updated streak
      const updatedUser = await User.findById(user._id);
      
      const levelData = calculateLevelProgress(updatedUser.totalXp);
      res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        avatar: updatedUser.avatar,
        level: levelData.level,
        xp: levelData.xp,
        xpToNextLevel: levelData.xpToNextLevel,
        totalXp: updatedUser.totalXp,
        streak: updatedUser.streak,
        tasksCompleted: updatedUser.tasksCompleted,
        quizzesPassed: updatedUser.quizzesPassed,
        totalQuizzes: updatedUser.totalQuizzes,
        carbonScore: updatedUser.carbonScore,
        token: generateToken(updatedUser._id),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Admin login
// @route   POST /api/auth/admin/login
// @access  Public
export const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check for user with this email
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: 'Invalid admin credentials' });
    }

    // Check if user is admin
    if (user.role !== 'admin') {
      return res.status(403).json({ 
        message: 'Access denied. This is an admin-only portal. Regular users should use the student login.' 
      });
    }

    // Verify password
    if (await user.matchPassword(password)) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: 'Invalid admin credentials' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const levelData = calculateLevelProgress(user.totalXp);
    
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
      level: levelData.level,
      xp: levelData.xp,
      xpToNextLevel: levelData.xpToNextLevel,
      totalXp: user.totalXp,
      streak: user.streak,
      tasksCompleted: user.tasksCompleted,
      quizzesPassed: user.quizzesPassed,
      totalQuizzes: user.totalQuizzes,
      carbonScore: user.carbonScore,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};




