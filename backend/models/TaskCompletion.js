import mongoose from 'mongoose';

const taskCompletionSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    task: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Task',
      required: true,
    },
    completed: {
      type: Boolean,
      default: false,
    },
    proofUrl: {
      type: String,
      default: '',
    },
    completedAt: {
      type: Date,
    },
    date: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Index to prevent duplicate completions per day
taskCompletionSchema.index({ user: 1, task: 1, date: 1 }, { unique: true });

const TaskCompletion = mongoose.model('TaskCompletion', taskCompletionSchema);

export default TaskCompletion;





