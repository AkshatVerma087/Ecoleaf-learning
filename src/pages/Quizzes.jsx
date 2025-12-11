import { useState, useEffect } from "react";
import { Link, useLocation, useSearchParams } from "react-router-dom";
import { Clock, HelpCircle, Star, Trophy, CheckCircle } from "lucide-react";
import EcoCard from "@/components/ui/EcoCard";
import { Button } from "@/components/ui/button";
import { quizzesAPI } from "@/services/api";
import { toast } from "sonner";

const difficultyColors = {
  Easy: "bg-green-100 text-green-700",
  Medium: "bg-yellow-100 text-yellow-700",
  Hard: "bg-red-100 text-red-700",
};

const Quizzes = () => {
  const [searchParams] = useSearchParams();
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchFilter, setSearchFilter] = useState(searchParams.get("search") || "");
  const location = useLocation();

  const fetchQuizzes = async () => {
    try {
      setLoading(true);
      const data = await quizzesAPI.getAll();
      setQuizzes(data);
    } catch (error) {
      toast.error(error.message || "Failed to load quizzes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuizzes();
    
    // Listen for refresh event from quiz completion
    const handleRefresh = () => {
      fetchQuizzes();
    };
    
    window.addEventListener('quizzes-refresh', handleRefresh);
    
    return () => {
      window.removeEventListener('quizzes-refresh', handleRefresh);
    };
  }, []);

  // Update search filter from URL params
  useEffect(() => {
    const searchParam = searchParams.get("search");
    if (searchParam) {
      setSearchFilter(searchParam);
    }
  }, [searchParams]);

  const completedQuizzes = quizzes.filter((q) => q.completed && q.score !== null).length;
  const averageScore =
    completedQuizzes > 0
      ? quizzes
          .filter((q) => q.completed && q.score !== null)
          .reduce((sum, q) => sum + (q.score || 0), 0) / completedQuizzes
      : 0;

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Quizzes</h1>
        <p className="mt-2 text-muted-foreground">
          Test your eco-knowledge and earn XP rewards.
        </p>
      </div>

      {/* Stats */}
      <div className="mb-8 grid gap-4 sm:grid-cols-3">
        <EcoCard className="flex items-center gap-4" hover={false}>
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-eco-mint">
            <Trophy className="h-6 w-6 text-yellow-500" />
          </div>
          <div>
            <p className="text-2xl font-bold text-foreground">
              {completedQuizzes}/{quizzes.length}
            </p>
            <p className="text-sm text-muted-foreground">Quizzes Completed</p>
          </div>
        </EcoCard>
        <EcoCard className="flex items-center gap-4" hover={false}>
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-eco-mint">
            <Star className="h-6 w-6 text-primary" />
          </div>
          <div>
            <p className="text-2xl font-bold text-foreground">{Math.round(averageScore)}%</p>
            <p className="text-sm text-muted-foreground">Average Score</p>
          </div>
        </EcoCard>
        <EcoCard className="flex items-center gap-4" hover={false}>
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-eco-mint">
            <HelpCircle className="h-6 w-6 text-blue-500" />
          </div>
          <div>
            <p className="text-2xl font-bold text-foreground">
              {quizzes.reduce((sum, q) => sum + q.questions, 0)}
            </p>
            <p className="text-sm text-muted-foreground">Total Questions</p>
          </div>
        </EcoCard>
      </div>

      {/* Quiz Cards */}
      {loading ? (
        <div className="text-center py-12">Loading quizzes...</div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2">
          {quizzes
            .filter((quiz) => {
              if (!searchFilter) return true;
              return (
                quiz.title?.toLowerCase().includes(searchFilter.toLowerCase()) ||
                quiz.description?.toLowerCase().includes(searchFilter.toLowerCase())
              );
            })
            .map((quiz) => (
            <EcoCard key={quiz._id || quiz.id} className="relative overflow-hidden">
            {quiz.completed && (
              <div className="absolute right-4 top-4 flex items-center gap-2">
                <span className="rounded-full bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
                  Completed
                </span>
                <CheckCircle className="h-5 w-5 text-primary" />
              </div>
            )}
            <div className="mb-4">
              <span
                className={`inline-block rounded-full px-3 py-1 text-xs font-medium ${
                  difficultyColors[quiz.difficulty]
                }`}
              >
                {quiz.difficulty}
              </span>
            </div>
            <h3 className="text-xl font-semibold text-foreground">{quiz.title}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{quiz.description}</p>
            <div className="mt-4 flex items-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <HelpCircle className="h-4 w-4" />
                {quiz.questions} questions
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {quiz.duration}
              </span>
              <span className="flex items-center gap-1">
                <Star className="h-4 w-4" />
                {quiz.xp} XP
              </span>
            </div>
            {quiz.completed && (
              <div className="mt-4 rounded-lg bg-eco-mint/50 p-3">
                <p className="text-sm font-medium text-foreground">
                  Your Score: <span className="text-primary">{quiz.score}%</span>
                </p>
              </div>
            )}
            <div className="mt-4">
              <Link to={`/quizzes/${quiz._id || quiz.id}`}>
                <Button className="w-full" variant={quiz.completed ? "outline" : "default"}>
                  {quiz.completed ? "Retake Quiz" : "Start Quiz"}
                </Button>
              </Link>
            </div>
          </EcoCard>
        ))}
        </div>
      )}
    </div>
  );
};

export default Quizzes;
