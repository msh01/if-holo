import { Cat, Crown, Flame, Gamepad2, MoonStar, Sparkles } from "lucide-react";
import type { SpecimenIconName } from "@/data/specimens";

const icons = {
  cat: Cat,
  sparkles: Sparkles,
  crown: Crown,
  gamepad: Gamepad2,
  moon: MoonStar,
  flame: Flame,
} satisfies Record<SpecimenIconName, typeof Cat>;

export function getSpecimenIcon(iconName: SpecimenIconName) {
  return icons[iconName];
}

export function SpecimenIcon({ className, name }: { className?: string; name: SpecimenIconName }) {
  const Icon = icons[name];
  return <Icon className={className} />;
}
