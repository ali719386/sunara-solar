import {
  BadgeCheck,
  Eye,
  HardHat,
  Headset,
  PencilRuler,
  ShieldCheck,
  Sparkles,
  Users,
  Wrench,
  type LucideIcon,
} from "lucide-react";

const map: Record<string, LucideIcon> = {
  install: HardHat,
  clean: Sparkles,
  repair: Wrench,
  team: Users,
  safety: ShieldCheck,
  support: Headset,
  quality: BadgeCheck,
  clear: Eye,
  design: PencilRuler,
};

/** Maps an icon key from lib/content.ts to a Lucide icon. */
export function FeatureIcon({ name, size = 20 }: { name: string; size?: number }) {
  const Icon = map[name] ?? BadgeCheck;
  return <Icon size={size} aria-hidden="true" />;
}
