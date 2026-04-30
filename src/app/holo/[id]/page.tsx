import { Chip } from "@heroui/react";
import { ArrowLeft, Boxes, ExternalLink, Layers3, Radio, Sparkles } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { HologramStage } from "@/components/hologram-stage";
import { SpecimenIcon } from "@/components/specimen-icon";
import { getSpecimen, specimens } from "@/data/specimens";

export function generateStaticParams() {
  return specimens.map((specimen) => ({ id: specimen.id }));
}

export default async function HoloDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const specimen = getSpecimen(id);

  if (!specimen) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-[#040405] text-white">
      <section className="mx-auto grid min-h-screen w-full max-w-7xl gap-6 px-4 py-5 sm:px-6 lg:grid-cols-[1fr_380px] lg:px-8">
        <div className="min-h-[560px] lg:min-h-[calc(100vh-40px)]">
          <HologramStage specimen={specimen} />
        </div>

        <aside className="flex flex-col justify-between gap-5 border-t border-white/10 py-5 lg:border-l lg:border-t-0 lg:pl-6">
          <div>
            <Link
              className="mb-8 inline-flex h-10 items-center gap-2 rounded-md border border-white/12 bg-white/5 px-4 text-sm text-white transition hover:bg-white/10"
              href="/"
            >
              <ArrowLeft className="h-4 w-4" />
              返回收藏馆
            </Link>

            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-md border border-white/10 bg-white/5" style={{ color: specimen.palette[2] }}>
                <SpecimenIcon className="h-6 w-6" name={specimen.iconName} />
              </div>
              <div>
                <p className="font-mono text-xs uppercase tracking-[0.24em] text-white/42">{specimen.archetype}</p>
                <h1 className="text-3xl font-semibold">{specimen.title}</h1>
              </div>
            </div>

            <div className="mt-5 flex flex-wrap gap-2">
              <Chip className="bg-white text-black">
                <span className="inline-flex items-center gap-1.5"><Sparkles className="h-3.5 w-3.5" /> {specimen.rarity}</span>
              </Chip>
              <Chip className="border-white/12 bg-white/5 text-white" variant="soft">{specimen.tag}</Chip>
              <Chip className="border-white/12 bg-white/5 text-white" variant="soft">
                <span className="inline-flex items-center gap-1.5"><Radio className="h-3.5 w-3.5" /> {specimen.signal}% signal</span>
              </Chip>
            </div>

            <p className="mt-8 text-lg leading-8 text-white/68">{specimen.lore}</p>
            <p className="mt-4 text-sm leading-7 text-white/48">状态：{specimen.mood}</p>
            {specimen.credit ? (
              <a
                className="mt-5 inline-flex items-center gap-2 text-sm text-white/58 transition hover:text-white"
                href={specimen.credit.url}
                rel="noreferrer"
                target="_blank"
              >
                <ExternalLink className="h-4 w-4" />
                {specimen.credit.source} / {specimen.credit.license}
              </a>
            ) : null}
          </div>

          <div className="grid gap-3">
            <div className="rounded-md border border-white/10 bg-white/[0.045] p-4">
              <div className="flex items-center gap-2 text-sm font-medium">
                <Layers3 className="h-4 w-4 text-cyan-200" />
                当前渲染路线
              </div>
              <p className="mt-2 text-sm leading-6 text-white/52">
                当前展品通过 GLB 文件直接加载真实 3D 模型、材质和空间结构，再叠加全息扫描、辉光和粒子效果。
              </p>
            </div>
            <div className="rounded-md border border-white/10 bg-white/[0.045] p-4">
              <div className="flex items-center gap-2 text-sm font-medium">
                <Boxes className="h-4 w-4 text-fuchsia-200" />
                下一步玩法
              </div>
              <p className="mt-2 text-sm leading-6 text-white/52">
                可加入稀有度抽卡、展品音色、手势旋转、AR 预览、角色碎片收集和用户自定义上传。
              </p>
            </div>
          </div>
        </aside>
      </section>
    </main>
  );
}
