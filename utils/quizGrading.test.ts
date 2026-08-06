import { describe, expect, it } from 'vitest';
import { PracticeQuestion, QuizDefinition } from '../domain/curriculum';
import { gradeQuestion, gradeQuiz } from './quizGrading';
const q = (kind: PracticeQuestion['kind'], answer: PracticeQuestion['answer'], tolerance?: number): PracticeQuestion => ({ id: kind, kind, prompt: kind, answer, tolerance, explanation: 'Review the worked example.' });
describe('quiz grading', () => {
  it('grades all supported response kinds', () => {
    expect(gradeQuestion(q('multiple-choice','A'),'A').correct).toBe(true);
    expect(gradeQuestion(q('numeric',2,0.1),2.1).correct).toBe(true);
    expect(gradeQuestion(q('ordered-steps',['first','second']),['second','first']).correct).toBe(false);
    expect(gradeQuestion(q('vector',[1,2],0.01),'1, 2.005').correct).toBe(true);
    expect(gradeQuestion(q('matrix',[[1,2],[3,4]],0.01),'1 2; 3').correct).toBe(false);
    expect(gradeQuestion(q('numeric',2),undefined).correct).toBe(false);
  });
  it('calculates deterministic integer percentages', () => {
    const quiz: QuizDefinition={id:'quiz',title:'Quiz',questions:[q('multiple-choice','A'),q('numeric',2),q('vector',[1,2])]};
    expect(gradeQuiz(quiz,{ 'multiple-choice':'A', numeric:'0', vector:'1 2' })).toMatchObject({score:2,total:3,percentage:67});
  });
});
