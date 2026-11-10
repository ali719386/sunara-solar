import { StatCounter } from "./StatCounter";

type Stat = { value: number; suffix: string; label: string; decimals?: number };

/** Row of count-up figures, shared by the home "Who we are" teaser and the About page. */
export function StatsStrip({ items, className = "" }: { items: readonly Stat[]; className?: string }) {
  return (
    <div className={`stats ${className}`} data-reveal>
      {items.map((s) => (
        <StatCounter key={s.label} {...s} />
      ))}
    </div>
  );
}
