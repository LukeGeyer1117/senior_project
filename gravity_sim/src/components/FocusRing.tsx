import { CelestialBody } from "../physics/CelestialBody";
import * as THREE from "three";
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";

interface FocusRingProps {
    body: CelestialBody | null;
}

function FocusRing({ body }: FocusRingProps) {
    const meshRef = useRef<THREE.Mesh>(null);

    useFrame(() => {
        if (body && meshRef.current) {
            meshRef.current.position.copy(body.position);
        }
    });

    if (!body) return null;

    return (
        <mesh ref={meshRef} rotation={[Math.PI / 2, 0, 0]}>
            <ringGeometry args={[body.radius * 1.3, body.radius * 1.8, 32]} />
            <meshBasicMaterial
                color="cyan"
                side={THREE.DoubleSide}
                transparent
                opacity={0.5}
            />
        </mesh>
    );
}

export default FocusRing;