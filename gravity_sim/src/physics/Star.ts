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
        color: string = "yellow",
        luminosity: number = 1,
        lightIntensity: number = 1
    ) {
        super(mass, position, velocity, radius, color);

        this.luminosity = luminosity,
        this.lightColor = color;
        this.lightIntensity = lightIntensity;
    }
}