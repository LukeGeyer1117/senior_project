import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { CelestialBody } from "../physics/CelestialBody";

interface BodyVisualProps {
    bodyData: CelestialBody;
}

export default function VisualizeBody({bodyData}: BodyVisualProps) {
    const meshRef = useRef<THREE.Mesh>(null);

    useFrame(() => {
        if (!meshRef.current) return;

        meshRef.current.position.copy(bodyData.position);
    });
    
    return (
        <mesh ref={meshRef}>
            <sphereGeometry args={[bodyData.radius, 32, 32]} />
            <meshStandardMaterial color={"yellow"} />
        </mesh>
    );
}