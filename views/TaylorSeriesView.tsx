import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Waves } from 'lucide-react';

export const TaylorSeriesView: React.FC = () => {
  const [degree, setDegree] = useState(1);
  const [func, setFunc] = useState('cos');

  const width = 600;
  const height = 400;
  const range = 8; // -8 to 8

  const scaleX = (x: number) => (x + range) / (2 * range) * width;
  const scaleY = (y: number) => height/2 - (y / range) * height; // Centered vertically

  // Factorial helper
  const fact = (n: number): number => n <= 1 ? 1 : n * fact(n - 1);

  const functions = {
      cos: {
          label: 'cos(x)',
          eval: (x: number) => Math.cos(x),
          taylor: (x: number, n: number) => {
              let sum = 0;
              for(let i=0; i<=n; i++) {
                  // cos: (-1)^i * x^(2i) / (2i)!
                  const term = Math.pow(-1, i) * Math.pow(x, 2*i) / fact(2*i);
                  sum += term;
              }
              return sum;
          },
          color: '#f472b6'
      },
      exp: {
        label: 'eˣ',
        eval: (x: number) => Math.exp(x),
        taylor: (x: number, n: number) => {
            let sum = 0;
            for(let i=0; i<=n; i++) {
                // exp: x^i / i!
                const term = Math.pow(x, i) / fact(i);
                sum += term;
            }
            return sum;
        },
        color: '#22d3ee'
      },
      sin: {
        label: 'sin(x)',
        eval: (x: number) => Math.sin(x),
        taylor: (x: number, n: number) => {
            let sum = 0;
            for(let i=0; i<=n; i++) {
                // sin: (-1)^i * x^(2i+1) / (2i+1)!
                const term = Math.pow(-1, i) * Math.pow(x, 2*i+1) / fact(2*i+1);
                sum += term;
            }
            return sum;
        },
        color: '#a78bfa'
    }
  };

  const activeFunc = functions[func as keyof typeof functions];

  const generatePath = (isApproximation: boolean) => {
      let path = "";
      const step = 0.1;
      for(let x = -range; x <= range; x += step) {
          let y;
          if (isApproximation) {
              y = activeFunc.taylor(x, degree);
          } else {
              y = activeFunc.eval(x);
          }

          // Soft clamp
          if (y > range/2) y = range/2;
          if (y < -range/2) y = -range/2;

          const sx = scaleX(x);
          const sy = scaleY(y);
          
          if (x === -range) path += `M ${sx} ${sy}`;
          else path += ` L ${sx} ${sy}`;
      }
      return path;
  };

  return (
    <div className="space-y-8 pb-20">
        <header className="border-b border-slate-800 pb-6">
            <h2 className="text-4xl font-bold text-white mb-2">Taylor Series Expansion</h2>
            <p className="text-slate-400">
                Approximating functions using polynomials centered at <span className="font-mono text-cyan-400">a=0</span> (Maclaurin Series).
            </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
             <div className="lg:col-span-4 space-y-6">
                 <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700 backdrop-blur-md">
                     <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Function</h3>
                     <div className="flex gap-2 mb-6">
                         {Object.entries(functions).map(([key, f]) => (
                             <button 
                                key={key}
                                onClick={() => { setDegree(1); setFunc(key); }}
                                className={`flex-1 py-2 rounded font-mono font-bold transition-colors ${func === key ? 'bg-slate-200 text-slate-900' : 'bg-slate-700 text-slate-400 hover:bg-slate-600'}`}
                             >
                                 {f.label}
                             </button>
                         ))}
                     </div>

                     <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Approximation Degree (n)</h3>
                     <div className="flex items-center gap-4 mb-2">
                         <input 
                            type="range" min="0" max="10" step="1" 
                            value={degree} onChange={(e) => setDegree(parseInt(e.target.value))}
                            className="flex-1 h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                         />
                         <span className="text-2xl font-mono font-bold text-cyan-400 w-8 text-center">{degree}</span>
                     </div>
                     <p className="text-xs text-slate-500">
                         Higher degrees hug the curve tighter further from the center.
                     </p>
                 </div>

                 <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 font-mono text-sm leading-loose">
                     <div className="text-slate-500 mb-2">Polynomial Pₙ(x):</div>
                     <div className="break-words text-cyan-200/80">
                        {/* Simple dynamic string based on function */}
                        {func === 'exp' && `1 + x + x²/2! + x³/3! + ...`}
                        {func === 'cos' && `1 - x²/2! + x⁴/4! - ...`}
                        {func === 'sin' && `x - x³/3! + x⁵/5! - ...`}
                     </div>
                 </div>
             </div>

             <div className="lg:col-span-8 bg-slate-900 rounded-2xl border border-slate-700 relative overflow-hidden shadow-2xl flex flex-col">
                  <div className="p-4 border-b border-slate-800 flex justify-between items-center z-10 bg-slate-900/90">
                        <h3 className="font-bold text-slate-300 flex items-center gap-2">
                            <Waves size={18} className="text-purple-400"/> Approximation Visualizer
                        </h3>
                        <div className="flex gap-4 text-xs font-mono">
                            <span className="text-slate-500 flex items-center gap-1"><div className="w-3 h-1 bg-slate-500"></div> Exact f(x)</span>
                            <span className="text-cyan-400 flex items-center gap-1"><div className="w-3 h-1 bg-cyan-400"></div> Approx Pₙ(x)</span>
                        </div>
                  </div>
                  
                  <div className="relative flex-1 w-full h-full">
                      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full">
                          {/* Grid */}
                          <line x1={width/2} y1={0} x2={width/2} y2={height} stroke="#475569" strokeWidth="1"/>
                          <line x1={0} y1={height/2} x2={width} y2={height/2} stroke="#475569" strokeWidth="1"/>

                          {/* Exact Function (Ghost) */}
                          <path 
                            d={generatePath(false)} 
                            fill="none" 
                            stroke="#64748b" 
                            strokeWidth="4" 
                            opacity="0.4"
                          />

                          {/* Taylor Polynomial */}
                          <motion.path 
                             d={generatePath(true)} 
                             fill="none" 
                             stroke={activeFunc.color} 
                             strokeWidth="3"
                             initial={false}
                             transition={{ type: 'spring', bounce: 0, duration: 0.5 }}
                          />
                      </svg>
                  </div>
             </div>
        </div>
    </div>
  );
};