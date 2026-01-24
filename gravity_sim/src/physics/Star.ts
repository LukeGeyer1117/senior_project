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
        color: string = "white",
        texture?: string,
        luminosity: number = 1,
        lightIntensity: number = 10
    ) {
        super(mass, position, velocity, radius, color, texture);

        this.luminosity = luminosity,
        this.lightColor = color;
        this.lightIntensity = lightIntensity;
    }
}