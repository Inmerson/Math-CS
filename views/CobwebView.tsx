import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export const CobwebView: React.FC = () => {
  const [r, setR] = useState(2.8); // Growth rate
  const [x0, setX0] = useState(0.1); // Initial population
  
  // Logistic Map: x_{n+1} = r * x_n * (1 - x_n)
  const f = (x: number) => r * x * (1 - x);

  const iterations = 50;
  const width = 600;
  const height = 600;
  const scale = width; // domain [0,1] maps to [0, width]

  const getCobwebPath = () => {
      let path = `M ${x0 * scale} ${height}`; // Start at bottom
      let cx = x0;
      
      for(let i=0; i<iterations; i++) {
          const cy = f(cx);
          
          // Vertical line to curve: (cx, cx) -> (cx, cy)
          path += ` L ${cx * scale} ${height - cy * scale}`;
          
          // Horizontal line to y=x: (cx, cy) -> (cy, cy)
          path += ` L ${cy * scale} ${height - cy * scale}`;
          
          cx = cy;
      }
      return path;
  };

  return (
    <div className="space-y-8 pb-20">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end border-b border-slate-800 pb-6 gap-4">
            <div>
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">Logistic Map (Chaos Theory)</h2>
                <p className="text-slate-400 text-sm md:text-base">
                    Modeling iterative system limits with Cobweb plots: <span className="font-mono text-cyan-400">xₙ₊₁ = r · xₙ(1 - xₙ)</span>
                </p>
            </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700 backdrop-blur-md h-fit">
                <h3 className="text-slate-300 font-bold mb-6">Parameters</h3>
                
                <div className="space-y-6">
                    <div>
                        <label className="flex justify-between text-sm text-slate-400 mb-2">
                            <span>Growth Rate (r)</span>
                            <span className="text-cyan-400 font-mono">{r}</span>
                        </label>
                        <input 
                            type="range" min="0" max="4" step="0.01" 
                            value={r} onChange={(e) => setR(parseFloat(e.target.value))}
                            className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                        />
                        <div className="flex justify-between text-[10px] text-slate-600 mt-1 font-mono">
                            <span>Divergence</span>
                            <span>Stable</span>
                            <span>Chaos (r &gt; 3.57)</span>
                        </div>
                    </div>

                    <div>
                        <label className="flex justify-between text-sm text-slate-400 mb-2">
                            <span>Initial Value (x₀)</span>
                            <span className="text-pink-400 font-mono">{x0}</span>
                        </label>
                        <input 
                            type="range" min="0" max="1" step="0.01" 
                            value={x0} onChange={(e) => setX0(parseFloat(e.target.value))}
                            className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-pink-500"
                        />
                    </div>

                    <div className="p-4 bg-slate-900 rounded-lg border border-slate-800 text-xs text-slate-400 leading-relaxed">
                        <p className="mb-2"><strong className="text-white">Cobweb Plot:</strong> Visualizes the behavior of the sequence iteratively.</p>
                        <p>If lines spiral inward, the system stabilizes (Convergence).</p>
                        <p>If lines fill the box randomly, the system is Chaotic.</p>
                    </div>
                </div>
            </div>

            <div className="lg:col-span-2 bg-slate-900 rounded-2xl border border-slate-700 p-4 relative shadow-2xl flex justify-center items-center overflow-hidden">
                <div className="w-full max-w-[600px]">
                    <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto bg-slate-950 rounded-xl border border-slate-800 overflow-visible">
                        {/* y = x Line */}
                        <line x1="0" y1={height} x2={width} y2="0" stroke="#475569" strokeWidth="1" strokeDasharray="5 5" />
                        
                        {/* The Parabola Curve */}
                        <path 
                            d={`M 0 ${height} Q ${width/2} ${height - (r * 0.25 * scale)} ${width} ${height}`} 
                            fill="none" 
                            stroke="#0ea5e9" 
                            strokeWidth="2" 
                        />
                        
                        {/* Cobweb Path */}
                        <motion.path
                            d={getCobwebPath()}
                            fill="none"
                            stroke="#ec4899"
                            strokeWidth="1"
                            initial={{ pathLength: 0, opacity: 0 }}
                            animate={{ pathLength: 1, opacity: 0.8 }}
                            key={`${r}-${x0}`} // Re-animate on change
                            transition={{ duration: 0.5 }}
                        />
                    </svg>
                </div>
                
                <div className="absolute bottom-6 right-6 text-xs text-slate-500 font-mono">
                    Domain [0, 1]
                </div>
            </div>
        </div>
    </div>
  );
};