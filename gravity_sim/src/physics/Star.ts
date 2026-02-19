import { CelestialBody } from "./CelestialBody";
import { useState } from "react";

export class Star extends CelestialBody {
    luminosity: number;
    lightColor: string;
    lightIntensity: number;

    constructor(
        mass: number,
        position: [number, number, number],
        velocity: [number, number, number],
        radius: number,
        spin: number = 0,
        color: string = "white",
        texture?: string,
        name?: string,
        luminosity: number = 1,
        lightIntensity: number = 10
    ) {
        super(mass, position, velocity, radius, spin, color, texture, name);

        this.luminosity = luminosity,
        this.lightColor = color;
        this.lightIntensity = lightIntensity;
    }
}

export function useStar() {
    const [starParams, setStarParams] = useState({
        name: `Star-${Date.now()}`,
        mass: 100,
        spin: 0.1,
        radius: 10,
        posX: 0, posY: 0, posZ: 0,
        velX: 0, velY: 0, velZ: 0,
        color: "#ffffff",
        intensity: 5,
        texture: "2k_sun.jpg"
    })

    return [starParams, setStarParams];
}