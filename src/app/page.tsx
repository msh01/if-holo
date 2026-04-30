import { Gallery } from "@/components/gallery";
import { HologramStage } from "@/components/hologram-stage";
import { specimens } from "@/data/specimens";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#050506] text-white">
      <section className="mx-auto grid min-h-[92vh] w-full max-w-7xl items-center gap-8 px-4 py-8 sm:px-6 lg:grid-cols-[0.88fr_1.12fr] lg:px-8">
        <div className="pt-16 lg:pt-0">
          <p className="font-mono text-xs uppercase tracking-[0.34em] text-cyan-200/70">IF HOLO / GLB model chamber</p>
          <h1 className="mt-5 max-w-4xl text-5xl font-semibold leading-[0.98] text-white sm:text-7xl lg:text-8xl">
            GLB 模型驱动的 3D 全息展柜
          </h1>
          <p className="mt-6 max-w-xl text-base leading-8 text-white/62 sm:text-lg">
            后续渲染统一采用真实 3D 资产：上传或配置 GLB 文件，由 Three.js 直接加载模型、材质和空间结构，再叠加全息扫描、辉光和粒子氛围。可拖拽观察，适合继续扩展成角色展柜、藏品详情和 AR 预览入口。
          </p>
          <div className="mt-8 grid max-w-lg grid-cols-3 gap-3">
            {[
              ["GLB", "模型文件"],
              ["PBR", "真实材质"],
              ["R3F", "3D 渲染"],
            ].map(([value, label]) => (
              <div key={label} className="rounded-md border border-white/10 bg-white/[0.04] p-4">
                <div className="font-mono text-xl text-white">{value}</div>
                <div className="mt-1 text-xs text-white/44">{label}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="h-[68vh] min-h-[480px]">
          <HologramStage specimen={specimens[0]} />
        </div>
      </section>
      <Gallery specimens={specimens} />
    </main>
  );
}
