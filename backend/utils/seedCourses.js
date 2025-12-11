// utils/seedCourses.js
import mongoose from "mongoose";
import dotenv from "dotenv";
import Course from "../models/Course.js"; // Make sure this path is correct

// Load environment variables
dotenv.config();

// Course data to seed
const courses = [
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

async function seed() {
  try {
    console.log("⏳ Connecting to MongoDB...");

    // Use the correct env variable
    const MONGO_URI = process.env.MONGODB_URI;
    if (!MONGO_URI) throw new Error("MONGODB_URI is not defined in .env");

    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("🔥 Clearing old course data...");
    await Course.deleteMany({});

    console.log("🌱 Inserting new course data...");
    await Course.insertMany(courses);

    console.log("✅ Course data seeded successfully!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding data:", error);
    process.exit(1);
  }
}

// Run the seed function
seed();
