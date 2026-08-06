import React, { useState, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Grid, Text, Float } from '@react-three/drei';
import * as THREE from 'three';
import { ArrowUpRight, Maximize2, Move3d, Variable } from 'lucide-react';
import { MathRenderer } from '../components/MathRenderer';

// Reuse VectorArrow component
const VectorArrow: React.FC<{ start?: THREE.Vector3; end: THREE.Vector3; color: string; label?: string; scale?: number }> = ({ start = new THREE.Vector3(0,0,0), end, color, label, scale = 1 }) => {
  const dir = new THREE.Vector3().subVectors(end, start).normalize();
  const length = start.distanceTo(end);
  
  if (length < 0.01) return null;

  return (
    <group>
      <arrowHelper args={[dir, start, length, color, 0.4 * scale, 0.2 * scale]} />
      {label && (
        <Text position={[end.x, end.y + 0.3, end.z]} fontSize={0.4} color={color} fontWeight="bold" outlineWidth={0.03} outlineColor="#000" anchorY="bottom">
          {label}
        </Text>
      )}
    </group>
  );
};

const PlaneSpan: React.FC<{ v1: THREE.Vector3, v2: THREE.Vector3 }> = ({ v1, v2 }) => {
    const geometry = useMemo(() => {
        const geo = new THREE.BufferGeometry();
        // Create a parallelogram from origin, v1, v1+v2, v2
        const vertices = new Float32Array([
            0, 0, 0,
            v1.x, v1.y, v1.z,
            v2.x, v2.y, v2.z,
            
            v1.x, v1.y, v1.z,
            v1.x + v2.x, v1.y + v2.y, v1.z + v2.z,
            v2.x, v2.y, v2.z
        ]);
        geo.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
        geo.computeVertexNormals();
        return geo;
    }, [v1, v2]);

    return (
        <mesh geometry={geometry}>
            <meshBasicMaterial color="white" transparent opacity={0.1} side={THREE.DoubleSide} />
        </mesh>
    );
};

export const VectorOperations3DView: React.FC = () => {
  const [u, setU] = useState({ x: 3, y: 0, z: 0 });
  const [v, setV] = useState({ x: 0, y: 3, z: 2 });
  const [showAdd, setShowAdd] = useState(true);
  const [showCross, setShowCross] = useState(true);
  const [showPlane, setShowPlane] = useState(true);

  const vecU = new THREE.Vector3(u.x, u.y, u.z);
  const vecV = new THREE.Vector3(v.x, v.y, v.z);
  
  const vecAdd = new THREE.Vector3().addVectors(vecU, vecV);
  const vecCross = new THREE.Vector3().crossVectors(vecU, vecV);
  const dotProd = vecU.dot(vecV);

  return (
    <div className="space-y-6 h-[calc(100vh-140px)] flex flex-col pb-6">
        <header className="flex flex-col md:flex-row justify-between items-end border-b border-white/10 pb-4 shrink-0 gap-4">
            <div>
                <h2 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
                    <Move3d className="text-cyan-400" /> Vector Operations 3D
                </h2>
                <p className="text-slate-400 text-sm max-w-2xl">
                    Interactive laboratory for visualizing <span className="text-cyan-400">Addition</span>, <span className="text-purple-400">Dot Product</span>, and <span className="text-amber-400">Cross Product</span> in 3D space.
                </p>
            </div>
            <div className="bg-slate-900/50 p-2 rounded-lg border border-slate-800 flex gap-4 text-xs font-mono">
                <div className="text-center">
                    <div className="text-slate-500 uppercase tracking-widest">Dot Product</div>
                    <div className="text-white font-bold text-lg">{dotProd.toFixed(1)}</div>
                </div>
                <div className="w-px bg-white/10"></div>
                <div className="text-center">
                    <div className="text-slate-500 uppercase tracking-widest">Cross Mag</div>
                    <div className="text-amber-400 font-bold text-lg">{vecCross.length().toFixed(1)}</div>
                </div>
            </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 flex-1 min-h-0">
            
            {/* Controls */}
            <div className="lg:col-span-1 flex flex-col gap-6 overflow-y-auto pr-2 custom-scrollbar">
                
                {/* Vector U Controls */}
                <div className="bg-slate-900/50 p-5 rounded-2xl border border-slate-800">
                    <h3 className="text-xs font-bold text-cyan-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                        <ArrowUpRight size={16}/> Vector u
                    </h3>
                    <div className="space-y-4">
                        {['x', 'y', 'z'].map((axis) => (
                            <div key={`u-${axis}`}>
                                <div className="flex justify-between text-[10px] text-slate-400 mb-1 font-bold uppercase">
                                    <span>{axis}-axis</span>
                                    <span className="text-white">{u[axis as keyof typeof u]}</span>
                                </div>
                                <input 
                                    type="range" min="-5" max="5" step="0.5" 
                                    value={u[axis as keyof typeof u]} 
                                    onChange={(e) => setU(p => ({...p, [axis]: parseFloat(e.target.value)}))}
                                    className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                                />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Vector V Controls */}
                <div className="bg-slate-900/50 p-5 rounded-2xl border border-slate-800">
                    <h3 className="text-xs font-bold text-purple-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                        <ArrowUpRight size={16}/> Vector v
                    </h3>
                    <div className="space-y-4">
                        {['x', 'y', 'z'].map((axis) => (
                            <div key={`v-${axis}`}>
                                <div className="flex justify-between text-[10px] text-slate-400 mb-1 font-bold uppercase">
                                    <span>{axis}-axis</span>
                                    <span className="text-white">{v[axis as keyof typeof v]}</span>
                                </div>
                                <input 
                                    type="range" min="-5" max="5" step="0.5" 
                                    value={v[axis as keyof typeof v]} 
                                    onChange={(e) => setV(p => ({...p, [axis]: parseFloat(e.target.value)}))}
                                    className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
                                />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Toggles */}
                <div className="bg-slate-900/50 p-5 rounded-2xl border border-slate-800 space-y-2">
                    <label className="flex items-center justify-between cursor-pointer group">
                        <span className="text-xs font-bold text-slate-400 group-hover:text-white transition-colors">Show Addition (u+v)</span>
                        <input type="checkbox" checked={showAdd} onChange={e => setShowAdd(e.target.checked)} className="accent-emerald-500"/>
                    </label>
                    <label className="flex items-center justify-between cursor-pointer group">
                        <span className="text-xs font-bold text-slate-400 group-hover:text-white transition-colors">Show Cross Product</span>
                        <input type="checkbox" checked={showCross} onChange={e => setShowCross(e.target.checked)} className="accent-amber-500"/>
                    </label>
                    <label className="flex items-center justify-between cursor-pointer group">
                        <span className="text-xs font-bold text-slate-400 group-hover:text-white transition-colors">Show Span Plane</span>
                        <input type="checkbox" checked={showPlane} onChange={e => setShowPlane(e.target.checked)} className="accent-white"/>
                    </label>
                </div>

                {/* Legend */}
                <div className="p-4 bg-black/20 rounded-xl border border-white/5 text-[10px] text-slate-500 space-y-2 font-mono">
                    <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-cyan-400"></div> Vector u</div>
                    <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-purple-400"></div> Vector v</div>
                    <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-emerald-400"></div> Sum (u+v)</div>
                    <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-amber-400"></div> Cross (u×v)</div>
                </div>
            </div>

            {/* 3D Viewport */}
            <div className="lg:col-span-3 bg-slate-950 rounded-3xl border border-slate-800 relative overflow-hidden shadow-2xl">
                <Canvas camera={{ position: [8, 8, 8], fov: 45 }}>
                    <color attach="background" args={['#020617']} />
                    <ambientLight intensity={0.5} />
                    <pointLight position={[10, 10, 10]} intensity={1} />
                    <pointLight position={[-10, -10, -10]} intensity={0.5} color="blue" />
                    
                    <OrbitControls makeDefault />
                    <Grid infiniteGrid sectionSize={1} cellColor="#1e293b" sectionColor="#334155" fadeDistance={30} />
                    
                    {/* Axes */}
                    <axesHelper args={[5]} />

                    {/* Vectors */}
                    <VectorArrow end={vecU} color="#22d3ee" label="u" />
                    <VectorArrow end={vecV} color="#a855f7" label="v" />

                    {/* Addition Parallelogram visual */}
                    {showAdd && (
                        <>
                            <VectorArrow start={vecU} end={vecAdd} color="#a855f7" scale={0.5} />
                            <VectorArrow start={vecV} end={vecAdd} color="#22d3ee" scale={0.5} />
                            <VectorArrow end={vecAdd} color="#10b981" label="u+v" />
                        </>
                    )}

                    {/* Cross Product */}
                    {showCross && (
                        <VectorArrow end={vecCross} color="#fbbf24" label="u×v" />
                    )}

                    {/* Plane */}
                    {showPlane && <PlaneSpan v1={vecU} v2={vecV} />}

                </Canvas>
                <div className="absolute bottom-4 right-4 pointer-events-none text-[10px] text-slate-600 font-mono bg-black/20 p-2 rounded backdrop-blur-sm">
                    Drag to Rotate • Scroll to Zoom
                </div>
            </div>
        </div>
    </div>
  );
};