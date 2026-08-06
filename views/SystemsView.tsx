
import React, { useState, useMemo } from 'react';
import { MatrixInput } from '../components/MatrixInput';
import { MatrixData } from '../types';
import { createMatrix, getDeterminant, replaceColumn, fmt } from '../utils/matrixMath';
import { Database, ArrowRight, AlertTriangle, CheckCircle2, Layers, BookOpen, Calculator, Scan } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { WolframHelper } from '../components/WolframHelper';
import { MathRenderer } from '../components/MathRenderer';

interface Concept {
    id: string;
    title: string;
    icon: any;
    desc: string;
    math: string;
    anatomy: { term: string, meaning: string, color: string }[];
}

const concepts: Concept[] = [
    {
        id: 'system',
        title: 'System Matrix Form',
        icon: Database,
        desc: "Any system of linear equations can be expressed as a single matrix equation AX = B. This encapsulates the entire problem into a compact geometric form.",
        math: "A \\cdot \\mathbf{x} = \\mathbf{b}",
        anatomy: [
            { term: "A", meaning: "Coefficient Matrix (nxn)", color: "text-blue-400" },
            { term: "\\mathbf{x}", meaning: "Vector of Variables", color: "text-purple-400" },
            { term: "\\mathbf{b}", meaning: "Constant Vector", color: "text-orange-400" }
        ]
    },
    {
        id: 'determinant',
        title: 'The Determinant (W)',
        icon: Scan,
        desc: "The 'Main Determinant' W determines if the system has a unique solution. Geometrically, it measures how the matrix A scales volume.",
        math: "W = \\det(A) \\neq 0",
        anatomy: [
            { term: "W", meaning: "Main Determinant", color: "text-emerald-400" },
            { term: "\\neq 0", meaning: "Condition for Uniqueness", color: "text-red-400" }
        ]
    },
    {
        id: 'cramer',
        title: "Cramer's Formula",
        icon: Calculator,
        desc: "A direct method to solve for each variable individually by replacing columns in the main matrix with the constant vector B.",
        math: "x_i = \\frac{W_i}{W} = \\frac{\\det(A_i)}{\\det(A)}",
        anatomy: [
            { term: "x_i", meaning: "i-th Variable (x, y, z...)", color: "text-white" },
            { term: "W_i", meaning: "Det after replacing col i with b", color: "text-cyan-400" },
            { term: "W", meaning: "Original Determinant", color: "text-slate-400" }
        ]
    }
];

export const SystemsView: React.FC = () => {
  const [activeConcept, setActiveConcept] = useState(concepts[0]);
  const [dim, setDim] = useState(3);
  const [matrixA, setMatrixA] = useState<MatrixData>([[1, -2, 1],[0, 2, -8],[-4, 5, 9]]);
  const [matrixB, setMatrixB] = useState<MatrixData>([[0],[8],[-9]]);

  const resize = (n: number) => {
      setDim(n);
      setMatrixA(createMatrix(n, n, 1));
      setMatrixB(createMatrix(n, 1, 1));
  };

  const { detA, cramerResults, solutionStatus } = useMemo(() => {
      const det = getDeterminant(matrixA);
      const b = matrixB.map(r => r[0]);
      const results = [];
      let status = "UNIQUE";

      if (det !== null) {
          if (Math.abs(det) < 0.00001) {
              let allZero = true;
              for(let i=0; i<dim; i++) {
                  const matAi = replaceColumn(matrixA, i, b);
                  if (Math.abs(getDeterminant(matAi) || 0) > 0.0001) allZero = false;
              }
              status = allZero ? "INFINITE" : "INCONSISTENT";
          } else {
              for(let i=0; i<dim; i++) {
                  const matAi = replaceColumn(matrixA, i, b);
                  const detAi = getDeterminant(matAi);
                  results.push({
                      var: i === 0 ? 'x' : i === 1 ? 'y' : 'z',
                      matrix: matAi,
                      det: detAi,
                      val: (detAi || 0) / det
                  });
              }
          }
      }
      return { detA: det, bVector: b, cramerResults: results, solutionStatus: status };
  }, [matrixA, matrixB, dim]);

  return (
    <div className="space-y-8 pb-20">
        <header className="border-b border-white/10 pb-6 flex flex-col md:flex-row justify-between items-end gap-4">
            <div>
                <h2 className="text-4xl font-bold text-white mb-2 tracking-tight">Linear Systems Theory</h2>
                <p className="text-slate-400 max-w-2xl font-light">
                    Mastering <span className="font-mono text-cyan-400">AX = B</span> via Cramer's Rule. Understand the geometry of linear intersections.
                </p>
            </div>
             <div className="bg-slate-900 p-1 rounded-xl border border-slate-800 flex gap-1">
                 <button onClick={() => resize(2)} className={`px-4 py-2 text-xs font-bold uppercase rounded-lg transition-all ${dim===2 ? 'bg-cyan-600 text-white' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}>2 Vars</button>
                 <button onClick={() => resize(3)} className={`px-4 py-2 text-xs font-bold uppercase rounded-lg transition-all ${dim===3 ? 'bg-cyan-600 text-white' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}>3 Vars</button>
            </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left: Concept Selector */}
            <div className="lg:col-span-4 space-y-4">
                 {concepts.map((concept) => (
                     <button
                        key={concept.id}
                        onClick={() => setActiveConcept(concept)}
                        className={`w-full text-left p-4 rounded-xl border transition-all duration-300 group relative overflow-hidden
                            ${activeConcept.id === concept.id 
                                ? 'bg-slate-800 border-cyan-500/50 shadow-lg shadow-cyan-900/20' 
                                : 'bg-slate-900/40 border-slate-700 hover:bg-slate-800 hover:border-slate-600'}
                        `}
                     >
                        {activeConcept.id === concept.id && (
                            <motion.div layoutId="activeConceptGlow" className="absolute inset-0 bg-cyan-500/5" />
                        )}
                        <div className="relative z-10 flex items-center gap-4">
                            <div className={`p-2 rounded-lg ${activeConcept.id === concept.id ? 'bg-cyan-500 text-white' : 'bg-slate-800 text-slate-500'}`}>
                                <concept.icon size={20} />
                            </div>
                            <div>
                                <span className={`text-[10px] font-bold uppercase tracking-widest mb-0.5 block ${activeConcept.id === concept.id ? 'text-cyan-400' : 'text-slate-500'}`}>
                                    Concept 0{concepts.indexOf(concept) + 1}
                                </span>
                                <h3 className={`font-bold text-sm ${activeConcept.id === concept.id ? 'text-white' : 'text-slate-300'}`}>
                                    {concept.title}
                                </h3>
                            </div>
                        </div>
                     </button>
                 ))}
            </div>

            {/* Right: Master Detail */}
            <div className="lg:col-span-8">
                <AnimatePresence mode='wait'>
                    <motion.div
                        key={activeConcept.id}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                        className="glass-panel p-8 rounded-[32px] border-l-4 border-l-cyan-500 relative overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-5 pointer-events-none"></div>

                        {/* Concept Header */}
                        <div className="flex flex-col md:flex-row gap-8 mb-8">
                             <div className="flex-1">
                                 <h3 className="text-xl font-bold text-white mb-2">{activeConcept.title}</h3>
                                 <p className="text-slate-400 text-sm leading-relaxed">{activeConcept.desc}</p>
                             </div>
                             <div className="bg-slate-950/80 p-4 rounded-xl border border-white/5 min-w-[200px] flex flex-col items-center justify-center">
                                  <MathRenderer expression={activeConcept.math} className="text-xl text-cyan-200" />
                             </div>
                        </div>

                        {/* Anatomy */}
                        <div className="mb-8 bg-slate-900/50 p-5 rounded-2xl border border-slate-800">
                             <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                                <BookOpen size={14}/> Formula Anatomy
                             </h4>
                             <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                 {activeConcept.anatomy.map((item, idx) => (
                                     <div key={idx} className="flex items-center gap-3">
                                         <div className={`font-mono font-bold text-sm ${item.color}`}>
                                             <MathRenderer expression={item.term} inline />
                                         </div>
                                         <p className="text-xs text-slate-400 leading-snug border-l border-slate-700 pl-2">{item.meaning}</p>
                                     </div>
                                 ))}
                             </div>
                        </div>

                        {/* Interactive Lab */}
                        <div className="bg-slate-900/40 rounded-2xl border border-white/5 p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h4 className="text-xs font-bold text-cyan-400 uppercase tracking-widest flex items-center gap-2">
                                    <Layers size={16}/> Interactive System Lab
                                </h4>
                                <div className={`px-2 py-1 rounded text-[10px] font-bold uppercase border ${solutionStatus === 'UNIQUE' ? 'border-emerald-500/30 text-emerald-400 bg-emerald-500/10' : 'border-pink-500/30 text-pink-400 bg-pink-500/10'}`}>
                                    Status: {solutionStatus}
                                </div>
                            </div>
                            
                            <div className="flex flex-col xl:flex-row gap-8 items-start">
                                {/* Matrix Inputs */}
                                <div className="flex items-center gap-4 overflow-x-auto pb-2">
                                    <div className="space-y-1 text-center">
                                        <div className="text-[9px] text-slate-500 font-bold uppercase">A</div>
                                        <MatrixInput data={matrixA} onChange={setMatrixA} editable color="blue" />
                                    </div>
                                    <div className="text-2xl text-slate-600 font-light">×</div>
                                    <div className="space-y-1 text-center">
                                        <div className="text-[9px] text-slate-500 font-bold uppercase">X</div>
                                        <div className="flex flex-col gap-2 p-2 border border-slate-700 rounded-lg bg-slate-900/50">
                                            {['x','y','z'].slice(0,dim).map(v => <div key={v} className="w-8 py-1 text-center text-slate-400 italic font-serif">{v}</div>)}
                                        </div>
                                    </div>
                                    <div className="text-2xl text-slate-600 font-light">=</div>
                                    <div className="space-y-1 text-center">
                                        <div className="text-[9px] text-slate-500 font-bold uppercase">B</div>
                                        <MatrixInput data={matrixB} onChange={setMatrixB} editable color="orange" />
                                    </div>
                                </div>

                                {/* Dynamic Results based on Concept */}
                                <div className="flex-1 w-full bg-slate-950 p-4 rounded-xl border border-slate-800">
                                    {activeConcept.id === 'system' && (
                                        <div className="text-center text-slate-400 text-sm py-4">
                                            Input the coefficients (A) and constants (B) to define your system.
                                        </div>
                                    )}
                                    {activeConcept.id === 'determinant' && (
                                        <div className="text-center">
                                            <div className="text-xs text-slate-500 uppercase mb-2">Main Determinant (W)</div>
                                            <div className={`text-4xl font-mono font-bold ${detA === 0 ? 'text-pink-500' : 'text-emerald-400'}`}>
                                                {detA !== null ? fmt(detA) : '-'}
                                            </div>
                                            <div className="mt-2 text-xs text-slate-500">
                                                {detA === 0 ? "System is Singular (No unique solution)" : "System is Non-Singular (Unique solution exists)"}
                                            </div>
                                        </div>
                                    )}
                                    {activeConcept.id === 'cramer' && solutionStatus === 'UNIQUE' && (
                                        <div className="space-y-3">
                                            {cramerResults.map((res, i) => (
                                                <div key={i} className="flex justify-between items-center bg-slate-900 p-2 rounded border border-slate-800">
                                                    <div className="flex items-center gap-2">
                                                        <span className="font-serif italic text-white font-bold">{res.var}</span>
                                                        <span className="text-slate-500 text-xs">=</span>
                                                        <span className="font-mono text-cyan-400 text-xs">W_{res.var}/W</span>
                                                    </div>
                                                    <div className="font-mono text-sm text-white">
                                                        {fmt(res.det||0)} / {fmt(detA||0)} = <span className="font-bold text-cyan-400">{fmt(res.val)}</span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
        <WolframHelper context="systems" />
    </div>
  );
};