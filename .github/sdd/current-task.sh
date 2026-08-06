#!/usr/bin/env bash
set -euo pipefail
mkdir -p components/cosmic views/__tests__

cat > components/cosmic/CosmicPageHeader.test.tsx <<'EOF'
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { CosmicPageHeader } from './CosmicPageHeader';

describe('CosmicPageHeader', () => {
  it('preserves heading hierarchy and exposes the visual accent', () => {
    render(<CosmicPageHeader title="Practice" eyebrow="Guided work" accent="violet" />);
    expect(screen.getByRole('heading', { level: 1, name: 'Practice' })).toBeInTheDocument();
    expect(screen.getByText('Guided work')).toBeInTheDocument();
    expect(screen.getByTestId('cosmic-page-header')).toHaveAttribute('data-accent', 'violet');
  });
});
EOF

if npm test -- components/cosmic/CosmicPageHeader.test.tsx; then
  echo 'Expected RED for missing CosmicPageHeader.' >&2
  exit 1
else
  echo 'RED confirmed: shared internal page header is not implemented.'
fi

cat > components/cosmic/CosmicPageHeader.tsx <<'EOF'
import React from 'react';

interface CosmicPageHeaderProps {
  title: string;
  eyebrow: string;
  description?: string;
  meta?: string;
  accent?: 'blue' | 'violet' | 'neutral';
  children?: React.ReactNode;
}

const variants = {
  blue: {
    eyebrow: 'text-blue-200',
    glow: 'cosmic-glow-blue',
    wash: 'from-blue-500/10 via-transparent to-transparent',
  },
  violet: {
    eyebrow: 'text-violet-200',
    glow: 'cosmic-glow-violet',
    wash: 'from-violet-500/10 via-transparent to-transparent',
  },
  neutral: {
    eyebrow: 'text-slate-300',
    glow: '',
    wash: 'from-slate-400/7 via-transparent to-transparent',
  },
} as const;

export const CosmicPageHeader: React.FC<CosmicPageHeaderProps> = ({
  title,
  eyebrow,
  description,
  meta,
  accent = 'neutral',
  children,
}) => {
  const variant = variants[accent];
  return (
    <header
      data-testid="cosmic-page-header"
      data-accent={accent}
      className={`cosmic-glass ${variant.glow} relative isolate overflow-hidden rounded-[1.4rem] p-6 md:p-8`}
    >
      <div className={`pointer-events-none absolute inset-0 -z-10 bg-gradient-to-br ${variant.wash}`} aria-hidden="true" />
      <p className={`text-xs font-bold uppercase tracking-[0.2em] ${variant.eyebrow}`}>{eyebrow}</p>
      <h1 className="mt-3 text-3xl font-bold tracking-tight text-white md:text-4xl">{title}</h1>
      {meta && <p className="mt-2 text-sm text-slate-400">{meta}</p>}
      {description && <p className="mt-4 max-w-3xl leading-7 text-slate-300">{description}</p>}
      {children && <div className="mt-5">{children}</div>}
    </header>
  );
};
EOF

cat > views/CourseHubView.test.tsx <<'EOF'
import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { markTopicComplete } from '../utils/progress';
import { createDefaultMathCsState } from '../utils/mathCsStorage';
import { CourseHubView } from './CourseHubView';

describe('CourseHubView', () => {
  it('derives progress, recommendation, and course accent from state', () => {
    const state = markTopicComplete(createDefaultMathCsState(), 'functions-graphs');
    render(<CourseHubView courseId="math-analysis" state={state} onNavigate={vi.fn()} />);
    expect(screen.getByRole('heading', { level: 1, name: 'Mathematical Analysis' })).toBeInTheDocument();
    expect(screen.getByText('13% complete')).toBeInTheDocument();
    expect(screen.getByText('Next: Sequences')).toBeInTheDocument();
    expect(screen.getByTestId('course-hub-shell')).toHaveAttribute('data-accent', 'blue');
  });
});
EOF

if npm test -- views/CourseHubView.test.tsx; then
  echo 'Expected RED before CourseHub used the restrained cosmic shell.' >&2
  exit 1
else
  echo 'RED confirmed: internal course shell is not implemented.'
fi

cat > views/CourseHubView.tsx <<'EOF'
import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { CourseId } from '../domain/curriculum';
import { AppDestination } from '../types';
import { getCourse } from '../data/courseCatalog';
import { MathCsState } from '../utils/mathCsStorage';
import { getCourseProgress, getRecommendedTopic } from '../utils/progress';
import { TopicList } from '../components/course/TopicList';
import { CosmicPageHeader } from '../components/cosmic/CosmicPageHeader';

interface CourseHubViewProps {
  courseId: CourseId;
  state: MathCsState;
  onNavigate: (destination: AppDestination) => void;
}

export const CourseHubView: React.FC<CourseHubViewProps> = ({ courseId, state, onNavigate }) => {
  const course = getCourse(courseId);
  if (!course) return null;
  const recommended = getRecommendedTopic(state, course);
  const progress = getCourseProgress(state, course);
  const accent = course.id === 'math-analysis' ? 'blue' : 'violet';

  return (
    <div data-testid="course-hub-shell" data-accent={accent} className="mx-auto max-w-5xl">
      <button className="focus-ring mb-5 inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white" onClick={() => onNavigate({ section: 'dashboard' })}>
        <ArrowLeft size={16} />Dashboard
      </button>
      <CosmicPageHeader
        title={course.title}
        eyebrow={course.shortTitle}
        meta={course.officialTitle}
        description={course.description}
        accent={accent}
      >
        <div className="flex flex-wrap gap-3 text-sm">
          <span className="rounded-full border border-white/8 bg-white/5 px-3 py-1.5 text-slate-200">{progress}% complete</span>
          <span className={`rounded-full border px-3 py-1.5 ${accent === 'blue' ? 'border-blue-300/15 bg-blue-300/8 text-blue-100' : 'border-violet-300/15 bg-violet-300/8 text-violet-100'}`}>
            Next: {recommended?.title ?? 'Review'}
          </span>
        </div>
      </CosmicPageHeader>
      <div className="mt-6"><TopicList course={course} completedTopicIds={state.completedTopicIds} onSelect={(topic) => onNavigate({ section: 'lesson', courseId, topicId: topic.id })} /></div>
    </div>
  );
};
EOF

cat > views/LessonWorkspaceView.tsx <<'EOF'
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
EOF

cat > views/MathLabView.tsx <<'EOF'
import React, { useState } from 'react';
import { FunctionSquare, Grid3X3, Move3D } from 'lucide-react';
import { MathLabId } from '../types';
import { FunctionExplorer } from '../components/labs/FunctionExplorer';
import { MatrixLab } from '../components/labs/MatrixLab';
import { VectorGeometryLab } from '../components/labs/VectorGeometryLab';
import { CosmicPageHeader } from '../components/cosmic/CosmicPageHeader';

interface MathLabViewProps { initialLab?: MathLabId; presetId?: string; }

export const MathLabView: React.FC<MathLabViewProps> = ({ initialLab = 'function', presetId }) => {
  const [active, setActive] = useState<MathLabId>(initialLab);
  const tabs = [
    { id: 'function' as const, label: 'Function Explorer', icon: FunctionSquare },
    { id: 'matrix' as const, label: 'Matrix Lab', icon: Grid3X3 },
    { id: 'vector-geometry' as const, label: 'Vector & Geometry', icon: Move3D },
  ];

  return (
    <div data-testid="math-lab-shell" className="cosmic-instrument-shell mx-auto max-w-7xl">
      <CosmicPageHeader title="Math Lab" eyebrow="Controlled interactive workspace" description="Explore curriculum-approved models without executing arbitrary expressions." accent="blue" />
      <div className="mt-6 flex flex-wrap gap-2" role="tablist" aria-label="Mathematics laboratories">
        {tabs.map(({ id, label, icon: Icon }) => (
          <button key={id} role="tab" aria-selected={active === id} className={`focus-ring cosmic-button inline-flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold ${active === id ? 'bg-gradient-to-r from-blue-400 to-cyan-300 text-slate-950' : 'cosmic-glass text-slate-200'}`} onClick={() => setActive(id)}>
            <Icon size={17} />{label}
          </button>
        ))}
      </div>
      <div className="mt-6">{active === 'function' ? <FunctionExplorer presetId={presetId} /> : active === 'matrix' ? <MatrixLab /> : <VectorGeometryLab />}</div>
    </div>
  );
};
EOF

cat > views/PracticeView.tsx <<'EOF'
import React, { useMemo, useState } from 'react';
import { CourseId, TopicId } from '../domain/curriculum';
import { COURSES, getCourse } from '../data/courseCatalog';
import { QuizRunner, QuizSubmission } from '../components/quiz/QuizRunner';
import { CosmicPageHeader } from '../components/cosmic/CosmicPageHeader';

interface PracticeViewProps { onComplete: (result: QuizSubmission) => void; }

export const PracticeView: React.FC<PracticeViewProps> = ({ onComplete }) => {
  const [courseId, setCourseId] = useState<CourseId>('math-analysis');
  const course = getCourse(courseId)!;
  const [topicId, setTopicId] = useState<TopicId>(course.topics[0].id);
  const [difficulty, setDifficulty] = useState<1 | 2 | 3>(2);
  React.useEffect(() => setTopicId(getCourse(courseId)!.topics[0].id), [courseId]);
  const topic = getCourse(courseId)!.topics.find((item) => item.id === topicId)!;
  const quiz = useMemo(() => ({
    ...topic.quiz,
    id: `practice-${topic.id}`,
    title: `${topic.title} guided practice`,
    questions: [...topic.practiceQuestions, ...topic.quiz.questions]
      .filter((question, index, array) => array.findIndex((item) => item.id === question.id) === index)
      .slice(0, Math.max(2, difficulty + 1)),
  }), [topic, difficulty]);

  return (
    <div data-testid="practice-shell" className="cosmic-assessment-shell mx-auto max-w-4xl">
      <CosmicPageHeader title="Practice" eyebrow="Guided problem solving" description="Filter structured questions by course, topic, and difficulty while keeping grading deterministic." accent="blue" />
      <div className="cosmic-glass mt-5 grid gap-4 rounded-2xl p-4 sm:grid-cols-3">
        <label className="text-sm text-slate-300">Course<select aria-label="Practice course" className="focus-ring mt-2 w-full rounded-lg border border-white/10 bg-slate-950 p-2" value={courseId} onChange={(e) => setCourseId(e.target.value as CourseId)}>{COURSES.map((item) => <option key={item.id} value={item.id}>{item.shortTitle}</option>)}</select></label>
        <label className="text-sm text-slate-300">Topic<select aria-label="Practice topic" className="focus-ring mt-2 w-full rounded-lg border border-white/10 bg-slate-950 p-2" value={topicId} onChange={(e) => setTopicId(e.target.value as TopicId)}>{getCourse(courseId)!.topics.map((item) => <option key={item.id} value={item.id}>{item.title}</option>)}</select></label>
        <label className="text-sm text-slate-300">Difficulty<select aria-label="Practice difficulty" className="focus-ring mt-2 w-full rounded-lg border border-white/10 bg-slate-950 p-2" value={difficulty} onChange={(e) => setDifficulty(Number(e.target.value) as 1 | 2 | 3)}><option value={1}>Foundation</option><option value={2}>Standard</option><option value={3}>Challenge</option></select></label>
      </div>
      <div className="cosmic-glass mt-5 rounded-2xl p-5"><QuizRunner key={`${courseId}-${topicId}-${difficulty}`} courseId={courseId} topicId={topicId} quiz={quiz} onComplete={onComplete} /></div>
    </div>
  );
};
EOF

cat > views/ExamsView.tsx <<'EOF'
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
EOF

cat > views/ProgressView.tsx <<'EOF'
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
EOF

cat > views/FormulaWorkspaceView.tsx <<'EOF'
import React from 'react';
import { Bookmark, Trash2 } from 'lucide-react';
import { COURSES } from '../data/courseCatalog';
import { MathCsState, SavedFormula } from '../utils/mathCsStorage';
import { MathRenderer } from '../components/MathRenderer';
import { CosmicPageHeader } from '../components/cosmic/CosmicPageHeader';

interface FormulaWorkspaceViewProps { state: MathCsState; onSave: (formula: SavedFormula) => void; onRemove: (id: string) => void; onNote: (id: string, note: string) => void; }

export const FormulaWorkspaceView: React.FC<FormulaWorkspaceViewProps> = ({ state, onSave, onRemove, onNote }) => (
  <div data-testid="formula-workspace-shell" className="cosmic-notation-shell mx-auto max-w-5xl">
    <CosmicPageHeader title="Formula Workspace" eyebrow="Technical notebook" description="Save curriculum formulas by reference; local notes are plain text and limited to 500 characters." accent="violet" />
    <div className="mt-6 space-y-8">
      {COURSES.map((course) => <section key={course.id}><h2 className="text-xl font-bold text-white">{course.shortTitle} · {course.title}</h2><div className="mt-4 grid gap-4 lg:grid-cols-2">{course.topics.flatMap((topic) => topic.formulas.map((formula) => { const saved = state.savedFormulas.find((item) => item.formulaId === formula.id); return <article key={formula.id} className="cosmic-glass cosmic-card rounded-2xl p-5"><div className="flex items-start justify-between gap-3"><div><p className="text-xs uppercase tracking-wider text-slate-500">{topic.title}</p><h3 className="mt-1 font-semibold text-white">{formula.label}</h3></div><button aria-label={saved ? `Remove ${formula.label}` : `Save ${formula.label}`} className="focus-ring rounded-lg border border-white/10 p-2" onClick={() => saved ? onRemove(formula.id) : onSave({ formulaId: formula.id, courseId: course.id, topicId: topic.id, note: '' })}>{saved ? <Trash2 size={17} /> : <Bookmark size={17} />}</button></div><div className="formula-panel mt-4"><MathRenderer expression={formula.latex} /></div><p className="mt-3 text-sm text-slate-400">{formula.explanation}</p>{saved && <label className="mt-4 block text-sm text-slate-300">Local note<textarea aria-label={`Note for ${formula.label}`} maxLength={500} value={saved.note} onChange={(event) => onNote(formula.id, event.target.value.slice(0, 500))} className="focus-ring mt-2 w-full rounded-lg border border-white/10 bg-slate-950 p-3 text-white" rows={3} /><span className="mt-1 block text-right text-xs text-slate-500">{saved.note.length}/500</span></label>}</article>; }))}</div></section>)}
    </div>
  </div>
);
EOF

cat > views/AIChatView.tsx <<'EOF'
import React, { useState } from 'react';
import { Send } from 'lucide-react';
import { AppDestination } from '../types';
import { getLocalMathSuggestion, MATH_CS_SYSTEM_INSTRUCTION } from '../services/geminiService';
import { CosmicPageHeader } from '../components/cosmic/CosmicPageHeader';

interface AIChatViewProps { context?: AppDestination; onNavigate?: (destination: AppDestination) => void; }

export const AIChatView: React.FC<AIChatViewProps> = ({ context }) => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<{ role: 'user' | 'assistant'; text: string }[]>([
    { role: 'assistant', text: 'I am the Math-CS Assistant. I support Mathematical Analysis and Linear Algebra & Geometry with one step at a time. Show your attempt, and I will help diagnose the next step.' },
  ]);
  const send = (event: React.FormEvent) => {
    event.preventDefault();
    const message = input.trim();
    if (!message) return;
    setMessages((current) => [...current, { role: 'user', text: message }, { role: 'assistant', text: getLocalMathSuggestion(message) }]);
    setInput('');
  };

  return (
    <div data-testid="assistant-shell" className="cosmic-console-shell mx-auto max-w-4xl">
      <CosmicPageHeader title="Math-CS Assistant" eyebrow="Local bounded guidance" description={context?.topicId ? `Active topic: ${context.topicId.replaceAll('-', ' ')}` : 'One careful step at a time across the approved curriculum.'} accent="blue" />
      <div className="cosmic-glass mt-5 space-y-3 rounded-2xl p-5" aria-live="polite">{messages.map((message, index) => <div key={index} className={`max-w-[85%] rounded-xl border p-3 text-sm leading-6 ${message.role === 'assistant' ? 'border-blue-300/10 bg-blue-300/7 text-blue-50' : 'ml-auto border-white/8 bg-white/8 text-white'}`}>{message.text}</div>)}</div>
      <form onSubmit={send} className="mt-4 flex gap-2"><label className="sr-only" htmlFor="assistant-message">Your mathematics question</label><input id="assistant-message" value={input} onChange={(event) => setInput(event.target.value)} className="focus-ring min-w-0 flex-1 rounded-xl border border-white/10 bg-slate-950/90 p-3 text-white" placeholder="Show your attempted step…" /><button className="focus-ring cosmic-button rounded-xl bg-gradient-to-r from-blue-400 to-cyan-300 px-4 text-slate-950" aria-label="Send message"><Send size={18} /></button></form>
      <details className="mt-4 text-xs text-slate-500"><summary>Assistant scope</summary><p className="mt-2">{MATH_CS_SYSTEM_INSTRUCTION}</p></details>
    </div>
  );
};
EOF

# Add visual-system assertions without weakening existing behavior checks.
python - <<'PY'
from pathlib import Path
updates = {
  'views/LessonWorkspaceView.test.tsx': ("expect(screen.getByText('Factor (x^2-1)/(x-1).')).toBeInTheDocument();", "expect(screen.getByText('Factor (x^2-1)/(x-1).')).toBeInTheDocument(); expect(screen.getByTestId('lesson-workspace-shell')).toHaveClass('cosmic-reading-shell');"),
  'views/MathLabView.test.tsx': ("expect(screen.getByRole('tab',{name:/Function Explorer/})).toHaveAttribute('aria-selected','true');", "expect(screen.getByRole('tab',{name:/Function Explorer/})).toHaveAttribute('aria-selected','true');expect(screen.getByTestId('math-lab-shell')).toHaveClass('cosmic-instrument-shell');"),
  'views/PracticeView.test.tsx': ("expect(screen.getByRole('heading',{name:'Practice'})).toBeInTheDocument();", "expect(screen.getByRole('heading',{name:'Practice'})).toBeInTheDocument();expect(screen.getByTestId('practice-shell')).toHaveClass('cosmic-assessment-shell');"),
  'views/ExamsView.test.tsx': ("expect(screen.getByText('Combined review exam')).toBeInTheDocument();", "expect(screen.getByText('Combined review exam')).toBeInTheDocument();expect(screen.getByTestId('exams-shell')).toHaveClass('cosmic-assessment-shell');"),
  'views/ProgressView.test.tsx': ("expect(screen.getByText(/limits · 50%/)).toBeInTheDocument();", "expect(screen.getByText(/limits · 50%/)).toBeInTheDocument();expect(screen.getByTestId('progress-shell')).toBeInTheDocument();"),
  'views/FormulaWorkspaceView.test.tsx': ("expect(save).toHaveBeenCalledWith(expect.objectContaining({formulaId:'functions-graphs-formula'}));", "expect(save).toHaveBeenCalledWith(expect.objectContaining({formulaId:'functions-graphs-formula'}));expect(screen.getByTestId('formula-workspace-shell')).toHaveClass('cosmic-notation-shell');"),
  'views/__tests__/AIChatView.test.tsx': ("expect(document.body.textContent).not.toMatch(/biotech|DNA|population|radioactive|differential equations/i);", "expect(document.body.textContent).not.toMatch(/biotech|DNA|population|radioactive|differential equations/i);expect(screen.getByTestId('assistant-shell')).toHaveClass('cosmic-console-shell');"),
}
for path, (old, new) in updates.items():
    p = Path(path)
    text = p.read_text()
    if old not in text:
        raise SystemExit(f'missing expected test text in {path}')
    p.write_text(text.replace(old, new))
PY

cat >> index.css <<'EOF'

.cosmic-reading-shell {
  position: relative;
}

.cosmic-reading-shell::before {
  content: "";
  pointer-events: none;
  position: fixed;
  inset: 4rem 2rem 2rem calc(18rem + 2rem);
  z-index: -1;
  background: radial-gradient(circle at 76% 16%, rgba(98, 168, 255, 0.045), transparent 30%);
}

.cosmic-instrument-shell .notebook-panel,
.cosmic-instrument-shell .cosmic-glass {
  border-color: rgba(98, 168, 255, 0.16);
}

.cosmic-assessment-shell {
  --assessment-surface: rgba(7, 17, 31, 0.86);
}

.cosmic-assessment-shell .cosmic-glass {
  background: linear-gradient(145deg, var(--assessment-surface), rgba(3, 7, 17, 0.84));
}

.cosmic-notation-shell {
  position: relative;
}

.cosmic-notation-shell::before {
  content: "∫   Σ   Aλ = λv   det(A)";
  pointer-events: none;
  position: fixed;
  right: 3vw;
  top: 7rem;
  z-index: -1;
  color: rgba(167, 139, 250, 0.035);
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
  font-size: clamp(2rem, 5vw, 5rem);
  letter-spacing: .2em;
  transform: rotate(-5deg);
}

.cosmic-console-shell .cosmic-glass {
  border-color: rgba(98, 168, 255, 0.14);
  background: linear-gradient(145deg, rgba(6, 18, 33, 0.92), rgba(3, 8, 17, 0.9));
}

@media (max-width: 767px) {
  .cosmic-reading-shell::before,
  .cosmic-notation-shell::before {
    display: none;
  }
}
EOF

npm test -- components/cosmic/CosmicPageHeader.test.tsx views/CourseHubView.test.tsx views/LessonWorkspaceView.test.tsx views/MathLabView.test.tsx views/PracticeView.test.tsx views/ExamsView.test.tsx views/ProgressView.test.tsx views/FormulaWorkspaceView.test.tsx views/__tests__/AIChatView.test.tsx
npm run typecheck
npm run verify
npm run build:pages
