import { CelestialBody } from "./CelestialBody";

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