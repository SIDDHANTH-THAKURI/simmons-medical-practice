import { motion } from "framer-motion";
import { clamp, cn } from "@/lib/utils";

export function Meter({
  value,
  max = 100,
  label,
  valueLabel,
  color = "var(--color-teal-600)",
  trackColor = "var(--color-teal-100)",
  className,
}: {
  value: number;
  max?: number;
  label?: string;
  valueLabel?: string;
  color?: string;
  trackColor?: string;
  className?: string;
}) {
  const pct = clamp((value / max) * 100, 0, 100);
  return (
    <div className={cn("w-full", className)}>
      {(label || valueLabel) && (
        <div className="mb-1.5 flex items-center justify-between text-[13px]">
          {label && <span className="text-ink-500">{label}</span>}
          {valueLabel && <span className="font-semibold text-ink-900 tabular-nums">{valueLabel}</span>}
        </div>
      )}
      <div className="h-2.5 w-full overflow-hidden rounded-full" style={{ backgroundColor: trackColor }}>
        <motion.div
          className="h-full rounded-full"
          style={{ backgroundColor: color }}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        />
      </div>
    </div>
  );
}
