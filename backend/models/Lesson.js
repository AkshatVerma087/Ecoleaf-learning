import mongoose from 'mongoose';

const lessonSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please add a lesson title'],
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: true,
    },
    duration: {
      type: String,
      required: true,
    },
    videoUrl: {
      type: String,
      default: '',
    },
    order: {
      type: Number,
      default: 0,
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

const Lesson = mongoose.model('Lesson', lessonSchema);

export default Lesson;





