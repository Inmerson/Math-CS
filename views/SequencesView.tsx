
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, Activity, ArrowRight, Lightbulb, Settings2, Hash, Play, RotateCcw } from 'lucide-react';
import { MathRenderer } from '../components/MathRenderer';
import { WolframHelper } from '../components/WolframHelper';

interface SequenceArchetype {
    id: string;
    name: string;
    formula: string;
    desc: string;
    analogy: string;
    breakdown: { term: string, meaning: string, color: string }[];
    type: 'EXPLICIT' | 'RECURSIVE';
    params: { key: string; label: string; min: number; max: number; step: number; default: number }[];
    generate: (n: number, params: Record<string, number>) => number;
}

const archetypes: SequenceArchetype[] = [
    {
        id: 'arithmetic',
        name: 'Arithmetic Sequence',
        formula: 'a_n = a_1 + (n-1)d',
        desc: 'A sequence with a constant difference between consecutive terms. It represents linear growth or decay.',
        analogy: "Like walking up a staircase. Each step rises by the exact same height (d), regardless of how high you are.",
        breakdown: [
            { term: "a_1", meaning: "Starting Position", color: "text-cyan-400" },
            { term: "(n-1)", meaning: "Number of steps taken", color: "text-purple-400" },
            { term: "d", meaning: "Step Size (Common Difference)", color: "text-emerald-400" }
        ],
        type: 'EXPLICIT',
        params: [
            { key: 'a1', label: 'Start (a₁)', min: -10, max: 10, step: 1, default: 0 },
            { key: 'd', label: 'Difference (d)', min: -5, max: 5, step: 0.5, default: 1 }
        ],
        generate: (n, p) => p.a1 + (n - 1) * p.d
    },
    {
        id: 'geometric',
        name: 'Geometric Sequence',
        formula: 'a_n = a_1 \\cdot r^{n-1}',
        desc: 'A sequence where each term is multiplied by a constant ratio. Represents exponential growth or decay.',
        analogy: "Like a colony of bacteria doubling every hour, or a bouncing ball reaching half its previous height.",
        breakdown: [
            { term: "a_1", meaning: "Initial Amount", color: "text-cyan-400" },
            { term: "r", meaning: "Growth Multiplier (Ratio)", color: "text-pink-400" },
            { term: "n-1", meaning: "Time steps elapsed", color: "text-slate-400" }
        ],
        type: 'EXPLICIT',
        params: [
            { key: 'a1', label: 'Start (a₁)', min: 1, max: 10, step: 1, default: 2 },
            { key: 'r', label: 'Ratio (r)', min: -2, max: 2, step: 0.1, default: 0.8 }
        ],
        generate: (n, p) => p.a1 * Math.pow(p.r, n - 1)
    },
    {
        id: 'fibonacci',
        name: 'Fibonacci (Recursive)',
        formula: 'F_n = F_{n-1} + F_{n-2}',
        desc: 'Each term is the sum of the two preceding ones. Famous for appearing in nature (sunflowers, shells).',
        analogy: "Like adding the last two generations of rabbits to determine the current population size.",
        breakdown: [
            { term: "F_{n-1}", meaning: "Previous Term", color: "text-cyan-400" },
            { term: "F_{n-2}", meaning: "Term before previous", color: "text-purple-400" }
        ],
        type: 'RECURSIVE',
        params: [
            { key: 'f0', label: 'First (F₀)', min: 0, max: 5, step: 1, default: 0 },
            { key: 'f1', label: 'Second (F₁)', min: 1, max: 5, step: 1, default: 1 }
        ],
        generate: (n, p) => {
            // This allows random access for graph, though inefficient for large n without memo
            if (n === 1) return p.f0;
            if (n === 2) return p.f1;
            let a = p.f0, b = p.f1;
            for (let i = 3; i <= n; i++) {
                let temp = a + b;
                a = b;
                b = temp;
            }
            return b;
        }
    },
    {
        id: 'alternating',
        name: 'Harmonic Alternating',
        formula: 'a_n = \\frac{(-1)^{n+1}}{n}',
        desc: 'A sequence that oscillates between positive and negative values while shrinking towards zero.',
        analogy: "Like a pendulum swinging back and forth, but with friction causing each swing to be shorter than the last.",
        breakdown: [
            { term: "(-1)^{n+1}", meaning: "Sign Flipper", color: "text-yellow-400" },
            { term: "1/n", meaning: "Damping Factor", color: "text-emerald-400" }
        ],
        type: 'EXPLICIT',
        params: [], // No params for this specific classic example
        generate: (n, p) => Math.pow(-1, n + 1) / n
    }
];

export const SequencesView: React.FC = () => {
  const [activeId, setActiveId] = useState('arithmetic');
  const activeSeq = archetypes.find(a => a.id === activeId) || archetypes[0];
  
  // Param State Management
  const [params, setParams] = useState<Record<string, number>>(() => {
      const initial: Record<string, number> = {};
      archetypes.forEach(a => a.params.forEach(p => initial[`${a.id}_${p.key}`] = p.default));
      return initial;
  });

  const updateParam = (key: string, val: number) => {
      setParams(prev => ({ ...prev, [`${activeId}_${key}`]: val }));
  };

  const getParam = (key: string) => params[`${activeId}_${key}`] ?? 0;

  // Generate Data
  const nTerms = 20;
  const dataPoints = Array.from({ length: nTerms }, (_, i) => {
      const n = i + 1;
      const currentParams: Record<string, number> = {};
      activeSeq.params.forEach(p => currentParams[p.key] = getParam(p.key));
      return { n, val: activeSeq.generate(n, currentParams) };
  });

  // Graph Scaling
  const maxVal = Math.max(...dataPoints.map(d => d.val), 0.1);
  const minVal = Math.min(...dataPoints.map(d => d.val), 0);
  const range = maxVal - minVal || 1;
  const padding = range * 0.1;

  const getY = (val: number) => {
      const normalized = (val - (minVal - padding)) / (range + 2 * padding);
      return 300 - (normalized * 300); // SVG Height 300
  };

  return (
    <div className="space-y-8 pb-20">
       <header className="border-b border-white/10 pb-6">
            <h2 className="text-4xl font-bold text-white mb-2 tracking-tight">Sequence Archetypes</h2>
            <p className="text-slate-400 max-w-3xl font-light">
                Explore the behavior of discrete mathematical patterns. 
                Configure parameters to observe convergence, divergence, and oscillation.
            </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left: Selector */}
            <div className="lg:col-span-4 space-y-4">
                {archetypes.map((seq) => (
                    <button
                        key={seq.id}
                        onClick={() => setActiveId(seq.id)}
                        className={`w-full text-left p-4 rounded-xl border transition-all duration-300 group relative overflow-hidden
                            ${activeId === seq.id 
                                ? 'bg-slate-800 border-cyan-500/50 shadow-lg shadow-cyan-900/20' 
                                : 'bg-slate-900/40 border-slate-700 hover:bg-slate-800 hover:border-slate-600'}
                        `}
                    >
                        {activeId === seq.id && (
                            <motion.div layoutId="activeSeqGlow" className="absolute inset-0 bg-cyan-500/5" />
                        )}
                        <div className="relative z-10 flex justify-between items-center">
                            <div>
                                <span className={`text-[10px] font-bold uppercase tracking-widest mb-1 block ${activeId === seq.id ? 'text-cyan-400' : 'text-slate-500'}`}>
                                    {seq.type}
                                </span>
                                <h3 className={`font-bold text-base ${activeId === seq.id ? 'text-white' : 'text-slate-300'}`}>
                                    {seq.name}
                                </h3>
                            </div>
                            {activeId === seq.id && <ArrowRight size={18} className="text-cyan-400" />}
                        </div>
                    </button>
                ))}
            </div>

            {/* Right: Master Detail */}
            <div className="lg:col-span-8">
                <AnimatePresence mode='wait'>
                    <motion.div
                        key={activeId}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                        className="glass-panel p-8 rounded-[32px] border-l-4 border-l-cyan-500 relative overflow-hidden"
                    >
                         <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-5 pointer-events-none"></div>
                         
                         {/* Concept Header */}
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8 relative z-10">
                             
                             {/* Definition Card */}
                             <div className="bg-slate-950/80 p-6 rounded-2xl border border-white/5 shadow-inner">
                                  <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4">General Formula</div>
                                  <MathRenderer expression={activeSeq.formula} className="text-2xl text-white mb-6 text-center" />
                                  
                                  <div className="space-y-3">
                                      {activeSeq.breakdown.map((item, idx) => (
                                          <div key={idx} className="flex items-center gap-3 bg-slate-900/50 p-2 rounded border border-slate-800/50">
                                              <div className={`font-mono font-bold text-xs ${item.color} min-w-[40px] text-center`}>
                                                  <MathRenderer expression={item.term} inline />
                                              </div>
                                              <p className="text-xs text-slate-400">{item.meaning}</p>
                                          </div>
                                      ))}
                                  </div>
                             </div>

                             {/* Intuition Card */}
                             <div className="flex flex-col">
                                 <div className="bg-amber-500/5 p-5 rounded-xl border border-amber-500/20 mb-4">
                                     <h4 className="text-xs font-bold text-amber-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                                        <Lightbulb size={14}/> Intuition
                                     </h4>
                                     <p className="text-sm text-amber-100/80 italic leading-relaxed">"{activeSeq.analogy}"</p>
                                 </div>
                                 <p className="text-sm text-slate-400 leading-relaxed font-light">
                                     {activeSeq.desc}
                                 </p>
                             </div>
                         </div>

                         {/* Interactive Lab */}
                         <div className="bg-slate-900/40 rounded-2xl border border-white/5 p-6 relative">
                             <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                                 <h4 className="text-xs font-bold text-cyan-400 uppercase tracking-widest flex items-center gap-2">
                                    <Activity size={16}/> Interactive Lab
                                 </h4>
                                 
                                 {/* Controls */}
                                 {activeSeq.params.length > 0 && (
                                     <div className="flex flex-wrap gap-4 bg-slate-950/50 p-2 rounded-xl border border-white/5">
                                         {activeSeq.params.map(p => (
                                             <div key={p.key} className="flex items-center gap-3 px-2">
                                                 <label className="text-[10px] font-bold text-slate-400 uppercase">{p.label}</label>
                                                 <input 
                                                    type="number" 
                                                    step={p.step} 
                                                    value={getParam(p.key)}
                                                    onChange={(e) => updateParam(p.key, parseFloat(e.target.value))}
                                                    className="w-16 bg-slate-900 border border-slate-700 rounded px-2 py-1 text-xs text-white text-center focus:border-cyan-500 outline-none"
                                                 />
                                             </div>
                                         ))}
                                     </div>
                                 )}
                             </div>

                             {/* Graph */}
                             <div className="relative h-[300px] w-full border-l border-b border-slate-700 ml-2">
                                 <div className="absolute inset-0 flex items-end justify-between px-2">
                                     {/* X Axis Labels */}
                                     {/* Simplified, not rendering all */}
                                 </div>
                                 
                                 {/* Zero Line */}
                                 {minVal < 0 && maxVal > 0 && (
                                     <div className="absolute w-full h-px bg-slate-600 border-t border-dashed border-slate-500 opacity-50" style={{ top: getY(0) }} />
                                 )}

                                 <svg className="absolute inset-0 w-full h-full overflow-visible">
                                      <defs>
                                         <linearGradient id="seqGradient" x1="0" y1="0" x2="1" y2="0">
                                             <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.4" />
                                             <stop offset="100%" stopColor="#a855f7" stopOpacity="0.8" />
                                         </linearGradient>
                                     </defs>

                                     {/* Trend Line */}
                                     <motion.polyline 
                                        points={dataPoints.map((d, i) => {
                                            const x = (i / (nTerms - 1)) * 100;
                                            return `${x}%,${getY(d.val)}`;
                                        }).join(' ')}
                                        fill="none"
                                        stroke="url(#seqGradient)"
                                        strokeWidth="2"
                                        strokeDasharray="4 4"
                                        initial={{ pathLength: 0 }}
                                        animate={{ pathLength: 1 }}
                                        transition={{ duration: 1 }}
                                     />

                                     {/* Points */}
                                     {dataPoints.map((d, i) => {
                                         const x = (i / (nTerms - 1)) * 100;
                                         return (
                                             <motion.circle 
                                                key={i}
                                                initial={{ scale: 0 }}
                                                animate={{ scale: 1, cx: `${x}%`, cy: getY(d.val) }}
                                                transition={{ delay: i * 0.05, type: 'spring' }}
                                                r={4}
                                                className="fill-cyan-400 stroke-slate-900 stroke-2 hover:r-6 hover:fill-white cursor-pointer"
                                             >
                                                 <title>n={d.n}, a_n={d.val.toFixed(2)}</title>
                                             </motion.circle>
                                         );
                                     })}
                                 </svg>
                             </div>
                             
                             <div className="flex justify-between mt-2 px-2 text-[10px] font-mono text-slate-500">
                                 <span>n=1</span>
                                 <span>n={nTerms}</span>
                             </div>
                         </div>

                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
        
        <WolframHelper context="sequences" />
    </div>
  );
};
