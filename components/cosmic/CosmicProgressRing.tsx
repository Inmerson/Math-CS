import React from 'react';

interface CosmicProgressRingProps {
  value: number;
  label: string;
  size?: 'sm' | 'md' | 'lg';
  accent?: 'blue' | 'violet';
}

export const CosmicProgressRing: React.FC<CosmicProgressRingProps> = ({
  value,
  label,
  size = 'md',
  accent = 'blue',
}) => {
  const safeValue = Math.min(100, Math.max(0, Math.round(value)));
  return (
    <div
      role="img"
      aria-label={`${label}: ${safeValue}%`}
      className={`cosmic-progress-ring cosmic-progress-ring--${size} cosmic-progress-ring--${accent}`}
      style={{ '--progress': `${safeValue * 3.6}deg` } as React.CSSProperties}
    >
      <span>{safeValue}%</span>
    </div>
  );
};
