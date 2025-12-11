import User from '../models/User.js';
import Course from '../models/Course.js';
import Lesson from '../models/Lesson.js';
import Quiz from '../models/Quiz.js';
import Question from '../models/Question.js';
import Task from '../models/Task.js';
import TaskCompletion from '../models/TaskCompletion.js';
import CarbonEmission from '../models/CarbonEmission.js';
import UserProgress from '../models/UserProgress.js';
import QuizResult from '../models/QuizResult.js';
import bcrypt from 'bcryptjs';

// Seed all initial data
export const seedAllData = async () => {
  try {
    // Check if data already exists - only seed once
    const userCount = await User.countDocuments();
    if (userCount > 0) {
      console.log('✅ Database already has data. Skipping seed (to re-seed, delete database first).');
      return;
    }

    console.log('🌱 Starting database seeding (first time only)...');

    // 1. Create main user (Alex Green)
    console.log('Creating user...');
    const hashedPassword = await bcrypt.hash('password123', 10);
    const alexUser = await User.create({
      name: 'Alex Green',
      email: 'alex@ecolearn.com',
      password: hashedPassword,
      role: 'student',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex',
      level: 7,
      xp: 2150,
      xpToNextLevel: 3000,
      totalXp: 4820,
      streak: 14,
      lastActivityDate: new Date(),
      tasksCompleted: 18,
      quizzesPassed: 9,
      totalQuizzes: 10,
      carbonScore: 'A-',
    });

    // 2. Create courses
    console.log('Creating courses...');
    const coursesData = [
      {
        title: 'Climate Change Fundamentals',
        description: 'Learn about the science behind climate change and its global impact.',
        thumbnail: 'https://images.unsplash.com/photo-1569163139599-0f4517e36f51?w=400',
        category: 'Climate',
        lessons: 12,
        duration: '4h 30m',
        createdBy: alexUser._id,
      },
      {
        title: 'Sustainable Living 101',
        description: 'Practical tips for reducing your environmental footprint daily.',
        thumbnail: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=400',
        category: 'Lifestyle',
        lessons: 8,
        duration: '3h 15m',
        createdBy: alexUser._id,
      },
      {
        title: 'Renewable Energy Sources',
        description: 'Explore solar, wind, and other clean energy technologies.',
        thumbnail: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=400',
        category: 'Energy',
        lessons: 10,
        duration: '5h 00m',
        createdBy: alexUser._id,
      },
      {
        title: 'Ocean Conservation',
        description: 'Understanding marine ecosystems and how to protect them.',
        thumbnail: 'https://images.unsplash.com/photo-1583212292454-1fe6229603b7?w=400',
        category: 'Wildlife',
        lessons: 6,
        duration: '2h 45m',
        createdBy: alexUser._id,
      },
      {
        title: 'Zero Waste Lifestyle',
        description: 'Master the art of reducing, reusing, and recycling.',
        thumbnail: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=400',
        category: 'Lifestyle',
        lessons: 7,
        duration: '2h 30m',
        createdBy: alexUser._id,
      },
      {
        title: 'Urban Gardening',
        description: 'Grow your own food in small spaces and urban environments.',
        thumbnail: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400',
        category: 'Gardening',
        lessons: 9,
        duration: '3h 45m',
        createdBy: alexUser._id,
      },
    ];

    const courses = await Course.insertMany(coursesData);

    // 3. Create lessons for first course (Climate Change Fundamentals)
    console.log('Creating lessons...');
    const climateCourse = courses[0];
    const lessonsData = [
      {
        title: 'Introduction to Climate Science',
        course: climateCourse._id,
        duration: '15:30',
        order: 1,
        videoUrl: '',
        createdBy: alexUser._id,
      },
      {
        title: 'The Greenhouse Effect',
        course: climateCourse._id,
        duration: '22:15',
        order: 2,
        videoUrl: '',
        createdBy: alexUser._id,
      },
      {
        title: 'Global Temperature Trends',
        course: climateCourse._id,
        duration: '18:45',
        order: 3,
        videoUrl: '',
        createdBy: alexUser._id,
      },
      {
        title: 'Ice Caps and Sea Levels',
        course: climateCourse._id,
        duration: '25:00',
        order: 4,
        videoUrl: '',
        createdBy: alexUser._id,
      },
      {
        title: 'Extreme Weather Events',
        course: climateCourse._id,
        duration: '20:30',
        order: 5,
        videoUrl: '',
        createdBy: alexUser._id,
      },
      {
        title: 'Carbon Footprint Basics',
        course: climateCourse._id,
        duration: '17:00',
        order: 6,
        videoUrl: '',
        createdBy: alexUser._id,
      },
    ];

    const lessons = await Lesson.insertMany(lessonsData);

    // 4. Mark first 3 lessons as completed
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    for (let i = 0; i < 3; i++) {
      await UserProgress.create({
        user: alexUser._id,
        course: climateCourse._id,
        lesson: lessons[i]._id,
        completed: true,
        progress: 100,
      });
    }

    // Set course progress for all courses
    const courseProgress = [75, 45, 20, 0, 90, 60]; // Progress percentages for each course
    for (let i = 0; i < courses.length; i++) {
      await UserProgress.create({
        user: alexUser._id,
        course: courses[i]._id,
        progress: courseProgress[i],
      });
    }

    // 5. Create quizzes
    console.log('Creating quizzes...');
    const quizzesData = [
      {
        title: 'Climate Change Basics',
        description: 'Test your knowledge on climate fundamentals',
        difficulty: 'Easy',
        xp: 100,
        duration: '15 min',
        createdBy: alexUser._id,
      },
      {
        title: 'Renewable Energy Quiz',
        description: 'How much do you know about clean energy?',
        difficulty: 'Medium',
        xp: 150,
        duration: '20 min',
        createdBy: alexUser._id,
      },
      {
        title: 'Ocean Conservation',
        description: 'Dive deep into marine ecosystem knowledge',
        difficulty: 'Medium',
        xp: 125,
        duration: '18 min',
        createdBy: alexUser._id,
      },
      {
        title: 'Sustainable Living Master',
        description: 'Advanced quiz on eco-friendly practices',
        difficulty: 'Hard',
        xp: 200,
        duration: '25 min',
        createdBy: alexUser._id,
      },
    ];

    const quizzes = await Quiz.insertMany(quizzesData);

    // 6. Create quiz questions
    console.log('Creating quiz questions...');
    const quiz1Questions = [
      {
        quiz: quizzes[0]._id,
        question: 'What is the main greenhouse gas responsible for global warming?',
        options: ['Oxygen', 'Carbon Dioxide', 'Nitrogen', 'Hydrogen'],
        correct: 1,
        order: 1,
      },
      {
        quiz: quizzes[0]._id,
        question: 'Which renewable energy source is most widely used globally?',
        options: ['Solar', 'Wind', 'Hydropower', 'Geothermal'],
        correct: 2,
        order: 2,
      },
      {
        quiz: quizzes[0]._id,
        question: 'What percentage of Earth\'s water is freshwater?',
        options: ['3%', '10%', '25%', '50%'],
        correct: 0,
        order: 3,
      },
      {
        quiz: quizzes[0]._id,
        question: 'Which activity produces the most carbon emissions per person?',
        options: ['Flying', 'Driving', 'Eating meat', 'Heating homes'],
        correct: 0,
        order: 4,
      },
      {
        quiz: quizzes[0]._id,
        question: 'How long does a plastic bottle take to decompose?',
        options: ['10 years', '50 years', '200 years', '450 years'],
        correct: 3,
        order: 5,
      },
    ];

    // Add more questions to make it 10 total for first quiz
    for (let i = 5; i < 10; i++) {
      quiz1Questions.push({
        quiz: quizzes[0]._id,
        question: `Climate Question ${i + 1}`,
        options: ['Option A', 'Option B', 'Option C', 'Option D'],
        correct: Math.floor(Math.random() * 4),
        order: i + 1,
      });
    }

    await Question.insertMany(quiz1Questions);

    // Add questions for other quizzes (simplified)
    for (let quizIndex = 1; quizIndex < quizzes.length; quizIndex++) {
      const questionCount = quizIndex === 1 ? 15 : quizIndex === 2 ? 12 : 20;
      const questions = [];
      for (let i = 0; i < questionCount; i++) {
        questions.push({
          quiz: quizzes[quizIndex]._id,
          question: `Question ${i + 1} for ${quizzes[quizIndex].title}`,
          options: ['Option A', 'Option B', 'Option C', 'Option D'],
          correct: Math.floor(Math.random() * 4),
          order: i + 1,
        });
      }
      await Question.insertMany(questions);
    }

    // 7. Create quiz results (completed quizzes)
    console.log('Creating quiz results...');
    await QuizResult.create({
      user: alexUser._id,
      quiz: quizzes[0]._id,
      answers: [1, 2, 0, 0, 3, 0, 1, 2, 3, 1],
      score: 90,
      xpEarned: 90,
      completed: true,
    });

    await QuizResult.create({
      user: alexUser._id,
      quiz: quizzes[1]._id,
      answers: Array(15).fill(0).map(() => Math.floor(Math.random() * 4)),
      score: 85,
      xpEarned: 127,
      completed: true,
    });

    // 8. Create tasks (already done by seedTasks, but ensure they exist)
    console.log('Ensuring tasks exist...');
    const taskCount = await Task.countDocuments();
    if (taskCount === 0) {
      const tasksData = [
        { title: 'Water a plant', description: 'Nurture your indoor or outdoor plants', xp: 50, icon: '🌱', proofRequired: true, active: true },
        { title: 'Use reusable bag', description: 'Bring your own bag when shopping', xp: 30, icon: '🛍️', proofRequired: true, active: true },
        { title: 'Turn off unused lights', description: 'Save energy by switching off lights', xp: 20, icon: '💡', proofRequired: false, active: true },
        { title: 'Take public transport', description: 'Reduce emissions by using public transit', xp: 75, icon: '🚌', proofRequired: true, active: true },
        { title: 'Compost food scraps', description: 'Turn food waste into garden gold', xp: 40, icon: '🥬', proofRequired: true, active: true },
        { title: 'Refill water bottle', description: 'Avoid single-use plastic bottles', xp: 25, icon: '🚰', proofRequired: false, active: true },
      ];
      await Task.insertMany(tasksData);
    }

    // 9. Create task completions for today
    console.log('Creating task completions...');
    const tasks = await Task.find().sort({ createdAt: 1 });
    // Tasks 2, 3, and 6 are completed (indices 1, 2, 5 in 0-based)
    const completedTaskIndices = [1, 2, 5];
    
    for (const taskIndex of completedTaskIndices) {
      if (tasks[taskIndex]) {
        await TaskCompletion.create({
          user: alexUser._id,
          task: tasks[taskIndex]._id,
          completed: true,
          completedAt: new Date(),
          date: today,
        });
      }
    }

    // 10. Create carbon emissions data (last 7 days)
    console.log('Creating carbon emissions data...');
    const carbonData = [
      { date: 'Mon', emissions: 12.5 },
      { date: 'Tue', emissions: 10.2 },
      { date: 'Wed', emissions: 8.8 },
      { date: 'Thu', emissions: 11.3 },
      { date: 'Fri', emissions: 9.5 },
      { date: 'Sat', emissions: 7.2 },
      { date: 'Sun', emissions: 6.8 },
    ];

    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);
      
      const dayName = dayNames[date.getDay()];
      const emissionData = carbonData.find(d => d.date === dayName) || carbonData[i];
      
      await CarbonEmission.create({
        user: alexUser._id,
        transport: emissionData.emissions * 0.3,
        food: emissionData.emissions * 0.25,
        energy: emissionData.emissions * 0.25,
        shopping: emissionData.emissions * 0.2,
        total: emissionData.emissions,
        date: date,
      });
    }

    // 11. Create additional students for admin view
    console.log('Creating additional students...');
    const studentsData = [
      {
        name: 'Jordan Rivers',
        email: 'jordan@eco.com',
        password: hashedPassword,
        role: 'student',
        level: 5,
        totalXp: 3200,
        streak: 8,
        tasksCompleted: 12,
        quizzesPassed: 6,
        totalQuizzes: 10,
        carbonScore: 'B',
      },
      {
        name: 'Sam Forest',
        email: 'sam@eco.com',
        password: hashedPassword,
        role: 'student',
        level: 9,
        totalXp: 6100,
        streak: 21,
        tasksCompleted: 25,
        quizzesPassed: 12,
        totalQuizzes: 10,
        carbonScore: 'A',
      },
      {
        name: 'Taylor Woods',
        email: 'taylor@eco.com',
        password: hashedPassword,
        role: 'student',
        level: 3,
        totalXp: 1500,
        streak: 5,
        tasksCompleted: 8,
        quizzesPassed: 4,
        totalQuizzes: 10,
        carbonScore: 'C',
      },
      {
        name: 'Casey Meadow',
        email: 'casey@eco.com',
        password: hashedPassword,
        role: 'student',
        level: 6,
        totalXp: 3800,
        streak: 12,
        tasksCompleted: 15,
        quizzesPassed: 7,
        totalQuizzes: 10,
        carbonScore: 'B',
      },
    ];

    await User.insertMany(studentsData);

    // 12. Create admin user
    console.log('Creating admin user...');
    await User.create({
      name: 'Admin User',
      email: 'admin@ecoboard.com',
      password: hashedPassword,
      role: 'admin',
    });

    console.log('✅ Database seeding completed successfully!');
    console.log('📧 Login credentials:');
    console.log('   Student: alex@ecolearn.com / password123');
    console.log('   Admin: admin@ecoboard.com / password123');
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  }
};

