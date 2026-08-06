import React, { useState, useMemo } from 'react';
import { MatrixInput } from '../components/MatrixInput';
import { getDeterminant, getTrace, getEigenvalues2x2, fmt } from '../utils/matrixMath';
import { motion } from 'framer-motion';
import { Network, Scaling } from 'lucide-react';

export const EigenView: React.FC = () => {
  // Default matrix that yields nice integer eigenvalues (4 and 1)
  const [matrix, setMatrix] = useState([
      [4, 1],
      [2, 3]
  ]);

  const tr = useMemo(() => getTrace(matrix), [matrix]);
  const det = useMemo(() => getDeterminant(matrix), [matrix]);
  const eigens = useMemo(() => getEigenvalues2x2(matrix), [matrix]);

  // Characteristic Equation parts
  const b = tr !== null ? -tr : 0;
  const c = det !== null ? det : 0;

  return (
    <div className="space-y-10 pb-20">
        <header className="mb-8">
            <h2 className="text-4xl font-bold text-white mb-2">Eigenvalues (Stability)</h2>
            <p className="text-slate-400 max-w-2xl">
                Eigenvalues (<span className="font-mono text-pink-400">λ</span>) are the "scaling factors" of the matrix. They determine whether a dynamic system grows, decays, or rotates.
                <br/>Calculated via characteristic equation: <span className="font-mono text-cyan-400">det(A - λI) = 0</span>.
            </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            <div className="flex flex-col items-center gap-8">
                <div className="bg-slate-800/50 p-8 rounded-3xl border border-white/5 backdrop-blur-xl relative">
                     <div className="absolute -top-3 -left-3 bg-pink-500 text-white text-xs font-bold px-2 py-1 rounded">INPUT A</div>
                     <MatrixInput 
                        data={matrix} 
                        onChange={setMatrix} 
                        editable 
                        color="pink"
                    />
                </div>

                <div className="grid grid-cols-2 gap-4 w-full max-w-md">
                    <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 text-center">
                        <span className="text-xs text-slate-500 uppercase tracking-widest">Trace (Tr)</span>
                        <div className="text-2xl font-mono font-bold text-white mt-1">{tr !== null ? fmt(tr) : '-'}</div>
                    </div>
                    <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 text-center">
                        <span className="text-xs text-slate-500 uppercase tracking-widest">Determinant</span>
                        <div className="text-2xl font-mono font-bold text-white mt-1">{det !== null ? fmt(det) : '-'}</div>
                    </div>
                </div>
            </div>

            <div className="space-y-6">
                 {/* Educational Insight Card */}
                 <div className="bg-slate-900/60 p-5 rounded-2xl border border-white/5 flex gap-4">
                     <div className="p-3 bg-purple-500/20 rounded-xl h-fit">
                         <Scaling className="text-purple-400" size={24} />
                     </div>
                     <div>
                         <h4 className="text-sm font-bold text-purple-300 uppercase tracking-wide mb-1">Geometric Meaning</h4>
                         <p className="text-sm text-slate-400 leading-relaxed">
                             When Matrix A acts on a vector, it usually rotates and stretches it. 
                             <strong className="text-white"> Eigenvectors</strong> are the special directions that <em>do not rotate</em>—they only get stretched by the factor <strong className="text-pink-400">λ</strong> (Eigenvalue).
                         </p>
                     </div>
                 </div>

                 <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="bg-slate-800/30 p-6 rounded-xl border border-slate-700"
                 >
                    <h3 className="text-cyan-400 font-bold mb-4 flex items-center gap-2">
                        <span className="w-2 h-2 bg-cyan-400 rounded-full"></span>
                        Characteristic Equation
                    </h3>
                    <div className="text-lg md:text-2xl font-mono text-white text-center bg-slate-900 p-4 rounded-lg border border-slate-800 shadow-inner break-all">
                        λ² {b >= 0 ? '+' : '-'} {Math.abs(b).toFixed(2)}λ {c >= 0 ? '+' : '-'} {Math.abs(c).toFixed(2)} = 0
                    </div>
                    <p className="text-xs text-slate-500 mt-4 text-center">Derived from: λ² - Tr(A)λ + det(A) = 0</p>
                 </motion.div>

                 <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-gradient-to-br from-pink-900/20 to-slate-900 p-6 rounded-xl border border-pink-500/30"
                 >
                    <h3 className="text-pink-400 font-bold mb-4 flex items-center gap-2">
                        <span className="w-2 h-2 bg-pink-400 rounded-full"></span>
                        Results (Roots)
                    </h3>
                    
                    {eigens ? (
                        <div className="flex justify-around items-center">
                            <div className="text-center">
                                <div className="text-sm text-pink-300/70 mb-1">λ₁</div>
                                <div className="text-4xl font-mono font-bold text-white">{fmt(eigens.l1)}</div>
                            </div>
                            <div className="h-12 w-px bg-white/10"></div>
                            <div className="text-center">
                                <div className="text-sm text-pink-300/70 mb-1">λ₂</div>
                                <div className="text-4xl font-mono font-bold text-white">{fmt(eigens.l2)}</div>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center text-slate-400 py-4">
                            Complex roots (Rotation without scaling on real axes).
                        </div>
                    )}
                 </motion.div>

                 <div className="bg-emerald-900/10 border border-emerald-500/20 p-4 rounded-lg">
                    <h4 className="text-emerald-400 text-sm font-bold mb-2">Stability Interpretation</h4>
                    <p className="text-sm text-slate-300">
                        {eigens && Math.abs(Math.max(Math.abs(eigens.l1), Math.abs(eigens.l2))) > 1 
                            ? "The dominant eigenvalue magnitude is > 1. The system is expanding and may become unstable."
                            : "The dominant eigenvalue magnitude is < 1. The system will decay towards zero or stabilize."}
                    </p>
                 </div>
            </div>

        </div>
    </div>
  );
};