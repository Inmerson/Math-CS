
import React, { useMemo, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Text, Grid } from '@react-three/drei';
import * as THREE from 'three';
import { Box, Layers, MousePointer2 } from 'lucide-react';

interface Surface3DViewProps {
  mode: 'function' | 'limit' | 'derivative';
}

const SurfacePlot: React.FC<{ mode: 'function' | 'limit' | 'derivative' }> = ({ mode }) => {
  const geometry = useMemo(() => {
    const geo = new THREE.PlaneGeometry(10, 10, 64, 64);
    const count = geo.attributes.position.count;
    for (let i = 0; i < count; i++) {
      const x = geo.attributes.position.getX(i);
      const y = geo.attributes.position.getY(i); // Plane is XY, we displace Z
      
      let z = 0;
      if (mode === 'limit') {
         // Sinc function for limits
         const r = Math.sqrt(x*x + y*y);
         z = r === 0 ? 1 : Math.sin(r * 2) / (r * 2);
         z *= 2; // Scale height
      } else {
         // Standard function f(x,y) = sin(x) + cos(y)
         z = Math.sin(x) + Math.cos(y);
      }
      
      geo.attributes.position.setZ(i, z);
    }
    geo.computeVertexNormals();
    return geo;
  }, [mode]);

  return (
    <group rotation={[-Math.PI / 2, 0, 0]}>
      <mesh geometry={geometry}>
        <meshStandardMaterial side={THREE.DoubleSide} color={mode === 'limit' ? "#ec4899" : "#22d3ee"} wireframe={false} metalness={0.6} roughness={0.2} />
      </mesh>
      <mesh geometry={geometry}>
        <meshBasicMaterial side={THREE.DoubleSide} color="white" wireframe opacity={0.1} transparent />
      </mesh>
      
      {mode === 'derivative' && (
          // Tangent Plane Visual at (0,0)
          <mesh position={[0, 0, 2]} rotation={[0, 0, 0]}>
              <planeGeometry args={[3, 3]} />
              <meshBasicMaterial color="#fbbf24" transparent opacity={0.4} side={THREE.DoubleSide} />
          </mesh>
      )}
      
      {mode === 'limit' && (
          <mesh position={[0, 0, 2]}>
              <sphereGeometry args={[0.1]} />
              <meshBasicMaterial color="white" />
          </mesh>
      )}
    </group>
  );
};

export const Surface3DView: React.FC<Surface3DViewProps> = ({ mode }) => {
  const title = mode === 'function' ? 'Multivariable Surface' : mode === 'limit' ? '3D Limit (Sinc)' : 'Tangent Plane';
  const color = mode === 'function' ? 'text-cyan-400' : mode === 'limit' ? 'text-pink-400' : 'text-amber-400';

  return (
    <div className="space-y-6 h-[calc(100vh-140px)] flex flex-col pb-6">
      <header className="flex justify-between items-end border-b border-white/10 pb-4 shrink-0">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
            <Box className={color} /> {title}
          </h2>
          <p className="text-slate-400 text-sm max-w-2xl">
            {mode === 'limit' 
                ? 'Visualizing lim(x,y→0) of sin(r)/r. Note the peak at the origin.' 
                : mode === 'derivative' 
                    ? 'The tangent plane represents the local linear approximation of the surface.' 
                    : 'Exploring z = f(x,y) in 3D space.'}
          </p>
        </div>
      </header>

      <div className="flex-1 bg-slate-950 rounded-3xl border border-slate-800 relative overflow-hidden shadow-2xl">
        <Canvas camera={{ position: [8, 6, 8], fov: 45 }}>
          <color attach="background" args={['#020617']} />
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} intensity={1} />
          <OrbitControls makeDefault />
          <Grid infiniteGrid sectionSize={3} cellColor="#1e293b" sectionColor="#334155" fadeDistance={30} position={[0,-2,0]} />
          <SurfacePlot mode={mode} />
        </Canvas>
      </div>
    </div>
  );
};
