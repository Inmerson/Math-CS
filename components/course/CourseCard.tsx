import React from 'react';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { CourseDefinition, TopicDefinition } from '../../domain/curriculum';
import { AppDestination } from '../../types';
import { QuizResult } from '../../utils/mathCsStorage';

interface CourseCardProps {
  course: CourseDefinition;
  progress: number;
  completedCount: number;
  recommendedTopic?: TopicDefinition;
  latestQuiz?: QuizResult;
  onNavigate: (destination: AppDestination) => void;
}

export const CourseCard: React.FC<CourseCardProps> = ({ course, progress, completedCount, recommendedTopic, latestQuiz, onNavigate }) => (
  <article data-testid="course-card" className="notebook-panel flex h-full flex-col p-5 md:p-6">
    <div className="mb-5 flex items-start justify-between gap-4">
      <div><p className="text-xs font-bold uppercase tracking-[0.18em] text-cyan-300">{course.shortTitle}</p><h2 className="mt-2 text-2xl font-bold text-white">{course.title}</h2><p className="mt-1 text-sm text-slate-400">{course.officialTitle}</p></div>
      <span className="rounded-full border border-cyan-200/20 bg-cyan-200/8 px-3 py-1 text-sm font-semibold text-cyan-100">{progress}%</span>
    </div>
    <p className="text-sm leading-6 text-slate-300">{course.description}</p>
    <div className="mt-5 h-2 overflow-hidden rounded-full bg-white/6" aria-label={`${progress}% complete`}><div className="h-full rounded-full bg-cyan-300" style={{ width: `${progress}%` }} /></div>
    <div className="mt-3 flex items-center gap-2 text-xs text-slate-400"><CheckCircle2 size={14} /><span>{completedCount} of {course.topics.length} topics complete</span></div>
    <dl className="mt-5 grid gap-3 text-sm"><div><dt className="text-slate-500">Recommended next</dt><dd className="mt-1 font-medium text-slate-100">{recommendedTopic?.title ?? 'Course complete'}</dd></div><div><dt className="text-slate-500">Latest checkpoint</dt><dd className="mt-1 font-medium text-slate-100">{latestQuiz ? `${latestQuiz.percentage}%` : 'Not attempted'}</dd></div></dl>
    <button className="focus-ring mt-6 inline-flex items-center justify-center gap-2 rounded-xl bg-cyan-300 px-4 py-3 font-semibold text-slate-950 hover:bg-cyan-200" onClick={() => onNavigate({ section: 'course', courseId: course.id })}>Open {course.shortTitle}<ArrowRight size={17} /></button>
  </article>
);
