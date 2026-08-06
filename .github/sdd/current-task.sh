#!/usr/bin/env bash
set -euo pipefail
mkdir -p components/cosmic

cat > components/cosmic/CosmicHero.test.tsx <<'EOF'
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { CosmicHero } from './CosmicHero';

describe('CosmicHero', () => {
  it('renders a readable cinematic header with a decorative Pages-aware image', () => {
    render(
      <CosmicHero
        title="Inmerson Math-CS"
        tagline="Interactive Mathematics for Computer Science"
        description="Academic workspace"
      />,
    );
    expect(screen.getByRole('heading', { level: 1, name: 'Inmerson Math-CS' })).toBeInTheDocument();
    expect(screen.getByText('Interactive Mathematics for Computer Science')).toBeInTheDocument();
    expect(screen.getByTestId('black-hole-hero')).toHaveClass('cosmic-hero-fallback');
    const image = screen.getByTestId('black-hole-image');
    expect(image).toHaveAttribute('alt', '');
    expect(image).toHaveAttribute('src', expect.stringContaining('assets/cosmic/black-hole-hero.webp'));
  });
});
EOF

if npm test -- components/cosmic/CosmicHero.test.tsx; then
  echo 'Expected RED for missing CosmicHero.' >&2
  exit 1
else
  echo 'RED confirmed: CosmicHero is not implemented.'
fi

cat > components/cosmic/CosmicHero.tsx <<'EOF'
import React from 'react';

interface CosmicHeroProps {
  title: string;
  tagline: string;
  description: string;
}

export const CosmicHero: React.FC<CosmicHeroProps> = ({ title, tagline, description }) => {
  const [imageFailed, setImageFailed] = React.useState(false);
  const heroSrc = `${import.meta.env.BASE_URL}assets/cosmic/black-hole-hero.webp`;

  return (
    <header
      data-testid="black-hole-hero"
      className="cosmic-hero cosmic-hero-fallback cosmic-glass relative isolate overflow-hidden rounded-[1.75rem]"
    >
      <div className="cosmic-hero__image" aria-hidden="true">
        {!imageFailed && (
          <img
            data-testid="black-hole-image"
            src={heroSrc}
            alt=""
            decoding="async"
            fetchPriority="high"
            onError={() => setImageFailed(true)}
          />
        )}
      </div>
      <div className="cosmic-hero__scrim" aria-hidden="true" />
      <div className="cosmic-hero__content relative z-10">
        <p className="text-xs font-bold uppercase tracking-[0.24em] text-blue-200">{tagline}</p>
        <h1 className="mt-4 max-w-3xl text-4xl font-bold tracking-[-0.035em] text-white sm:text-5xl lg:text-6xl">{title}</h1>
        <p className="mt-5 max-w-2xl text-base leading-7 text-slate-300 sm:text-lg sm:leading-8">{description}</p>
        <div className="mt-7 flex max-w-xl items-center" aria-hidden="true">
          <span className="cosmic-divider flex-1" />
          <span className="size-2 rounded-full bg-blue-200 shadow-[0_0_18px_rgba(183,232,255,.9)]" />
        </div>
      </div>
    </header>
  );
};
EOF

cat > components/cosmic/UtilityCard.tsx <<'EOF'
import React from 'react';
import { ArrowRight } from 'lucide-react';

interface UtilityCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  accent: 'blue' | 'violet';
  onActivate: () => void;
  decoration?: React.ReactNode;
}

const variants = {
  blue: {
    icon: 'border-blue-300/18 bg-blue-400/10 text-blue-200',
    button: 'from-blue-500/85 to-indigo-500/85 text-white',
    glow: 'cosmic-glow-blue',
  },
  violet: {
    icon: 'border-violet-300/18 bg-violet-400/10 text-violet-200',
    button: 'from-violet-500/85 to-indigo-500/85 text-white',
    glow: 'cosmic-glow-violet',
  },
} as const;

export const UtilityCard: React.FC<UtilityCardProps> = ({
  title,
  description,
  icon,
  accent,
  onActivate,
  decoration,
}) => {
  const variant = variants[accent];
  return (
    <button
      type="button"
      onClick={onActivate}
      className={`focus-ring cosmic-glass cosmic-card ${variant.glow} group relative flex min-h-28 w-full items-center gap-4 overflow-hidden rounded-2xl p-5 text-left`}
      aria-label={`${title}: ${description}`}
    >
      <span className={`relative z-10 grid size-14 shrink-0 place-items-center rounded-2xl border ${variant.icon}`}>
        {icon}
      </span>
      <span className="relative z-10 min-w-0 flex-1">
        <span className="block text-lg font-semibold text-white">{title}</span>
        <span className="mt-1 block text-sm leading-6 text-slate-400">{description}</span>
      </span>
      <span className={`cosmic-button relative z-10 hidden shrink-0 items-center gap-2 rounded-xl bg-gradient-to-r px-4 py-2 text-sm font-semibold sm:inline-flex ${variant.button}`}>
        Open <ArrowRight size={16} />
      </span>
      {decoration && <span className="pointer-events-none absolute inset-y-0 right-0 w-2/5 opacity-35" aria-hidden="true">{decoration}</span>}
    </button>
  );
};
EOF

cat > views/DashboardView.test.tsx <<'EOF'
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { createDefaultMathCsState } from '../utils/mathCsStorage';
import { DashboardView } from './DashboardView';

describe('DashboardView', () => {
  it('composes the cinematic hero, search, courses, and learning tools', () => {
    const onNavigate = vi.fn();
    render(<DashboardView state={createDefaultMathCsState()} onNavigate={onNavigate} />);
    expect(screen.getByRole('heading', { level: 1, name: 'Inmerson Math-CS' })).toBeInTheDocument();
    expect(screen.getByRole('searchbox', { name: 'Search course topics' })).toBeInTheDocument();
    expect(screen.getAllByTestId('course-card')).toHaveLength(2);
    expect(screen.getByText('Analiza matematyczna')).toBeInTheDocument();
    expect(screen.getByText('Algebra liniowa i geometria')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Math Lab/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Formula Workspace/i })).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /Math Lab/i }));
    expect(onNavigate).toHaveBeenCalledWith({ section: 'math-lab' });
  });
});
EOF

if npm test -- views/DashboardView.test.tsx; then
  echo 'Expected RED before Dashboard composed the new hero and semantic tool cards.' >&2
  exit 1
else
  echo 'RED confirmed: Dashboard composition is not implemented.'
fi

cat > views/DashboardView.tsx <<'EOF'
import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Atom, FlaskConical, Library, Search, Sigma } from 'lucide-react';
import { BRAND_DESCRIPTION, BRAND_NAME, BRAND_TAGLINE } from '../data/branding';
import { COURSES } from '../data/courseCatalog';
import { searchLearningDestinations } from '../data/learningCatalog';
import { AppDestination } from '../types';
import { MathCsState } from '../utils/mathCsStorage';
import { getCourseProgress, getRecommendedTopic } from '../utils/progress';
import { CourseCard } from '../components/course/CourseCard';
import { CosmicHero } from '../components/cosmic/CosmicHero';
import { UtilityCard } from '../components/cosmic/UtilityCard';

interface DashboardProps {
  state: MathCsState;
  onNavigate: (destination: AppDestination) => void;
}

export const DashboardView: React.FC<DashboardProps> = ({ state, onNavigate }) => {
  const [query, setQuery] = React.useState('');
  const results = searchLearningDestinations(query);

  return (
    <motion.div initial={false} animate={{ opacity: 1, y: 0 }} className="mx-auto max-w-[1320px]">
      <CosmicHero title={BRAND_NAME} tagline={BRAND_TAGLINE} description={BRAND_DESCRIPTION} />

      <section aria-label="Search mathematics topics" className="relative z-20 mx-auto -mt-6 mb-8 max-w-4xl px-4 sm:px-8">
        <div className="cosmic-glass relative rounded-2xl shadow-[0_22px_65px_rgba(0,0,0,.34)]">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-200/70" size={19} />
          <label className="sr-only" htmlFor="course-search">Search course topics</label>
          <input
            id="course-search"
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search limits, matrices, eigenvalues…"
            className="focus-ring h-14 w-full rounded-2xl bg-transparent pl-12 pr-4 text-white outline-none placeholder:text-slate-500"
          />
          {query && (
            <div className="cosmic-glass absolute left-0 right-0 top-[calc(100%+.6rem)] z-30 rounded-2xl p-2 shadow-2xl">
              {results.length ? results.map((result) => (
                <button
                  key={result.topic.id}
                  type="button"
                  className="focus-ring flex w-full items-center justify-between rounded-xl p-3 text-left hover:bg-white/5"
                  onClick={() => onNavigate(result.destination)}
                >
                  <span>
                    <span className="block font-semibold text-white">{result.topic.title}</span>
                    <span className="text-xs text-slate-500">{result.course.shortTitle}</span>
                  </span>
                  <ArrowRight size={16} />
                </button>
              )) : <p className="p-3 text-sm text-slate-400">No matching topic</p>}
            </div>
          )}
        </div>
      </section>

      <section className="grid gap-5 lg:grid-cols-2" aria-label="Courses">
        {COURSES.map((course) => {
          const quizzes = state.quizResults.filter((result) => result.courseId === course.id);
          return (
            <CourseCard
              key={course.id}
              course={course}
              progress={getCourseProgress(state, course)}
              completedCount={course.topics.filter((topic) => state.completedTopicIds.includes(topic.id)).length}
              recommendedTopic={getRecommendedTopic(state, course)}
              latestQuiz={quizzes.at(-1)}
              onNavigate={onNavigate}
            />
          );
        })}
      </section>

      <section className="mt-6 grid gap-4 lg:grid-cols-2" aria-label="Learning tools">
        <UtilityCard
          title="Math Lab"
          description="Explore approved function, matrix, and vector presets."
          icon={<FlaskConical />}
          accent="blue"
          onActivate={() => onNavigate({ section: 'math-lab' })}
          decoration={<div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,rgba(98,168,255,.45),transparent_34%)]"><Atom className="absolute right-7 top-1/2 -translate-y-1/2 text-blue-200" size={58} /></div>}
        />
        <UtilityCard
          title="Formula Workspace"
          description="Keep formulas and your local notes together."
          icon={<Library />}
          accent="violet"
          onActivate={() => onNavigate({ section: 'formulas' })}
          decoration={<div className="absolute inset-0 bg-[radial-gradient(circle_at_72%_48%,rgba(167,139,250,.36),transparent_36%)]"><Sigma className="absolute right-8 top-1/2 -translate-y-1/2 text-violet-200" size={56} /></div>}
        />
      </section>
    </motion.div>
  );
};
EOF

cat >> index.css <<'EOF'

.cosmic-hero {
  min-height: 31rem;
  background:
    radial-gradient(circle at 78% 36%, rgba(244, 215, 170, 0.08), transparent 29%),
    linear-gradient(135deg, rgba(4, 10, 21, 0.98), rgba(7, 17, 31, 0.88));
}

.cosmic-hero-fallback {
  background-color: #030711;
}

.cosmic-hero__image {
  position: absolute;
  inset: 0;
  overflow: hidden;
}

.cosmic-hero__image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  filter: saturate(.92) contrast(1.04);
  transform: scale(1.01);
}

.cosmic-hero__scrim {
  position: absolute;
  inset: 0;
  background:
    linear-gradient(90deg, rgba(3, 7, 17, .98) 0%, rgba(3, 7, 17, .9) 32%, rgba(3, 7, 17, .32) 68%, rgba(3, 7, 17, .12) 100%),
    linear-gradient(0deg, rgba(3, 7, 17, .72), transparent 48%);
}

.cosmic-hero__content {
  max-width: 49rem;
  padding: clamp(2rem, 5vw, 4.5rem);
  padding-top: clamp(3.25rem, 8vw, 6.25rem);
}
EOF

npm test -- components/cosmic/CosmicHero.test.tsx views/DashboardView.test.tsx
npm run build
npm run verify
npm run build:pages
