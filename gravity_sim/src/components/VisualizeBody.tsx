import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { CelestialBody } from "../physics/CelestialBody";
import { Star } from "../physics/Star";

interface Props {
    bodyData: CelestialBody;
}

export default function VisualizeBody({bodyData}: Props) {
    const meshRef = useRef<THREE.Mesh>(null);
    const lightRef = useRef<THREE.PointLight>(null);

    useFrame(() => {
        if (!meshRef.current) return;

        meshRef.current.position.copy(bodyData.position);

        if (bodyData instanceof Star && lightRef.current) {
            lightRef.current.position.copy(bodyData.position);
        }
    });
    
    return (
        <>
            <mesh castShadow={!(bodyData instanceof Star)} receiveShadow={!(bodyData instanceof Star)} ref={meshRef}>
                <sphereGeometry args={[bodyData.radius, 32, 32]} />
                <meshStandardMaterial 
                    color={bodyData.color}
                    emissive={bodyData instanceof Star ? bodyData.lightColor : undefined}
                    emissiveIntensity={bodyData instanceof Star ? bodyData.lightIntensity : 0}
                    roughness={0.6}
                    metalness={0.0}
                />
                {bodyData instanceof Star && (
                    <pointLight
                        ref={lightRef}
                        color={bodyData.lightColor}
                        intensity={bodyData.lightIntensity}
                        distance={1000}
                        castShadow
                        shadow-mapSize-width={1024}
                        shadow-mapSize-height={1024}
                    />
                )}
            </mesh>
        </>
    );
}