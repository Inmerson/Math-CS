
import React from 'react';
import { motion } from 'framer-motion';

export const AnimatedBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none bg-background">

      {/* 1. Deep Space Gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#030014] via-[#050b14] to-[#030014]" />

      {/* 2. Stars (CSS implementation for performance) */}
      <div className="absolute inset-0 opacity-20"
           style={{
             backgroundImage: 'radial-gradient(1px 1px at 20px 30px, #eee, rgba(0,0,0,0)), radial-gradient(1px 1px at 40px 70px, #fff, rgba(0,0,0,0)), radial-gradient(1px 1px at 50px 160px, #ddd, rgba(0,0,0,0)), radial-gradient(1.5px 1.5px at 90px 40px, #fff, rgba(0,0,0,0)), radial-gradient(1px 1px at 130px 80px, #fff, rgba(0,0,0,0)), radial-gradient(1.5px 1.5px at 160px 120px, #ddd, rgba(0,0,0,0))',
             backgroundSize: '200px 200px'
           }}
      />

      {/* 3. Nebula Orbs (Animated) */}
      <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-purple-900/20 rounded-full blur-[100px] mix-blend-screen animate-blob" />
      <div className="absolute top-[20%] right-[-10%] w-[40vw] h-[40vw] bg-cyan-900/20 rounded-full blur-[100px] mix-blend-screen animate-blob animation-delay-2000" />
      <div className="absolute bottom-[-20%] left-[20%] w-[60vw] h-[60vw] bg-blue-900/10 rounded-full blur-[120px] mix-blend-screen animate-blob animation-delay-4000" />

      {/* 4. Grid Overlay (Perspective) */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
            backgroundImage: `linear-gradient(to right, #808080 1px, transparent 1px), linear-gradient(to bottom, #808080 1px, transparent 1px)`,
            backgroundSize: '40px 40px',
            maskImage: 'radial-gradient(circle at 50% 50%, black 40%, transparent 100%)'
        }}
      />

      {/* 5. Noise Texture */}
      <div className="absolute inset-0 bg-noise opacity-[0.03] mix-blend-overlay" />
    </div>
  );
};
