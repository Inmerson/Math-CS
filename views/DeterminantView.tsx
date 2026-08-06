
import React, { useState, useMemo } from 'react';
import { MatrixInput } from '../components/MatrixInput';
import { createMatrix, getDeterminant, fmt } from '../utils/matrixMath';
import { motion, AnimatePresence } from 'framer-motion';
import { WolframHelper } from '../components/WolframHelper';
import { Grid3X3, Play, Activity, Scan, HelpCircle, Layers, X, Plus, MoveDownRight, MoveUpRight } from 'lucide-react';
import { usePersistedState } from '../utils/usePersistedState';

export const DeterminantView: React.FC = () => {
  const [matrix, setMatrix] = usePersistedState<number[][]>('det_matrix', [
      [5, 3, -1],
      [2, 0, 4],
      [-3, 6, 2]
  ]);

  const [hoveredDiagonal, setHoveredDiagonal] = useState<'main1' | 'main2' | 'main3' | 'anti1' | 'anti2' | 'anti3' | null>(null);

  const det = useMemo(() => getDeterminant(matrix), [matrix]);
  
  // Sarrus Diagonals Logic (Only valid for 3x3)
  const is3x3 = matrix.length === 3 && matrix[0].length === 3;

  // Helper to determine if a cell is in a diagonal
  const isInDiagonal = (r: number, c: number, type: string | null) => {
      if (!is3x3 || !type) return false;
      // Extended indices logic for visual wrap-around could be complex, 
      // but let's stick to standard Sarrus indices:
      // Main 1: (0,0), (1,1), (2,2)
      // Main 2: (0,1), (1,2), (2,0) (Wrapped)
      // Main 3: (0,2), (1,0), (2,1) (Wrapped)
      
      const indices: Record<string, string[]> = {
          'main1': ['0-0', '1-1', '2-2'],
          'main2': ['0-1', '1-2', '2-0'],
          'main3': ['0-2', '1-0', '2-1'],
          'anti1': ['0-2', '1-1', '2-0'],
          'anti2': ['0-0', '1-2', '2-1'],
          'anti3': ['0-1', '1-0', '2-2'],
      };

      return indices[type]?.includes(`${r}-${c}`);
  };

  return (
    <div className="space-y-8 pb-20">
       <header className="flex flex-col md:flex-row justify-between items-end border-b border-white/10 pb-6 gap-4">
            <div>
                <h2 className="text-4xl font-bold text-white mb-2 tracking-tight">Determinant Analysis</h2>
                <p className="text-slate-400 max-w-2xl font-light">
                    The geometric scaling factor of a linear transformation. <br/>
                    <span className="text-cyan-400">det(A) = 0</span> implies dimension loss (singular matrix).
                </p>
            </div>
            <div className={`px-4 py-2 rounded-lg border text-xs font-mono uppercase tracking-wider flex items-center gap-2 ${det===0 ? 'bg-pink-500/10 border-pink-500/20 text-pink-400' : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'}`}>
                <Activity size={14} />
                Status: {det === 0 ? 'Singular' : 'Invertible'}
            </div>
       </header>

       <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
           
           {/* Left: Input & Sarrus Visualizer */}
           <div className="lg:col-span-7 space-y-6">
               <div className="glass-panel p-8 rounded-[32px] relative overflow-hidden bg-slate-900/60 min-h-[450px] flex flex-col items-center justify-center">
                   
                   {/* Background Grid Pattern */}
                   <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255, 255, 255, 0.05) 1px, transparent 0)', backgroundSize: '30px 30px' }}></div>

                   <div className="relative z-10 w-full flex flex-col items-center">
                        <div className="mb-6 flex items-center gap-2 text-slate-500 text-xs font-bold uppercase tracking-widest">
                            <Grid3X3 size={14} /> Matrix A Input
                        </div>

                        {/* Interactive Matrix Wrapper */}
                        <div className="relative p-6">
                            {/* SVG Overlay for Lines */}
                            {is3x3 && hoveredDiagonal && (
                                <svg className="absolute inset-0 w-full h-full pointer-events-none z-0" style={{ transform: 'scale(1.1)' }}>
                                    {/* Simple predefined paths based on standard matrix visual size - conceptual */}
                                    {/* This is a visual enhancement, precise coordinates depend on DOM, so we use CSS highlights on cells instead for robustness */}
                                </svg>
                            )}

                            {/* Render Custom Matrix Input with Highlights */}
                            <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${matrix[0].length}, minmax(min-content, 1fr))` }}>
                                {matrix.map((row, r) => (
                                    row.map((val, c) => {
                                        const isActive = isInDiagonal(r, c, hoveredDiagonal);
                                        const isMain = hoveredDiagonal?.startsWith('main');
                                        return (
                                            <div key={`${r}-${c}`} className="relative">
                                                <input
                                                    className={`
                                                        w-14 h-14 text-center font-mono text-lg rounded-xl transition-all duration-300 outline-none
                                                        border border-transparent
                                                        ${isActive 
                                                            ? (isMain ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50 scale-110 shadow-[0_0_15px_rgba(16,185,129,0.3)]' : 'bg-pink-500/20 text-pink-300 border-pink-500/50 scale-110 shadow-[0_0_15px_rgba(236,72,153,0.3)]')
                                                            : 'bg-slate-800/60 text-slate-300 hover:bg-slate-800'
                                                        }
                                                    `}
                                                    value={val}
                                                    onChange={(e) => {
                                                        const v = parseFloat(e.target.value);
                                                        if (!isNaN(v) || e.target.value === '' || e.target.value === '-') {
                                                            const m = [...matrix];
                                                            m[r][c] = isNaN(v) ? 0 : v; // Simple handler
                                                            setMatrix(m);
                                                        }
                                                    }}
                                                />
                                            </div>
                                        );
                                    })
                                ))}
                            </div>
                        </div>

                        {/* Sarrus Controls */}
                        {is3x3 ? (
                            <div className="mt-8 w-full max-w-md bg-slate-950/50 p-4 rounded-2xl border border-white/5 backdrop-blur-sm">
                                <div className="text-center text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-3">Sarrus Rule Visualizer</div>
                                <div className="flex justify-between items-center gap-4">
                                    <div className="space-y-1">
                                        <div className="text-[10px] text-emerald-400 font-bold flex items-center gap-1"><MoveDownRight size={10}/> Positive Diagonals</div>
                                        <div className="flex gap-1">
                                            {['main1', 'main2', 'main3'].map((d, i) => (
                                                <button 
                                                    key={d}
                                                    onMouseEnter={() => setHoveredDiagonal(d as any)}
                                                    onMouseLeave={() => setHoveredDiagonal(null)}
                                                    className="w-8 h-8 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono hover:bg-emerald-500 hover:text-white transition-colors"
                                                >
                                                    D{i+1}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="text-slate-600 font-light text-2xl">-</div>
                                    <div className="space-y-1 text-right">
                                        <div className="text-[10px] text-pink-400 font-bold flex items-center justify-end gap-1">Negative Diagonals <MoveUpRight size={10}/></div>
                                        <div className="flex gap-1 justify-end">
                                            {['anti1', 'anti2', 'anti3'].map((d, i) => (
                                                <button 
                                                    key={d}
                                                    onMouseEnter={() => setHoveredDiagonal(d as any)}
                                                    onMouseLeave={() => setHoveredDiagonal(null)}
                                                    className="w-8 h-8 rounded bg-pink-500/10 border border-pink-500/30 text-pink-400 text-xs font-mono hover:bg-pink-500 hover:text-white transition-colors"
                                                >
                                                    A{i+1}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="mt-8 text-slate-500 text-xs italic">
                                Sarrus visualization available for 3x3 matrices.
                            </div>
                        )}

                   </div>
               </div>
           </div>

           {/* Right: Result & Meaning */}
           <div className="lg:col-span-5 space-y-6">
               
               {/* Result Card */}
               <div className="glass-panel p-8 rounded-[32px] flex flex-col items-center justify-center relative overflow-hidden min-h-[250px] border-t-4 border-t-purple-500">
                   <div className="absolute inset-0 bg-gradient-to-b from-purple-500/5 to-transparent pointer-events-none"></div>
                   
                   <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Computed Determinant</h3>
                   
                   <motion.div 
                        key={det}
                        initial={{ scale: 0.5, opacity: 0, filter: 'blur(10px)' }}
                        animate={{ scale: 1, opacity: 1, filter: 'blur(0px)' }}
                        className="relative z-10"
                   >
                        <div className="text-7xl font-mono font-bold text-white drop-shadow-[0_0_30px_rgba(168,85,247,0.4)]">
                            {det !== null ? fmt(det) : "Err"}
                        </div>
                   </motion.div>

                   <div className="mt-6 flex flex-wrap gap-2 justify-center">
                       {det === 0 ? (
                           <span className="px-3 py-1 rounded-full bg-pink-500/20 text-pink-300 text-xs font-bold border border-pink-500/30">
                               Volume Collapsed (Singular)
                           </span>
                       ) : (
                           <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30">
                               Volume Preserved (Invertible)
                           </span>
                       )}
                   </div>
               </div>

               {/* Concepts */}
               <div className="grid gap-4">
                   <div className="bg-slate-900/50 p-5 rounded-2xl border border-white/5 hover:border-cyan-500/30 transition-colors group">
                       <h4 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
                           <Layers size={16} className="text-cyan-400 group-hover:scale-110 transition-transform"/> 
                           Geometric Interpretation
                       </h4>
                       <p className="text-xs text-slate-400 leading-relaxed">
                           The determinant represents the <strong className="text-cyan-400">signed volume</strong> of the parallelepiped formed by the column vectors of the matrix.
                       </p>
                   </div>
                   
                   <div className="bg-slate-900/50 p-5 rounded-2xl border border-white/5 hover:border-purple-500/30 transition-colors group">
                       <h4 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
                           <Scan size={16} className="text-purple-400 group-hover:scale-110 transition-transform"/> 
                           Laplace Expansion
                       </h4>
                       <p className="text-xs text-slate-400 leading-relaxed">
                           Recursive method: <span className="font-mono text-purple-300">det(A) = Σ (-1)ⁱ⁺ʲ · aᵢⱼ · Mᵢⱼ</span>.
                           Useful for matrices larger than 3x3.
                       </p>
                   </div>
               </div>

           </div>

       </div>

       <WolframHelper context="determinant" />
    </div>
  );
};
