import mongoose from 'mongoose';

const userProgressSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
    },
    lesson: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Lesson',
    },
    completed: {
      type: Boolean,
      default: false,
    },
    notes: {
      type: String,
      default: '',
    },
    progress: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
  },
  {
    timestamps: true,
  }
);

// Index for efficient queries
userProgressSchema.index({ user: 1, lesson: 1 }, { unique: true });

const UserProgress = mongoose.model('UserProgress', userProgressSchema);

export default UserProgress;





