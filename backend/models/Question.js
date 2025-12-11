import mongoose from 'mongoose';

const questionSchema = mongoose.Schema(
  {
    quiz: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Quiz',
      required: true,
    },
    question: {
      type: String,
      required: [true, 'Please add a question'],
    },
    options: {
      type: [String],
      required: true,
      validate: {
        validator: function (v) {
          return v.length === 4;
        },
        message: 'Question must have exactly 4 options',
      },
    },
    correct: {
      type: Number,
      required: true,
      min: 0,
      max: 3,
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const Question = mongoose.model('Question', questionSchema);

export default Question;





