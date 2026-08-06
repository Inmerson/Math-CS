
import React, { useState, useMemo, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Line, Text, Plane, Grid } from '@react-three/drei';
import * as THREE from 'three';
import { MatrixInput } from '../components/MatrixInput';
import { getDeterminant, fmt } from '../utils/matrixMath';
import { Box, RefreshCcw, Variable, MousePointer2, Layers } from 'lucide-react';

// --- Math Helpers ---

const interpolateMatrix = (m1: number[][], m2: number[][], t: number) => {
  return m1.map((row, r) => 
    row.map((val, c) => val + (m2[r][c] - val) * t)
  );
};

const multiplyVector = (m: number[][], v: {x: number, y: number, z: number}) => {
  return {
    x: m[0][0]*v.x + m[0][1]*v.y + m[0][2]*v.z,
    y: m[1][0]*v.x + m[1][1]*v.y + m[1][2]*v.z,
    z: m[2][0]*v.x + m[2][1]*v.y + m[2][2]*v.z,
  };
};

// --- 3D Components ---

const VectorArrow: React.FC<{ start?: THREE.Vector3; end: THREE.Vector3; color: string; label?: string; }> = ({ start = new THREE.Vector3(0,0,0), end, color, label }) => {
  const dir = new THREE.Vector3().subVectors(end, start).normalize();
  const length = start.distanceTo(end);
  
  if (length < 0.01) return null;

  return (
    <group>
      <arrowHelper args={[dir, start, length, color, 0.3, 0.15]} />
      {label && (
        <Text position={[end.x + 0.1, end.y + 0.1, end.z]} fontSize={0.25} color={color} fontWeight="bold" anchorX="left" anchorY="bottom" outlineWidth={0.02} outlineColor="#000">
          {label}
        </Text>
      )}
    </group>
  );
};

const WarpedPlane: React.FC<{ matrix: number[][] }> = ({ matrix }) => {
    // A 10x10 plane that gets transformed by the matrix
    const geometry = useMemo(() => {
        const geo = new THREE.PlaneGeometry(10, 10, 20, 20);
        const posAttribute = geo.attributes.position;
        const vertex = new THREE.Vector3();

        for (let i = 0; i < posAttribute.count; i++) {
            vertex.fromBufferAttribute(posAttribute, i);
            // Apply transformation manually to vertices
            const res = multiplyVector(matrix, {x: vertex.x, y: vertex.y, z: vertex.z}); // Plane is XY by default (z=0)
            posAttribute.setXYZ(i, res.x, res.y, res.z);
        }
        
        geo.computeVertexNormals();
        return geo;
    }, [matrix]);

    return (
        <group>
            <mesh geometry={geometry}>
                <meshBasicMaterial color="#3b82f6" wireframe transparent opacity={0.2} />
            </mesh>
            <mesh geometry={geometry}>
                <meshBasicMaterial color="#3b82f6" transparent opacity={0.05} side={THREE.DoubleSide} />
            </mesh>
        </group>
    );
};

// --- Main View ---

export const LinearTransformation3DView: React.FC = () => {
  const [targetMatrix, setTargetMatrix] = useState([
    [1, 0, 0],
    [0, 1, 0],
    [0, 0, 1]
  ]);
  
  const [t, setT] = useState(1);
  const [isAnimating, setIsAnimating] = useState(false);
  const [testVec, setTestVec] = useState({ x: 1, y: 1, z: 1 });

  const identityMatrix = [
      [1, 0, 0],
      [0, 1, 0],
      [0, 0, 1]
  ];

  const currentMatrix = useMemo(() => 
    interpolateMatrix(identityMatrix, targetMatrix, t)
  , [targetMatrix, t]);

  const det = useMemo(() => getDeterminant(currentMatrix), [currentMatrix]);

  // Transformed Basis Vectors
  const iHat = new THREE.Vector3(currentMatrix[0][0], currentMatrix[1][0], currentMatrix[2][0]);
  const jHat = new THREE.Vector3(currentMatrix[0][1], currentMatrix[1][1], currentMatrix[2][1]);
  const kHat = new THREE.Vector3(currentMatrix[0][2], currentMatrix[1][2], currentMatrix[2][2]);

  const outputVec = multiplyVector(currentMatrix, testVec);
  const outputVec3 = new THREE.Vector3(outputVec.x, outputVec.y, outputVec.z);
  const inputVec3 = new THREE.Vector3(testVec.x, testVec.y, testVec.z);

  useEffect(() => {
      let raf: number;
      if (isAnimating) {
          const animate = () => {
              setT(prev => {
                  if (prev >= 1) {
                      setIsAnimating(false);
                      return 1;
                  }
                  return prev + 0.02;
              });
              raf = requestAnimationFrame(animate);
          };
          raf = requestAnimationFrame(animate);
      }
      return () => cancelAnimationFrame(raf);
  }, [isAnimating]);

  const handlePreset = (type: string) => {
      setT(0);
      setTimeout(() => setIsAnimating(true), 100);

      switch(type) {
          case 'identity': setTargetMatrix([[1,0,0],[0,1,0],[0,0,1]]); break;
          case 'scale': setTargetMatrix([[2,0,0],[0,0.5,0],[0,0,1]]); break;
          case 'shear': setTargetMatrix([[1,1,0],[0,1,0],[0,0,1]]); break;
          case 'rotateZ':
              const rad = Math.PI / 4;
              setTargetMatrix([[Math.cos(rad), -Math.sin(rad), 0],[Math.sin(rad), Math.cos(rad), 0],[0, 0, 1]]);
              break;
          case 'projection': setTargetMatrix([[1,0,0],[0,1,0],[0,0,0]]); break;
          case 'random':
              setTargetMatrix([
                  [(Math.random()-0.5)*3, (Math.random()-0.5)*3, (Math.random()-0.5)*3],
                  [(Math.random()-0.5)*3, (Math.random()-0.5)*3, (Math.random()-0.5)*3],
                  [(Math.random()-0.5)*3, (Math.random()-0.5)*3, (Math.random()-0.5)*3],
              ]);
              break;
      }
  };

  return (
    <div className="space-y-6 h-[calc(100vh-140px)] flex flex-col pb-6">
      <header className="flex flex-col md:flex-row justify-between items-end border-b border-white/10 pb-4 shrink-0 gap-4">
        <div>
            <h2 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
                <Box className="text-cyan-400" /> Matrix Space Warper
            </h2>
            <p className="text-slate-400 text-sm max-w-2xl">
                Visualize how a linear transformation <span className="font-mono text-cyan-400">T(x) = Ax</span> deforms the entire fabric of space.
                The blue grid represents the XY plane being transformed.
            </p>
        </div>
        <div className="flex gap-6 items-center">
            <div className="text-right">
                <div className="text-[10px] uppercase text-slate-500 font-bold tracking-widest">Progress</div>
                <div className="flex items-center gap-2">
                    <input 
                        type="range" min="0" max="1" step="0.01" 
                        value={t} onChange={(e) => setT(parseFloat(e.target.value))}
                        className="w-24 h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                    />
                </div>
            </div>
            <div className="text-right pl-6 border-l border-white/10">
                <div className="text-[10px] uppercase text-slate-500 font-bold tracking-widest">Volume Scaling</div>
                <div className={`text-2xl font-mono font-bold ${det === 0 ? 'text-pink-500' : 'text-white'}`}>
                    {det !== null ? fmt(det) : 'Err'}
                </div>
            </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 flex-1 min-h-0">
        
        {/* Controls Sidebar */}
        <div className="lg:col-span-1 flex flex-col gap-6 overflow-y-auto pr-2 custom-scrollbar">
            <div className="grid grid-cols-3 gap-2">
                {[
                    {id: 'identity', label: 'Reset', icon: RefreshCcw},
                    {id: 'scale', label: 'Scale', icon: Layers},
                    {id: 'shear', label: 'Shear', icon: Variable},
                    {id: 'rotateZ', label: 'Rot Z', icon: RefreshCcw},
                    {id: 'projection', label: 'Flat', icon: Box},
                    {id: 'random', label: 'Chaos', icon: Variable},
                ].map(p => (
                    <button 
                        key={p.id} 
                        onClick={() => handlePreset(p.id)}
                        className="flex flex-col items-center justify-center p-3 bg-slate-900 border border-slate-700 rounded-xl hover:bg-slate-800 hover:border-cyan-500/50 transition-all group"
                    >
                        <p.icon size={16} className="mb-1 text-slate-500 group-hover:text-cyan-400" />
                        <span className="text-[10px] font-bold uppercase text-slate-400 group-hover:text-white">{p.label}</span>
                    </button>
                ))}
            </div>

            <div className="glass-panel p-5 rounded-2xl border border-slate-700">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xs font-bold text-slate-300 uppercase tracking-widest">Transformation Matrix A</h3>
                </div>
                <MatrixInput data={targetMatrix} onChange={(m) => {setTargetMatrix(m); setT(1);}} editable color="blue" />
            </div>

            <div className="bg-slate-900/50 p-5 rounded-2xl border border-slate-800 space-y-4">
                <h4 className="text-xs font-bold text-amber-400 uppercase tracking-widest flex items-center gap-2">
                    <MousePointer2 size={14}/> Test Vector v
                </h4>
                
                <div className="grid grid-cols-3 gap-2">
                    {['x', 'y', 'z'].map((axis) => (
                        <div key={axis} className="space-y-1">
                            <label className="text-[10px] text-slate-500 font-bold uppercase text-center block">{axis}</label>
                            <input 
                                type="number" 
                                value={testVec[axis as keyof typeof testVec]}
                                onChange={(e) => setTestVec(prev => ({...prev, [axis]: parseFloat(e.target.value)}))}
                                className="w-full bg-slate-950 border border-slate-700 rounded px-2 py-1 text-center text-sm font-mono text-amber-100 focus:border-amber-500 outline-none"
                            />
                        </div>
                    ))}
                </div>
            </div>
        </div>

        {/* 3D Canvas */}
        <div className="lg:col-span-3 bg-slate-950 rounded-3xl border border-slate-800 relative overflow-hidden shadow-2xl">
            <Canvas camera={{ position: [5, 5, 8], fov: 45 }}>
                <color attach="background" args={['#020617']} />
                
                <ambientLight intensity={0.4} />
                <pointLight position={[10, 10, 10]} intensity={1} />
                <pointLight position={[-10, -5, -10]} intensity={0.5} color="blue" />
                
                <OrbitControls makeDefault enablePan={true} minDistance={2} maxDistance={40} />

                <Grid infiniteGrid sectionSize={3} cellColor="#1e293b" sectionColor="#334155" fadeDistance={30} position={[0, -0.01, 0]} />

                {/* Axes */}
                <group position={[0,0,0]}>
                    <Line points={[[-10, 0, 0], [10, 0, 0]]} color="#ef4444" opacity={0.3} transparent />
                    <Line points={[[0, -10, 0], [0, 10, 0]]} color="#10b981" opacity={0.3} transparent />
                    <Line points={[[0, 0, -10], [0, 0, 10]]} color="#3b82f6" opacity={0.3} transparent />
                </group>

                {/* The Warping Plane */}
                <WarpedPlane matrix={currentMatrix} />

                {/* Transformed Basis Vectors */}
                <VectorArrow end={iHat} color="#f472b6" label="i" />
                <VectorArrow end={jHat} color="#a78bfa" label="j" />
                <VectorArrow end={kHat} color="#34d399" label="k" />

                {/* Test Vector */}
                <VectorArrow end={inputVec3} color="#64748b" label="v" />
                <VectorArrow end={outputVec3} color="#fbbf24" label="Av" />
                
                {/* Connection Line */}
                <Line points={[inputVec3, outputVec3]} color="#fbbf24" opacity={0.4} transparent lineWidth={1} segments dashed />

            </Canvas>

            <div className="absolute bottom-4 right-4 pointer-events-none text-[10px] text-slate-600 font-mono bg-black/20 p-2 rounded backdrop-blur-sm">
                Left Click: Rotate • Scroll: Zoom
            </div>
        </div>

      </div>
    </div>
  );
};
