import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Move, Maximize, Minimize, ArrowLeftRight, ArrowUpDown } from 'lucide-react';

export const TransformationsView: React.FC = () => {
  // Params for A * f(B(x - C)) + D
  const [a, setA] = useState(1); // Vertical Stretch/Flip
  const [b, setB] = useState(1); // Horizontal Stretch/Flip
  const [c, setC] = useState(0); // Horizontal Shift
  const [d, setD] = useState(0); // Vertical Shift
  const [funcType, setFuncType] = useState('quadratic');

  const functions = {
      quadratic: {
          label: 'x²',
          fn: (x: number) => x*x,
          latex: 'x^2'
      },
      sine: {
          label: 'sin(x)',
          fn: (x: number) => Math.sin(x),
          latex: '\\sin(x)'
      },
      abs: {
          label: '|x|',
          fn: (x: number) => Math.abs(x),
          latex: '|x|'
      },
      exp: {
          label: 'eˣ',
          fn: (x: number) => Math.exp(x),
          latex: 'e^x'
      }
  };

  const baseFunc = functions[funcType as keyof typeof functions];

  const width = 600;
  const height = 400;
  const range = 10; // -10 to 10

  const scaleX = (x: number) => (x + range) / (2 * range) * width;
  const scaleY = (y: number) => height - (y + range) / (2 * range) * height;

  const generatePath = (transform: boolean) => {
      let path = "";
      const step = 0.1;
      for(let x = -range; x <= range; x += step) {
          let y;
          if (!transform) {
             y = baseFunc.fn(x);
          } else {
             // y = a * f(b(x-c)) + d
             y = a * baseFunc.fn(b * (x - c)) + d;
          }

          // Clamp for drawing
          if (y > range * 2) y = range * 2;
          if (y < -range * 2) y = -range * 2;

          const sx = scaleX(x);
          const sy = scaleY(y);
          
          if (x === -range) path += `M ${sx} ${sy}`;
          else path += ` L ${sx} ${sy}`;
      }
      return path;
  };

  const reset = () => {
      setA(1); setB(1); setC(0); setD(0);
  };

  return (
    <div className="space-y-8 pb-20">
        <header className="border-b border-slate-800 pb-6">
            <h2 className="text-4xl font-bold text-white mb-2">Function Transformations</h2>
            <p className="text-slate-400">
                Interactive manipulation of <span className="font-mono text-cyan-400">g(x) = A·f(B(x - C)) + D</span>
            </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Controls */}
            <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700 backdrop-blur-md space-y-8">
                <div className="flex gap-2 p-1 bg-slate-900 rounded-lg">
                    {Object.entries(functions).map(([key, f]) => (
                        <button 
                            key={key}
                            onClick={() => { setFuncType(key); reset(); }}
                            className={`flex-1 py-2 text-xs font-bold uppercase rounded transition-colors ${funcType === key ? 'bg-cyan-600 text-white' : 'text-slate-500 hover:text-slate-300'}`}
                        >
                            {f.label}
                        </button>
                    ))}
                </div>

                <div className="space-y-6">
                    <div>
                        <div className="flex justify-between mb-2">
                             <label className="text-sm text-slate-300 flex items-center gap-2"><ArrowUpDown size={14}/> Vertical Shift (D)</label>
                             <span className="font-mono text-cyan-400">{d.toFixed(1)}</span>
                        </div>
                        <input type="range" min="-5" max="5" step="0.5" value={d} onChange={(e) => setD(parseFloat(e.target.value))} className="w-full h-1 bg-slate-700 rounded-lg appearance-none accent-cyan-500"/>
                    </div>
                    
                    <div>
                        <div className="flex justify-between mb-2">
                             <label className="text-sm text-slate-300 flex items-center gap-2"><ArrowLeftRight size={14}/> Horizontal Shift (C)</label>
                             <span className="font-mono text-cyan-400">{c.toFixed(1)}</span>
                        </div>
                        <input type="range" min="-5" max="5" step="0.5" value={c} onChange={(e) => setC(parseFloat(e.target.value))} className="w-full h-1 bg-slate-700 rounded-lg appearance-none accent-cyan-500"/>
                    </div>

                    <div>
                        <div className="flex justify-between mb-2">
                             <label className="text-sm text-slate-300 flex items-center gap-2"><Maximize size={14}/> Vertical Stretch (A)</label>
                             <span className="font-mono text-purple-400">{a.toFixed(1)}</span>
                        </div>
                        <input type="range" min="-3" max="3" step="0.1" value={a} onChange={(e) => setA(parseFloat(e.target.value))} className="w-full h-1 bg-slate-700 rounded-lg appearance-none accent-purple-500"/>
                    </div>

                    <div>
                        <div className="flex justify-between mb-2">
                             <label className="text-sm text-slate-300 flex items-center gap-2"><Minimize size={14}/> Horizontal Compression (B)</label>
                             <span className="font-mono text-purple-400">{b.toFixed(1)}</span>
                        </div>
                        <input type="range" min="0.1" max="3" step="0.1" value={b} onChange={(e) => setB(parseFloat(e.target.value))} className="w-full h-1 bg-slate-700 rounded-lg appearance-none accent-purple-500"/>
                    </div>
                </div>

                <button onClick={reset} className="w-full py-2 rounded-lg border border-slate-600 text-slate-400 text-sm hover:bg-slate-800 hover:text-white transition-colors">Reset Parameters</button>
            </div>

            {/* Graph */}
            <div className="lg:col-span-2 bg-slate-900 rounded-2xl border border-slate-700 relative overflow-hidden shadow-2xl flex flex-col">
                 <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-5"></div>
                 
                 <div className="p-4 border-b border-slate-800 flex justify-between items-center z-10 bg-slate-900/90">
                     <div className="font-mono text-lg text-white">
                         g(x) = <span className="text-purple-400">{a !== 1 && a}</span>
                         f(
                         <span className="text-purple-400">{b !== 1 && b}</span>
                         (x {c < 0 ? '+' : '-'} <span className="text-cyan-400">{Math.abs(c)}</span>)
                         ) {d >= 0 ? '+' : '-'} <span className="text-cyan-400">{Math.abs(d)}</span>
                     </div>
                 </div>

                 <div className="relative flex-1 w-full h-full">
                      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full">
                          {/* Grid */}
                          <line x1={width/2} y1={0} x2={width/2} y2={height} stroke="#475569" strokeWidth="2"/>
                          <line x1={0} y1={height/2} x2={width} y2={height/2} stroke="#475569" strokeWidth="2"/>

                          {/* Base Function (Ghost) */}
                          <path d={generatePath(false)} fill="none" stroke="#475569" strokeWidth="2" strokeDasharray="4 4" opacity="0.5" />

                          {/* Transformed Function */}
                          <motion.path 
                            d={generatePath(true)} 
                            fill="none" 
                            stroke="#22d3ee" 
                            strokeWidth="3"
                            initial={false}
                            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                          />
                      </svg>
                 </div>
            </div>
        </div>
    </div>
  );
};