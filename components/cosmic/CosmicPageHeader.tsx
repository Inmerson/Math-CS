import React from 'react';

interface CosmicPageHeaderProps {
  title: string;
  eyebrow: string;
  description?: string;
  meta?: string;
  accent?: 'blue' | 'violet' | 'neutral';
  children?: React.ReactNode;
}

const variants = {
  blue: {
    eyebrow: 'text-blue-200',
    glow: 'cosmic-glow-blue',
    wash: 'from-blue-500/10 via-transparent to-transparent',
  },
  violet: {
    eyebrow: 'text-violet-200',
    glow: 'cosmic-glow-violet',
    wash: 'from-violet-500/10 via-transparent to-transparent',
  },
  neutral: {
    eyebrow: 'text-slate-300',
    glow: '',
    wash: 'from-slate-400/7 via-transparent to-transparent',
  },
} as const;

export const CosmicPageHeader: React.FC<CosmicPageHeaderProps> = ({
  title,
  eyebrow,
  description,
  meta,
  accent = 'neutral',
  children,
}) => {
  const variant = variants[accent];
  return (
    <header
      data-testid="cosmic-page-header"
      data-accent={accent}
      className={`cosmic-glass ${variant.glow} relative isolate overflow-hidden rounded-[1.4rem] p-6 md:p-8`}
    >
      <div className={`pointer-events-none absolute inset-0 -z-10 bg-gradient-to-br ${variant.wash}`} aria-hidden="true" />
      <p className={`text-xs font-bold uppercase tracking-[0.2em] ${variant.eyebrow}`}>{eyebrow}</p>
      <h1 className="mt-3 text-3xl font-bold tracking-tight text-white md:text-4xl">{title}</h1>
      {meta && <p className="mt-2 text-sm text-slate-400">{meta}</p>}
      {description && <p className="mt-4 max-w-3xl leading-7 text-slate-300">{description}</p>}
      {children && <div className="mt-5">{children}</div>}
    </header>
  );
};
