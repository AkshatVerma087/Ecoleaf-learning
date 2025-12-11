import Course from '../models/Course.js';
import Lesson from '../models/Lesson.js';
import UserProgress from '../models/UserProgress.js';

// @desc    Get all courses
// @route   GET /api/courses
// @access  Public
export const getCourses = async (req, res) => {
  try {
    const courses = await Course.find().sort({ createdAt: -1 });
    
    // Calculate lessons count and duration for each course
    const coursesWithStats = await Promise.all(
      courses.map(async (course) => {
        const lessons = await Lesson.find({ course: course._id });
        const lessonsCount = lessons.length;
        
        // Calculate total duration from lessons
        let totalMinutes = 0;
        lessons.forEach(lesson => {
          const duration = lesson.duration || '0m';
          // Handle MM:SS format (e.g., "15:30")
          const timeFormatMatch = duration.match(/(\d+):(\d+)/);
          if (timeFormatMatch) {
            const mins = parseInt(timeFormatMatch[1]);
            const secs = parseInt(timeFormatMatch[2]);
            totalMinutes += mins + (secs / 60);
          } else {
            // Handle "15m" or "1h 30m" format
            const minutesMatch = duration.match(/(\d+)\s*m/);
            const hoursMatch = duration.match(/(\d+)\s*h/);
            if (minutesMatch) totalMinutes += parseInt(minutesMatch[1]);
            if (hoursMatch) totalMinutes += parseInt(hoursMatch[1]) * 60;
          }
        });
        const hours = Math.floor(totalMinutes / 60);
        const mins = Math.round(totalMinutes % 60);
        const duration = hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
        
        // Remove old lessons and duration fields to ensure we use calculated values
        const { lessons: _, duration: __, ...courseData } = course.toObject();
        return {
          ...courseData,
          lessons: lessonsCount,
          duration: duration,
        };
      })
    );
    
    // Get user progress if authenticated
    let coursesWithProgress = coursesWithStats;
    if (req.user) {
      const progressData = await UserProgress.find({ 
        user: req.user._id,
        course: { $in: courses.map(c => c._id) }
      });
      
      coursesWithProgress = coursesWithStats.map(course => {
        const progress = progressData.find(p => p.course.toString() === course._id.toString());
        const lessons = course.lessons || 0;
        const completedLessons = progress ? Math.floor((progress.progress / 100) * lessons) : 0;
        
        return {
          ...course,
          progress: progress ? progress.progress : 0,
          lessonsCompleted: completedLessons,
        };
      });
    }
    
    res.json(coursesWithProgress);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single course
// @route   GET /api/courses/:id
// @access  Public
export const getCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    
    // Get lessons and calculate duration
    const lessons = await Lesson.find({ course: course._id });
    const lessonsCount = lessons.length;
    
    // Calculate total duration from lessons
    let totalMinutes = 0;
    lessons.forEach(lesson => {
      const duration = lesson.duration || '0m';
      // Handle MM:SS format (e.g., "15:30")
      const timeFormatMatch = duration.match(/(\d+):(\d+)/);
      if (timeFormatMatch) {
        const mins = parseInt(timeFormatMatch[1]);
        const secs = parseInt(timeFormatMatch[2]);
        totalMinutes += mins + (secs / 60);
      } else {
        // Handle "15m" or "1h 30m" format
        const minutesMatch = duration.match(/(\d+)\s*m/);
        const hoursMatch = duration.match(/(\d+)\s*h/);
        if (minutesMatch) totalMinutes += parseInt(minutesMatch[1]);
        if (hoursMatch) totalMinutes += parseInt(hoursMatch[1]) * 60;
      }
    });
    const hours = Math.floor(totalMinutes / 60);
    const mins = Math.round(totalMinutes % 60);
    const duration = hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
    
    // Remove old lessons and duration fields
    const { lessons: _, duration: __, ...courseData } = course.toObject();
    
    res.json({
      ...courseData,
      lessons: lessonsCount,
      duration: duration,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create course
// @route   POST /api/courses
// @access  Private/Admin
export const createCourse = async (req, res) => {
  try {
    const course = await Course.create({
      ...req.body,
      createdBy: req.user._id,
    });
    
    res.status(201).json(course);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update course
// @route   PUT /api/courses/:id
// @access  Private/Admin
export const updateCourse = async (req, res) => {
  try {
    const course = await Course.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    
    res.json(course);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete course
// @route   DELETE /api/courses/:id
// @access  Private/Admin
export const deleteCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    
    // Delete associated lessons
    await Lesson.deleteMany({ course: course._id });
    
    await course.deleteOne();
    
    res.json({ message: 'Course deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};




