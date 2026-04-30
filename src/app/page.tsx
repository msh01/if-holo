import { Gallery } from "@/components/gallery";
import { specimens } from "@/data/specimens";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#050506] text-white">
      <section className="mx-auto w-full max-w-7xl px-4 pb-8 pt-20 sm:px-6 lg:px-8">
        <div className="grid gap-5 border-b border-white/10 pb-8 lg:grid-cols-[minmax(0,0.95fr)_minmax(360px,0.55fr)] lg:items-end">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-cyan-200/70">
              IF HOLO / GLB model chamber
            </p>
            <h1 className="mt-4 max-w-4xl text-4xl font-semibold leading-none text-white sm:text-5xl lg:text-6xl">
              GLB 模型驱动的 3D 全息展柜
            </h1>
          </div>
          <p className="max-w-xl text-sm leading-7 text-white/58 lg:justify-self-end">
            后续渲染统一采用真实 3D 资产：上传或配置 GLB 文件，由 Three.js 直接加载模型、材质和空间结构，再叠加全息扫描、辉光和粒子氛围。
          </p>
        </div>
      </section>
      <Gallery specimens={specimens} />
    </main>
  );
}
