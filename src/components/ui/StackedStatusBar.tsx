import { motion } from "framer-motion";
import { formatNumber } from "@/lib/utils";

export interface StatusSegment {
  label: string;
  value: number;
  color: string;
}

export function StackedStatusBar({ segments }: { segments: StatusSegment[] }) {
  const total = segments.reduce((s, seg) => s + seg.value, 0) || 1;

  return (
    <div>
      <div className="flex h-8 w-full overflow-hidden rounded-lg bg-cream-100">
        {segments.map((seg, i) => {
          const pct = (seg.value / total) * 100;
          return (
            <motion.div
              key={seg.label}
              initial={{ width: 0 }}
              animate={{ width: `${pct}%` }}
              transition={{ duration: 0.7, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
              className="h-full first:rounded-l-lg last:rounded-r-lg"
              style={{
                backgroundColor: seg.color,
                marginRight: i < segments.length - 1 ? 2 : 0,
              }}
              title={`${seg.label}: ${formatNumber(seg.value)}`}
            />
          );
        })}
      </div>
      <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2">
        {segments.map((seg) => (
          <div key={seg.label} className="flex items-center gap-1.5 text-[12.5px]">
            <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: seg.color }} />
            <span className="text-ink-500">{seg.label}</span>
            <span className="font-semibold text-ink-900 tabular-nums">{formatNumber(seg.value)}</span>
            <span className="text-ink-400">({((seg.value / total) * 100).toFixed(1)}%)</span>
          </div>
        ))}
      </div>
    </div>
  );
}
