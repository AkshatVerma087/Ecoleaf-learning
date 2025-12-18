import User from '../models/User.js';
import Course from '../models/Course.js';
import Quiz from '../models/Quiz.js';
import { calculateLevelProgress } from '../utils/calculateXP.js';

// @desc    Get admin dashboard stats
// @route   GET /api/admin/dashboard
// @access  Private/Admin
export const getAdminDashboard = async (req, res) => {
  try {
    const totalStudents = await User.countDocuments({ role: 'student' });
    const totalCourses = await Course.countDocuments();
    const totalQuizzes = await Quiz.countDocuments();
    
    // Calculate average progress
    const students = await User.find({ role: 'student' });
    const avgProgress = students.length > 0
      ? Math.round(
          students.reduce((sum, s) => {
            const levelData = calculateLevelProgress(s.totalXp);
            return sum + (levelData.xp / levelData.xpToNextLevel) * 100;
          }, 0) / students.length
        )
      : 0;
    
    res.json({
      totalStudents,
      totalCourses,
      totalQuizzes,
      avgProgress,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all students
// @route   GET /api/admin/students
// @access  Private/Admin
export const getStudents = async (req, res) => {
  try {
    const { search, sortBy = 'xp', sortOrder = 'desc' } = req.query;
    
    let query = { role: 'student' };
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }
    
    const students = await User.find(query).select('-password');
    
    // Calculate progress for each student
    const studentsWithProgress = students.map(student => {
      const levelData = calculateLevelProgress(student.totalXp);
      return {
        ...student.toObject(),
        level: levelData.level,
        xp: student.totalXp,
        progress: Math.round((levelData.xp / levelData.xpToNextLevel) * 100),
      };
    });
    
    // Sort
    studentsWithProgress.sort((a, b) => {
      const order = sortOrder === 'asc' ? 1 : -1;
      return (a[sortBy] - b[sortBy]) * order;
    });
    
    res.json(studentsWithProgress);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};







