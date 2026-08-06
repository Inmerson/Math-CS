import { Request, Response } from 'express';
import { ExamPerformance, QuestionStats, ExamResultRequest } from '../types/index.js';

// In-memory storage (in production, use a database)
let examPerformanceData: ExamPerformance = {};

export const getExamPerformance = (req: Request, res: Response) => {
  try {
    res.json({ success: true, data: examPerformanceData });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
};

export const saveExamResult = (req: Request, res: Response) => {
  try {
    const { questionId, isCorrect } = req.body as ExamResultRequest;

    if (questionId === undefined || isCorrect === undefined) {
      return res.status(400).json({ success: false, error: 'questionId and isCorrect are required' });
    }

    const stats: QuestionStats = examPerformanceData[questionId] || {
      correct: 0,
      incorrect: 0,
      lastAttempt: 0
    };

    if (isCorrect) {
      stats.correct++;
    } else {
      stats.incorrect++;
    }

    stats.lastAttempt = Date.now();
    examPerformanceData[questionId] = stats;

    res.json({ success: true, data: stats });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
};

export const resetExamData = (req: Request, res: Response) => {
  try {
    examPerformanceData = {};
    res.json({ success: true, message: 'Exam data reset successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
};

export const getQuestionStats = (req: Request, res: Response) => {
  try {
    const { questionId } = req.params;
    const id = parseInt(questionId);

    if (isNaN(id)) {
      return res.status(400).json({ success: false, error: 'Invalid question ID' });
    }

    const stats = examPerformanceData[id];
    res.json({ success: true, data: stats || null });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
};
