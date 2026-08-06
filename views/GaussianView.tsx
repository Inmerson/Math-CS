import React, { useState, useEffect, useMemo } from 'react';
import { MatrixInput } from '../components/MatrixInput';
import { MatrixData } from '../types';
import { getSteps } from '../utils/gaussianSteps';
import { RotateCcw, Play, Pause, ChevronLeft, ChevronRight, Layers, ArrowDownUp, FastForward } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const GaussianView: React.FC = () => {
  const [matrix, setMatrix] = useState<MatrixData>([
      [0, 1, -1, 8],
      [-3, -1, 2, -11],
      [-2, 1, 2, -3]
  ]);

  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1500); // ms

  const steps = useMemo(() => getSteps(matrix), [matrix]);
  const currentStep = steps[currentStepIndex];

  useEffect(() => {
    let interval: any;
    if (isPlaying) {
        interval = setInterval(() => {
            setCurrentStepIndex(prev => {
                if (prev < steps.length - 1) return prev + 1;
                setIsPlaying(false);
                return prev;
            });
        }, playbackSpeed);
    }
    return () => clearInterval(interval);
  }, [isPlaying, steps.length, playbackSpeed]);

  const handleMatrixChange = (newData: MatrixData) => {
      setMatrix(newData);
      setCurrentStepIndex(0);
      setIsPlaying(false);
  };

  return (
    <div className="space-y-8 pb-20">
        <header className="border-b border-white/10 pb-6 flex justify-between items-end">
            <div>
                <h2 className="text-4xl font-black text-white mb-2 tracking-tight">Gaussian Elimination</h2>
                <p className="text-slate-400 font-light max-w-3xl text-base">
                    Algorithmic visualization of row reduction with <strong>Partial Pivoting</strong> strategy.
                </p>
            </div>
             <div className="bg-slate-900 px-3 py-1 rounded border border-slate-800 text-[10px] font-mono text-slate-500 uppercase tracking-widest">
                Algorithm: Gauss-Jordan
            </div>
        </header>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-12 items-start">
            
            {/* Input Side */}
            <div className="space-y-6">
                <div className="glass-panel p-8 rounded-3xl relative border-l-4 border-l-cyan-500">
                    <div className="absolute top-4 right-4 opacity-10"><Layers size={48}/></div>
                    <div className="mb-6">
                        <h3 className="text-lg font-bold text-white">Input System</h3>
                        <p className="text-xs text-slate-400">Edit the Augmented Matrix [A|b] below.</p>
                    </div>
                    <MatrixInput data={matrix} onChange={handleMatrixChange} editable color="blue" label=""/>
                </div>

                <div className="bg-slate-900/50 p-6 rounded-2xl border border-white/5 backdrop-blur-sm">
                    <h3 className="text-purple-400 font-bold mb-4 flex items-center gap-2 text-sm uppercase tracking-wider">
                         Step Logic
                    </h3>
                    <div className="relative pl-6 space-y-4 border-l border-slate-700">
                        <div className="relative">
                            <div className="absolute -left-[31px] top-1 w-2.5 h-2.5 rounded-full bg-cyan-500"></div>
                            <h4 className="text-white font-bold text-sm">1. Pivot Selection</h4>
                            <p className="text-xs text-slate-400 mt-1">Locate largest absolute value in current column to minimize error.</p>
                        </div>
                        <div className="relative">
                             <div className="absolute -left-[31px] top-1 w-2.5 h-2.5 rounded-full bg-purple-500"></div>
                            <h4 className="text-white font-bold text-sm">2. Row Swap</h4>
                            <p className="text-xs text-slate-400 mt-1">Move best pivot to diagonal position.</p>
                        </div>
                        <div className="relative">
                             <div className="absolute -left-[31px] top-1 w-2.5 h-2.5 rounded-full bg-orange-500"></div>
                            <h4 className="text-white font-bold text-sm">3. Elimination</h4>
                            <p className="text-xs text-slate-400 mt-1">Subtract multiples of pivot row to create zeros below.</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Playback Side */}
            <div className="space-y-6">
                
                {/* Main Visualizer */}
                <div className="glass-panel p-1 rounded-[32px] border-white/10 relative min-h-[420px] flex flex-col shadow-2xl bg-slate-900/40">
                    
                    {/* Header Bar */}
                    <div className="bg-slate-950/80 rounded-t-[30px] p-4 flex justify-between items-center border-b border-white/5">
                        <span className="text-xs font-mono text-cyan-400 font-bold uppercase tracking-widest flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"/>
                            Live Process
                        </span>
                        <span className="text-xs font-mono text-slate-500">
                            Step {currentStepIndex + 1} / {steps.length}
                        </span>
                    </div>

                    <div className="relative z-10 flex-1 flex flex-col items-center justify-center p-8 overflow-hidden">
                        <AnimatePresence mode='wait'>
                            <motion.div 
                                key={currentStepIndex}
                                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 1.05, y: -10 }}
                                className="scale-110"
                            >
                                <MatrixInput 
                                    data={currentStep.data.map(r => r.map(v => {
                                        const clean = parseFloat(v.toFixed(2)); // Round for display
                                        return Object.is(clean, -0) ? 0 : clean;
                                    }))} 
                                    color={currentStep.isSwap ? 'purple' : (currentStepIndex === steps.length - 1 ? 'green' : 'orange')} 
                                    highlightRow={currentStep.highlightRow}
                                    highlightCol={null}
                                />
                            </motion.div>
                        </AnimatePresence>

                        {/* Visual Indicators */}
                        {currentStep.pivotRow !== undefined && (
                             <div className="mt-10 flex gap-6 text-[10px] uppercase tracking-widest font-bold">
                                 <div className="flex items-center gap-2 text-cyan-400 bg-cyan-500/10 px-3 py-1.5 rounded-full border border-cyan-500/20">
                                     Pivot R{currentStep.pivotRow + 1}
                                 </div>
                                 <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border ${currentStep.isSwap ? 'text-purple-400 bg-purple-500/10 border-purple-500/20' : 'text-orange-400 bg-orange-500/10 border-orange-500/20'}`}>
                                     {currentStep.isSwap ? `Swap R${currentStep.highlightRow! + 1}` : `Target R${currentStep.highlightRow! + 1}`}
                                 </div>
                             </div>
                        )}
                    </div>
                </div>

                {/* Control Deck */}
                <div className="glass-panel p-6 rounded-3xl flex flex-col gap-5">
                    <div className="flex justify-between items-start">
                        <div>
                            <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-1">
                                {currentStep.isSwap && <ArrowDownUp size={18} className="text-purple-400"/>}
                                {currentStep.title}
                            </h3>
                            <p className="text-slate-400 text-sm">{currentStep.desc}</p>
                        </div>
                        {currentStep.formula && (
                            <div className="px-3 py-1.5 bg-slate-900 rounded-lg border border-slate-700 font-mono text-cyan-400 text-xs shadow-inner">
                                {currentStep.formula}
                            </div>
                        )}
                    </div>

                    <div className="flex items-center gap-3 pt-4 border-t border-white/5">
                         {/* Playback Controls */}
                         <button onClick={() => { setIsPlaying(false); setCurrentStepIndex(0); }} className="p-3 rounded-xl bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"><RotateCcw size={18} /></button>
                         <button onClick={() => { setIsPlaying(false); setCurrentStepIndex(p => Math.max(0, p - 1)); }} disabled={currentStepIndex===0} className="p-3 rounded-xl bg-slate-800 text-slate-200 hover:bg-slate-700 disabled:opacity-50 transition-colors"><ChevronLeft size={18} /></button>
                         
                         <button 
                            onClick={() => setIsPlaying(!isPlaying)}
                            className={`flex-1 py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg ${isPlaying ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/50' : 'bg-cyan-600 text-white hover:bg-cyan-500'}`}
                        >
                            {isPlaying ? <><Pause size={18}/> Pause</> : <><Play size={18} fill="currentColor"/> Auto-Play</>}
                        </button>

                         <button onClick={() => { setIsPlaying(false); setCurrentStepIndex(p => Math.min(steps.length-1, p + 1)); }} disabled={currentStepIndex===steps.length-1} className="p-3 rounded-xl bg-slate-800 text-slate-200 hover:bg-slate-700 disabled:opacity-50 transition-colors"><ChevronRight size={18} /></button>
                    </div>

                    {/* Speed Control */}
                    <div className="flex justify-center gap-4">
                        {[2000, 1000, 500].map((speed) => (
                            <button 
                                key={speed}
                                onClick={() => setPlaybackSpeed(speed)}
                                className={`text-[10px] uppercase font-bold px-3 py-1 rounded-full border transition-all ${playbackSpeed === speed ? 'bg-white text-black border-white' : 'bg-transparent text-slate-500 border-slate-700 hover:border-slate-500'}`}
                            >
                                {speed === 2000 ? '1x' : speed === 1000 ? '2x' : '4x'} Speed
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
};