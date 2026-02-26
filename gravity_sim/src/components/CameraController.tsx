import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import React, {useState} from "react";
import type { RefObject } from "react";

const [focusedRef, setFocusedRef] = useState<RefObject<THREE.Mesh | null> | null>(null);

// 1. Define an interface for your props to keep TS happy
interface CameraControllerProps {
    focusedRef: React.MutableRefObject<THREE.Object3D | null> | null;
    controlsRef: React.MutableRefObject<any> | null; // 'any' used here for OrbitControls 
}

const targetPos = new THREE.Vector3(); // 2. Move this outside to avoid GC pressure every frame

export const CameraController: React.FC<CameraControllerProps> = ({ focusedRef, controlsRef }) => {
    // 3. Removed (state, delta) since they weren't being used
    useFrame(() => {
        if (focusedRef?.current && controlsRef?.current) {
            // Get the world position of the Celestial Body
            focusedRef.current.getWorldPosition(targetPos);

            // Smooth follow
            controlsRef.current.target.lerp(targetPos, 0.1);
            controlsRef.current.update();
        }
    });

    return null;
};

export default [focusedRef, setFocusedRef];