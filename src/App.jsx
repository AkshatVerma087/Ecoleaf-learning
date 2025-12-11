import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import AdminLayout from "./layouts/AdminLayout";
import Dashboard from "./pages/Dashboard";
import Courses from "./pages/Courses";
import VideoLesson from "./pages/VideoLesson";
import DailyTasks from "./pages/DailyTasks";
import Quizzes from "./pages/Quizzes";
import QuizPlay from "./pages/QuizPlay";
import CarbonTracker from "./pages/CarbonTracker";
import Profile from "./pages/Profile";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import AdminLessons from "./pages/AdminLessons";
import AdminQuizzes from "./pages/AdminQuizzes";
import AdminStudents from "./pages/AdminStudents";
import About from "./pages/About";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Redirect root to login if not authenticated */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          
          {/* Auth Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          
          {/* Main App Routes - Protected */}
          <Route element={<MainLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/courses" element={<Courses />} />
            <Route path="/courses/:courseId/lesson/:lessonId" element={<VideoLesson />} />
            <Route path="/tasks" element={<DailyTasks />} />
            <Route path="/quizzes" element={<Quizzes />} />
            <Route path="/quizzes/:quizId" element={<QuizPlay />} />
            <Route path="/carbon" element={<CarbonTracker />} />
            <Route path="/about" element={<About />} />
          </Route>
          
          {/* Admin Routes */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="lessons" element={<AdminLessons />} />
            <Route path="quizzes" element={<AdminQuizzes />} />
            <Route path="students" element={<AdminStudents />} />
          </Route>
          
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
