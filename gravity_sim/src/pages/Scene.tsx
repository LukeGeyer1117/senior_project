import React, { useState, useRef } from "react";
import type { MutableRefObject } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from '@react-three/drei';
import { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import * as THREE from "three";
import { CelestialBody } from "../physics/CelestialBody";
import VisualizeBody, { CameraController } from "../components/VisualizeBody";
import CalculateGravity from "../components/CalculateGravity";
// import Collide from "../components/Collision";
import { Grid } from "../components/VisualizeGrid";
import { Skybox } from "../components/Skybox";
import AmbientMusic from "../components/AmbientMusic";
import BodiesWindow from "../components/BodiesWindow";
import GridControls from "../components/GridControls";


// --- Types ---
interface PhysicsTickProps {
  bodies: CelestialBody[];
}

function PhysicsTick({ bodies }: PhysicsTickProps) {
  useFrame((_, delta) => {
    // Collide(bodies, delta);
    CalculateGravity(bodies, delta);
    bodies.forEach(body => body.updatePosition(delta));
  });
  return null;
}

export default function Scene() {
  const [bodies, setBodies] = useState<CelestialBody[]>(() => []);

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
        camera={{ position: [0, 100, 300], fov: 60, near: 0.1, far: 500000 }}
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
        <div className="pointer-events-auto bg-info-content/80 text-white p-4 backdrop-blur-sm flex justify-between items-center w-full h-[10vh]">
          <h1 className="text-3xl text-white font-mono">Space<span className="text-info">Box</span></h1>

          {/* Contains the music player for scene ambience */}
          <AmbientMusic />
          {/* Grid Controls */}
          <GridControls showGrid={showGrid} setShowGrid={setShowGrid} />

        </div>

        {/* The forms, lists, and buttons that allow adding planets and stars */}
        <div className="w-full h-full flex flex-row justify-between">
          <BodiesWindow bodies={bodies} setBodies={setBodies} focusedRef={focusedRef} setFocusedRef={setFocusedRef} />
        </div>
      </div>
    </div>
  );
}