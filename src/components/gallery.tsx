"use client";

import { Chip, ProgressBar } from "@heroui/react";
import { Howler } from "howler";
import { ArrowUpRight, BadgeCheck, Boxes, Radio, Sparkles } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import type { Specimen } from "@/data/specimens";
import { SpecimenIcon } from "@/components/specimen-icon";

function playPing(colorIndex: number) {
  const context = Howler.ctx;
  if (!context) return;

  void context.resume();
  const oscillator = context.createOscillator();
  const gain = context.createGain();
  oscillator.type = colorIndex % 2 ? "triangle" : "sine";
  oscillator.frequency.value = 360 + colorIndex * 74;
  gain.gain.setValueAtTime(0.0001, context.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.08, context.currentTime + 0.015);
  gain.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + 0.22);
  oscillator.connect(gain);
  gain.connect(context.destination);
  oscillator.start();
  oscillator.stop(context.currentTime + 0.24);
}

export function Gallery({ specimens }: { specimens: Specimen[] }) {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!rootRef.current) return;
    const cards = gsap.utils.toArray<HTMLElement>("[data-holo-card]", rootRef.current);
    gsap.fromTo(
      cards,
      { opacity: 0, y: 36, rotateX: -8, filter: "blur(10px)" },
      { opacity: 1, y: 0, rotateX: 0, filter: "blur(0px)", duration: 0.85, ease: "power3.out", stagger: 0.075 },
    );
  }, []);

  return (
    <section ref={rootRef} className="mx-auto w-full max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-white/42">Live collection feed</p>
          <h2 className="mt-2 text-2xl font-semibold text-white sm:text-3xl">全息藏品流</h2>
        </div>
        <div className="flex gap-2">
          <Chip className="border-white/12 bg-white/8 text-white" variant="soft">
            <span className="inline-flex items-center gap-1.5"><Radio className="h-3.5 w-3.5" /> 6 signals</span>
          </Chip>
          <Chip className="border-white/12 bg-white/8 text-white" variant="soft">
            <span className="inline-flex items-center gap-1.5"><Boxes className="h-3.5 w-3.5" /> 2.5D / 3D</span>
          </Chip>
        </div>
      </div>

      <div className="columns-1 gap-4 sm:columns-2 lg:columns-3 xl:columns-4">
        {specimens.map((specimen, index) => {
          return (
            <Link
              data-holo-card
              key={specimen.id}
              aria-label={`进入${specimen.title}全息舱`}
              className={`group relative mb-4 block break-inside-avoid overflow-hidden rounded-md border border-white/10 bg-white/[0.045] p-3 text-current no-underline shadow-2xl shadow-black/40 backdrop-blur ${specimen.height}`}
              href={`/holo/${specimen.id}`}
              onPointerDown={() => playPing(index + 3)}
              onPointerEnter={() => playPing(index)}
              style={{
                background: `linear-gradient(155deg, ${specimen.palette[0]}1f, rgba(255,255,255,0.045) 32%, ${specimen.palette[1]}18), #08090b`,
              }}
            >
              <div className="absolute inset-0 opacity-0 transition duration-300 group-hover:opacity-100" style={{ boxShadow: `inset 0 0 70px ${specimen.palette[0]}42` }} />
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/70 to-transparent" />
              <div className="relative flex h-full flex-col">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-md border border-white/10 bg-black/35" style={{ color: specimen.palette[2] }}>
                    <SpecimenIcon className="h-5 w-5" name={specimen.iconName} />
                  </div>
                  <Chip size="sm" className="bg-black/35 font-mono text-white" variant="soft">
                    {specimen.rarity}
                  </Chip>
                </div>

                <div className="mt-5 flex-1 rounded-md border border-white/10 bg-black/30 p-4">
                  <div className="relative h-full min-h-[150px] overflow-hidden rounded">
                    <div className="absolute inset-0" style={{ background: `radial-gradient(circle at 48% 42%, ${specimen.palette[0]}88, transparent 26%), radial-gradient(circle at 54% 58%, ${specimen.palette[1]}7a, transparent 34%), radial-gradient(circle at 42% 78%, ${specimen.palette[2]}66, transparent 26%)` }} />
                    <div className="absolute left-1/2 top-1/2 h-28 w-20 -translate-x-1/2 -translate-y-1/2 rounded-[45%] border border-white/25 bg-white/10 shadow-[0_0_42px_rgba(255,255,255,0.18)]" />
                    <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.08)_1px,transparent_1px)] bg-[length:100%_7px]" />
                  </div>
                </div>

                <div className="mt-4 space-y-3">
                  <div>
                    <p className="text-xs text-white/48">{specimen.tag}</p>
                    <h3 className="mt-1 text-xl font-semibold text-white">{specimen.title}</h3>
                    <p className="mt-1 text-sm text-white/58">{specimen.mood}</p>
                  </div>
                  <ProgressBar
                    aria-label={`${specimen.title} signal`}
                    className="[&_[data-slot=track]]:bg-white/10 [&_[data-slot=fill]]:bg-white"
                    size="sm"
                    value={specimen.signal}
                  />
                  <div
                    className="flex h-10 w-full items-center justify-between rounded-md bg-white px-4 text-sm font-medium text-black transition hover:bg-white/85"
                  >
                    <span>进入全息舱</span>
                    <ArrowUpRight className="h-4 w-4" />
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      <div className="mt-10 grid gap-3 border-y border-white/10 py-5 text-sm text-white/54 md:grid-cols-3">
        <div className="flex items-center gap-2"><BadgeCheck className="h-4 w-4 text-emerald-300" /> 当前原型支持程序化全息资产</div>
        <div className="flex items-center gap-2"><Sparkles className="h-4 w-4 text-fuchsia-300" /> 后续可接原图 + 深度图浮雕</div>
        <div className="flex items-center gap-2"><Boxes className="h-4 w-4 text-cyan-300" /> 也可替换为 GLB/VRM 真实模型</div>
      </div>
    </section>
  );
}
