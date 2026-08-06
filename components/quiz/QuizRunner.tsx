import React, { useState } from 'react';
import { CourseId, QuizDefinition, TopicId } from '../../domain/curriculum';
import { QuizGrade, gradeQuiz } from '../../utils/quizGrading';

export interface QuizSubmission extends QuizGrade { courseId: CourseId; topicId: TopicId; }
interface QuizRunnerProps { courseId: CourseId; topicId: TopicId; quiz: QuizDefinition; onComplete: (result: QuizSubmission) => void; }

export const QuizRunner: React.FC<QuizRunnerProps> = ({ courseId, topicId, quiz, onComplete }) => {
  const [responses,setResponses]=useState<Record<string,unknown>>({});
  const [result,setResult]=useState<QuizGrade|null>(null);
  const answer = (id:string,value:unknown) => { if(!result) setResponses((current)=>({...current,[id]:value})); };
  const submit = (event:React.FormEvent) => { event.preventDefault(); if(result) return; const grade=gradeQuiz(quiz,responses); setResult(grade); onComplete({...grade,courseId,topicId}); };
  return <form onSubmit={submit} className="space-y-5"><div><h3 className="font-semibold text-white">{quiz.title}</h3><p className="mt-1 text-sm text-slate-400">Answer all you can; unanswered questions receive zero points.</p></div>{quiz.questions.map((question,index)=><fieldset key={question.id} className="rounded-xl border border-white/10 p-4" disabled={Boolean(result)}><legend className="px-1 font-medium text-white">{index+1}. {question.prompt}</legend>{question.kind==='multiple-choice' ? <div className="mt-3 space-y-2">{question.choices?.map((choice)=><label key={choice} className="flex cursor-pointer gap-3 rounded-lg border border-white/8 p-3 text-sm text-slate-200"><input type="radio" name={question.id} value={choice} checked={responses[question.id]===choice} onChange={()=>answer(question.id,choice)} />{choice}</label>)}</div> : <label className="mt-3 block text-sm text-slate-400">Your answer<input aria-label={`Answer for question ${index+1}`} className="focus-ring mt-2 w-full rounded-lg border border-white/10 bg-slate-950 p-3 text-white" value={String(responses[question.id]??'')} onChange={(event)=>answer(question.id,event.target.value)} placeholder={question.kind==='matrix'?'Rows separated by semicolons':'Enter a value'} /></label>}{result&&<p className={`mt-3 text-sm ${result.outcomes[index].correct?'text-emerald-300':'text-amber-200'}`}>{result.outcomes[index].feedback}</p>}</fieldset>)}<button type="submit" disabled={Boolean(result)} className="focus-ring rounded-xl bg-cyan-300 px-5 py-3 font-semibold text-slate-950 disabled:cursor-not-allowed disabled:opacity-60">{result?'Submitted':'Submit answers'}</button>{result&&<p role="status" className="rounded-xl border border-cyan-300/20 bg-cyan-300/8 p-4 font-semibold text-cyan-100">Score: {result.score}/{result.total} · {result.percentage}%</p>}</form>;
};
