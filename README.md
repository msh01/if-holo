# IF HOLO

一个酷炫、可玩的在线数字全息收藏馆原型。

项目当前已经统一采用真实 3D 模型资产路线：每个藏品通过 GLB 文件加载模型、材质和空间结构，再叠加全息扫描线、辉光、颗粒、投影台和可交互视角控制。2.5D 深度图浮雕方案已经废弃，不再作为主渲染方向。

## 当前体验

- 数字全息收藏馆首页
- 等高网格藏品卡片
- 单藏品全息详情页：`/holo/[id]`
- GLB 模型驱动的 Three.js 全息舞台
- OrbitControls 拖拽旋转、自动缓慢旋转
- 扫描线、Bloom、Chromatic Aberration、Noise、Vignette 等全息后期效果
- 卡片入场动效
- 卡片 hover / 点击音效
- 预置藏品：猫猫、虚拟偶像、动漫角色、游戏角色、网文角色等方向

## 技术栈

- Next.js 16 App Router
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

默认打开：

```text
http://localhost:3000
```

如果 `3000` 端口已被占用，可以指定端口：

```bash
npm run dev -- --port 3107
```

## 常用命令

```bash
npm run lint
npm run build
```

## 目录结构

```text
public/models/if-holo-default.glb        默认 GLB 占位模型
src/app/page.tsx                         首页
src/app/holo/[id]/page.tsx               全息藏品详情页
src/components/gallery.tsx               等高藏品卡片网格
src/components/hologram-stage.tsx        GLB 全息 3D 舞台
src/components/specimen-icon.tsx         藏品图标映射
src/data/specimens.ts                    藏品数据与模型路径
```

## GLB 模型路线

藏品数据在 `src/data/specimens.ts` 中维护。每个藏品通过 `modelUrl` 指向一个公开可访问的 GLB 文件，例如：

```ts
{
  id: "neon-cat",
  title: "霓虹猫灵",
  modelUrl: "/models/if-holo-default.glb",
}
```

当前仓库内置了一个默认占位模型：

```text
public/models/if-holo-default.glb
```

后续替换真实角色模型时，把新的 `.glb` 放到 `public/models/` 下，再更新对应藏品的 `modelUrl` 即可。

## 后续想法

- 每个藏品使用独立 GLB / VRM 模型
- 模型上传、预览和资产管理
- 稀有度、编号、发行量、收藏状态
- 抽卡式发现藏品
- 展品音色、语音和环境声
- 手势旋转、缩放、AR 预览
- 角色 idle 动画、表情和动作状态
- 收藏馆个人主页和分享页
