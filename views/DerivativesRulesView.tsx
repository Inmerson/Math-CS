import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Divide, Zap, BookOpen, ArrowRight, Lightbulb, Activity, Layers } from 'lucide-react';
import { WolframHelper } from '../components/WolframHelper';
import { MathRenderer } from '../components/MathRenderer';

interface Rule {
    id: string;
    name: string;
    formula: string;
    desc: string;
    analogy: string;
    breakdown: { term: string, meaning: string, color: string }[];
    example: { problem: string, solution: string };
}

const rules: Rule[] = [
    {
      id: 'def',
      name: "Definition of Derivative",
      formula: "f'(x) = \\lim_{\\Delta x \\to 0} \\frac{f(x + \\Delta x) - f(x)}{\\Delta x}",
      desc: "The fundamental measure of instantaneous change. Geometrically, it represents the slope of the tangent line at a specific point.",
      analogy: "Like a speedometer in a car. It tells you your exact speed at a specific instant, not just the average speed over the whole trip.",
      breakdown: [
          { term: "f(x + \\Delta x) - f(x)", meaning: "Change in Output (Rise)", color: "text-cyan-400" },
          { term: "\\Delta x", meaning: "Change in Input (Run)", color: "text-purple-400" },
          { term: "\\lim", meaning: "Approaching Zero Interval", color: "text-emerald-400" }
      ],
      example: { problem: "f(x) = x^2", solution: "2x" }
    },
    {
      id: 'power',
      name: "Power Rule",
      formula: "\\frac{d}{dx}(x^n) = n \\cdot x^{n-1}",
      desc: "Used for polynomials. You bring the exponent down as a multiplier and subtract one from the power.",
      analogy: "Think of it as 'demoting' the power. A cubic function becomes quadratic, a quadratic becomes linear.",
      breakdown: [
          { term: "n", meaning: "Original Exponent becomes Multiplier", color: "text-pink-400" },
          { term: "n-1", meaning: "Power reduces by one degree", color: "text-orange-400" }
      ],
      example: { problem: "\\frac{d}{dx}(x^4)", solution: "4x^3" }
    },
    {
      id: 'product',
      name: "Product Rule",
      formula: "(f \\cdot g)' = f'g + fg'",
      desc: "Derivative of two multiplied functions. It's NOT just f' times g'. It's the 'first times derivative of second plus second times derivative of first'.",
      analogy: "Imagine tracking the growth of a rectangular garden where both Length (f) and Width (g) are expanding simultaneously.",
      breakdown: [
          { term: "f'g", meaning: "Growth due to change in first function", color: "text-cyan-400" },
          { term: "fg'", meaning: "Growth due to change in second function", color: "text-purple-400" }
      ],
      example: { problem: "(x^2)(\\sin x)", solution: "2x\\sin x + x^2\\cos x" }
    },
    {
      id: 'chain',
      name: "Chain Rule",
      formula: "\\frac{d}{dx}f(g(x)) = f'(g(x)) \\cdot g'(x)",
      desc: "Used for composition functions (functions inside functions). Differentiate the outer layer, keep inner same, multiply by derivative of inner.",
      analogy: "Like peeling an onion. You have to peel the outer layer (f) before you can deal with the inner layer (g).",
      breakdown: [
          { term: "f'(g(x))", meaning: "Outer Derivative (Inner unchanged)", color: "text-emerald-400" },
          { term: "g'(x)", meaning: "Inner Derivative (Chain)", color: "text-rose-400" }
      ],
      example: { problem: "\\sin(x^3)", solution: "\\cos(x^3) \\cdot 3x^2" }
    },
    {
      id: 'quotient',
      name: "Quotient Rule",
      formula: "\\left(\\frac{f}{g}\\right)' = \\frac{f'g - fg'}{g^2}",
      desc: "Derivative of division. Mnemonic: 'Low d-High minus High d-Low, over Low Low'.",
      analogy: "Measuring the rate of change of a ratio, like population density (People / Area) where both change over time.",
      breakdown: [
          { term: "f'g - fg'", meaning: "Opposing rates of change", color: "text-cyan-400" },
          { term: "g^2", meaning: "Normalization factor", color: "text-slate-400" }
      ],
      example: { problem: "\\frac{x}{e^x}", solution: "\\frac{1\\cdot e^x - x\\cdot e^x}{(e^x)^2}" }
    }
];

export const DerivativesRulesView: React.FC = () => {
  const [activeRule, setActiveRule] = useState(rules[0]);

  return (
    <div className="space-y-8 pb-20">
      <header className="border-b border-white/10 pb-6">
        <h2 className="text-4xl font-bold text-white mb-2 tracking-tight">Differentiation Codex</h2>
        <p className="text-slate-400 max-w-3xl font-light">
           The fundamental laws of Calculus. Select a rule to explore its mechanism, geometric meaning, and application.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left: Rule Selector */}
        <div className="lg:col-span-4 space-y-4">
             {rules.map((rule) => (
                 <button
                    key={rule.id}
                    onClick={() => setActiveRule(rule)}
                    className={`w-full text-left p-4 rounded-xl border transition-all duration-300 group relative overflow-hidden
                        ${activeRule.id === rule.id 
                            ? 'bg-slate-800 border-cyan-500/50 shadow-lg shadow-cyan-900/20' 
                            : 'bg-slate-900/40 border-slate-700 hover:bg-slate-800 hover:border-slate-600'}
                    `}
                 >
                    {activeRule.id === rule.id && (
                        <motion.div 
                            layoutId="activeGlow"
                            className="absolute inset-0 bg-cyan-500/5"
                        />
                    )}
                    <div className="relative z-10 flex justify-between items-center">
                        <div>
                            <span className={`text-xs font-bold uppercase tracking-widest mb-1 block ${activeRule.id === rule.id ? 'text-cyan-400' : 'text-slate-500'}`}>
                                Rule 0{rules.indexOf(rule) + 1}
                            </span>
                            <h3 className={`font-bold text-lg ${activeRule.id === rule.id ? 'text-white' : 'text-slate-300'}`}>
                                {rule.name}
                            </h3>
                        </div>
                        {activeRule.id === rule.id && <ArrowRight size={20} className="text-cyan-400" />}
                    </div>
                 </button>
             ))}
        </div>

        {/* Right: Active Rule Lab */}
        <div className="lg:col-span-8">
            <AnimatePresence mode='wait'>
                <motion.div
                    key={activeRule.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="glass-panel p-8 rounded-[32px] border-l-4 border-l-cyan-500 relative overflow-hidden"
                >
                    {/* Background Noise */}
                    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-5 pointer-events-none"></div>

                    {/* Formula Display */}
                    <div className="bg-slate-950/80 p-6 rounded-2xl border border-white/5 mb-8 text-center shadow-inner relative group">
                        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <span className="text-[10px] text-slate-500 uppercase tracking-widest border border-slate-800 px-2 py-1 rounded">LaTeX</span>
                        </div>
                        <MathRenderer expression={activeRule.formula} className="text-2xl md:text-3xl text-white" />
                    </div>

                    {/* Breakdown & Analogy Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                        
                        {/* Anatomy */}
                        <div>
                             <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                                <Layers size={16} className="text-purple-400"/> Formula Anatomy
                             </h4>
                             <div className="space-y-3">
                                 {activeRule.breakdown.map((item, idx) => (
                                     <div key={idx} className="bg-slate-900/50 p-3 rounded-lg border border-slate-800 flex items-start gap-3">
                                         <div className="mt-1"><div className={`w-2 h-2 rounded-full ${item.color.replace('text-', 'bg-')}`}></div></div>
                                         <div>
                                             <div className={`font-mono font-bold text-sm ${item.color}`}>
                                                 <MathRenderer expression={item.term} inline />
                                             </div>
                                             <p className="text-xs text-slate-400 leading-snug">{item.meaning}</p>
                                         </div>
                                     </div>
                                 ))}
                             </div>
                        </div>

                        {/* Intuition */}
                        <div>
                             <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                                <Lightbulb size={16} className="text-amber-400"/> Intuition & Analogy
                             </h4>
                             <div className="bg-amber-500/5 p-5 rounded-xl border border-amber-500/20 text-amber-100/80 text-sm leading-relaxed mb-4">
                                 "{activeRule.analogy}"
                             </div>
                             <p className="text-slate-400 text-sm leading-relaxed">
                                 {activeRule.desc}
                             </p>
                        </div>
                    </div>

                    {/* Live Example */}
                    <div className="border-t border-white/10 pt-6">
                        <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                            <Zap size={16} className="text-pink-400"/> Worked Example
                        </h4>
                        <div className="flex flex-col md:flex-row items-center gap-4 bg-slate-900/80 p-4 rounded-xl border border-slate-800">
                             <div className="text-slate-400 font-mono text-sm">
                                 Problem: <MathRenderer expression={activeRule.example.problem} inline />
                             </div>
                             <ArrowRight size={16} className="text-slate-600 hidden md:block" />
                             <div className="rotate-90 md:rotate-0 text-slate-600 md:hidden"><ArrowRight size={16}/></div>
                             <div className="text-cyan-400 font-mono text-lg font-bold">
                                 <MathRenderer expression={activeRule.example.solution} inline />
                             </div>
                        </div>
                    </div>

                </motion.div>
            </AnimatePresence>
        </div>
      </div>

      <WolframHelper context="derivatives" />
    </div>
  );
};