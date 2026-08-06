import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Layers, Sigma, AlertTriangle, CheckCircle2, BarChart3, Lightbulb, ArrowRight, LayoutList } from 'lucide-react';
import { MathRenderer } from '../components/MathRenderer';

interface SeriesRule {
    id: string;
    name: string;
    formula: string;
    desc: string;
    analogy: string;
    breakdown: { term: string, meaning: string, color: string }[];
    convergenceCondition: string;
    interactive: boolean;
}

const seriesRules: SeriesRule[] = [
    {
        id: 'geometric',
        name: 'Geometric Series',
        formula: '\\sum_{n=0}^{\\infty} a \\cdot r^n',
        desc: 'A series where each term is found by multiplying the previous term by a fixed, non-zero number called the common ratio.',
        analogy: "Like a bouncing ball that rebounds to a fraction of its previous height. Even though it bounces infinitely many times, the total distance traveled is finite.",
        breakdown: [
            { term: "a", meaning: "First Term (Starting Value)", color: "text-cyan-400" },
            { term: "r", meaning: "Common Ratio (Multiplier)", color: "text-purple-400" },
            { term: "\\sum", meaning: "Summation of infinite terms", color: "text-slate-400" }
        ],
        convergenceCondition: "|r| < 1",
        interactive: true
    },
    {
        id: 'harmonic',
        name: 'Harmonic Series',
        formula: '\\sum_{n=1}^{\\infty} \\frac{1}{n}',
        desc: 'The sum of reciprocals of integers. It is the classic example of a series whose terms go to zero, yet the sum still grows to infinity.',
        analogy: "Imagine stacking blocks that get slightly smaller. You can actually stack them infinitely high, even if the blocks become microscopic.",
        breakdown: [
            { term: "1", meaning: "Constant Numerator", color: "text-emerald-400" },
            { term: "n", meaning: "Index (Denom increases linearly)", color: "text-pink-400" }
        ],
        convergenceCondition: "Diverges (Always)",
        interactive: true
    },
    {
        id: 'pseries',
        name: 'p-Series Test',
        formula: '\\sum_{n=1}^{\\infty} \\frac{1}{n^p}',
        desc: 'A generalization of the harmonic series. The exponent "p" determines the "speed" at which terms shrink.',
        analogy: "The 'Speed Limit' of convergence. If p > 1, the terms shrink fast enough to create a finite sum. If p ≤ 1, they are too slow.",
        breakdown: [
            { term: "n", meaning: "Base Index", color: "text-cyan-400" },
            { term: "p", meaning: "Power Parameter", color: "text-orange-400" }
        ],
        convergenceCondition: "p > 1",
        interactive: false
    },
    {
        id: 'alternating',
        name: 'Alternating Series',
        formula: '\\sum_{n=1}^{\\infty} (-1)^{n+1} b_n',
        desc: 'A series where terms switch signs (+, -, +, -). These are much more likely to converge due to cancellation.',
        analogy: "Taking 2 steps forward, 1 step back, 0.5 forward, 0.25 back... You eventually settle on a specific spot.",
        breakdown: [
            { term: "(-1)^{n+1}", meaning: "Sign Flipper (+1, -1...)", color: "text-yellow-400" },
            { term: "b_n", meaning: "Positive magnitude part", color: "text-slate-300" }
        ],
        convergenceCondition: "\\lim b_n = 0 \\text{ and } b_{n+1} \\le b_n",
        interactive: true
    }
];

export const SeriesView: React.FC = () => {
  const [activeId, setActiveId] = useState('geometric');
  const [nTerms, setNTerms] = useState(15);
  
  // Geometric Params
  const [geoA, setGeoA] = useState(1);
  const [geoR, setGeoR] = useState(0.5);

  const activeRule = seriesRules.find(r => r.id === activeId) || seriesRules[0];

  // Logic for Interactive Graph
  const getData = () => {
      const data = [];
      let sum = 0;
      for(let n=1; n<=nTerms; n++) {
          let term = 0;
          if (activeId === 'geometric') {
             // Form: a * r^(n-1) to match index 1 visual
             term = geoA * Math.pow(geoR, n-1);
          } else if (activeId === 'harmonic') {
             term = 1/n;
          } else if (activeId === 'alternating') {
             // Alt Harmonic: (-1)^(n+1) / n
             term = Math.pow(-1, n+1) / n;
          }
          sum += term;
          data.push({ n, term, sum });
      }
      return data;
  };

  const graphData = getData();
  const maxSum = Math.max(...graphData.map(d => Math.abs(d.sum)), 0.1) * 1.2;
  const isConvergent = 
    (activeId === 'geometric' && Math.abs(geoR) < 1) || 
    (activeId === 'alternating') || 
    (activeId === 'pseries'); // p=2 assumed for static pseries example

  return (
    <div className="space-y-8 pb-20">
        <header className="border-b border-white/10 pb-6">
            <h2 className="text-4xl font-bold text-white mb-2 tracking-tight">Infinite Series Codex</h2>
            <p className="text-slate-400 max-w-3xl font-light">
                Understanding the summation of infinite sequences. Analyze convergence tests, formulas, and behaviors.
            </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left: Rule Selector */}
            <div className="lg:col-span-4 space-y-4">
                 {seriesRules.map((rule) => (
                     <button
                        key={rule.id}
                        onClick={() => setActiveId(rule.id)}
                        className={`w-full text-left p-4 rounded-xl border transition-all duration-300 group relative overflow-hidden
                            ${activeId === rule.id 
                                ? 'bg-slate-800 border-cyan-500/50 shadow-lg shadow-cyan-900/20' 
                                : 'bg-slate-900/40 border-slate-700 hover:bg-slate-800 hover:border-slate-600'}
                        `}
                     >
                        {activeId === rule.id && (
                            <motion.div layoutId="activeSeriesGlow" className="absolute inset-0 bg-cyan-500/5" />
                        )}
                        <div className="relative z-10 flex justify-between items-center">
                            <div>
                                <span className={`text-[10px] font-bold uppercase tracking-widest mb-1 block ${activeId === rule.id ? 'text-cyan-400' : 'text-slate-500'}`}>
                                    Series Type
                                </span>
                                <h3 className={`font-bold text-base ${activeId === rule.id ? 'text-white' : 'text-slate-300'}`}>
                                    {rule.name}
                                </h3>
                            </div>
                            {activeId === rule.id && <ArrowRight size={18} className="text-cyan-400" />}
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

                        {/* Top: Formula & Breakdown */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                             <div className="bg-slate-950/80 p-6 rounded-2xl border border-white/5 flex flex-col items-center justify-center min-h-[160px] relative group">
                                  <div className="absolute top-3 left-3 text-[10px] font-bold uppercase tracking-widest text-slate-500">Standard Form</div>
                                  <MathRenderer expression={activeRule.formula} className="text-2xl md:text-3xl text-white" />
                                  
                                  <div className={`mt-4 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border flex items-center gap-2 ${isConvergent ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-pink-500/10 border-pink-500/30 text-pink-400'}`}>
                                      {isConvergent ? <CheckCircle2 size={12}/> : <AlertTriangle size={12}/>}
                                      {isConvergent ? 'Converges' : 'Diverges'} Condition: <MathRenderer expression={activeRule.convergenceCondition} inline className="ml-1" />
                                  </div>
                             </div>

                             <div>
                                 <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                                    <LayoutList size={14} className="text-purple-400"/> Anatomy
                                 </h4>
                                 <div className="space-y-3">
                                     {activeRule.breakdown.map((item, idx) => (
                                         <div key={idx} className="bg-slate-900/50 p-2.5 rounded-lg border border-slate-800 flex items-center gap-3">
                                             <div className={`font-mono font-bold text-sm ${item.color} min-w-[30px] text-center`}>
                                                 <MathRenderer expression={item.term} inline />
                                             </div>
                                             <p className="text-xs text-slate-400 leading-snug">{item.meaning}</p>
                                         </div>
                                     ))}
                                 </div>
                             </div>
                        </div>

                        {/* Middle: Intuition */}
                        <div className="mb-8">
                             <div className="bg-amber-500/5 p-5 rounded-xl border border-amber-500/20">
                                 <h4 className="text-xs font-bold text-amber-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                                    <Lightbulb size={14}/> Intuition
                                 </h4>
                                 <p className="text-sm text-amber-100/80 leading-relaxed italic">
                                     "{activeRule.analogy}"
                                 </p>
                                 <p className="text-xs text-slate-400 mt-2 font-light">
                                     {activeRule.desc}
                                 </p>
                             </div>
                        </div>

                        {/* Bottom: Interactive Lab */}
                        {activeRule.interactive ? (
                             <div className="bg-slate-900/40 rounded-2xl border border-white/5 p-6">
                                 <div className="flex justify-between items-center mb-6">
                                     <h4 className="text-xs font-bold text-cyan-400 uppercase tracking-widest flex items-center gap-2">
                                        <BarChart3 size={16}/> Interactive Lab
                                     </h4>
                                     
                                     {activeId === 'geometric' && (
                                         <div className="flex gap-4">
                                             <label className="text-xs text-slate-400 flex items-center gap-2">
                                                 r = <input type="number" step="0.1" value={geoR} onChange={e => setGeoR(parseFloat(e.target.value))} className="w-16 bg-slate-950 border border-slate-700 rounded px-2 py-1 text-white" />
                                             </label>
                                             <label className="text-xs text-slate-400 flex items-center gap-2">
                                                 a = <input type="number" step="1" value={geoA} onChange={e => setGeoA(parseFloat(e.target.value))} className="w-12 bg-slate-950 border border-slate-700 rounded px-2 py-1 text-white" />
                                             </label>
                                         </div>
                                     )}
                                 </div>
                                 
                                 <div className="h-40 w-full relative border-l border-b border-slate-700 ml-2">
                                      {/* Zero Line */}
                                      <div className="absolute w-full h-px bg-slate-700" style={{ top: '50%' }} />

                                      <div className="absolute inset-0 flex items-center">
                                          {graphData.map((d, i) => {
                                              const heightPercent = (d.sum / maxSum) * 50; // Scale to fit
                                              return (
                                                  <div key={i} className="flex-1 h-full flex flex-col justify-center items-center group relative">
                                                      <motion.div 
                                                        initial={{ height: 0 }}
                                                        animate={{ height: `${Math.abs(heightPercent)}%` }}
                                                        className={`w-1/2 min-w-[2px] rounded-sm transition-all ${d.sum >= 0 ? 'bg-cyan-500 mb-[50%]' : 'bg-pink-500 mt-[50%]'}`}
                                                        style={{ transformOrigin: d.sum >= 0 ? 'bottom' : 'top' }}
                                                      />
                                                      {/* Point */}
                                                      <div className={`w-2 h-2 rounded-full absolute bg-white shadow-lg ${d.sum >=0 ? 'mb-[50%]' : 'mt-[50%]'}`} style={{ bottom: d.sum >= 0 ? `calc(50% + ${Math.abs(heightPercent)}% - 4px)` : 'auto', top: d.sum < 0 ? `calc(50% + ${Math.abs(heightPercent)}% - 4px)` : 'auto' }} />
                                                  </div>
                                              )
                                          })}
                                      </div>
                                 </div>
                                 <div className="flex justify-between mt-2 text-[10px] text-slate-500 font-mono">
                                     <span>n=1</span>
                                     <span>n={nTerms}</span>
                                 </div>
                                 <div className="mt-2 text-center text-xs font-mono text-cyan-300">
                                     Current Partial Sum S_{nTerms} = {graphData[graphData.length-1].sum.toFixed(5)}
                                 </div>
                             </div>
                        ) : (
                             <div className="p-8 text-center border border-dashed border-slate-700 rounded-xl text-slate-500 text-sm">
                                 Interactive lab not available for this general test type.
                             </div>
                        )}
                    </motion.div>
                </AnimatePresence>
            </div>

        </div>
    </div>
  );
};