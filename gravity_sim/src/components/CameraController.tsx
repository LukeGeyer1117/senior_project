import { useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { CelestialBody } from "../physics/CelestialBody";
import VisualizeBody from "./VisualizeBody";

export const CameraController = ({ focusedRef, controlsRef }) => {
    useFrame((state, delta) => {
        // Only run if we have a foused body and the controls are ready
        if (focusedRef?.current && controlsRef?.current) {
            const targetPos = new THREE.Vector3();
            // Get the world position of the Celestial Body
            focusedRef.current.getWorldPosition(targetPos);

            // Smooth follow
            controlsRef.current.target.lerp(targetPos, 0.1);
            controlsRef.current.update();
        }
    });
    return null;
}