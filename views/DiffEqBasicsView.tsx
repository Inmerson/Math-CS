import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MathRenderer } from '../components/MathRenderer';
import { Microscope, ArrowRight, Lightbulb } from 'lucide-react';

export const DiffEqBasicsView: React.FC = () => {
  const [C, setC] = useState(0);
  const [x0, setX0] = useState(0);
  const [y0, setY0] = useState(4); // Match PDF example y(0)=4

  const width = 600;
  const height = 400;
  const domain = { x: [-2, 2], y: [-2, 20] };

  const scaleX = (x: number) => ((x - domain.x[0]) / (domain.x[1] - domain.x[0])) * width;
  const scaleY = (y: number) => height - ((y - domain.y[0]) / (domain.y[1] - domain.y[0])) * height;

  // Example from PDF: y' = 2y => y = C * e^(2x)
  const f = (x: number, constant: number) => constant * Math.exp(2 * x);

  // Calculate C based on point (x0, y0) -> y0 = C * e^(2*x0) -> C = y0 / e^(2*x0)
  const solvedC = y0 / Math.exp(2 * x0);

  const generatePath = (constant: number) => {
    let path = "";
    const step = 0.05;
    for (let x = domain.x[0]; x <= domain.x[1]; x += step) {
        const y = f(x, constant);
        const sx = scaleX(x);
        const sy = scaleY(y);
        // Clamp for drawing
        if (y > domain.y[1] || y < domain.y[0]) {
             if (path === "") { path += `M ${sx} ${Math.max(0, Math.min(height, sy))}`; }
             continue; 
        }
        if (path === "") path += `M ${sx} ${sy}`;
        else path += ` L ${sx} ${sy}`;
    }
    return path;
  };

  return (
    <div className="space-y-8 pb-20">
      <header className="border-b border-white/10 pb-6">
        <h2 className="text-4xl font-bold text-white mb-2">First-Order Differential Equations</h2>
        <p className="text-slate-400 max-w-3xl">
          An equation relating a function <MathRenderer expression="y" inline/> to its derivative <MathRenderer expression="y'" inline/>.
          <br/>
          <span className="font-mono text-cyan-400">General Solution</span> represents a family of curves. <span className="font-mono text-purple-400">Particular Solution</span> passes through a specific point.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Concepts */}
        <div className="space-y-6">
            <div className="bg-slate-900/50 p-6 rounded-2xl border border-slate-700">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                    <Microscope className="text-cyan-400" size={20} /> The Problem
                </h3>
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-center mb-4">
                    <MathRenderer expression="y' = 2y" className="text-xl text-white" />
                    <p className="text-xs text-slate-500 mt-2">Find a function that grows at twice its current size.</p>
                </div>
                <p className="text-slate-300 text-sm leading-relaxed">
                    By rearranging to <MathRenderer expression="\frac{1}{y}dy = 2dx" inline/> and integrating both sides:
                </p>
                <div className="mt-2 pl-4 border-l-2 border-slate-700 text-sm text-slate-400 font-mono space-y-1">
                    <div>∫ (1/y) dy = ∫ 2 dx</div>
                    <div>ln|y| = 2x + C</div>
                    <div className="text-cyan-400 font-bold">y = C · e^{"2x"}</div>
                </div>
            </div>

            <div className="bg-slate-900/50 p-6 rounded-2xl border border-slate-700">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                    <Lightbulb className="text-purple-400" size={20} /> Initial Conditions
                </h3>
                <p className="text-slate-300 text-sm leading-relaxed mb-4">
                    To find the specific curve (Particular Solution), we need a point <MathRenderer expression="(x_0, y_0)" inline/>.
                </p>
                <div className="flex flex-col gap-4">
                    <div className="flex justify-between items-center bg-slate-950 p-3 rounded-lg border border-slate-800">
                        <span className="text-xs font-bold text-slate-500 uppercase">Condition</span>
                        <span className="font-mono text-purple-400">y({x0}) = {y0}</span>
                    </div>
                    <div className="flex justify-between items-center bg-slate-950 p-3 rounded-lg border border-slate-800">
                        <span className="text-xs font-bold text-slate-500 uppercase">Result C</span>
                        <span className="font-mono text-cyan-400">{y0} = C·e^&#123;2(0)&#125; → C = {solvedC.toFixed(2)}</span>
                    </div>
                </div>
            </div>
        </div>

        {/* Visualizer */}
        <div className="bg-slate-900 rounded-3xl border border-slate-700 p-1 shadow-2xl relative overflow-hidden flex flex-col min-h-[500px]">
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-5 pointer-events-none"></div>
            
            <div className="p-4 bg-slate-950/80 backdrop-blur-sm border-b border-white/5 flex justify-between items-center z-10">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Solution Family</span>
                <div className="flex items-center gap-4">
                    <span className="text-xs font-mono text-slate-500">y = C·e^&#123;2x&#125;</span>
                </div>
            </div>

            <div className="relative flex-1 w-full">
                <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full">
                    {/* Axes */}
                    <line x1={0} y1={scaleY(0)} x2={width} y2={scaleY(0)} stroke="#475569" strokeWidth="1" />
                    <line x1={scaleX(0)} y1={0} x2={scaleX(0)} y2={height} stroke="#475569" strokeWidth="1" />

                    {/* Ghost Curves (Family) */}
                    {[-2, -1, 0.5, 1, 3, 5].map((cVal, i) => (
                        <path 
                            key={i} 
                            d={generatePath(cVal)} 
                            fill="none" 
                            stroke="#334155" 
                            strokeWidth="1" 
                            strokeDasharray="4 4" 
                        />
                    ))}
                    
                    {/* Active General Solution (Manual Slider) */}
                    <motion.path 
                        d={generatePath(C)} 
                        fill="none" 
                        stroke="#22d3ee" 
                        strokeWidth="2"
                        opacity={0.5}
                    />

                    {/* Particular Solution (Calculated) */}
                    <motion.path 
                        d={generatePath(solvedC)} 
                        fill="none" 
                        stroke="#c084fc" 
                        strokeWidth="4"
                    />

                    {/* The Point */}
                    <circle cx={scaleX(x0)} cy={scaleY(y0)} r="6" fill="#c084fc" stroke="white" strokeWidth="2" />
                </svg>
            </div>

            <div className="p-6 bg-slate-950/50 border-t border-white/5 space-y-6">
                <div>
                    <label className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">
                        <span className="flex items-center gap-2">Manual C Exploration</span>
                        <span className="text-cyan-400 font-mono text-lg">{C.toFixed(1)}</span>
                    </label>
                    <input 
                        type="range" min="-5" max="5" step="0.1" 
                        value={C} 
                        onChange={(e) => setC(parseFloat(e.target.value))}
                        className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                    />
                </div>
                
                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/5">
                    <div>
                        <label className="text-xs font-bold text-purple-400 uppercase tracking-widest mb-2 block">Set Initial Y(0)</label>
                        <input 
                            type="number" 
                            value={y0} 
                            onChange={(e) => setY0(parseFloat(e.target.value))}
                            className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-white font-mono focus:border-purple-500 outline-none"
                        />
                    </div>
                    <div className="flex items-end pb-2">
                        <span className="text-xs text-slate-500">
                            Particular Solution: <span className="text-white font-mono font-bold">y = {solvedC.toFixed(2)}e^&#123;2x&#125;</span>
                        </span>
                    </div>
                </div>
            </div>
        </div>

      </div>
    </div>
  );
};