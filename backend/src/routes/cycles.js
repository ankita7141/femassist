import express from 'express';
import {
  createCycle,
  getCycles,
  deleteCycle,
} from '../controllers/cycleController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

router.route('/')
  .post(createCycle)
  .get(getCycles);

router.delete('/:id', deleteCycle);

export default router;