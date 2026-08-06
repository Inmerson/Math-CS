import { CourseDefinition, TopicDefinition } from '../domain/curriculum';
import { AppDestination } from '../types';
import { COURSES, searchTopics } from './courseCatalog';

export interface LearningDestination {
  course: CourseDefinition;
  topic: TopicDefinition;
  destination: AppDestination;
}

export const LEARNING_DESTINATIONS: LearningDestination[] = COURSES.flatMap((course) =>
  course.topics.map((topic) => ({
    course,
    topic,
    destination: { section: 'lesson', courseId: course.id, topicId: topic.id },
  })),
);

export const searchLearningDestinations = (query: string, limit = 6): LearningDestination[] =>
  searchTopics(query, limit).map(({ course, topic }) => ({
    course,
    topic,
    destination: { section: 'lesson', courseId: course.id, topicId: topic.id },
  }));
