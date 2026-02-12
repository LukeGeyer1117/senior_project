import * as THREE from 'three';
// import { degToRad } from 'three/src/math/MathUtils.js';

export class CelestialBody {
  mass: number;
  position: THREE.Vector3;
  velocity: THREE.Vector3;
  radius: number;
  spin: number;
  color: string;
  // Optional Texture Property
  texture?: string;
  name?: string;

  constructor(
    mass: number, 
    position: [number, number, number], 
    velocity: [number, number, number], 
    radius: number,
    spin: number = 0,
    color: string = "pink",
    texture?: string,
    name?: string,
  ) {
    this.mass = mass;
    this.position = new THREE.Vector3(...position);
    this.velocity = new THREE.Vector3(...velocity);
    this.radius = radius;
    this.spin = spin;
    this.color = color;
    this.texture = texture;
    this.name = name;
  }

  getPosition(): [number, number, number] {
    return [this.position.x, this.position.y, this.position.z];
  }

  getVelocity(): [number, number, number] {
    return [this.velocity.x, this.velocity.y, this.velocity.z];
  }

  updatePosition(deltaTime: number) {
    this.position.x += this.velocity.x * deltaTime;
    this.position.y += this.velocity.y * deltaTime;
    this.position.z += this.velocity.z * deltaTime;
  }

}