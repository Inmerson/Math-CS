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

const isActiveDestination = (current: AppDestination, target: AppDestination): boolean => {
  if (current.section !== target.section) return false;
  if (target.section === 'course') return current.courseId === target.courseId;
  return true;
};

export const BottomNavigation: React.FC<BottomNavigationProps> = ({ destination, onNavigate }) => {
  const [moreOpen, setMoreOpen] = useState(false);
  return (
    <>
      {moreOpen && (
        <div className="cosmic-glass fixed inset-x-3 bottom-20 z-50 rounded-2xl p-3 shadow-2xl md:hidden" role="dialog" aria-label="More navigation">
          <div className="mb-2 flex items-center justify-between"><span className="font-semibold text-white">More</span><button className="focus-ring cosmic-touch-target rounded-lg p-2" onClick={() => setMoreOpen(false)} aria-label="Close more navigation"><X size={18} /></button></div>
          {[
            ['Practice', { section: 'practice' }], ['Exams', { section: 'exams' }], ['Progress', { section: 'progress' }], ['Formulas', { section: 'formulas' }], ['Assistant', { section: 'assistant' }],
          ].map(([label, next]) => <button key={label as string} className="focus-ring cosmic-touch-target block w-full rounded-lg px-3 py-2 text-left text-slate-200 hover:bg-white/5" onClick={() => { onNavigate(next as AppDestination); setMoreOpen(false); }}>{label as string}</button>)}
        </div>
      )}
      <nav className="cosmic-mobile-safe-area fixed inset-x-0 bottom-0 z-40 grid grid-cols-5 border-t border-blue-200/10 bg-[#030711]/96 px-1 pt-1 backdrop-blur-xl md:hidden" aria-label="Mobile navigation">
        {items.map((item) => {
          const Icon = item.icon;
          const selected = isActiveDestination(destination, item.destination);
          return (
            <button
              key={item.label}
              type="button"
              className={`focus-ring cosmic-touch-target flex min-h-14 flex-col items-center justify-center gap-1 rounded-lg text-[10px] ${selected ? 'bg-blue-400/8 text-blue-200' : 'text-slate-400'}`}
              aria-current={selected ? 'page' : undefined}
              onClick={() => onNavigate(item.destination)}
            >
              <Icon size={18} /><span>{item.label}</span>
            </button>
          );
        })}
        <button type="button" className="focus-ring cosmic-touch-target flex min-h-14 flex-col items-center justify-center gap-1 rounded-lg text-[10px] text-slate-400" onClick={() => setMoreOpen((value) => !value)} aria-expanded={moreOpen} aria-label="More navigation options"><Menu size={18} /><span>More</span></button>
      </nav>
    </>
  );
};
