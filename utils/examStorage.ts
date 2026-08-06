
export interface QuestionStats {
  correct: number;
  incorrect: number;
  lastAttempt: number; // timestamp
}

export type ExamPerformance = Record<number, QuestionStats>;

const STORAGE_KEY = 'math_biotech_exam_perf_v1';

export const getExamPerformance = (): ExamPerformance => {
  try {
    if (typeof window === 'undefined') return {};
    const item = window.localStorage.getItem(STORAGE_KEY);
    return item ? JSON.parse(item) : {};
  } catch {
    return {};
  }
};

export const saveQuestionResult = (questionId: number, isCorrect: boolean) => {
  try {
    const perf = getExamPerformance();
    const stats = perf[questionId] || { correct: 0, incorrect: 0, lastAttempt: 0 };
    
    if (isCorrect) stats.correct++;
    else stats.incorrect++;
    
    stats.lastAttempt = Date.now();
    perf[questionId] = stats;
    
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(perf));
  } catch (e) {
    console.warn("Failed to save exam result", e);
  }
};

export const getQuestionStatus = (stats?: QuestionStats): 'UNSEEN' | 'MASTERED' | 'LEARNING' => {
    if (!stats) return 'UNSEEN';
    const total = stats.correct + stats.incorrect;
    if (total === 0) return 'UNSEEN';
    
    // Mastered: at least 3 correct answers AND > 80% accuracy
    if (stats.correct >= 3 && (stats.correct / total) >= 0.8) return 'MASTERED';
    return 'LEARNING';
};

export const resetExamData = () => {
    window.localStorage.removeItem(STORAGE_KEY);
};
