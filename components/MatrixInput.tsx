import React, { useState } from 'react';
import { MatrixProps } from '../types';
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';

export const MatrixInput: React.FC<MatrixProps> = ({
  data,
  label,
  editable = false,
  onChange,
  highlightRow,
  highlightCol,
  color = 'blue'
}) => {
  const rows = data.length;
  const cols = data[0]?.length || 0;
  
  // Local state for typing
  const [editValue, setEditValue] = useState<{key: string, val: string} | null>(null);

  const handleFocus = (r: number, c: number) => {
    setEditValue({ key: `${r}-${c}`, val: data[r][c].toString() });
  };

  const commitEdit = () => {
    if (!editValue || !onChange) {
        setEditValue(null);
        return;
    }

    const [r, c] = editValue.key.split('-').map(Number);
    const val = editValue.val;

    let newValue = data[r][c];

    const num = parseFloat(val);
    if (!isNaN(num)) {
        newValue = num;
    } else if (val === '') {
        newValue = 0;
    }

    if (newValue !== data[r][c]) {
        const newData = data.map(row => [...row]);
        newData[r][c] = newValue;
        onChange(newData);
    }

    setEditValue(null);
  };

  const handleBlur = () => {
    commitEdit();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
        e.currentTarget.blur();
    }
  };

  const handleChange = (r: number, c: number, val: string) => {
    setEditValue({ key: `${r}-${c}`, val });
  };

  const themes = {
    blue:   { text: 'text-blue-200',   focus: 'focus:border-blue-400 focus:shadow-[0_0_15px_rgba(59,130,246,0.3)]',   bracket: '#60a5fa' },
    green:  { text: 'text-emerald-200', focus: 'focus:border-emerald-400 focus:shadow-[0_0_15px_rgba(16,185,129,0.3)]', bracket: '#34d399' },
    purple: { text: 'text-purple-200',  focus: 'focus:border-purple-400 focus:shadow-[0_0_15px_rgba(168,85,247,0.3)]',  bracket: '#c084fc' },
    orange: { text: 'text-accent-cyan',    focus: 'focus:border-accent-cyan focus:shadow-[0_0_15px_rgba(34,211,238,0.3)]',    bracket: '#22d3ee' },
    pink:   { text: 'text-pink-200',    focus: 'focus:border-pink-400 focus:shadow-[0_0_15px_rgba(236,72,153,0.3)]',    bracket: '#f472b6' },
    red:    { text: 'text-fuchsia-200', focus: 'focus:border-fuchsia-400 focus:shadow-[0_0_15px_rgba(217,70,239,0.3)]', bracket: '#e879f9' },
    cyan:   { text: 'text-accent-cyan',    focus: 'focus:border-accent-cyan focus:shadow-[0_0_15px_rgba(34,211,238,0.3)]',    bracket: '#22d3ee' },
  };

  const currentTheme = themes[color] || themes.blue;

  // Bracket SVG Path Generator
  const bracketThickness = 2;
  const bracketWidth = 8;
  
  return (
    <div className="flex flex-col items-center gap-3 relative group/matrix z-10">
      {label && (
        <motion.h3 
            layout
            className="text-[10px] font-bold text-slate-400 tracking-[0.2em] uppercase mb-1"
        >
            {label}
        </motion.h3>
      )}
      
      <LayoutGroup>
        <motion.div 
            layout
            className="relative px-3 py-1 flex items-stretch"
        >
            {/* Left Bracket */}
            <svg className="absolute left-0 top-0 h-full w-4 overflow-visible" preserveAspectRatio="none">
                <motion.path 
                    d={`M ${bracketWidth} 0 L 2 0 L 2 100% L ${bracketWidth} 100%`} 
                    fill="none" 
                    stroke={currentTheme.bracket} 
                    strokeWidth={bracketThickness}
                    strokeLinecap="round"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.6, ease: "easeInOut" }}
                />
            </svg>

            {/* Matrix Grid */}
            <div 
                className="grid gap-2 mx-1"
                style={{ gridTemplateColumns: `repeat(${cols}, minmax(min-content, 1fr))` }}
            >
            <AnimatePresence>
            {data.map((row, rIndex) => (
                row.map((cell, cIndex) => {
                const isHighlighted = rIndex === highlightRow || cIndex === highlightCol;
                const cellKey = `${rIndex}-${cIndex}`;
                const displayValue = (editValue && editValue.key === cellKey) 
                    ? editValue.val 
                    : cell;

                return (
                    <motion.div
                        layout
                        key={cellKey}
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.5 }}
                        transition={{ type: "spring", stiffness: 400, damping: 25 }}
                    >
                        <input
                            type="text"
                            inputMode="decimal"
                            value={displayValue}
                            readOnly={!editable}
                            onFocus={() => editable && handleFocus(rIndex, cIndex)}
                            onBlur={handleBlur}
                            onKeyDown={handleKeyDown}
                            onChange={(e) => handleChange(rIndex, cIndex, e.target.value)}
                            className={`
                                w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14
                                text-center text-sm sm:text-base md:text-lg 
                                font-mono rounded-lg outline-none transition-all duration-300
                                border border-white/5
                                bg-slate-900/40 backdrop-blur-md
                                hover:bg-white/10 hover:border-white/10
                                ${currentTheme.text}
                                ${editable ? 'cursor-text' : 'cursor-default'}
                                ${editable ? currentTheme.focus : ''}
                                ${isHighlighted ? '!bg-accent-cyan/20 !border-accent-cyan/50 !text-white scale-110 shadow-[0_0_15px_rgba(0,246,255,0.2)] z-10' : ''}
                            `}
                        />
                    </motion.div>
                );
                })
            ))}
            </AnimatePresence>
            </div>

            {/* Right Bracket */}
            <svg className="absolute right-0 top-0 h-full w-4 overflow-visible" preserveAspectRatio="none">
                <motion.path 
                    d={`M ${4-bracketWidth} 0 L 2 0 L 2 100% L ${4-bracketWidth} 100%`} 
                    fill="none" 
                    stroke={currentTheme.bracket} 
                    strokeWidth={bracketThickness}
                    strokeLinecap="round"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.6, ease: "easeInOut" }}
                />
            </svg>
        </motion.div>
      </LayoutGroup>
      
      <div className="text-[9px] text-slate-600 font-mono opacity-0 group-hover/matrix:opacity-100 transition-opacity">
        {rows} × {cols}
      </div>
    </div>
  );
};