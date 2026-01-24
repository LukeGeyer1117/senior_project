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
                100.0,
                [0, 0, 0],        // position
                [0, 0, 0],        // velocity
                20,               // radius (big, dominant)   
                "white",
                "2k_sun.jpg",
                1,
                5             
            ),

            // Earth
            new CelestialBody(
                0.0003003,
                [100, 0, 0],       // 20 units from Sun
                [0, 0, 62.83],     // circular orbit velocity
                2,              // radius
                "white",
                "2k_earth_daymap.jpg"
            ),

            // Moon
            new CelestialBody(
                .000005,
                [105, 0, 0],       // 3 units from Earth
                [0, 0, 65],    // Earth velocity + Moon orbit
                0.5,               // radius
                "gray",
                "2k_moon.jpg"
            ),
        ];
    }, []);

    return (
    <div className="relative w-screen h-screen">
        <Canvas 
            shadows 
            className="w-full h-full bg-black"
            // Set initial camera position and field of view
            camera={{ position: [0, 100, 300], fov: 60 }}
            >
            <OrbitControls />

            <ambientLight intensity={0.1} />

            {bodies.map((body) => (
                <VisualizeBody bodyData={body} />
            ))}
            <PhysicsTick bodies={bodies} />
        </Canvas>

        <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-6">
            {/* Top Panel */}
            <div className="pointer-events-auto bg-gray-900/80 text-white p-4 rounded-lg backdrop-blur-sm">
                <h1 className="text-xl font-bold">Solar System Control</h1>
                <p className="text-sm text-gray-300">OrbitControls work outside this box.</p>
            </div>

            {/* Bottom Controls */}
            <div className="flex gap-4">
                <button 
                    className="pointer-events-auto px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded transition"
                    onClick={() => console.log('Resetting Camera...')}
                >
                    Reset Camera
                </button>
                
                <button 
                    className="pointer-events-auto px-4 py-2 bg-green-600 hover:bg-green-500 text-white rounded transition"
                    onClick={() => console.log('Adding Body...')}
                >
                    Add Planet
                </button>
            </div>
        </div>
    </div>
    );
}