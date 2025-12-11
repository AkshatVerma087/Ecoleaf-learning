import { useState, useEffect } from "react";
import { Users, BookOpen, HelpCircle, TrendingUp } from "lucide-react";
import EcoCard from "@/components/ui/EcoCard";
import { adminAPI, coursesAPI } from "@/services/api";
import { toast } from "sonner";

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [dashboardStats, studentsData, coursesData] = await Promise.all([
          adminAPI.getDashboard(),
          adminAPI.getStudents(),
          coursesAPI.getAll(),
        ]);
        setStats(dashboardStats);
        setStudents(studentsData);
        setCourses(coursesData);
      } catch (error) {
        toast.error(error.message || "Failed to load dashboard");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading || !stats) {
    return <div className="animate-fade-in">Loading...</div>;
  }

  const totalStudents = stats.totalStudents;
  const totalCourses = stats.totalCourses;
  const totalQuizzes = stats.totalQuizzes;
  const avgProgress = stats.avgProgress;

  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
        <p className="mt-2 text-muted-foreground">
          Overview of your EcoBoard learning platform.
        </p>
      </div>

      {/* Stats */}
      <div className="mb-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <EcoCard className="flex items-center gap-4" hover={false}>
          <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-blue-100">
            <Users className="h-7 w-7 text-blue-600" />
          </div>
          <div>
            <p className="text-3xl font-bold text-foreground">{totalStudents}</p>
            <p className="text-sm text-muted-foreground">Total Students</p>
          </div>
        </EcoCard>
        <EcoCard className="flex items-center gap-4" hover={false}>
          <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-green-100">
            <BookOpen className="h-7 w-7 text-green-600" />
          </div>
          <div>
            <p className="text-3xl font-bold text-foreground">{totalCourses}</p>
            <p className="text-sm text-muted-foreground">Active Courses</p>
          </div>
        </EcoCard>
        <EcoCard className="flex items-center gap-4" hover={false}>
          <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-purple-100">
            <HelpCircle className="h-7 w-7 text-purple-600" />
          </div>
          <div>
            <p className="text-3xl font-bold text-foreground">{totalQuizzes}</p>
            <p className="text-sm text-muted-foreground">Total Quizzes</p>
          </div>
        </EcoCard>
        <EcoCard className="flex items-center gap-4" hover={false}>
          <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-orange-100">
            <TrendingUp className="h-7 w-7 text-orange-600" />
          </div>
          <div>
            <p className="text-3xl font-bold text-foreground">{avgProgress}%</p>
            <p className="text-sm text-muted-foreground">Avg. Progress</p>
          </div>
        </EcoCard>
      </div>

      {/* Recent Activity */}
      <div className="grid gap-6 lg:grid-cols-2">
        <EcoCard hover={false}>
          <h3 className="mb-4 text-lg font-semibold text-foreground">Top Students</h3>
          <div className="space-y-3">
            {students
              .sort((a, b) => b.xp - a.xp)
              .slice(0, 5)
              .map((student, index) => (
                <div
                  key={student._id || student.id}
                  className="flex items-center justify-between rounded-lg bg-muted/50 p-3"
                >
                  <div className="flex items-center gap-3">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                      {index + 1}
                    </span>
                    <div>
                      <p className="font-medium text-foreground">{student.name}</p>
                      <p className="text-xs text-muted-foreground">Level {student.level}</p>
                    </div>
                  </div>
                  <p className="font-semibold text-primary">{student.xp.toLocaleString()} XP</p>
                </div>
              ))}
          </div>
        </EcoCard>

        <EcoCard hover={false}>
          <h3 className="mb-4 text-lg font-semibold text-foreground">Popular Courses</h3>
          <div className="space-y-3">
            {courses.length > 0 ? (
              courses.slice(0, 5).map((course) => (
                <div
                  key={course._id || course.id}
                  className="flex items-center gap-3 rounded-lg bg-muted/50 p-3"
                >
                  <img
                    src={course.thumbnail}
                    alt={course.title}
                    className="h-12 w-12 rounded-lg object-cover"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium text-foreground">{course.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {course.lessons} lessons • {course.duration}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">No courses available</p>
            )}
          </div>
        </EcoCard>
      </div>
    </div>
  );
};

export default AdminDashboard;
