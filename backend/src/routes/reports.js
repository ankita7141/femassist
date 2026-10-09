import express from 'express';
import {
  createReport,
  getReports,
  getReportById,
  markReportReviewed,
  deleteReport,
} from '../controllers/reportController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

router.route('/')
  .post(createReport)
  .get(getReports);

router.route('/:id')
  .get(getReportById)
  .delete(deleteReport);

router.put('/:id/reviewed', markReportReviewed);

export default router;