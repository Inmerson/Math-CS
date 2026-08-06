import React, { useMemo, useState } from 'react';
import { CourseId, QuizDefinition, TopicId } from '../domain/curriculum';
import { COURSES } from '../data/courseCatalog';
import { QuizRunner, QuizSubmission } from '../components/quiz/QuizRunner';
import { CosmicPageHeader } from '../components/cosmic/CosmicPageHeader';

interface ExamsViewProps { onComplete: (result: QuizSubmission) => void; }
type ExamMode = 'math-analysis' | 'linear-algebra-geometry' | 'combined';

const createExam = (mode: ExamMode): { courseId: CourseId; topicId: TopicId; quiz: QuizDefinition } => {
  const courses = mode === 'combined' ? COURSES : COURSES.filter((course) => course.id === mode);
  const questions = courses.flatMap((course) => course.topics.map((topic) => topic.quiz.questions[0])).slice(0, mode === 'combined' ? 12 : 8);
  return {
    courseId: mode === 'linear-algebra-geometry' ? 'linear-algebra-geometry' : 'math-analysis',
    topicId: mode === 'linear-algebra-geometry' ? 'vectors' : 'functions-graphs',
    quiz: { id: `${mode}-exam`, title: mode === 'combined' ? 'Combined review exam' : `${courses[0].shortTitle} mock exam`, questions },
  };
};

export const ExamsView: React.FC<ExamsViewProps> = ({ onComplete }) => {
  const [mode, setMode] = useState<ExamMode>('math-analysis');
  const exam = useMemo(() => createExam(mode), [mode]);
  return (
    <div data-testid="exams-shell" className="cosmic-assessment-shell mx-auto max-w-4xl">
      <CosmicPageHeader title="Exams" eyebrow="Reproducible assessment" description="Fixed question IDs make every score comparable by course and topic." accent="violet" />
      <div className="mt-5 flex flex-wrap gap-2">
        {(['math-analysis', 'linear-algebra-geometry', 'combined'] as const).map((item) => (
          <button key={item} className={`focus-ring cosmic-button rounded-xl px-4 py-2 text-sm font-semibold ${mode === item ? 'bg-gradient-to-r from-violet-400 to-indigo-400 text-slate-950' : 'cosmic-glass'}`} onClick={() => setMode(item)}>
            {item === 'math-analysis' ? 'Math I' : item === 'linear-algebra-geometry' ? 'Math II' : 'Combined review'}
          </button>
        ))}
      </div>
      <div className="cosmic-glass mt-5 rounded-2xl p-5"><QuizRunner key={mode} courseId={exam.courseId} topicId={exam.topicId} quiz={exam.quiz} onComplete={onComplete} /></div>
    </div>
  );
};
