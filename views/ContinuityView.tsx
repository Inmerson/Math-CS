import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Unplug, CheckCircle2, AlertOctagon, ArrowRight, Lightbulb, Ruler } from 'lucide-react';
import { WolframHelper } from '../components/WolframHelper';
import { MathRenderer } from '../components/MathRenderer';

interface ContinuityRule {
    id: string;
    name: string;
    condition: string;
    desc: string;
    analogy: string;
    interactiveMode: 'HOLE' | 'JUMP' | 'CONTINUOUS';
}

const continuityRules: ContinuityRule[] = [
    {
        id: 'rule1',
        name: '1. Point Exists',
        condition: 'f(c) \\text{ is defined}',
        desc: 'The function must actually have a value at x = c. There cannot be a hole with no filled point.',
        analogy: "Like a bridge having a specific plank to step on at the center. If the plank is missing, you can't cross.",
        interactiveMode: 'HOLE'
    },
    {
        id: 'rule2',
        name: '2. Limit Exists',
        condition: '\\lim_{x \\to c} f(x) \\text{ exists}',
        desc: 'The left-hand path and the right-hand path must meet at the same location. No jumps allowed.',
        analogy: "Two road crews building a bridge from opposite sides must meet at the same height.",
        interactiveMode: 'JUMP'
    },
    {
        id: 'rule3',
        name: '3. Agreement',
        condition: '\\lim_{x \\to c} f(x) = f(c)',
        desc: 'The value of the limit must equal the actual function value. The "bridge plank" must be exactly where the road ends, not floating above.',
        analogy: "The pothole (limit) must be perfectly filled by the asphalt patch (point).",
        interactiveMode: 'CONTINUOUS'
    }
];

export const ContinuityView: React.FC = () => {
  const [activeRuleId, setActiveRuleId] = useState('rule3');
  const [pointY, setPointY] = useState(2); // Initial broken state
  
  const activeRule = continuityRules.find(r => r.id === activeRuleId) || continuityRules[0];
  
  // Simulation Constants
  const holeX = 2;
  const limitVal = 4;
  const width = 600;
  const height = 300;
  const scaleX = (x: number) => ((x + 2) / 8) * width;
  const scaleY = (y: number) => height - ((y) / 8) * height;

  // Visual States based on Interactive Mode
  // If Mode is JUMP, we offset the right line
  const rightLineOffset = activeRule.interactiveMode === 'JUMP' ? 2 : 0;
  
  const lineLeft = `M ${scaleX(-2)} ${scaleY(0)} L ${scaleX(holeX - 0.1)} ${scaleY(limitVal - 0.1)}`;
  const lineRight = `M ${scaleX(holeX + 0.1)} ${scaleY(limitVal - 0.1 + rightLineOffset)} L ${scaleX(6)} ${scaleY(8 + rightLineOffset)}`;

  // Status Checks
  const pointExists = true; // In this sim, we always draw the point
  const limitExists = activeRule.interactiveMode !== 'JUMP';
  const match = Math.abs(pointY - limitVal) < 0.2;
  
  const isCurrentlyContinuous = pointExists && limitExists && match;

  return (
    <div className="space-y-8 pb-20">
        <header className="border-b border-white/10 pb-6">
            <h2 className="text-4xl font-bold text-white mb-2 tracking-tight">Continuity & Limits</h2>
            <p className="text-slate-400 max-w-3xl font-light">
               The three fundamental laws that determine if a function is continuous at a point <span className="font-mono text-cyan-400">x = c</span>.
            </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left: Rules List */}
            <div className="lg:col-span-4 space-y-4">
                 {continuityRules.map((rule) => (
                     <button
                        key={rule.id}
                        onClick={() => setActiveRuleId(rule.id)}
                        className={`w-full text-left p-4 rounded-xl border transition-all duration-300 group relative overflow-hidden
                            ${activeRuleId === rule.id 
                                ? 'bg-slate-800 border-cyan-500/50 shadow-lg shadow-cyan-900/20' 
                                : 'bg-slate-900/40 border-slate-700 hover:bg-slate-800 hover:border-slate-600'}
                        `}
                     >
                        {activeRuleId === rule.id && (
                            <motion.div layoutId="activeRuleGlow" className="absolute inset-0 bg-cyan-500/5" />
                        )}
                        <div className="relative z-10 flex justify-between items-center">
                            <div>
                                <span className={`text-[10px] font-bold uppercase tracking-widest mb-1 block ${activeRuleId === rule.id ? 'text-cyan-400' : 'text-slate-500'}`}>
                                    Condition
                                </span>
                                <h3 className={`font-bold text-base ${activeRuleId === rule.id ? 'text-white' : 'text-slate-300'}`}>
                                    {rule.name}
                                </h3>
                            </div>
                            {activeRuleId === rule.id && <ArrowRight size={18} className="text-cyan-400" />}
                        </div>
                     </button>
                 ))}
            </div>

            {/* Right: Detail View */}
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
                        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-5 pointer-events-none"></div>

                        {/* Top: Definition */}
                        <div className="mb-8 text-center">
                            <MathRenderer expression={activeRule.condition} className="text-3xl text-white mb-4" />
                            <p className="text-slate-400 text-sm leading-relaxed max-w-lg mx-auto">
                                {activeRule.desc}
                            </p>
                        </div>

                        {/* Middle: Analogy */}
                        <div className="mb-8 bg-amber-500/5 p-5 rounded-xl border border-amber-500/20 flex gap-4 items-start">
                            <div className="p-2 bg-amber-500/10 rounded-lg text-amber-500 shrink-0">
                                <Lightbulb size={20} />
                            </div>
                            <div>
                                <h4 className="text-xs font-bold text-amber-400 uppercase tracking-widest mb-1">Real World Analogy</h4>
                                <p className="text-sm text-amber-100/80 italic">"{activeRule.analogy}"</p>
                            </div>
                        </div>

                        {/* Bottom: Interactive Repair Lab */}
                        <div className="bg-slate-900/40 rounded-2xl border border-white/5 p-6 relative overflow-hidden">
                             <div className="flex justify-between items-center mb-4 relative z-10">
                                <h4 className="text-xs font-bold text-cyan-400 uppercase tracking-widest flex items-center gap-2">
                                    <Ruler size={16}/> Repair Lab
                                </h4>
                                <div className={`px-2 py-1 rounded text-[10px] font-bold uppercase border flex items-center gap-2 ${isCurrentlyContinuous ? 'border-emerald-500/30 text-emerald-400 bg-emerald-500/10' : 'border-pink-500/30 text-pink-400 bg-pink-500/10'}`}>
                                    {isCurrentlyContinuous ? <CheckCircle2 size={12}/> : <AlertOctagon size={12}/>}
                                    {isCurrentlyContinuous ? 'Function Continuous' : 'Discontinuity Detected'}
                                </div>
                            </div>
                            
                            <div className="relative h-[250px] w-full bg-slate-950/50 rounded-xl border border-slate-800 mb-4">
                                <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full overflow-visible">
                                    {/* Grid Lines */}
                                    <line x1={scaleX(-2)} y1={scaleY(0)} x2={scaleX(6)} y2={scaleY(0)} stroke="#334155" strokeWidth="1"/>
                                    <line x1={scaleX(0)} y1={height} x2={scaleX(0)} y2={0} stroke="#334155" strokeWidth="1"/>
                                    
                                    {/* Curve Segments */}
                                    <path d={lineLeft} stroke="#22d3ee" strokeWidth="3" fill="none" strokeLinecap="round" opacity={0.6} />
                                    <path d={lineRight} stroke="#22d3ee" strokeWidth="3" fill="none" strokeLinecap="round" opacity={0.6} />
                                    
                                    {/* The Hole (Limit Location) */}
                                    {limitExists && (
                                        <circle cx={scaleX(holeX)} cy={scaleY(limitVal)} r="6" fill="#020617" stroke="#94a3b8" strokeWidth="2" strokeDasharray="2 2" />
                                    )}

                                    {/* The Point (User Controlled) */}
                                    <motion.circle 
                                        cx={scaleX(holeX)} 
                                        animate={{ cy: scaleY(pointY) }}
                                        r="6" 
                                        className={`${isCurrentlyContinuous ? 'fill-emerald-400 stroke-emerald-200' : 'fill-pink-500 stroke-pink-200'} cursor-grab active:cursor-grabbing`}
                                        strokeWidth="2"
                                    />
                                </svg>
                                
                                <div className="absolute top-2 right-2 bg-slate-900/80 p-2 rounded text-xs font-mono border border-slate-800">
                                    f(2) = <span className={isCurrentlyContinuous ? 'text-emerald-400' : 'text-pink-400'}>{pointY.toFixed(1)}</span>
                                </div>
                            </div>

                            <div className="flex gap-4 items-center">
                                <span className="text-xs text-slate-400 font-bold uppercase">Adjust f(2):</span>
                                <input 
                                    type="range" min="1" max="7" step="0.1"
                                    value={pointY}
                                    onChange={(e) => setPointY(parseFloat(e.target.value))}
                                    className="flex-1 h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                                />
                            </div>
                        </div>

                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
        <WolframHelper context="limits" />
    </div>
  );
};