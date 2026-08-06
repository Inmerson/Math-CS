#!/usr/bin/env bash
set -euo pipefail

cat > components/Sidebar.test.tsx <<'EOF'
import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { Sidebar } from './Sidebar';

describe('Sidebar', () => {
  it('shows the approved navigation, active state, and real overall progress', () => {
    render(
      <Sidebar
        destination={{ section: 'dashboard' }}
        onNavigate={vi.fn()}
        isOpen
        onClose={vi.fn()}
        overallProgress={42}
      />,
    );
    expect(screen.getByText('Inmerson')).toBeInTheDocument();
    expect(screen.getByText('Math-CS')).toBeInTheDocument();
    expect(screen.getByRole('img', { name: 'Overall progress: 42%' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Dashboard' })).toHaveAttribute('aria-current', 'page');
    for (const label of ['Dashboard', 'Math I', 'Math II', 'Math Lab', 'Practice', 'Exams', 'Progress']) {
      expect(screen.getByRole('button', { name: label })).toBeInTheDocument();
    }
    expect(screen.queryByText(/Differential Equations|Population Models|biotech/i)).not.toBeInTheDocument();
  });
});
EOF

if npm test -- components/Sidebar.test.tsx; then
  echo 'Expected RED before Sidebar accepted overallProgress.' >&2
  exit 1
else
  echo 'RED confirmed: premium Sidebar contract is not implemented.'
fi

cat > components/Sidebar.tsx <<'EOF'
import React from 'react';
import {
  BookOpen,
  FlaskConical,
  Gauge,
  GraduationCap,
  Home,
  Library,
  NotebookTabs,
  Sigma,
  Sparkles,
  X,
} from 'lucide-react';
import { AppDestination } from '../types';
import { BRAND_SHORT_NAME } from '../data/branding';
import { CosmicLogoMark } from './cosmic/CosmicLogoMark';
import { CosmicProgressRing } from './cosmic/CosmicProgressRing';

interface SidebarProps {
  destination: AppDestination;
  onNavigate: (destination: AppDestination) => void;
  isOpen: boolean;
  onClose: () => void;
  overallProgress: number;
}

type NavItem = {
  label: string;
  icon: React.ComponentType<{ size?: number }>;
  destination: AppDestination;
};

const primaryItems: NavItem[] = [
  { label: 'Dashboard', icon: Home, destination: { section: 'dashboard' } },
  { label: 'Math I', icon: Sigma, destination: { section: 'course', courseId: 'math-analysis' } },
  { label: 'Math II', icon: BookOpen, destination: { section: 'course', courseId: 'linear-algebra-geometry' } },
  { label: 'Math Lab', icon: FlaskConical, destination: { section: 'math-lab' } },
  { label: 'Practice', icon: NotebookTabs, destination: { section: 'practice' } },
  { label: 'Exams', icon: GraduationCap, destination: { section: 'exams' } },
  { label: 'Progress', icon: Gauge, destination: { section: 'progress' } },
];

const secondaryItems: NavItem[] = [
  { label: 'Formulas', icon: Library, destination: { section: 'formulas' } },
  { label: 'Assistant', icon: Sparkles, destination: { section: 'assistant' } },
];

const matches = (current: AppDestination, target: AppDestination) =>
  current.section === target.section && (!target.courseId || current.courseId === target.courseId);

export const Sidebar: React.FC<SidebarProps> = ({
  destination,
  onNavigate,
  isOpen,
  onClose,
  overallProgress,
}) => {
  const activate = (next: AppDestination) => {
    onNavigate(next);
    onClose();
  };

  const renderItem = (item: NavItem) => {
    const Icon = item.icon;
    const active = matches(destination, item.destination);
    return (
      <button
        key={item.label}
        type="button"
        onClick={() => activate(item.destination)}
        aria-current={active ? 'page' : undefined}
        className={`focus-ring group flex min-h-11 w-full items-center gap-3 rounded-xl border px-3 py-2.5 text-left text-sm font-medium transition ${active
          ? 'border-blue-300/25 bg-blue-400/10 text-blue-100 shadow-[inset_3px_0_0_rgba(98,168,255,.9),0_0_28px_rgba(56,139,253,.08)]'
          : 'border-transparent text-slate-300 hover:border-white/8 hover:bg-white/4 hover:text-white'}`}
      >
        <span className={`grid size-8 shrink-0 place-items-center rounded-lg ${active ? 'bg-blue-300/10 text-blue-200' : 'bg-white/3 text-slate-400 group-hover:text-slate-200'}`}>
          <Icon size={17} />
        </span>
        <span>{item.label}</span>
      </button>
    );
  };

  return (
    <>
      {isOpen && (
        <button
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm md:hidden"
          aria-label="Close navigation overlay"
          onClick={onClose}
        />
      )}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-blue-200/10 bg-[#030711]/94 p-4 shadow-[24px_0_80px_rgba(0,0,0,.32)] backdrop-blur-2xl transition-transform md:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
        aria-label="Math-CS sidebar"
      >
        <div className="mb-6 flex items-center justify-between px-1 pt-1">
          <div className="flex items-center gap-3">
            <CosmicLogoMark size={44} className="shrink-0" />
            <div>
              <p className="text-sm font-semibold tracking-[0.04em] text-slate-200">Inmerson</p>
              <p className="text-lg font-bold tracking-tight text-white">{BRAND_SHORT_NAME}</p>
            </div>
          </div>
          <button
            type="button"
            className="focus-ring rounded-lg p-2 text-slate-300 hover:bg-white/5 md:hidden"
            onClick={onClose}
            aria-label="Close navigation"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="min-h-0 flex-1 overflow-y-auto pr-1" aria-label="Primary navigation">
          <div className="space-y-1">{primaryItems.map(renderItem)}</div>
          <div className="my-4 h-px bg-gradient-to-r from-transparent via-blue-200/12 to-transparent" />
          <div className="space-y-1">{secondaryItems.map(renderItem)}</div>
        </nav>

        <button
          type="button"
          onClick={() => activate({ section: 'progress' })}
          className="focus-ring cosmic-glass cosmic-card mt-4 flex items-center gap-3 rounded-2xl p-3 text-left"
          aria-label="View detailed progress"
        >
          <CosmicProgressRing value={overallProgress} label="Overall progress" size="sm" />
          <span className="min-w-0">
            <span className="block text-sm font-semibold text-white">Your Progress</span>
            <span className="mt-1 block text-xs leading-5 text-slate-400">Across both approved mathematics courses</span>
          </span>
        </button>
      </aside>
    </>
  );
};
EOF

cat > App.test.tsx <<'EOF'
import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';
import App from './App';
import { COURSES } from './data/courseCatalog';
import { createDefaultMathCsState, MATH_CS_STORAGE_PREFIX } from './utils/mathCsStorage';
import { markTopicComplete } from './utils/progress';

describe('Math-CS app shell', () => {
  beforeEach(() => localStorage.clear());

  it('provides an accessible notebook shell', () => {
    render(<App />);
    expect(screen.getAllByRole('main')).toHaveLength(1);
    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1);
    expect(screen.getByRole('navigation', { name: 'Primary navigation' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Open Math I' })).toBeVisible();
    expect(document.querySelector('[aria-hidden="true"]')).not.toBeNull();
  });

  it('derives and passes overall progress from stored course completion', () => {
    const seeded = COURSES[0].topics.slice(0, 4).reduce(
      (state, topic) => markTopicComplete(state, topic.id),
      createDefaultMathCsState(),
    );
    localStorage.setItem(`${MATH_CS_STORAGE_PREFIX}state`, JSON.stringify(seeded));
    render(<App />);
    expect(screen.getByRole('img', { name: 'Overall progress: 24%' })).toBeInTheDocument();
  });
});
EOF

if npm test -- App.test.tsx; then
  echo 'Expected RED before App derived and passed overallProgress.' >&2
  exit 1
else
  echo 'RED confirmed: App shell does not pass real overall progress.'
fi

python - <<'PY'
from pathlib import Path
p = Path('App.tsx')
s = p.read_text()
s = s.replace("import { getCourse, getTopic } from './data/courseCatalog';", "import { COURSES, getCourse, getTopic } from './data/courseCatalog';")
s = s.replace("import { markTopicComplete, recordQuizResult, removeFormula, saveFormula, saveFormulaNote } from './utils/progress';", "import { getOverallProgress, markTopicComplete, recordQuizResult, removeFormula, saveFormula, saveFormulaNote } from './utils/progress';")
s = s.replace("  const [menuOpen, setMenuOpen] = useState(false);", "  const [menuOpen, setMenuOpen] = useState(false);\n  const overallProgress = getOverallProgress(state, COURSES);")
s = s.replace("<div className=\"min-h-screen bg-[#07111f] text-[#f4f1e8]\"><AnimatedBackground /><Sidebar destination={destination} onNavigate={navigate} isOpen={menuOpen} onClose={() => setMenuOpen(false)} /><header className=\"sticky top-0 z-30 flex h-14 items-center border-b border-white/8 bg-[#07111f]/90 px-4 backdrop-blur md:hidden\">", "<div className=\"cosmic-shell min-h-screen text-[#f5f7fb]\"><AnimatedBackground /><Sidebar destination={destination} onNavigate={navigate} isOpen={menuOpen} onClose={() => setMenuOpen(false)} overallProgress={overallProgress} /><header className=\"cosmic-glass sticky top-0 z-30 flex h-14 items-center border-x-0 border-t-0 px-4 md:hidden\">")
p.write_text(s)
PY

npm test -- App.test.tsx components/Sidebar.test.tsx components/layout/BottomNavigation.test.tsx
npm run typecheck
npm run verify
npm run build:pages
