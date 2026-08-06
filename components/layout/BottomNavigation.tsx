import React, { useState } from 'react';
import { BookOpen, FlaskConical, Home, Menu, Sigma, X } from 'lucide-react';
import { AppDestination } from '../../types';

interface BottomNavigationProps {
  destination: AppDestination;
  onNavigate: (destination: AppDestination) => void;
}

const items = [
  { label: 'Dashboard', icon: Home, destination: { section: 'dashboard' } as AppDestination },
  { label: 'Math I', icon: Sigma, destination: { section: 'course', courseId: 'math-analysis' } as AppDestination },
  { label: 'Math II', icon: BookOpen, destination: { section: 'course', courseId: 'linear-algebra-geometry' } as AppDestination },
  { label: 'Lab', icon: FlaskConical, destination: { section: 'math-lab' } as AppDestination },
];

export const BottomNavigation: React.FC<BottomNavigationProps> = ({ destination, onNavigate }) => {
  const [moreOpen, setMoreOpen] = useState(false);
  const active = (target: AppDestination) => destination.section === target.section && (!target.courseId || destination.courseId === target.courseId);
  return (
    <>
      {moreOpen && (
        <div className="fixed inset-x-3 bottom-20 z-50 rounded-2xl border border-white/10 bg-[#0b1726] p-3 shadow-2xl md:hidden" role="dialog" aria-label="More navigation">
          <div className="mb-2 flex items-center justify-between"><span className="font-semibold text-white">More</span><button className="focus-ring rounded-lg p-2" onClick={() => setMoreOpen(false)} aria-label="Close more navigation"><X size={18} /></button></div>
          {[
            ['Practice', { section: 'practice' }], ['Exams', { section: 'exams' }], ['Progress', { section: 'progress' }], ['Formulas', { section: 'formulas' }], ['Assistant', { section: 'assistant' }],
          ].map(([label, next]) => <button key={label as string} className="focus-ring block w-full rounded-lg px-3 py-2 text-left text-slate-200 hover:bg-white/5" onClick={() => { onNavigate(next as AppDestination); setMoreOpen(false); }}>{label as string}</button>)}
        </div>
      )}
      <nav className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-5 border-t border-white/10 bg-[#07111f]/96 px-1 pb-[max(0.35rem,env(safe-area-inset-bottom))] pt-1 backdrop-blur-xl md:hidden" aria-label="Mobile navigation">
        {items.map((item) => { const Icon = item.icon; const selected = active(item.destination); return <button key={item.label} className={`focus-ring flex min-h-14 flex-col items-center justify-center gap-1 rounded-lg text-[10px] ${selected ? 'text-cyan-200' : 'text-slate-400'}`} aria-current={selected ? 'page' : undefined} onClick={() => onNavigate(item.destination)}><Icon size={18} /><span>{item.label}</span></button>; })}
        <button className="focus-ring flex min-h-14 flex-col items-center justify-center gap-1 rounded-lg text-[10px] text-slate-400" onClick={() => setMoreOpen((value) => !value)} aria-expanded={moreOpen}><Menu size={18} /><span>More</span></button>
      </nav>
    </>
  );
};
