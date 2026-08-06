import React, { useState } from 'react';
import { MatrixInput } from '../components/MatrixInput';
import { motion, AnimatePresence } from 'framer-motion';
import { Database, Scan, Box, Maximize, ArrowRightLeft, Target, Settings2, Info, BookOpen } from 'lucide-react';
import { WolframHelper } from '../components/WolframHelper';
import { MathRenderer } from '../components/MathRenderer';

export const BasicsView: React.FC = () => {
  const [rows, setRows] = useState(3);
  const [cols, setCols] = useState(3);
  const [hoveredRow, setHoveredRow] = useState<number | null>(null);
  const [hoveredCol, setHoveredCol] = useState<number | null>(null);
  const [hoveredCell, setHoveredCell] = useState<{r: number, c: number} | null>(null);

  // Demo matrix with sequential numbers
  const matrixData = Array(rows).fill(0).map((_, i) => 
    Array(cols).fill(0).map((_, j) => (i * cols) + j + 1)
  );

  // Dynamic Properties
  const isSquare = rows === cols;
  const isRowVector = rows === 1;
  const isColVector = cols === 1;
  const elementCount = rows * cols;

  const getEducationalContext = () => {
    if (hoveredCell) {
        const {r, c} = hoveredCell;
        const isDiagonal = r === c;
        return {
            title: `Element a_{${r+1}${c+1}}`,
            desc: `This element is located at Row ${r+1} and Column ${c+1}.`,
            math: `a_{${r+1},${c+1}} \\in \\mathbb{R}`,
            extra: isDiagonal ? "This element lies on the Main Diagonal (i=j)." : "Off-diagonal element (i≠j)."
        };
    }
    if (isSquare) return {
        title: "Square Matrix",
        desc: "A matrix with equal number of rows and columns (n = m). Only square matrices have determinants, eigenvalues, and inverses.",
        math: "A \\in \\mathbb{R}^{n \\times n}"
    };
    if (isRowVector) return {
        title: "Row Vector",
        desc: "A matrix with a single row. Often represents a coordinate or a linear equation.",
        math: "v \\in \\mathbb{R}^{1 \\times m}"
    };
    if (isColVector) return {
        title: "Column Vector",
        desc: "A matrix with a single column. Standard representation for vectors in linear systems Ax=b.",
        math: "v \\in \\mathbb{R}^{n \\times 1}"
    };
    return {
        title: "Rectangular Matrix",
        desc: "A general system of numbers where rows ≠ columns. It represents a linear transformation between spaces of different dimensions.",
        math: "A \\in \\mathbb{R}^{n \\times m}"
    };
  };

  const eduContent = getEducationalContext();

  return (
    <div className="space-y-6 pb-20">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end border-b border-white/5 pb-4 gap-4">
        <div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-2 tracking-tight">Matrix Anatomy</h2>
            <p className="text-slate-400 max-w-2xl font-light text-sm md:text-base">
                Understanding the structural properties of linear arrays. 
                Indices <span className="font-mono text-cyan-400">i</span> (row) and <span className="font-mono text-purple-400">j</span> (column) define the address of every element.
            </p>
        </div>
      </header>

      {/* Main Layout */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        
        {/* Left: Controls & Structure */}
        <div className="md:col-span-4 space-y-6">
            {/* Dimension Controller */}
            <div className="glass-panel p-6 rounded-3xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                    <Settings2 size={80} />
                </div>
                
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                    <Box size={14} className="text-cyan-400"/> Dimensions Setup
                </h3>
                
                <div className="space-y-6 z-10 relative">
                    <div className="space-y-2">
                        <div className="flex justify-between items-end">
                            <label className="text-[10px] text-slate-300 font-bold uppercase tracking-wider flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-cyan-500"></div> Rows (i)
                            </label>
                            <span className="text-xl font-mono text-cyan-400 font-bold">{rows}</span>
                        </div>
                        <input 
                            type="range" min="1" max="6" value={rows} 
                            onChange={(e) => setRows(parseInt(e.target.value))}
                            className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-500 hover:accent-cyan-400 transition-all"
                        />
                    </div>
                    <div className="space-y-2">
                        <div className="flex justify-between items-end">
                            <label className="text-[10px] text-slate-300 font-bold uppercase tracking-wider flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-purple-500"></div> Columns (j)
                            </label>
                            <span className="text-xl font-mono text-purple-400 font-bold">{cols}</span>
                        </div>
                        <input 
                            type="range" min="1" max="6" value={cols} 
                            onChange={(e) => setCols(parseInt(e.target.value))}
                            className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-purple-500 hover:accent-purple-400 transition-all"
                        />
                    </div>
                </div>
            </div>

            {/* Educational Context Card */}
            <motion.div 
                layout
                className="glass-panel p-6 rounded-3xl border-l-2 border-l-emerald-500 bg-slate-900/60"
            >
                <div className="flex items-center gap-2 mb-3">
                    <BookOpen size={16} className="text-emerald-400" />
                    <h3 className="text-xs font-bold text-emerald-400 uppercase tracking-widest">Concept Guide</h3>
                </div>
                <h4 className="text-lg font-bold text-white mb-2">{eduContent.title}</h4>
                <div className="mb-4 bg-slate-950/50 p-3 rounded-lg border border-white/5">
                    <MathRenderer expression={eduContent.math} className="text-lg text-center" color="#fbbf24" />
                </div>
                <p className="text-sm text-slate-400 leading-relaxed font-light">
                    {eduContent.desc}
                </p>
                {eduContent.extra && (
                    <div className="mt-3 text-xs text-emerald-300/80 italic border-t border-emerald-500/10 pt-2">
                        {eduContent.extra}
                    </div>
                )}
            </motion.div>
        </div>

        {/* Right: Visualization */}
        <div className="md:col-span-8 flex flex-col gap-6">
            {/* Visualizer */}
            <div className="glass-panel p-0 rounded-3xl relative flex flex-col items-center justify-center min-h-[400px] bg-slate-900/40">
                {/* Background Grid */}
                <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
                
                {/* Index Indicators */}
                <div className="absolute top-4 left-4 flex gap-4 text-[10px] font-mono uppercase tracking-widest opacity-60">
                    <div className="flex items-center gap-1 text-cyan-400"><div className="w-3 h-0.5 bg-cyan-400"></div> Row Index</div>
                    <div className="flex items-center gap-1 text-purple-400"><div className="h-3 w-0.5 bg-purple-400"></div> Col Index</div>
                </div>

                <div className="relative z-10 w-full overflow-x-auto flex flex-col items-center justify-center py-8 px-4"
                     onMouseLeave={() => setHoveredCell(null)}>
                    <MatrixInput 
                        data={matrixData} 
                        label={`Matrix A [${rows}×${cols}]`} 
                        color="orange" 
                        highlightRow={hoveredRow}
                        highlightCol={hoveredCol}
                    />
                    
                    {/* Hover Overlay triggers */}
                    <div className="absolute inset-0 grid gap-2 pointer-events-none" 
                         style={{ 
                             gridTemplateColumns: `repeat(${cols}, minmax(min-content, 1fr))`,
                             width: 'fit-content',
                             margin: 'auto'
                         }}>
                         {/* We don't render interactive layer here to avoid complex overlay logic with Framer Motion layout, 
                             instead relying on the MatrixInput hover effects or enhancing MatrixInput itself would be better, 
                             but for this "Concept" focus, we use the bottom HUD mainly. 
                             
                             However, let's simulate cell hover detection for the educational card.
                          */}
                    </div>
                </div>
                
                {/* Bottom HUD - Dynamic Inspection */}
                <div className="absolute bottom-6 left-6 right-6">
                    <div className="bg-slate-950/90 backdrop-blur-xl rounded-2xl border border-white/10 p-4 flex justify-between items-center shadow-2xl">
                        {hoveredRow !== null ? (
                            <div className="flex items-center gap-4">
                                <div className="p-2 bg-cyan-500/10 rounded-lg text-cyan-400"><ArrowRightLeft size={18}/></div>
                                <div>
                                    <div className="text-[10px] font-bold uppercase text-cyan-500 tracking-wider">Row Scan</div>
                                    <div className="text-white text-sm">Inspecting Row <span className="font-mono text-cyan-400">{hoveredRow + 1}</span> (index i={hoveredRow+1})</div>
                                </div>
                            </div>
                        ) : hoveredCol !== null ? (
                            <div className="flex items-center gap-4">
                                <div className="p-2 bg-purple-500/10 rounded-lg text-purple-400"><Maximize size={18} className="rotate-90"/></div>
                                <div>
                                    <div className="text-[10px] font-bold uppercase text-purple-500 tracking-wider">Column Scan</div>
                                    <div className="text-white text-sm">Inspecting Column <span className="font-mono text-purple-400">{hoveredCol + 1}</span> (index j={hoveredCol+1})</div>
                                </div>
                            </div>
                        ) : (
                            <div className="flex items-center gap-4 opacity-50">
                                <div className="p-2 bg-slate-800 rounded-lg text-slate-400"><Target size={18}/></div>
                                <div>
                                    <div className="text-[10px] font-bold uppercase text-slate-500 tracking-wider">Inspector Ready</div>
                                    <div className="text-slate-400 text-sm">Hover over controls to analyze structure</div>
                                </div>
                            </div>
                        )}

                        <div className="hidden sm:flex items-center gap-6 text-[10px] font-mono text-slate-500 uppercase tracking-widest border-l border-white/10 pl-6">
                             <div>
                                <span className="block text-slate-600 mb-0.5">Total Elements</span>
                                <span className="text-white text-lg">{elementCount}</span>
                             </div>
                             <div>
                                <span className="block text-slate-600 mb-0.5">Shape</span>
                                <span className={`text-lg ${isSquare ? 'text-emerald-400' : 'text-slate-300'}`}>{isSquare ? 'Square' : 'Rect'}</span>
                             </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-2 gap-4">
                <button 
                    onMouseEnter={() => setHoveredRow(1)} 
                    onMouseLeave={() => setHoveredRow(null)}
                    className="p-4 bg-slate-800/40 hover:bg-slate-800 rounded-2xl border border-slate-700/50 hover:border-cyan-500/50 transition-all group flex items-start gap-3"
                >
                    <div className="mt-1"><ArrowRightLeft size={16} className="text-cyan-500"/></div>
                    <div className="text-left">
                        <div className="text-xs font-bold text-white mb-1 group-hover:text-cyan-400">Scan Rows</div>
                        <p className="text-[10px] text-slate-400 leading-snug">Rows represent individual equations in linear systems.</p>
                    </div>
                </button>
                <button 
                    onMouseEnter={() => setHoveredCol(1)} 
                    onMouseLeave={() => setHoveredCol(null)}
                    className="p-4 bg-slate-800/40 hover:bg-slate-800 rounded-2xl border border-slate-700/50 hover:border-purple-500/50 transition-all group flex items-start gap-3"
                >
                    <div className="mt-1"><Maximize size={16} className="text-purple-500 rotate-90"/></div>
                    <div className="text-left">
                        <div className="text-xs font-bold text-white mb-1 group-hover:text-purple-400">Scan Columns</div>
                        <p className="text-[10px] text-slate-400 leading-snug">Columns often represent variable coefficients (x, y, z).</p>
                    </div>
                </button>
            </div>
        </div>

      </div>

      <WolframHelper context="matrix_basics" />
    </div>
  );
};