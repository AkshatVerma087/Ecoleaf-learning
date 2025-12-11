# Database Seeding Guide

## How to Seed Database

The seeding is now **separate** from the server startup. You run it manually when needed.

### Step 1: Seed the Database (One Time)

Run the seed script in your terminal:

```bash
cd backend
npm run seed
```

Or directly:
```bash
node scripts/seed.js
```

This will:
- ✅ Connect to MongoDB
- ✅ Create all collections
- ✅ Seed all initial data (user, courses, quizzes, tasks, etc.)
- ✅ Exit when done

### Step 2: Start Your Server Normally

After seeding, start your server as usual:

```bash
npm run dev
```

The server will **NOT** seed automatically - it just runs normally.

## What Gets Seeded

- **Main User**: alex@ecolearn.com / password123
- **6 Courses** with progress
- **6 Lessons** for first course (3 completed)
- **4 Quizzes** with questions (2 completed)
- **6 Daily Tasks**
- **7 Days** of carbon emission data
- **4 Additional Students** for admin view
- **Admin User**: admin@ecoboard.com / password123

## When to Re-seed

Only run the seed script when you want to:
- Start fresh with initial data
- Reset your database
- Test the app from scratch

**Note**: Re-seeding will fail if users already exist (to prevent duplicates). To re-seed:
1. Delete your database in MongoDB Compass
2. Run `npm run seed` again

## Login Credentials

After seeding, you can login with:
- **Student**: alex@ecolearn.com / password123
- **Admin**: admin@ecoboard.com / password123
