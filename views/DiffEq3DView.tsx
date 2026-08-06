
import React, { useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Line } from '@react-three/drei';
import * as THREE from 'three';
import { Globe } from 'lucide-react';

const LorenzSystem = () => {
  const lineRef = useRef<any>(null);
  
  // Lorenz Parameters
  const sigma = 10;
  const rho = 28;
  const beta = 8/3;
  const dt = 0.01;

  // Precompute trajectory
  const points = useMemo(() => {
      const pts = [];
      let x = 0.1, y = 0, z = 0;
      for(let i=0; i<3000; i++) {
          const dx = sigma * (y - x);
          const dy = x * (rho - z) - y;
          const dz = x * y - beta * z;
          x += dx * dt;
          y += dy * dt;
          z += dz * dt;
          pts.push(new THREE.Vector3(x, y, z));
      }
      return pts;
  }, []);

  useFrame((state) => {
      if (lineRef.current) {
          lineRef.current.rotation.y += 0.002;
      }
  });

  return (
      <group ref={lineRef} position={[0, -25, 0]}>
          <Line points={points} color="#f472b6" lineWidth={1.5} opacity={0.8} transparent />
      </group>
  );
}

export const DiffEq3DView: React.FC = () => {
  return (
    <div className="space-y-6 h-[calc(100vh-140px)] flex flex-col pb-6">
      <header className="flex justify-between items-end border-b border-white/10 pb-4 shrink-0">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
            <Globe className="text-pink-400" /> Lorenz Attractor
          </h2>
          <p className="text-slate-400 text-sm max-w-2xl">
            A chaotic system of differential equations. Small changes in initial conditions lead to vastly different trajectories (Butterfly Effect).
          </p>
        </div>
      </header>

      <div className="flex-1 bg-slate-950 rounded-3xl border border-slate-800 relative overflow-hidden shadow-2xl">
        <Canvas camera={{ position: [50, 40, 50], fov: 45 }}>
          <color attach="background" args={['#020617']} />
          <OrbitControls makeDefault autoRotate autoRotateSpeed={0.5} />
          <LorenzSystem />
        </Canvas>
      </div>
    </div>
  );
};
