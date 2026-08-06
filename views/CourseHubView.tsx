import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { CourseId } from '../domain/curriculum';
import { AppDestination } from '../types';
import { getCourse } from '../data/courseCatalog';
import { MathCsState } from '../utils/mathCsStorage';
import { getCourseProgress, getRecommendedTopic } from '../utils/progress';
import { TopicList } from '../components/course/TopicList';

interface CourseHubViewProps { courseId: CourseId; state: MathCsState; onNavigate: (destination: AppDestination) => void; }
export const CourseHubView: React.FC<CourseHubViewProps> = ({ courseId, state, onNavigate }) => {
  const course = getCourse(courseId);
  if (!course) return null;
  const recommended = getRecommendedTopic(state, course);
  return <div className="mx-auto max-w-5xl"><button className="focus-ring mb-5 inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white" onClick={() => onNavigate({ section: 'dashboard' })}><ArrowLeft size={16} />Dashboard</button><header className="notebook-panel mb-6 p-6 md:p-8"><p className="text-xs font-bold uppercase tracking-[0.18em] text-cyan-300">{course.shortTitle}</p><h1 className="mt-2 text-3xl font-bold text-white md:text-4xl">{course.title}</h1><p className="mt-2 text-slate-400">{course.officialTitle}</p><p className="mt-5 max-w-3xl leading-7 text-slate-300">{course.description}</p><div className="mt-5 flex flex-wrap gap-3 text-sm"><span className="rounded-full bg-white/5 px-3 py-1.5 text-slate-200">{getCourseProgress(state, course)}% complete</span><span className="rounded-full bg-cyan-300/8 px-3 py-1.5 text-cyan-100">Next: {recommended?.title ?? 'Review'}</span></div></header><TopicList course={course} completedTopicIds={state.completedTopicIds} onSelect={(topic) => onNavigate({ section: 'lesson', courseId, topicId: topic.id })} /></div>;
};
