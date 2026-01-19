import React from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from '@react-three/drei';
import { useMemo } from "react";    
import { CelestialBody } from "../physics/CelestialBody";
import VisualizeBody from "../components/VisualizeBody";
import CalculateGravity from "../components/CalculateGravity";

interface PhysicsTickProps {
    bodies: CelestialBody[];
}

function PhysicsTick({bodies}: PhysicsTickProps) {
    useFrame((state, delta) => {
        CalculateGravity(bodies, delta);
        bodies.forEach(body => {
            body.updatePosition(delta);
        });
    });

    return null;
}

export default function Scene() {
    const bodies = useMemo(() => {
        return [
            // Sun
            new CelestialBody(
                1.989e30,
                [0, 0, 0],        // position
                [0, 0, 0],        // velocity
                3.0               // radius (big, dominant)
            ),

            // Earth
            new CelestialBody(
                5.97e24,
                [10, 0, 0],       // 20 units from Sun
                [0, 0, 0],     // circular orbit velocity
                1.0               // radius
            ),

            // Moon
            new CelestialBody(
                7.35e22,
                [12, 0, 0],       // 3 units from Earth
                [0, 0, 0],    // Earth velocity + Moon orbit
                0.4               // radius
            ),
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