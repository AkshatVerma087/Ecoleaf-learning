import mongoose from 'mongoose';

const quizResultSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    quiz: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Quiz',
      required: true,
    },
    answers: {
      type: [Number],
      required: true,
    },
    score: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
    xpEarned: {
      type: Number,
      default: 0,
    },
    completed: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Index for efficient queries
quizResultSchema.index({ user: 1, quiz: 1 });

const QuizResult = mongoose.model('QuizResult', quizResultSchema);

export default QuizResult;





