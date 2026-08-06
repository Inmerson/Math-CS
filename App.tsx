import React, { useState } from 'react';
import { Menu } from 'lucide-react';
import { AnimatedBackground } from './components/AnimatedBackground';
import { Sidebar } from './components/Sidebar';
import { BottomNavigation } from './components/layout/BottomNavigation';
import { DashboardView } from './views/DashboardView';
import { CourseHubView } from './views/CourseHubView';
import { LessonWorkspaceView } from './views/LessonWorkspaceView';
import { AppDestination } from './types';
import { getCourse, getTopic } from './data/courseCatalog';
import { createDefaultMathCsState, loadMathCsState, MathCsState, saveMathCsState } from './utils/mathCsStorage';
import { markTopicComplete } from './utils/progress';

const isValidDestination = (destination: AppDestination): boolean => {
  if (destination.section === 'course') return Boolean(destination.courseId && getCourse(destination.courseId));
  if (destination.section === 'lesson') return Boolean(destination.courseId && destination.topicId && getTopic(destination.courseId, destination.topicId));
  return true;
};

const Placeholder: React.FC<{ title: string; description: string }> = ({ title, description }) => <div className="mx-auto max-w-4xl"><h1 className="text-3xl font-bold text-white">{title}</h1><div className="notebook-panel mt-5 p-6"><p className="leading-7 text-slate-300">{description}</p></div></div>;

const App: React.FC = () => {
  const initial = typeof window === 'undefined' ? createDefaultMathCsState() : loadMathCsState();
  const [state, setState] = useState<MathCsState>(initial);
  const stored = initial.lastDestination as AppDestination | null;
  const [destination, setDestination] = useState<AppDestination>(stored && isValidDestination(stored) ? stored : { section: 'dashboard' });
  const [menuOpen, setMenuOpen] = useState(false);

  const updateState = (next: MathCsState) => { setState(next); saveMathCsState(next); };
  const navigate = (next: AppDestination) => {
    const safe = isValidDestination(next) ? next : { section: 'dashboard' } as AppDestination;
    setDestination(safe);
    updateState({ ...state, lastDestination: safe });
    setMenuOpen(false);
  };

  const renderContent = () => {
    if (!isValidDestination(destination)) return <div className="mx-auto max-w-xl text-center"><h1 className="text-3xl font-bold text-white">Learning path not found</h1><p className="mt-3 text-slate-400">Choose a safe destination to continue.</p><div className="mt-5 flex justify-center gap-3"><button className="focus-ring rounded-lg bg-cyan-300 px-4 py-2 text-slate-950" onClick={() => navigate({ section: 'dashboard' })}>Dashboard</button><button className="focus-ring rounded-lg border border-white/10 px-4 py-2" onClick={() => navigate({ section: 'course', courseId: 'math-analysis' })}>Math I</button><button className="focus-ring rounded-lg border border-white/10 px-4 py-2" onClick={() => navigate({ section: 'course', courseId: 'linear-algebra-geometry' })}>Math II</button></div></div>;
    switch (destination.section) {
      case 'dashboard': return <DashboardView state={state} onNavigate={navigate} />;
      case 'course': return <CourseHubView courseId={destination.courseId!} state={state} onNavigate={navigate} />;
      case 'lesson': return <LessonWorkspaceView courseId={destination.courseId!} topicId={destination.topicId!} state={state} onNavigate={navigate} onComplete={(topicId) => updateState(markTopicComplete(state, topicId))} />;
      case 'math-lab': return <Placeholder title="Math Lab" description="Function Explorer, Matrix Lab, and Vector & Geometry Lab are being consolidated into this controlled workspace." />;
      case 'practice': return <Placeholder title="Practice" description="Topic-filtered guided practice will use the same deterministic curriculum question bank." />;
      case 'exams': return <Placeholder title="Exams" description="Course checkpoints and mock examinations will report results by topic." />;
      case 'progress': return <Placeholder title="Progress" description="Completion, mastery, and review recommendations remain local to this device." />;
      case 'formulas': return <Placeholder title="Formula Workspace" description="Saved formulas and personal notes will appear here." />;
      case 'assistant': return <Placeholder title="Math Assistant" description="The contextual assistant will provide bounded, stepwise hints for the active topic." />;
    }
  };

  return <div className="min-h-screen bg-[#07111f] text-[#f4f1e8]"><AnimatedBackground /><Sidebar destination={destination} onNavigate={navigate} isOpen={menuOpen} onClose={() => setMenuOpen(false)} /><header className="sticky top-0 z-30 flex h-14 items-center border-b border-white/8 bg-[#07111f]/90 px-4 backdrop-blur md:hidden"><button className="focus-ring rounded-lg p-2" onClick={() => setMenuOpen(true)} aria-label="Open navigation"><Menu /></button><span className="ml-3 font-semibold text-white">Math-CS</span></header><main className="min-h-screen px-4 py-6 pb-24 md:ml-72 md:px-8 md:py-8 md:pb-10">{renderContent()}</main><BottomNavigation destination={destination} onNavigate={navigate} /></div>;
};
export default App;
