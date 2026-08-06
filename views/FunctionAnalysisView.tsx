import React, { useState, useRef, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, ArrowDownRight, ArrowUpRight, Move, ZoomIn } from 'lucide-react';
import { WolframHelper } from '../components/WolframHelper';
import * as math from 'mathjs';
import { usePersistedState } from '../utils/usePersistedState';

export const FunctionAnalysisView: React.FC = () => {
  const [inputStr, setInputStr] = usePersistedState<string>('analysis_input', 'x^3 + 3x^2 - 9x - 2');
  const [mousePos, setMousePos] = useState<{x: number, y: number} | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const [compiledData, setCompiledData] = useState<{ f: any, df: any, dfStr: string, error: boolean }>({ f: null, df: null, dfStr: '', error: false });

  // Zoom & Pan State - Persisted
  const [domain, setDomain] = usePersistedState<{ x: [number, number], y: [number, number] }>('analysis_domain', { x: [-10, 10], y: [-20, 20] });
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef<{ x: number, y: number }>({ x: 0, y: 0 });
  const initialDomain = useRef<{ x: [number, number], y: [number, number] }>({ x: [-10, 10], y: [-20, 20] });

  const width = 800;
  const height = 400;
  const padding = 0; // Full bleed

  const scaleX = (x: number) => ((x - domain.x[0]) / (domain.x[1] - domain.x[0])) * width;
  const scaleY = (y: number) => height - ((y - domain.y[0]) / (domain.y[1] - domain.y[0])) * height;
  const inverseScaleX = (svgX: number) => domain.x[0] + (svgX / width) * (domain.x[1] - domain.x[0]);
  const inverseScaleY = (svgY: number) => domain.y[0] + ((height - svgY) / height) * (domain.y[1] - domain.y[0]);

  // Compile function and derivative on input change
  useEffect(() => {
      try {
          const node = math.parse(inputStr);
          const compiledF = node.compile();
          
          const derivNode = math.derivative(node, 'x');
          const compiledDF = derivNode.compile();
          
          setCompiledData({
              f: compiledF,
              df: compiledDF,
              dfStr: derivNode.toString(),
              error: false
          });
      } catch (e) {
          setCompiledData(prev => ({ ...prev, error: true }));
      }
  }, [inputStr]);

  const f = (x: number) => {
      try { return compiledData.f ? compiledData.f.evaluate({x}) : 0; } catch { return 0; }
  };
  
  const df = (x: number) => {
      try { return compiledData.df ? compiledData.df.evaluate({x}) : 0; } catch { return 0; }
  };

  // Find Critical Points (Simple Scan)
  const criticalPoints = useMemo(() => {
      if (compiledData.error || !compiledData.df) return [];
      const points: { x: number, type: 'max' | 'min' | 'inflection', y: number }[] = [];
      // Adjust scan step based on zoom level
      const range = domain.x[1] - domain.x[0];
      const step = range / 500;
      let prevSlope = df(domain.x[0]);
      
      for (let x = domain.x[0]; x <= domain.x[1]; x += step) {
          const slope = df(x);
          // Check for sign change
          if ((prevSlope > 0 && slope < 0) || (prevSlope < 0 && slope > 0)) {
              // Refine x
              const rootX = x - step/2; 
              const val = f(rootX);
              points.push({
                  x: rootX,
                  y: val,
                  type: prevSlope > 0 ? 'max' : 'min'
              });
          }
          prevSlope = slope;
      }
      return points;
  }, [compiledData, domain.x]);

  const generatePath = () => {
    if (compiledData.error) return "";
    let path = "";
    const range = domain.x[1] - domain.x[0];
    const step = range / 800; // One point per pixel roughly
    let isDrawing = false;

    // Render slightly outside view to ensure continuity
    const startX = domain.x[0] - range * 0.1;
    const endX = domain.x[1] + range * 0.1;

    for (let x = startX; x <= endX; x += step) {
        const y = f(x);
        
        // Skip discontinuities or extreme values for drawing stability
        if (isNaN(y) || Math.abs(y) > Math.max(Math.abs(domain.y[0]), Math.abs(domain.y[1])) * 10) {
            isDrawing = false;
            continue;
        }

        const sx = scaleX(x);
        const sy = scaleY(y);

        if (!isDrawing) {
            path += `M ${sx} ${sy}`;
            isDrawing = true;
        } else {
            path += ` L ${sx} ${sy}`;
        }
    }
    return path;
  };

  // --- Interaction Handlers ---

  const handleWheel = (e: React.WheelEvent) => {
      e.preventDefault();
      const zoomFactor = e.deltaY > 0 ? 1.1 : 0.9;
      const rangeX = domain.x[1] - domain.x[0];
      const rangeY = domain.y[1] - domain.y[0];
      
      // Zoom towards center for simplicity
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
      // Handle Dragging (Pan)
      if (isDragging) {
          const dxPixels = e.clientX - dragStart.current.x;
          const dyPixels = e.clientY - dragStart.current.y;

          const rangeX = initialDomain.current.x[1] - initialDomain.current.x[0];
          const rangeY = initialDomain.current.y[1] - initialDomain.current.y[0];

          const dxMath = -(dxPixels / width) * rangeX;
          const dyMath = (dyPixels / height) * rangeY; // Invert Y for screen coords

          setDomain({
              x: [initialDomain.current.x[0] + dxMath, initialDomain.current.x[1] + dxMath],
              y: [initialDomain.current.y[0] + dyMath, initialDomain.current.y[1] + dyMath]
          });
          return;
      }

      // Handle Hover (Trace)
      if (!svgRef.current) return;
      const rect = svgRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const mathX = inverseScaleX(x);
      setMousePos({ x: mathX, y: f(mathX) });
  };

  const handleMouseUp = () => {
      setIsDragging(false);
  };

  const getTangentLine = () => {
      if (!mousePos) return null;
      const slope = df(mousePos.x);
      const xRange = domain.x[1] - domain.x[0];
      const length = xRange * 0.15; 
      
      const x1 = mousePos.x - length;
      const y1 = mousePos.y - slope * length;
      
      const x2 = mousePos.x + length;
      const y2 = mousePos.y + slope * length;
      
      return (
        <line 
            x1={scaleX(x1)} y1={scaleY(y1)}
            x2={scaleX(x2)} y2={scaleY(y2)}
            stroke="#fbbf24"
            strokeWidth="2"
            strokeDasharray="4 4"
        />
      );
  };

  return (
    <div className="space-y-8 pb-20">
       <header className="mb-8">
        <h2 className="text-4xl font-bold text-white mb-4">Function Analysis</h2>
        <p className="text-slate-400 max-w-3xl">
          Interactive graph. Scroll to zoom, drag to pan. Analyze extrema and derivatives.
        </p>
      </header>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        
        {/* Graph Area */}
        <div className="xl:col-span-2 bg-slate-900 rounded-2xl border border-slate-700 relative overflow-hidden shadow-2xl group min-h-[400px] flex flex-col">
           <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-5 pointer-events-none"></div>
           
           <div className="p-4 border-b border-slate-800 flex flex-col sm:flex-row justify-between items-start sm:items-center bg-slate-900/80 backdrop-blur z-10 relative gap-4">
              <div className="flex items-center gap-4 w-full sm:w-auto">
                  <span className="text-slate-400 text-sm font-bold">f(x) =</span>
                  <input 
                    type="text" 
                    value={inputStr}
                    onChange={(e) => setInputStr(e.target.value)}
                    className="bg-slate-950 border border-slate-700 text-white px-3 py-1 rounded-lg font-mono text-sm focus:border-cyan-500 outline-none w-full sm:w-64"
                  />
              </div>
              <div className="flex gap-4 text-xs font-mono shrink-0 items-center">
                 <span className="text-cyan-400 flex items-center gap-1"><div className="w-2 h-2 bg-cyan-400 rounded-full"/> Curve</span>
                 <span className="text-amber-400 flex items-center gap-1"><div className="w-2 h-2 bg-amber-400 rounded-full"/> Tangent</span>
                 <span className="text-slate-500 flex items-center gap-1"><Move size={12}/> Drag</span>
                 <span className="text-slate-500 flex items-center gap-1"><ZoomIn size={12}/> Scroll</span>
              </div>
           </div>

           <div 
                className={`relative flex-1 w-full ${isDragging ? 'cursor-grabbing' : 'cursor-crosshair'} touch-none`}
                style={{ touchAction: 'none' }}
                onWheel={handleWheel}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={() => { setMousePos(null); setIsDragging(false); }}
            >
              <svg ref={svgRef} viewBox={`0 0 ${width} ${height}`} className="w-full h-full overflow-visible select-none">
                 {/* Axes */}
                 {domain.y[0] < 0 && domain.y[1] > 0 && (
                     <line x1={0} y1={scaleY(0)} x2={width} y2={scaleY(0)} stroke="#475569" strokeWidth="1" />
                 )}
                 {domain.x[0] < 0 && domain.x[1] > 0 && (
                     <line x1={scaleX(0)} y1={0} x2={scaleX(0)} y2={height} stroke="#475569" strokeWidth="1" />
                 )}
                 
                 {/* Grid Ticks (Simple) */}
                 {[Math.round(domain.x[0]), 0, Math.round(domain.x[1])].map(x => (
                    <text key={`x-${x}`} x={scaleX(x) + 4} y={height - 6} fill="#64748b" fontSize="10" fontFamily="monospace">{x}</text>
                 ))}
                 {[Math.round(domain.y[0]), 0, Math.round(domain.y[1])].map(y => (
                    <text key={`y-${y}`} x={4} y={scaleY(y) - 4} fill="#64748b" fontSize="10" fontFamily="monospace">{y}</text>
                 ))}

                 {/* Function Curve */}
                 <motion.path 
                    d={generatePath()} 
                    fill="none" 
                    stroke="#22d3ee" 
                    strokeWidth="2.5" 
                 />

                 {/* Interactive Elements */}
                 {mousePos && !isDragging && (
                     <>
                        {getTangentLine()}
                        <circle cx={scaleX(mousePos.x)} cy={scaleY(mousePos.y)} r="4" fill="#fbbf24" />
                     </>
                 )}

                 {/* Critical Points Markers */}
                 {criticalPoints.map((pt, i) => (
                     <g key={i}>
                        <circle cx={scaleX(pt.x)} cy={scaleY(pt.y)} r="5" className="fill-pink-500 stroke-white stroke-2" />
                     </g>
                 ))}
              </svg>
              
              {/* Tooltip Overlay */}
              {mousePos && !isDragging && (
                  <div 
                    className="absolute pointer-events-none bg-slate-800/90 text-white text-xs p-3 rounded-lg border border-amber-500/50 shadow-xl font-mono whitespace-nowrap z-20 backdrop-blur-md"
                    style={{ 
                        left: Math.min(scaleX(mousePos.x) + 10, width - 150), 
                        top: Math.max(scaleY(mousePos.y) - 80, 10)
                    }}
                  >
                      <div className="mb-1">x: <span className="text-slate-300">{mousePos.x.toFixed(2)}</span></div>
                      <div className="mb-1">y: <span className="text-cyan-300">{mousePos.y.toFixed(2)}</span></div>
                      <div>m: <span className="text-amber-400 font-bold">{df(mousePos.x).toFixed(2)}</span></div>
                  </div>
              )}
           </div>
        </div>

        {/* Analysis Panel (Right Side) */}
        <div className="space-y-6">
           
           {/* Derivative Info */}
           <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700 backdrop-blur-md">
               <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Derivative Calculation</h4>
               <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 mb-4">
                   <div className="text-xs text-slate-500 mb-1 font-mono">f'(x) = d/dx[{inputStr}]</div>
                   <div className="text-lg text-pink-400 font-mono break-all">
                       {compiledData.dfStr || "Computing..."}
                   </div>
               </div>
               
               {mousePos ? (
                   <div className="space-y-2">
                       <div className="flex justify-between items-center pt-2 border-t border-slate-700">
                           <span className="text-slate-400 text-sm">Slope at x={mousePos.x.toFixed(1)}</span>
                           <span className={`font-mono font-bold ${df(mousePos.x) > 0 ? 'text-green-400' : 'text-red-400'}`}>
                               {df(mousePos.x).toFixed(3)}
                           </span>
                       </div>
                       <div className="text-xs text-right text-slate-500">
                           {df(mousePos.x) > 0 ? "Function is Increasing" : "Function is Decreasing"}
                       </div>
                   </div>
               ) : (
                   <div className="text-center text-slate-500 py-2 text-sm">
                       Hover over graph to evaluate
                   </div>
               )}
           </div>

           {/* Monotonicity Table */}
           <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700 backdrop-blur-md">
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Detected Extrema in View</h4>
              
              {criticalPoints.length > 0 ? (
                  <div className="space-y-3 max-h-[200px] overflow-y-auto pr-2 custom-scrollbar">
                      {criticalPoints.map((pt, i) => (
                          <div key={i} className="flex items-center justify-between bg-slate-900/50 p-3 rounded-lg border border-slate-800">
                              <div className="flex items-center gap-3">
                                  <div className={`p-2 rounded-md ${pt.type === 'max' ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                                      {pt.type === 'max' ? <ArrowUpRight size={16}/> : <ArrowDownRight size={16}/>}
                                  </div>
                                  <div>
                                      <div className="text-xs font-bold text-slate-300 uppercase">{pt.type}imum</div>
                                      <div className="text-[10px] text-slate-500 font-mono">at x ≈ {pt.x.toFixed(2)}</div>
                                  </div>
                              </div>
                              <div className="text-right font-mono text-sm text-cyan-400">
                                  {pt.y.toFixed(2)}
                              </div>
                          </div>
                      ))}
                  </div>
              ) : (
                  <div className="text-center py-6 text-slate-500 text-sm bg-slate-900/30 rounded-xl border border-slate-800/50 border-dashed">
                      No critical points found in view range.
                  </div>
              )}
           </div>

           <div className="text-[10px] text-slate-600 text-center">
               Powered by MathJS Symbolic Differentiation
           </div>

        </div>
      </div>
      <WolframHelper context="analysis" />
    </div>
  );
};