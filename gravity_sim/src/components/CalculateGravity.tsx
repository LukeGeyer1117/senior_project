import { CelestialBody } from "../physics/CelestialBody";
import type { Dispatch, SetStateAction } from "react";


export const GRAVITY_CONSTANT = 39.478; // Scaled gravitational constant for simulation
const SOFTENING = 0.0001;

// 1.0 Time Units equals 1 Earth Year
// 1.0 Distance Units equals 1 Astronomical Unit (AU) - average distance from Earth to Sun
// 1.0 Mass Units equals 1 Solar Mass
export const TIME_SCALE = 1;

export default function CalculateGravity(allBodies: CelestialBody[], dt: number, gravity_method: string) {
    // Figure the method out and assign it, default to semi-implicit euler integration
    if (gravity_method === "semi-implicit euler") {
        SemiImplicitEuler(allBodies, dt);
    }
    else if (gravity_method === "leapfrog") {
        Leapfrog(allBodies, dt);
    }
    else {
        SemiImplicitEuler(allBodies, dt);
    }
}

function SemiImplicitEuler(allBodies: CelestialBody[], dt: number) {
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
            const distance = Math.sqrt(distanceSq)

            // Use the formula F = G * (m1 * m2) / r^2 to calculate the force of gravity between the two objects
            const F = (GRAVITY_CONSTANT * (a.mass * b.mass)) / distanceSq;

            const fx = (dx / distance) * F;
            const fy = (dy / distance) * F;
            const fz = (dz / distance) * F;

            // Apply acceleration to the bodies. F = m a, so acceleration = F / m
            a.velocity.x += (fx / a.mass) * dt;
            a.velocity.y += (fy / a.mass) * dt;
            a.velocity.z += (fz / a.mass) * dt;

            b.velocity.x -= (fx / b.mass) * dt;
            b.velocity.y -= (fy / b.mass) * dt;
            b.velocity.z -= (fz / b.mass) * dt;
        }
    }

    // then move positions
    for (const body of allBodies) {
        body.updatePosition(dt);
    }
}

function Leapfrog(bodies: CelestialBody[], dt: number) {
    if (bodies.length === 0) return;

  // STEP 1: acceleration at current positions
  const a0 = computeAccelerations(bodies);

  // STEP 2: half-kick (velocity half step)
  for (let i = 0; i < bodies.length; i++) {
    bodies[i].velocity.x += a0[i].x * dt * 0.5;
    bodies[i].velocity.y += a0[i].y * dt * 0.5;
    bodies[i].velocity.z += a0[i].z * dt * 0.5;
  }

  // STEP 3: drift (update positions using half-step velocity)
  for (let i = 0; i < bodies.length; i++) {
    bodies[i].position.x += bodies[i].velocity.x * dt;
    bodies[i].position.y += bodies[i].velocity.y * dt;
    bodies[i].position.z += bodies[i].velocity.z * dt;
  }

  // STEP 4: acceleration at new positions
  const a1 = computeAccelerations(bodies);

  // STEP 5: second half-kick
  for (let i = 0; i < bodies.length; i++) {
    bodies[i].velocity.x += a1[i].x * dt * 0.5;
    bodies[i].velocity.y += a1[i].y * dt * 0.5;
    bodies[i].velocity.z += a1[i].z * dt * 0.5;
  }
}

function computeAccelerations(bodies: CelestialBody[]) {
  const acc = bodies.map(() => ({ x: 0, y: 0, z: 0 }));

  for (let i = 0; i < bodies.length; i++) {
    for (let j = i + 1; j < bodies.length; j++) {
      const a = bodies[i];
      const b = bodies[j];

      const dx = b.position.x - a.position.x;
      const dy = b.position.y - a.position.y;
      const dz = b.position.z - a.position.z;

      const distSq = dx * dx + dy * dy + dz * dz + SOFTENING;
      const invDist = 1 / Math.sqrt(distSq);
      const invDist3 = invDist * invDist * invDist;

      const factor = GRAVITY_CONSTANT * invDist3;

      // acceleration contribution
      const ax = factor * b.mass * dx;
      const ay = factor * b.mass * dy;
      const az = factor * b.mass * dz;

      const bx = factor * a.mass * dx;
      const by = factor * a.mass * dy;
      const bz = factor * a.mass * dz;

      acc[i].x += ax;
      acc[i].y += ay;
      acc[i].z += az;

      acc[j].x -= bx;
      acc[j].y -= by;
      acc[j].z -= bz;
    }
  }

  return acc;
}

interface GravityControllerProps {
    gravityMethod: string,
    setGravityMethod: Dispatch<SetStateAction<string>>;
}

// THIS is the component we can use to control the gravity method within the simulation
export const GravityController = ({gravityMethod, setGravityMethod}: GravityControllerProps) => {

    return (
        <div className="dropdown dropdown-end z-2">
            <div tabIndex={0} role="button" className="btn m-1 bg-transparent border-none">
                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="M484.5-553.5Q499-568 499-589t-14.5-35.5Q470-639 449-639t-35.5 14.5Q399-610 399-589t14.5 35.5Q428-539 449-539t35.5-14.5ZM822-80q-42 0-113-35t-152-95q-19 5-38.5 7.5T479-200q-117 0-198-81t-81-198q0-20 3-40t8-39q-59-81-94.5-151.5T81-822q0-27 15-42.5t41-15.5q26 0 67.5 18T319-801q-21 11-39 23t-35 26q-19-11-37-19t-38-17q18 38 38.5 74t43.5 71q38-54 97-85t130-31q117 0 198.5 81.5T759-479q0 71-31.5 130T642-252q35 23 71.5 44t74.5 38q-8-19-16.5-37T752-244q15-17 27-36t22-39q46 78 62.5 116.5T880-138q0 29-16 43.5T822-80ZM577.5-370.5Q589-382 589-399t-11.5-28.5Q566-439 549-439t-28.5 11.5Q509-416 509-399t11.5 28.5Q532-359 549-359t28.5-11.5Zm43-137Q629-516 629-529t-8.5-21.5Q612-559 599-559t-21.5 8.5Q569-542 569-529t8.5 21.5Q586-499 599-499t21.5-8.5ZM468-281q-51-44-98-91t-90-98q2 38 17 71.5t41 59.5q26 26 59 41t71 17Zm103-21q48-25 78-72.5T679-480q0-83-58.5-141T479-679q-58 0-105 30t-72 78q57 76 125 144t144 125Zm-197-73Zm117-116Z"/></svg>
            </div>
            <ul tabIndex={-1} className="dropdown-content menu bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm">
              <li>
                <fieldset className="fieldset">
                    <legend className="fieldset-legend">Gravity Method</legend>
                    <select className="select select-sm select-info w-full" value={gravityMethod} onChange={(e) => setGravityMethod(e.target.value)}>
                        <option value="semi-implicit euler">Semi Implicit Euler</option>
                        <option value="leapfrog">Leapfrog</option>
                    </select>
                </fieldset>
              </li>
            </ul>
        </div>
    );
}
