import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import type { CelestialBody } from "../physics/CelestialBody";

// 1. Define an interface for your props to keep TS happy
interface CameraControllerProps {
    body: CelestialBody | null; // The body to follow, or null if no focus
    controlsRef: React.MutableRefObject<any> | null; // 'any' used here for OrbitControls 
}

const targetPos = new THREE.Vector3(); // 2. Move this outside to avoid GC pressure every frame

export const CameraController: React.FC<CameraControllerProps> = ({ body, controlsRef }) => {
    // 3. Removed (state, delta) since they weren't being used
    useFrame(() => {
        if (body?.meshRef && controlsRef?.current) {
            // Get the world position of the Celestial Body
            body.meshRef.current.getWorldPosition(targetPos);

            // Smooth follow
            controlsRef.current.target.lerp(targetPos, 0.1);
            controlsRef.current.update();
        }
    });

    return null;
};
