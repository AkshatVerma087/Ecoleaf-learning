import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { CheckCircle, ArrowRight, Trophy, RotateCcw } from "lucide-react";
import EcoCard from "@/components/ui/EcoCard";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { quizzesAPI } from "@/services/api";
import { toast } from "sonner";

const QuizPlay = () => {
  const { quizId } = useParams();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [answers, setAnswers] = useState([]);
  const [quizComplete, setQuizComplete] = useState(false);
  const [finalScore, setFinalScore] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const [quizData, questionsData] = await Promise.all([
          quizzesAPI.getById(quizId),
          quizzesAPI.getQuestions(quizId),
        ]);
        setQuiz(quizData);
        setQuestions(questionsData);
      } catch (error) {
        toast.error(error.message || "Failed to load quiz");
      } finally {
        setLoading(false);
      }
    };
    fetchQuiz();
  }, [quizId]);

  const question = questions[currentQuestion];

  const handleAnswer = (index) => {
    if (showResult) return;
    setSelectedAnswer(index);
    setShowResult(true);
    setAnswers([...answers, index]);
  };

  const handleNext = async () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    } else {
      // Submit quiz
      try {
        const result = await quizzesAPI.submit(quizId, answers);
        setFinalScore(result);
        setQuizComplete(true);
      } catch (error) {
        toast.error(error.message || "Failed to submit quiz");
      }
    }
  };

  const handleRestart = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setAnswers([]);
    setQuizComplete(false);
  };

  if (loading || !quiz || !question) {
    return <div className="animate-fade-in">Loading quiz...</div>;
  }

  if (quizComplete && finalScore) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center animate-fade-in">
        <EcoCard className="max-w-md text-center" hover={false}>
          <div className="mb-6">
            <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-eco-mint">
              <Trophy className="h-10 w-10 text-yellow-500" />
            </div>
            <h2 className="text-2xl font-bold text-foreground">Quiz Complete!</h2>
            <p className="mt-2 text-muted-foreground">{quiz.title}</p>
          </div>
          <div className="mb-6 rounded-xl bg-eco-mint/50 p-6">
            <p className="text-5xl font-bold text-primary">{finalScore.score}%</p>
            <p className="mt-2 text-muted-foreground">
              {finalScore.correctCount} out of {finalScore.totalQuestions} correct
            </p>
          </div>
          <div className="mb-6">
            {finalScore.leveledUp ? (
              <div className="rounded-lg bg-yellow-500/10 p-4 border-2 border-yellow-500/30">
                <p className="text-2xl font-bold text-yellow-600 mb-1">🎉 Level Up!</p>
                <p className="text-lg font-semibold text-foreground">
                  You reached Level {finalScore.level}!
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  +{finalScore.xpEarned} XP earned!
                </p>
              </div>
            ) : (
              <p className="text-lg font-semibold text-foreground">
                +{finalScore.xpEarned} XP earned!
              </p>
            )}
            {finalScore.level && (
              <p className="text-sm text-muted-foreground mt-2">
                Current Level: {finalScore.level} | {finalScore.xp || 0} / {finalScore.xpToNextLevel || 1000} XP to next level
              </p>
            )}
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={handleRestart} className="flex-1 gap-2">
              <RotateCcw className="h-4 w-4" />
              Retake
            </Button>
            <Button 
              onClick={() => {
                navigate("/quizzes", { replace: false });
                // Force a refresh by triggering a custom event
                window.dispatchEvent(new Event('quizzes-refresh'));
              }} 
              className="flex-1"
            >
              Back to Quizzes
            </Button>
          </div>
        </EcoCard>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl animate-fade-in">
      {/* Progress */}
      <div className="mb-8">
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>{quiz.title}</span>
          <span>
            Question {currentQuestion + 1} of {questions.length}
          </span>
        </div>
        <div className="mt-2 h-2 overflow-hidden rounded-full bg-eco-green-light">
          <div
            className="h-full rounded-full bg-primary transition-all duration-300"
            style={{
              width: `${((currentQuestion + 1) / questions.length) * 100}%`,
            }}
          />
        </div>
      </div>

      {/* Question */}
      <EcoCard className="mb-6" hover={false}>
        <h2 className="text-xl font-semibold text-foreground">{question.question}</h2>
      </EcoCard>

      {/* Options */}
      <div className="space-y-3">
        {question.options.map((option, index) => (
          <button
            key={index}
            onClick={() => handleAnswer(index)}
            disabled={showResult}
            className={cn(
              "flex w-full items-center gap-4 rounded-xl border-2 p-4 text-left transition-all",
              !showResult && "hover:border-primary hover:bg-accent",
              selectedAnswer === index && showResult
                ? "border-primary bg-primary/10"
                : "",
              !showResult && "border-border bg-card"
            )}
          >
            <div
              className={cn(
                "flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 font-medium",
                selectedAnswer === index && showResult
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border"
              )}
            >
              {selectedAnswer === index && showResult ? (
                <CheckCircle className="h-5 w-5" />
              ) : (
                String.fromCharCode(65 + index)
              )}
            </div>
            <span className="font-medium">{option}</span>
          </button>
        ))}
      </div>

      {/* Result & Next */}
      {showResult && (
        <div className="mt-6 animate-fade-in">
          <EcoCard
            className="mb-4 bg-primary/10"
            hover={false}
          >
            <p className="font-semibold text-primary">
              Answer selected! Continue to next question.
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              You'll see your results at the end of the quiz.
            </p>
          </EcoCard>
          <Button onClick={handleNext} className="w-full gap-2">
            {currentQuestion < questions.length - 1 ? (
              <>
                Next Question
                <ArrowRight className="h-4 w-4" />
              </>
            ) : (
              "See Results"
            )}
          </Button>
        </div>
      )}
    </div>
  );
};

export default QuizPlay;
