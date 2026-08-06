
import React, { useState } from 'react';
import { ExternalLink, Calculator, Terminal, Copy, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

type WolframContext = 
  | 'matrix_basics' 
  | 'matrix_ops' 
  | 'determinant' 
  | 'inverse' 
  | 'systems' 
  | 'sequences' 
  | 'functions' 
  | 'limits' 
  | 'derivatives' 
  | 'analysis'
  | 'gaussian'
  | 'eigen';

interface WolframHelperProps {
  context: WolframContext;
}

export const WolframHelper: React.FC<WolframHelperProps> = ({ context }) => {
  const [customQuery, setCustomQuery] = useState('');

  // Data extracted directly from PDF Screenshots (Page 11 Matrix, Page 9 Sequences)
  const tipsMap: Record<WolframContext, { title: string, syntax: string, examples: string[] }> = {
    matrix_basics: {
      title: 'Matrix Definitions',
      syntax: 'Use curly braces {{...}} for rows.',
      examples: [
        '{{1, 2, 3}, {4, 5, 6}}',
        'identity matrix of size 4',
        'diagonal matrix {1, 2, 3}'
      ]
    },
    matrix_ops: {
      title: 'Matrix Operations (PDF Pg 11)',
      syntax: 'Use + for add, * for mult, ^ for power.',
      examples: [
        '{{1,0},{3,5}} + {{1,3},{7,5}}',
        '{{1,0,2},{3,5,1}} * {{1,3},{7,5},{0,2}}',
        '{{1,0},{3,5}}^3',
        'transpose {{1, 0, 2}, {3, 5, 1}}'
      ]
    },
    determinant: {
      title: 'Determinant Calculation',
      syntax: 'Use det(...) or determinant(...)',
      examples: [
        'det {{1, 0}, {3, 5}}',
        'determinant {{5, 3, -1}, {2, 0, 4}, {-3, 6, 2}}',
        'trace {{4, 1}, {2, 3}}'
      ]
    },
    inverse: {
      title: 'Inverse Matrix',
      syntax: 'Use inverse(...) or inv(...)',
      examples: [
        'inverse {{1, 0}, {3, 5}}',
        'inv {{2, 7, 3}, {3, 9, 4}, {1, 5, 3}}',
        '{{1, 2}, {3, 4}}^-1'
      ]
    },
    systems: {
      title: 'System Solver',
      syntax: 'List equations separated by comma',
      examples: [
        'solve x - 4y + 5z = 2, 2y - z = 1, 4x + 2y + z = 0',
        '{{1, -4, 5}, {0, 2, -1}, {4, 2, 1}} . {x, y, z} = {2, 1, 0}'
      ]
    },
    sequences: {
      title: 'Sequence Analysis (PDF Pg 9)',
      syntax: 'Use limit... or discreteplot...',
      examples: [
        'limit (4*n^2+5*n-7)^0.5 - 2*n as n->infinity',
        'limit (1 + 1/n)^n as n->infinity',
        'discreteplot (4*n^2+5*n-7)^0.5 - 2*n, {n, 1, 50}',
        'Sum[1/n^2, {n, 1, infinity}]'
      ]
    },
    functions: {
      title: 'Function Analysis',
      syntax: 'plot ... or domain of ...',
      examples: [
        'plot (x-1)/(x^2-4)',
        'domain of 2*sqrt(1-x^2)',
        'range of x^2 - 1',
        'asymptotes of (x-1)/(x^2-4)'
      ]
    },
    limits: {
      title: 'Limits & Continuity',
      syntax: 'limit f(x) as x->c',
      examples: [
        'limit (27-x^3)/(x-3) as x->3',
        'limit x/ln(x) as x->0+',
        'limit (1+1/x)^x as x->infinity'
      ]
    },
    derivatives: {
      title: 'Differentiation',
      syntax: 'derivative of ... or d/dx ...',
      examples: [
        'derivative of (x^2-3)e^x',
        'd/dx x^2 * ln(x)',
        'second derivative of sin(x)'
      ]
    },
    analysis: {
      title: 'Extrema & Monotonicity',
      syntax: 'extrema of ... or maximize ...',
      examples: [
        'extrema of x^3 + 3x^2 - 9x - 2',
        'inflection points of x^3 + 3x^2 - 9x - 2',
        'stationary points of (x^2-3)e^x'
      ]
    },
    gaussian: {
      title: 'Row Reduction',
      syntax: 'row reduce ... or rref ...',
      examples: [
        'row reduce {{2, 1, -1}, {-3, -1, 2}, {-2, 1, 2}}',
        'rref {{2, 1, -1, 8}, {-3, -1, 2, -11}}'
      ]
    },
    eigen: {
        title: 'Eigenvalues',
        syntax: 'eigenvalues ...',
        examples: [
            'eigenvalues {{4, 1}, {2, 3}}',
            'eigenvectors {{4, 1}, {2, 3}}',
            'characteristic polynomial {{4, 1}, {2, 3}}'
        ]
    }
  };

  const data = tipsMap[context];

  const handleCompute = (query: string) => {
    const encoded = encodeURIComponent(query);
    window.open(`https://www.wolframalpha.com/input?i=${encoded}`, '_blank');
  };

  return (
    <div className="mt-12 border-t border-orange-500/30 pt-8">
      <div className="bg-slate-900/80 rounded-2xl border border-orange-500/20 overflow-hidden">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-600/20 to-slate-900 p-4 flex items-center justify-between border-b border-orange-500/20">
          <div className="flex items-center gap-3">
             <div className="p-2 bg-orange-500/20 rounded-lg text-orange-500">
                <Calculator size={20} />
             </div>
             <div>
               <h3 className="text-white font-bold flex items-center gap-2">
                 WolframAlpha Integration
                 <span className="px-2 py-0.5 rounded-full bg-orange-500 text-slate-900 text-[10px] font-bold uppercase tracking-wider">Pro Tools</span>
               </h3>
               <p className="text-xs text-orange-300/70">Computation Engine & Syntax Helper</p>
             </div>
          </div>
          <ExternalLink size={18} className="text-orange-500/50" />
        </div>

        <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-8">
           
           {/* Input Area */}
           <div className="space-y-4">
              <div className="relative">
                 <div className="absolute left-3 top-3 text-slate-500">
                    <Terminal size={18} />
                 </div>
                 <input 
                    type="text" 
                    value={customQuery}
                    onChange={(e) => setCustomQuery(e.target.value)}
                    placeholder="Enter mathematical query..."
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl py-3 pl-10 pr-4 text-white focus:border-orange-500 outline-none font-mono text-sm"
                    onKeyDown={(e) => e.key === 'Enter' && handleCompute(customQuery)}
                 />
              </div>
              <button 
                onClick={() => handleCompute(customQuery)}
                disabled={!customQuery}
                className="w-full py-3 bg-orange-600 hover:bg-orange-500 disabled:opacity-50 disabled:hover:bg-orange-600 text-white font-bold rounded-xl transition-colors flex items-center justify-center gap-2"
              >
                <Calculator size={16} /> Compute on WolframAlpha
              </button>
              <p className="text-[10px] text-slate-500 text-center">
                Opens in a new tab. Requires internet connection.
              </p>
           </div>

           {/* Tips Area */}
           <div className="bg-slate-950/50 rounded-xl border border-slate-800 p-4">
              <h4 className="text-xs font-bold text-orange-400 uppercase tracking-widest mb-1">{data.title}</h4>
              <p className="text-xs text-slate-400 mb-4 font-mono">{data.syntax}</p>
              
              <div className="space-y-2">
                 {data.examples.map((ex, i) => (
                   <button
                     key={i}
                     onClick={() => handleCompute(ex)}
                     className="w-full text-left group flex items-center justify-between p-2 rounded-lg hover:bg-slate-800 transition-colors border border-transparent hover:border-slate-700"
                   >
                      <code className="text-xs text-slate-300 font-mono truncate">{ex}</code>
                      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                         <ChevronRight size={14} className="text-orange-500" />
                      </div>
                   </button>
                 ))}
              </div>
           </div>

        </div>
      </div>
    </div>
  );
};
