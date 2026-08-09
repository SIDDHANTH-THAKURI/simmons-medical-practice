import type { ReactNode } from "react";
import { ArrowDown, ArrowUp } from "lucide-react";
import { cn } from "@/lib/utils";

function Sparkline({ points, accent }: { points: number[]; accent: string }) {
  if (points.length < 2) return null;
  const w = 100;
  const h = 28;
  const min = Math.min(...points);
  const max = Math.max(...points);
  const range = max - min || 1;
  const coords = points.map((p, i) => {
    const x = (i / (points.length - 1)) * w;
    const y = h - ((p - min) / range) * h;
    return [x, y] as const;
  });
  const path = coords.map(([x, y], i) => `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`).join(" ");
  const last = coords[coords.length - 1];

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="h-7 w-20" preserveAspectRatio="none">
      <path d={path} fill="none" stroke="var(--color-ink-200)" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
      <circle cx={last[0]} cy={last[1]} r={2.75} fill={accent} />
    </svg>
  );
}

export function StatTile({
  label,
  value,
  delta,
  trend,
  icon,
  accent = "var(--color-teal-600)",
  className,
}: {
  label: string;
  value: string;
  delta?: { text: string; direction: "up" | "down"; goodDirection: "up" | "down" };
  trend?: number[];
  icon?: ReactNode;
  accent?: string;
  className?: string;
}) {
  const isGood = delta ? delta.direction === delta.goodDirection : true;
  return (
    <div className={cn("rounded-2xl border border-ink-900/8 bg-white/80 p-5 shadow-[var(--shadow-card)]", className)}>
      <div className="flex items-start justify-between">
        <p className="text-[13px] font-medium text-ink-500">{label}</p>
        {icon && (
          <div className="rounded-lg p-1.5" style={{ backgroundColor: `color-mix(in srgb, ${accent} 14%, transparent)`, color: accent }}>
            {icon}
          </div>
        )}
      </div>
      <div className="mt-2 flex items-end justify-between gap-3">
        <p className="text-[28px] font-semibold leading-none text-ink-900">{value}</p>
        {trend && <Sparkline points={trend} accent={accent} />}
      </div>
      {delta && (
        <div className="mt-3 flex items-center gap-1 text-[13px] font-medium">
          <span
            className={cn(
              "inline-flex items-center gap-0.5 rounded-md px-1.5 py-0.5",
              isGood ? "bg-[#0ca30c]/10 text-[#006300]" : "bg-[#d03b3b]/10 text-terracotta-800"
            )}
          >
            {delta.direction === "up" ? <ArrowUp size={12} /> : <ArrowDown size={12} />}
            {delta.text}
          </span>
        </div>
      )}
    </div>
  );
}
