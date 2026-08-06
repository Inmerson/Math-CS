export type CourseId = 'math-analysis' | 'linear-algebra-geometry';
export type TopicId =
  | 'functions-graphs'
  | 'sequences'
  | 'limits'
  | 'continuity'
  | 'derivatives'
  | 'derivative-applications'
  | 'integrals'
  | 'taylor-series'
  | 'vectors'
  | 'matrices'
  | 'linear-systems'
  | 'determinants'
  | 'matrix-inverses'
  | 'vector-spaces'
  | 'linear-transformations'
  | 'eigenvalues-eigenvectors'
  | 'analytic-geometry';

export type LearningStage = 'learn' | 'visualize' | 'practice' | 'cs-connection' | 'quiz';
export type VisualizationKind = 'function-explorer' | 'matrix-lab' | 'vector-geometry-lab' | 'none';
export type QuestionKind = 'multiple-choice' | 'numeric' | 'ordered-steps' | 'matrix' | 'vector';

export interface FormulaDefinition {
  id: string;
  label: string;
  latex: string;
  explanation: string;
}

export interface PracticeQuestion {
  id: string;
  kind: QuestionKind;
  prompt: string;
  choices?: string[];
  answer: string | number | number[] | number[][];
  tolerance?: number;
  explanation: string;
}

export interface QuizDefinition {
  id: string;
  title: string;
  questions: PracticeQuestion[];
}

export interface TopicDefinition {
  id: TopicId;
  courseId: CourseId;
  title: string;
  description: string;
  prerequisites: TopicId[];
  learningObjectives: string[];
  sections: { id: string; title: string; markdown: string }[];
  formulas: FormulaDefinition[];
  visualization: { kind: VisualizationKind; presetId?: string };
  workedExamples: { id: string; title: string; steps: string[] }[];
  csConnections: { title: string; explanation: string }[];
  practiceQuestions: PracticeQuestion[];
  quiz: QuizDefinition;
  difficulty: 1 | 2 | 3;
  estimatedStudyMinutes: number;
}

export interface CourseDefinition {
  id: CourseId;
  title: string;
  officialTitle: string;
  shortTitle: 'Math I' | 'Math II';
  description: string;
  order: 1 | 2;
  topics: TopicDefinition[];
}
