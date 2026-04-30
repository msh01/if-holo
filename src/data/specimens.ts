export type SpecimenIconName = "cat" | "sparkles" | "crown" | "gamepad" | "moon" | "flame";
export type HologramConfig = {
  projectorRing: "soft" | "arc" | "pulse";
  scanlineDensity: number;
  particleCount: number;
  idleMotion: "pounce" | "float" | "guard";
};

export type Specimen = {
  id: string;
  title: string;
  archetype: string;
  tag: string;
  rarity: string;
  mood: string;
  palette: [string, string, string];
  signal: number;
  lore: string;
  modelUrl: string;
  iconName: SpecimenIconName;
  credit?: {
    source: string;
    license: string;
    url: string;
  };
  hologram?: HologramConfig;
};

const DEFAULT_GLB_MODEL = "/models/if-holo-default.glb";

export const specimens: Specimen[] = [
  {
    id: "neon-cat",
    title: "霓虹猫灵",
    archetype: "Cat Familiar",
    tag: "萌宠 / 赛博",
    rarity: "SSR",
    mood: "调皮、黏人、带电",
    palette: ["#00f5ff", "#ff4fd8", "#ffe66d"],
    signal: 96,
    lore: "从深夜弹幕里凝结出来的小型守护灵，会把路过的光点当成玩具扑过去。",
    modelUrl: "/models/neon-cat-real.glb",
    iconName: "cat",
    credit: {
      source: "Poly Pizza / Cat by Poly by Google",
      license: "CC BY 3.0",
      url: "https://poly.pizza/m/6dM1J6f6pm9",
    },
    hologram: {
      projectorRing: "pulse",
      scanlineDensity: 1.65,
      particleCount: 140,
      idleMotion: "pounce",
    },
  },
  {
    id: "void-idol",
    title: "虚空偶像",
    archetype: "Digital Diva",
    tag: "美女 / 舞台",
    rarity: "UR",
    mood: "冷艳、危险、会唱歌",
    palette: ["#9b5cff", "#00ffa3", "#ff2f6d"],
    signal: 91,
    lore: "一次失败的线上演唱会留下的高维残影，只在低延迟网络里完整现身。",
    modelUrl: DEFAULT_GLB_MODEL,
    iconName: "sparkles",
  },
  {
    id: "mecha-princess",
    title: "机甲公主",
    archetype: "Anime Royal",
    tag: "动漫 / 机甲",
    rarity: "SSR",
    mood: "优雅、强硬、火力足",
    palette: ["#ffb703", "#3a86ff", "#fb5607"],
    signal: 88,
    lore: "王冠不是装饰，而是一个舰队级指挥核心，低头时会展开光学武装。",
    modelUrl: "/models/mecha-princess-clear.glb",
    iconName: "crown",
  },
  {
    id: "warehouse-avocado",
    title: "冷库牛油果",
    archetype: "Cold Storage Asset",
    tag: "仓储 / 生鲜",
    rarity: "R",
    mood: "成熟、沉稳、可盘点",
    palette: ["#9bdc28", "#4d7c0f", "#f8d66d"],
    signal: 79,
    lore: "从数字冷链货架里抽样入库的生鲜资产，表皮纹理比库存编号更诚实。",
    modelUrl: "/models/warehouse-avocado.glb",
    iconName: "moon",
    credit: {
      source: "Khronos glTF Sample Models / Avocado",
      license: "CC0",
      url: "https://github.com/KhronosGroup/glTF-Sample-Models/tree/main/2.0/Avocado",
    },
  },
  {
    id: "warehouse-boombox",
    title: "复古音箱货格",
    archetype: "Audio Inventory",
    tag: "仓储 / 设备",
    rarity: "SR",
    mood: "复古、响亮、带库存噪声",
    palette: ["#ff5d8f", "#fbbf24", "#38bdf8"],
    signal: 86,
    lore: "曾经属于模拟时代的便携音箱，如今被登记为高声压文化遗物。",
    modelUrl: "/models/warehouse-boombox.glb",
    iconName: "gamepad",
    credit: {
      source: "Khronos glTF Sample Models / Boom Box",
      license: "CC0",
      url: "https://github.com/KhronosGroup/glTF-Sample-Models/tree/main/2.0/BoomBox",
    },
  },
  {
    id: "warehouse-milk-truck",
    title: "奶车调度单元",
    archetype: "Fleet Inventory",
    tag: "仓储 / 运输",
    rarity: "SSR",
    mood: "可靠、准点、会绕开拥堵",
    palette: ["#60a5fa", "#f8fafc", "#f97316"],
    signal: 82,
    lore: "一台被数字仓管接管的配送车，路线、载重和温控都刻在模型层级里。",
    modelUrl: "/models/warehouse-milk-truck.glb",
    iconName: "sparkles",
    credit: {
      source: "Khronos glTF Sample Models / Cesium Milk Truck",
      license: "CC BY 4.0",
      url: "https://github.com/KhronosGroup/glTF-Sample-Models/tree/main/2.0/CesiumMilkTruck",
    },
  },
  {
    id: "warehouse-fox",
    title: "巡仓低模狐",
    archetype: "Patrol Mascot",
    tag: "仓储 / 巡检",
    rarity: "SR",
    mood: "机敏、低多边形、跑得很快",
    palette: ["#fb923c", "#fef3c7", "#22c55e"],
    signal: 90,
    lore: "它原本只是仓库巡检系统的吉祥物，后来学会了在货架阴影里自己巡逻。",
    modelUrl: "/models/warehouse-fox.glb",
    iconName: "flame",
    credit: {
      source: "Khronos glTF Sample Models / Fox",
      license: "CC0 model, CC BY 4.0 rigging/animation",
      url: "https://github.com/KhronosGroup/glTF-Sample-Models/tree/main/2.0/Fox",
    },
  },
  {
    id: "blade-runner",
    title: "断网剑客",
    archetype: "Game Hero",
    tag: "游戏 / 动作",
    rarity: "SR",
    mood: "沉默、迅捷、像 Boss",
    palette: ["#06d6a0", "#118ab2", "#f72585"],
    signal: 84,
    lore: "据说他的刀能切开防火墙，也能切开一段迟迟不肯结束的剧情线。",
    modelUrl: DEFAULT_GLB_MODEL,
    iconName: "gamepad",
  },
  {
    id: "moon-scribe",
    title: "月相书记官",
    archetype: "Novel Mystic",
    tag: "网文 / 玄幻",
    rarity: "SSR",
    mood: "克制、神秘、会改命",
    palette: ["#d6f6ff", "#7b2cbf", "#80ffdb"],
    signal: 93,
    lore: "每翻动一页星历，展厅里的重力都会轻轻偏移半秒。",
    modelUrl: DEFAULT_GLB_MODEL,
    iconName: "moon",
  },
  {
    id: "ember-fox",
    title: "余烬武姬",
    archetype: "Mythic Fighter",
    tag: "幻想 / 战斗",
    rarity: "UR",
    mood: "热烈、骄傲、不服输",
    palette: ["#ff006e", "#ffbe0b", "#38b000"],
    signal: 89,
    lore: "她的每一次出招都会在空气里留下短暂燃烧的像素火纹。",
    modelUrl: DEFAULT_GLB_MODEL,
    iconName: "flame",
  },
];

export function getSpecimen(id: string) {
  return specimens.find((specimen) => specimen.id === id);
}
