import express from 'express';
import {
  getOnboarding,
  updateOnboarding,
  completeOnboarding,
} from '../controllers/onboardingController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.use(protect); // all routes below require auth

router.get('/', getOnboarding);
router.put('/', updateOnboarding);
router.post('/complete', completeOnboarding);

export default router;