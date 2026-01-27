import { useRef, useState } from "react";
import type { MutableRefObject, Dispatch, SetStateAction } from "react";
import { useFrame, useLoader } from "@react-three/fiber";
import * as THREE from "three";
import { CelestialBody } from "../physics/CelestialBody";
import { Star } from "../physics/Star";
import { OrbitControls } from 'three-stdlib';

// We need 2 Sub-Components. One for bodies with a texture, and one for bodies without.
// --- SUB-COMPONENT 1: For bodies WITH a texture ---
const MaterialWithTexture = ({ bodyData, texturePath }: { bodyData: CelestialBody, texturePath: string }) => {
    // This hook only runs when this specific component is rendered
    const texture = useLoader(THREE.TextureLoader, texturePath);

    return (
        <meshStandardMaterial
            map={texture}
            // If it's a star, we want the TEXTURE itself to glow
            emissiveMap={bodyData instanceof Star ? texture : undefined}
            emissive={bodyData instanceof Star ? new THREE.Color(bodyData.lightColor) : new THREE.Color(0x000000)}
            emissiveIntensity={bodyData instanceof Star ? bodyData.lightIntensity : 0}
            
            // Tint: If you want the exact texture colors, ensure bodyData.color is "white".
            // Otherwise, this color will tint the texture.
            color={bodyData.color} 
            roughness={0}
            metalness={0.0}
        />
    );
};

// --- SUB-COMPONENT 2: For bodies WITHOUT a texture ---
const MaterialSolid = ({ bodyData }: { bodyData: CelestialBody }) => {
    return (
        <meshStandardMaterial
            color={bodyData.color}
            emissive={bodyData instanceof Star ? bodyData.lightColor : undefined}
            emissiveIntensity={bodyData instanceof Star ? bodyData.lightIntensity : 0}
            roughness={0.6}
            metalness={0.0}
        />
    );
};

// 1. Define Props Interfaces
interface CameraProps {
  focusedRef: MutableRefObject<THREE.Mesh | null> | null;
  controlsRef: MutableRefObject<OrbitControls | null>;
}



// 2. The Camera Rig
export const CameraController = ({ focusedRef, controlsRef }: CameraProps) => {
  useFrame(() => {
    if (focusedRef?.current && controlsRef?.current) {
      const targetPos = new THREE.Vector3()
      // Now TypeScript knows getWorldPosition exists on focusedRef.current
      focusedRef.current.getWorldPosition(targetPos)
      
      controlsRef.current.target.lerp(targetPos, 0.1)
      controlsRef.current.update()
    }
  })
  return null
}

interface Props {
    bodyData: CelestialBody;
    setFocus: Dispatch<SetStateAction<MutableRefObject<THREE.Mesh | null> | null>>;
}

export default function VisualizeBody({ bodyData, setFocus }: Props) {
    const meshRef = useRef<THREE.Mesh>(null);
    // You don't strictly need a ref for the light anymore unless you plan to animate color/intensity
    const lightRef = useRef<THREE.PointLight>(null!);

    useFrame(() => {
        if (!meshRef.current) return;

        // Move the MESH. The child light will ride along automatically.
        meshRef.current.position.copy(bodyData.position);
        
        // --- REMOVED THE LIGHT UPDATE LOOP HERE ---
    });

    return (
        <>
            <mesh 
                castShadow={!(bodyData instanceof Star)} 
                receiveShadow={!(bodyData instanceof Star)} 
                ref={meshRef}
                onClick={(e) => {
                    e.stopPropagation(); // Prevent click events from bubbling up
                    setFocus(meshRef);
                }}
            >
                <sphereGeometry args={[bodyData.radius, 32, 32]} />
                
                {/* Conditionally Check if Texture exists in bodyData */}
                {bodyData.texture ? (
                    <MaterialWithTexture bodyData={bodyData} texturePath={bodyData.texture} />
                ) : (
                    <MaterialSolid bodyData={bodyData}/>
                )} 

                {/* Add a light source if star */}
                {bodyData instanceof Star && (
                    <pointLight
                        ref={lightRef}
                        color={bodyData.lightColor}
                        intensity={bodyData.lightIntensity}
                        distance={1000} 
                        decay={0} // See note below regarding physics-based lights
                        castShadow
                        shadow-mapSize-width={1024}
                        shadow-mapSize-height={1024}
                    />
                )}
            </mesh>
        </>
    );
}