import React, { useState } from 'react';
import { FunctionSquare, Grid3X3, Move3D } from 'lucide-react';
import { MathLabId } from '../types';
import { FunctionExplorer } from '../components/labs/FunctionExplorer';
import { MatrixLab } from '../components/labs/MatrixLab';
import { VectorGeometryLab } from '../components/labs/VectorGeometryLab';
import { CosmicPageHeader } from '../components/cosmic/CosmicPageHeader';

interface MathLabViewProps { initialLab?: MathLabId; presetId?: string; }

export const MathLabView: React.FC<MathLabViewProps> = ({ initialLab = 'function', presetId }) => {
  const [active, setActive] = useState<MathLabId>(initialLab);
  const tabs = [
    { id: 'function' as const, label: 'Function Explorer', icon: FunctionSquare },
    { id: 'matrix' as const, label: 'Matrix Lab', icon: Grid3X3 },
    { id: 'vector-geometry' as const, label: 'Vector & Geometry', icon: Move3D },
  ];

  return (
    <div data-testid="math-lab-shell" className="cosmic-instrument-shell mx-auto max-w-7xl">
      <CosmicPageHeader title="Math Lab" eyebrow="Controlled interactive workspace" description="Explore curriculum-approved models without executing arbitrary expressions." accent="blue" />
      <div className="mt-6 flex flex-wrap gap-2" role="tablist" aria-label="Mathematics laboratories">
        {tabs.map(({ id, label, icon: Icon }) => (
          <button key={id} role="tab" aria-selected={active === id} className={`focus-ring cosmic-button inline-flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold ${active === id ? 'bg-gradient-to-r from-blue-400 to-cyan-300 text-slate-950' : 'cosmic-glass text-slate-200'}`} onClick={() => setActive(id)}>
            <Icon size={17} />{label}
          </button>
        ))}
      </div>
      <div className="mt-6">{active === 'function' ? <FunctionExplorer presetId={presetId} /> : active === 'matrix' ? <MatrixLab /> : <VectorGeometryLab />}</div>
    </div>
  );
};
