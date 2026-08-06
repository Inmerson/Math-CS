#!/usr/bin/env bash
set -euo pipefail

cat > scripts/tailwind-output.test.ts <<'EOF'
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import postcss from 'postcss';
import tailwindcss from '@tailwindcss/postcss';
import { describe, expect, it } from 'vitest';

const compileStyles = async () => {
  const sourcePath = path.resolve('index.css');
  const source = await readFile(sourcePath, 'utf8');
  return postcss([tailwindcss()]).process(source, { from: sourcePath });
};

describe('Tailwind production stylesheet', () => {
  it('emits theme-backed utilities used by the notebook layout', async () => {
    const result = await compileStyles();
    const requiredUtilities = [
      ['p', '6'],
      ['gap', '6'],
      ['text', '3xl'],
      ['rounded', '2xl'],
      ['bg', 'slate', '950'],
    ].map((parts) => `.${parts.join('-')}`);
    for (const utility of requiredUtilities) {
      expect(result.css, `missing generated utility ${utility}`).toContain(utility);
    }
  });

  it('retains cosmic resilience selectors in production output', async () => {
    const result = await compileStyles();
    for (const selector of ['.cosmic-glass', '.cosmic-hero', '.cosmic-progress-ring', '.cosmic-mobile-safe-area', '.cosmic-touch-target']) {
      expect(result.css, `missing resilient selector ${selector}`).toContain(selector);
    }
  });
});
EOF

if npm test -- scripts/tailwind-output.test.ts; then
  echo 'Expected RED before mobile safe-area and touch-target contracts.' >&2
  exit 1
else
  echo 'RED confirmed: responsive resilience selectors are missing.'
fi

cat > components/cosmic/CosmicHero.test.tsx <<'EOF'
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { CosmicHero } from './CosmicHero';

const renderHero = () => render(
  <CosmicHero
    title="Inmerson Math-CS"
    tagline="Interactive Mathematics for Computer Science"
    description="Academic workspace"
  />,
);

describe('CosmicHero', () => {
  it('renders a readable cinematic header with a decorative Pages-aware image', () => {
    renderHero();
    expect(screen.getByRole('heading', { level: 1, name: 'Inmerson Math-CS' })).toBeInTheDocument();
    expect(screen.getByText('Interactive Mathematics for Computer Science')).toBeInTheDocument();
    expect(screen.getByTestId('black-hole-hero')).toHaveClass('cosmic-hero-fallback');
    const image = screen.getByTestId('black-hole-image');
    expect(image).toHaveAttribute('alt', '');
    expect(image).toHaveAttribute('src', expect.stringContaining('assets/cosmic/black-hole-hero.webp'));
  });

  it('keeps all educational content readable when the image fails', () => {
    renderHero();
    fireEvent.error(screen.getByTestId('black-hole-image'));
    expect(screen.queryByTestId('black-hole-image')).not.toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 1, name: 'Inmerson Math-CS' })).toBeVisible();
    expect(screen.getByText('Academic workspace')).toBeVisible();
  });
});
EOF

python - <<'PY'
from pathlib import Path
p = Path('App.test.tsx')
s = p.read_text()
old = "    expect(screen.getByRole('navigation', { name: 'Primary navigation' })).toBeInTheDocument();\n"
new = old + "    expect(screen.getByRole('navigation', { name: 'Mobile navigation' })).toBeInTheDocument();\n"
if new not in s:
    if old not in s:
        raise SystemExit('App navigation assertion not found')
    s = s.replace(old, new)
p.write_text(s)
PY

cat > components/layout/BottomNavigation.tsx <<'EOF'
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
        <div className="cosmic-glass fixed inset-x-3 bottom-20 z-50 rounded-2xl p-3 shadow-2xl md:hidden" role="dialog" aria-label="More navigation">
          <div className="mb-2 flex items-center justify-between"><span className="font-semibold text-white">More</span><button className="focus-ring cosmic-touch-target rounded-lg p-2" onClick={() => setMoreOpen(false)} aria-label="Close more navigation"><X size={18} /></button></div>
          {[
            ['Practice', { section: 'practice' }], ['Exams', { section: 'exams' }], ['Progress', { section: 'progress' }], ['Formulas', { section: 'formulas' }], ['Assistant', { section: 'assistant' }],
          ].map(([label, next]) => <button key={label as string} className="focus-ring cosmic-touch-target block w-full rounded-lg px-3 py-2 text-left text-slate-200 hover:bg-white/5" onClick={() => { onNavigate(next as AppDestination); setMoreOpen(false); }}>{label as string}</button>)}
        </div>
      )}
      <nav className="cosmic-mobile-safe-area fixed inset-x-0 bottom-0 z-40 grid grid-cols-5 border-t border-blue-200/10 bg-[#030711]/96 px-1 pt-1 backdrop-blur-xl md:hidden" aria-label="Mobile navigation">
        {items.map((item) => { const Icon = item.icon; const selected = active(item.destination); return <button key={item.label} className={`focus-ring cosmic-touch-target flex min-h-14 flex-col items-center justify-center gap-1 rounded-lg text-[10px] ${selected ? 'bg-blue-400/8 text-blue-200' : 'text-slate-400'}`} aria-current={selected ? 'page' : undefined} onClick={() => onNavigate(item.destination)}><Icon size={18} /><span>{item.label}</span></button>; })}
        <button className="focus-ring cosmic-touch-target flex min-h-14 flex-col items-center justify-center gap-1 rounded-lg text-[10px] text-slate-400" onClick={() => setMoreOpen((value) => !value)} aria-expanded={moreOpen} aria-label="More navigation options"><Menu size={18} /><span>More</span></button>
      </nav>
    </>
  );
};
EOF

cat >> index.css <<'EOF'

.cosmic-touch-target {
  min-width: 44px;
  min-height: 44px;
}

.cosmic-mobile-safe-area {
  padding-bottom: max(0.5rem, env(safe-area-inset-bottom));
}

.cosmic-glass,
.cosmic-card,
.cosmic-hero {
  min-width: 0;
  max-width: 100%;
}

.cosmic-hero h1,
.cosmic-page-header h1 {
  overflow-wrap: anywhere;
}

@media (max-width: 767px) {
  .cosmic-hero {
    min-height: auto;
    padding-bottom: 15rem;
  }

  .cosmic-hero__content {
    padding: 2rem 1.25rem 1.5rem;
  }

  .cosmic-hero__image {
    inset: auto 0 0;
    height: 16.5rem;
  }

  .cosmic-hero__image img {
    object-position: 68% center;
    opacity: 0.88;
  }

  .cosmic-hero__scrim {
    background:
      linear-gradient(180deg, rgba(3, 7, 17, .99) 0%, rgba(3, 7, 17, .96) 43%, rgba(3, 7, 17, .35) 72%, rgba(3, 7, 17, .62) 100%),
      linear-gradient(90deg, rgba(3, 7, 17, .52), transparent 72%);
  }

  .cosmic-progress-ring--lg {
    --ring-size: 6rem;
  }
}

@media (min-width: 768px) and (max-width: 1023px) {
  .cosmic-hero {
    min-height: 28rem;
  }

  .cosmic-hero__content {
    max-width: 62%;
  }
}

@media (pointer: coarse) {
  button,
  [role="button"],
  [role="tab"],
  a {
    min-height: 44px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .cosmic-hero__image img,
  .cosmic-starfield::before,
  .cosmic-starfield::after {
    animation: none !important;
    transform: none !important;
  }
}
EOF

npm test -- scripts/tailwind-output.test.ts components/cosmic/CosmicHero.test.tsx App.test.tsx components/Sidebar.test.tsx components/layout/BottomNavigation.test.tsx
npm run typecheck
npm run verify
npm run build:pages
