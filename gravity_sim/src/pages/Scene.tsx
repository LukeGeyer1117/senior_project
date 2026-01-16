import React from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from '@react-three/drei';
import { useMemo } from "react";    
import { CelestialBody } from "../physics/CelestialBody";
import VisualizeBody from "../components/VisualizeBody";

interface PhysicsTickProps {
    bodies: CelestialBody[];
}

function PhysicsTick({bodies}: PhysicsTickProps) {
    useFrame((state, delta) => {
        bodies.forEach(body => {
            body.updatePhysics(delta, bodies);
        });
    });

    return null;
}

export default function Scene() {
    const bodies = useMemo(() => {
        return [
            new CelestialBody(10000, [0,0,0], [0,0,0], 2),
            new CelestialBody(50, [15, 0, 0], [0, 0, 0], .5)
        ];
    }, []);

    return (
    <Canvas className="w-full h-full bg-black">
        <ambientLight intensity={0.5} />
        <spotLight position={[10,10,10]} angle={0.15} penumbra={1} />

        <OrbitControls />

        {bodies.map((body) => (
            <VisualizeBody bodyData={body} />
        ))}

        <PhysicsTick bodies={bodies} />
    </Canvas>
    );
}