import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a name'],
    },
    email: {
      type: String,
      required: [true, 'Please add an email'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'Please add a password'],
      minlength: 6,
    },
    role: {
      type: String,
      enum: ['student', 'admin'],
      default: 'student',
    },
    avatar: {
      type: String,
      default: '',
    },
    level: {
      type: Number,
      default: 1,
    },
    xp: {
      type: Number,
      default: 0,
    },
    xpToNextLevel: {
      type: Number,
      default: 1000,
    },
    totalXp: {
      type: Number,
      default: 0,
    },
    streak: {
      type: Number,
      default: 0,
    },
    lastActivityDate: {
      type: Date,
    },
    tasksCompleted: {
      type: Number,
      default: 0,
    },
    quizzesPassed: {
      type: Number,
      default: 0,
    },
    totalQuizzes: {
      type: Number,
      default: 0,
    },
    carbonScore: {
      type: String,
      default: 'B',
    },
  },
  {
    timestamps: true,
  }
);

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Match password method
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Generate JWT token
userSchema.methods.generateToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d',
  });
};

const User = mongoose.model('User', userSchema);

export default User;

