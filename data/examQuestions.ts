import { COURSES } from './courseCatalog';
export const EXAM_QUESTIONS = COURSES.flatMap((course)=>course.topics.flatMap((topic)=>topic.quiz.questions));
export default EXAM_QUESTIONS;
