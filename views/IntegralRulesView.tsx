
import React from 'react';
import { MathRenderer } from '../components/MathRenderer';
import { Variable, CheckCircle2 } from 'lucide-react';

const formulas = [
    {
        name: "Power Rule",
        latex: "\\int x^a dx = \\frac{1}{a+1}x^{a+1} + C",
        cond: "a \\neq -1",
        ex: "\\int x^2 dx = \\frac{x^3}{3} + C"
    },
    {
        name: "Constant Rule",
        latex: "\\int dx = x + C",
        cond: "",
        ex: "\\int 5 dx = 5x + C"
    },
    {
        name: "Reciprocal Rule",
        latex: "\\int \\frac{1}{x} dx = \\ln|x| + C",
        cond: "x \\neq 0",
        ex: ""
    },
    {
        name: "Exponential Rule",
        latex: "\\int e^x dx = e^x + C",
        cond: "",
        ex: ""
    },
    {
        name: "General Exponential",
        latex: "\\int a^x dx = \\frac{a^x}{\\ln a} + C",
        cond: "a > 0, a \\neq 1",
        ex: "\\int 2^x dx = \\frac{2^x}{\\ln 2} + C"
    },
    {
        name: "Root Rule",
        latex: "\\int \\frac{1}{\\sqrt{x}} dx = 2\\sqrt{x} + C",
        cond: "x > 0",
        ex: "\\text{Derived from } x^{-1/2}"
    }
];

const properties = [
    {
        name: "Sum/Difference",
        latex: "\\int (f(x) \\pm g(x)) dx = \\int f(x) dx \\pm \\int g(x) dx"
    },
    {
        name: "Constant Multiple",
        latex: "\\int k f(x) dx = k \\int f(x) dx"
    }
];

export const IntegralRulesView: React.FC = () => {
  return (
    <div className="space-y-8 pb-20">
        <header className="border-b border-white/10 pb-6">
            <h2 className="text-4xl font-bold text-white mb-2">Integration Rules</h2>
            <p className="text-slate-400">Essential formulas and properties for solving indefinite integrals.</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Properties */}
            <div className="md:col-span-2">
                <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <CheckCircle2 className="text-emerald-400" size={16} /> Properties
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {properties.map((prop, idx) => (
                        <div key={idx} className="bg-slate-900/50 border border-slate-700 rounded-xl p-4 flex flex-col justify-center">
                            <span className="text-xs text-slate-400 mb-2 font-bold">{prop.name}</span>
                            <MathRenderer expression={prop.latex} className="text-white text-lg" />
                        </div>
                    ))}
                </div>
            </div>

            {/* Formulas */}
            <div className="md:col-span-2">
                <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <Variable className="text-purple-400" size={16} /> Basic Formulas
                </h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {formulas.map((rule, idx) => (
                        <div key={idx} className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-5 hover:border-purple-500/30 transition-colors group">
                            <div className="flex justify-between items-start mb-3">
                                <h4 className="text-cyan-400 font-bold">{rule.name}</h4>
                                {rule.cond && <span className="text-[10px] bg-slate-900 text-slate-500 px-2 py-1 rounded border border-slate-800">{rule.cond}</span>}
                            </div>
                            <div className="bg-slate-900 rounded-lg p-3 text-center border border-slate-800 mb-3 group-hover:border-purple-500/20 transition-colors">
                                <MathRenderer expression={rule.latex} className="text-xl text-white" />
                            </div>
                            {rule.ex && (
                                <div className="text-xs text-slate-400 border-t border-white/5 pt-2 flex gap-2 items-center">
                                    <span className="opacity-50">Ex:</span>
                                    <MathRenderer expression={rule.ex} inline className="text-slate-300"/>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    </div>
  );
};
