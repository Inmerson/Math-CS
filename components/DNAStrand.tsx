
import React, { useMemo, useRef, useEffect, useLayoutEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Line } from '@react-three/drei';
import * as THREE from 'three';

export interface DNAStrandProps {
  radius: number;
  climb: number;
  frequency: number;
  showBonds: boolean;
  animate: boolean;
}

const tempObject = new THREE.Object3D();

export const DNAStrand: React.FC<DNAStrandProps> = ({
  radius,
  climb,
  frequency,
  showBonds,
  animate
}) => {
  const groupRef = useRef<THREE.Group>(null);

  // Refs for InstancedMeshes
  const meshARef = useRef<THREE.InstancedMesh>(null);
  const meshBRef = useRef<THREE.InstancedMesh>(null);
  const bondRef = useRef<THREE.InstancedMesh>(null);
  const bondGlowCyanRef = useRef<THREE.InstancedMesh>(null);
  const bondGlowPurpleRef = useRef<THREE.InstancedMesh>(null);

  useFrame((state, delta) => {
    if (animate && groupRef.current) {
      groupRef.current.rotation.y += delta * 0.2;
    }
  });

  const { strandA, strandB, connections } = useMemo(() => {
    const sA: THREE.Vector3[] = [];
    const sB: THREE.Vector3[] = [];
    const conns: { start: THREE.Vector3, end: THREE.Vector3, id: number }[] = [];
    const count = 40;
    const startOffset = -count * climb / 2;

    for (let i = 0; i < count; i++) {
      const angle = i * frequency;
      const y = startOffset + i * climb;

      // Helix A
      const xA = Math.cos(angle) * radius;
      const zA = Math.sin(angle) * radius;
      const vecA = new THREE.Vector3(xA, y, zA);
      sA.push(vecA);

      // Helix B (Phase shifted by PI)
      const xB = Math.cos(angle + Math.PI) * radius;
      const zB = Math.sin(angle + Math.PI) * radius;
      const vecB = new THREE.Vector3(xB, y, zB);
      sB.push(vecB);

      conns.push({ start: vecA, end: vecB, id: i });
    }
    return { strandA: sA, strandB: sB, connections: conns };
  }, [radius, climb, frequency]);

  useLayoutEffect(() => {
    // Strand A
    if (meshARef.current) {
        strandA.forEach((pos, i) => {
            tempObject.position.copy(pos);
            tempObject.rotation.set(0,0,0);
            tempObject.scale.set(1,1,1);
            tempObject.updateMatrix();
            meshARef.current!.setMatrixAt(i, tempObject.matrix);
        });
        meshARef.current.instanceMatrix.needsUpdate = true;
    }

    // Strand B
    if (meshBRef.current) {
        strandB.forEach((pos, i) => {
            tempObject.position.copy(pos);
            tempObject.rotation.set(0,0,0);
            tempObject.scale.set(1,1,1);
            tempObject.updateMatrix();
            meshBRef.current!.setMatrixAt(i, tempObject.matrix);
        });
        meshBRef.current.instanceMatrix.needsUpdate = true;
    }

    // Bonds
    if (showBonds && bondRef.current) {
        let cyanIndex = 0;
        let purpleIndex = 0;

        connections.forEach((conn, i) => {
            const center = new THREE.Vector3().addVectors(conn.start, conn.end).multiplyScalar(0.5);
            const length = conn.start.distanceTo(conn.end);
            const direction = new THREE.Vector3().subVectors(conn.end, conn.start).normalize();
            const quaternion = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction);

            // 1. White Bond Base
            tempObject.position.copy(center);
            tempObject.quaternion.copy(quaternion);
            // Original: <cylinderGeometry args={[0.03, 0.03, length, 8]} />
            // Instanced: radius=0.03, height=1. Scale Y by length.
            tempObject.scale.set(1, length, 1);
            tempObject.updateMatrix();
            bondRef.current!.setMatrixAt(i, tempObject.matrix);

            // 2. Glow Bond
            // Original: <cylinderGeometry args={[0.06, 0.06, length * 0.4, 8]} />
            //           scale={[1, 0.2, 1]}
            // Total height = length * 0.4 * 0.2 = length * 0.08
            // Instanced: radius=0.06, height=1. Scale Y by length * 0.08
            tempObject.scale.set(1, length * 0.4 * 0.2, 1);
            tempObject.updateMatrix();

            if (i % 2 === 0) {
                if (bondGlowCyanRef.current) {
                    bondGlowCyanRef.current.setMatrixAt(cyanIndex, tempObject.matrix);
                    cyanIndex++;
                }
            } else {
                if (bondGlowPurpleRef.current) {
                    bondGlowPurpleRef.current.setMatrixAt(purpleIndex, tempObject.matrix);
                    purpleIndex++;
                }
            }
        });
        bondRef.current.instanceMatrix.needsUpdate = true;

        if (bondGlowCyanRef.current) bondGlowCyanRef.current.instanceMatrix.needsUpdate = true;
        if (bondGlowPurpleRef.current) bondGlowPurpleRef.current.instanceMatrix.needsUpdate = true;
    }
  }, [strandA, strandB, connections, showBonds]);

  return (
    <group ref={groupRef}>
      {/* Strand A (Cyan) */}
      <Line points={strandA} color="#22d3ee" lineWidth={3} transparent opacity={0.6} />
      <instancedMesh ref={meshARef} args={[undefined, undefined, strandA.length]}>
        <sphereGeometry args={[0.15, 16, 16]} />
        <meshStandardMaterial color="#22d3ee" emissive="#22d3ee" emissiveIntensity={0.5} />
      </instancedMesh>

      {/* Strand B (Purple) */}
      <Line points={strandB} color="#a855f7" lineWidth={3} transparent opacity={0.6} />
      <instancedMesh ref={meshBRef} args={[undefined, undefined, strandB.length]}>
        <sphereGeometry args={[0.15, 16, 16]} />
        <meshStandardMaterial color="#a855f7" emissive="#a855f7" emissiveIntensity={0.5} />
      </instancedMesh>

      {/* Hydrogen Bonds */}
      {showBonds && (
        <>
             {/* Base White Bonds */}
             <instancedMesh ref={bondRef} args={[undefined, undefined, connections.length]}>
                <cylinderGeometry args={[0.03, 0.03, 1, 8]} />
                <meshStandardMaterial color="white" transparent opacity={0.2} />
             </instancedMesh>

             {/* Glow Cyan */}
             <instancedMesh ref={bondGlowCyanRef} args={[undefined, undefined, Math.ceil(connections.length / 2)]}>
                <cylinderGeometry args={[0.06, 0.06, 1, 8]} />
                <meshStandardMaterial color="#22d3ee" emissive="#22d3ee" emissiveIntensity={0.8} transparent opacity={0.6} />
             </instancedMesh>

             {/* Glow Purple */}
             <instancedMesh ref={bondGlowPurpleRef} args={[undefined, undefined, Math.floor(connections.length / 2)]}>
                <cylinderGeometry args={[0.06, 0.06, 1, 8]} />
                <meshStandardMaterial color="#a855f7" emissive="#a855f7" emissiveIntensity={0.8} transparent opacity={0.6} />
             </instancedMesh>
        </>
      )}
    </group>
  );
};
