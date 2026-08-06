import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, Calculator, LineChart, Move, Table2, MousePointer2 } from 'lucide-react';
import { WolframHelper } from '../components/WolframHelper';
import * as math from 'mathjs';
import { usePersistedState } from '../utils/usePersistedState';

export const FunctionsView: React.FC = () => {
  const [funcInput, setFuncInput] = usePersistedState<string>('func_input', '1/x');
  const [limitPoint, setLimitPoint] = usePersistedState<string>('func_limit_pt', '0');
  const [error, setError] = useState<string | null>(null);
  const [showTable, setShowTable] = useState(false);
  
  // Viewport State
  const [domain, setDomain] = usePersistedState<{ x: [number, number], y: [number, number] }>('func_domain', { x: [-8, 8], y: [-6, 6] });
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef<{ x: number, y: number }>({ x: 0, y: 0 });
  const initialDomain = useRef<{ x: [number, number], y: [number, number] }>({ x: [-8, 8], y: [-6, 6] });
  const svgRef = useRef<SVGSVGElement>(null);
  const [hoverPoint, setHoverPoint] = useState<{x: number, y: number} | null>(null);

  const presets = [
    { label: 'Rational', expr: '(x - 1) / (x^2 - 4)' },
    { label: 'Semi-circle', expr: '2 * sqrt(1 - x^2)' },
    { label: 'Polynomial', expr: 'x^2 - 1' },
    { label: 'Trig', expr: 'sin(x) + cos(2x)' }
  ];

  let compiledFunc: any = null;
  try {
      compiledFunc = math.compile(funcInput);
  } catch (e) {
      // Error handled via effect
  }

  const evaluateFn = (x: number) => {
      try {
          if (!compiledFunc) return NaN;
          const result = compiledFunc.evaluate({ x });
          return typeof result === 'number' ? result : NaN;
      } catch (e) {
          return NaN;
      }
  };

  const width = 800;
  const height = 500;
  
  const scaleX = (x: number) => ((x - domain.x[0]) / (domain.x[1] - domain.x[0])) * width;
  const scaleY = (y: number) => height - ((y - domain.y[0]) / (domain.y[1] - domain.y[0])) * height;
  const inverseScaleX = (svgX: number) => domain.x[0] + (svgX / width) * (domain.x[1] - domain.x[0]);

  const generatePaths = () => {
      if (!compiledFunc) return [];
      const paths: string[] = [];
      let currentPath = "";
      const range = domain.x[1] - domain.x[0];
      const stepSize = range / 1000; 
      let isDrawing = false;
      let prevY = NaN;

      const startX = domain.x[0] - range * 0.1;
      const endX = domain.x[1] + range * 0.1;

      for(let x = startX; x <= endX; x += stepSize) {
          const y = evaluateFn(x);
          const isInvalid = isNaN(y) || !isFinite(y);
          const rangeY = domain.y[1] - domain.y[0];
          // Check for vertical asymptotes (large jumps)
          const isJump = !isNaN(prevY) && Math.abs(y - prevY) > (rangeY * 1.5);

          if (isInvalid || isJump) {
              if (isDrawing) {
                  paths.push(currentPath);
                  currentPath = "";
                  isDrawing = false;
              }
              prevY = y;
              continue;
          }

          const svgX = scaleX(x);
          // Clamp for SVG stability
          const clampedY = Math.max(Math.min(y, domain.y[1] * 5), domain.y[0] * 5);
          const svgY = scaleY(clampedY);
          
          if (!isDrawing) {
              currentPath = `M ${svgX} ${svgY} `;
              isDrawing = true;
          } else {
              currentPath += `L ${svgX} ${svgY} `;
          }
          prevY = y;
      }
      if (currentPath) paths.push(currentPath);
      return paths;
  };

  const paths = generatePaths();

  const getLimit = (targetStr: string, dir: 'left' | 'right') => {
      try {
        const target = parseFloat(targetStr);
        if (isNaN(target)) return "N/A";
        const h = 0.0001; 
        const x = dir === 'left' ? target - h : target + h;
        const y = evaluateFn(x);
        
        if (y > 1000) return '+∞';
        if (y < -1000) return '-∞';
        if (isNaN(y)) return "Undef";
        if (Math.abs(y) < 0.001) return "0";

        return y.toFixed(3);
      } catch {
          return "Err";
      }
  };

  // Interaction Handlers
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const zoomFactor = e.deltaY > 0 ? 1.1 : 0.9;
    const rangeX = domain.x[1] - domain.x[0];
    const rangeY = domain.y[1] - domain.y[0];
    const centerX = (domain.x[0] + domain.x[1]) / 2;
    const centerY = (domain.y[0] + domain.y[1]) / 2;

    setDomain({
        x: [centerX - (rangeX * zoomFactor) / 2, centerX + (rangeX * zoomFactor) / 2],
        y: [centerY - (rangeY * zoomFactor) / 2, centerY + (rangeY * zoomFactor) / 2]
    });
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    dragStart.current = { x: e.clientX, y: e.clientY };
    initialDomain.current = domain;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
        const dxPixels = e.clientX - dragStart.current.x;
        const dyPixels = e.clientY - dragStart.current.y;
        const rangeX = initialDomain.current.x[1] - initialDomain.current.x[0];
        const rangeY = initialDomain.current.y[1] - initialDomain.current.y[0];
        const dxMath = -(dxPixels / width) * rangeX;
        const dyMath = (dyPixels / height) * rangeY;

        setDomain({
            x: [initialDomain.current.x[0] + dxMath, initialDomain.current.x[1] + dxMath],
            y: [initialDomain.current.y[0] + dyMath, initialDomain.current.y[1] + dyMath]
        });
    } else {
        // Hover
        if (svgRef.current) {
            const rect = svgRef.current.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const mathX = inverseScaleX(x);
            const mathY = evaluateFn(mathX);
            setHoverPoint({ x: mathX, y: mathY });
        }
    }
  };

  useEffect(() => {
    try {
        math.compile(funcInput);
        setError(null);
    } catch (e) {
        setError("Invalid Syntax");
    }
  }, [funcInput]);

  return (
    <div className="space-y-8 pb-20">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end border-b border-white/10 pb-6 gap-6">
            <div>
                <h2 className="text-4xl font-black text-white mb-2 tracking-tight">Function Grapher</h2>
                <p className="text-slate-400 max-w-2xl font-light text-base">
                    Visualize <span className="font-mono text-cyan-400">y = f(x)</span> with automatic asymptote detection and limit analysis.
                </p>
            </div>
            <div className="bg-slate-900/80 backdrop-blur border border-white/10 px-4 py-2 rounded-lg text-slate-400 font-mono text-xs uppercase tracking-widest">
                Math.js Engine
            </div>
        </header>

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
            
            {/* Left Controls */}
            <div className="xl:col-span-4 space-y-6">
                <div className="glass-panel p-6 rounded-3xl backdrop-blur-md">
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                         <Calculator size={16} className="text-purple-400"/> Expression
                    </h3>
                    
                    <div className="relative mb-6">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-purple-400 font-serif italic font-bold text-lg pointer-events-none">f(x) =</div>
                        <input 
                            type="text" 
                            value={funcInput}
                            onChange={(e) => setFuncInput(e.target.value)}
                            className={`w-full bg-slate-950 border ${error ? 'border-pink-500 shadow-pink-500/20 shadow-lg' : 'border-slate-800'} rounded-2xl py-4 pl-16 pr-4 text-white focus:border-cyan-500 outline-none font-mono text-base transition-all`}
                            placeholder="e.g. x^2 + 2x"
                        />
                        {error && <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] text-pink-400 font-bold uppercase tracking-wider bg-pink-500/10 px-2 py-1 rounded">{error}</span>}
                    </div>

                    <div className="flex flex-wrap gap-2">
                        {presets.map((p) => (
                            <button
                                key={p.label}
                                onClick={() => setFuncInput(p.expr)}
                                className={`px-3 py-1.5 rounded-lg border font-mono text-xs transition-all
                                    ${funcInput === p.expr 
                                        ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-300' 
                                        : 'bg-slate-900/50 border-slate-800 text-slate-400 hover:bg-slate-800'}
                                `}
                            >
                                {p.label}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="glass-panel p-6 rounded-3xl">
                     <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                         <Activity size={16} className="text-pink-400"/> Limit Scanner
                     </h3>
                     
                     <div className="bg-slate-950/50 p-5 rounded-2xl border border-white/5">
                         <div className="flex justify-between items-center mb-4 pb-4 border-b border-white/5">
                            <p className="text-xs text-slate-400 uppercase tracking-wider font-bold">Target Point (a)</p>
                            <input 
                                type="text" 
                                value={limitPoint}
                                onChange={(e) => setLimitPoint(e.target.value)}
                                className="w-20 bg-slate-900 border border-slate-700 rounded-lg px-3 py-1 text-right font-mono text-white focus:border-pink-500 outline-none"
                            />
                         </div>

                         <div className="grid grid-cols-2 gap-4">
                             <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 text-center">
                                 <div className="text-[10px] text-slate-500 mb-2 font-mono uppercase tracking-widest">Left Limit (x→a⁻)</div>
                                 <div className="font-mono font-bold text-xl text-white">{getLimit(limitPoint, 'left')}</div>
                             </div>
                             <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 text-center">
                                 <div className="text-[10px] text-slate-500 mb-2 font-mono uppercase tracking-widest">Right Limit (x→a⁺)</div>
                                 <div className="font-mono font-bold text-xl text-white">{getLimit(limitPoint, 'right')}</div>
                             </div>
                         </div>
                     </div>
                </div>
            </div>

            {/* Right Graph */}
            <div className="xl:col-span-8 flex flex-col gap-4">
                 <div className="glass-panel rounded-3xl relative overflow-hidden flex flex-col shadow-2xl min-h-[500px] border border-white/10 bg-slate-900/60">
                    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-5 pointer-events-none"></div>
                    
                    {/* Toolbar */}
                    <div className="p-4 border-b border-white/5 flex flex-col sm:flex-row justify-between items-center z-10 bg-slate-950/50 backdrop-blur-sm gap-2">
                        <span className="text-slate-300 text-sm font-mono flex items-center gap-2">
                            <LineChart size={16} className="text-cyan-400"/> 
                            y = {funcInput}
                        </span>
                        <div className="flex gap-4 items-center">
                            <button 
                                onClick={() => setShowTable(!showTable)}
                                className={`p-2 rounded-lg transition-colors ${showTable ? 'bg-cyan-500/20 text-cyan-400' : 'text-slate-500 hover:text-white'}`}
                            >
                                <Table2 size={18}/>
                            </button>
                            <div className="h-4 w-px bg-white/10"></div>
                            <span className="text-[10px] uppercase tracking-widest text-slate-500 flex items-center gap-1"><MousePointer2 size={12}/> {isDragging ? 'Panning' : 'Trace'}</span>
                            <span className="text-[10px] uppercase tracking-widest text-slate-500 flex items-center gap-1"><Move size={12}/> Scroll Zoom</span>
                        </div>
                    </div>

                    <div className="flex flex-1 relative overflow-hidden">
                        <div 
                            className={`flex-1 relative w-full ${isDragging ? 'cursor-grabbing' : 'cursor-crosshair'} touch-none`}
                            onWheel={handleWheel}
                            onMouseDown={handleMouseDown}
                            onMouseMove={handleMouseMove}
                            onMouseUp={() => setIsDragging(false)}
                            onMouseLeave={() => { setIsDragging(false); setHoverPoint(null); }}
                        >
                            <svg ref={svgRef} viewBox={`0 0 ${width} ${height}`} className="w-full h-full overflow-visible z-10 p-0 select-none">
                                {/* Axes */}
                                {domain.y[0] < 0 && domain.y[1] > 0 && (
                                    <line x1={0} y1={scaleY(0)} x2={width} y2={scaleY(0)} stroke="#475569" strokeWidth="1.5" />
                                )}
                                {domain.x[0] < 0 && domain.x[1] > 0 && (
                                    <line x1={scaleX(0)} y1={0} x2={scaleX(0)} y2={height} stroke="#475569" strokeWidth="1.5" />
                                )}

                                {/* Grid Numbers */}
                                {[Math.ceil(domain.x[0]), 0, Math.floor(domain.x[1])].map(x => (
                                    <text key={`x-${x}`} x={scaleX(x)} y={height - 10} fill="#64748b" fontSize="10" textAnchor="middle" fontFamily="monospace">{x}</text>
                                ))}
                                {[Math.ceil(domain.y[0]), 0, Math.floor(domain.y[1])].map(y => (
                                    <text key={`y-${y}`} x={6} y={scaleY(y) + 4} fill="#64748b" fontSize="10" textAnchor="start" fontFamily="monospace">{y}</text>
                                ))}

                                {/* Limit Line */}
                                {!isNaN(parseFloat(limitPoint)) && (
                                    <line 
                                        x1={scaleX(parseFloat(limitPoint))} y1={0} 
                                        x2={scaleX(parseFloat(limitPoint))} y2={height} 
                                        stroke="#ec4899" strokeWidth="1" strokeDasharray="4 4" opacity="0.6" 
                                    />
                                )}

                                {/* Graph Line */}
                                {paths.map((d, idx) => (
                                    <motion.path
                                        key={`${funcInput}-${idx}`}
                                        d={d}
                                        fill="none"
                                        stroke="#22d3ee" 
                                        strokeWidth="2.5"
                                        strokeLinecap="round"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        style={{ filter: "drop-shadow(0 0 8px rgba(34,211,238,0.4))" }}
                                    />
                                ))}

                                {/* Trace Point */}
                                {hoverPoint && !isDragging && !isNaN(hoverPoint.y) && Math.abs(hoverPoint.y) < Math.max(...domain.y.map(Math.abs)) * 2 && (
                                    <g>
                                        <circle cx={scaleX(hoverPoint.x)} cy={scaleY(hoverPoint.y)} r="5" fill="#fff" stroke="#22d3ee" strokeWidth="2" />
                                        {/* Dynamic Crosshair */}
                                        <line x1={scaleX(hoverPoint.x)} y1={scaleY(hoverPoint.y)} x2={scaleX(hoverPoint.x)} y2={height} stroke="#ffffff30" strokeDasharray="2 2"/>
                                        <line x1={0} y1={scaleY(hoverPoint.y)} x2={scaleX(hoverPoint.x)} y2={scaleY(hoverPoint.y)} stroke="#ffffff30" strokeDasharray="2 2"/>
                                    </g>
                                )}
                            </svg>

                            {/* Floating Tooltip */}
                            {hoverPoint && !isDragging && (
                                <div 
                                    className="absolute pointer-events-none bg-slate-900/90 text-white text-xs p-3 rounded-lg border border-white/10 shadow-xl backdrop-blur-md"
                                    style={{ 
                                        left: Math.min(scaleX(hoverPoint.x) + 15, width - 100), 
                                        top: Math.max(scaleY(hoverPoint.y) - 60, 10)
                                    }}
                                >
                                    <div className="font-mono text-slate-400">x: <span className="text-white">{hoverPoint.x.toFixed(2)}</span></div>
                                    <div className="font-mono text-cyan-400">y: <span className="text-white">{hoverPoint.y.toFixed(2)}</span></div>
                                </div>
                            )}
                        </div>

                        {/* Data Table Slide-out */}
                        <AnimatePresence>
                            {showTable && (
                                <motion.div 
                                    initial={{ width: 0, opacity: 0 }}
                                    animate={{ width: 200, opacity: 1 }}
                                    exit={{ width: 0, opacity: 0 }}
                                    className="border-l border-white/10 bg-slate-950/50 backdrop-blur flex flex-col"
                                >
                                    <div className="p-3 border-b border-white/10 text-xs font-bold text-slate-400 uppercase tracking-widest">Data Points</div>
                                    <div className="overflow-y-auto flex-1 p-0 custom-scrollbar">
                                        <table className="w-full text-xs font-mono">
                                            <thead className="text-slate-500 bg-slate-900/50">
                                                <tr><th className="py-2 text-left pl-4">x</th><th className="py-2 text-right pr-4">y</th></tr>
                                            </thead>
                                            <tbody className="divide-y divide-white/5">
                                                {Array.from({length: 20}).map((_, i) => {
                                                    // Sample points around center of view
                                                    const x = (domain.x[0] + domain.x[1])/2 + (i - 10) * ((domain.x[1]-domain.x[0])/20);
                                                    const y = evaluateFn(x);
                                                    return (
                                                        <tr key={i} className="hover:bg-white/5">
                                                            <td className="py-2 pl-4 text-slate-400">{x.toFixed(1)}</td>
                                                            <td className="py-2 pr-4 text-right text-cyan-400">{y.toFixed(2)}</td>
                                                        </tr>
                                                    )
                                                })}
                                            </tbody>
                                        </table>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </div>
        <WolframHelper context="functions" />
    </div>
  );
};