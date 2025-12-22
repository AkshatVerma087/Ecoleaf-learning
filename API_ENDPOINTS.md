# API Endpoints Summary

## Discovered API Endpoints

Based on the frontend analysis, here are all the API endpoints that have been created:

### Authentication (`/api/auth`)
- `POST /api/auth/register` - Register new student
- `POST /api/auth/login` - Student login  
- `POST /api/auth/admin/login` - Admin login
- `GET /api/auth/me` - Get current user (protected)

### Dashboard (`/api/dashboard`)
- `GET /api/dashboard/stats` - Get user dashboard stats (protected)

### Courses (`/api/courses`)
- `GET /api/courses` - Get all courses
- `GET /api/courses/:id` - Get single course
- `POST /api/courses` - Create course (admin)
- `PUT /api/courses/:id` - Update course (admin)
- `DELETE /api/courses/:id` - Delete course (admin)

### Lessons (`/api/lessons`)
- `GET /api/lessons/courses/:courseId/lessons` - Get lessons for a course
- `GET /api/lessons/:id` - Get single lesson
- `POST /api/lessons` - Create lesson (admin)
- `PUT /api/lessons/:id` - Update lesson (admin)
- `DELETE /api/lessons/:id` - Delete lesson (admin)
- `POST /api/lessons/:id/complete` - Mark lesson as complete (protected)
- `POST /api/lessons/:id/notes` - Save lesson notes (protected)

### Quizzes (`/api/quizzes`)
- `GET /api/quizzes` - Get all quizzes
- `GET /api/quizzes/:id` - Get single quiz
- `GET /api/quizzes/:id/questions` - Get quiz questions
- `POST /api/quizzes/:id/submit` - Submit quiz answers (protected)
- `POST /api/quizzes` - Create quiz (admin)
- `PUT /api/quizzes/:id` - Update quiz (admin)
- `DELETE /api/quizzes/:id` - Delete quiz (admin)

### Tasks (`/api/tasks`)
- `GET /api/tasks` - Get daily tasks (protected)
- `POST /api/tasks/:id/complete` - Complete a task (protected)
- `POST /api/tasks/:id/upload` - Upload proof for task (protected)

### Carbon Tracker (`/api/carbon`)
- `GET /api/carbon/emissions` - Get carbon emissions data (protected)
- `POST /api/carbon/emissions` - Log daily emissions (protected)
- `GET /api/carbon/score` - Get carbon score (protected)

### Admin (`/api/admin`)
- `GET /api/admin/dashboard` - Get admin dashboard stats (admin)
- `GET /api/admin/students` - Get all students (admin)

## Backend File Structure

```
backend/
├── server.js                 # Main Express server
├── package.json              # Dependencies
├── .env.example             # Environment variables template
├── config/
│   └── db.js                # MongoDB connection
├── middleware/
│   ├── auth.js              # JWT authentication middleware
│   └── errorHandler.js      # Error handling middleware
├── models/
│   ├── User.js              # User model (students & admins)
│   ├── Course.js            # Course model
│   ├── Lesson.js            # Lesson model
│   ├── UserProgress.js      # User progress tracking
│   ├── Quiz.js              # Quiz model
│   ├── Question.js          # Quiz question model
│   ├── QuizResult.js        # Quiz submission results
│   ├── Task.js              # Daily task model
│   ├── TaskCompletion.js    # Task completion tracking
│   └── CarbonEmission.js    # Carbon emission logs
├── controllers/
│   ├── authController.js    # Authentication logic
│   ├── dashboardController.js
│   ├── courseController.js
│   ├── lessonController.js
│   ├── quizController.js
│   ├── taskController.js
│   ├── carbonController.js
│   └── adminController.js
├── routes/
│   ├── authRoutes.js
│   ├── dashboardRoutes.js
│   ├── courseRoutes.js
│   ├── lessonRoutes.js
│   ├── quizRoutes.js
│   ├── taskRoutes.js
│   ├── carbonRoutes.js
│   └── adminRoutes.js
└── utils/
    ├── generateToken.js     # JWT token generation
    ├── calculateXP.js       # XP and level calculations
    └── updateStreak.js      # Streak tracking logic
```

## Frontend API Integration

All frontend pages have been updated to use the API service (`src/services/api.js`):

- ✅ Login.jsx
- ✅ Signup.jsx
- ✅ AdminLogin.jsx
- ✅ Dashboard.jsx
- ✅ Courses.jsx
- ✅ VideoLesson.jsx
- ✅ Quizzes.jsx
- ✅ QuizPlay.jsx
- ✅ DailyTasks.jsx
- ✅ CarbonTracker.jsx
- ✅ AdminDashboard.jsx
- ✅ AdminStudents.jsx
- ✅ AdminLessons.jsx
- ✅ AdminQuizzes.jsx

## Environment Variables

Create a `.env` file in the backend directory:

```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/greenleaf-learning
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRE=7d
NODE_ENV=development
```

## Frontend Environment Variable

Add to your frontend `.env` file:

```
VITE_API_URL=http://localhost:5000/api
```









