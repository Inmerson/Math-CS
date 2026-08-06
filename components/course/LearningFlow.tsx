import React from 'react';
import { BrainCircuit, Code2, Eye, ListChecks, Trophy } from 'lucide-react';
import { TopicDefinition } from '../../domain/curriculum';
import { MathRenderer } from '../MathRenderer';

interface LearningFlowProps { topic: TopicDefinition; onOpenLab: () => void; }
const stages = ['Learn', 'Visualize', 'Practice', 'CS Connection', 'Quiz'] as const;

export const LearningFlow: React.FC<LearningFlowProps> = ({ topic, onOpenLab }) => (
  <div className="space-y-5" data-testid="learning-flow">
    <section className="notebook-panel p-5" aria-labelledby="stage-learn"><h2 id="stage-learn" className="stage-title"><BrainCircuit />{stages[0]}</h2>{topic.sections.map((section) => <div key={section.id} className="mt-4"><h3 className="font-semibold text-white">{section.title}</h3><p className="mt-2 leading-7 text-slate-300">{section.markdown}</p></div>)}{topic.formulas.map((formula) => <div key={formula.id} className="formula-panel mt-4"><p className="text-sm font-semibold text-cyan-100">{formula.label}</p><MathRenderer expression={formula.latex} /><p className="text-sm text-slate-400">{formula.explanation}</p></div>)}</section>
    <section className="notebook-panel p-5" aria-labelledby="stage-visualize"><h2 id="stage-visualize" className="stage-title"><Eye />{stages[1]}</h2><p className="mt-3 text-slate-300">Use the approved {topic.visualization.kind.replaceAll('-', ' ')} preset to observe this idea.</p><button className="focus-ring mt-4 rounded-lg border border-cyan-300/30 px-4 py-2 text-sm font-semibold text-cyan-100" onClick={onOpenLab}>Open visualization</button></section>
    <section className="notebook-panel p-5" aria-labelledby="stage-practice"><h2 id="stage-practice" className="stage-title"><ListChecks />{stages[2]}</h2><ol className="mt-4 space-y-3">{topic.workedExamples[0].steps.map((step, index) => <li key={step} className="flex gap-3 text-slate-300"><span className="font-mono text-cyan-300">{String(index + 1).padStart(2, '0')}</span><span>{step}</span></li>)}</ol><p className="mt-4 text-sm text-slate-400">{topic.practiceQuestions.length} guided questions are available for this topic.</p></section>
    <section className="code-panel p-5" aria-labelledby="stage-cs"><h2 id="stage-cs" className="stage-title"><Code2 />{stages[3]}</h2>{topic.csConnections.map((connection) => <div key={connection.title} className="mt-3"><h3 className="font-semibold text-amber-100">{connection.title}</h3><p className="mt-2 leading-7 text-slate-300">{connection.explanation}</p></div>)}</section>
    <section className="notebook-panel p-5" aria-labelledby="stage-quiz"><h2 id="stage-quiz" className="stage-title"><Trophy />{stages[4]}</h2><p className="mt-3 font-medium text-white">{topic.quiz.title}</p><p className="mt-1 text-sm text-slate-400">{topic.quiz.questions.length} questions. Quiz runner activates in the assessment stage.</p><button className="mt-4 cursor-not-allowed rounded-lg border border-white/10 px-4 py-2 text-sm text-slate-500" disabled>Start checkpoint</button></section>
  </div>
);
