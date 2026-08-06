import React from 'react';

interface CosmicLogoMarkProps {
  className?: string;
  size?: number;
}

export const CosmicLogoMark: React.FC<CosmicLogoMarkProps> = ({ className = '', size = 42 }) => (
  <svg
    aria-hidden="true"
    focusable="false"
    viewBox="0 0 64 64"
    width={size}
    height={size}
    className={className}
  >
    <defs>
      <radialGradient id="cosmic-logo-core" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#01030a" />
        <stop offset="68%" stopColor="#02050d" />
        <stop offset="100%" stopColor="#101b32" />
      </radialGradient>
      <linearGradient id="cosmic-logo-ring" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#b7e8ff" />
        <stop offset="45%" stopColor="#62a8ff" />
        <stop offset="100%" stopColor="#a78bfa" />
      </linearGradient>
      <filter id="cosmic-logo-glow" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation="2.4" result="blur" />
        <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
      </filter>
    </defs>
    <ellipse cx="32" cy="32" rx="27" ry="10" fill="none" stroke="url(#cosmic-logo-ring)" strokeWidth="3" opacity=".9" filter="url(#cosmic-logo-glow)" transform="rotate(-11 32 32)" />
    <circle cx="32" cy="32" r="15" fill="url(#cosmic-logo-core)" stroke="rgba(183,232,255,.55)" strokeWidth="1.5" />
    <path d="M8 35c9 6 39 7 49-3" fill="none" stroke="#f4d7aa" strokeWidth="1.4" opacity=".65" />
  </svg>
);
