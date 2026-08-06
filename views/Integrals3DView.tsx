
import React, { useMemo, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Grid, Stage, Float } from '@react-three/drei';
import * as THREE from 'three';
import { Cylinder, Rotate3d, Maximize, Eye } from 'lucide-react';

export const Integrals3DView: React.FC = () => {
  const [segments, setSegments] = useState(32);
  const [activeFuncId, setActiveFuncId] = useState('parabola');
  const [heightRange, setHeightRange] = useState(6);
  const [showWireframe, setShowWireframe] = useState(false);

  const functions = {
      parabola: { 
          label: 'Parabola', 
          fn: (x: number) => 0.15 * x * x + 1,
          desc: 'f(x) = 0.15x² + 1'
      },
      sine: { 
          label: 'Sine Vase', 
          fn: (x: number) => Math.sin(x) * 0.5 + 1.5,
          desc: 'f(x) = sin(x)*0.5 + 1.5'
      },
      funnel: { 
          label: 'Trumpet', 
          fn: (x: number) => 2 / (Math.abs(x) + 1),
          desc: 'f(x) = 2/(|x|+1)'
      },
      cone: {
          label: 'Linear',
          fn: (x: number) => 0.4 * Math.abs(x) + 0.5,
          desc: 'f(x) = 0.4|x| + 0.5'
      }
  };

  const activeFunc = functions[activeFuncId as keyof typeof functions];

  const geometry = useMemo(() => {
    const points = [];
    const steps = 100;
    const start = -heightRange / 2;
    const end = heightRange / 2;
    
    for (let i = 0; i <= steps; i++) {
      const y = start + (i / steps) * heightRange; // Vertical axis in lathe logic
      const radius = activeFunc.fn(y);
      // Three.js Lathe rotates around Y axis. Vector2(radius, y)
      points.push(new THREE.Vector2(Math.max(0.01, radius), y));
    }
    return new THREE.LatheGeometry(points, segments);
  }, [activeFunc, heightRange, segments]);

  return (
    <div className="space-y-6 h-[calc(100vh-140px)] flex flex-col pb-6">
      <header className="flex flex-col md:flex-row justify-between items-end border-b border-white/10 pb-4 shrink-0 gap-4">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
            <Rotate3d className="text-emerald-400" /> Solid of Revolution
          </h2>
          <p className="text-slate-400 text-sm max-w-2xl">
            Generate 3D volumes by rotating a function <span className="font-mono text-emerald-400">f(x)</span> around the central axis. 
            This visualizes the method of disks/washers used in integral calculus.
          </p>
        </div>
      </header>

      <div className="flex-1 bg-slate-950 rounded-3xl border border-slate-800 relative overflow-hidden shadow-2xl flex flex-col md:flex-row">
        
        {/* Controls Overlay */}
        <div className="absolute top-4 left-4 z-10 w-64 bg-slate-900/90 backdrop-blur-md p-5 rounded-2xl border border-slate-700/50 flex flex-col gap-5 shadow-xl">
            <div>
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                    <Cylinder size={14}/> Generating Function
                </h4>
                <div className="grid grid-cols-2 gap-2">
                    {Object.entries(functions).map(([id, f]) => (
                        <button
                            key={id}
                            onClick={() => setActiveFuncId(id)}
                            className={`px-3 py-2 rounded-lg text-xs font-bold border transition-all ${activeFuncId === id ? 'bg-emerald-600 border-emerald-500 text-white shadow-lg shadow-emerald-900/50' : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'}`}
                        >
                            {f.label}
                        </button>
                    ))}
                </div>
                <div className="mt-2 text-[10px] font-mono text-emerald-400 text-center bg-emerald-900/10 p-1 rounded border border-emerald-900/30">
                    {activeFunc.desc}
                </div>
            </div>

            <div>
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                    <Maximize size={14}/> Dimensions
                </h4>
                <div className="space-y-4">
                    <div>
                        <div className="flex justify-between text-[10px] text-slate-400 mb-1">
                            <span>Height Range</span>
                            <span className="text-white">{heightRange}u</span>
                        </div>
                        <input 
                            type="range" min="2" max="10" step="0.5" 
                            value={heightRange} onChange={(e) => setHeightRange(parseFloat(e.target.value))}
                            className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                        />
                    </div>
                    <div>
                        <div className="flex justify-between text-[10px] text-slate-400 mb-1">
                            <span>Resolution (Segments)</span>
                            <span className="text-white">{segments}</span>
                        </div>
                        <input 
                            type="range" min="3" max="64" step="1" 
                            value={segments} onChange={(e) => setSegments(parseInt(e.target.value))}
                            className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                        />
                    </div>
                </div>
            </div>

            <div>
                <button 
                    onClick={() => setShowWireframe(!showWireframe)}
                    className={`w-full py-2 rounded-lg text-xs font-bold border transition-all flex items-center justify-center gap-2 ${showWireframe ? 'bg-white text-slate-900 border-white' : 'bg-transparent text-slate-300 border-slate-600 hover:border-slate-400'}`}
                >
                    <Eye size={14} /> Toggle Structure
                </button>
            </div>
        </div>

        {/* 3D Canvas */}
        <div className="w-full h-full">
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-5 pointer-events-none z-0"></div>
            <Canvas camera={{ position: [8, 6, 8], fov: 45 }} shadows>
            <color attach="background" args={['#020617']} />
            
            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} intensity={1} castShadow />
            <pointLight position={[-10, -5, -5]} intensity={0.5} color="#10b981" />
            
            <OrbitControls makeDefault autoRotate autoRotateSpeed={0.5} minPolarAngle={0} maxPolarAngle={Math.PI / 1.5} />
            
            <Grid infiniteGrid sectionSize={3} cellColor="#1e293b" sectionColor="#334155" fadeDistance={30} position={[0, -heightRange/2 - 1, 0]} />

            <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
                <group position={[0, 0, 0]}>
                    <mesh geometry={geometry} castShadow receiveShadow>
                        <meshStandardMaterial 
                            color="#10b981" 
                            side={THREE.DoubleSide} 
                            metalness={0.6} 
                            roughness={0.2} 
                            wireframe={showWireframe}
                            transparent
                            opacity={showWireframe ? 0.3 : 0.9}
                        />
                    </mesh>
                    
                    {/* Outline / Edge Highlight if not wireframe */}
                    {!showWireframe && (
                        <mesh geometry={geometry}>
                            <meshBasicMaterial color="#34d399" wireframe transparent opacity={0.1} side={THREE.DoubleSide} />
                        </mesh>
                    )}

                    {/* Central Axis Line */}
                    <mesh position={[0, 0, 0]}>
                        <cylinderGeometry args={[0.02, 0.02, heightRange + 2, 8]} />
                        <meshBasicMaterial color="#ef4444" opacity={0.8} transparent />
                    </mesh>
                </group>
            </Float>

            </Canvas>
            
            <div className="absolute bottom-4 right-4 pointer-events-none text-[10px] text-slate-500 font-mono bg-black/20 p-2 rounded backdrop-blur-sm">
                Left Click: Rotate • Scroll: Zoom • Right Click: Pan
            </div>
        </div>
      </div>
    </div>
  );
};
