import React, { useRef, useState, useEffect } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { CelestialBody } from '../physics/CelestialBody';
import { GRAVITY_CONSTANT } from './CalculateGravity';

// 1. Add an interface for props to bring in 'bodies'
interface GridProps {
  bodies: CelestialBody[];
}

export const Grid: React.FC<GridProps> = ({ bodies }) => {
    const meshRef = useRef<THREE.Mesh>(null);
    const [segments, setSegments] = useState(40);
    const [size, setSize] = useState(10000);

    // Grid Configuration
    useEffect(() => {
        const density_range = document.querySelector<HTMLInputElement>('#grid-density-range');
        if (!density_range) return;

        const handler = () => setSegments(Number(density_range.value));

        density_range.addEventListener('input', handler);
        return () => {density_range.removeEventListener('input', handler);}

    }, [])

    useFrame(() => {
        // Get the number of segements that the grid needs

        if (!meshRef.current) return;

        const geometry = meshRef.current.geometry;
        const positions = geometry.attributes.position;

        // 2. We loop through vertices directly inside useFrame
        for (let i = 0; i < positions.count; i++) {
            // Get local vertex positions
            // Note: PlaneGeometry is created on XY. 
            // Since you rotate it -90 on X, Local Y = World Z.
            const localX = positions.getX(i); 
            const localY = positions.getY(i); 

            let totalInfluence = 0;

            for (let j = 0; j < bodies.length; j++) {
                const body = bodies[j];
                const [bx, by, bz] = body.position; // Assuming [x, y, z]

                // Calculate distance on the XZ plane (Local X vs World X, Local Y vs World Z)
                const dx = localX - bx;
                const dz = -localY - bz; 
                
                // We add a small epsilon (0.1) to distance to prevent division by zero
                const distance = Math.sqrt(dx * dx + dz * dz);
                
                // Calculate gravity drop
                if (distance < 10000) { // Optimization: Ignore very far objects
                     totalInfluence += (GRAVITY_CONSTANT * body.mass) / (distance + 1); 
                }
            }

            // 3. Set Z (which is World Y/Height due to rotation)
            // IMPORTANT: Set absolute value (0 - influence), not relative (current - influence)
            positions.setZ(i, 0 - totalInfluence);
        }

        positions.needsUpdate = true;
        
        // Optional: Recompute normals if you want lighting to react to the curves
        // geometry.computeVertexNormals(); 
    });

    return (
        <mesh ref={meshRef} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry 
            key={segments} 
            args={[size, size, segments, segments]} />

            <meshBasicMaterial 
            color="#97aabb" 
            wireframe={true} 
            side={THREE.DoubleSide} />
        </mesh>
    );
};