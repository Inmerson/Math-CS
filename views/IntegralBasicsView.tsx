
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MathRenderer } from '../components/MathRenderer';
import { History, ChevronsUp, Layers } from 'lucide-react';

export const IntegralBasicsView: React.FC = () => {
  const [constantC, setConstantC] = useState(0);

  const width = 600;
  const height = 400;
  const domain = { x: [-3, 3], y: [-5, 10] };

  const scaleX = (x: number) => ((x - domain.x[0]) / (domain.x[1] - domain.x[0])) * width;
  const scaleY = (y: number) => height - ((y - domain.y[0]) / (domain.y[1] - domain.y[0])) * height;

  const generatePath = (fn: (x: number) => number) => {
    let path = "";
    const step = 0.1;
    for (let x = domain.x[0]; x <= domain.x[1]; x += step) {
        const y = fn(x);
        const sx = scaleX(x);
        const sy = scaleY(y);
        if (x === domain.x[0]) path += `M ${sx} ${sy}`;
        else path += ` L ${sx} ${sy}`;
    }
    return path;
  };

  // Example: derivative is f(x) = 3x^2, primitive is F(x) = x^3 + C
  const f = (x: number) => 3 * x * x;
  const F = (x: number) => x * x * x + constantC;

  return (
    <div className="space-y-8 pb-20">
      <header className="border-b border-white/10 pb-6">
        <h2 className="text-4xl font-bold text-white mb-2">The Antiderivative</h2>
        <p className="text-slate-400 max-w-3xl">
          Integration is the inverse operation of differentiation. The indefinite integral represents the family of functions <span className="font-mono text-cyan-400">F(x) + C</span> whose derivative is <span className="font-mono text-purple-400">f(x)</span>.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Concept Card */}
        <div className="space-y-6">
            <div className="bg-slate-900/50 p-6 rounded-2xl border border-slate-700">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                    <History className="text-cyan-400" size={20} /> Definition
                </h3>
                <p className="text-slate-300 text-sm leading-relaxed mb-4">
                    The prime function <MathRenderer expression="F(x)" inline /> is any function whose derivative equals <MathRenderer expression="f(x)" inline />.
                </p>
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-center">
                    <MathRenderer expression="\int f(x)dx = F(x) + C" className="text-xl text-white" />
                    <p className="text-xs text-slate-500 mt-2">
                        if <MathRenderer expression="F'(x) = f(x)" inline />
                    </p>
                </div>
            </div>

            <div className="bg-slate-900/50 p-6 rounded-2xl border border-slate-700">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                    <Layers className="text-purple-400" size={20} /> The Constant C
                </h3>
                <p className="text-slate-300 text-sm leading-relaxed">
                    Two functions with the same derivative differ only by a vertical shift.
                    <br/><br/>
                    Example: If <MathRenderer expression="f(x) = 3x^2" inline />, then <MathRenderer expression="F(x)" inline /> can be:
                </p>
                <ul className="list-disc list-inside text-sm text-slate-400 mt-2 space-y-1 ml-2">
                    <li><MathRenderer expression="x^3" inline /></li>
                    <li><MathRenderer expression="x^3 + 4" inline /></li>
                    <li><MathRenderer expression="x^3 - 1" inline /></li>
                    <li>Generally: <MathRenderer expression="x^3 + C" inline /></li>
                </ul>
            </div>
        </div>

        {/* Visualizer */}
        <div className="bg-slate-900 rounded-3xl border border-slate-700 p-1 shadow-2xl relative overflow-hidden flex flex-col">
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-5 pointer-events-none"></div>
            
            <div className="p-4 bg-slate-950/80 backdrop-blur-sm border-b border-white/5 flex justify-between items-center z-10">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Family of Curves</span>
                <div className="flex items-center gap-4">
                    <span className="text-xs font-mono text-cyan-400">F(x) = x³ + {constantC.toFixed(1)}</span>
                    <span className="text-xs font-mono text-purple-400">f(x) = 3x²</span>
                </div>
            </div>

            <div className="relative flex-1">
                <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full">
                    {/* Axes */}
                    <line x1={0} y1={scaleY(0)} x2={width} y2={scaleY(0)} stroke="#475569" strokeWidth="1" />
                    <line x1={scaleX(0)} y1={0} x2={scaleX(0)} y2={height} stroke="#475569" strokeWidth="1" />

                    {/* Derivative (Ghost) - Scaled down to fit */}
                    <path d={generatePath((x) => f(x)/3)} fill="none" stroke="#a855f7" strokeWidth="2" strokeDasharray="4 4" opacity="0.5" />
                    
                    {/* Primitive Function */}
                    <motion.path 
                        d={generatePath(F)} 
                        fill="none" 
                        stroke="#22d3ee" 
                        strokeWidth="3"
                        initial={false}
                        animate={{ d: generatePath(F) }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                </svg>

                {/* Vertical Shift Indicator */}
                <motion.div 
                    className="absolute left-1/2 top-1/2 w-px bg-white/20 h-full -translate-x-1/2 pointer-events-none"
                />
            </div>

            <div className="p-6 bg-slate-950/50 border-t border-white/5">
                <label className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">
                    <span className="flex items-center gap-2"><ChevronsUp size={14}/> Constant C</span>
                    <span className="text-cyan-400 font-mono text-lg">{constantC.toFixed(1)}</span>
                </label>
                <input 
                    type="range" min="-4" max="4" step="0.1" 
                    value={constantC} 
                    onChange={(e) => setConstantC(parseFloat(e.target.value))}
                    className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                />
            </div>
        </div>

      </div>
    </div>
  );
};
