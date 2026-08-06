import React from 'react';

export const AnimatedBackground: React.FC = () => (
  <div
    data-testid="cosmic-background"
    aria-hidden="true"
    className="cosmic-shell pointer-events-none fixed inset-0 -z-10 overflow-hidden"
  >
    <div
      data-cosmic-layer="nebula"
      className="absolute inset-0 bg-[radial-gradient(circle_at_82%_8%,rgba(98,168,255,.12),transparent_31%),radial-gradient(circle_at_18%_75%,rgba(124,131,255,.07),transparent_34%),linear-gradient(180deg,#030711_0%,#07111f_58%,#030711_100%)]"
    />
    <div data-cosmic-layer="stars" className="cosmic-starfield absolute inset-0" />
    <div data-cosmic-layer="grid" className="coordinate-grid absolute inset-0 opacity-20" />
  </div>
);
