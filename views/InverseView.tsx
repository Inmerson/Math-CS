
import React, { useState, useMemo } from 'react';
import { MatrixInput } from '../components/MatrixInput';
import { createMatrix, getDeterminant, getInverse, getMinor, fmt } from '../utils/matrixMath';
import { WolframHelper } from '../components/WolframHelper';
import { GitGraph, ArrowRight, AlertTriangle, CheckCircle2, Factory, Grid, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const InverseView: React.FC = () => {
  const [matrix, setMatrix] = useState([
      [2, 1, 1],
      [3, 2, 1],
      [2, 1, 2]
  ]);

  const det = useMemo(() => getDeterminant(matrix), [matrix]);
  
  // Calculate intermediate steps for educational display
  const cofactorMatrix = useMemo(() => {
      if (!det) return null;
      return matrix.map((row, i) => row.map((_, j) => {
          const minorDet = getDeterminant(getMinor(matrix, i, j)) || 0;
          const sign = (i + j) % 2 === 0 ? 1 : -1;
          return sign * minorDet;
      }));
  }, [matrix, det]);

  const adjugateMatrix = useMemo(() => {
      if (!cofactorMatrix) return null;
      // Transpose of cofactor
      return cofactorMatrix[0].map((_, colIndex) => cofactorMatrix.map(row => row[colIndex]));
  }, [cofactorMatrix]);

  const inverse = useMemo(() => {
      if (!adjugateMatrix || !det) return null;
      return adjugateMatrix.map(row => row.map(val => val / det));
  }, [adjugateMatrix, det]);

  return (
    <div className="space-y-8 pb-20">
        <header className="flex flex-col md:flex-row justify-between items-end border-b border-white/10 pb-6 gap-6">
            <div>
                <h2 className="text-4xl font-bold text-white mb-2">Inversion Factory</h2>
                <p className="text-slate-400 max-w-2xl font-light">
                    Visualizing the 4-stage pipeline to transform <span className="font-mono text-cyan-400">A</span> into <span className="font-mono text-cyan-400">A⁻¹</span>.
                </p>
            </div>
             <div className="flex gap-2">
                 <button onClick={() => setMatrix([[2, 1, 1], [3, 2, 1], [2, 1, 2]])} className="px-3 py-1.5 bg-slate-800 rounded text-xs text-slate-300 hover:text-white transition-colors">Example 1</button>
                 <button onClick={() => setMatrix([[1, 2, 3], [0, 1, 4], [5, 6, 0]])} className="px-3 py-1.5 bg-slate-800 rounded text-xs text-slate-300 hover:text-white transition-colors">Example 2</button>
             </div>
        </header>

        {/* The Pipeline */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 relative">
            {/* Visual connector line (Desktop only) */}
            <div className="hidden lg:block absolute top-1/2 left-0 w-full h-1 bg-gradient-to-r from-slate-800 via-cyan-900 to-purple-900 -translate-y-1/2 z-0 rounded-full"></div>

            {/* Stage 1: Input & Det */}
            <motion.div 
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                className="glass-panel p-5 rounded-2xl relative z-10 flex flex-col gap-4 border-t-4 border-t-slate-500"
            >
                <div className="flex justify-between items-start">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest bg-slate-950 px-2 py-1 rounded">Stage 1: Input</span>
                    <div className={`text-xs font-bold px-2 py-1 rounded flex items-center gap-1 ${det ? 'text-emerald-400 bg-emerald-500/10' : 'text-pink-400 bg-pink-500/10'}`}>
                        {det ? <CheckCircle2 size={12}/> : <AlertTriangle size={12}/>} Det: {det !== null ? fmt(det) : '-'}
                    </div>
                </div>
                <div className="flex-1 flex items-center justify-center">
                    <MatrixInput data={matrix} onChange={setMatrix} editable color="blue" label="" />
                </div>
            </motion.div>

            {/* Stage 2: Cofactors */}
            <motion.div 
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                className={`glass-panel p-5 rounded-2xl relative z-10 flex flex-col gap-4 border-t-4 ${det ? 'border-t-cyan-500' : 'border-t-slate-800 opacity-50'}`}
            >
                <div className="flex justify-between items-start">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest bg-slate-950 px-2 py-1 rounded">Stage 2: Cofactors</span>
                    <Grid size={14} className="text-cyan-500" />
                </div>
                <div className="flex-1 flex flex-col items-center justify-center gap-2">
                    {cofactorMatrix ? (
                        <>
                            <MatrixInput data={cofactorMatrix} color="cyan" label="" />
                            <p className="text-[9px] text-slate-500 text-center">Applied (+ - +) checkerboard to Minors.</p>
                        </>
                    ) : (
                        <div className="text-xs text-slate-500 italic">Waiting for valid input...</div>
                    )}
                </div>
            </motion.div>

            {/* Stage 3: Adjugate (Transpose) */}
            <motion.div 
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                className={`glass-panel p-5 rounded-2xl relative z-10 flex flex-col gap-4 border-t-4 ${det ? 'border-t-purple-500' : 'border-t-slate-800 opacity-50'}`}
            >
                <div className="flex justify-between items-start">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest bg-slate-950 px-2 py-1 rounded">Stage 3: Adjugate</span>
                    <RefreshCw size={14} className="text-purple-500" />
                </div>
                <div className="flex-1 flex flex-col items-center justify-center gap-2">
                    {adjugateMatrix ? (
                        <>
                            <MatrixInput data={adjugateMatrix} color="purple" label="" />
                            <p className="text-[9px] text-slate-500 text-center">Transposed rows to columns.</p>
                        </>
                    ) : (
                        <div className="text-xs text-slate-500 italic">...</div>
                    )}
                </div>
            </motion.div>

            {/* Stage 4: Final Inverse */}
            <motion.div 
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
                className={`glass-panel p-5 rounded-2xl relative z-10 flex flex-col gap-4 border-t-4 ${det ? 'border-t-emerald-500' : 'border-t-slate-800 opacity-50'}`}
            >
                <div className="flex justify-between items-start">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest bg-slate-950 px-2 py-1 rounded">Stage 4: Output</span>
                    <Factory size={14} className="text-emerald-500" />
                </div>
                <div className="flex-1 flex flex-col items-center justify-center gap-2">
                    {inverse ? (
                        <>
                            <MatrixInput data={inverse.map(r => r.map(v => parseFloat(v.toFixed(2))))} color="green" label="" />
                            <p className="text-[9px] text-slate-500 text-center">Divided Adjugate by Det ({fmt(det!)}).</p>
                        </>
                    ) : (
                        <div className="p-4 border border-dashed border-pink-500/30 bg-pink-500/5 rounded-lg text-pink-400 text-xs text-center">
                            Cannot invert singular matrix.
                        </div>
                    )}
                </div>
            </motion.div>

        </div>

        {/* Formula Reference */}
        <div className="mt-8 bg-slate-900/50 p-6 rounded-2xl border border-white/5 flex flex-col md:flex-row items-center justify-center gap-6">
            <div className="text-sm font-bold text-slate-400 uppercase tracking-widest">Master Formula</div>
            <div className="px-6 py-3 bg-slate-950 rounded-xl border border-slate-800 text-xl font-mono text-white shadow-inner">
                 A⁻¹ = <span className="text-emerald-400">1/det(A)</span> · <span className="text-purple-400">adj(A)</span>
            </div>
            <p className="text-xs text-slate-500 max-w-md text-center md:text-left">
                The adjugate matrix adj(A) is the transpose of the cofactor matrix. This formula works for any square non-singular matrix.
            </p>
        </div>

        <WolframHelper context="inverse" />
    </div>
  );
};
