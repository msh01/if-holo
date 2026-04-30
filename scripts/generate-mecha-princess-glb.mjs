import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import * as THREE from "three";
import { GLTFExporter } from "three/examples/jsm/exporters/GLTFExporter.js";

if (typeof globalThis.FileReader === "undefined") {
  globalThis.FileReader = class FileReader {
    result = null;
    onloadend = null;

    async readAsArrayBuffer(blob) {
      this.result = await blob.arrayBuffer();
      this.onloadend?.();
    }
  };
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const outputPath = path.resolve(__dirname, "../public/models/mecha-princess.glb");

const scene = new THREE.Scene();
scene.name = "IFHolo_MechaPrincess";

const root = new THREE.Group();
root.name = "MechaPrincess_Rig";
scene.add(root);

const materials = {
  armorGold: new THREE.MeshStandardMaterial({
    name: "Royal_Gold_Armor",
    color: "#ffd84d",
    metalness: 0.82,
    roughness: 0.16,
    emissive: "#ff9f1c",
    emissiveIntensity: 0.55,
  }),
  blueCore: new THREE.MeshStandardMaterial({
    name: "Arc_Blue_Core",
    color: "#58c7ff",
    metalness: 0.55,
    roughness: 0.18,
    emissive: "#00a6ff",
    emissiveIntensity: 2.2,
  }),
  emberTrim: new THREE.MeshStandardMaterial({
    name: "Ember_Weapon_Trim",
    color: "#ff6b1a",
    metalness: 0.68,
    roughness: 0.18,
    emissive: "#fb5607",
    emissiveIntensity: 1.25,
  }),
  porcelain: new THREE.MeshStandardMaterial({
    name: "Porcelain_Faceplate",
    color: "#f5e7cf",
    metalness: 0.12,
    roughness: 0.38,
    emissive: "#332013",
    emissiveIntensity: 0.06,
  }),
  darkFrame: new THREE.MeshStandardMaterial({
    name: "Graphite_Frame",
    color: "#2f3545",
    metalness: 0.9,
    roughness: 0.22,
    emissive: "#111827",
    emissiveIntensity: 0.18,
  }),
  glassGlow: new THREE.MeshStandardMaterial({
    name: "Hologram_Glass",
    color: "#83d7ff",
    metalness: 0.08,
    roughness: 0.08,
    transparent: true,
    opacity: 0.62,
    emissive: "#3a86ff",
    emissiveIntensity: 1.6,
  }),
};

function addMesh(name, geometry, material, position, rotation = [0, 0, 0], scale = [1, 1, 1], parent = root) {
  const mesh = new THREE.Mesh(geometry, material);
  mesh.name = name;
  mesh.position.set(...position);
  mesh.rotation.set(...rotation);
  mesh.scale.set(...scale);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  parent.add(mesh);
  return mesh;
}

function addPair(name, sideOffset, factory) {
  factory(`${name}_L`, -sideOffset);
  factory(`${name}_R`, sideOffset);
}

addMesh("Upper_Torso_Armor", new THREE.CylinderGeometry(0.5, 0.68, 0.82, 8), materials.armorGold, [0, 0.55, 0]);
addMesh("Waist_Core", new THREE.CylinderGeometry(0.3, 0.36, 0.22, 16), materials.blueCore, [0, 0.09, 0]);
addMesh("Royal_Skirt_Armor", new THREE.ConeGeometry(0.86, 0.86, 10, 1, true), materials.darkFrame, [0, -0.34, 0], [0, Math.PI / 10, 0]);
addMesh("Front_Gold_Skirt_Plate", new THREE.BoxGeometry(0.42, 0.78, 0.1), materials.armorGold, [0, -0.37, 0.66], [0.18, 0, 0]);
addMesh("Arc_Reactor", new THREE.SphereGeometry(0.2, 32, 16), materials.blueCore, [0, 0.68, 0.48], [0, 0, 0], [1, 1, 0.45]);

addMesh("Neck_Joint", new THREE.CylinderGeometry(0.14, 0.16, 0.16, 16), materials.darkFrame, [0, 1.0, 0]);
addMesh("Faceplate", new THREE.SphereGeometry(0.4, 32, 18), materials.porcelain, [0, 1.33, 0.02], [0, 0, 0], [0.86, 1.04, 0.72]);
addMesh("Back_Helmet_Shell", new THREE.SphereGeometry(0.43, 32, 16), materials.darkFrame, [0, 1.31, -0.08], [0, 0, 0], [0.92, 1.0, 0.68]);
addMesh("Left_Optic", new THREE.SphereGeometry(0.045, 16, 8), materials.blueCore, [-0.12, 1.36, 0.31], [0, 0, 0], [1.4, 0.7, 0.35]);
addMesh("Right_Optic", new THREE.SphereGeometry(0.045, 16, 8), materials.blueCore, [0.12, 1.36, 0.31], [0, 0, 0], [1.4, 0.7, 0.35]);
addMesh("Crown_Band", new THREE.TorusGeometry(0.3, 0.025, 8, 48), materials.armorGold, [0, 1.66, 0], [Math.PI / 2, 0, 0]);
addMesh("Center_Crown_Spire", new THREE.ConeGeometry(0.08, 0.28, 5), materials.emberTrim, [0, 1.86, 0]);
addMesh("Left_Crown_Spire", new THREE.ConeGeometry(0.06, 0.2, 5), materials.armorGold, [-0.2, 1.78, 0.02], [0, 0, 0.18]);
addMesh("Right_Crown_Spire", new THREE.ConeGeometry(0.06, 0.2, 5), materials.armorGold, [0.2, 1.78, 0.02], [0, 0, -0.18]);

addPair("Shoulder_Pauldron", 0.58, (name, x) => {
  addMesh(name, new THREE.SphereGeometry(0.25, 24, 12), materials.armorGold, [x, 0.82, 0.02], [0, 0, x < 0 ? 0.42 : -0.42], [1.35, 0.76, 0.95]);
});

addPair("Upper_Arm", 0.78, (name, x) => {
  addMesh(name, new THREE.CylinderGeometry(0.075, 0.09, 0.48, 12), materials.darkFrame, [x, 0.42, 0], [0, 0, x < 0 ? -0.36 : 0.36]);
});

addPair("Forearm_Cannon", 0.92, (name, x) => {
  addMesh(name, new THREE.CylinderGeometry(0.14, 0.17, 0.56, 16), materials.armorGold, [x, 0.1, 0.1], [Math.PI / 2, 0, x < 0 ? -0.12 : 0.12]);
  addMesh(`${name}_Muzzle`, new THREE.CylinderGeometry(0.11, 0.11, 0.14, 16), materials.emberTrim, [x, 0.1, 0.46], [Math.PI / 2, 0, 0]);
});

addPair("Leg_Armor", 0.25, (name, x) => {
  addMesh(name, new THREE.CylinderGeometry(0.12, 0.15, 0.68, 12), materials.darkFrame, [x, -0.88, 0], [0.06, 0, 0]);
  addMesh(`${name}_Knee_Gem`, new THREE.SphereGeometry(0.07, 16, 8), materials.blueCore, [x, -0.73, 0.13], [0, 0, 0], [1, 1, 0.45]);
});

addPair("Boot", 0.25, (name, x) => {
  addMesh(name, new THREE.BoxGeometry(0.24, 0.16, 0.42), materials.armorGold, [x, -1.28, 0.12], [0, 0, 0], [1, 0.75, 1]);
});

addMesh("Command_Halo", new THREE.TorusGeometry(0.92, 0.026, 8, 96), materials.glassGlow, [0, 0.52, -0.46], [0.22, 0, 0]);
addMesh("Backpack_Core", new THREE.BoxGeometry(0.42, 0.62, 0.18), materials.darkFrame, [0, 0.45, -0.42]);

addPair("Wing_Blades", 0.5, (name, x) => {
  addMesh(name, new THREE.ConeGeometry(0.11, 1.1, 4), materials.glassGlow, [x, 0.34, -0.72], [x < 0 ? -0.42 : 0.42, 0, x < 0 ? 0.22 : -0.22], [0.9, 1, 0.36]);
});

const light = new THREE.PointLight("#3a86ff", 5, 5);
light.name = "Embedded_Arc_Light";
light.position.set(0, 0.75, 1.1);
root.add(light);

root.scale.setScalar(1.38);
root.rotation.y = -0.18;
root.position.y = 0.0;

const exporter = new GLTFExporter();

await mkdir(path.dirname(outputPath), { recursive: true });

const glb = await new Promise((resolve, reject) => {
  exporter.parse(
    scene,
    resolve,
    reject,
    {
      binary: true,
      trs: false,
      onlyVisible: true,
    },
  );
});

await writeFile(outputPath, Buffer.from(glb));
console.log(`Generated ${outputPath}`);
