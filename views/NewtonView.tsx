import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Activity, Play, RotateCcw, Target } from 'lucide-react';
import { WolframHelper } from '../components/WolframHelper';

export const NewtonView: React.FC = () => {
  // Solve x^3 - x - 1 = 0
  const [startX, setStartX] = useState(1.5);
  const [stepIndex, setStepIndex] = useState(0); // For visualizing specific step
  
  const f = (x: number) => x*x*x - x - 1;
  const df = (x: number) => 3*x*x - 1;

  const getSteps = () => {
      const steps = [];
      let x = startX;
      for(let i=0; i<6; i++) {
          const y = f(x);
          const slope = df(x);
          const nextX = slope !== 0 ? x - y/slope : x;
          steps.push({ i, x, y, slope, nextX });
          if (slope === 0) break;
          x = nextX;
      }
      return steps;
  }

  const steps = getSteps();
  const currentStep = steps[Math.min(stepIndex, steps.length - 1)];

  // --- Graphing Config ---
  const width = 600;
  const height = 400;
  const xDomain = [0, 2.5];
  const yDomain = [-2, 8];
  
  const scaleX = (x: number) => ((x - xDomain[0]) / (xDomain[1] - xDomain[0])) * width;
  const scaleY = (y: number) => height - ((y - yDomain[0]) / (yDomain[1] - yDomain[0])) * height;

  const generateFunctionPath = () => {
      let path = "";
      const step = 0.05;
      for (let x = xDomain[0]; x <= xDomain[1]; x += step) {
          const y = f(x);
          const sx = scaleX(x);
          const sy = scaleY(y);
          if (x === xDomain[0]) path += `M ${sx} ${sy}`;
          else path += ` L ${sx} ${sy}`;
      }
      return path;
  };

  const getTangentLine = () => {
      // Line equation: y - y0 = m(x - x0) => y = m(x - x0) + y0
      // We want to draw from (x0, y0) down to (nextX, 0)
      const x0 = currentStep.x;
      const y0 = currentStep.y;
      const x1 = currentStep.nextX;
      const y1 = 0;

      return {
          x1: scaleX(x0),
          y1: scaleY(y0),
          x2: scaleX(x1),
          y2: scaleY(y1)
      };
  };

  const tangent = getTangentLine();

  return (
      <div className="space-y-8 pb-20">
           <header className="border-b border-white/10 pb-6">
                <h2 className="text-4xl font-bold text-white mb-2">Newton-Raphson Visualizer</h2>
                <p className="text-slate-400 max-w-2xl">
                    See how the algorithm "surfs" down the tangent lines to find where the curve crosses zero.
                    <br/>Formula: <span className="font-mono text-cyan-400">xₙ₊₁ = xₙ - f(xₙ)/f'(xₙ)</span>
                </p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                
                {/* Left: Controls & Table */}
                <div className="lg:col-span-5 space-y-6">
                    <div className="glass-panel p-6 rounded-2xl border border-slate-700">
                        <label className="text-slate-300 text-xs font-bold uppercase tracking-widest mb-4 block">1. Set Initial Guess (x₀)</label>
                        <div className="flex gap-4 items-center mb-6">
                            <input 
                                type="range" min="0.5" max="2.4" step="0.1" 
                                value={startX} onChange={(e) => { setStartX(parseFloat(e.target.value)); setStepIndex(0); }}
                                className="flex-1 h-2 bg-slate-600 rounded-lg appearance-none accent-pink-500 cursor-pointer"
                            />
                            <span className="text-xl font-mono text-pink-400 font-bold w-12 text-right">{startX}</span>
                        </div>
                        <p className="text-xs text-slate-500 mb-6">
                            Changing the start point affects the path to the root.
                        </p>

                        <label className="text-slate-300 text-xs font-bold uppercase tracking-widest mb-4 block">2. Step Through Iterations</label>
                        <div className="flex gap-2">
                             <button 
                                onClick={() => setStepIndex(Math.max(0, stepIndex - 1))}
                                disabled={stepIndex === 0}
                                className="px-4 py-2 bg-slate-800 rounded-lg text-white disabled:opacity-50 hover:bg-slate-700 transition-colors"
                             >
                                Prev
                             </button>
                             <div className="flex-1 bg-slate-900 rounded-lg flex items-center justify-center font-mono text-cyan-400 border border-slate-800">
                                Iteration {currentStep.i}
                             </div>
                             <button 
                                onClick={() => setStepIndex(Math.min(steps.length - 1, stepIndex + 1))}
                                disabled={stepIndex === steps.length - 1}
                                className="px-4 py-2 bg-cyan-600 rounded-lg text-white font-bold disabled:opacity-50 hover:bg-cyan-500 transition-colors flex items-center gap-2"
                             >
                                Next <Play size={14} fill="currentColor"/>
                             </button>
                        </div>
                    </div>

                    <div className="overflow-hidden rounded-xl border border-slate-700 bg-slate-900/50">
                        <table className="w-full text-left">
                            <thead className="bg-slate-950 text-[10px] uppercase text-slate-500 font-mono tracking-wider">
                                <tr>
                                    <th className="p-3">n</th>
                                    <th className="p-3">xₙ</th>
                                    <th className="p-3">f(xₙ)</th>
                                    <th className="p-3 text-cyan-400">xₙ₊₁</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800">
                                {steps.map((step, idx) => (
                                    <tr 
                                        key={idx}
                                        onClick={() => setStepIndex(idx)}
                                        className={`text-xs font-mono cursor-pointer transition-colors ${stepIndex === idx ? 'bg-cyan-500/10 text-cyan-300' : 'text-slate-400 hover:bg-white/5'}`}
                                    >
                                        <td className="p-3">{step.i}</td>
                                        <td className="p-3">{step.x.toFixed(4)}</td>
                                        <td className="p-3">{step.y.toFixed(4)}</td>
                                        <td className="p-3 font-bold">{step.nextX.toFixed(4)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Right: Visualization */}
                <div className="lg:col-span-7">
                    <div className="glass-panel p-1 rounded-3xl border-slate-700 relative overflow-hidden shadow-2xl">
                        <div className="bg-slate-900 rounded-[20px] relative h-[450px] overflow-hidden">
                             {/* Graph Grid/Axes */}
                             <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full">
                                 {/* X-Axis */}
                                 <line x1="0" y1={scaleY(0)} x2={width} y2={scaleY(0)} stroke="#475569" strokeWidth="2" />
                                 <text x={width - 20} y={scaleY(0) - 10} fill="#64748b" fontSize="12" fontWeight="bold">x</text>

                                 {/* Function Curve */}
                                 <path d={generateFunctionPath()} fill="none" stroke="#64748b" strokeWidth="3" strokeOpacity="0.5" />

                                 {/* Current Point on Curve */}
                                 <circle cx={scaleX(currentStep.x)} cy={scaleY(currentStep.y)} r="6" fill="#ec4899" />
                                 <text x={scaleX(currentStep.x) + 10} y={scaleY(currentStep.y)} fill="#ec4899" fontSize="12" fontWeight="bold">
                                     (x{currentStep.i}, y{currentStep.i})
                                 </text>
                                 
                                 {/* Vertical Dashed Line from Axis to Curve */}
                                 <line 
                                    x1={scaleX(currentStep.x)} y1={scaleY(0)} 
                                    x2={scaleX(currentStep.x)} y2={scaleY(currentStep.y)} 
                                    stroke="#ec4899" strokeWidth="1" strokeDasharray="4 4" opacity="0.5"
                                 />

                                 {/* Tangent Line */}
                                 <motion.line 
                                    initial={{ pathLength: 0 }}
                                    animate={{ pathLength: 1 }}
                                    transition={{ duration: 0.8, ease: "easeInOut" }}
                                    x1={tangent.x1} y1={tangent.y1}
                                    x2={tangent.x2} y2={tangent.y2}
                                    stroke="#22d3ee" strokeWidth="2"
                                 />

                                 {/* Next Guess Point (Intersection) */}
                                 <circle cx={scaleX(currentStep.nextX)} cy={scaleY(0)} r="4" fill="#22d3ee" />
                                 <text x={scaleX(currentStep.nextX) - 10} y={scaleY(0) + 20} fill="#22d3ee" fontSize="12" fontWeight="bold">
                                     x{currentStep.i + 1}
                                 </text>
                             </svg>

                             {/* Overlay Info */}
                             <div className="absolute top-4 right-4 bg-slate-950/80 p-4 rounded-xl border border-slate-800 text-xs backdrop-blur-md">
                                 <div className="flex items-center gap-2 mb-2">
                                     <div className="w-3 h-1 bg-slate-500"></div>
                                     <span className="text-slate-400">Curve: $x^3 - x - 1$</span>
                                 </div>
                                 <div className="flex items-center gap-2 mb-2">
                                     <div className="w-3 h-1 bg-cyan-400"></div>
                                     <span className="text-cyan-400">Tangent Line</span>
                                 </div>
                                 <div className="mt-2 pt-2 border-t border-white/10 text-slate-300">
                                     Slope $f'(x)$ = {currentStep.slope.toFixed(3)}
                                 </div>
                             </div>
                        </div>
                    </div>
                    
                    <div className="mt-4 p-4 bg-emerald-900/10 border border-emerald-500/20 rounded-xl flex items-start gap-3">
                        <Target size={20} className="text-emerald-400 mt-1 shrink-0"/>
                        <div>
                            <h4 className="text-emerald-400 font-bold text-sm">Educational Insight</h4>
                            <p className="text-xs text-emerald-100/70 mt-1 leading-relaxed">
                                Notice how the tangent line at <span className="font-mono">x{currentStep.i}</span> acts as a linear approximation of the curve. 
                                By following this straight line down to zero, we get <span className="font-mono">x{currentStep.i+1}</span>, which is (usually) closer to the true root than where we started.
                            </p>
                        </div>
                    </div>
                </div>

            </div>
            
            <WolframHelper context="analysis" />
      </div>
  );
};