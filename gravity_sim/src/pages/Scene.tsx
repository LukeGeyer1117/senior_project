import React, { useMemo, useState, useRef } from "react";
import type { MutableRefObject } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from '@react-three/drei';
import { OrbitControls as OrbitControlsImpl } from 'three-stdlib'; 
import * as THREE from "three";

import { CelestialBody } from "../physics/CelestialBody";
import { Star } from "../physics/Star";
import { Planet } from "../physics/Planet";
import VisualizeBody, { CameraController } from "../components/VisualizeBody";
import CalculateGravity from "../components/CalculateGravity";
// import Collide from "../components/Collision";
import { Grid } from "../components/VisualizeGrid";
import { Skybox } from "../components/Skybox";

// --- Types ---
interface PhysicsTickProps {
    bodies: CelestialBody[];
}

function PhysicsTick({ bodies }: PhysicsTickProps) {
    useFrame((state, delta) => {
        // Collide(bodies, delta);
        CalculateGravity(bodies, delta);
        bodies.forEach(body => body.updatePosition(delta));
    });
    return null;
}

export default function Scene() {

    const [bodies, setBodies] = useState<CelestialBody[]>(() => []);

    const addStar = (mass: number, position: [number, number, number], velocity: [number, number, number], radius: number, spin: number, color: string, texture: string, name: string, luminosity: number, lightIntensity: number) => {
        const newStar = new Star(mass, position, velocity, radius, spin, color, texture, name, luminosity, lightIntensity);

        setBodies(prev => [...prev, newStar]);
    }

    const addPlanet = (mass: number, position: [number, number, number], velocity: [number, number, number], radius: number, spin: number, color: string, texture?: string, name?: string) => {
    const newPlanet = new Planet(mass, position, velocity, radius, spin, color, texture, name);

    setBodies(prev => [...prev, newPlanet]);
    }
 
    const [focusedRef, setFocusedRef] = useState<MutableRefObject<THREE.Mesh | null> | null>(null);
    const controlsRef = useRef<OrbitControlsImpl>(null);

    // Track whether or not to show the grid
    const [showGrid, setShowGrid] = useState(true);
    const [showStarForm, setShowStarForm] = useState(false);
    const [showPlanetForm, setShowPlanetForm] = useState(false);

    // 1. Create a state object to hold the form values
    const [starParams, setStarParams] = useState({
        name: `Star-${Date.now()}`,
        mass: 100,
        spin: 0.1,
        radius: 10,
        posX: 0, posY: 0, posZ: 0,
        velX: 0, velY: 0, velZ: 0,
        color: "#ffffff",
        intensity: 1,
        texture: "2k_sun.jpg"
    });

    // 2. Create the handler that triggers when you click the "Checkmark" button
    const handleConfirmStar = () => {
        console.log(starParams);
        addStar(
            Number(starParams.mass),                                // mass
            [Number(starParams.posX), Number(starParams.posY), Number(starParams.posZ)], // position [x,y,z]
            [Number(starParams.velX), Number(starParams.velY), Number(starParams.velZ)], // velocity [x,y,z]
            Number(starParams.radius),                              // radius
            Number(starParams.spin),                                // spin
            starParams.color,                                       // color
            starParams.texture,                                     // texture
            starParams.name,                                        // name
            1,                                                      // luminosity (defaulting to 1 as form lacks input)
            Number(starParams.intensity)                            // lightIntensity
        );
        
        // Optional: Close the form and reset name for next time
        setShowStarForm(false);
        setStarParams(prev => ({...prev, name: `Star-${Date.now()}`}));
    };

    const [planetParams, setPlanetParams] = useState({
        name: `Planet-${Date.now()}`,
        mass: 1,
        spin: 0.1,
        radius: 1.5,
        posX: 0, posY: 0, posZ: 0,
        velX: 0, velY: 0, velZ: 0,
        color: "#FFFFFF",
        texture: "2k_earth_daymap.jpg"
    })

    const handleConfirmPlanet = () => {
        console.log(planetParams);
        addPlanet(
            Number(planetParams.mass),
            [Number(planetParams.posX), Number(planetParams.posY), Number(planetParams.posZ)],
            [Number(planetParams.velX), Number(planetParams.velY), Number(planetParams.velZ)],
            Number(planetParams.radius),
            Number(planetParams.spin),
            planetParams.color,
            planetParams.texture,
            planetParams.name,
        )

        setShowPlanetForm(false);
        setPlanetParams(prev => ({...prev, name: `Planet-${Date.now()}`}));
    }

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
                <div className="pointer-events-auto bg-info-content/80 text-white p-4 backdrop-blur-sm flex justify-between items-center">
                    <h1 className="text-3xl text-white font-mono">Space<span className="text-info">Box</span></h1>
                    <div className="dropdown dropdown-end">
                        <div tabIndex={0} role="button" className="btn m-1 bg-transparent border-none">Grid Controls</div>
                        <ul tabIndex={-1} className="dropdown-content menu bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm">
                            <li>
                                <fieldset className="fieldset">
                                    <legend className="fieldset-legend">Grid Size</legend>
                                    <input id="grid-size-range" type="range" min={500} max={100000} defaultValue={200} className="range range-sm range-info"/>
                                </fieldset>
                            </li>
                            <li>
                                <fieldset className="fieldset">
                                    <legend className="fieldset-legend">Grid Density</legend>
                                    <input id="grid-density-range" type="range" min="20" max="300" defaultValue="40" className="range range-sm range-info" />
                                </fieldset>
                            </li>
                            <li>
                                <fieldset className="fieldset">
                                    <legend className="fieldset-legend">Grid On/Off</legend>
                                    <input type="checkbox" className="toggle toggle-sm toggle-info" checked={showGrid} onChange={(e) => setShowGrid(e.target.checked)}/>
                                </fieldset>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="w-full h-full">
                    <ul className="menu bg-info-content/70 w-100 h-full pointer-events-auto">
                    <li>
                        <details>
                            <summary>Objects</summary>
                            <ul>
                                <li>
                                <details>
                                    <summary>Stars</summary>
                                    <ul>
                                        {showStarForm && (
                                            <li id="new-star-form">
                                                <fieldset className="fieldset flex flex-col px-0">
                                                    <legend className="fieldset-legend">Star Details</legend>

                                                    {/* NAME */}
                                                    <div className="flex flex-col w-full">
                                                        <label className="label">Star Name</label>
                                                        <input 
                                                            type="text" 
                                                            className="input input-sm w-full" 
                                                            value={starParams.name}
                                                            onChange={(e) => setStarParams({...starParams, name: e.target.value})}
                                                        />
                                                    </div>

                                                    {/* MASS / SPIN / RADIUS */}
                                                    <div className="flex flex-row gap-1">
                                                        <div className="flex flex-col">
                                                            <label className="label">Mass</label>
                                                            <input 
                                                                className="input input-sm" 
                                                                type="number" 
                                                                value={starParams.mass}
                                                                onChange={(e) => setStarParams({...starParams, mass: parseFloat(e.target.value)})}
                                                            />
                                                        </div>
                                                        <div className="flex flex-col">
                                                            <label className="label">Spin</label>
                                                            <input 
                                                                className="input input-sm" 
                                                                type="number" 
                                                                step="0.01"
                                                                value={starParams.spin}
                                                                onChange={(e) => setStarParams({...starParams, spin: parseFloat(e.target.value)})}
                                                            />
                                                        </div>
                                                        <div className="flex flex-col">
                                                            <label className="label">Radius</label>
                                                            <input 
                                                                className="input input-sm" 
                                                                type="number" 
                                                                value={starParams.radius}
                                                                onChange={(e) => setStarParams({...starParams, radius: parseFloat(e.target.value)})}
                                                            />
                                                        </div>
                                                    </div>

                                                    {/* POSITION */}
                                                    <div className="flex flex-col">
                                                        <label className="label">Position (X, Y, Z)</label>
                                                        <div className="flex flex-row join">
                                                            <input type="number" className="input input-sm join-item w-full" placeholder="X" value={starParams.posX} onChange={(e) => setStarParams({...starParams, posX: parseFloat(e.target.value)})} />
                                                            <input type="number" className="input input-sm join-item w-full" placeholder="Y" value={starParams.posY} onChange={(e) => setStarParams({...starParams, posY: parseFloat(e.target.value)})} />
                                                            <input type="number" className="input input-sm join-item w-full" placeholder="Z" value={starParams.posZ} onChange={(e) => setStarParams({...starParams, posZ: parseFloat(e.target.value)})} />
                                                        </div>
                                                    </div>

                                                    {/* VELOCITY */}
                                                    <div className="flex flex-col">
                                                        <label className="label">Velocity (X, Y, Z)</label>
                                                        <div className="flex flex-row join">
                                                            <input type="number" className="input input-sm join-item w-full" placeholder="X" value={starParams.velX} onChange={(e) => setStarParams({...starParams, velX: parseFloat(e.target.value)})} />
                                                            <input type="number" className="input input-sm join-item w-full" placeholder="Y" value={starParams.velY} onChange={(e) => setStarParams({...starParams, velY: parseFloat(e.target.value)})} />
                                                            <input type="number" className="input input-sm join-item w-full" placeholder="Z" value={starParams.velZ} onChange={(e) => setStarParams({...starParams, velZ: parseFloat(e.target.value)})} />
                                                        </div>
                                                    </div>

                                                    {/* COLOR / INTENSITY / TEXTURE */}
                                                    <div className="flex flex-row gap-4">
                                                        <div className="flex flex-col">
                                                            <label className="label">Color</label>
                                                            <input 
                                                                className="input input-sm" 
                                                                type="color" 
                                                                value={starParams.color}
                                                                onChange={(e) => setStarParams({...starParams, color: e.target.value})}
                                                            />
                                                        </div>
                                                        <div className="flex flex-col">
                                                            <label className="label">Intensity</label>
                                                            <input 
                                                                className="input input-sm w-20" 
                                                                type="number" 
                                                                value={starParams.intensity}
                                                                onChange={(e) => setStarParams({...starParams, intensity: parseFloat(e.target.value)})}
                                                            />
                                                        </div>
                                                        <div className="flex flex-col">
                                                            <label className="label">Texture</label>
                                                            <select 
                                                                className="select select-sm w-24" 
                                                                value={starParams.texture}
                                                                onChange={(e) => setStarParams({...starParams, texture: e.target.value})}
                                                            >
                                                                <option value="2k_sun.jpg">Sun</option>
                                                                {/* Add other options here if needed */}
                                                            </select>
                                                        </div>
                                                        
                                                        {/* FINISH BUTTON */}
                                                        <div className="flex flex-col justify-end">
                                                            <button 
                                                                id="confirm-star-button" 
                                                                className="btn btn-sm btn-success"
                                                                onClick={handleConfirmStar} // <--- Connected here!
                                                            >
                                                                <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                                                            </button>
                                                        </div>
                                                    </div>
                                                </fieldset>
                                            </li>
                                        )}
                                        <li>
                                        <button 
                                            className={`btn btn-sm w-full ${showStarForm ? 'btn-outline btn-error' : 'btn-outline btn-info'}`}
                                            onClick={() => setShowStarForm(!showStarForm)}
                                        >
                                            {showStarForm ? "Cancel" : "Add Star"}
                                        </button>
                                        </li>
                                        {bodies.map((body) => (
                                            body instanceof Star &&(
                                                <li key={body.name}><a>{body.name}</a></li>
                                            )
                                        ))}
                                    </ul>
                                </details>
                                </li>
                                <li>
                                    <details>
                                        <summary>Planets</summary>
                                        <ul>
                                            {showPlanetForm && (
                                            <li id="new-planet-form">
                                           <fieldset className="fieldset flex flex-col px-0">
                                            <legend className="fieldset-legend">Planet Details</legend>
                                            
                                            {/* NAME */}
                                            <div className="flex flex-col w-full">
                                                <label className="label">Planet Name</label>
                                                <input 
                                                    type="text" 
                                                    className="input input-sm w-full" 
                                                    value={planetParams.name}
                                                    onChange={(e) => setPlanetParams({...planetParams, name: e.target.value})}
                                                />
                                            </div>

                                            {/* MASS / DENSITY / RADIUS */}
                                            <div className="flex flex-row gap-1">
                                                <div className="flex flex-col">
                                                    <label className="label">Mass</label>
                                                    <input 
                                                        className="input input-sm" type="number" 
                                                        value={planetParams.mass}
                                                        onChange={(e) => setPlanetParams({...planetParams, mass: parseFloat(e.target.value)})}
                                                    />
                                                </div>
                                                <div className="flex flex-col">
                                                    <label className="label">Density</label>
                                                    <input 
                                                        className="input input-sm" type="number" step="0.1"
                                                        value={planetParams.spin}
                                                        onChange={(e) => setPlanetParams({...planetParams, spin: parseFloat(e.target.value)})}
                                                    />
                                                </div>
                                                <div className="flex flex-col">
                                                    <label className="label">Radius</label>
                                                    <input 
                                                        className="input input-sm" type="number" 
                                                        value={planetParams.radius}
                                                        onChange={(e) => setPlanetParams({...planetParams, radius: parseFloat(e.target.value)})}
                                                    />
                                                </div>
                                            </div>

                                            {/* POSITION */}
                                            <div className="flex flex-col">
                                                <label className="label">Position</label>
                                                <div className="flex flex-row join">
                                                    <input type="number" className="join-item input input-sm w-full" placeholder="X" value={planetParams.posX} onChange={(e) => setPlanetParams({...planetParams, posX: parseFloat(e.target.value)})} />
                                                    <input type="number" className="join-item input input-sm w-full" placeholder="Y" value={planetParams.posY} onChange={(e) => setPlanetParams({...planetParams, posY: parseFloat(e.target.value)})} />
                                                    <input type="number" className="join-item input input-sm w-full" placeholder="Z" value={planetParams.posZ} onChange={(e) => setPlanetParams({...planetParams, posZ: parseFloat(e.target.value)})} />
                                                </div>
                                            </div>

                                            {/* VELOCITY */}
                                            <div className="flex flex-col">
                                                <label className="label">Velocity</label>
                                                <div className="flex flex-row join">
                                                    <input type="number" className="join-item input input-sm w-full" placeholder="X" value={planetParams.velX} onChange={(e) => setPlanetParams({...planetParams, velX: parseFloat(e.target.value)})} />
                                                    <input type="number" className="join-item input input-sm w-full" placeholder="Y" value={planetParams.velY} onChange={(e) => setPlanetParams({...planetParams, velY: parseFloat(e.target.value)})} />
                                                    <input type="number" className="join-item input input-sm w-full" placeholder="Z" value={planetParams.velZ} onChange={(e) => setPlanetParams({...planetParams, velZ: parseFloat(e.target.value)})} />
                                                </div>
                                            </div>

                                            {/* TEXTURE & COLOR */}
                                            <div className="flex flex-row gap-4">
                                                <div className="flex flex-col">
                                                    <label className="label">Texture</label>
                                                    <select 
                                                        className="select select-sm w-32"
                                                        value={planetParams.texture}
                                                        onChange={(e) => setPlanetParams({...planetParams, texture: e.target.value})}
                                                    >
                                                        <option value="2k_earth_daymap.jpg">Earth</option>
                                                        <option value="2k_jupiter.jpg">Jupiter</option>
                                                        <option value="2k_mars.jpg">Mars</option>
                                                        <option value="2k_moon.jpg">Moon</option>
                                                        <option value="2k_uranus.jpg">Uranus</option>
                                                        <option value="2k_venus_atmosphere.jpg">Venus</option>
                                                        <option value="2k_mercury.jpg">Mercury</option>
                                                    </select>
                                                </div>

                                                <div className="flex flex-col">
                                                    <label className="label">Color</label>
                                                    <input 
                                                        className="input input-sm w-12 p-0 px-1" 
                                                        type="color" 
                                                        value={planetParams.color}
                                                        onChange={(e) => setPlanetParams({...planetParams, color: e.target.value})} 
                                                    />
                                                </div>

                                                {/* FINISH BUTTON */}
                                                <div className="flex flex-col justify-end">
                                                    <button className="btn btn-sm btn-success" onClick={handleConfirmPlanet}>
                                                        <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                                                    </button>
                                                </div>
                                            </div>

                                        </fieldset>
                                            </li>
                                            )}
                                            <li>
                                                <button 
                                                    className={`btn btn-sm w-full ${showPlanetForm ? 'btn-outline btn-error' : 'btn-outline btn-info'}`}
                                                    onClick={() => setShowPlanetForm(!showPlanetForm)}
                                                >
                                                    {showPlanetForm ? "Cancel" : "Add Planet"}
                                                </button>
                                            </li>
                                            {bodies.map((body) => (
                                                body instanceof Planet &&(
                                                    <li key={body.name}><a>{body.name}</a></li>
                                                )
                                            ))}
                                        </ul>
                                    </details>
                                </li>
                            </ul>
                        </details>
                    </li>
                    <li>
                    </li>
                    </ul>
                </div>

            </div>
        </div>
    );
}