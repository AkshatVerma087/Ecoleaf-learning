import mongoose from 'mongoose';

const courseSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please add a course title'],
    },
    description: {
      type: String,
      required: [true, 'Please add a description'],
    },
    thumbnail: {
      type: String,
      default: '',
    },
    category: {
      type: String,
      required: true,
      enum: ['Climate', 'Lifestyle', 'Energy', 'Wildlife', 'Gardening'],
    },
    lessons: {
      type: Number,
      default: 0,
    },
    duration: {
      type: String,
      default: '0h 0m',
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

const Course = mongoose.model('Course', courseSchema);

export default Course;





