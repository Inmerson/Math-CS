
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MathRenderer } from '../components/MathRenderer';
import { Sprout, AlertTriangle, ArrowRight } from 'lucide-react';

export const PopulationModelsView: React.FC = () => {
  const [model, setModel] = useState<'malthus' | 'verhulst'>('verhulst');
  const [N0, setN0] = useState(10); // Initial Pop
  const [r, setR] = useState(0.5);  // Growth Rate
  const [K, setK] = useState(100);  // Capacity

  const width = 600;
  const height = 400;
  const timeEnd = 15;
  
  // Malthus: N(t) = N0 * e^(rt)
  const calcMalthus = (t: number) => N0 * Math.exp(r * t);

  // Verhulst: N(t) = K / (1 + ((K - N0)/N0) * e^(-rt))
  const calcVerhulst = (t: number) => K / (1 + ((K - N0)/N0) * Math.exp(-r * t));

  const activeFunc = model === 'malthus' ? calcMalthus : calcVerhulst;

  // Graph Scales
  const maxPop = model === 'malthus' ? calcMalthus(timeEnd/2) : K * 1.2; // Zoom differently
  const scaleX = (t: number) => (t / timeEnd) * width;
  const scaleY = (pop: number) => height - (pop / maxPop) * height;

  const generatePath = (fn: (t: number) => number) => {
    let path = "";
    const step = 0.1;
    for (let t = 0; t <= timeEnd; t += step) {
        const pop = fn(t);
        const sx = scaleX(t);
        const sy = scaleY(pop);
        
        if (sy < 0) { // Clip top
             if(path !== "") path += ` L ${sx} 0`;
             break; 
        }

        if (t === 0) path += `M ${sx} ${sy}`;
        else path += ` L ${sx} ${sy}`;
    }
    return path;
  };

  return (
    <div className="space-y-8 pb-20">
      <header className="border-b border-white/10 pb-6 flex flex-col md:flex-row justify-between items-end gap-4">
        <div>
            <h2 className="text-4xl font-bold text-white mb-2">Population Dynamics</h2>
            <p className="text-slate-400 max-w-2xl">
              Modeling biological growth. Unlimited resources lead to <span className="text-pink-400">Malthusian</span> explosion. 
              Real-world limits create <span className="text-emerald-400">Verhulst (Logistic)</span> equilibrium.
            </p>
        </div>
        <div className="bg-slate-900 p-1 rounded-xl border border-slate-800 flex gap-1">
             <button onClick={() => setModel('malthus')} className={`px-4 py-2 text-xs font-bold uppercase rounded-lg transition-all ${model==='malthus' ? 'bg-pink-600 text-white' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}>Malthus (Exp)</button>
             <button onClick={() => setModel('verhulst')} className={`px-4 py-2 text-xs font-bold uppercase rounded-lg transition-all ${model==='verhulst' ? 'bg-emerald-600 text-white' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}>Verhulst (Logistic)</button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Controls */}
          <div className="space-y-6">
              <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700 backdrop-blur-md">
                  <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-6">Environment Params</h3>
                  
                  <div className="space-y-6">
                      <div>
                          <div className="flex justify-between text-sm text-slate-300 mb-2">
                              <span>Initial Population (N₀)</span>
                              <span className="font-mono text-cyan-400">{N0}</span>
                          </div>
                          <input type="range" min="1" max="50" step="1" value={N0} onChange={e => setN0(parseFloat(e.target.value))} className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"/>
                      </div>
                      <div>
                          <div className="flex justify-between text-sm text-slate-300 mb-2">
                              <span>Growth Rate (r)</span>
                              <span className="font-mono text-purple-400">{r.toFixed(2)}</span>
                          </div>
                          <input type="range" min="0.1" max="2.0" step="0.1" value={r} onChange={e => setR(parseFloat(e.target.value))} className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-purple-500"/>
                      </div>
                      
                      {model === 'verhulst' && (
                          <motion.div initial={{opacity:0}} animate={{opacity:1}}>
                              <div className="flex justify-between text-sm text-slate-300 mb-2">
                                  <span>Carrying Capacity (K)</span>
                                  <span className="font-mono text-emerald-400">{K}</span>
                              </div>
                              <input type="range" min="50" max="200" step="10" value={K} onChange={e => setK(parseFloat(e.target.value))} className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"/>
                          </motion.div>
                      )}
                  </div>
              </div>

              <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800">
                  <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                      <Sprout size={16} /> Differential Equation
                  </h3>
                  
                  {model === 'malthus' ? (
                      <div className="space-y-4">
                          <MathRenderer expression="\frac{dN}{dt} = rN" className="text-xl text-pink-400 text-center" />
                          <p className="text-xs text-slate-400 text-center leading-relaxed">
                              Growth is proportional only to current size. 
                              <br/>Result: <MathRenderer expression="N(t) = N_0 e^{rt}" inline/>
                          </p>
                          <div className="flex items-center gap-2 text-pink-400 bg-pink-900/10 p-2 rounded border border-pink-900/30 text-xs">
                              <AlertTriangle size={14}/> Unbounded growth (Unrealistic long-term)
                          </div>
                      </div>
                  ) : (
                      <div className="space-y-4">
                          <MathRenderer expression="\frac{dN}{dt} = rN(1 - \frac{N}{K})" className="text-xl text-emerald-400 text-center" />
                          <p className="text-xs text-slate-400 text-center leading-relaxed">
                              Growth slows as <MathRenderer expression="N" inline/> approaches capacity <MathRenderer expression="K" inline/>.
                              <br/>Result: Sigmoid Curve.
                          </p>
                          <div className="flex items-center gap-2 text-emerald-400 bg-emerald-900/10 p-2 rounded border border-emerald-900/30 text-xs">
                              <ArrowRight size={14}/> Stabilizes at K (Sustainable)
                          </div>
                      </div>
                  )}
              </div>
          </div>

          {/* Graph */}
          <div className="lg:col-span-2 bg-slate-900 rounded-3xl border border-slate-700 relative overflow-hidden shadow-2xl flex flex-col h-[500px]">
              <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-5 pointer-events-none"></div>
              
              <div className="absolute top-4 right-4 z-10 flex flex-col gap-2 text-xs font-mono">
                  <div className="flex items-center gap-2">
                      <div className={`w-4 h-0.5 ${model === 'malthus' ? 'bg-pink-400' : 'bg-emerald-400'}`}></div>
                      <span className="text-slate-400">Population N(t)</span>
                  </div>
                  {model === 'verhulst' && (
                      <div className="flex items-center gap-2">
                          <div className="w-4 h-0.5 bg-slate-500 border-t border-dashed border-slate-300"></div>
                          <span className="text-slate-500">Capacity K</span>
                      </div>
                  )}
              </div>

              <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full">
                  {/* Grid */}
                  <line x1={0} y1={height} x2={width} y2={height} stroke="#475569" strokeWidth="2"/>
                  <line x1={0} y1={0} x2={0} y2={height} stroke="#475569" strokeWidth="2"/>

                  {/* Capacity Line */}
                  {model === 'verhulst' && (
                      <line 
                        x1={0} y1={scaleY(K)} 
                        x2={width} y2={scaleY(K)} 
                        stroke="#64748b" strokeWidth="1" strokeDasharray="5 5"
                      />
                  )}

                  {/* Curve */}
                  <motion.path 
                    d={generatePath(activeFunc)} 
                    fill="none" 
                    stroke={model === 'malthus' ? '#ec4899' : '#10b981'} 
                    strokeWidth="3"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 1 }}
                  />
                  
                  {/* Labels */}
                  <text x={10} y={height - 10} fill="#64748b" fontSize="10">t=0</text>
                  <text x={width - 30} y={height - 10} fill="#64748b" fontSize="10">t={timeEnd}</text>
                  {model === 'verhulst' && (
                      <text x={10} y={scaleY(K) - 5} fill="#64748b" fontSize="10">K={K}</text>
                  )}
              </svg>
              
              {/* Bio Simulation Overlay (Particles) */}
              <div className="absolute bottom-4 left-4 p-3 bg-black/60 rounded-xl backdrop-blur-sm border border-white/10 pointer-events-none">
                  <div className="text-[10px] text-slate-400 uppercase font-bold mb-2">Bio-Sim Preview</div>
                  <div className="w-32 h-32 relative bg-slate-900/50 rounded-lg overflow-hidden">
                      {/* Simple dot representation of population density */}
                      {Array.from({length: Math.min(Math.floor(activeFunc(timeEnd/2)), 100)}).map((_, i) => (
                          <div 
                            key={i}
                            className={`absolute w-1 h-1 rounded-full ${model === 'malthus' ? 'bg-pink-500' : 'bg-emerald-500'}`}
                            style={{
                                left: `${Math.random() * 100}%`,
                                top: `${Math.random() * 100}%`,
                                opacity: 0.6
                            }}
                          />
                      ))}
                  </div>
              </div>
          </div>

      </div>
    </div>
  );
};
