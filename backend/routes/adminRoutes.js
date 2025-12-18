import express from 'express';
import {
  getAdminDashboard,
  getStudents,
} from '../controllers/adminController.js';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

router.get('/dashboard', protect, admin, getAdminDashboard);
router.get('/students', protect, admin, getStudents);

export default router;







