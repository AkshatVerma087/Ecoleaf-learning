import express from 'express';
import {
  getLessons,
  getLesson,
  createLesson,
  updateLesson,
  deleteLesson,
  completeLesson,
  saveNotes,
  uploadVideo,
} from '../controllers/lessonController.js';
import { protect, admin, optionalAuth } from '../middleware/auth.js';
import upload from '../middleware/upload.js';

const router = express.Router();

router.get('/courses/:courseId/lessons', optionalAuth, getLessons);
router.get('/:id', optionalAuth, getLesson);
router.post('/upload', protect, admin, upload.single('video'), uploadVideo);
router.post('/', protect, admin, createLesson);
router.put('/:id', protect, admin, updateLesson);
router.delete('/:id', protect, admin, deleteLesson);
router.post('/:id/complete', protect, completeLesson);
router.post('/:id/notes', protect, saveNotes);

export default router;




