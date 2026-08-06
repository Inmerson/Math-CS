import React, { useState, useEffect } from 'react';
import { MatrixInput } from '../components/MatrixInput';
import { createMatrix, addMatrices, subtractMatrices, multiplyMatrices, multiplyMatrixByScalar } from '../utils/matrixMath';
import { MatrixData, OperationType } from '../types';
import { Plus, Minus, X, ArrowRight, Settings, Sliders, Hash, Calculator, GraduationCap, Eye } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { WolframHelper } from '../components/WolframHelper';
import { usePersistedState } from '../utils/usePersistedState';

export const OperationsView: React.FC = () => {
  const [op, setOp] = usePersistedState<OperationType>('ops_type', OperationType.ADD);
  const [matrixA, setMatrixA] = usePersistedState<MatrixData>('ops_matA', createMatrix(2, 2, 1));
  const [matrixB, setMatrixB] = usePersistedState<MatrixData>('ops_matB', createMatrix(2, 2, 2));
  const [scalarK, setScalarK] = usePersistedState<number>('ops_scalar', 2);
  const [result, setResult] = useState<MatrixData | null>(null);
  const [showLogic, setShowLogic] = useState(false);

  useEffect(() => {
    switch (op) {
      case OperationType.ADD: setResult(addMatrices(matrixA, matrixB)); break;
      case OperationType.SUBTRACT: setResult(subtractMatrices(matrixA, matrixB)); break;
      case OperationType.MULTIPLY: setResult(multiplyMatrices(matrixA, matrixB)); break;
      case OperationType.SCALAR: setResult(multiplyMatrixByScalar(matrixA, scalarK)); break;
    }
  }, [matrixA, matrixB, op, scalarK]);

  const resizeMatrices = (r: number, c: number) => {
      setMatrixA(createMatrix(r, c, 1));
      if (op !== OperationType.MULTIPLY) {
        setMatrixB(createMatrix(r, c, 2));
      } else {
        setMatrixB(createMatrix(c, r, 2));
      }
  };

  const getLogicExplanation = () => {
      if (!result) return null;
      if (op === OperationType.MULTIPLY) {
          // Show dot product example for C_11
          const row = matrixA[0];
          const col = matrixB.map(r => r[0]);
          const calculation = row.map((val, k) => `(${val} · ${col[k]})`).join(' + ');
          const numeric = row.reduce((acc, val, k) => acc + val * col[k], 0);
          return (
              <div className="space-y-2">
                  <div className="text-sm font-bold text-purple-300">Dot Product Logic (Row · Column)</div>
                  <div className="font-mono text-xs text-slate-300">
                      c<sub className="opacity-50">1,1</sub> = (Row 1 of A) · (Col 1 of B)
                  </div>
                  <div className="p-3 bg-slate-950 rounded border border-purple-500/20 font-mono text-xs text-cyan-400">
                      {calculation} = {numeric}
                  </div>
                  <div className="text-[10px] text-slate-500">
                      Each element c_ij is the sum of products of the i-th row of A and j-th column of B.
                  </div>
              </div>
          );
      }
      if (op === OperationType.ADD) {
          return (
             <div className="space-y-2">
                  <div className="text-sm font-bold text-cyan-300">Element-wise Addition</div>
                  <div className="font-mono text-xs text-slate-300">
                      c<sub className="opacity-50">i,j</sub> = a<sub className="opacity-50">i,j</sub> + b<sub className="opacity-50">i,j</sub>
                  </div>
                  <div className="p-3 bg-slate-950 rounded border border-cyan-500/20 font-mono text-xs text-cyan-400">
                      {matrixA[0][0]} + {matrixB[0][0]} = {result[0][0]} <span className="text-slate-600 ml-2">(example for pos 1,1)</span>
                  </div>
             </div>
          )
      }
      return null;
  };

  return (
    <div className="space-y-8 pb-20">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end border-b border-white/10 pb-6 gap-6">
        <div>
            <h2 className="text-4xl font-black text-white mb-2 tracking-tight">Matrix Arithmetic</h2>
            <p className="text-slate-400 max-w-2xl font-light text-base">
                Real-time computation engine with deep logic inspection.
            </p>
        </div>
        
        {/* Operation Selector - Segmented Control */}
        <div className="bg-slate-900/80 p-1.5 rounded-xl border border-white/10 flex gap-1 shadow-2xl backdrop-blur-md">
            {[
                { type: OperationType.ADD, icon: Plus, label: 'Add' },
                { type: OperationType.SUBTRACT, icon: Minus, label: 'Sub' },
                { type: OperationType.MULTIPLY, icon: X, label: 'Mult' },
                { type: OperationType.SCALAR, icon: Hash, label: 'Scale' },
            ].map((item) => (
                <button
                    key={item.type}
                    onClick={() => setOp(item.type)}
                    className={`
                        px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all
                        ${op === item.type 
                            ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-900/50 scale-105' 
                            : 'text-slate-400 hover:text-white hover:bg-white/5'}
                    `}
                >
                    <item.icon size={14} strokeWidth={3} />
                    <span className="hidden md:inline">{item.label}</span>
                </button>
            ))}
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Config Panel */}
        <div className="lg:col-span-3 space-y-6">
            <div className="glass-panel p-6 rounded-3xl">
                <h3 className="text-sm font-bold text-slate-300 uppercase tracking-widest mb-6 flex items-center gap-2">
                    <Sliders size={16} className="text-purple-400"/> Quick Size
                </h3>
                
                <div className="flex flex-col gap-3">
                    <button onClick={() => resizeMatrices(2,2)} className="w-full py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-slate-300 hover:bg-slate-800 hover:border-slate-500 transition-all text-xs font-bold uppercase tracking-widest flex justify-between px-4 group">
                        <span>Square</span>
                        <span className="text-cyan-400 font-mono group-hover:text-cyan-300">2 × 2</span>
                    </button>
                    <button onClick={() => resizeMatrices(3,3)} className="w-full py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-slate-300 hover:bg-slate-800 hover:border-slate-500 transition-all text-xs font-bold uppercase tracking-widest flex justify-between px-4 group">
                        <span>Square</span>
                        <span className="text-purple-400 font-mono group-hover:text-purple-300">3 × 3</span>
                    </button>
                </div>
            </div>

            {/* Educational Toggle */}
            <button 
                onClick={() => setShowLogic(!showLogic)}
                className={`w-full p-4 rounded-2xl border transition-all flex items-center gap-3 ${showLogic ? 'bg-indigo-600/20 border-indigo-500 text-indigo-300' : 'bg-slate-900/50 border-slate-700 text-slate-400'}`}
            >
                <GraduationCap size={20} />
                <div className="text-left">
                    <div className="text-xs font-bold uppercase tracking-wider">Learning Mode</div>
                    <div className="text-[10px] opacity-70">Show step-by-step logic</div>
                </div>
            </button>

            {/* Logic Panel (Conditional) */}
            <AnimatePresence>
                {showLogic && result && (
                    <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="glass-panel p-5 rounded-2xl border-l-2 border-l-purple-500 overflow-hidden"
                    >
                        {getLogicExplanation()}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>

        {/* Right Calculation Pipeline */}
        <div className="lg:col-span-9">
            <div className="glass-panel p-8 rounded-3xl min-h-[500px] flex flex-col items-center justify-center relative overflow-hidden bg-slate-900/40">
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-5"></div>
                
                {/* Visual Pipeline Track */}
                <div className="absolute top-1/2 left-4 right-4 h-1 bg-slate-800 -translate-y-1/2 hidden xl:block rounded-full"></div>

                <div className="relative z-10 flex flex-col xl:flex-row items-center gap-8 md:gap-12 w-full justify-center">
                    
                    {/* Input A */}
                    <div className="relative group">
                        <div className="absolute -top-10 left-1/2 -translate-x-1/2 text-[10px] font-bold uppercase tracking-widest text-slate-500 bg-slate-900 px-2 py-1 rounded border border-slate-800">Operand A</div>
                        <MatrixInput data={matrixA} onChange={setMatrixA} editable color="blue" />
                        {showLogic && op===OperationType.MULTIPLY && <div className="absolute -bottom-8 left-0 right-0 text-center text-[9px] text-blue-400 font-bold uppercase tracking-wider">Use Rows</div>}
                    </div>

                    {/* Operator Badge */}
                    <div className="relative z-10">
                        <motion.div
                            key={op}
                            initial={{ scale: 0.5, rotate: -180, opacity: 0 }}
                            animate={{ scale: 1, rotate: 0, opacity: 1 }}
                            className="w-14 h-14 rounded-2xl bg-slate-900 border border-slate-700 flex items-center justify-center text-white shadow-2xl shadow-black/50"
                        >
                            {op === OperationType.ADD && <Plus size={24} className="text-cyan-400" strokeWidth={3}/>}
                            {op === OperationType.SUBTRACT && <Minus size={24} className="text-pink-400" strokeWidth={3}/>}
                            {op === OperationType.MULTIPLY && <X size={24} className="text-purple-400" strokeWidth={3}/>}
                            {op === OperationType.SCALAR && <Hash size={24} className="text-emerald-400" strokeWidth={3}/>}
                        </motion.div>
                    </div>

                    {/* Input B (or Scalar Visual) */}
                    {op !== OperationType.SCALAR ? (
                         <div className="relative group">
                            <div className="absolute -top-10 left-1/2 -translate-x-1/2 text-[10px] font-bold uppercase tracking-widest text-slate-500 bg-slate-900 px-2 py-1 rounded border border-slate-800">Operand B</div>
                            <MatrixInput data={matrixB} onChange={setMatrixB} editable color="purple" />
                            {showLogic && op===OperationType.MULTIPLY && <div className="absolute -bottom-8 left-0 right-0 text-center text-[9px] text-purple-400 font-bold uppercase tracking-wider">Use Columns</div>}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center w-32 h-32 rounded-2xl border-2 border-dashed border-slate-700 bg-slate-900/50">
                            <span className="text-4xl font-mono font-bold text-emerald-400">{scalarK}</span>
                            <span className="text-[10px] text-emerald-500/50 uppercase tracking-widest mt-2 font-bold">Scalar</span>
                        </div>
                    )}

                    {/* Equals Arrow */}
                    <ArrowRight className="text-slate-600 hidden xl:block" size={32} strokeWidth={1.5} />
                    <div className="xl:hidden text-slate-600 rotate-90"><ArrowRight size={24}/></div>

                    {/* Result */}
                    <AnimatePresence mode='wait'>
                        <motion.div 
                            key={JSON.stringify(result)}
                            initial={{ scale: 0.9, opacity: 0, x: 20 }}
                            animate={{ scale: 1, opacity: 1, x: 0 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="relative"
                        >
                            <div className="absolute -top-10 left-1/2 -translate-x-1/2 text-[10px] font-bold uppercase tracking-widest text-emerald-500 bg-emerald-900/20 border border-emerald-500/30 px-3 py-1 rounded shadow-lg shadow-emerald-900/20">Result</div>
                            {result ? (
                                <MatrixInput data={result} color="green" />
                            ) : (
                                <div className="w-40 h-40 flex items-center justify-center border-2 border-dashed border-red-500/30 rounded-2xl bg-red-500/5 text-red-400 text-xs font-bold uppercase tracking-wider text-center p-4">
                                    Dimension Mismatch
                                </div>
                            )}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>
        </div>
      </div>

      <WolframHelper context="matrix_ops" />
    </div>
  );
};