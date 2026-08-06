export type MatrixData = number[][];

export interface MatrixOperationRequest {
  matrixA: MatrixData;
  matrixB?: MatrixData;
  scalar?: number;
}

export interface MatrixOperationResponse {
  success: boolean;
  result?: MatrixData | number;
  error?: string;
}

export interface QuestionStats {
  correct: number;
  incorrect: number;
  lastAttempt: number;
}

export type ExamPerformance = Record<number, QuestionStats>;

export interface ExamResultRequest {
  questionId: number;
  isCorrect: boolean;
}
