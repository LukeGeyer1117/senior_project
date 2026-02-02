import React, { useRef } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';

const AnimatedGrid: React.FC = () => {
  const meshRef = useRef<THREE.Mesh>(null);

  // Grid Configuration
  const width = 10;
  const height = 10;
  const segments = 25; // Higher = smoother waves

  useFrame(({ clock }) => {
    if (!meshRef.current) return;

    const geometry = meshRef.current.geometry;
    const positions = geometry.attributes.position;
    const t = clock.getElapsedTime();

    for (let i = 0; i < positions.count; i++) {
      const x = positions.getX(i);
      const y = positions.getY(i);

      // Animation Logic: Sine waves based on position and time
      const waveX = Math.sin(x * 0.5 + t);
      const waveY = Math.cos(y * 0.3 + t);
      
      // Update Z (height)
      positions.setZ(i, (waveX + waveY) * 0.5);
    }

    positions.needsUpdate = true;
  });

  return (
    <mesh ref={meshRef} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[width, height, segments, segments]} />
      <meshBasicMaterial color="#00ff88" wireframe={true} side={THREE.DoubleSide} />
    </mesh>
  );
};

// This is the component your Router will render
const GridTest: React.FC = () => {
  return (
    <div style={{ width: '100%', height: '100vh', background: '#111' }}>
      <Canvas camera={{ position: [0, 8, 10], fov: 50 }}>
        <OrbitControls />
        <AnimatedGrid />
        <axesHelper args={[2]} />
      </Canvas>
    </div>
  );
};

export default GridTest;