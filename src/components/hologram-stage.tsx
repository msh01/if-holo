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
  const isMechaPrincess = specimen.id === "mecha-princess";

  root.traverse((object) => {
    const mesh = object as Mesh;
    if (!mesh.isMesh) return;

    mesh.castShadow = true;
    mesh.receiveShadow = true;

    const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
    mesh.material = materials.map((material) => {
      const cloned = material.clone();

      if (isMechaPrincess) {
        const sourceColor = cloned instanceof THREE.MeshBasicMaterial || cloned instanceof THREE.MeshStandardMaterial || cloned instanceof THREE.MeshPhysicalMaterial
          ? cloned.color.clone()
          : accent.clone();
        const visibleMaterial = new THREE.MeshStandardMaterial({
          color: sourceColor.lerp(new THREE.Color("#ffffff"), 0.18),
          emissive: glow,
          emissiveIntensity: 0.9,
          metalness: 0.55,
          roughness: 0.24,
          side: THREE.DoubleSide,
        });
        visibleMaterial.name = `${cloned.name || "material"}_display`;
        visibleMaterial.toneMapped = false;
        return visibleMaterial;
      }

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

function fitModelToView(root: Object3D, targetHeight: number) {
  root.updateWorldMatrix(true, true);
  const box = new THREE.Box3().setFromObject(root);
  const size = new THREE.Vector3();
  const center = new THREE.Vector3();

  box.getSize(size);
  box.getCenter(center);

  const wrapper = new THREE.Group();
  wrapper.name = `${root.name || "glb"}_Fitted`;

  if (size.y > 0) {
    root.position.sub(center);
    wrapper.scale.setScalar(targetHeight / size.y);
  }

  wrapper.add(root);
  return wrapper;
}

function GlbAvatar({ specimen }: { specimen: Specimen }) {
  const groupRef = useRef<Group>(null);
  const { scene } = useGLTF(specimen.modelUrl);
  const isMechaPrincess = specimen.id === "mecha-princess";

  const model = useMemo(() => {
    const cloned = scene.clone(true);
    tintModelMaterials(cloned, specimen);
    return fitModelToView(cloned, isMechaPrincess ? 2.8 : 2.45);
  }, [isMechaPrincess, scene, specimen]);

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
      <Float floatIntensity={isMechaPrincess ? 0.28 : 0.72} rotationIntensity={isMechaPrincess ? 0.08 : 0.24} speed={1.7}>
        <primitive object={model} position={[0, isMechaPrincess ? 0.02 : 0.05, 0]} scale={isMechaPrincess ? 1.25 : 1.12} />
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
        count={isMechaPrincess ? 36 : specimen.hologram?.particleCount ?? 96}
        scale={isMechaPrincess ? [2.6, 2.8, 1.4] : [4.4, 3.8, 2.4]}
        size={isMechaPrincess ? 1.15 : 2.15}
        speed={isMechaPrincess ? 0.32 : 0.58}
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

function MechaPrincessDisplay({ specimen }: { specimen: Specimen }) {
  const groupRef = useRef<Group>(null);

  useFrame(({ clock, pointer }) => {
    if (!groupRef.current) return;
    groupRef.current.rotation.y = Math.sin(clock.elapsedTime * 0.45) * 0.18 + pointer.x * 0.18;
    groupRef.current.rotation.x = pointer.y * 0.06;
    groupRef.current.position.y = Math.sin(clock.elapsedTime * 0.9) * 0.04;
  });

  const gold = specimen.palette[0];
  const blue = specimen.palette[1];
  const ember = specimen.palette[2];

  return (
    <group ref={groupRef} position={[0, -0.12, 0]} scale={1.16}>
      <mesh position={[0, 0.54, 0]}>
        <cylinderGeometry args={[0.46, 0.62, 0.78, 8]} />
        <meshStandardMaterial color="#ffd84d" emissive={gold} emissiveIntensity={0.32} metalness={0.72} roughness={0.18} />
      </mesh>

      <mesh position={[0, 0.72, 0.46]} scale={[1, 1, 0.42]}>
        <sphereGeometry args={[0.18, 32, 16]} />
        <meshStandardMaterial color="#8fe6ff" emissive={blue} emissiveIntensity={2.5} toneMapped={false} />
      </mesh>

      <mesh position={[0, 1.35, 0.04]} scale={[0.82, 1, 0.72]}>
        <sphereGeometry args={[0.36, 32, 18]} />
        <meshStandardMaterial color="#f5e7cf" emissive="#47301f" emissiveIntensity={0.2} roughness={0.36} />
      </mesh>

      <mesh position={[0, 1.32, -0.06]} scale={[0.92, 1.02, 0.68]}>
        <sphereGeometry args={[0.4, 32, 16]} />
        <meshStandardMaterial color="#394152" emissive="#182033" emissiveIntensity={0.28} metalness={0.8} roughness={0.2} />
      </mesh>

      {[-0.13, 0.13].map((x) => (
        <mesh key={`optic-${x}`} position={[x, 1.37, 0.32]} scale={[1.5, 0.7, 0.35]}>
          <sphereGeometry args={[0.045, 16, 8]} />
          <meshStandardMaterial color="#d8fbff" emissive={blue} emissiveIntensity={3} toneMapped={false} />
        </mesh>
      ))}

      <mesh position={[0, 1.69, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.3, 0.025, 8, 48]} />
        <meshStandardMaterial color="#ffe066" emissive={gold} emissiveIntensity={0.45} metalness={0.75} roughness={0.16} />
      </mesh>

      {[[-0.22, 1.8, 0.02, 0.18], [0, 1.9, 0.03, 0], [0.22, 1.8, 0.02, -0.18]].map(([x, y, z, rz]) => (
        <mesh key={`crown-${x}`} position={[x, y, z]} rotation={[0, 0, rz]}>
          <coneGeometry args={[x === 0 ? 0.08 : 0.06, x === 0 ? 0.28 : 0.2, 5]} />
          <meshStandardMaterial color={x === 0 ? "#ff7a1a" : "#ffe066"} emissive={x === 0 ? ember : gold} emissiveIntensity={0.75} />
        </mesh>
      ))}

      <mesh position={[0, -0.28, 0]} rotation={[0, Math.PI / 10, 0]}>
        <coneGeometry args={[0.82, 0.86, 10, 1, true]} />
        <meshStandardMaterial color="#343b4f" emissive="#151b2a" emissiveIntensity={0.28} metalness={0.82} roughness={0.22} side={THREE.DoubleSide} />
      </mesh>

      <mesh position={[0, -0.34, 0.65]} rotation={[0.18, 0, 0]}>
        <boxGeometry args={[0.42, 0.78, 0.1]} />
        <meshStandardMaterial color="#ffd84d" emissive={gold} emissiveIntensity={0.38} metalness={0.72} roughness={0.16} />
      </mesh>

      {[-1, 1].map((side) => (
        <group key={`arm-${side}`}>
          <mesh position={[side * 0.62, 0.82, 0.02]} rotation={[0, 0, side * -0.42]} scale={[1.35, 0.76, 0.95]}>
            <sphereGeometry args={[0.24, 24, 12]} />
            <meshStandardMaterial color="#ffd84d" emissive={gold} emissiveIntensity={0.36} metalness={0.78} roughness={0.16} />
          </mesh>
          <mesh position={[side * 0.88, 0.16, 0.22]} rotation={[Math.PI / 2, 0, side * 0.12]}>
            <cylinderGeometry args={[0.15, 0.18, 0.64, 16]} />
            <meshStandardMaterial color="#ffd84d" emissive={gold} emissiveIntensity={0.34} metalness={0.78} roughness={0.16} />
          </mesh>
          <mesh position={[side * 0.88, 0.16, 0.62]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.11, 0.11, 0.16, 16]} />
            <meshStandardMaterial color="#ff7a1a" emissive={ember} emissiveIntensity={1.8} toneMapped={false} />
          </mesh>
        </group>
      ))}

      {[-1, 1].map((side) => (
        <group key={`leg-${side}`}>
          <mesh position={[side * 0.25, -0.88, 0]}>
            <cylinderGeometry args={[0.13, 0.16, 0.68, 12]} />
            <meshStandardMaterial color="#394152" emissive="#151b2a" emissiveIntensity={0.24} metalness={0.82} roughness={0.22} />
          </mesh>
          <mesh position={[side * 0.25, -1.29, 0.12]} scale={[1, 0.75, 1]}>
            <boxGeometry args={[0.24, 0.16, 0.42]} />
            <meshStandardMaterial color="#ffd84d" emissive={gold} emissiveIntensity={0.32} metalness={0.75} roughness={0.16} />
          </mesh>
        </group>
      ))}

      <mesh position={[0, 0.48, -0.5]} rotation={[0.22, 0, 0]}>
        <torusGeometry args={[0.92, 0.026, 8, 96]} />
        <meshStandardMaterial color="#8fe6ff" emissive={blue} emissiveIntensity={1.6} transparent opacity={0.72} toneMapped={false} />
      </mesh>

      {[-1, 1].map((side) => (
        <mesh key={`wing-${side}`} position={[side * 0.52, 0.32, -0.76]} rotation={[side * 0.42, 0, side * -0.22]} scale={[0.9, 1, 0.36]}>
          <coneGeometry args={[0.12, 1.08, 4]} />
          <meshStandardMaterial color="#8fe6ff" emissive={blue} emissiveIntensity={1.25} transparent opacity={0.62} toneMapped={false} />
        </mesh>
      ))}
    </group>
  );
}

function WarehouseAssetDisplay({ specimen }: { specimen: Specimen }) {
  const groupRef = useRef<Group>(null);

  useFrame(({ clock, pointer }) => {
    if (!groupRef.current) return;
    groupRef.current.rotation.y = Math.sin(clock.elapsedTime * 0.42) * 0.22 + pointer.x * 0.18;
    groupRef.current.rotation.x = pointer.y * 0.05;
    groupRef.current.position.y = Math.sin(clock.elapsedTime * 0.85) * 0.04;
  });

  if (specimen.id === "warehouse-avocado") {
    return (
      <group ref={groupRef} position={[0, -0.05, 0]} scale={1.35}>
        <mesh scale={[0.86, 1.2, 0.72]}>
          <sphereGeometry args={[0.8, 48, 24]} />
          <meshStandardMaterial color="#6faa25" emissive="#315b12" emissiveIntensity={0.28} roughness={0.42} />
        </mesh>
        <mesh position={[0.02, 0.02, 0.52]} scale={[0.58, 0.82, 0.14]}>
          <sphereGeometry args={[0.58, 40, 18]} />
          <meshStandardMaterial color="#d6f47a" emissive="#8bbd2e" emissiveIntensity={0.42} roughness={0.35} />
        </mesh>
        <mesh position={[0.02, -0.08, 0.66]} scale={[1, 1, 0.24]}>
          <sphereGeometry args={[0.22, 32, 14]} />
          <meshStandardMaterial color="#6b3f1d" emissive="#3a210f" emissiveIntensity={0.2} roughness={0.5} />
        </mesh>
      </group>
    );
  }

  if (specimen.id === "warehouse-boombox") {
    return (
      <group ref={groupRef} position={[0, -0.05, 0]} scale={1.28}>
        <mesh>
          <boxGeometry args={[2.2, 1.15, 0.56]} />
          <meshStandardMaterial color="#2f3545" emissive="#171b28" emissiveIntensity={0.35} metalness={0.65} roughness={0.22} />
        </mesh>
        {[-0.62, 0.62].map((x) => (
          <group key={x} position={[x, -0.02, 0.31]}>
            <mesh>
              <cylinderGeometry args={[0.36, 0.36, 0.09, 48]} />
              <meshStandardMaterial color="#111827" emissive="#ff5d8f" emissiveIntensity={0.38} metalness={0.4} roughness={0.28} />
            </mesh>
            <mesh position={[0, 0, 0.06]}>
              <cylinderGeometry args={[0.18, 0.18, 0.08, 48]} />
              <meshStandardMaterial color="#fbbf24" emissive="#f59e0b" emissiveIntensity={0.7} toneMapped={false} />
            </mesh>
          </group>
        ))}
        <mesh position={[0, 0.68, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.78, 0.045, 12, 64]} />
          <meshStandardMaterial color="#38bdf8" emissive="#0ea5e9" emissiveIntensity={0.85} metalness={0.5} roughness={0.18} />
        </mesh>
      </group>
    );
  }

  if (specimen.id === "warehouse-milk-truck") {
    return (
      <group ref={groupRef} position={[0, -0.25, 0]} scale={1.05}>
        <mesh position={[-0.36, 0.22, 0]}>
          <boxGeometry args={[1.45, 0.72, 0.72]} />
          <meshStandardMaterial color="#f8fafc" emissive="#dbeafe" emissiveIntensity={0.38} roughness={0.24} />
        </mesh>
        <mesh position={[0.76, 0.1, 0]}>
          <boxGeometry args={[0.82, 0.58, 0.7]} />
          <meshStandardMaterial color="#60a5fa" emissive="#2563eb" emissiveIntensity={0.45} roughness={0.22} />
        </mesh>
        <mesh position={[1.12, 0.34, 0.02]}>
          <boxGeometry args={[0.2, 0.22, 0.5]} />
          <meshStandardMaterial color="#bfdbfe" emissive="#60a5fa" emissiveIntensity={0.7} transparent opacity={0.8} />
        </mesh>
        {[-0.82, -0.18, 0.82].flatMap((x) =>
          [-0.42, 0.42].map((z) => (
            <mesh key={`${x}-${z}`} position={[x, -0.32, z]} rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.18, 0.18, 0.14, 32]} />
              <meshStandardMaterial color="#111827" emissive="#f97316" emissiveIntensity={0.24} roughness={0.28} />
            </mesh>
          )),
        )}
        <mesh position={[-0.36, 0.66, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.07, 0.07, 1.25, 24]} />
          <meshStandardMaterial color="#f97316" emissive="#f97316" emissiveIntensity={0.9} toneMapped={false} />
        </mesh>
      </group>
    );
  }

  if (specimen.id === "warehouse-fox") {
    return (
      <group ref={groupRef} position={[0, -0.15, 0]} scale={1.26}>
        <mesh position={[0, 0.1, 0]} scale={[1.2, 0.55, 0.45]}>
          <sphereGeometry args={[0.55, 8, 6]} />
          <meshStandardMaterial color="#fb923c" emissive="#ea580c" emissiveIntensity={0.38} roughness={0.38} flatShading />
        </mesh>
        <mesh position={[0.82, 0.32, 0]} scale={[0.66, 0.52, 0.48]}>
          <sphereGeometry args={[0.42, 8, 6]} />
          <meshStandardMaterial color="#fb923c" emissive="#ea580c" emissiveIntensity={0.42} roughness={0.38} flatShading />
        </mesh>
        {[0.68, 0.95].map((x) => (
          <mesh key={x} position={[x, 0.78, 0]} rotation={[0, 0, x > 0.8 ? -0.3 : 0.3]}>
            <coneGeometry args={[0.16, 0.38, 4]} />
            <meshStandardMaterial color="#fef3c7" emissive="#f59e0b" emissiveIntensity={0.32} flatShading />
          </mesh>
        ))}
        <mesh position={[-0.86, 0.34, 0]} rotation={[0, 0, -1.05]} scale={[0.38, 1.15, 0.38]}>
          <coneGeometry args={[0.3, 1.0, 6]} />
          <meshStandardMaterial color="#f97316" emissive="#fb923c" emissiveIntensity={0.45} flatShading />
        </mesh>
        {[-0.42, -0.12, 0.36, 0.66].map((x) => (
          <mesh key={x} position={[x, -0.48, x > 0.2 ? 0.16 : -0.14]} scale={[0.14, 0.65, 0.14]}>
            <cylinderGeometry args={[0.08, 0.1, 0.58, 6]} />
            <meshStandardMaterial color="#3f2a1d" emissive="#1f120a" emissiveIntensity={0.18} flatShading />
          </mesh>
        ))}
      </group>
    );
  }

  return <GlbAvatar specimen={specimen} />;
}

function NeonCatDisplay({ specimen }: { specimen: Specimen }) {
  const groupRef = useRef<Group>(null);

  useFrame(({ clock, pointer }) => {
    if (!groupRef.current) return;
    groupRef.current.rotation.y = Math.sin(clock.elapsedTime * 0.42) * 0.16 + pointer.x * 0.14;
    groupRef.current.rotation.x = pointer.y * 0.05;
    groupRef.current.position.y = Math.sin(clock.elapsedTime * 0.9) * 0.035;
  });

  return (
    <group ref={groupRef} position={[0, -0.16, 0]} scale={1.1}>
      <mesh position={[0, -0.1, 0]} scale={[0.72, 1.05, 0.5]}>
        <sphereGeometry args={[0.74, 18, 12]} />
        <meshStandardMaterial color="#263241" emissive={specimen.palette[0]} emissiveIntensity={0.34} roughness={0.42} metalness={0.08} />
      </mesh>

      <mesh position={[0, 0.88, 0.08]} scale={[0.68, 0.58, 0.5]}>
        <sphereGeometry args={[0.55, 18, 12]} />
        <meshStandardMaterial color="#2d3848" emissive={specimen.palette[0]} emissiveIntensity={0.42} roughness={0.36} metalness={0.08} />
      </mesh>

      {[-0.28, 0.28].map((x) => (
        <mesh key={`ear-${x}`} position={[x, 1.34, 0.08]} rotation={[0, 0, x < 0 ? 0.22 : -0.22]}>
          <coneGeometry args={[0.18, 0.46, 3]} />
          <meshStandardMaterial color="#202938" emissive={specimen.palette[1]} emissiveIntensity={0.38} roughness={0.35} />
        </mesh>
      ))}

      {[-0.16, 0.16].map((x) => (
        <mesh key={`eye-${x}`} position={[x, 0.92, 0.54]} scale={[1.18, 0.72, 0.28]}>
          <sphereGeometry args={[0.055, 16, 8]} />
          <meshStandardMaterial color="#fff7a8" emissive={specimen.palette[2]} emissiveIntensity={2.4} toneMapped={false} />
        </mesh>
      ))}

      <mesh position={[0, 0.77, 0.57]} rotation={[Math.PI / 2, 0, Math.PI]}>
        <coneGeometry args={[0.055, 0.095, 3]} />
        <meshStandardMaterial color="#ff6bd6" emissive={specimen.palette[1]} emissiveIntensity={1.2} toneMapped={false} />
      </mesh>

      {[-1, 1].map((side) =>
        [-0.02, 0.13, -0.17].map((y, index) => (
          <mesh key={`whisker-${side}-${index}`} position={[side * 0.28, 0.76 + y, 0.58]} rotation={[0, 0, side * (0.15 + index * 0.11)]}>
            <boxGeometry args={[0.42, 0.015, 0.015]} />
            <meshBasicMaterial color="#d6f6ff" />
          </mesh>
        )),
      )}

      {[-0.24, 0.24].map((x) => (
        <mesh key={`paw-${x}`} position={[x, -0.83, 0.42]} scale={[0.72, 0.3, 0.55]}>
          <sphereGeometry args={[0.2, 14, 8]} />
          <meshStandardMaterial color="#1f2937" emissive={specimen.palette[0]} emissiveIntensity={0.3} roughness={0.4} />
        </mesh>
      ))}

      <mesh position={[-0.62, -0.02, -0.08]} rotation={[0.24, 0.2, -0.9]} scale={[0.36, 1.08, 0.36]}>
        <torusGeometry args={[0.42, 0.07, 10, 42, Math.PI * 1.28]} />
        <meshStandardMaterial color="#253244" emissive={specimen.palette[1]} emissiveIntensity={0.42} roughness={0.34} />
      </mesh>

      <mesh position={[0, -1.08, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.58, 1.18, 80]} />
        <meshBasicMaterial color={specimen.palette[0]} opacity={0.22} transparent side={THREE.DoubleSide} />
      </mesh>
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
  const isMechaPrincess = specimen.id === "mecha-princess";
  const isWarehouseAsset = specimen.id.startsWith("warehouse-");
  const isNeonCat = specimen.id === "neon-cat";

  return (
    <div
      className="relative h-full min-h-[360px] overflow-hidden rounded-md border border-white/10 bg-black"
      style={{
        background: `radial-gradient(circle at 50% 36%, ${specimen.palette[0]}33, transparent 34%), radial-gradient(circle at 20% 70%, ${specimen.palette[1]}24, transparent 28%), #030405`,
      }}
    >
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.055)_1px,transparent_1px)] bg-[length:100%_8px] opacity-25" />
      <div className="pointer-events-none absolute inset-x-8 top-8 h-px bg-gradient-to-r from-transparent via-white/70 to-transparent" />
      <Canvas
        camera={{ fov: isMechaPrincess ? 34 : compact ? 42 : 36, position: [0, isMechaPrincess ? 0.12 : 0.1, isMechaPrincess ? 5.2 : compact ? 5.2 : 4.8] }}
        dpr={[1.25, 2]}
        gl={{ antialias: true }}
      >
        <color attach="background" args={["#020203"]} />
        <ambientLight intensity={isMechaPrincess || isWarehouseAsset || isNeonCat ? 1.05 : 0.62} />
        <directionalLight color="#ffffff" intensity={isMechaPrincess || isWarehouseAsset || isNeonCat ? 3.4 : 2.1} position={[2.4, 3.2, 3.6]} />
        <pointLight color={specimen.palette[0]} intensity={isMechaPrincess || isWarehouseAsset || isNeonCat ? 24 : 42} position={[2.4, 2.4, 2.6]} />
        <pointLight color={specimen.palette[1]} intensity={isMechaPrincess || isWarehouseAsset || isNeonCat ? 18 : 26} position={[-2, -0.7, 2.2]} />
        <Suspense fallback={<StageFallback specimen={specimen} />}>
          {isMechaPrincess ? (
            <MechaPrincessDisplay specimen={specimen} />
          ) : isWarehouseAsset ? (
            <WarehouseAssetDisplay specimen={specimen} />
          ) : isNeonCat ? (
            <NeonCatDisplay specimen={specimen} />
          ) : (
            <GlbAvatar specimen={specimen} />
          )}
          <Environment preset="city" />
        </Suspense>
        <OrbitControls
          autoRotate
          autoRotateSpeed={isMechaPrincess ? 0.18 : 0.36}
          enablePan={false}
          enableZoom={!compact}
          maxDistance={isMechaPrincess ? 7.4 : 6.2}
          minDistance={isMechaPrincess ? 4.8 : 3.4}
          maxPolarAngle={Math.PI / 1.82}
          minPolarAngle={Math.PI / 3.1}
          rotateSpeed={0.42}
        />
        <EffectComposer>
          <Bloom intensity={isMechaPrincess ? 0.42 : 1.45} luminanceThreshold={isMechaPrincess ? 0.72 : 0.1} mipmapBlur />
          <ChromaticAberration blendFunction={BlendFunction.SCREEN} offset={isMechaPrincess ? [0.00035, 0.00045] : [0.0012, 0.0018]} />
          <Scanline blendFunction={BlendFunction.OVERLAY} density={specimen.hologram?.scanlineDensity ?? 1.25} opacity={isMechaPrincess ? 0.07 : 0.22} />
          <Noise blendFunction={BlendFunction.SOFT_LIGHT} opacity={isMechaPrincess ? 0.05 : 0.16} />
          <Vignette eskil={false} offset={0.25} darkness={isMechaPrincess ? 0.42 : 0.72} />
        </EffectComposer>
      </Canvas>
      <div className="pointer-events-none absolute bottom-5 left-1/2 h-px w-3/4 -translate-x-1/2 bg-gradient-to-r from-transparent via-cyan-100/70 to-transparent" />
      <div className="pointer-events-none absolute inset-0 shadow-[inset_0_0_80px_rgba(0,0,0,0.88)]" />
    </div>
  );
}

useGLTF.preload("/models/if-holo-default.glb");
useGLTF.preload("/models/neon-cat-real.glb");
useGLTF.preload("/models/mecha-princess-clear.glb");
useGLTF.preload("/models/warehouse-avocado.glb");
useGLTF.preload("/models/warehouse-boombox.glb");
useGLTF.preload("/models/warehouse-milk-truck.glb");
useGLTF.preload("/models/warehouse-fox.glb");
