import express from 'express';
import {
  getFollowUps,
  dismissFollowUp,
  resetFollowUps,
} from '../controllers/followupController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

router.get('/', getFollowUps);
router.post('/reset', resetFollowUps);
router.post('/:id/dismiss', dismissFollowUp);

export default router;