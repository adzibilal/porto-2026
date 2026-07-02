"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Mesh, BufferGeometry, Float32BufferAttribute } from "three";

function TorusKnot() {
  const ref = useRef<Mesh>(null);
  const mouse = useRef({ x: 0, y: 0 });

  useFrame(({ pointer, clock }) => {
    const t = clock.getElapsedTime();
    mouse.current.x += (pointer.x - mouse.current.x) * 0.05;
    mouse.current.y += (pointer.y - mouse.current.y) * 0.05;

    if (ref.current) {
      ref.current.rotation.x = t * 0.1 + mouse.current.y * 0.3;
      ref.current.rotation.y = t * 0.15 + mouse.current.x * 0.3;
      ref.current.position.x = mouse.current.x * 0.2;
      ref.current.position.y = -mouse.current.y * 0.2;
    }
  });

  return (
    <mesh ref={ref}>
      <torusKnotGeometry args={[1.2, 0.4, 180, 24]} />
      <meshStandardMaterial
        color="#C6FF4A"
        wireframe
        transparent
        opacity={0.15}
      />
    </mesh>
  );
}

function Particles() {
  const count = 300;
  const geometry = useMemo(() => {
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count * 3; i++) {
      positions[i] = (Math.random() - 0.5) * 20;
    }
    const geo = new BufferGeometry();
    geo.setAttribute("position", new Float32BufferAttribute(positions, 3));
    return geo;
  }, [count]);

  return (
    <points geometry={geometry}>
      <pointsMaterial
        size={0.02}
        color="#C6FF4A"
        transparent
        opacity={0.4}
        sizeAttenuation
      />
    </points>
  );
}

export default function ThreeScene() {
  return (
    <div className="absolute inset-0 pointer-events-none">
      <Canvas
        camera={{ position: [0, 0, 4], fov: 45 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={0.5} />
        <TorusKnot />
        <Particles />
      </Canvas>
    </div>
  );
}
