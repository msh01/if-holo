import { Gallery } from "@/components/gallery";
import { specimens } from "@/data/specimens";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#050506] text-white">
      <section className="mx-auto w-full max-w-7xl px-4 pb-8 pt-20 sm:px-6 lg:px-8">
        <div className="border-b border-white/10 pb-8">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-cyan-200/70">
              IF HOLO / GLB model chamber
            </p>
            <h1 className="mt-4 max-w-3xl text-3xl font-semibold leading-tight text-white sm:text-4xl lg:text-5xl">
              GLB 模型驱动的 3D 全息展柜
            </h1>
          </div>
        </div>
      </section>
      <Gallery specimens={specimens} />
    </main>
  );
}
