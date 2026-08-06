import React from 'react';
import { COURSES } from '../data/courseCatalog';
import { MathCsState } from '../utils/mathCsStorage';
import { getCourseProgress, getRecommendedTopic } from '../utils/progress';
import { CosmicPageHeader } from '../components/cosmic/CosmicPageHeader';
import { CosmicProgressRing } from '../components/cosmic/CosmicProgressRing';

interface ProgressViewProps { state: MathCsState; }

export const ProgressView: React.FC<ProgressViewProps> = ({ state }) => {
  const weak = state.quizResults.filter((result) => result.percentage < 70);
  return (
    <div data-testid="progress-shell" className="mx-auto max-w-5xl">
      <CosmicPageHeader title="Progress" eyebrow="Course analytics" description="Completion, latest checkpoints, recommendations, and the local review queue." accent="neutral" />
      <div className="mt-6 grid gap-5 md:grid-cols-2">
        {COURSES.map((course) => {
          const progress = getCourseProgress(state, course);
          const latest = state.quizResults.filter((result) => result.courseId === course.id).at(-1);
          const accent = course.id === 'math-analysis' ? 'blue' : 'violet';
          return (
            <section key={course.id} data-accent={accent} className={`cosmic-glass cosmic-card rounded-2xl p-5 ${accent === 'blue' ? 'cosmic-glow-blue' : 'cosmic-glow-violet'}`}>
              <div className="flex items-start justify-between gap-4">
                <div><p className={`text-xs font-bold uppercase tracking-[.18em] ${accent === 'blue' ? 'text-blue-200' : 'text-violet-200'}`}>{course.shortTitle}</p><h2 className="mt-2 text-xl font-bold text-white">{course.title}</h2></div>
                <CosmicProgressRing value={progress} label={`${course.shortTitle} progress`} size="sm" accent={accent} />
              </div>
              <div className="mt-4 h-2 rounded-full bg-white/8"><div className={`h-full rounded-full bg-gradient-to-r ${accent === 'blue' ? 'from-blue-400 to-cyan-300' : 'from-violet-400 to-indigo-400'}`} style={{ width: `${progress}%` }} /></div>
              <dl className="mt-5 space-y-3 text-sm"><div><dt className="text-slate-500">Latest score</dt><dd className="text-slate-100">{latest ? `${latest.percentage}%` : 'No attempts'}</dd></div><div><dt className="text-slate-500">Recommended next</dt><dd className="text-slate-100">{getRecommendedTopic(state, course)?.title ?? 'Course review'}</dd></div></dl>
            </section>
          );
        })}
      </div>
      <section className="cosmic-glass mt-5 rounded-2xl p-5"><h2 className="text-xl font-bold text-white">Review queue</h2>{weak.length ? <ul className="mt-4 space-y-2">{weak.map((result) => <li key={`${result.courseId}-${result.topicId}`} className="rounded-lg border border-amber-300/15 bg-amber-300/5 p-3 text-sm text-amber-100">{result.topicId.replaceAll('-', ' ')} · {result.percentage}%</li>)}</ul> : <p className="mt-3 text-slate-400">No weak-topic results yet. Complete a checkpoint to build the review queue.</p>}</section>
    </div>
  );
};
