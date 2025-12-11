// utils/seedAdmin.js
import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "../models/User.js";

dotenv.config();

async function seedAdmin() {
  try {
    const MONGO_URI = process.env.MONGODB_URI;
    if (!MONGO_URI) throw new Error("MONGODB_URI is not defined in .env");

    console.log("⏳ Connecting to MongoDB...");
    await mongoose.connect(MONGO_URI);

    const adminEmail = "admin@greenleaf.com";

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: adminEmail });
    if (existingAdmin) {
      console.log("✅ Admin already exists:", adminEmail);
      process.exit(0);
    }

    const admin = new User({
      name: "Admin User",
      email: adminEmail,
      password: "admin123", // default password
      role: "admin",
      level: 10,
      xp: 10000,
      streak: 30,
      totalXp: 10000,
      xpToNextLevel: 12000,
      totalQuizzes: 0,
      quizzesPassed: 0,
      tasksCompleted: 0,
    });

    await admin.save();
    console.log("✅ Admin created successfully!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error creating admin:", error);
    process.exit(1);
  }
}

seedAdmin();
