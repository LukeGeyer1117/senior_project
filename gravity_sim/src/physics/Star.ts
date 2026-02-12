import { CelestialBody } from "./CelestialBody";

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