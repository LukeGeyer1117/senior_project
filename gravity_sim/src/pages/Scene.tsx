import React, { useMemo, useState, useRef } from "react";
import type { MutableRefObject } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from '@react-three/drei';
import { OrbitControls as OrbitControlsImpl } from 'three-stdlib'; 
import * as THREE from "three";

import { CelestialBody } from "../physics/CelestialBody";
import { Star } from "../physics/Star";
import VisualizeBody, { CameraController } from "../components/VisualizeBody";
import CalculateGravity from "../components/CalculateGravity";
import { Grid } from "../components/VisualizeGrid";

// --- Types ---
interface PhysicsTickProps {
    bodies: CelestialBody[];
}

function PhysicsTick({ bodies }: PhysicsTickProps) {
    useFrame((state, delta) => {
        CalculateGravity(bodies, delta);
        bodies.forEach(body => body.updatePosition(delta));
    });
    return null;
}

export default function Scene() {
    // 1. Define Bodies
    const bodies = useMemo(() => {
        return [
            new Star(100.0, [100, 50, 0], [0, 0, 25], 20, .2, "white", "2k_sun.jpg", 1, 5),
            new Star(100.0, [-100, 50, 0], [0, 0, -25], 20, .2, "green", "2k_sun.jpg", 1, 5),
        ];
    }, []);

    const [focusedRef, setFocusedRef] = useState<MutableRefObject<THREE.Mesh | null> | null>(null);
    const controlsRef = useRef<OrbitControlsImpl>(null);

    // --- NEW: Handle Manual Panning ---
    // If user Right Clicks (Button 2), they want to Pan. We must unlock the camera.
    const handleCanvasClick = (e: React.PointerEvent) => {
        // Button 2 is Right Click. Buttons 4/middle are often used for pan too.
        if (e.button === 2) { 
            setFocusedRef(null);
        }
    };

    return (
        // Added onPointerDown to the container to catch interactions before they hit the canvas logic
        <div 
            className="relative w-screen h-screen"
            onPointerDown={handleCanvasClick}
            onContextMenu={(e) => e.preventDefault()} // Stop right-click menu showing up
        >
            <Canvas
                shadows
                className="w-full h-full bg-black"
                camera={{ position: [0, 100, 300], fov: 60, near: 0.1, far: 100000 }}
            >
                <OrbitControls 
                    ref={controlsRef} 
                    enablePan={true} // Ensure this is true
                    enableZoom={true} 
                    // Lower damping makes panning feel snappier
                    dampingFactor={0.1}
                />

                <ambientLight intensity={0.1} />
                <axesHelper args={[100]} />
                <CameraController focusedRef={focusedRef} controlsRef={controlsRef} />

                {bodies.map((body, index) => (
                    <VisualizeBody 
                        key={index} 
                        bodyData={body} 
                        setFocus={setFocusedRef} 
                    />
                ))}

                <Grid bodies={bodies} />

                <PhysicsTick bodies={bodies} />
            </Canvas>

            {/* UI Overlay */}
            <div className="absolute inset-0 pointer-events-none flex flex-col justify-between">
                <div className="pointer-events-auto bg-gray-900/80 text-white p-4 backdrop-blur-sm">
                    <h1 className="text-3xl text-white font-mono">Space<span className="text-info">Box</span></h1>
                </div>

                {focusedRef && (
                    <div className="pointer-events-auto flex justify-end">
                        <button
                            className="bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded transition"
                            onClick={() => setFocusedRef(null)}
                        >
                            Unlock Camera
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}