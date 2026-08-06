
import React, { useState, useMemo } from 'react';
import { ModuleType } from '../types';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, ChevronRight, RefreshCcw, Brain, ArrowRight, BookOpen, AlertTriangle, Trophy, BarChart2, Timer, Lock, Clock, Layers, Star, Zap, Activity, ArrowLeft } from 'lucide-react';
import { Canvas } from '@react-three/fiber';
import { Float, Stars, Icosahedron } from '@react-three/drei';
import { MathRenderer } from '../components/MathRenderer';
import { questionBank, examTopics, Question } from '../data/examQuestions';
import { saveQuestionResult, getExamPerformance, getQuestionStatus } from '../utils/examStorage';

// --- 3D Result Component ---
const ResultScene: React.FC<{ score: number, total: number }> = ({ score, total }) => {
    const percentage = total > 0 ? Math.round((score / total) * 100) : 0;
    const color = percentage >= 80 ? "#10b981" : percentage >= 50 ? "#fbbf24" : "#ef4444";
    
    return (
        <div className="h-64 w-full rounded-2xl overflow-hidden bg-slate-900 border border-slate-700 relative shadow-2xl">
            <Canvas camera={{ position: [0, 0, 5] }}>
                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} intensity={1} color={color} />
                <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
                    <group>
                        <Icosahedron args={[1.2, 0]} position={[0, 0, 0]}>
                            <meshStandardMaterial color={color} wireframe />
                        </Icosahedron>
                        <Icosahedron args={[1.0, 0]} position={[0, 0, 0]}>
                            <meshStandardMaterial color={color} transparent opacity={0.2} />
                        </Icosahedron>
                    </group>
                </Float>
                <Stars radius={50} count={1000} factor={4} fade speed={1} />
            </Canvas>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <div className="text-6xl font-black text-white drop-shadow-lg tracking-tighter">
                    {percentage}%
                </div>
                <div className="text-sm font-mono text-slate-300 bg-slate-900/50 px-3 py-1 rounded-full border border-white/10 backdrop-blur-md mt-2">
                    {score} / {total} Correct
                </div>
            </div>
        </div>
    );
};

// --- Main View ---

export const FinalExamView: React.FC<{ module?: ModuleType, examMode?: string }> = ({ module, examMode }) => {
    const [mode, setMode] = useState<'MENU' | 'PLAY' | 'RESULT'>('MENU');
    const [selectedTopicName, setSelectedTopicName] = useState("Full Exam");
    const [activeQuestions, setActiveQuestions] = useState<Question[]>([]);
    
    const [currentQIndex, setCurrentQIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [selectedOption, setSelectedOption] = useState<string | null>(null);
    const [isAnswered, setIsAnswered] = useState(false);
    const [mistakes, setMistakes] = useState<number[]>([]);
    
    // Statistics State
    const [startTime, setStartTime] = useState(0);
    const [endTime, setEndTime] = useState(0);

    // Dynamic Mistake Calculation
    const mistakeQuestions = useMemo(() => {
        const perf = getExamPerformance();
        const allQuestions: Question[] = [];
        Object.values(questionBank).forEach(qs => {
            if (qs) allQuestions.push(...qs);
        });
        
        return allQuestions.filter(q => {
            const stats = perf[q.id];
            if (!stats) return false;
            const status = getQuestionStatus(stats);
            // Include if strictly has errors and not yet mastered
            return stats.incorrect > 0 && status !== 'MASTERED';
        });
    }, [mode]); // Re-calculate when returning to menu

    const startExam = (topicId: ModuleType | 'ALL' | 'MISTAKES') => {
        let questions: Question[] = [];
        const now = Date.now();
        setStartTime(now);
        setEndTime(0);

        if (topicId === 'MISTAKES') {
             questions = [...mistakeQuestions].sort(() => Math.random() - 0.5);
             if (questions.length === 0) return; // Guard
             setSelectedTopicName("Mistake Clinic");
        } else if (topicId === 'ALL') {
            // Flatten all questions and inject topic
            Object.entries(questionBank).forEach(([mod, qs]) => {
                if (qs) {
                    const qsWithTopic = qs.map(q => ({ ...q, topic: mod as ModuleType }));
                    questions = [...questions, ...qsWithTopic];
                }
            });
            // Shuffle
            questions = questions.sort(() => Math.random() - 0.5);
            setSelectedTopicName("Full Exam");
        } else {
            const qs = questionBank[topicId] || [];
            // Inject topic
            questions = qs.map(q => ({ ...q, topic: topicId }));
            questions = [...questions].sort(() => Math.random() - 0.5);
            
            const topicLabel = examTopics.find(t => t.id === topicId)?.label || "Topic";
            setSelectedTopicName(`${topicLabel} Exam`);
        }

        if (questions.length === 0) {
            console.log("No questions available in this module yet.");
            return;
        }

        setActiveQuestions(questions);
        setScore(0);
        setCurrentQIndex(0);
        setMistakes([]);
        setSelectedOption(null);
        setIsAnswered(false);
        setMode('PLAY');
    };

    const handleAnswer = (key: string) => {
        if (isAnswered) return;
        
        setSelectedOption(key);
        setIsAnswered(true);
        
        const currentQ = activeQuestions[currentQIndex];
        const isCorrect = key === currentQ.correct;
        
        if (isCorrect) {
            setScore(s => s + 1);
        } else {
            setMistakes(m => [...m, currentQ.id]);
        }

        // Save result to persistent storage for analysis
        saveQuestionResult(currentQ.id, isCorrect);
    };

    const handleNext = () => {
        if (currentQIndex < activeQuestions.length - 1) {
            setCurrentQIndex(prev => prev + 1);
            setIsAnswered(false);
            setSelectedOption(null);
        } else {
            setEndTime(Date.now());
            setMode('RESULT');
        }
    };

    // Calculate progress
    const progress = activeQuestions.length > 0 ? ((currentQIndex + (isAnswered ? 1 : 0)) / activeQuestions.length) * 100 : 0;
    const currentQ = activeQuestions[currentQIndex];
    const correctCount = score;
    const wrongCount = mistakes.length;

    const renderMixedText = (text: string) => {
        if (!text) return null;
        const parts = text.split('$');
        return (
            <span className="inline-block">
                {parts.map((part, i) => {
                    if (i % 2 === 1) {
                        return <MathRenderer key={i} expression={part} inline className="text-cyan-200 font-bold mx-1" />;
                    }
                    return <span key={i} dangerouslySetInnerHTML={{__html: part}} />;
                })}
            </span>
        );
    };

    // --- Statistics Calculations ---
    const durationMs = endTime - startTime;
    const minutes = Math.floor(durationMs / 60000);
    const seconds = Math.floor((durationMs % 60000) / 1000);
    const timeStr = `${minutes}m ${seconds}s`;
    const avgTimePerQ = activeQuestions.length > 0 ? (durationMs / activeQuestions.length / 1000).toFixed(1) : '0';
    
    // Grading
    const percentage = activeQuestions.length > 0 ? (score / activeQuestions.length) * 100 : 0;
    let grade = 'F';
    let gradeColor = 'text-red-500';
    if (percentage >= 90) { grade = 'S'; gradeColor = 'text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400'; }
    else if (percentage >= 80) { grade = 'A'; gradeColor = 'text-emerald-400'; }
    else if (percentage >= 70) { grade = 'B'; gradeColor = 'text-blue-400'; }
    else if (percentage >= 60) { grade = 'C'; gradeColor = 'text-orange-400'; }

    // Topic Breakdown
    const topicStats: Record<string, { total: number, correct: number }> = {};
    activeQuestions.forEach(q => {
        const t = q.topic || 'General';
        if (!topicStats[t]) topicStats[t] = { total: 0, correct: 0 };
        topicStats[t].total++;
        if (!mistakes.includes(q.id)) {
            topicStats[t].correct++;
        }
    });

    return (
        <div className="min-h-[80vh] flex flex-col pb-20 max-w-3xl mx-auto w-full">
            
            <AnimatePresence mode='wait'>
                {mode === 'MENU' && (
                    <motion.div 
                        key="menu"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="flex flex-col items-center flex-1 p-6"
                    >
                        {/* Header Section */}
                        <div className="flex flex-col items-center text-center mb-10 w-full">
                            <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 mb-6 text-white transform hover:scale-105 transition-transform duration-300">
                                <Brain size={42} strokeWidth={1.5} />
                            </div>
                            <h1 className="text-3xl md:text-4xl font-black text-white mb-3 tracking-tight">Examination Hall</h1>
                            <p className="text-slate-400 text-sm max-w-xs mx-auto leading-relaxed">
                                Choose your challenge level. Regular practice adapts to your performance.
                            </p>
                        </div>

                        {/* Main Cards Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12 w-full">
                            
                            {/* Comprehensive Assessment Card */}
                            <button 
                                onClick={() => startExam('ALL')}
                                className="group relative overflow-hidden rounded-3xl p-[1px] transition-all hover:scale-[1.02] active:scale-[0.98] shadow-2xl shadow-purple-900/20"
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 opacity-70 group-hover:opacity-100 transition-opacity animate-gradient-xy" />
                                <div className="relative h-full bg-[#0B1121] rounded-[23px] p-6 flex flex-col justify-between overflow-hidden min-h-[140px]">
                                    <div className="absolute right-0 top-0 w-32 h-32 bg-purple-500/10 blur-3xl rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />
                                    
                                    <div className="flex justify-between items-start mb-4 relative z-10">
                                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500/20 to-purple-500/20 flex items-center justify-center text-cyan-200 border border-white/5 backdrop-blur-sm">
                                            <Layers size={24} />
                                        </div>
                                    </div>
                                    
                                    <div className="relative z-10 text-left">
                                        <h3 className="text-lg font-bold text-white mb-1 group-hover:text-cyan-200 transition-colors">Full Exam</h3>
                                        <p className="text-xs text-slate-400 font-medium">All topics. The ultimate test.</p>
                                    </div>
                                </div>
                            </button>

                            {/* Mistake Clinic Card (Adaptive) */}
                            <button
                                onClick={() => startExam('MISTAKES')}
                                disabled={mistakeQuestions.length === 0}
                                className={`group relative overflow-hidden rounded-3xl p-[1px] transition-all duration-300 ${mistakeQuestions.length > 0 ? 'hover:scale-[1.02] active:scale-[0.98] shadow-2xl shadow-amber-900/20' : 'opacity-60 cursor-not-allowed'}`}
                            >
                                <div className={`absolute inset-0 bg-gradient-to-r from-amber-400 via-red-500 to-orange-500 opacity-70 ${mistakeQuestions.length > 0 ? 'group-hover:opacity-100 animate-gradient-xy' : ''}`} />
                                <div className="relative h-full bg-[#0B1121] rounded-[23px] p-6 flex flex-col justify-between overflow-hidden min-h-[140px]">
                                    <div className="absolute right-0 top-0 w-32 h-32 bg-orange-500/10 blur-3xl rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />
                                    
                                    <div className="flex justify-between items-start mb-4 relative z-10">
                                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500/20 to-red-500/20 flex items-center justify-center text-amber-400 border border-amber-500/20">
                                            <Zap size={24} />
                                        </div>
                                        {mistakeQuestions.length > 0 && (
                                            <div className="bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded-full animate-pulse shadow-lg shadow-red-500/30">
                                                {mistakeQuestions.length} Issues
                                            </div>
                                        )}
                                    </div>
                                    
                                    <div className="relative z-10 text-left">
                                        <h3 className="text-lg font-bold text-white mb-1 group-hover:text-amber-200 transition-colors">Mistake Clinic</h3>
                                        <p className="text-xs text-slate-400 font-medium">
                                            {mistakeQuestions.length > 0 
                                                ? "Targeted practice on weak spots." 
                                                : "No mistakes pending. Great job!"}
                                        </p>
                                    </div>
                                </div>
                            </button>

                        </div>

                        {/* Topic Drills Section */}
                        <div className="w-full">
                            <div className="flex items-center gap-2 mb-5 px-1">
                                <BookOpen size={16} className="text-slate-500" />
                                <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Topic Drills</span>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {examTopics.map((topic) => (
                                    <button 
                                        key={topic.id}
                                        onClick={() => startExam(topic.id)}
                                        className="flex items-center gap-4 p-4 rounded-2xl border border-white/5 bg-slate-900/40 hover:bg-slate-800 hover:border-white/10 transition-all group text-left relative overflow-hidden"
                                    >
                                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${topic.bg} ${topic.color} transition-transform group-hover:scale-110`}>
                                            <topic.icon size={22}/>
                                        </div>
                                        <div className="relative z-10 flex-1">
                                            <div className="font-bold text-sm text-slate-200 group-hover:text-white mb-0.5">{topic.label}</div>
                                            <div className="text-[10px] text-slate-500 font-medium group-hover:text-slate-400">Subject Drill</div>
                                        </div>
                                        
                                        {(!questionBank[topic.id] || questionBank[topic.id]?.length === 0) ? (
                                            <Lock size={16} className="text-slate-700" />
                                        ) : (
                                            <ChevronRight size={16} className="text-slate-600 opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                )}

                {mode === 'PLAY' && currentQ && (
                    <motion.div 
                        key="play"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex flex-col h-full w-full max-w-2xl mx-auto"
                    >
                        {/* Mobile Exit Button */}
                        <div className="md:hidden w-full mb-4">
                            <button 
                                onClick={() => setMode('MENU')}
                                className="flex items-center gap-2 text-slate-500 hover:text-white transition-colors active:scale-95"
                            >
                                <ArrowLeft size={18} />
                                <span className="text-xs font-bold uppercase tracking-widest">Quit Exam</span>
                            </button>
                        </div>

                        {/* Game HUD Header */}
                        <div className="mb-8 w-full">
                            <div className="flex justify-between items-end mb-4">
                                <div>
                                    <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">{selectedTopicName}</div>
                                    <div className="flex items-baseline gap-2">
                                        <span className="text-4xl font-black text-white tracking-tighter">
                                            {(currentQIndex + 1).toString().padStart(2, '0')}
                                        </span>
                                        <span className="text-sm font-bold text-slate-600">/ {activeQuestions.length}</span>
                                    </div>
                                </div>

                                {/* HUD Stats Pill */}
                                <div className="flex items-center bg-slate-900/80 border border-slate-800 rounded-2xl p-1.5 backdrop-blur-md shadow-lg">
                                    <div className="flex items-center gap-2 px-3 border-r border-slate-800">
                                        <CheckCircle size={16} className="text-emerald-500" />
                                        <span className="text-base font-black text-white font-mono">{correctCount}</span>
                                    </div>
                                    <div className="flex items-center gap-2 px-3">
                                        <XCircle size={16} className="text-red-500" />
                                        <span className="text-base font-black text-white font-mono">{wrongCount}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Enhanced Progress Bar */}
                            <div className="relative h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                                <motion.div 
                                    className="absolute top-0 left-0 bottom-0 bg-gradient-to-r from-cyan-400 to-blue-600 shadow-[0_0_15px_rgba(34,211,238,0.4)]"
                                    initial={{ width: 0 }}
                                    animate={{ width: `${progress}%` }}
                                    transition={{ type: "spring", stiffness: 50, damping: 20 }}
                                >
                                    <div className="absolute inset-0 bg-white/20 animate-pulse" />
                                </motion.div>
                            </div>
                        </div>

                        {/* Scrollable Question & Options */}
                        <div className="flex-1 min-h-0 overflow-y-auto pb-32 md:pb-0 custom-scrollbar px-1">
                            <div className="space-y-6">
                                {/* Question Bubble - Aesthetic Refresh */}
                                <div className="bg-gradient-to-b from-slate-800/60 to-slate-900/60 border border-white/10 p-6 md:p-8 rounded-3xl text-center shadow-xl relative overflow-hidden group">
                                    <div className="absolute inset-0 bg-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                                    <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent opacity-50" />
                                    
                                    <h3 className="text-lg md:text-2xl font-bold text-slate-100 leading-snug relative z-10">
                                        {renderMixedText(currentQ.text)}
                                    </h3>
                                </div>

                                {/* Options Grid/Stack */}
                                <div className="grid gap-3">
                                    {currentQ.options.map((opt) => {
                                        const isSelected = selectedOption === opt.key;
                                        const isCorrect = opt.key === currentQ.correct;
                                        const showResult = isAnswered;
                                        
                                        let style = "bg-slate-900/40 border-slate-800 text-slate-400 hover:bg-slate-800 hover:border-slate-600 hover:text-slate-200"; // Default
                                        let icon = null;

                                        if (showResult) {
                                            if (isCorrect) {
                                                style = "bg-emerald-500/10 border-emerald-500/50 text-emerald-100 shadow-[0_0_15px_rgba(16,185,129,0.1)]";
                                                icon = <CheckCircle size={20} className="text-emerald-400 shrink-0 drop-shadow-md" />;
                                            } else if (isSelected && !isCorrect) {
                                                style = "bg-red-500/10 border-red-500/50 text-red-100 shadow-[0_0_15px_rgba(239,68,68,0.1)]";
                                                icon = <XCircle size={20} className="text-red-400 shrink-0 drop-shadow-md" />;
                                            } else {
                                                style = "opacity-40 grayscale border-transparent bg-transparent";
                                            }
                                        } else if (isSelected) {
                                             style = "bg-cyan-600 border-cyan-500 text-white shadow-lg shadow-cyan-500/30 scale-[1.02]";
                                        }

                                        return (
                                            <button
                                                key={opt.key}
                                                onClick={() => handleAnswer(opt.key)}
                                                disabled={isAnswered}
                                                className={`
                                                    w-full p-4 rounded-2xl border text-left font-medium text-sm md:text-lg transition-all duration-200 flex items-center justify-between group
                                                    ${style} ${!isAnswered ? 'active:scale-[0.98]' : ''}
                                                `}
                                            >
                                                <span className="flex items-center gap-4">
                                                    <span className={`
                                                        w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold shadow-inner
                                                        ${showResult && isCorrect ? 'bg-emerald-500 text-white' : 
                                                          showResult && isSelected ? 'bg-red-500 text-white' :
                                                          isSelected ? 'bg-white text-cyan-600' :
                                                          'bg-slate-950 border border-slate-800 text-slate-500 group-hover:text-white group-hover:border-slate-600'}
                                                    `}>
                                                        {opt.key}
                                                    </span>
                                                    <span className="leading-snug">{renderMixedText(opt.text)}</span>
                                                </span>
                                                {icon}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>

                        {/* Sticky Footer for Mobile (Inline for desktop) */}
                        <AnimatePresence>
                            {isAnswered && (
                                <motion.div 
                                    initial={{ y: 20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    exit={{ y: 20, opacity: 0 }}
                                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                    className="fixed bottom-0 left-0 right-0 p-4 z-50 md:static md:p-0 md:mt-8 bg-[#020617]/90 backdrop-blur-lg md:bg-transparent border-t border-slate-800 md:border-0"
                                >
                                    <div className="max-w-2xl mx-auto space-y-4">
                                        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 flex gap-4 items-start shadow-xl relative overflow-hidden">
                                            <div className="absolute top-0 left-0 w-1 h-full bg-amber-500"></div>
                                            <div className="p-2 bg-amber-500/10 rounded-xl text-amber-400 shrink-0">
                                                <Brain size={20} />
                                            </div>
                                            <div className="space-y-1">
                                                <div className="text-[10px] font-bold text-amber-500 uppercase tracking-widest flex items-center gap-2">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></div>
                                                    Logic Breakdown
                                                </div>
                                                <p className="text-sm text-slate-300 leading-relaxed font-medium">
                                                    {renderMixedText(currentQ.explanation || '')}
                                                </p>
                                            </div>
                                        </div>
                                        
                                        <button 
                                            onClick={handleNext}
                                            className="w-full py-4 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded-2xl font-bold shadow-lg shadow-cyan-900/20 flex items-center justify-center gap-3 text-sm uppercase tracking-widest transition-all active:scale-[0.98] group"
                                        >
                                            {currentQIndex < activeQuestions.length - 1 ? "Next Question" : "Finish Exam"} 
                                            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                        </button>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                )}

                {mode === 'RESULT' && (
                    <motion.div 
                        key="result"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex flex-col items-center w-full space-y-8"
                    >
                        <h2 className="text-3xl font-black text-white">Examination Report</h2>
                        
                        <ResultScene score={score} total={activeQuestions.length} />

                        {/* Stats Grid */}
                        <div className="grid grid-cols-3 gap-3 w-full">
                            <div className="bg-slate-900/50 p-4 rounded-2xl border border-slate-800 text-center flex flex-col items-center justify-center">
                                <div className="text-[10px] text-slate-500 uppercase font-bold mb-1 flex items-center gap-1"><Trophy size={12}/> Grade</div>
                                <div className={`text-4xl font-black ${gradeColor} drop-shadow-md`}>{grade}</div>
                            </div>
                            <div className="bg-slate-900/50 p-4 rounded-2xl border border-slate-800 text-center flex flex-col items-center justify-center">
                                <div className="text-[10px] text-slate-500 uppercase font-bold mb-1 flex items-center gap-1"><Clock size={12}/> Time</div>
                                <div className="text-xl font-mono text-white">{timeStr}</div>
                            </div>
                            <div className="bg-slate-900/50 p-4 rounded-2xl border border-slate-800 text-center flex flex-col items-center justify-center">
                                <div className="text-[10px] text-slate-500 uppercase font-bold mb-1 flex items-center gap-1"><Timer size={12}/> Pace</div>
                                <div className="text-xl font-mono text-white">{avgTimePerQ}s<span className="text-[10px] text-slate-600">/q</span></div>
                            </div>
                        </div>

                        {/* Topic Breakdown */}
                        <div className="w-full bg-slate-900/40 rounded-2xl border border-white/5 p-5">
                            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                                <BarChart2 size={16}/> Performance by Topic
                            </h3>
                            <div className="space-y-4">
                                {Object.entries(topicStats).map(([topic, stats]) => {
                                    const pct = Math.round((stats.correct / stats.total) * 100);
                                    const topicName = topic.charAt(0).toUpperCase() + topic.slice(1).toLowerCase().replace('_', ' ');
                                    return (
                                        <div key={topic}>
                                            <div className="flex justify-between items-end mb-1">
                                                <span className="text-sm font-medium text-slate-300">{topicName}</span>
                                                <div className="flex gap-2 text-xs">
                                                    <span className="text-slate-500">{stats.correct}/{stats.total}</span>
                                                    <span className={pct > 70 ? 'text-emerald-400' : pct > 40 ? 'text-amber-400' : 'text-red-400'}>{pct}%</span>
                                                </div>
                                            </div>
                                            <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                                                <motion.div 
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${pct}%` }}
                                                    className={`h-full rounded-full ${pct > 70 ? 'bg-emerald-500' : pct > 40 ? 'bg-amber-500' : 'bg-red-500'}`}
                                                />
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>

                        {mistakes.length > 0 && (
                            <div className="w-full">
                                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                                    <AlertTriangle size={16}/> Review Mistakes ({mistakes.length})
                                </h3>
                                <div className="space-y-3 max-h-60 overflow-y-auto custom-scrollbar pr-2">
                                    {mistakes.map(id => {
                                        const q = activeQuestions.find(q => q.id === id);
                                        if(!q) return null;
                                        return (
                                            <div key={id} className="bg-slate-900/80 p-4 rounded-xl border border-red-500/20 border-l-4 border-l-red-500">
                                                <div className="text-sm text-white font-medium mb-2">{renderMixedText(q.text)}</div>
                                                <div className="text-xs text-slate-400 bg-slate-950 p-2 rounded flex items-center gap-2">
                                                    <CheckCircle size={12} className="text-emerald-500"/>
                                                    Correct: {renderMixedText(q.options.find(o => o.key === q.correct)?.text || '')}
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                        )}

                        <div className="flex gap-4 w-full pt-4">
                            <button 
                                onClick={() => setMode('MENU')}
                                className="flex-1 py-4 bg-slate-800 hover:bg-slate-700 text-white rounded-2xl font-bold flex items-center justify-center gap-2 transition-colors"
                            >
                                <RefreshCcw size={18}/> Back to Menu
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
