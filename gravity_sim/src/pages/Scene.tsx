import React from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from '@react-three/drei'

export default function Scene() {
    return (
    <Canvas className="w-full h-full">
        <mesh>
            <boxGeometry args={[1,1,1]} />
            <meshStandardMaterial color="hotpink" />
        </mesh>
        <ambientLight intensity={0.5} />
        <spotLight position={[10,10,10]} angle={0.15} penumbra={1} />
        <OrbitControls />
    </Canvas>
    );
}