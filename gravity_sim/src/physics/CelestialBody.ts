import * as THREE from 'three';
// import { degToRad } from 'three/src/math/MathUtils.js';

export class CelestialBody {
  mass: number;
  position: THREE.Vector3;
  velocity: THREE.Vector3;
  radius: number;

  constructor(
    mass: number, 
    position: [number, number, number], 
    velocity: [number, number, number], 
    radius: number
  ) {
    this.mass = mass;
    this.position = new THREE.Vector3(...position);
    this.velocity = new THREE.Vector3(...velocity);
    this.radius = radius;
  }

  updatePosition(deltaTime: number) {
    this.position.x += this.velocity.x * deltaTime;
    this.position.y += this.velocity.y * deltaTime;
    this.position.z += this.velocity.z * deltaTime;

    console.log(this.position);
  }

}