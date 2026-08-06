
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MathRenderer } from '../components/MathRenderer';
import { AreaChart, Sigma, ArrowLeftRight } from 'lucide-react';

export const AreaUnderCurveView: React.FC = () => {
  const [a, setA] = useState(-1);
  const [b, setB] = useState(1);
  const [mode, setMode] = useState<'single' | 'between'>('between');

  const width = 600;
  const height = 400;
  const domain = { x: [-3, 3], y: [-5, 5] };

  const scaleX = (x: number) => ((x - domain.x[0]) / (domain.x[1] - domain.x[0])) * width;
  const scaleY = (y: number) => height - ((y - domain.y[0]) / (domain.y[1] - domain.y[0])) * height;

  // Functions from PDF Page 7
  const f = (x: number) => x * x; // f(x) = x^2
  const g = (x: number) => 2 * x - x * x; // g(x) = 2x - x^2

  const generatePath = (fn: (x: number) => number) => {
    let path = "";
    const step = 0.05;
    for (let x = domain.x[0]; x <= domain.x[1]; x += step) {
        const y = fn(x);
        const sx = scaleX(x);
        const sy = scaleY(y);
        if (x === domain.x[0]) path += `M ${sx} ${sy}`;
        else path += ` L ${sx} ${sy}`;
    }
    return path;
  };

  const generateAreaPath = () => {
      let path = "";
      const step = 0.05;
      
      // Start at x=a
      const startX = Math.max(a, domain.x[0]);
      const endX = Math.min(b, domain.x[1]);

      if (startX >= endX) return "";

      if (mode === 'single') {
          // Area under f(x)
          path = `M ${scaleX(startX)} ${scaleY(0)}`;
          for(let x = startX; x <= endX; x += step) {
              path += ` L ${scaleX(x)} ${scaleY(f(x))}`;
          }
          path += ` L ${scaleX(endX)} ${scaleY(0)} Z`;
      } else {
          // Area between f(x) and g(x)
          // Trace top curve g(x) L to R
          path = `M ${scaleX(startX)} ${scaleY(g(startX))}`;
          for(let x = startX; x <= endX; x += step) {
              path += ` L ${scaleX(x)} ${scaleY(g(x))}`;
          }
          // Trace bottom curve f(x) R to L
          for(let x = endX; x >= startX; x -= step) {
              path += ` L ${scaleX(x)} ${scaleY(f(x))}`;
          }
          path += " Z";
      }
      return path;
  };

  // Calculations
  const F_f = (x: number) => (Math.pow(x, 3) / 3);
  const F_g = (x: number) => (x * x - Math.pow(x, 3) / 3);
  
  const areaValue = mode === 'single' 
    ? F_f(b) - F_f(a) 
    : (F_g(b) - F_f(b)) - (F_g(a) - F_f(a)); // Int(g - f)

  return (
    <div className="space-y-8 pb-20">
      <header className="border-b border-white/10 pb-6 flex flex-col md:flex-row justify-between items-end gap-4">
        <div>
            <h2 className="text-4xl font-bold text-white mb-2">Definite Integral & Area</h2>
            <p className="text-slate-400 max-w-2xl">
                The definite integral <MathRenderer expression="\int_a^b f(x)dx" inline /> represents the signed area under the curve.
            </p>
        </div>
        <div className="bg-slate-900 p-1 rounded-xl border border-slate-800 flex gap-1">
             <button onClick={() => setMode('single')} className={`px-4 py-2 text-xs font-bold uppercase rounded-lg transition-all ${mode==='single' ? 'bg-cyan-600 text-white' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}>Area under f(x)</button>
             <button onClick={() => setMode('between')} className={`px-4 py-2 text-xs font-bold uppercase rounded-lg transition-all ${mode==='between' ? 'bg-purple-600 text-white' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}>Between Curves</button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Controls */}
          <div className="space-y-6">
              <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700">
                  <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-6">Integration Limits</h3>
                  
                  <div className="space-y-6">
                      <div>
                          <div className="flex justify-between text-sm text-slate-300 mb-2">
                              <span>Lower Limit (a)</span>
                              <span className="font-mono text-cyan-400">{a.toFixed(2)}</span>
                          </div>
                          <input type="range" min="-2" max="2" step="0.1" value={a} onChange={e => setA(parseFloat(e.target.value))} className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"/>
                      </div>
                      <div>
                          <div className="flex justify-between text-sm text-slate-300 mb-2">
                              <span>Upper Limit (b)</span>
                              <span className="font-mono text-purple-400">{b.toFixed(2)}</span>
                          </div>
                          <input type="range" min="-2" max="2" step="0.1" value={b} onChange={e => setB(parseFloat(e.target.value))} className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-purple-500"/>
                      </div>
                  </div>
              </div>

              <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800">
                  <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                      <Sigma size={16} /> Calculation (FTC)
                  </h3>
                  
                  <div className="text-center mb-4">
                      <div className="text-3xl font-mono font-bold text-white">{areaValue.toFixed(4)}</div>
                      <div className="text-xs text-slate-500 mt-1">Calculated Area</div>
                  </div>

                  <div className="text-xs text-slate-400 space-y-2 border-t border-white/5 pt-4">
                      {mode === 'single' ? (
                          <>
                            <div className="flex justify-between"><span>Function:</span> <MathRenderer expression="x^2" inline/></div>
                            <div className="flex justify-between"><span>Primitive F(x):</span> <MathRenderer expression="\frac{x^3}{3}" inline/></div>
                            <div className="flex justify-between"><span>F(b) - F(a):</span> <span>{F_f(b).toFixed(2)} - {F_f(a).toFixed(2)}</span></div>
                          </>
                      ) : (
                          <>
                            <div className="flex justify-between"><span>Top Curve:</span> <MathRenderer expression="2x - x^2" inline/></div>
                            <div className="flex justify-between"><span>Bottom Curve:</span> <MathRenderer expression="x^2" inline/></div>
                            <div className="flex justify-between"><span>Integrand:</span> <MathRenderer expression="(2x - x^2) - x^2" inline/></div>
                          </>
                      )}
                  </div>
              </div>
          </div>

          {/* Graph */}
          <div className="lg:col-span-2 bg-slate-900 rounded-3xl border border-slate-700 relative overflow-hidden shadow-2xl flex flex-col h-[500px]">
              <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-5 pointer-events-none"></div>
              
              <div className="absolute top-4 right-4 z-10 flex flex-col gap-2 text-xs font-mono">
                  <div className="flex items-center gap-2">
                      <div className="w-4 h-0.5 bg-cyan-400"></div>
                      <span className="text-slate-400">f(x) = x²</span>
                  </div>
                  {mode === 'between' && (
                      <div className="flex items-center gap-2">
                          <div className="w-4 h-0.5 bg-purple-400"></div>
                          <span className="text-slate-400">g(x) = 2x - x²</span>
                      </div>
                  )}
              </div>

              <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full">
                  {/* Grid */}
                  <line x1={width/2} y1={0} x2={width/2} y2={height} stroke="#475569" strokeWidth="1"/>
                  <line x1={0} y1={height/2} x2={width} y2={height/2} stroke="#475569" strokeWidth="1"/>

                  {/* Shaded Area */}
                  <motion.path 
                    d={generateAreaPath()} 
                    fill={mode === 'single' ? "rgba(34, 211, 238, 0.2)" : "rgba(168, 85, 247, 0.2)"}
                    stroke="none"
                  />

                  {/* Functions */}
                  <path d={generatePath(f)} fill="none" stroke="#22d3ee" strokeWidth="2" />
                  {mode === 'between' && (
                      <path d={generatePath(g)} fill="none" stroke="#c084fc" strokeWidth="2" />
                  )}

                  {/* Limit Lines */}
                  <line x1={scaleX(a)} y1={0} x2={scaleX(a)} y2={height} stroke="#22d3ee" strokeWidth="1" strokeDasharray="4 4" opacity="0.5"/>
                  <line x1={scaleX(b)} y1={0} x2={scaleX(b)} y2={height} stroke="#c084fc" strokeWidth="1" strokeDasharray="4 4" opacity="0.5"/>
                  
                  {/* Labels */}
                  <text x={scaleX(a)} y={height - 10} fill="#22d3ee" fontSize="12" textAnchor="middle">a</text>
                  <text x={scaleX(b)} y={height - 10} fill="#c084fc" fontSize="12" textAnchor="middle">b</text>
              </svg>
          </div>

      </div>
    </div>
  );
};
