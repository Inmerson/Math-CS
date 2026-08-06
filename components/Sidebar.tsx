import React from 'react';
import { BookOpen, FlaskConical, Gauge, GraduationCap, Home, Library, NotebookTabs, Sigma, Sparkles, X } from 'lucide-react';
import { AppDestination } from '../types';
import { BRAND_SHORT_NAME } from '../data/branding';

interface SidebarProps {
  destination: AppDestination;
  onNavigate: (destination: AppDestination) => void;
  isOpen: boolean;
  onClose: () => void;
}

const primaryItems: { label: string; icon: React.ComponentType<{ size?: number }>; destination: AppDestination }[] = [
  { label: 'Dashboard', icon: Home, destination: { section: 'dashboard' } },
  { label: 'Math I', icon: Sigma, destination: { section: 'course', courseId: 'math-analysis' } },
  { label: 'Math II', icon: BookOpen, destination: { section: 'course', courseId: 'linear-algebra-geometry' } },
  { label: 'Math Lab', icon: FlaskConical, destination: { section: 'math-lab' } },
  { label: 'Practice', icon: NotebookTabs, destination: { section: 'practice' } },
  { label: 'Exams', icon: GraduationCap, destination: { section: 'exams' } },
  { label: 'Progress', icon: Gauge, destination: { section: 'progress' } },
];

const secondaryItems: { label: string; icon: React.ComponentType<{ size?: number }>; destination: AppDestination }[] = [
  { label: 'Formulas', icon: Library, destination: { section: 'formulas' } },
  { label: 'Assistant', icon: Sparkles, destination: { section: 'assistant' } },
];

const matches = (current: AppDestination, target: AppDestination) =>
  current.section === target.section && (!target.courseId || current.courseId === target.courseId);

export const Sidebar: React.FC<SidebarProps> = ({ destination, onNavigate, isOpen, onClose }) => {
  const renderItem = (item: typeof primaryItems[number]) => {
    const Icon = item.icon;
    const active = matches(destination, item.destination);
    return (
      <button
        key={item.label}
        type="button"
        onClick={() => { onNavigate(item.destination); onClose(); }}
        aria-current={active ? 'page' : undefined}
        className={`focus-ring flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium transition ${active ? 'bg-cyan-300/12 text-cyan-100 ring-1 ring-cyan-300/25' : 'text-slate-300 hover:bg-white/5 hover:text-white'}`}
      >
        <Icon size={18} />
        <span>{item.label}</span>
      </button>
    );
  };

  return (
    <>
      {isOpen && <button className="fixed inset-0 z-40 bg-black/60 md:hidden" aria-label="Close navigation overlay" onClick={onClose} />}
      <aside className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-white/8 bg-[#091321]/95 p-4 backdrop-blur-xl transition-transform md:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`} aria-label="Primary navigation">
        <div className="mb-7 flex items-center justify-between px-2 pt-2">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-300">Inmerson</p>
            <p className="mt-1 text-lg font-bold text-white">{BRAND_SHORT_NAME}</p>
          </div>
          <button type="button" className="focus-ring rounded-lg p-2 text-slate-300 md:hidden" onClick={onClose} aria-label="Close navigation"><X size={20} /></button>
        </div>
        <nav className="space-y-1" aria-label="Learning sections">{primaryItems.map(renderItem)}</nav>
        <div className="mt-auto border-t border-white/8 pt-4"><nav className="space-y-1" aria-label="Learning tools">{secondaryItems.map(renderItem)}</nav></div>
      </aside>
    </>
  );
};
