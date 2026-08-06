#!/usr/bin/env bash
set -euo pipefail
mkdir -p components/cosmic

cat > utils/progress.test.ts <<'EOF'
import { describe, expect, it } from 'vitest';
import { COURSES } from '../data/courseCatalog';
import { mathAnalysisCourse } from '../data/courses/mathAnalysis';
import { createDefaultMathCsState } from './mathCsStorage';
import { getCourseProgress, getOverallProgress, getRecommendedTopic, markTopicComplete, recordQuizResult } from './progress';

describe('Math-CS progress', () => {
  it('calculates completion percentage', () => {
    const emptyState = createDefaultMathCsState();
    expect(getCourseProgress(emptyState, mathAnalysisCourse)).toBe(0);
    const stateWithFour = mathAnalysisCourse.topics.slice(0, 4)
      .reduce((state, topic) => markTopicComplete(state, topic.id), emptyState);
    expect(getCourseProgress(stateWithFour, mathAnalysisCourse)).toBe(50);
  });

  it('calculates overall completion across both courses', () => {
    const empty = createDefaultMathCsState();
    expect(getOverallProgress(empty, COURSES)).toBe(0);
    const firstHalf = COURSES[0].topics.slice(0, 4)
      .reduce((state, topic) => markTopicComplete(state, topic.id), empty);
    expect(getOverallProgress(firstHalf, COURSES)).toBe(24);
  });

  it('records deterministic quiz percentages and preserves the best result', () => {
    const emptyState = createDefaultMathCsState();
    const first = recordQuizResult(emptyState, 'math-analysis', 'limits', 4, 5, '2026-08-01T00:00:00.000Z');
    expect(first.quizResults[0].percentage).toBe(80);
    const lower = recordQuizResult(first, 'math-analysis', 'limits', 2, 5, '2026-08-02T00:00:00.000Z');
    expect(lower.quizResults[0].percentage).toBe(80);
    expect(lower.quizResults[0].completedAt).toBe('2026-08-02T00:00:00.000Z');
  });

  it('recommends the next prerequisite-ready topic', () => {
    const state = markTopicComplete(createDefaultMathCsState(), 'functions-graphs');
    expect(getRecommendedTopic(state, mathAnalysisCourse)?.id).toBe('sequences');
  });
});
EOF

if npm test -- utils/progress.test.ts; then
  echo 'Expected RED for missing getOverallProgress.' >&2
  exit 1
else
  echo 'RED confirmed: getOverallProgress is not implemented.'
fi

cat > utils/progress.ts <<'EOF'
import { CourseDefinition, CourseId, TopicId } from '../domain/curriculum';
import { MathCsState, SavedFormula } from './mathCsStorage';

export const markTopicComplete = (state: MathCsState, topicId: TopicId): MathCsState => ({
  ...state,
  completedTopicIds: [...new Set([...state.completedTopicIds, topicId])],
});

export const recordQuizResult = (
  state: MathCsState,
  courseId: CourseId,
  topicId: TopicId,
  score: number,
  total: number,
  completedAt = new Date().toISOString(),
): MathCsState => {
  const percentage = total > 0 ? Math.round((score / total) * 100) : 0;
  const existing = state.quizResults.find((result) => result.courseId === courseId && result.topicId === topicId);
  const best = existing && existing.percentage > percentage
    ? { ...existing, completedAt }
    : { courseId, topicId, score, total, percentage, completedAt };
  return {
    ...state,
    quizResults: [
      ...state.quizResults.filter((result) => result.courseId !== courseId || result.topicId !== topicId),
      best,
    ],
  };
};

export const saveFormula = (state: MathCsState, formula: SavedFormula): MathCsState => ({
  ...state,
  savedFormulas: [
    ...state.savedFormulas.filter((item) => item.formulaId !== formula.formulaId),
    formula,
  ],
});

export const removeFormula = (state: MathCsState, formulaId: string): MathCsState => ({
  ...state,
  savedFormulas: state.savedFormulas.filter((formula) => formula.formulaId !== formulaId),
});

export const saveFormulaNote = (state: MathCsState, formulaId: string, note: string): MathCsState => ({
  ...state,
  savedFormulas: state.savedFormulas.map((formula) => formula.formulaId === formulaId ? { ...formula, note } : formula),
});

export const getCourseProgress = (state: MathCsState, course: CourseDefinition): number => {
  if (course.topics.length === 0) return 0;
  const completed = course.topics.filter((topic) => state.completedTopicIds.includes(topic.id)).length;
  return Math.round((completed / course.topics.length) * 100);
};

export const getOverallProgress = (
  state: MathCsState,
  courses: readonly CourseDefinition[],
): number => {
  const topics = courses.flatMap((course) => course.topics);
  if (topics.length === 0) return 0;
  const completed = topics.filter((topic) => state.completedTopicIds.includes(topic.id)).length;
  return Math.round((completed / topics.length) * 100);
};

export const getRecommendedTopic = (state: MathCsState, course: CourseDefinition) =>
  course.topics.find((topic) => !state.completedTopicIds.includes(topic.id)
    && topic.prerequisites.every((prerequisite) => state.completedTopicIds.includes(prerequisite)))
  ?? course.topics.find((topic) => !state.completedTopicIds.includes(topic.id));
EOF

cat > components/cosmic/CosmicProgressRing.test.tsx <<'EOF'
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { CosmicProgressRing } from './CosmicProgressRing';

describe('CosmicProgressRing', () => {
  it('clamps the percentage and exposes an accessible label', () => {
    render(<CosmicProgressRing value={142} label="Overall progress" />);
    expect(screen.getByRole('img', { name: 'Overall progress: 100%' })).toBeInTheDocument();
    expect(screen.getByText('100%')).toBeInTheDocument();
  });
});
EOF

if npm test -- components/cosmic/CosmicProgressRing.test.tsx; then
  echo 'Expected RED for missing CosmicProgressRing.' >&2
  exit 1
else
  echo 'RED confirmed: CosmicProgressRing is not implemented.'
fi

cat > components/cosmic/CosmicProgressRing.tsx <<'EOF'
import React from 'react';

interface CosmicProgressRingProps {
  value: number;
  label: string;
  size?: 'sm' | 'md' | 'lg';
  accent?: 'blue' | 'violet';
}

export const CosmicProgressRing: React.FC<CosmicProgressRingProps> = ({
  value,
  label,
  size = 'md',
  accent = 'blue',
}) => {
  const safeValue = Math.min(100, Math.max(0, Math.round(value)));
  return (
    <div
      role="img"
      aria-label={`${label}: ${safeValue}%`}
      className={`cosmic-progress-ring cosmic-progress-ring--${size} cosmic-progress-ring--${accent}`}
      style={{ '--progress': `${safeValue * 3.6}deg` } as React.CSSProperties}
    >
      <span>{safeValue}%</span>
    </div>
  );
};
EOF

cat > components/cosmic/CosmicLogoMark.tsx <<'EOF'
import React from 'react';

interface CosmicLogoMarkProps {
  className?: string;
  size?: number;
}

export const CosmicLogoMark: React.FC<CosmicLogoMarkProps> = ({ className = '', size = 42 }) => (
  <svg
    aria-hidden="true"
    focusable="false"
    viewBox="0 0 64 64"
    width={size}
    height={size}
    className={className}
  >
    <defs>
      <radialGradient id="cosmic-logo-core" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#01030a" />
        <stop offset="68%" stopColor="#02050d" />
        <stop offset="100%" stopColor="#101b32" />
      </radialGradient>
      <linearGradient id="cosmic-logo-ring" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#b7e8ff" />
        <stop offset="45%" stopColor="#62a8ff" />
        <stop offset="100%" stopColor="#a78bfa" />
      </linearGradient>
      <filter id="cosmic-logo-glow" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation="2.4" result="blur" />
        <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
      </filter>
    </defs>
    <ellipse cx="32" cy="32" rx="27" ry="10" fill="none" stroke="url(#cosmic-logo-ring)" strokeWidth="3" opacity=".9" filter="url(#cosmic-logo-glow)" transform="rotate(-11 32 32)" />
    <circle cx="32" cy="32" r="15" fill="url(#cosmic-logo-core)" stroke="rgba(183,232,255,.55)" strokeWidth="1.5" />
    <path d="M8 35c9 6 39 7 49-3" fill="none" stroke="#f4d7aa" strokeWidth="1.4" opacity=".65" />
  </svg>
);
EOF

cat > components/cosmic/CourseVisual.tsx <<'EOF'
import React from 'react';
import { CourseId } from '../../domain/curriculum';

export const CourseVisual: React.FC<{ courseId: CourseId }> = ({ courseId }) => {
  if (courseId === 'math-analysis') {
    return (
      <svg data-testid="course-visual" data-course={courseId} aria-hidden="true" viewBox="0 0 220 130" className="h-auto w-full">
        <defs>
          <linearGradient id="analysis-line" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#67e8f9" /><stop offset="1" stopColor="#7c83ff" />
          </linearGradient>
        </defs>
        {[20, 40, 60, 80, 100].map((y) => <path key={y} d={`M12 ${y} C55 ${y - 28}, 85 ${y + 20}, 120 ${y - 12} S180 ${y - 25}, 208 ${y + 5}`} fill="none" stroke="rgba(98,168,255,.18)" strokeWidth="1" />)}
        <path d="M12 98 C48 92, 60 25, 94 54 S140 116, 208 25" fill="none" stroke="url(#analysis-line)" strokeWidth="3" />
        <circle cx="94" cy="54" r="4" fill="#b7e8ff" />
      </svg>
    );
  }

  return (
    <svg data-testid="course-visual" data-course={courseId} aria-hidden="true" viewBox="0 0 220 130" className="h-auto w-full">
      <defs>
        <linearGradient id="linear-line" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#a78bfa" /><stop offset="1" stopColor="#62a8ff" />
        </linearGradient>
      </defs>
      <g fill="none" stroke="url(#linear-line)" strokeWidth="1.7" opacity=".9">
        <path d="M75 35 132 18 177 50 120 69Z" /><path d="M75 35v57l45 25V69" /><path d="M120 69v48l57-25V50" />
        <path d="M120 69 132 18M120 69 177 50M120 69 75 35" opacity=".45" />
        <path d="M24 104h174M120 120V12" opacity=".38" />
      </g>
      <g fill="#c4b5fd"><circle cx="75" cy="35" r="3" /><circle cx="132" cy="18" r="3" /><circle cx="177" cy="50" r="3" /><circle cx="120" cy="69" r="4" /></g>
    </svg>
  );
};
EOF

cat >> index.css <<'EOF'

.cosmic-progress-ring {
  --ring-color: var(--cosmic-blue);
  --ring-secondary: var(--cosmic-cyan);
  --ring-size: 5rem;
  position: relative;
  display: grid;
  width: var(--ring-size);
  aspect-ratio: 1;
  place-items: center;
  isolation: isolate;
  border-radius: 999px;
  background: conic-gradient(from -90deg, var(--ring-color) 0 var(--progress), rgba(148, 163, 184, 0.14) var(--progress) 360deg);
  box-shadow: 0 0 28px color-mix(in srgb, var(--ring-color) 20%, transparent), inset 0 0 0 1px rgba(255,255,255,.06);
}

.cosmic-progress-ring::before {
  content: "";
  position: absolute;
  inset: 6px;
  z-index: -1;
  border: 1px solid rgba(165, 190, 225, 0.13);
  border-radius: inherit;
  background: radial-gradient(circle at 45% 35%, rgba(20, 38, 62, 0.96), rgba(3, 7, 17, 0.98) 72%);
}

.cosmic-progress-ring > span {
  color: var(--cosmic-text);
  font-size: 1rem;
  font-weight: 700;
  letter-spacing: -0.02em;
}

.cosmic-progress-ring--sm { --ring-size: 3.5rem; }
.cosmic-progress-ring--sm > span { font-size: .76rem; }
.cosmic-progress-ring--md { --ring-size: 5rem; }
.cosmic-progress-ring--lg { --ring-size: 7rem; }
.cosmic-progress-ring--lg > span { font-size: 1.45rem; }
.cosmic-progress-ring--blue { --ring-color: var(--cosmic-blue); --ring-secondary: var(--cosmic-cyan); }
.cosmic-progress-ring--violet { --ring-color: var(--cosmic-violet); --ring-secondary: var(--cosmic-indigo); }
EOF

npm test -- utils/progress.test.ts components/cosmic/CosmicProgressRing.test.tsx
npm run typecheck
npm run verify
npm run build:pages
