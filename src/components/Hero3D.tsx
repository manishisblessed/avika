"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import {
  Float,
  Environment,
  MeshDistortMaterial,
  ContactShadows,
  RoundedBox,
} from "@react-three/drei";
import React, { Component, Suspense, useRef, type ReactNode } from "react";
import * as THREE from "three";

class R3fErrorBoundary extends Component<
  { children: ReactNode; fallback?: ReactNode },
  { hasError: boolean }
> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) return this.props.fallback ?? null;
    return this.props.children;
  }
}

function Knot() {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((_, dt) => {
    if (ref.current) {
      ref.current.rotation.x += dt * 0.15;
      ref.current.rotation.y += dt * 0.2;
    }
  });
  return (
    <Float floatIntensity={1.5} rotationIntensity={0.8} speed={1.6}>
      <mesh ref={ref} position={[0, 0, 0]} castShadow>
        <torusKnotGeometry args={[1.1, 0.36, 220, 32]} />
        <MeshDistortMaterial
          color="#f97316"
          metalness={1}
          roughness={0.18}
          distort={0.32}
          speed={1.2}
          envMapIntensity={1.6}
        />
      </mesh>
    </Float>
  );
}

function GoldSphere({
  position,
  color = "#fb923c",
}: {
  position: [number, number, number];
  color?: string;
}) {
  return (
    <Float floatIntensity={2.5} rotationIntensity={1.2} speed={1.4}>
      <mesh position={position} castShadow>
        <sphereGeometry args={[0.45, 64, 64]} />
        <meshStandardMaterial
          color={color}
          metalness={1}
          roughness={0.12}
          envMapIntensity={1.4}
        />
      </mesh>
    </Float>
  );
}

function GlassCube({ position }: { position: [number, number, number] }) {
  return (
    <Float floatIntensity={2} rotationIntensity={1} speed={1.2}>
      <RoundedBox args={[0.9, 0.9, 0.9]} radius={0.12} smoothness={6} position={position} castShadow>
        <meshPhysicalMaterial
          color="#ffffff"
          transmission={0.95}
          thickness={0.6}
          roughness={0.05}
          ior={1.45}
          metalness={0}
          envMapIntensity={1.2}
        />
      </RoundedBox>
    </Float>
  );
}

function Diamond({ position }: { position: [number, number, number] }) {
  return (
    <Float floatIntensity={3} rotationIntensity={2} speed={1.8}>
      <mesh position={position} rotation={[0.2, 0.4, 0.6]} castShadow>
        <octahedronGeometry args={[0.55, 0]} />
        <meshPhysicalMaterial
          color="#eaf5ec"
          metalness={0.4}
          roughness={0.05}
          clearcoat={1}
          clearcoatRoughness={0.05}
          envMapIntensity={2}
        />
      </mesh>
    </Float>
  );
}

export default function Hero3D() {
  return (
    <div
      className="absolute inset-0 z-0 pointer-events-none"
      aria-hidden
    >
      <R3fErrorBoundary>
        <Canvas
          shadows
          camera={{ position: [0, 0, 6], fov: 38 }}
          dpr={[1, 1.6]}
          gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
          style={{ background: "transparent" }}
        >
          <Suspense fallback={null}>
            <ambientLight intensity={0.35} />
            <directionalLight
              position={[4, 5, 4]}
              intensity={1.4}
              castShadow
              shadow-mapSize-width={1024}
              shadow-mapSize-height={1024}
            />
            <pointLight position={[-5, -3, -4]} intensity={1} color="#f97316" />
            <pointLight position={[3, -2, 4]} intensity={0.7} color="#3f9e51" />

            <Knot />
            <GoldSphere position={[-2.4, 0.9, -0.6]} color="#fb923c" />
            <GlassCube position={[2.3, 1, -0.4]} />
            <Diamond position={[2.1, -1.1, 0.3]} />
            <GoldSphere position={[-2.1, -1.2, 0.4]} color="#2e7d32" />

            <ContactShadows
              position={[0, -2.1, 0]}
              opacity={0.5}
              scale={10}
              blur={2.4}
              far={4}
              color="#000"
            />

            <Environment preset="studio" />
          </Suspense>
        </Canvas>
      </R3fErrorBoundary>
    </div>
  );
}
