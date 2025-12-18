import mongoose from 'mongoose';

const taskSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please add a task title'],
    },
    description: {
      type: String,
      required: true,
    },
    icon: {
      type: String,
      default: '🌱',
    },
    xp: {
      type: Number,
      required: true,
      default: 50,
    },
    proofRequired: {
      type: Boolean,
      default: false,
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const Task = mongoose.model('Task', taskSchema);

export default Task;







