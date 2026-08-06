import { CourseDefinition, CourseId, TopicDefinition, TopicId } from '../domain/curriculum';
import { linearAlgebraGeometryCourse } from './courses/linearAlgebraGeometry';
import { mathAnalysisCourse } from './courses/mathAnalysis';

export const COURSES: readonly CourseDefinition[] = Object.freeze([
  mathAnalysisCourse,
  linearAlgebraGeometryCourse,
]);

const normalize = (value: string): string => value
  .normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '')
  .toLowerCase()
  .trim();

export const getCourse = (courseId: CourseId): CourseDefinition | undefined =>
  COURSES.find((course) => course.id === courseId);

export const getTopic = (courseId: CourseId, topicId: TopicId): TopicDefinition | undefined =>
  getCourse(courseId)?.topics.find((topic) => topic.id === topicId);

export const searchTopics = (
  query: string,
  limit = 6,
): { course: CourseDefinition; topic: TopicDefinition }[] => {
  const tokens = normalize(query).split(/\s+/).filter(Boolean);
  if (tokens.length === 0) return [];
  return COURSES.flatMap((course) => course.topics.map((topic) => ({ course, topic })))
    .filter(({ course, topic }) => {
      const text = normalize(`${course.title} ${course.officialTitle} ${topic.title} ${topic.description} ${topic.learningObjectives.join(' ')}`);
      return tokens.every((token) => text.includes(token));
    })
    .sort((a, b) => {
      const aTitle = normalize(a.topic.title);
      const bTitle = normalize(b.topic.title);
      const q = normalize(query);
      return Number(!aTitle.startsWith(q)) - Number(!bTitle.startsWith(q)) || aTitle.localeCompare(bTitle);
    })
    .slice(0, limit);
};
