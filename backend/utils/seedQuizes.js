import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { existsSync } from "fs";
import Quiz from "../models/Quiz.js";
import Question from "../models/Question.js";
import User from "../models/User.js";

// Get the directory name of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Try to load .env from backend directory first, then root
const backendEnvPath = path.resolve(__dirname, "../.env");
const rootEnvPath = path.resolve(__dirname, "../../.env");

if (existsSync(backendEnvPath)) {
  dotenv.config({ path: backendEnvPath });
} else if (existsSync(rootEnvPath)) {
  dotenv.config({ path: rootEnvPath });
} else {
  // Fallback to default behavior
  dotenv.config();
}

// Quiz data with questions
const quizData = [
  {
    title: "Climate Change Basics",
    description: "Test your knowledge on climate fundamentals",
    duration: "15 min",
    difficulty: "Easy",
    xp: 100,
    questions: [
      {
        question: "What is the primary greenhouse gas responsible for climate change?",
        options: ["Oxygen", "Carbon Dioxide", "Nitrogen", "Helium"],
        correct: 1,
      },
      {
        question: "What is the main cause of rising global temperatures?",
        options: ["Solar activity", "Greenhouse gas emissions", "Ocean currents", "Volcanic activity"],
        correct: 1,
      },
      {
        question: "Which sector is the largest contributor to greenhouse gas emissions?",
        options: ["Transportation", "Energy production", "Agriculture", "Industry"],
        correct: 1,
      },
      {
        question: "What does 'carbon footprint' refer to?",
        options: ["The size of carbon atoms", "Total greenhouse gas emissions", "Carbon in the atmosphere", "Carbon in fossil fuels"],
        correct: 1,
      },
      {
        question: "What is the Paris Agreement?",
        options: ["A trade agreement", "An international climate accord", "A carbon tax policy", "A renewable energy standard"],
        correct: 1,
      },
      {
        question: "Which renewable energy source is most widely used?",
        options: ["Solar", "Wind", "Hydroelectric", "Geothermal"],
        correct: 2,
      },
      {
        question: "What is the main goal of climate action?",
        options: ["Eliminate all emissions", "Limit global warming to 1.5°C", "Stop all fossil fuel use", "Plant more trees"],
        correct: 1,
      },
      {
        question: "Which of these is a renewable energy source?",
        options: ["Coal", "Natural gas", "Solar power", "Oil"],
        correct: 2,
      },
      {
        question: "What does 'net zero' emissions mean?",
        options: ["No emissions at all", "Balancing emissions with removals", "Only using renewable energy", "Stopping all industrial activity"],
        correct: 1,
      },
      {
        question: "Which action helps reduce carbon footprint?",
        options: ["Using public transport", "Driving alone daily", "Flying frequently", "Using plastic bags"],
        correct: 0,
      },
    ],
  },
  {
    title: "Renewable Energy Quiz",
    description: "How much do you know about clean energy?",
    duration: "20 min",
    difficulty: "Medium",
    xp: 150,
    questions: [
      {
        question: "What percentage of global energy comes from renewable sources?",
        options: ["About 10%", "About 30%", "About 50%", "About 70%"],
        correct: 1,
      },
      {
        question: "Which country leads in solar energy production?",
        options: ["United States", "China", "Germany", "Japan"],
        correct: 1,
      },
      {
        question: "What is the main advantage of wind energy?",
        options: ["Low cost", "No emissions", "Unlimited supply", "All of the above"],
        correct: 3,
      },
      {
        question: "How does solar photovoltaic (PV) work?",
        options: ["Heats water", "Converts sunlight to electricity", "Generates wind", "Creates steam"],
        correct: 1,
      },
      {
        question: "What is geothermal energy?",
        options: ["Energy from the sun", "Energy from the Earth's heat", "Energy from wind", "Energy from water"],
        correct: 1,
      },
      {
        question: "Which renewable source provides the most consistent power?",
        options: ["Solar", "Wind", "Hydroelectric", "Tidal"],
        correct: 2,
      },
      {
        question: "What is a major challenge for renewable energy?",
        options: ["High cost", "Intermittency", "Limited resources", "Environmental impact"],
        correct: 1,
      },
      {
        question: "What does 'smart grid' refer to?",
        options: ["A new power plant", "An intelligent electricity network", "A type of battery", "A solar panel system"],
        correct: 1,
      },
      {
        question: "Which energy storage technology is most commonly used?",
        options: ["Batteries", "Pumped hydro", "Compressed air", "Flywheels"],
        correct: 1,
      },
      {
        question: "What is the capacity factor of renewable energy?",
        options: ["Total installed capacity", "Actual output vs maximum potential", "Cost per unit", "Environmental impact"],
        correct: 1,
      },
      {
        question: "Which renewable energy has the lowest environmental impact?",
        options: ["Solar", "Wind", "Hydroelectric", "Biomass"],
        correct: 1,
      },
      {
        question: "What is offshore wind energy?",
        options: ["Wind farms on land", "Wind farms in the ocean", "Wind energy storage", "Wind energy conversion"],
        correct: 1,
      },
      {
        question: "How long do solar panels typically last?",
        options: ["5-10 years", "15-20 years", "25-30 years", "40-50 years"],
        correct: 2,
      },
      {
        question: "What is the main component of a wind turbine?",
        options: ["Solar cells", "Blades and generator", "Batteries", "Steam turbines"],
        correct: 1,
      },
      {
        question: "Which factor most affects solar panel efficiency?",
        options: ["Color", "Size", "Sunlight intensity", "Temperature"],
        correct: 2,
      },
    ],
  },
  {
    title: "Ocean Conservation",
    description: "Dive deep into marine ecosystem knowledge",
    duration: "18 min",
    difficulty: "Medium",
    xp: 125,
    questions: [
      {
        question: "What percentage of Earth's surface is covered by oceans?",
        options: ["50%", "60%", "70%", "80%"],
        correct: 2,
      },
      {
        question: "What is the main threat to coral reefs?",
        options: ["Overfishing", "Ocean acidification", "Pollution", "All of the above"],
        correct: 3,
      },
      {
        question: "What is ocean acidification?",
        options: ["Increase in ocean pH", "Decrease in ocean pH", "Increase in salinity", "Decrease in temperature"],
        correct: 1,
      },
      {
        question: "Which marine animal is most affected by plastic pollution?",
        options: ["Sharks", "Sea turtles", "Whales", "All marine life"],
        correct: 3,
      },
      {
        question: "What is a marine protected area?",
        options: ["A fishing zone", "A conservation area", "A shipping route", "A research station"],
        correct: 1,
      },
      {
        question: "How much of the ocean is currently protected?",
        options: ["Less than 5%", "About 10%", "About 20%", "More than 30%"],
        correct: 1,
      },
      {
        question: "What is the Great Pacific Garbage Patch?",
        options: ["A natural ocean feature", "A large area of marine debris", "A coral reef", "A fishing ground"],
        correct: 1,
      },
      {
        question: "Which action helps protect oceans?",
        options: ["Using single-use plastics", "Reducing carbon emissions", "Overfishing", "Dumping waste"],
        correct: 1,
      },
      {
        question: "What is sustainable fishing?",
        options: ["Catching as many fish as possible", "Fishing that maintains fish populations", "Fishing only large fish", "Fishing in protected areas"],
        correct: 1,
      },
      {
        question: "What role do mangroves play in ocean health?",
        options: ["They provide fish habitat", "They protect coastlines", "They filter pollutants", "All of the above"],
        correct: 3,
      },
      {
        question: "What is bycatch?",
        options: ["Target fish species", "Unintended catch of non-target species", "Fishing equipment", "Marine pollution"],
        correct: 1,
      },
      {
        question: "How does climate change affect oceans?",
        options: ["Rising sea levels", "Warmer temperatures", "Ocean acidification", "All of the above"],
        correct: 3,
      },
    ],
  },
  {
    title: "Sustainable Living Master",
    description: "Advanced quiz on eco-friendly practices",
    duration: "25 min",
    difficulty: "Hard",
    xp: 200,
    questions: [
      {
        question: "What is the 'circular economy' concept?",
        options: ["Linear production model", "Waste elimination through design", "Increased consumption", "Single-use products"],
        correct: 1,
      },
      {
        question: "Which has the highest carbon footprint?",
        options: ["Beef", "Chicken", "Tofu", "Lentils"],
        correct: 0,
      },
      {
        question: "What is 'carbon offsetting'?",
        options: ["Reducing emissions", "Compensating emissions with reductions elsewhere", "Ignoring emissions", "Increasing emissions"],
        correct: 1,
      },
      {
        question: "Which transportation method has the lowest carbon footprint?",
        options: ["Car (solo)", "Bus", "Train", "Bicycle"],
        correct: 3,
      },
      {
        question: "What is 'greenwashing'?",
        options: ["Eco-friendly cleaning", "Misleading environmental claims", "Sustainable practices", "Renewable energy"],
        correct: 1,
      },
      {
        question: "Which material takes longest to decompose?",
        options: ["Paper", "Plastic", "Food waste", "Cotton"],
        correct: 1,
      },
      {
        question: "What is 'zero waste' lifestyle?",
        options: ["No trash production", "Minimizing waste sent to landfills", "Recycling everything", "Composting only"],
        correct: 1,
      },
      {
        question: "Which energy source is most efficient for homes?",
        options: ["Natural gas", "Electric heat pump", "Oil heating", "Coal"],
        correct: 1,
      },
      {
        question: "What is 'embodied carbon'?",
        options: ["Carbon in products", "Carbon emissions from manufacturing", "Carbon in atmosphere", "Carbon in soil"],
        correct: 1,
      },
      {
        question: "Which practice reduces water footprint?",
        options: ["Long showers", "Eating less meat", "Washing dishes by hand", "Watering lawn daily"],
        correct: 1,
      },
      {
        question: "What is 'sustainable fashion'?",
        options: ["Expensive clothing", "Eco-friendly and ethical clothing", "Fast fashion", "Designer brands"],
        correct: 1,
      },
      {
        question: "Which food has the lowest water footprint?",
        options: ["Beef", "Chicken", "Vegetables", "Rice"],
        correct: 2,
      },
      {
        question: "What is 'passive house' design?",
        options: ["House with no windows", "Energy-efficient building standard", "Underground house", "Tiny house"],
        correct: 1,
      },
      {
        question: "Which action has the biggest impact on reducing carbon footprint?",
        options: ["Recycling", "Using LED bulbs", "Eating plant-based diet", "Turning off lights"],
        correct: 2,
      },
      {
        question: "What is 'life cycle assessment'?",
        options: ["Product testing", "Environmental impact evaluation", "Quality control", "Market research"],
        correct: 1,
      },
      {
        question: "Which is a sustainable packaging material?",
        options: ["Single-use plastic", "Biodegradable materials", "Styrofoam", "PVC"],
        correct: 1,
      },
      {
        question: "What is 'carbon neutral'?",
        options: ["No carbon emissions", "Net zero carbon emissions", "Low carbon emissions", "Offset carbon emissions"],
        correct: 1,
      },
      {
        question: "Which practice is most sustainable for food?",
        options: ["Buying imported food", "Eating local and seasonal", "Processed foods", "Fast food"],
        correct: 1,
      },
      {
        question: "What is 'regenerative agriculture'?",
        options: ["Traditional farming", "Farming that improves soil health", "Organic farming only", "Hydroponic farming"],
        correct: 1,
      },
      {
        question: "Which has the lowest environmental impact?",
        options: ["New products", "Reused products", "Recycled products", "Disposable products"],
        correct: 1,
      },
    ],
  },
];

async function seedQuizzes() {
  try {
    const MONGO_URI = process.env.MONGODB_URI;
    if (!MONGO_URI) throw new Error("MONGODB_URI is not defined in .env");

    console.log("⏳ Connecting to MongoDB...");
    await mongoose.connect(MONGO_URI);

    console.log("🔥 Clearing old quiz data...");
    await Quiz.deleteMany({});
    await Question.deleteMany({});

    console.log("🌱 Inserting new quizzes with questions...");
    
    for (const quizInfo of quizData) {
      const { questions, ...quizFields } = quizInfo;
      
      // Create quiz
      const quiz = await Quiz.create(quizFields);
      console.log(`  ✓ Created quiz: ${quiz.title}`);
      
      // Create questions for this quiz
      if (questions && questions.length > 0) {
        const questionPromises = questions.map((q, index) =>
          Question.create({
            quiz: quiz._id,
            question: q.question,
            options: q.options,
            correct: q.correct,
            order: index + 1,
          })
        );
        await Promise.all(questionPromises);
        console.log(`  ✓ Added ${questions.length} questions to ${quiz.title}`);
      }
    }

    // Update totalQuizzes for all users
    const quizCount = await Quiz.countDocuments();
    await User.updateMany({}, { totalQuizzes: quizCount });
    console.log(`  ✓ Updated totalQuizzes for all users to ${quizCount}`);

    console.log("✅ Quizzes seeded successfully!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding quizzes:", error);
    process.exit(1);
  }
}

seedQuizzes();
