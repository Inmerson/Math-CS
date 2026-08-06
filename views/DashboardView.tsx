import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from 'framer-motion';
import { ModuleType } from '../types';
import {
  Activity,
  AreaChart,
  ArrowRight,
  Command,
  Divide,
  Dna,
  GraduationCap,
  Grid3X3,
  Infinity as InfinityIcon,
  Layers,
  Play,
  Search,
  TrendingUp,
} from 'lucide-react';
import {
  getLearningDestination,
  LearningDestination,
  LearningDestinationRef,
  searchLearningDestinations,
} from '../data/learningCatalog';
import {
  BRAND_DESCRIPTION,
  BRAND_NAME,
  BRAND_TAGLINE,
} from '../data/branding';

interface ModuleConfig {
  id: ModuleType;
  title: string;
  subtitle: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  color: string;
  gradient: string;
  desc: string;
}

const modules: ModuleConfig[] = [
  { id: ModuleType.MATRIX, title: 'Matrix', subtitle: 'Linear Algebra', icon: Grid3X3, color: 'text-accent-cyan', gradient: 'from-accent-cyan/20 to-accent-blue/20', desc: 'Systems, determinants and vector spaces.' },
  { id: ModuleType.SEQUENCES, title: 'Sequences', subtitle: 'Discrete Math', icon: TrendingUp, color: 'text-accent-purple', gradient: 'from-accent-purple/20 to-accent-pink/20', desc: 'Limits, convergence and infinite series.' },
  { id: ModuleType.FUNCTIONS, title: 'Functions', subtitle: 'Analysis I', icon: Activity, color: 'text-accent-pink', gradient: 'from-accent-pink/20 to-red-600/20', desc: 'Domains, ranges, graphs and transformations.' },
  { id: ModuleType.LIMITS, title: 'Limits', subtitle: 'Foundations', icon: InfinityIcon, color: 'text-orange-400', gradient: 'from-orange-500/20 to-amber-600/20', desc: 'Continuity, asymptotes and local behavior.' },
  { id: ModuleType.DERIVATIVES, title: 'Derivatives', subtitle: 'Calculus I', icon: Divide, color: 'text-teal-400', gradient: 'from-teal-500/20 to-emerald-600/20', desc: 'Rates of change, approximation and optimization.' },
  { id: ModuleType.INTEGRALS, title: 'Integrals', subtitle: 'Calculus II', icon: AreaChart, color: 'text-emerald-400', gradient: 'from-emerald-500/20 to-green-600/20', desc: 'Area, volume and accumulated change.' },
  { id: ModuleType.DIFF_EQ, title: 'Diff Eq', subtitle: 'Modeling', icon: Layers, color: 'text-indigo-400', gradient: 'from-indigo-500/20 to-violet-600/20', desc: 'Growth, decay and biological dynamics.' },
  { id: ModuleType.EXAMS, title: 'Exams', subtitle: 'Assessment', icon: GraduationCap, color: 'text-white', gradient: 'from-slate-700/50 to-slate-800/50', desc: 'Practice, evaluate and review your performance.' },
];

interface CardProps {
  module: ModuleConfig;
  onSelect: (module: ModuleType) => void;
  index: number;
}

const CompactCard: React.FC<CardProps> = ({ module, onSelect, index }) => {
  const Icon = module.icon;
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.button
      initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: shouldReduceMotion ? 0 : index * 0.04 }}
      onClick={() => onSelect(module.id)}
      className="relative overflow-hidden rounded-2xl p-4 text-left glass-card hover:bg-white/5 transition-colors group min-h-[140px] flex flex-col justify-between"
      aria-label={`Open ${module.title} module`}
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${module.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
      <div className="relative z-10 flex justify-between items-start">
        <div className={`p-2.5 rounded-xl bg-white/5 w-fit ${module.color} border border-white/5 shadow-inner`}>
          <Icon size={20} />
        </div>
      </div>
      <div className="relative z-10">
        <h3 className="font-bold text-white text-base leading-tight mb-1">{module.title}</h3>
        <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">{module.subtitle}</p>
      </div>
    </motion.button>
  );
};

const DesktopCard: React.FC<CardProps> = ({ module, onSelect, index }) => {
  const Icon = module.icon;
  const ref = useRef<HTMLButtonElement>(null);
  const shouldReduceMotion = useReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mouseX = useSpring(x, { stiffness: 500, damping: 100 });
  const mouseY = useSpring(y, { stiffness: 500, damping: 100 });
  const rotateX = useTransform(mouseY, [-0.5, 0.5], ['17.5deg', '-17.5deg']);
  const rotateY = useTransform(mouseX, [-0.5, 0.5], ['-17.5deg', '17.5deg']);

  const handleMouseMove = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (!ref.current || shouldReduceMotion) return;
    const rect = ref.current.getBoundingClientRect();
    x.set((event.clientX - rect.left) / rect.width - 0.5);
    y.set((event.clientY - rect.top) / rect.height - 0.5);
  };

  const resetTilt = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.button
      ref={ref}
      initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: shouldReduceMotion ? 0 : index * 0.05, duration: shouldReduceMotion ? 0.01 : 0.5 }}
      onClick={() => onSelect(module.id)}
      onMouseMove={handleMouseMove}
      onMouseLeave={resetTilt}
      onBlur={resetTilt}
      style={shouldReduceMotion ? undefined : { rotateX, rotateY, transformStyle: 'preserve-3d' }}
      className="group relative h-full w-full rounded-[2rem] border border-white/10 bg-slate-900/20 backdrop-blur-sm p-8 text-left transition-colors hover:border-white/20 hover:bg-slate-900/40 perspective-1000"
      aria-label={`Open ${module.title} module`}
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${module.gradient} opacity-0 transition-opacity duration-500 group-hover:opacity-100 rounded-[2rem]`} style={{ transform: 'translateZ(-50px)' }} />
      <div className="relative z-10 flex h-full flex-col justify-between" style={{ transform: 'translateZ(20px)' }}>
        <div>
          <div className={`mb-6 inline-flex rounded-2xl bg-white/5 p-4 ${module.color} ring-1 ring-white/10 shadow-lg shadow-black/20`}>
            <Icon size={32} />
          </div>
          <h3 className="mb-2 text-3xl font-bold text-white tracking-tight">{module.title}</h3>
          <p className={`text-xs font-bold uppercase tracking-widest ${module.color} opacity-80`}>{module.subtitle}</p>
        </div>
        <div className="mt-8 flex items-end justify-between">
          <p className="max-w-[80%] text-sm text-slate-400 leading-relaxed group-hover:text-slate-200 transition-colors">{module.desc}</p>
          <div className="rounded-full bg-white/5 p-3 text-slate-400 transition-all group-hover:bg-accent-cyan group-hover:text-black group-hover:scale-110">
            <ArrowRight size={20} />
          </div>
        </div>
      </div>
    </motion.button>
  );
};

interface LearningSearchProps {
  onNavigate: (destination: LearningDestinationRef) => void;
}

const LearningSearch: React.FC<LearningSearchProps> = ({ onNavigate }) => {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const results = useMemo(() => searchLearningDestinations(query), [query]);
  const showResults = query.trim().length > 0;

  useEffect(() => {
    const handleShortcut = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      const isTyping = target?.tagName === 'INPUT' || target?.tagName === 'TEXTAREA' || target?.isContentEditable;

      if (event.key === '/' && !isTyping) {
        event.preventDefault();
        inputRef.current?.focus();
      }

      if (event.key === 'Escape' && document.activeElement === inputRef.current) {
        setQuery('');
        inputRef.current?.blur();
      }
    };

    window.addEventListener('keydown', handleShortcut);
    return () => window.removeEventListener('keydown', handleShortcut);
  }, []);

  const selectResult = (destination: LearningDestination) => {
    setQuery('');
    onNavigate(destination);
  };

  return (
    <div className="relative z-30">
      <label htmlFor="learning-search" className="sr-only">Search mathematics and biotechnology topics</label>
      <div className="relative">
        <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" aria-hidden="true" />
        <input
          ref={inputRef}
          id="learning-search"
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search Gaussian elimination, population growth, Taylor..."
          className="w-full h-14 rounded-2xl border border-white/10 bg-slate-950/70 pl-12 pr-14 text-sm text-white placeholder:text-slate-600 outline-none transition-all focus:border-accent-cyan/50 focus:ring-4 focus:ring-accent-cyan/10"
          role="combobox"
          aria-autocomplete="list"
          aria-expanded={showResults}
          aria-controls="learning-search-results"
        />
        <div className="absolute right-4 top-1/2 -translate-y-1/2 hidden sm:flex items-center gap-1 rounded-lg border border-white/10 bg-white/5 px-2 py-1 text-[10px] font-mono text-slate-500" aria-hidden="true">
          <Command size={11} />/
        </div>
      </div>

      {showResults && (
        <div id="learning-search-results" role="listbox" className="absolute left-0 right-0 top-[calc(100%+0.75rem)] max-h-[360px] overflow-y-auto rounded-2xl border border-white/10 bg-slate-950/95 p-2 shadow-2xl shadow-black/60 backdrop-blur-2xl">
          {results.length > 0 ? results.map((result) => (
            <button
              key={`${result.module}-${result.view}`}
              type="button"
              role="option"
              aria-selected={false}
              onClick={() => selectResult(result)}
              className="w-full rounded-xl p-3 text-left transition-colors hover:bg-white/5 focus:bg-white/5 focus:outline-none"
            >
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold text-white">{result.title}</p>
                  <p className="mt-1 text-xs text-slate-500">{result.description}</p>
                </div>
                <span className="shrink-0 rounded-full border border-accent-cyan/20 bg-accent-cyan/10 px-2 py-1 text-[9px] font-bold uppercase tracking-wider text-accent-cyan">{result.moduleTitle}</span>
              </div>
            </button>
          )) : (
            <div className="px-4 py-6 text-center">
              <p className="text-sm font-medium text-slate-300">No matching learning topic</p>
              <p className="mt-1 text-xs text-slate-600">Try a concept, method or biological application.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

interface DashboardProps {
  onSelectModule: (module: ModuleType) => void;
  onNavigate: (destination: LearningDestinationRef) => void;
  lastDestination: LearningDestinationRef | null;
}

export const DashboardView: React.FC<DashboardProps> = ({ onSelectModule, onNavigate, lastDestination }) => {
  const shouldReduceMotion = useReducedMotion();
  const resumeDestination = getLearningDestination(lastDestination);

  return (
    <div className="relative min-h-screen overflow-x-hidden w-full">
      <div className="relative z-20 mx-auto flex min-h-screen max-w-[1600px] flex-col px-6 py-10 md:px-12 md:py-12">
        <motion.header
          initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: -20, filter: 'blur(10px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: shouldReduceMotion ? 0.01 : 0.7 }}
          className="mt-2 md:mt-8"
        >
          <div className="flex items-center gap-3 md:gap-4">
            <div className="rounded-xl bg-gradient-to-br from-accent-cyan to-accent-blue p-2.5 shadow-lg shadow-accent-cyan/20 md:rounded-2xl md:p-3">
              <Dna size={28} className="text-white md:hidden" />
              <Dna size={40} className="hidden text-white md:block" />
            </div>
            <div>
              <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.22em] text-accent-cyan sm:text-xs md:text-sm">{BRAND_TAGLINE}</p>
              <h1 className="text-4xl font-black tracking-tighter text-white sm:text-5xl md:text-7xl">{BRAND_NAME}</h1>
            </div>
          </div>
          <p className="mt-4 max-w-3xl text-sm font-light leading-relaxed text-slate-400 md:ml-2 md:text-lg">
            {BRAND_DESCRIPTION} Search a concept or enter a module to learn through careful observation and interaction.
          </p>
        </motion.header>

        <section className="mt-8 grid gap-4 lg:grid-cols-[minmax(0,1fr)_360px]">
          <LearningSearch onNavigate={onNavigate} />
          {resumeDestination ? (
            <button
              type="button"
              onClick={() => onNavigate(resumeDestination)}
              className="group flex min-h-14 items-center justify-between gap-4 rounded-2xl border border-accent-cyan/20 bg-accent-cyan/10 px-4 py-3 text-left transition-all hover:border-accent-cyan/40 hover:bg-accent-cyan/15 focus:outline-none focus:ring-4 focus:ring-accent-cyan/10"
            >
              <div className="flex min-w-0 items-center gap-3">
                <div className="rounded-xl bg-accent-cyan/15 p-2.5 text-accent-cyan"><Play size={18} fill="currentColor" /></div>
                <div className="min-w-0">
                  <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-accent-cyan">Continue learning</p>
                  <p className="truncate text-sm font-semibold text-white">{resumeDestination.title}</p>
                  <p className="truncate text-[10px] text-slate-500">{resumeDestination.moduleTitle}</p>
                </div>
              </div>
              <ArrowRight size={18} className="shrink-0 text-slate-500 transition-transform group-hover:translate-x-1 group-hover:text-accent-cyan" />
            </button>
          ) : (
            <div className="flex min-h-14 items-center rounded-2xl border border-white/5 bg-white/[0.03] px-4 py-3 text-xs text-slate-500">Your most recently opened topic will appear here.</div>
          )}
        </section>

        <section className="mt-10 hidden grid-cols-2 gap-8 pb-12 md:grid lg:grid-cols-3 xl:grid-cols-4">
          {modules.map((module, index) => <DesktopCard key={module.id} module={module} onSelect={onSelectModule} index={index} />)}
        </section>

        <section className="mt-8 grid flex-1 grid-cols-2 content-start gap-4 pb-8 md:hidden">
          {modules.map((module, index) => <CompactCard key={module.id} module={module} onSelect={onSelectModule} index={index} />)}
        </section>
      </div>
    </div>
  );
};
