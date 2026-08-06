import React from 'react';
import { TrendingUp } from 'lucide-react';

export const Sequences3DView: React.FC = () => (
  <section className="notebook-panel p-6" aria-labelledby="sequence-trajectory-title">
    <div className="flex items-center gap-3">
      <TrendingUp className="text-cyan-300" aria-hidden="true" />
      <h2 id="sequence-trajectory-title" className="text-2xl font-bold text-white">Sequence Trajectory</h2>
    </div>
    <p className="mt-4 max-w-3xl leading-7 text-slate-300">
      Indexed values can be represented as points on a coordinate path. The active Math-CS experience uses the bounded Function Explorer for sequence convergence, so this compatibility view contains no domain-specific imagery.
    </p>
    <div className="formula-panel mt-5 font-mono text-cyan-100">pₙ = (n, aₙ)</div>
  </section>
);
