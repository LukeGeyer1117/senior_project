import { CelestialBody } from "../physics/CelestialBody";

export const GRAVITY_CONSTANT = 39.478; // Scaled gravitational constant for simulation

// 1.0 Time Units equals 1 Earth Year
// 1.0 Distance Units equals 1 Astronomical Unit (AU) - average distance from Earth to Sun
// 1.0 Mass Units equals 1 Solar Mass
export const TIME_SCALE = 1;

export default function CalculateGravity(allBodies: CelestialBody[], dt: number) {
    for (let i = 0; i < allBodies.length; i++) {
        const a = allBodies[i];
        for (let j = i+1; j < allBodies.length; j++) {
            const b = allBodies[j];

            // Calculate the direction of the vector between the two bodies
            const dx = b.position.x - a.position.x;
            const dy = b.position.y - a.position.y;
            const dz = b.position.z - a.position.z;

            // Calculate distance between 3d points of the centers of body i and j
            const distanceSq = dx**2 + dy**2 + dz**2;

            // Use the formula F = G * (m1 * m2) / r^2 to calculate the force of gravity between the two objects
            const F = GRAVITY_CONSTANT * (a.mass * b.mass) / distanceSq;

            const fx = dx * F;
            const fy = dy * F;
            const fz = dz * F;

            // Apply acceleration to the bodies. F = m a, so acceleration = F / m
            a.velocity.x += (fx / a.mass) * dt;
            a.velocity.y += (fy / a.mass) * dt;
            a.velocity.z += (fz / a.mass) * dt;

            b.velocity.x -= (fx / b.mass) * dt;
            b.velocity.y -= (fy / b.mass) * dt;
            b.velocity.z -= (fz / b.mass) * dt;
        }
    }
}