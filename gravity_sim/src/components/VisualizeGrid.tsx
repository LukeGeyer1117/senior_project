import React, { useState, useEffect, useMemo } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { CelestialBody } from '../physics/CelestialBody';
import { GRAVITY_CONSTANT } from './CalculateGravity';

// Define the maximum number of bodies the shader can loop through.
// WebGL requires a hardcoded constant integer for loop bounds.
const MAX_BODIES = 50;

const vertexShader = `
  uniform vec4 uBodies[${MAX_BODIES}];
  uniform int uBodyCount;
  uniform float uGravityConstant;

  void main() {
    // Local vertex position (PlaneGeometry starts on the XY plane locally)
    vec3 pos = position;
    
    // Calculate true world position to measure distance to bodies
    vec4 worldPos = modelMatrix * vec4(position, 1.0);

    float totalInfluence = 0.0;
    
    // WebGL requires loops to have a constant maximum size
    for(int i = 0; i < ${MAX_BODIES}; i++) {
      if (i >= uBodyCount) break;
      
      vec3 bPos = uBodies[i].xyz;
      float bMass = uBodies[i].w;

      // Distance on the XZ plane in World space
      float dx = worldPos.x - bPos.x;
      float dz = worldPos.z - bPos.z;
      float dist = sqrt(dx * dx + dz * dz);
      
      // Optimization: ignore very far objects
      if (dist < 10000.0) {
        totalInfluence += (uGravityConstant * bMass) / (dist + 1.0);
      }
    }

    // Apply deformation to local Z (maps to World Y because the mesh is rotated -90deg on X)
    pos.z -= totalInfluence;

    // Output final position
    gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(pos, 1.0);
  }
`;

const fragmentShader = `
  uniform vec3 uColor;
  
  void main() {
    gl_FragColor = vec4(uColor, 1.0);
    
    // Basic Three.js color space conversion
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
  }
`;

interface GridProps {
  bodies: CelestialBody[];
}

export const Grid: React.FC<GridProps> = ({ bodies }) => {
    const [segments, setSegments] = useState(40);
    const [size, setSize] = useState(200);

    // 1. Create standard Three.js uniforms explicitly.
    // useMemo ensures these references persist across re-renders.
    const uniforms = useMemo(() => ({
        uBodies: { value: Array.from({ length: MAX_BODIES }, () => new THREE.Vector4()) },
        uBodyCount: { value: 0 },
        uGravityConstant: { value: GRAVITY_CONSTANT },
        uColor: { value: new THREE.Color('#97aabb') }
    }), []);

    // 2. Handle standard DOM inputs for Grid controls
    useEffect(() => {
        const density_range = document.querySelector<HTMLInputElement>('#grid-density-range');
        const size_range = document.querySelector<HTMLInputElement>('#grid-size-range');

        if (!density_range || !size_range) return;

        const size_handler = () => setSize(Number(size_range.value));
        const density_handler = () => setSegments(Number(density_range.value));

        density_range.addEventListener('input', density_handler);
        size_range.addEventListener('input', size_handler);
        
        return () => {
            density_range.removeEventListener('input', density_handler);
            size_range.removeEventListener('input', size_handler);
        };
    }, []);

    // 3. Mutate the inner values of the uniforms directly on the animation loop
    useFrame(() => {
        const count = Math.min(bodies.length, MAX_BODIES);

        for (let i = 0; i < count; i++) {
            const body = bodies[i];
            // Pack the X, Y, Z position and Mass (W) into the Vector4
            uniforms.uBodies.value[i].set(
                body.position.x, 
                body.position.y, 
                body.position.z, 
                body.mass
            );
        }

        // Update the active count so the shader loop knows when to break early
        uniforms.uBodyCount.value = count;
    });

    return (
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry 
                key={segments} 
                args={[size, size, segments, segments]} 
            />
            
            {/* 4. Use standard shaderMaterial (lowercase = built-in R3F standard, not drei) */}
            <shaderMaterial 
                vertexShader={vertexShader}
                fragmentShader={fragmentShader}
                uniforms={uniforms}
                wireframe={true} 
                side={THREE.DoubleSide} 
                transparent={true}
            />
        </mesh>
    );
};