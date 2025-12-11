import express from 'express';
import {
  getTasks,
  completeTask,
  uploadProof,
} from '../controllers/taskController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.get('/', protect, getTasks);
router.post('/:id/complete', protect, completeTask);
router.post('/:id/upload', protect, uploadProof);

export default router;
