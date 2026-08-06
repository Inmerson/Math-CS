
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MathRenderer } from '../components/MathRenderer';
import { Timer, Atom } from 'lucide-react';

export const RadioactiveDecayView: React.FC = () => {
  const [N0, setN0] = useState(100); // Initial Nuclei
  const [lambda, setLambda] = useState(0.5); // Decay constant

  const width = 600;
  const height = 400;
  const timeEnd = 10;
  
  // Decay: N(t) = N0 * e^(-lambda * t)
  const calcDecay = (t: number) => N0 * Math.exp(-lambda * t);
  const halfLife = Math.log(2) / lambda;

  const scaleX = (t: number) => (t / timeEnd) * width;
  const scaleY = (pop: number) => height - (pop / N0) * (height * 0.8) - 20; // Padding

  const generatePath = () => {
    let path = "";
    const step = 0.1;
    for (let t = 0; t <= timeEnd; t += step) {
        const pop = calcDecay(t);
        const sx = scaleX(t);
        const sy = scaleY(pop);
        
        if (t === 0) path += `M ${sx} ${sy}`;
        else path += ` L ${sx} ${sy}`;
    }
    return path;
  };

  return (
    <div className="space-y-8 pb-20">
      <header className="border-b border-white/10 pb-6">
        <h2 className="text-4xl font-bold text-white mb-2">Radioactive Decay</h2>
        <p className="text-slate-400 max-w-3xl">
          The probability of decay per time unit is constant. This leads to an exponential decrease in the number of active nuclei.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          <div className="lg:col-span-4 space-y-6">
              <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700 backdrop-blur-md">
                  <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-6 flex items-center gap-2">
                      <Atom size={16} /> Isotope Properties
                  </h3>
                  
                  <div className="space-y-6">
                      <div>
                          <div className="flex justify-between text-sm text-slate-300 mb-2">
                              <span>Initial Nuclei (N₀)</span>
                              <span className="font-mono text-cyan-400">{N0}</span>
                          </div>
                          <input type="range" min="10" max="200" step="10" value={N0} onChange={e => setN0(parseFloat(e.target.value))} className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"/>
                      </div>
                      <div>
                          <div className="flex justify-between text-sm text-slate-300 mb-2">
                              <span>Decay Constant (λ)</span>
                              <span className="font-mono text-purple-400">{lambda.toFixed(2)}</span>
                          </div>
                          <input type="range" min="0.1" max="2.0" step="0.1" value={lambda} onChange={e => setLambda(parseFloat(e.target.value))} className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-purple-500"/>
                      </div>
                  </div>
              </div>

              <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 text-center">
                  <div className="text-xs text-slate-500 font-bold uppercase mb-2">Equation</div>
                  <MathRenderer expression="\frac{dN}{dt} = -\lambda N" className="text-xl text-white mb-2" />
                  <MathRenderer expression="N(t) = N_0 e^{-\lambda t}" className="text-lg text-slate-400" />
              </div>

              <div className="bg-amber-500/10 p-6 rounded-2xl border border-amber-500/20 text-center">
                  <div className="text-xs text-amber-500 font-bold uppercase mb-2 flex items-center justify-center gap-2"><Timer size={14}/> Half-Life (T 1/2)</div>
                  <div className="text-3xl font-mono text-white font-bold">{halfLife.toFixed(2)}s</div>
                  <p className="text-[10px] text-amber-200/60 mt-2">Time to reach {N0/2} nuclei</p>
              </div>
          </div>

          <div className="lg:col-span-8 bg-slate-900 rounded-3xl border border-slate-700 relative overflow-hidden shadow-2xl flex flex-col min-h-[400px]">
              <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-5 pointer-events-none"></div>
              
              <div className="absolute top-4 right-4 z-10 flex flex-col gap-2 text-xs font-mono">
                  <div className="flex items-center gap-2">
                      <div className="w-4 h-0.5 bg-amber-400"></div>
                      <span className="text-slate-400">Nuclei Count</span>
                  </div>
              </div>

              <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full">
                  {/* Grid */}
                  <line x1={0} y1={height} x2={width} y2={height} stroke="#475569" strokeWidth="2"/>
                  <line x1={0} y1={0} x2={0} y2={height} stroke="#475569" strokeWidth="2"/>

                  {/* Half Life Marker */}
                  <line 
                    x1={scaleX(halfLife)} y1={scaleY(0)} 
                    x2={scaleX(halfLife)} y2={scaleY(N0)} 
                    stroke="#64748b" strokeWidth="1" strokeDasharray="5 5"
                  />
                  <text x={scaleX(halfLife) + 5} y={scaleY(N0/2)} fill="#94a3b8" fontSize="10">N₀/2</text>

                  {/* Curve */}
                  <motion.path 
                    d={generatePath()} 
                    fill="none" 
                    stroke="#fbbf24"
                    strokeWidth="3"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 1 }}
                  />
                  
                  {/* Atoms Visualization */}
                  <g>
                      {Array.from({length: 50}).map((_, i) => {
                          const t = i * (timeEnd / 50);
                          const remaining = calcDecay(t);
                          const decayed = N0 - remaining;
                          const percentDecayed = decayed / N0;
                          
                          // Simplified visual: Show atoms changing state over time
                          return (
                              <circle 
                                key={i}
                                cx={scaleX(t)}
                                cy={scaleY(remaining)}
                                r={2}
                                fill={Math.random() > percentDecayed ? "#fbbf24" : "#334155"}
                              />
                          )
                      })}
                  </g>
              </svg>
          </div>

      </div>
    </div>
  );
};
