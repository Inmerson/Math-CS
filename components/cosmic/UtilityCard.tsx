import React from 'react';
import { ArrowRight } from 'lucide-react';

interface UtilityCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  accent: 'blue' | 'violet';
  onActivate: () => void;
  decoration?: React.ReactNode;
}

const variants = {
  blue: {
    icon: 'border-blue-300/18 bg-blue-400/10 text-blue-200',
    button: 'from-blue-500/85 to-indigo-500/85 text-white',
    glow: 'cosmic-glow-blue',
  },
  violet: {
    icon: 'border-violet-300/18 bg-violet-400/10 text-violet-200',
    button: 'from-violet-500/85 to-indigo-500/85 text-white',
    glow: 'cosmic-glow-violet',
  },
} as const;

export const UtilityCard: React.FC<UtilityCardProps> = ({
  title,
  description,
  icon,
  accent,
  onActivate,
  decoration,
}) => {
  const variant = variants[accent];
  return (
    <button
      type="button"
      onClick={onActivate}
      className={`focus-ring cosmic-glass cosmic-card ${variant.glow} group relative flex min-h-28 w-full items-center gap-4 overflow-hidden rounded-2xl p-5 text-left`}
      aria-label={`${title}: ${description}`}
    >
      <span className={`relative z-10 grid size-14 shrink-0 place-items-center rounded-2xl border ${variant.icon}`}>
        {icon}
      </span>
      <span className="relative z-10 min-w-0 flex-1">
        <span className="block text-lg font-semibold text-white">{title}</span>
        <span className="mt-1 block text-sm leading-6 text-slate-400">{description}</span>
      </span>
      <span className={`cosmic-button relative z-10 hidden shrink-0 items-center gap-2 rounded-xl bg-gradient-to-r px-4 py-2 text-sm font-semibold sm:inline-flex ${variant.button}`}>
        Open <ArrowRight size={16} />
      </span>
      {decoration && <span className="pointer-events-none absolute inset-y-0 right-0 w-2/5 opacity-35" aria-hidden="true">{decoration}</span>}
    </button>
  );
};
