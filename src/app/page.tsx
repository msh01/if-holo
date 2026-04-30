import { DepthHologramStage } from "@/components/depth-hologram-stage";
import { Gallery } from "@/components/gallery";
import { specimens } from "@/data/specimens";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#050506] text-white">
      <section className="mx-auto grid min-h-[92vh] w-full max-w-7xl items-center gap-8 px-4 py-8 sm:px-6 lg:grid-cols-[0.88fr_1.12fr] lg:px-8">
        <div className="pt-16 lg:pt-0">
          <p className="font-mono text-xs uppercase tracking-[0.34em] text-cyan-200/70">IF HOLO / Depth relief chamber</p>
          <h1 className="mt-5 max-w-4xl text-5xl font-semibold leading-[0.98] text-white sm:text-7xl lg:text-8xl">
            深度图驱动的 2.5D 全息浮雕
          </h1>
          <p className="mt-6 max-w-xl text-base leading-8 text-white/62 sm:text-lg">
            使用原图作为颜色贴图，深度图同时作为位移贴图和透明遮罩，在高细分平面上重建机器人前后层次。可拖拽观察，鼠标移动会带来轻微视差，适合继续扩展成全息展柜、角色卡或视频封面动效。
          </p>
          <div className="mt-8 grid max-w-lg grid-cols-3 gap-3">
            {[
              ["PNG", "原图贴图"],
              ["Depth", "深度位移"],
              ["R3F", "实时渲染"],
            ].map(([value, label]) => (
              <div key={label} className="rounded-md border border-white/10 bg-white/[0.04] p-4">
                <div className="font-mono text-xl text-white">{value}</div>
                <div className="mt-1 text-xs text-white/44">{label}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="h-[68vh] min-h-[480px]">
          <DepthHologramStage />
        </div>
      </section>
      <Gallery specimens={specimens} />
    </main>
  );
}
