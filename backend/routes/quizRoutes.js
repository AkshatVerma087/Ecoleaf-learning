import express from 'express';
import {
  getQuizzes,
  getQuiz,
  getQuizQuestions,
  submitQuiz,
  createQuiz,
  updateQuiz,
  deleteQuiz,
} from '../controllers/quizController.js';
import { protect, optionalAuth, admin } from '../middleware/auth.js';

const router = express.Router();

router.get('/', optionalAuth, getQuizzes);
router.get('/:id', getQuiz);
router.get('/:id/questions', getQuizQuestions);
router.post('/:id/submit', protect, submitQuiz);
router.post('/', protect, admin, createQuiz);
router.put('/:id', protect, admin, updateQuiz);
router.delete('/:id', protect, admin, deleteQuiz);

export default router;




