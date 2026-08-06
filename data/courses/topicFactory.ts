import {
  CourseId,
  TopicDefinition,
  TopicId,
  VisualizationKind,
} from '../../domain/curriculum';

interface TopicSeed {
  id: TopicId;
  courseId: CourseId;
  title: string;
  description: string;
  prerequisites?: TopicId[];
  objective: string;
  theory: string;
  formulaLabel: string;
  formulaLatex: string;
  formulaExplanation: string;
  visualization: VisualizationKind;
  example: string[];
  csTitle: string;
  csExplanation: string;
  checkPrompt: string;
  checkAnswer: string;
  numericPrompt: string;
  numericAnswer: number;
  difficulty?: 1 | 2 | 3;
}

export const createTopic = (seed: TopicSeed): TopicDefinition => {
  const practiceQuestions = [
    {
      id: `${seed.id}-concept`,
      kind: 'multiple-choice' as const,
      prompt: seed.checkPrompt,
      choices: [seed.checkAnswer, 'None of these', 'The expression is undefined', 'Only by numerical simulation'],
      answer: seed.checkAnswer,
      explanation: `The defining idea is: ${seed.checkAnswer}.`,
    },
    {
      id: `${seed.id}-numeric`,
      kind: 'numeric' as const,
      prompt: seed.numericPrompt,
      answer: seed.numericAnswer,
      tolerance: 0.001,
      explanation: `The expected numerical result is ${seed.numericAnswer}.`,
    },
  ];

  return {
    id: seed.id,
    courseId: seed.courseId,
    title: seed.title,
    description: seed.description,
    prerequisites: seed.prerequisites ?? [],
    learningObjectives: [seed.objective],
    sections: [{ id: `${seed.id}-theory`, title: 'Core idea', markdown: seed.theory }],
    formulas: [{
      id: `${seed.id}-formula`,
      label: seed.formulaLabel,
      latex: seed.formulaLatex,
      explanation: seed.formulaExplanation,
    }],
    visualization: { kind: seed.visualization, presetId: seed.id },
    workedExamples: [{ id: `${seed.id}-example`, title: 'Worked example', steps: seed.example }],
    csConnections: [{ title: seed.csTitle, explanation: seed.csExplanation }],
    practiceQuestions,
    quiz: {
      id: `${seed.id}-quiz`,
      title: `${seed.title} checkpoint`,
      questions: [
        ...practiceQuestions,
        {
          id: `${seed.id}-reflection`,
          kind: 'multiple-choice',
          prompt: `Which statement best summarizes ${seed.title}?`,
          choices: [seed.description, 'It is unrelated to computation', 'It applies only to one coordinate system', 'It is unrelated to the current course'],
          answer: seed.description,
          explanation: seed.description,
        },
      ],
    },
    difficulty: seed.difficulty ?? 2,
    estimatedStudyMinutes: 45,
  };
};
