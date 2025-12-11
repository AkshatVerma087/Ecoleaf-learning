import express from 'express';
import {
  getEmissions,
  logEmissions,
  getCarbonScore,
} from '../controllers/carbonController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.get('/emissions', protect, getEmissions);
router.post('/emissions', protect, logEmissions);
router.get('/score', protect, getCarbonScore);

export default router;





