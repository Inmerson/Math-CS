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
