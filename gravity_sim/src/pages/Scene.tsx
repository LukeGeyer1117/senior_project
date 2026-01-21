import React from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from '@react-three/drei';
import { useMemo } from "react";    
import { CelestialBody } from "../physics/CelestialBody";
import { Star } from "../physics/Star";
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
            new Star(
                333000,
                [0, 0, 0],        // position
                [0, 0, 0],        // velocity
                3.0,               // radius (big, dominant)   
                "yellow",
                "2k_sun.jpg"             
            ),

            // Earth
            new CelestialBody(
                1,
                [20, 0, 0],       // 20 units from Sun
                [0, 0, .2],     // circular orbit velocity
                .1,              // radius
                "white",
                "2k_earth_daymap.jpg"
            ),

            // // Moon
            // new CelestialBody(
            //     .01,
            //     [21, 0, 0],       // 3 units from Earth
            //     [0, 0, 3],    // Earth velocity + Moon orbit
            //     0.01               // radius
            // ),
        ];
    }, []);

    return (
    <Canvas shadows className="w-full h-full bg-black">
        <OrbitControls />

        <ambientLight intensity={0.1} />

        {bodies.map((body) => (
            <VisualizeBody bodyData={body} />
        ))}
        <PhysicsTick bodies={bodies} />
    </Canvas>
    );
}