import { Gallery } from "@/components/gallery";
import { HologramStage } from "@/components/hologram-stage";
import { specimens } from "@/data/specimens";

export default function Home() {
  const featured = specimens[1];

  return (
    <main className="min-h-screen bg-[#050506] text-white">
      <section className="mx-auto grid min-h-[92vh] w-full max-w-7xl items-center gap-8 px-4 py-8 sm:px-6 lg:grid-cols-[0.88fr_1.12fr] lg:px-8">
        <div className="pt-16 lg:pt-0">
          <p className="font-mono text-xs uppercase tracking-[0.34em] text-cyan-200/70">IF HOLO / Digital relic chamber</p>
          <h1 className="mt-5 max-w-4xl text-5xl font-semibold leading-[0.98] text-white sm:text-7xl lg:text-8xl">
            数字全息收藏馆
          </h1>
          <p className="mt-6 max-w-xl text-base leading-8 text-white/62 sm:text-lg">
            把猫猫、偶像、动漫主角、游戏英雄和网文角色做成可点、可听、可旋转的全息藏品。当前原型先验证“好玩”和视觉记忆点，后面可以接入 2.5D 深度图浮雕或真实 3D 资产。
          </p>
          <div className="mt-8 grid max-w-lg grid-cols-3 gap-3">
            {[
              ["06", "藏品信号"],
              ["2.5D", "浮雕路线"],
              ["GLB", "模型路线"],
            ].map(([value, label]) => (
              <div key={label} className="rounded-md border border-white/10 bg-white/[0.04] p-4">
                <div className="font-mono text-xl text-white">{value}</div>
                <div className="mt-1 text-xs text-white/44">{label}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="h-[68vh] min-h-[480px]">
          <HologramStage specimen={featured} />
        </div>
      </section>
      <Gallery specimens={specimens} />
    </main>
  );
}
