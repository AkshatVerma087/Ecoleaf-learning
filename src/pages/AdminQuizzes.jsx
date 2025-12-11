import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, HelpCircle, X } from "lucide-react";
import EcoCard from "@/components/ui/EcoCard";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { quizzesAPI } from "@/services/api";

const AdminQuizzes = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    difficulty: "Easy",
    xp: 100,
    questions: [],
  });
  const [currentQuestion, setCurrentQuestion] = useState({
    question: "",
    options: ["", "", "", ""],
    correct: 0,
  });

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const data = await quizzesAPI.getAll();
        setQuizzes(data);
      } catch (error) {
        toast.error(error.message || "Failed to load quizzes");
      } finally {
        setLoading(false);
      }
    };
    fetchQuizzes();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await quizzesAPI.create(formData);
      toast.success("Quiz created successfully!");
      setShowModal(false);
      setFormData({
        title: "",
        description: "",
        difficulty: "Easy",
        xp: 100,
        questions: [],
      });
      setCurrentQuestion({
        question: "",
        options: ["", "", "", ""],
        correct: 0,
      });
      // Refresh quizzes
      const data = await quizzesAPI.getAll();
      setQuizzes(data);
    } catch (error) {
      toast.error(error.message || "Failed to create quiz");
    }
  };

  const handleDelete = async (quizId) => {
    try {
      await quizzesAPI.delete(quizId);
      toast.success("Quiz deleted successfully!");
      // Refresh quizzes
      const data = await quizzesAPI.getAll();
      setQuizzes(data);
    } catch (error) {
      toast.error(error.message || "Failed to delete quiz");
    }
  };

  const addQuestion = () => {
    if (currentQuestion.question && currentQuestion.options.every((o) => o)) {
      setFormData({
        ...formData,
        questions: [...formData.questions, currentQuestion],
      });
      setCurrentQuestion({
        question: "",
        options: ["", "", "", ""],
        correct: 0,
      });
      toast.success("Question added!");
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Manage Quizzes</h1>
          <p className="mt-2 text-muted-foreground">
            Create and manage quizzes for students.
          </p>
        </div>
        <Button onClick={() => setShowModal(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          Create Quiz
        </Button>
      </div>

      {/* Quiz List */}
      {loading ? (
        <div className="text-center py-12">Loading quizzes...</div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {quizzes.map((quiz) => (
            <EcoCard key={quiz._id || quiz.id}>
            <div className="mb-3 flex items-start justify-between">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-eco-mint">
                <HelpCircle className="h-6 w-6 text-primary" />
              </div>
              <div className="flex gap-1">
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-destructive hover:text-destructive"
                  onClick={() => handleDelete(quiz._id || quiz.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <h3 className="text-lg font-semibold text-foreground">{quiz.title}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{quiz.description}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              <span className="rounded-full bg-muted px-3 py-1 text-xs font-medium">
                {quiz.questions || 0} questions
              </span>
              <span className="rounded-full bg-muted px-3 py-1 text-xs font-medium">
                {quiz.difficulty}
              </span>
              <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                {quiz.xp} XP
              </span>
            </div>
          </EcoCard>
        ))}
        </div>
      )}

      {/* Create Quiz Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/50 p-4">
          <div className="w-full max-w-2xl rounded-2xl bg-card p-6 shadow-lg animate-fade-in">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-foreground">Create New Quiz</h2>
              <button
                onClick={() => setShowModal(false)}
                className="rounded-lg p-1 hover:bg-muted"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium">Quiz Title</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="h-11 w-full rounded-lg border border-input bg-background px-4 outline-none focus:border-primary"
                    required
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium">Difficulty</label>
                  <select
                    value={formData.difficulty}
                    onChange={(e) =>
                      setFormData({ ...formData, difficulty: e.target.value })
                    }
                    className="h-11 w-full rounded-lg border border-input bg-background px-4 outline-none focus:border-primary"
                  >
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="h-20 w-full rounded-lg border border-input bg-background p-4 outline-none focus:border-primary"
                  required
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium">XP Reward</label>
                <input
                  type="number"
                  value={formData.xp}
                  onChange={(e) =>
                    setFormData({ ...formData, xp: parseInt(e.target.value) })
                  }
                  className="h-11 w-full rounded-lg border border-input bg-background px-4 outline-none focus:border-primary"
                  required
                />
              </div>

              {/* Add Questions */}
              <div className="rounded-lg border border-border p-4">
                <h3 className="mb-3 font-medium text-foreground">
                  Add Question ({formData.questions.length} added)
                </h3>
                <div className="space-y-3">
                  <input
                    type="text"
                    value={currentQuestion.question}
                    onChange={(e) =>
                      setCurrentQuestion({ ...currentQuestion, question: e.target.value })
                    }
                    placeholder="Enter question"
                    className="h-10 w-full rounded-lg border border-input bg-background px-4 text-sm outline-none focus:border-primary"
                  />
                  <div className="grid grid-cols-2 gap-2">
                    {currentQuestion.options.map((opt, i) => (
                      <input
                        key={i}
                        type="text"
                        value={opt}
                        onChange={(e) => {
                          const newOptions = [...currentQuestion.options];
                          newOptions[i] = e.target.value;
                          setCurrentQuestion({ ...currentQuestion, options: newOptions });
                        }}
                        placeholder={`Option ${String.fromCharCode(65 + i)}`}
                        className="h-10 rounded-lg border border-input bg-background px-4 text-sm outline-none focus:border-primary"
                      />
                    ))}
                  </div>
                  <div className="flex items-center justify-between">
                    <select
                      value={currentQuestion.correct}
                      onChange={(e) =>
                        setCurrentQuestion({
                          ...currentQuestion,
                          correct: parseInt(e.target.value),
                        })
                      }
                      className="h-10 rounded-lg border border-input bg-background px-4 text-sm outline-none focus:border-primary"
                    >
                      <option value={0}>Correct: A</option>
                      <option value={1}>Correct: B</option>
                      <option value={2}>Correct: C</option>
                      <option value={3}>Correct: D</option>
                    </select>
                    <Button type="button" variant="outline" size="sm" onClick={addQuestion}>
                      Add Question
                    </Button>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowModal(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button type="submit" className="flex-1">
                  Create Quiz
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminQuizzes;
