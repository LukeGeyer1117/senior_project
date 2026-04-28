// REACT & THREE.JS IMPORTS
import React, { useState, useRef, useEffect } from "react";
import type { MutableRefObject } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Stats } from '@react-three/drei';
import * as THREE from "three";
import { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import { useSearchParams } from "react-router-dom";
import { Link } from "react-router-dom";

// SIMULATOR IMPORTS
import CalculateGravity from "../components/CalculateGravity";
import FocusRing from "../components/FocusRing";
import { CelestialBody } from "../physics/CelestialBody";
import { Planet } from "../physics/Planet";
import { Star } from "../physics/Star";
import VisualizeBody, { CameraController } from "../components/VisualizeBody";
import { Grid } from "../components/VisualizeGrid";
import { Skybox } from "../components/Skybox";

// COMPONENT IMPORTS
import AmbientMusic from "../components/AmbientMusic";
import BodiesWindow from "../components/BodiesWindow";
import GridControls from "../components/GridControls";
import GraphicsControls from "../components/GraphicsControls";
import PlaybackControls from "../components/PlaybackControls";
import Inspector from "../components/Inspector";

const DEFAULT_PLANET_TEXTURE = "2k_earth_daymap.jpg";
const DEFAULT_STAR_TEXTURE = "2k_sun.jpg";

// --- Types ---
interface PhysicsTickProps {
  bodies: CelestialBody[];
  playing: boolean;
  speed: number;
}

function PhysicsTick({ bodies, playing, speed }: PhysicsTickProps) {
  useFrame((_, delta) => {
    if (!playing) return;

    const safeDelta = Math.min(delta, 0.016); // cap at ~60fps timestep
    const scaledDelta = safeDelta * speed;

    CalculateGravity(bodies, scaledDelta);
    bodies.forEach(body => body.updatePosition(scaledDelta));
  });

  return null;
}

export default function Scene() {
  const [searchParams] = useSearchParams();
  const [bodies, setBodies] = useState<CelestialBody[]>(() => []);
  const [focusedRef, setFocusedRef] = useState<MutableRefObject<THREE.Mesh | null> | null>(null);
  const controlsRef = useRef<OrbitControlsImpl>(null);
  const [showGrid, setShowGrid] = useState(false);
  const [antiAlias, setAntiAlias] = useState(true);
  const [dpr, setDpr] = useState(1.0);
  const [powerPreference, setPowerPreference] = useState<"default" | "high-performance" | "low-power">("default");
  const [shadows, setShadows] = useState(true);
  const [playing, setPlaying] = useState(true);
  const [speed, setSpeed] = useState(1);

  const presetID = Number(searchParams.get("preset"));

  const [loadedPresetID, setLoadedPresetID] = useState<number | null>(null);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => setTick(t => t + 1), 16);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!presetID || presetID === -1 || loadedPresetID === presetID) return;

    const loadPreset = async () => {
      const preset_info = await getPresetFull(presetID);
      console.log(bodiesFromPreset(preset_info));
      setBodies(bodiesFromPreset(preset_info));
      setLoadedPresetID(presetID); // mark as loaded
    };

    loadPreset();
  }, [presetID, loadedPresetID]);

  // If user Right Clicks (Button 2), they want to Pan. We must unlock the camera.
  const handleCanvasClick = (e: React.PointerEvent) => {
    // Button 2 is Right Click. Buttons 4/middle are often used for pan too.
    if (e.button === 2) {
      setFocusedRef(null);
    }
  };

  const focusedBody =
    focusedRef?.current
      ? bodies.find(b => b.meshRef?.current === focusedRef.current) || null
      : null;

  return (
    // Added onPointerDown to the container to catch interactions before they hit the canvas logic
    <div
      className="relative w-screen h-screen"
      onPointerDown={handleCanvasClick}
      onContextMenu={(e) => e.preventDefault()} // Stop right-click menu showing up
    >
      <Canvas
        key={antiAlias ? 'aa-on' : 'aa-off'} // forces remount
        shadows
        className="w-full h-full bg-black"
        camera={{ position: [0, 100, 300], fov: 60, near: 0.1, far: 500000 }}
        dpr={dpr}
        gl={{ antialias: antiAlias, powerPreference: powerPreference }}
      >
        <OrbitControls
          ref={controlsRef}
          enablePan={true}
          enableZoom={true}
          dampingFactor={0.1}
        />
        <ambientLight intensity={0.1} />
        <axesHelper args={[100]} />
        <CameraController focusedRef={focusedRef} controlsRef={controlsRef} />
        <Skybox />
        <FocusRing
          body={focusedBody}
        />
        <Stats className="!top-auto !left-auto !right-2 !bottom-2 scale-200"/>

        {bodies.map((body, index) => (
          <VisualizeBody
            key={index}
            bodyData={body}
            setFocus={setFocusedRef}
          />
        ))}

        {showGrid && <Grid bodies={bodies} />}

        <PhysicsTick bodies={bodies} playing={playing} speed={speed} />
      </Canvas>

      {/* UI Overlay */}
      <div className="absolute inset-0 pointer-events-none flex flex-col justify-between">
        {/* Top Bar */}
        <div className="pointer-events-auto bg-info-content/80 text-white p-4 backdrop-blur-sm flex justify-between items-center w-full h-[10vh]">
          <Link to={"/"} className="text-xl font-bold">Space<span className="text-info">Box</span></Link>
          {/* Grid Controls */}
          <div>
            <GridControls showGrid={showGrid} setShowGrid={setShowGrid} />
            <GraphicsControls antiAlias={antiAlias} setAntiAlias={setAntiAlias} dpr={dpr} setDpr={setDpr} powerPreference={powerPreference} setPowerPreference={setPowerPreference} shadows={shadows} setShadows={setShadows} />
          </div>
        </div>

        <Inspector body={focusedBody} tick={tick} />

        {/* The forms, lists, and buttons that allow adding planets and stars */}
        <div className="w-full h-full flex flex-row justify-between items-end">
          <BodiesWindow bodies={bodies} setBodies={setBodies} focusedRef={focusedRef} setFocusedRef={setFocusedRef} />

          {/* The botom bar */}
          <div className="flex-grow flex items-center justify-center">
            <div className="flex flex-row justify-center items-center w-fit h-fit px-6 py-2 bg-info-content/80 pointer-events-auto rounded-lg gap-4">
              <PlaybackControls playing={playing} setPlaying={setPlaying} speed={speed} setSpeed={setSpeed} />
              <AmbientMusic />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

async function getPresetFull(presetID: number) {
  const response = await fetch(`http://localhost:3001/api/presets/${presetID}/full`, {
    method: "GET"
  })

  if (!response.ok) {
    console.error(`Failed to fetch full preset: ${await response.json()}`)
  }

  const data = await response.json();
  console.log(data);
  return data;
}

const bodiesFromPreset = (preset: any): CelestialBody[] => {
  const planets = (preset.planets || []).map((p: any) => {
    const texture = p.texture_path && p.texture_path !== "test"
      ? p.texture_path
      : DEFAULT_PLANET_TEXTURE;

    const ref = React.createRef<THREE.Mesh>();

    const planet = new Planet(
      p.mass,
      [p.position_x, p.position_y, p.position_z],
      [p.velocity_x, p.velocity_y, p.velocity_z],
      p.radius,
      p.spin,
      p.color,
      p.trail_color,
      texture,
      p.name
    );

    planet.meshRef = ref;
    return planet;
  });

  const stars = (preset.stars || []).map((s: any) => {
    const texture = s.texture_path && s.texture_path !== "test"
      ? s.texture_path
      : DEFAULT_STAR_TEXTURE;

    const ref = React.createRef<THREE.Mesh>();

    const star = new Star(
      s.mass,
      [s.position_x, s.position_y, s.position_z],
      [s.velocity_x, s.velocity_y, s.velocity_z],
      s.radius,
      s.spin,
      s.color,
      s.trail_color,
      texture,
      s.name,
      1, // luminosity
      s.light_intensity
    );

    star.meshRef = ref;
    return star;
  });

  return [...stars, ...planets];
};