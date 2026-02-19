import { CelestialBody } from "./CelestialBody";
import { useState } from "react";

export class Planet extends CelestialBody {
    constructor(
        mass: number,
        position: [number, number, number],
        velocity: [number, number, number],
        radius: number,
        spin: number = 0,
        color: string = "white",
        texture?: string,
        name?: string,
    ) {
        super(mass, position, velocity, radius, spin, color, texture, name);
    }
}

export function usePlanet() {
    const [planetParams, setPlanetParams] = useState({
        name: `Planet-${Date.now()}`,
        mass: 1,
        spin: 0.1,
        radius: 1.5,
        posX: 150, posY: 0, posZ: 0,
        velX: 0, velY: 0, velZ: 60,
        color: "#FFFFFF",
        texture: "2k_earth_daymap.jpg"
    })

    return [planetParams, setPlanetParams];
}