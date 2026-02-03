import React, { useMemo, useState, useRef } from "react";
import type { MutableRefObject } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from '@react-three/drei';
import { Environment } from "@react-three/drei";
import { OrbitControls as OrbitControlsImpl } from 'three-stdlib'; 
import * as THREE from "three";

import { CelestialBody } from "../physics/CelestialBody";
import { Star } from "../physics/Star";
import VisualizeBody, { CameraController } from "../components/VisualizeBody";
import CalculateGravity from "../components/CalculateGravity";
import { Grid } from "../components/VisualizeGrid";
import { Skybox } from "../components/Skybox";

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
            // 1. The Sun
            // Mass: 1000 (Dominant mass to keep orbits stable)
            new Star(
                10000.0,             // Mass
                [0, 0, 0],          // Position
                [0, 0, 0],          // Velocity (Stationary)
                35,                 // Radius
                0.005,              // Spin
                "white",           // Color
                "2k_sun.jpg",       // Texture
                1.5,                // Luminosity
                50                  // Light Intensity
            ),

            // 2. Hot Inner Planet ("Mercury")
            // Distance: 70
            // Velocity: sqrt(1000 / 70) ≈ 3.7
            new CelestialBody(
                10.0,
                [150, 0, 0],
                [0, 0, 600],        // Slightly higher velocity for elliptical orbit
                4,
                0.02,
                "white",
                "2k_mercury.jpg"       // Reusing Mars texture if available, or remove
            ),

            // 3. Earth-like Planet
            // Distance: 140
            // Velocity: sqrt(1000 / 140) ≈ 2.67
            new CelestialBody(
                2.0,
                [-400, 0, 0],       // Starting on opposite side
                [0, 0, 600],       // Velocity must be negative to orbit counter-clockwise from negative X
                8,
                0.01,
                "white",
                "2k_earth_daymap.jpg"
            ),

            // 5. Gas Giant ("Jupiter")
            // Distance: 300
            // Velocity: sqrt(1000 / 300) ≈ 1.82
            new CelestialBody(
                15,              // Heavy mass
                [0, 0, 1000],        // Starting on Z axis
                [600, 0, 0],        // Tangential velocity on X axis
                15,
                0.04,
                "orange",
                "2k_jupiter.jpg"    // Use fallback color if texture missing
            ),
        ];
    }, []);

    const [focusedRef, setFocusedRef] = useState<MutableRefObject<THREE.Mesh | null> | null>(null);
    const controlsRef = useRef<OrbitControlsImpl>(null);

    // Track whether or not to show the grid
    const [showGrid, setShowGrid] = useState(true);

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

                <Skybox />

                {bodies.map((body, index) => (
                    <VisualizeBody 
                        key={index} 
                        bodyData={body} 
                        setFocus={setFocusedRef} 
                    />
                ))}

                {showGrid && <Grid bodies={bodies} />}

                <PhysicsTick bodies={bodies} />
            </Canvas>

            {/* UI Overlay */}
            <div className="absolute inset-0 pointer-events-none flex flex-col justify-between">
                <div className="pointer-events-auto bg-gray-900/80 text-white p-4 backdrop-blur-sm flex justify-between items-center">
                    <h1 className="text-3xl text-white font-mono">Space<span className="text-info">Box</span></h1>
                    <div>
                        <input type="checkbox" defaultChecked className="toggle toggle-info" checked={showGrid} onChange={(e) => setShowGrid(e.target.checked)}/>
                        <span className="ml-2">Toggle Grid (Not Implemented)</span>
                    </div>
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