"use client";

import { Environment, Float, OrbitControls, Sparkles, Text, useGLTF } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { Bloom, ChromaticAberration, EffectComposer, Noise, Scanline, Vignette } from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";
import { Suspense, useMemo, useRef } from "react";
import type { Group, Mesh, Object3D } from "three";
import * as THREE from "three";
import type { Specimen } from "@/data/specimens";

function tintModelMaterials(root: Object3D, specimen: Specimen) {
  const accent = new THREE.Color(specimen.palette[0]);
  const glow = new THREE.Color(specimen.palette[1]);

  root.traverse((object) => {
    const mesh = object as Mesh;
    if (!mesh.isMesh) return;

    mesh.castShadow = true;
    mesh.receiveShadow = true;

    const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
    mesh.material = materials.map((material) => {
      const cloned = material.clone();

      if (cloned instanceof THREE.MeshStandardMaterial || cloned instanceof THREE.MeshPhysicalMaterial) {
        cloned.color.lerp(accent, 0.18);
        cloned.emissive.lerp(glow, 0.22);
        cloned.emissiveIntensity = Math.max(cloned.emissiveIntensity, 0.28);
        cloned.metalness = Math.max(cloned.metalness, 0.42);
        cloned.roughness = Math.min(cloned.roughness, 0.36);
      }

      return cloned;
    });
  });
}

function GlbAvatar({ specimen }: { specimen: Specimen }) {
  const groupRef = useRef<Group>(null);
  const { scene } = useGLTF(specimen.modelUrl);

  const model = useMemo(() => {
    const cloned = scene.clone(true);
    tintModelMaterials(cloned, specimen);
    return cloned;
  }, [scene, specimen]);

  useFrame(({ clock, pointer }) => {
    if (!groupRef.current) return;

    const motion = specimen.hologram?.idleMotion;
    const pulse = motion === "pounce" ? Math.max(0, Math.sin(clock.elapsedTime * 1.7)) * 0.05 : 0;
    groupRef.current.rotation.y = Math.sin(clock.elapsedTime * 0.52) * 0.24 + pointer.x * 0.22;
    groupRef.current.rotation.x = pointer.y * 0.08;
    groupRef.current.position.y = Math.sin(clock.elapsedTime * 1.12) * 0.08 + pulse;
  });

  return (
    <group ref={groupRef}>
      <Float floatIntensity={0.72} rotationIntensity={0.24} speed={1.7}>
        <primitive object={model} position={[0, -0.1, 0]} scale={1.12} />
      </Float>

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.55, 0]}>
        <ringGeometry args={[0.72, 1.52, 96]} />
        <meshBasicMaterial color={specimen.palette[0]} opacity={0.5} transparent side={THREE.DoubleSide} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.57, 0]}>
        <circleGeometry args={[1.05, 96]} />
        <meshBasicMaterial color={specimen.palette[2]} opacity={0.08} transparent />
      </mesh>
      <Sparkles
        color={specimen.palette[2]}
        count={specimen.hologram?.particleCount ?? 96}
        scale={[4.4, 3.8, 2.4]}
        size={2.15}
        speed={0.58}
      />
      <Text
        color={specimen.palette[2]}
        fontSize={0.09}
        letterSpacing={0.08}
        position={[0, -1.82, 0]}
        rotation={[-0.32, 0, 0]}
      >
        {specimen.rarity} GLB SIGNAL {specimen.signal}%
      </Text>
    </group>
  );
}

function StageFallback({ specimen }: { specimen: Specimen }) {
  return (
    <group>
      <mesh position={[0, 0.15, 0]}>
        <boxGeometry args={[0.85, 1.7, 0.85]} />
        <meshStandardMaterial color={specimen.palette[0]} emissive={specimen.palette[1]} emissiveIntensity={0.35} wireframe />
      </mesh>
      <Sparkles color={specimen.palette[2]} count={64} scale={[3.6, 3, 2]} size={2} speed={0.5} />
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
      <Canvas
        camera={{ fov: compact ? 42 : 36, position: [0, 0.1, compact ? 5.2 : 4.8] }}
        dpr={[1, 1.75]}
        gl={{ antialias: true }}
      >
        <color attach="background" args={["#020203"]} />
        <ambientLight intensity={0.62} />
        <directionalLight color="#ffffff" intensity={2.1} position={[2.4, 3.2, 3.6]} />
        <pointLight color={specimen.palette[0]} intensity={42} position={[2.4, 2.4, 2.6]} />
        <pointLight color={specimen.palette[1]} intensity={26} position={[-2, -0.7, 2.2]} />
        <Suspense fallback={<StageFallback specimen={specimen} />}>
          <GlbAvatar specimen={specimen} />
          <Environment preset="city" />
        </Suspense>
        <OrbitControls
          autoRotate
          autoRotateSpeed={0.36}
          enablePan={false}
          enableZoom={!compact}
          maxDistance={6.2}
          minDistance={3.4}
          maxPolarAngle={Math.PI / 1.82}
          minPolarAngle={Math.PI / 3.1}
          rotateSpeed={0.42}
        />
        <EffectComposer>
          <Bloom intensity={1.45} luminanceThreshold={0.1} mipmapBlur />
          <ChromaticAberration blendFunction={BlendFunction.SCREEN} offset={[0.0012, 0.0018]} />
          <Scanline blendFunction={BlendFunction.OVERLAY} density={specimen.hologram?.scanlineDensity ?? 1.25} opacity={0.22} />
          <Noise blendFunction={BlendFunction.SOFT_LIGHT} opacity={0.16} />
          <Vignette eskil={false} offset={0.25} darkness={0.72} />
        </EffectComposer>
      </Canvas>
      <div className="pointer-events-none absolute bottom-5 left-1/2 h-px w-3/4 -translate-x-1/2 bg-gradient-to-r from-transparent via-cyan-100/70 to-transparent" />
      <div className="pointer-events-none absolute inset-0 shadow-[inset_0_0_80px_rgba(0,0,0,0.88)]" />
    </div>
  );
}

useGLTF.preload("/models/if-holo-default.glb");
