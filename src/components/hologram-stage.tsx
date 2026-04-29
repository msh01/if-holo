"use client";

import { Environment, Float, MeshDistortMaterial, Sparkles, Text } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { Bloom, ChromaticAberration, EffectComposer, Noise, Scanline } from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";
import { useMemo, useRef } from "react";
import type { Group } from "three";
import * as THREE from "three";
import type { Specimen } from "@/data/specimens";

function HoloCat({ colors, specimen }: { colors: THREE.Color[]; specimen: Specimen }) {
  const distortion = specimen.hologram?.distortion ?? 0.32;

  return (
    <group position={[0, -0.18, 0]} scale={0.78}>
      <mesh position={[0, 0.15, 0]} scale={[0.86, 1.02, 0.42]}>
        <sphereGeometry args={[1, 72, 72]} />
        <MeshDistortMaterial
          color={specimen.palette[0]}
          distort={distortion}
          emissive={colors[1]}
          emissiveIntensity={1.75}
          opacity={0.68}
          speed={2.8}
          transparent
          wireframe
        />
      </mesh>
      <mesh position={[0, 1.06, 0.02]} scale={[0.68, 0.58, 0.36]}>
        <sphereGeometry args={[1, 72, 72]} />
        <MeshDistortMaterial
          color={specimen.palette[0]}
          distort={distortion * 0.72}
          emissive={colors[2]}
          emissiveIntensity={1.45}
          opacity={0.74}
          speed={2.2}
          transparent
          wireframe
        />
      </mesh>
      <mesh position={[-0.36, 1.6, 0]} rotation={[0, 0, 0.34]} scale={[0.28, 0.48, 0.18]}>
        <coneGeometry args={[1, 1.4, 4]} />
        <meshBasicMaterial color={specimen.palette[1]} opacity={0.7} transparent wireframe />
      </mesh>
      <mesh position={[0.36, 1.6, 0]} rotation={[0, 0, -0.34]} scale={[0.28, 0.48, 0.18]}>
        <coneGeometry args={[1, 1.4, 4]} />
        <meshBasicMaterial color={specimen.palette[1]} opacity={0.7} transparent wireframe />
      </mesh>
      <mesh position={[0.18, 1.14, 0.34]} scale={[0.048, 0.048, 0.048]}>
        <sphereGeometry args={[1, 24, 24]} />
        <meshBasicMaterial color={specimen.palette[2]} />
      </mesh>
      <mesh position={[-0.18, 1.14, 0.34]} scale={[0.048, 0.048, 0.048]}>
        <sphereGeometry args={[1, 24, 24]} />
        <meshBasicMaterial color={specimen.palette[2]} />
      </mesh>
      {[-0.24, 0, 0.24].map((offset) => (
        <group key={offset} position={[0, 0.98 + offset * 0.18, 0.38]}>
          <mesh position={[-0.52, offset, 0]} rotation={[0, 0, 1.38]} scale={[0.012, 0.64, 0.012]}>
            <cylinderGeometry args={[1, 1, 1, 8]} />
            <meshBasicMaterial color={specimen.palette[2]} opacity={0.55} transparent />
          </mesh>
          <mesh position={[0.52, offset, 0]} rotation={[0, 0, -1.38]} scale={[0.012, 0.64, 0.012]}>
            <cylinderGeometry args={[1, 1, 1, 8]} />
            <meshBasicMaterial color={specimen.palette[2]} opacity={0.55} transparent />
          </mesh>
        </group>
      ))}
      <mesh position={[0.72, 0.18, -0.05]} rotation={[0.28, 0.18, -0.5]} scale={[0.62, 0.62, 0.14]}>
        <torusGeometry args={[0.78, 0.075, 12, 80, Math.PI * 1.35]} />
        <meshBasicMaterial color={specimen.palette[1]} opacity={0.68} transparent wireframe />
      </mesh>
    </group>
  );
}

function HoloAvatar({ specimen }: { specimen: Specimen }) {
  const groupRef = useRef<Group>(null);
  const colors = useMemo(
    () => specimen.palette.map((color) => new THREE.Color(color)),
    [specimen.palette],
  );

  useFrame(({ clock, pointer }) => {
    if (!groupRef.current) return;
    const motion = specimen.hologram?.idleMotion;
    const pounce = motion === "pounce" ? Math.max(0, Math.sin(clock.elapsedTime * 1.7)) * 0.05 : 0;
    groupRef.current.rotation.y = Math.sin(clock.elapsedTime * 0.55) * 0.34 + pointer.x * 0.2;
    groupRef.current.rotation.x = pointer.y * 0.08;
    groupRef.current.position.y = Math.sin(clock.elapsedTime * 1.2) * 0.08 + pounce;
  });

  const isRelief = specimen.modelMode === "relief";
  const isCat = specimen.hologram?.silhouette === "cat";

  return (
    <group ref={groupRef}>
      <Float floatIntensity={0.8} rotationIntensity={0.35} speed={1.8}>
        {isCat ? (
          <HoloCat colors={colors} specimen={specimen} />
        ) : (
          <>
            <mesh position={[0, 0.28, 0]} scale={isRelief ? [1.25, 1.72, 0.22] : [1.05, 1.45, 1.05]}>
              {isRelief ? <sphereGeometry args={[1, 96, 96]} /> : <icosahedronGeometry args={[1, 5]} />}
              <MeshDistortMaterial
                color={specimen.palette[0]}
                distort={isRelief ? 0.42 : 0.24}
                emissive={colors[1]}
                emissiveIntensity={1.6}
                metalness={0.25}
                opacity={0.78}
                roughness={0.18}
                speed={2.4}
                transparent
                wireframe={!isRelief}
              />
            </mesh>
            <mesh position={[0, 0.25, -0.06]} scale={[1.38, 1.86, 0.04]}>
              <sphereGeometry args={[1, 64, 64]} />
              <meshBasicMaterial color={specimen.palette[1]} opacity={0.13} transparent wireframe />
            </mesh>
          </>
        )}
      </Float>

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.2, 0]}>
        <ringGeometry args={[0.72, 1.52, 96]} />
        <meshBasicMaterial color={specimen.palette[0]} opacity={0.52} transparent side={THREE.DoubleSide} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.22, 0]}>
        <circleGeometry args={[1.05, 96]} />
        <meshBasicMaterial color={specimen.palette[2]} opacity={0.08} transparent />
      </mesh>
      <Sparkles
        color={specimen.palette[2]}
        count={specimen.hologram?.particleCount ?? 90}
        scale={[4.2, 3.6, 2.2]}
        size={2.3}
        speed={0.65}
      />
      <Text
        color={specimen.palette[2]}
        fontSize={0.09}
        letterSpacing={0.08}
        position={[0, -1.48, 0]}
        rotation={[-0.32, 0, 0]}
      >
        {specimen.rarity} SIGNAL {specimen.signal}%
      </Text>
    </group>
  );
}

export function HologramStage({ specimen, compact = false }: { specimen: Specimen; compact?: boolean }) {
  return (
    <div
      className="relative h-full min-h-[360px] overflow-hidden rounded-md border border-white/10 bg-black"
      style={{
        background: `radial-gradient(circle at 50% 36%, ${specimen.palette[0]}33, transparent 34%), radial-gradient(circle at 20% 70%, ${specimen.palette[1]}24, transparent 28%), #030405`,
      }}
    >
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.055)_1px,transparent_1px)] bg-[length:100%_8px] opacity-40" />
      <div className="pointer-events-none absolute inset-x-8 top-8 h-px bg-gradient-to-r from-transparent via-white/70 to-transparent" />
      <Canvas camera={{ fov: compact ? 42 : 36, position: [0, 0.05, compact ? 5.2 : 4.6] }} dpr={[1, 1.75]}>
        <color attach="background" args={["#020203"]} />
        <ambientLight intensity={0.6} />
        <pointLight color={specimen.palette[0]} intensity={38} position={[2.4, 2.4, 2.6]} />
        <pointLight color={specimen.palette[1]} intensity={22} position={[-2, -0.7, 2.2]} />
        <HoloAvatar specimen={specimen} />
        <Environment preset="city" />
        <EffectComposer>
          <Bloom intensity={1.45} luminanceThreshold={0.1} mipmapBlur />
          <ChromaticAberration blendFunction={BlendFunction.SCREEN} offset={[0.0012, 0.0018]} />
          <Scanline blendFunction={BlendFunction.OVERLAY} density={specimen.hologram?.scanlineDensity ?? 1.25} opacity={0.22} />
          <Noise blendFunction={BlendFunction.SOFT_LIGHT} opacity={0.17} />
        </EffectComposer>
      </Canvas>
      <div className="pointer-events-none absolute inset-0 shadow-[inset_0_0_80px_rgba(0,0,0,0.88)]" />
    </div>
  );
}
