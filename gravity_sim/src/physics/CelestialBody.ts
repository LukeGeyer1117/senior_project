import * as THREE from 'three';

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

  updatePhysics(deltaTime: number, allBodies: CelestialBody[]) {
  }

}