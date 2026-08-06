import React from 'react';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { CourseDefinition, CourseId, TopicDefinition } from '../../domain/curriculum';
import { AppDestination } from '../../types';
import { QuizResult } from '../../utils/mathCsStorage';
import { CosmicProgressRing } from '../cosmic/CosmicProgressRing';
import { CourseVisual } from '../cosmic/CourseVisual';

interface CourseCardProps {
  course: CourseDefinition;
  progress: number;
  completedCount: number;
  recommendedTopic?: TopicDefinition;
  latestQuiz?: QuizResult;
  onNavigate: (destination: AppDestination) => void;
}

const variants: Record<CourseId, {
  accent: 'blue' | 'violet';
  label: string;
  line: string;
  button: string;
  badge: string;
  glow: string;
}> = {
  'math-analysis': {
    accent: 'blue',
    label: 'text-blue-200',
    line: 'from-blue-400 via-cyan-300 to-indigo-400',
    button: 'from-blue-500 to-indigo-500 text-white',
    badge: 'border-blue-300/20 bg-blue-400/10 text-blue-100',
    glow: 'cosmic-glow-blue',
  },
  'linear-algebra-geometry': {
    accent: 'violet',
    label: 'text-violet-200',
    line: 'from-violet-400 via-fuchsia-400 to-indigo-400',
    button: 'from-violet-500 to-indigo-500 text-white',
    badge: 'border-violet-300/20 bg-violet-400/10 text-violet-100',
    glow: 'cosmic-glow-violet',
  },
};

export const CourseCard: React.FC<CourseCardProps> = ({
  course,
  progress,
  completedCount,
  recommendedTopic,
  latestQuiz,
  onNavigate,
}) => {
  const variant = variants[course.id];
  const titleId = `course-${course.id}-title`;

  return (
    <article
      data-testid="course-card"
      data-accent={variant.accent}
      aria-labelledby={titleId}
      className={`cosmic-glass cosmic-card ${variant.glow} relative flex h-full flex-col overflow-hidden rounded-[1.4rem] p-5 md:p-6`}
    >
      <div className="grid gap-5 sm:grid-cols-[minmax(0,1fr)_11rem] sm:items-start">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <p className={`text-xs font-bold uppercase tracking-[0.2em] ${variant.label}`}>{course.shortTitle}</p>
            <span className={`rounded-full border px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] ${variant.badge}`}>
              {completedCount}/{course.topics.length} complete
            </span>
          </div>
          <h2 id={titleId} className="mt-3 text-2xl font-bold tracking-tight text-white md:text-3xl">{course.title}</h2>
          <p className="mt-1 text-sm text-slate-400">{course.officialTitle}</p>
          <p className="mt-4 text-sm leading-6 text-slate-300">{course.description}</p>
        </div>
        <div className="pointer-events-none self-center opacity-90" aria-hidden="true">
          <CourseVisual courseId={course.id} />
        </div>
      </div>

      <div className="mt-6 rounded-2xl border border-white/8 bg-black/15 p-4">
        <div className="flex items-center gap-4">
          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between gap-3 text-xs text-slate-400">
              <span className="font-semibold uppercase tracking-[0.14em]">Course progress</span>
              <span>{completedCount} topics</span>
            </div>
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/7" aria-label={`${course.shortTitle}: ${progress}% complete`}>
              <div className={`h-full rounded-full bg-gradient-to-r ${variant.line}`} style={{ width: `${progress}%` }} />
            </div>
            <div className="mt-3 flex items-center gap-2 text-xs text-slate-400">
              <CheckCircle2 size={14} />
              <span>{completedCount} of {course.topics.length} topics complete</span>
            </div>
          </div>
          <CosmicProgressRing value={progress} label={`${course.shortTitle} progress`} size="sm" accent={variant.accent} />
        </div>
      </div>

      <dl className="mt-5 grid gap-3 text-sm sm:grid-cols-2">
        <div className="rounded-xl border border-white/7 bg-white/[0.025] p-3">
          <dt className={`text-[11px] font-semibold uppercase tracking-[0.15em] ${variant.label}`}>Recommended next</dt>
          <dd className="mt-2 font-medium text-slate-100">{recommendedTopic?.title ?? 'Course complete'}</dd>
        </div>
        <div className="rounded-xl border border-white/7 bg-white/[0.025] p-3">
          <dt className="text-[11px] font-semibold uppercase tracking-[0.15em] text-slate-500">Latest checkpoint</dt>
          <dd className="mt-2 font-medium text-slate-100">{latestQuiz ? `${latestQuiz.percentage}%` : 'Not attempted'}</dd>
        </div>
      </dl>

      <button
        type="button"
        className={`focus-ring cosmic-button mt-5 inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r px-4 py-3 font-semibold ${variant.button}`}
        onClick={() => onNavigate({ section: 'course', courseId: course.id })}
      >
        Open {course.shortTitle}<ArrowRight size={17} />
      </button>
    </article>
  );
};
