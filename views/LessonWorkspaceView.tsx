import React from 'react';
import { ArrowLeft, Bookmark, CheckCircle2 } from 'lucide-react';
import { CourseId, TopicId } from '../domain/curriculum';
import { AppDestination } from '../types';
import { getCourse, getTopic } from '../data/courseCatalog';
import { MathCsState } from '../utils/mathCsStorage';
import { LearningFlow } from '../components/course/LearningFlow';
import { QuizSubmission } from '../components/quiz/QuizRunner';
import { CosmicPageHeader } from '../components/cosmic/CosmicPageHeader';

interface LessonWorkspaceViewProps {
  courseId: CourseId;
  topicId: TopicId;
  state: MathCsState;
  onNavigate: (destination: AppDestination) => void;
  onComplete: (topicId: TopicId) => void;
  onQuizComplete: (result: QuizSubmission) => void;
}

export const LessonWorkspaceView: React.FC<LessonWorkspaceViewProps> = ({ courseId, topicId, state, onNavigate, onComplete, onQuizComplete }) => {
  const course = getCourse(courseId);
  const topic = getTopic(courseId, topicId);
  if (!course || !topic) return null;
  const complete = state.completedTopicIds.includes(topic.id);
  const accent = course.id === 'math-analysis' ? 'blue' : 'violet';
  const labId = topic.visualization.kind === 'matrix-lab' ? 'matrix' : topic.visualization.kind === 'vector-geometry-lab' ? 'vector-geometry' : 'function';

  return (
    <div data-testid="lesson-workspace-shell" className="cosmic-reading-shell mx-auto max-w-[1320px]">
      <div className="mb-5 flex items-center justify-between gap-4">
        <button className="focus-ring inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white" onClick={() => onNavigate({ section: 'course', courseId })}>
          <ArrowLeft size={16} />{course.shortTitle}
        </button>
        <button className="focus-ring cosmic-glass inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm text-slate-200" onClick={() => onComplete(topic.id)}>
          {complete ? <CheckCircle2 size={16} /> : <Bookmark size={16} />}{complete ? 'Completed' : 'Mark complete'}
        </button>
      </div>
      <CosmicPageHeader
        title={topic.title}
        eyebrow={`${course.shortTitle} · ${topic.estimatedStudyMinutes} min`}
        description={topic.description}
        accent={accent}
      />
      <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1fr)_280px]">
        <div className="min-w-0"><LearningFlow topic={topic} onOpenLab={() => onNavigate({ section: 'math-lab', courseId, topicId, labId })} onQuizComplete={onQuizComplete} /></div>
        <aside className="space-y-4 xl:sticky xl:top-6 xl:self-start" aria-label="Lesson context">
          <div className="cosmic-glass rounded-2xl p-4"><h2 className="font-semibold text-white">Learning goals</h2><ul className="mt-3 space-y-2 text-sm text-slate-300">{topic.learningObjectives.map((goal) => <li key={goal}>• {goal}</li>)}</ul></div>
          <div className="cosmic-glass rounded-2xl p-4"><h2 className="font-semibold text-white">Prerequisites</h2><p className="mt-2 text-sm text-slate-400">{topic.prerequisites.length ? topic.prerequisites.join(', ') : 'No prerequisites'}</p></div>
        </aside>
      </div>
    </div>
  );
};
