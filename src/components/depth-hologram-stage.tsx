"use client";

import { Environment, OrbitControls, Sparkles, useTexture } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Bloom, ChromaticAberration, EffectComposer, Noise, Scanline, Vignette } from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";
import { Suspense, useMemo, useRef } from "react";
import * as THREE from "three";

const COLOR_MAP = "/holo-depth/robot-color.png";
const DEPTH_MAP = "/holo-depth/robot-depth.png";
const ASPECT = 16 / 9;

function RobotRelief() {
  const meshRef = useRef<THREE.Mesh>(null);
  const { viewport } = useThree();
  const [rawColorMap, rawDepthMap] = useTexture([COLOR_MAP, DEPTH_MAP]);

  const colorMap = useMemo(() => {
    const texture = rawColorMap.clone();
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.anisotropy = 8;
    texture.needsUpdate = true;
    return texture;
  }, [rawColorMap]);

  const depthMap = useMemo(() => {
    const texture = rawDepthMap.clone();
    texture.colorSpace = THREE.NoColorSpace;
    texture.anisotropy = 8;
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;
    texture.needsUpdate = true;
    return texture;
  }, [rawDepthMap]);

  useFrame(({ clock, pointer }) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.y = pointer.x * 0.16 + Math.sin(clock.elapsedTime * 0.42) * 0.035;
    meshRef.current.rotation.x = -pointer.y * 0.06 + Math.sin(clock.elapsedTime * 0.33) * 0.018;
    meshRef.current.position.z = Math.sin(clock.elapsedTime * 0.7) * 0.035;
  });

  const geometry = useMemo(() => new THREE.PlaneGeometry(ASPECT, 1, 360, 204), []);
  const fittedWidth = Math.min(viewport.width * 0.92, viewport.height * 0.84 * ASPECT);
  const fittedHeight = fittedWidth / ASPECT;

  return (
    <group position={[0, -0.08, 0]}>
      <mesh ref={meshRef} geometry={geometry} position={[0, 0, 0.18]} scale={[fittedWidth, fittedHeight, 1]}>
        <meshStandardMaterial
          alphaMap={depthMap}
          alphaTest={0.055}
          color="#d8f1ff"
          depthWrite={false}
          displacementBias={-0.18}
          displacementMap={depthMap}
          displacementScale={0.72}
          emissive="#49d7ff"
          emissiveIntensity={0.18}
          map={colorMap}
          metalness={0.62}
          roughness={0.36}
          side={THREE.DoubleSide}
          transparent
        />
      </mesh>
      <mesh position={[0, -2.18, -0.7]} rotation={[-Math.PI / 2, 0, 0]} scale={[2.9, 1.15, 1]}>
        <ringGeometry args={[0.64, 1.08, 128]} />
        <meshBasicMaterial color="#70d9ff" opacity={0.24} side={THREE.DoubleSide} transparent />
      </mesh>
      <Sparkles color="#f6527f" count={72} opacity={0.75} scale={[7.2, 4.5, 2.4]} size={2.1} speed={0.55} />
      <Sparkles color="#7ce7ff" count={110} opacity={0.56} scale={[8.2, 4.8, 2.8]} size={1.35} speed={0.38} />
    </group>
  );
}

function SceneBackground() {
  const rawTexture = useTexture(COLOR_MAP);
  const texture = useMemo(() => {
    const texture = rawTexture.clone();
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.needsUpdate = true;
    return texture;
  }, [rawTexture]);

  return (
    <mesh position={[0, 0.04, -1.25]} scale={[10.8, 6.1, 1]}>
      <planeGeometry args={[1, 1, 1, 1]} />
      <meshBasicMaterial color="#8fa3b6" map={texture} opacity={0.13} transparent />
    </mesh>
  );
}

export function DepthHologramStage() {
  return (
    <div className="relative h-full min-h-[520px] overflow-hidden rounded-md border border-white/10 bg-[#06080a]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_54%_34%,rgba(107,217,255,0.23),transparent_31%),radial-gradient(circle_at_66%_38%,rgba(255,42,93,0.18),transparent_18%),linear-gradient(180deg,#171b20_0%,#07090b_55%,#030405_100%)]" />
      <Canvas camera={{ fov: 34, position: [0, 0.08, 8.5] }} dpr={[1, 1.75]} gl={{ antialias: true }}>
        <color attach="background" args={["#05070a"]} />
        <fog attach="fog" args={["#05070a", 8, 15]} />
        <ambientLight intensity={0.56} />
        <directionalLight color="#ffffff" intensity={2.8} position={[2.8, 3.2, 4.4]} />
        <pointLight color="#ff2f6d" intensity={54} position={[1.35, 0.9, 2.2]} />
        <pointLight color="#53d7ff" intensity={38} position={[-2.4, -0.7, 2.8]} />
        <Suspense fallback={null}>
          <SceneBackground />
          <RobotRelief />
          <Environment preset="warehouse" />
        </Suspense>
        <OrbitControls
          autoRotate
          autoRotateSpeed={0.42}
          enablePan={false}
          enableZoom={false}
          maxPolarAngle={Math.PI / 2.08}
          minPolarAngle={Math.PI / 2.55}
          rotateSpeed={0.38}
        />
        <EffectComposer>
          <Bloom intensity={1.35} luminanceThreshold={0.18} mipmapBlur />
          <ChromaticAberration blendFunction={BlendFunction.SCREEN} offset={[0.001, 0.0015]} />
          <Scanline blendFunction={BlendFunction.OVERLAY} density={1.38} opacity={0.17} />
          <Noise blendFunction={BlendFunction.SOFT_LIGHT} opacity={0.11} />
          <Vignette eskil={false} offset={0.24} darkness={0.82} />
        </EffectComposer>
      </Canvas>
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.055)_1px,transparent_1px)] bg-[length:100%_8px] opacity-30" />
      <div className="pointer-events-none absolute inset-0 shadow-[inset_0_0_90px_rgba(0,0,0,0.82)]" />
      <div className="pointer-events-none absolute bottom-5 left-1/2 h-px w-3/4 -translate-x-1/2 bg-gradient-to-r from-transparent via-cyan-100/70 to-transparent" />
    </div>
  );
}
