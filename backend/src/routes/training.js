import express from 'express';
import {
  completeLesson,
  getProgress,
  getProgressByLesson,
} from '../controllers/trainingController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

router.get('/progress', getProgress);
router.get('/progress/:lessonId', getProgressByLesson);
router.post('/:lessonId/complete', completeLesson);

export default router;