// Mock user data
export const userData = {
  id: 1,
  name: "Alex Green",
  email: "alex@ecolearn.com",
  avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex",
  level: 7,
  xp: 2150,
  xpToNextLevel: 3000,
  streak: 14,
  totalXp: 4820,
  tasksCompleted: 18,
  quizzesPassed: 9,
  totalQuizzes: 10,
  carbonScore: "A-",
};

// Mock courses
export const courses = [
  {
    id: 1,
    title: "Climate Change Fundamentals",
    description: "Learn about the science behind climate change and its global impact.",
    thumbnail: "https://images.unsplash.com/photo-1569163139599-0f4517e36f51?w=400",
    progress: 75,
    lessons: 12,
    duration: "4h 30m",
    category: "Climate",
  },
  {
    id: 2,
    title: "Sustainable Living 101",
    description: "Practical tips for reducing your environmental footprint daily.",
    thumbnail: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=400",
    progress: 45,
    lessons: 8,
    duration: "3h 15m",
    category: "Lifestyle",
  },
  {
    id: 3,
    title: "Renewable Energy Sources",
    description: "Explore solar, wind, and other clean energy technologies.",
    thumbnail: "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=400",
    progress: 20,
    lessons: 10,
    duration: "5h 00m",
    category: "Energy",
  },
  {
    id: 4,
    title: "Ocean Conservation",
    description: "Understanding marine ecosystems and how to protect them.",
    thumbnail: "https://images.unsplash.com/photo-1583212292454-1fe6229603b7?w=400",
    progress: 0,
    lessons: 6,
    duration: "2h 45m",
    category: "Wildlife",
  },
  {
    id: 5,
    title: "Zero Waste Lifestyle",
    description: "Master the art of reducing, reusing, and recycling.",
    thumbnail: "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=400",
    progress: 90,
    lessons: 7,
    duration: "2h 30m",
    category: "Lifestyle",
  },
  {
    id: 6,
    title: "Urban Gardening",
    description: "Grow your own food in small spaces and urban environments.",
    thumbnail: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400",
    progress: 60,
    lessons: 9,
    duration: "3h 45m",
    category: "Gardening",
  },
];

// Mock lessons for a course
export const lessons = [
  { id: 1, title: "Introduction to Climate Science", duration: "15:30", completed: true },
  { id: 2, title: "The Greenhouse Effect", duration: "22:15", completed: true },
  { id: 3, title: "Global Temperature Trends", duration: "18:45", completed: true },
  { id: 4, title: "Ice Caps and Sea Levels", duration: "25:00", completed: false },
  { id: 5, title: "Extreme Weather Events", duration: "20:30", completed: false },
  { id: 6, title: "Carbon Footprint Basics", duration: "17:00", completed: false },
];

// Mock daily tasks
export const dailyTasks = [
  {
    id: 1,
    title: "Water a plant",
    description: "Nurture your indoor or outdoor plants",
    xp: 50,
    icon: "🌱",
    completed: false,
    proofRequired: true,
  },
  {
    id: 2,
    title: "Use reusable bag",
    description: "Bring your own bag when shopping",
    xp: 30,
    icon: "🛍️",
    completed: true,
    proofRequired: true,
  },
  {
    id: 3,
    title: "Turn off unused lights",
    description: "Save energy by switching off lights",
    xp: 20,
    icon: "💡",
    completed: true,
    proofRequired: false,
  },
  {
    id: 4,
    title: "Take public transport",
    description: "Reduce emissions by using public transit",
    xp: 75,
    icon: "🚌",
    completed: false,
    proofRequired: true,
  },
  {
    id: 5,
    title: "Compost food scraps",
    description: "Turn food waste into garden gold",
    xp: 40,
    icon: "🥬",
    completed: false,
    proofRequired: true,
  },
  {
    id: 6,
    title: "Refill water bottle",
    description: "Avoid single-use plastic bottles",
    xp: 25,
    icon: "🚰",
    completed: true,
    proofRequired: false,
  },
];

// Mock quizzes
export const quizzes = [
  {
    id: 1,
    title: "Climate Change Basics",
    description: "Test your knowledge on climate fundamentals",
    questions: 10,
    duration: "15 min",
    difficulty: "Easy",
    xp: 100,
    completed: true,
    score: 90,
  },
  {
    id: 2,
    title: "Renewable Energy Quiz",
    description: "How much do you know about clean energy?",
    questions: 15,
    duration: "20 min",
    difficulty: "Medium",
    xp: 150,
    completed: true,
    score: 85,
  },
  {
    id: 3,
    title: "Ocean Conservation",
    description: "Dive deep into marine ecosystem knowledge",
    questions: 12,
    duration: "18 min",
    difficulty: "Medium",
    xp: 125,
    completed: false,
    score: null,
  },
  {
    id: 4,
    title: "Sustainable Living Master",
    description: "Advanced quiz on eco-friendly practices",
    questions: 20,
    duration: "25 min",
    difficulty: "Hard",
    xp: 200,
    completed: false,
    score: null,
  },
];

// Mock quiz questions
export const quizQuestions = [
  {
    id: 1,
    question: "What is the main greenhouse gas responsible for global warming?",
    options: ["Oxygen", "Carbon Dioxide", "Nitrogen", "Hydrogen"],
    correct: 1,
  },
  {
    id: 2,
    question: "Which renewable energy source is most widely used globally?",
    options: ["Solar", "Wind", "Hydropower", "Geothermal"],
    correct: 2,
  },
  {
    id: 3,
    question: "What percentage of Earth's water is freshwater?",
    options: ["3%", "10%", "25%", "50%"],
    correct: 0,
  },
  {
    id: 4,
    question: "Which activity produces the most carbon emissions per person?",
    options: ["Flying", "Driving", "Eating meat", "Heating homes"],
    correct: 0,
  },
  {
    id: 5,
    question: "How long does a plastic bottle take to decompose?",
    options: ["10 years", "50 years", "200 years", "450 years"],
    correct: 3,
  },
];

// Mock carbon emissions data
export const carbonData = [
  { date: "Mon", emissions: 12.5 },
  { date: "Tue", emissions: 10.2 },
  { date: "Wed", emissions: 8.8 },
  { date: "Thu", emissions: 11.3 },
  { date: "Fri", emissions: 9.5 },
  { date: "Sat", emissions: 7.2 },
  { date: "Sun", emissions: 6.8 },
];

// Mock students for admin
export const students = [
  { id: 1, name: "Alex Green", email: "alex@eco.com", level: 7, xp: 4820, streak: 14, progress: 72 },
  { id: 2, name: "Jordan Rivers", email: "jordan@eco.com", level: 5, xp: 3200, streak: 8, progress: 55 },
  { id: 3, name: "Sam Forest", email: "sam@eco.com", level: 9, xp: 6100, streak: 21, progress: 88 },
  { id: 4, name: "Taylor Woods", email: "taylor@eco.com", level: 3, xp: 1500, streak: 5, progress: 30 },
  { id: 5, name: "Casey Meadow", email: "casey@eco.com", level: 6, xp: 3800, streak: 12, progress: 65 },
];
