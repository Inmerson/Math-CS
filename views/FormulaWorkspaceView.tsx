import React from 'react';
import { Bookmark, Trash2 } from 'lucide-react';
import { COURSES } from '../data/courseCatalog';
import { MathCsState, SavedFormula } from '../utils/mathCsStorage';
import { MathRenderer } from '../components/MathRenderer';
import { CosmicPageHeader } from '../components/cosmic/CosmicPageHeader';

interface FormulaWorkspaceViewProps { state: MathCsState; onSave: (formula: SavedFormula) => void; onRemove: (id: string) => void; onNote: (id: string, note: string) => void; }

export const FormulaWorkspaceView: React.FC<FormulaWorkspaceViewProps> = ({ state, onSave, onRemove, onNote }) => (
  <div data-testid="formula-workspace-shell" className="cosmic-notation-shell mx-auto max-w-5xl">
    <CosmicPageHeader title="Formula Workspace" eyebrow="Technical notebook" description="Save curriculum formulas by reference; local notes are plain text and limited to 500 characters." accent="violet" />
    <div className="mt-6 space-y-8">
      {COURSES.map((course) => <section key={course.id}><h2 className="text-xl font-bold text-white">{course.shortTitle} · {course.title}</h2><div className="mt-4 grid gap-4 lg:grid-cols-2">{course.topics.flatMap((topic) => topic.formulas.map((formula) => { const saved = state.savedFormulas.find((item) => item.formulaId === formula.id); return <article key={formula.id} className="cosmic-glass cosmic-card rounded-2xl p-5"><div className="flex items-start justify-between gap-3"><div><p className="text-xs uppercase tracking-wider text-slate-500">{topic.title}</p><h3 className="mt-1 font-semibold text-white">{formula.label}</h3></div><button aria-label={saved ? `Remove ${formula.label}` : `Save ${formula.label}`} className="focus-ring rounded-lg border border-white/10 p-2" onClick={() => saved ? onRemove(formula.id) : onSave({ formulaId: formula.id, courseId: course.id, topicId: topic.id, note: '' })}>{saved ? <Trash2 size={17} /> : <Bookmark size={17} />}</button></div><div className="formula-panel mt-4"><MathRenderer expression={formula.latex} /></div><p className="mt-3 text-sm text-slate-400">{formula.explanation}</p>{saved && <label className="mt-4 block text-sm text-slate-300">Local note<textarea aria-label={`Note for ${formula.label}`} maxLength={500} value={saved.note} onChange={(event) => onNote(formula.id, event.target.value.slice(0, 500))} className="focus-ring mt-2 w-full rounded-lg border border-white/10 bg-slate-950 p-3 text-white" rows={3} /><span className="mt-1 block text-right text-xs text-slate-500">{saved.note.length}/500</span></label>}</article>; }))}</div></section>)}
    </div>
  </div>
);
