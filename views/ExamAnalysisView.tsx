
import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { PieChart, CheckCircle2, AlertTriangle, BookOpen, Brain, Activity, Clock, Trash2, Trophy } from 'lucide-react';
import { getExamPerformance, getQuestionStatus, resetExamData } from '../utils/examStorage';
import { questionBank, examTopics } from '../data/examQuestions';
import { ModuleType } from '../types';

export const ExamAnalysisView: React.FC = () => {
  const performance = getExamPerformance();
  
  // Calculate aggregated statistics
  const stats = useMemo(() => {
    let totalAttempts = 0;
    let totalCorrect = 0;
    let totalIncorrect = 0;
    let masteredCount = 0;
    let learningCount = 0;
    let unseenCount = 0;
    let totalQuestions = 0;

    // Topic stats
    const topicStats: Record<string, { total: number, attempted: number, correct: number, mastered: number }> = {};
    
    examTopics.forEach(t => {
      topicStats[t.id] = { total: 0, attempted: 0, correct: 0, mastered: 0 };
    });

    // Iterate by module to ensure correct topic attribution
    Object.entries(questionBank).forEach(([moduleId, questions]) => {
      if (!questions) return;
      const topicId = moduleId as ModuleType;

      questions.forEach(q => {
        totalQuestions++;
        const qStats = performance[q.id];
        const status = getQuestionStatus(qStats);
        
        // Populate total count for topic
        if (topicStats[topicId]) {
            topicStats[topicId].total++;
        }

        if (status === 'UNSEEN') {
          unseenCount++;
        } else if (qStats) {
          learningCount += (status === 'LEARNING' ? 1 : 0);
          masteredCount += (status === 'MASTERED' ? 1 : 0);
          
          totalAttempts += (qStats.correct + qStats.incorrect);
          totalCorrect += qStats.correct;
          totalIncorrect += qStats.incorrect;

          if (topicStats[topicId]) {
              topicStats[topicId].attempted++;
              topicStats[topicId].correct += qStats.correct;
              if (status === 'MASTERED') topicStats[topicId].mastered++;
          }
        }
      });
    });

    const masteryPercentage = totalQuestions > 0 ? Math.round((masteredCount / totalQuestions) * 100) : 0;
    const learningPercentage = totalQuestions > 0 ? Math.round((learningCount / totalQuestions) * 100) : 0;
    
    // Identify weakest topic (lowest mastery percentage among attempted)
    let weakestTopic = null;
    let minMastery = 101;
    
    Object.entries(topicStats).forEach(([tid, val]) => {
        // Explicitly cast to ensure type safety in environment where Object.entries returns unknown values
        const tStat = val as { total: number, attempted: number, correct: number, mastered: number };
        if (tStat.attempted > 0) {
            const mastery = (tStat.mastered / tStat.total) * 100;
            if (mastery < minMastery) {
                minMastery = mastery;
                weakestTopic = examTopics.find(t => t.id === tid);
            }
        }
    });

    return {
      totalQuestions,
      masteredCount,
      learningCount,
      unseenCount,
      masteryPercentage,
      learningPercentage,
      topicStats,
      weakestTopic,
      totalAttempts
    };
  }, [performance]);

  const handleReset = () => {
      if (window.confirm("Are you sure you want to reset all progress? This cannot be undone.")) {
          resetExamData();
          window.location.reload();
      }
  };

  return (
    <div className="space-y-8 pb-20 max-w-5xl mx-auto">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end border-b border-white/10 pb-6 gap-6">
            <div>
                <h2 className="text-4xl font-black text-white mb-2 tracking-tight flex items-center gap-3">
                    <PieChart className="text-cyan-400" /> Performance Analysis
                </h2>
                <p className="text-slate-400 max-w-2xl font-light text-base">
                    Long-term tracking of your mastery across all modules. Based on correct answer streaks and error rates.
                </p>
            </div>
            <button 
                onClick={handleReset}
                className="flex items-center gap-2 px-4 py-2 bg-slate-900/50 hover:bg-red-900/20 text-slate-400 hover:text-red-400 border border-slate-800 hover:border-red-500/30 rounded-xl transition-all text-xs font-bold uppercase tracking-wider"
            >
                <Trash2 size={14} /> Reset Data
            </button>
        </header>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Mastery Card - Enhanced Visuals */}
            <motion.div 
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                className="bg-slate-900/40 rounded-3xl border border-slate-800 p-8 flex flex-col items-center justify-center relative overflow-hidden min-h-[320px]"
            >
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent pointer-events-none" />
                
                <div className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500 mb-8 flex items-center gap-2 z-10">
                    <Trophy size={16} className="text-emerald-400" /> Global Mastery
                </div>
                
                <div className="relative w-48 h-48 flex items-center justify-center mb-8 z-10">
                    <svg className="w-full h-full transform -rotate-90 drop-shadow-2xl" viewBox="0 0 100 100">
                        <defs>
                            <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                <stop offset="0%" stopColor={stats.masteryPercentage >= 80 ? "#10b981" : stats.masteryPercentage >= 50 ? "#3b82f6" : "#f59e0b"} />
                                <stop offset="100%" stopColor={stats.masteryPercentage >= 80 ? "#34d399" : stats.masteryPercentage >= 50 ? "#60a5fa" : "#fbbf24"} />
                            </linearGradient>
                        </defs>
                        
                        {/* Track Background */}
                        <circle cx="50" cy="50" r="40" fill="none" stroke="#0f172a" strokeWidth="8" />
                        <circle cx="50" cy="50" r="40" fill="none" stroke="#1e293b" strokeWidth="8" strokeOpacity="0.5" />

                        {/* Progress Indicator */}
                        <motion.circle 
                            initial={{ strokeDashoffset: 251.3 }} 
                            animate={{ strokeDashoffset: 251.3 - (251.3 * stats.masteryPercentage) / 100 }}
                            transition={{ duration: 1.5, ease: "easeOut", delay: 0.2 }}
                            cx="50" cy="50" r="40" 
                            fill="none" 
                            stroke="url(#progressGradient)" 
                            strokeWidth="8" 
                            strokeDasharray="251.3" 
                            strokeLinecap="round"
                            className="drop-shadow-[0_0_15px_rgba(16,185,129,0.2)]"
                        />
                    </svg>
                    
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <motion.span 
                            initial={{ scale: 0.5, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 0.5 }}
                            className="text-5xl font-black text-white tracking-tighter"
                        >
                            {stats.masteryPercentage}<span className="text-2xl text-slate-500 align-top ml-1">%</span>
                        </motion.span>
                    </div>
                </div>

                <div className="flex gap-4 text-[10px] font-mono font-bold uppercase tracking-widest z-10 bg-slate-950/50 px-5 py-2.5 rounded-full border border-white/5">
                    <span className="text-emerald-400 flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-400"/>
                        {stats.masteredCount} Mastered
                    </span>
                    <span className="text-amber-400 flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-amber-400"/>
                        {stats.learningCount} Learning
                    </span>
                </div>
            </motion.div>

            {/* Activity Card */}
            <motion.div 
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                className="bg-slate-900/40 rounded-3xl border border-slate-800 p-8 flex flex-col justify-between min-h-[320px]"
            >
                <div>
                    <div className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500 mb-8 flex items-center gap-2">
                        <Activity size={16} className="text-blue-400" /> Activity Log
                    </div>
                    <div className="space-y-6">
                        <div className="flex justify-between items-end pb-4 border-b border-white/5">
                            <span className="text-slate-400 text-sm font-medium">Total Attempts</span>
                            <span className="text-3xl font-mono font-bold text-white">{stats.totalAttempts}</span>
                        </div>
                        <div className="flex justify-between items-end">
                            <span className="text-slate-400 text-sm font-medium">Questions Exposed</span>
                            <div className="text-right">
                                <span className="text-3xl font-mono font-bold text-blue-400 block mb-1">
                                    {stats.totalQuestions - stats.unseenCount}
                                </span>
                                <span className="text-xs text-slate-600 font-bold uppercase tracking-wider">
                                    OUT OF {stats.totalQuestions}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-3 overflow-hidden mt-6 shadow-inner">
                    <div className="h-full bg-gradient-to-r from-blue-600 to-cyan-400" style={{ width: `${stats.totalQuestions > 0 ? ((stats.totalQuestions - stats.unseenCount)/stats.totalQuestions)*100 : 0}%` }} />
                </div>
            </motion.div>

            {/* Insight Card */}
            <motion.div 
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                className="bg-slate-900/40 rounded-3xl border border-slate-800 p-8 flex flex-col justify-between min-h-[320px]"
            >
                <div className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500 mb-8 flex items-center gap-2">
                    <Brain size={16} className="text-pink-400" /> Focus Area
                </div>
                {stats.weakestTopic ? (
                    <div className="flex flex-col h-full justify-between">
                        <div>
                            <div className="text-4xl font-black text-white mb-3 tracking-tight">{stats.weakestTopic.label}</div>
                            <div className="h-1 w-12 bg-pink-500 rounded-full mb-6"></div>
                            <p className="text-sm text-slate-400 leading-relaxed font-light">
                                This topic has the lowest mastery rate among those you've attempted.
                            </p>
                        </div>
                        <div className="mt-6 p-4 bg-pink-500/10 border border-pink-500/20 rounded-2xl text-pink-300 text-xs font-medium leading-relaxed">
                            Recommendation: Review <span className="text-white font-bold">Concept Drills</span> or check the <span className="text-white font-bold">Cheat Sheet</span>.
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center h-full text-slate-500 text-sm text-center font-medium">
                        <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center mb-4 text-slate-600">
                            <CheckCircle2 size={32} />
                        </div>
                        Start solving questions to generate insights.
                    </div>
                )}
            </motion.div>
        </div>

        {/* Topic Breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Object.entries(stats.topicStats).map(([tid, val], idx) => {
                const topicInfo = examTopics.find(t => t.id === tid);
                // Cast to correct type as iterator value might be inferred as unknown
                const tStat = val as { total: number, attempted: number, correct: number, mastered: number };
                
                if (!topicInfo) return null;
                const pct = tStat.total > 0 ? Math.round((tStat.mastered / tStat.total) * 100) : 0;
                
                return (
                    <motion.div 
                        key={tid}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 + idx * 0.05 }}
                        className="bg-slate-900/30 border border-slate-800 p-6 rounded-3xl flex items-center gap-6 hover:bg-slate-900/50 transition-colors group"
                    >
                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${topicInfo.bg} ${topicInfo.color} group-hover:scale-110 transition-transform`}>
                            <topicInfo.icon size={26} />
                        </div>
                        <div className="flex-1">
                            <div className="flex justify-between mb-2">
                                <h4 className="font-bold text-white text-base">{topicInfo.label}</h4>
                                <span className={`text-sm font-mono font-bold ${pct >= 80 ? 'text-emerald-400' : pct >= 50 ? 'text-blue-400' : 'text-slate-400'}`}>{pct}%</span>
                            </div>
                            <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden mb-3">
                                <motion.div 
                                    initial={{ width: 0 }}
                                    animate={{ width: `${pct}%` }}
                                    className={`h-full rounded-full ${pct >= 80 ? 'bg-emerald-500' : pct >= 50 ? 'bg-blue-500' : 'bg-slate-600'}`}
                                />
                            </div>
                            <div className="flex gap-4 text-[10px] text-slate-500 font-mono uppercase tracking-wide">
                                <span><strong className="text-slate-300">{tStat.mastered}</strong>/{tStat.total} Mastered</span>
                                <span><strong className="text-slate-300">{tStat.attempted}</strong> Attempted</span>
                            </div>
                        </div>
                    </motion.div>
                );
            })}
        </div>
    </div>
  );
};
