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
                333000,
                [0, 0, 0],        // position
                [0, 0, 0],        // velocity
                3.0               // radius (big, dominant)
            ),

            // Earth
            new CelestialBody(
                1,
                [10, 0, 0],       // 20 units from Sun
                [0, 0, 3],     // circular orbit velocity
                .1               // radius
            ),

            // Moon
            new CelestialBody(
                .01,
                [10.5, 0, 0],       // 3 units from Earth
                [0, 0, 3],    // Earth velocity + Moon orbit
                0.01               // radius
            ),
        ];
    }, []);

    return (
    <Canvas shadows className="w-full h-full bg-black">
        <ambientLight intensity={0.2} />
        <spotLight 
            intensity={1} 
            castShadow 
            shadow-mapSize-width={2048} 
            shadow-mapSize-height={2048} 
            position={[10,10,10]} 
            angle={0.15} 
            penumbra={1} 
        />

        <OrbitControls />

        {bodies.map((body) => (
            <VisualizeBody bodyData={body} />
        ))}

        <mesh
        receiveShadow
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -10, 0]}
        >
        <planeGeometry args={[200, 200]} />
        <meshStandardMaterial color="#FFF" />
        </mesh>


        <PhysicsTick bodies={bodies} />
    </Canvas>
    );
}