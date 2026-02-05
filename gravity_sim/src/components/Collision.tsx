// import { CelestialBody } from "../physics/CelestialBody";
// import { GRAVITY_CONSTANT } from "./CalculateGravity";

// export default function Collide(allBodies: CelestialBody[], dt: number) {
//   for (let i = 0; i < allBodies.length; i++) {
//     const a = allBodies[i];

//     for (let j = i + 1; j < allBodies.length; j++) {
//       const b = allBodies[j];

//       const dx = b.position.x - a.position.x;
//       const dy = b.position.y - a.position.y;
//       const dz = b.position.z - a.position.z;

//       const distanceSq = dx * dx + dy * dy + dz * dz;

//       // ---- COLLISION CHECK ----
//       const minDist = a.radius + b.radius;
//       if (distanceSq <= minDist * minDist) {
//         const distance = Math.sqrt(distanceSq);

//         const nx = dx / distance;
//         const ny = dy / distance;
//         const nz = dz / distance;

//         const rvx = b.velocity.x - a.velocity.x;
//         const rvy = b.velocity.y - a.velocity.y;
//         const rvz = b.velocity.z - a.velocity.z;

//         const velAlongNormal = rvx * nx + rvy * ny + rvz * nz;

//         if (velAlongNormal > 0) continue;

//         // ---- ABSORPTION ----
//         const ABSORB_RATIO = 5;
//         const bigger = a.mass >= b.mass ? a : b;
//         const smaller = bigger === a ? b : a;

//         if (bigger.mass / smaller.mass >= ABSORB_RATIO) {
//           const totalMass = bigger.mass + smaller.mass;

//           bigger.velocity.x =
//             (bigger.velocity.x * bigger.mass + smaller.velocity.x * smaller.mass) / totalMass;
//           bigger.velocity.y =
//             (bigger.velocity.y * bigger.mass + smaller.velocity.y * smaller.mass) / totalMass;
//           bigger.velocity.z =
//             (bigger.velocity.z * bigger.mass + smaller.velocity.z * smaller.mass) / totalMass;

//           bigger.mass = totalMass;
//           bigger.radius = Math.cbrt(bigger.mass);

//           allBodies.splice(allBodies.indexOf(smaller), 1);
//           j--;
//           continue;
//         }

//         // ---- ELASTIC COLLISION ----
//         const restitution = 0.8;
//         const impulse =
//           -(1 + restitution) * velAlongNormal /
//           (1 / a.mass + 1 / b.mass);

//         const ix = impulse * nx;
//         const iy = impulse * ny;
//         const iz = impulse * nz;

//         a.velocity.x -= ix / a.mass;
//         a.velocity.y -= iy / a.mass;
//         a.velocity.z -= iz / a.mass;

//         b.velocity.x += ix / b.mass;
//         b.velocity.y += iy / b.mass;
//         b.velocity.z += iz / b.mass;

//         continue;
//       }

//       // ---- GRAVITY ----
//       const F = GRAVITY_CONSTANT * (a.mass * b.mass) / distanceSq;

//       a.velocity.x += (dx * F / a.mass) * dt;
//       a.velocity.y += (dy * F / a.mass) * dt;
//       a.velocity.z += (dz * F / a.mass) * dt;

//       b.velocity.x -= (dx * F / b.mass) * dt;
//       b.velocity.y -= (dy * F / b.mass) * dt;
//       b.velocity.z -= (dz * F / b.mass) * dt;
//     }
//   }
// }
