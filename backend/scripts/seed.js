import dotenv from 'dotenv';
import connectDB from '../config/db.js';
import { seedAllData } from '../utils/seedData.js';

// Load env vars
dotenv.config();

// Run seeding
const runSeed = async () => {
  try {
    console.log('🔌 Connecting to database...');
    await connectDB();
    
    console.log('🌱 Starting database seeding...');
    await seedAllData();
    
    console.log('\n✅ Seeding completed! You can now start your server normally.');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
};

runSeed();







