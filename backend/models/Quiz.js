import mongoose from 'mongoose';

const quizSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please add a quiz title'],
    },
    description: {
      type: String,
      required: true,
    },
    difficulty: {
      type: String,
      enum: ['Easy', 'Medium', 'Hard'],
      default: 'Easy',
    },
    xp: {
      type: Number,
      default: 100,
    },
    duration: {
      type: String,
      default: '15 min',
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

const Quiz = mongoose.model('Quiz', quizSchema);

export default Quiz;







