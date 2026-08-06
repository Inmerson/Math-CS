import express from 'express';
import {
  getExamPerformance,
  saveExamResult,
  resetExamData,
  getQuestionStats
} from '../controllers/examController.js';

const router = express.Router();

router.get('/performance', getExamPerformance);
router.post('/result', saveExamResult);
router.delete('/reset', resetExamData);
router.get('/question/:questionId', getQuestionStats);

export default router;
