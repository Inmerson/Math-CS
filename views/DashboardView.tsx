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
