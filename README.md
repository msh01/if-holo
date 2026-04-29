# IF HOLO

一个酷炫、可玩的在线数字全息收藏馆原型。

首页是卡片瀑布流，每个藏品卡片可以进入独立全息展舱。展品主体当前用程序化 Three.js 资产模拟，后续可以替换为“原图 + 深度图”的 2.5D 浮雕效果，或接入真实 3D 模型资产。

## 当前体验

- 数字全息收藏馆首页
- 瀑布流藏品卡片
- 单藏品全息详情页：`/holo/[id]`
- 程序化全息主体、扫描线、辉光、颗粒和投影台
- 卡片入场动效
- 卡片 hover / 点击音效
- 预置藏品：猫猫、虚拟偶像、动漫角色、游戏角色、网文角色等方向

## 技术栈

- Next.js App Router
- React 19
- TypeScript
- Tailwind CSS 4
- HeroUI
- lucide-react
- `@react-three/fiber`
- `@react-three/drei`
- `@react-three/postprocessing`
- Three.js
- GSAP
- Howler.js

## 本地开发

安装依赖：

```bash
npm install
```

启动开发服务器：

```bash
npm run dev
```

如果 `3000` 端口已被占用，可以指定端口：

```bash
npm run dev -- --port 3107
```

打开：

```text
http://localhost:3107
```

## 常用命令

```bash
npm run lint
npm run build
```

## 目录结构

```text
src/app/page.tsx                 首页
src/app/holo/[id]/page.tsx       全息藏品详情页
src/components/gallery.tsx       瀑布流藏品卡片
src/components/hologram-stage.tsx Three.js 全息舞台
src/components/specimen-icon.tsx  藏品图标映射
src/data/specimens.ts            藏品数据
```

## 3D 实现路线

当前原型先用程序化 mesh、材质扭曲、wireframe、Bloom、Chromatic Aberration、Scanline 和 Noise 做“全息投影”的可玩感。

后续可以并行探索两条路线：

1. 2.5D 浮雕路线  
   使用原图、主体 mask 和 depth map，通过 displacement、layer parallax、shader 扫描线实现“平面图像立起来”的效果。

2. 真实 3D 资产路线  
   使用 GLB、VRM 或绑定角色模型，配合动作、表情、idle 动画和展台特效，做更完整的收藏品展示。

## 后续想法

- 用户上传角色图，自动生成 2.5D 全息卡
- 稀有度、编号、发行量、收藏状态
- 抽卡式发现藏品
- 展品音色、语音和环境声
- 手势旋转、缩放、AR 预览
- GLB / VRM 模型资产管理
- 收藏馆个人主页和分享页
