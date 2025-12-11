import Task from '../models/Task.js';

const defaultTasks = [
  {
    title: "Water a plant",
    description: "Nurture your indoor or outdoor plants",
    xp: 50,
    icon: "🌱",
    proofRequired: true,
    active: true,
  },
  {
    title: "Use reusable bag",
    description: "Bring your own bag when shopping",
    xp: 30,
    icon: "🛍️",
    proofRequired: true,
    active: true,
  },
  {
    title: "Turn off unused lights",
    description: "Save energy by switching off lights",
    xp: 20,
    icon: "💡",
    proofRequired: false,
    active: true,
  },
  {
    title: "Take public transport",
    description: "Reduce emissions by using public transit",
    xp: 75,
    icon: "🚌",
    proofRequired: true,
    active: true,
  },
  {
    title: "Compost food scraps",
    description: "Turn food waste into garden gold",
    xp: 40,
    icon: "🥬",
    proofRequired: true,
    active: true,
  },
  {
    title: "Refill water bottle",
    description: "Avoid single-use plastic bottles",
    xp: 25,
    icon: "🚰",
    proofRequired: false,
    active: true,
  },
];

export const seedTasks = async () => {
  try {
    // Check if tasks already exist
    const existingTasks = await Task.countDocuments();
    
    if (existingTasks === 0) {
      console.log('Seeding daily tasks...');
      await Task.insertMany(defaultTasks);
      console.log('Daily tasks seeded successfully!');
    } else {
      console.log('Tasks already exist in database');
    }
  } catch (error) {
    console.error('Error seeding tasks:', error);
    throw error;
  }
};





