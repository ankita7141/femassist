import express from 'express';
import {
  createSymptom,
  getSymptoms,
  deleteSymptom,
} from '../controllers/symptomController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

router.route('/')
  .post(createSymptom)
  .get(getSymptoms);

router.delete('/:id', deleteSymptom);

export default router;