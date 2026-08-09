import type { LucideIcon } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

// Shared coordinate space for every hand-built architecture diagram:
// a 200 x 100 unit canvas (2:1 aspect), so SVG edges and HTML nodes agree on
// the same x/y numbers and circles never get squashed by non-uniform scaling.
export const VB_W = 200;
export const VB_H = 100;

export function pctX(x: number) {
  return `${(x / VB_W) * 100}%`;
}
export function pctY(y: number) {
  return `${(y / VB_H) * 100}%`;
}

export function DiagramCanvas({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("relative w-full aspect-[2/1] min-w-[720px]", className)}>
      {children}
    </div>
  );
}

export function EdgeLayer({ children }: { children: React.ReactNode }) {
  return (
    <svg viewBox={`0 0 ${VB_W} ${VB_H}`} preserveAspectRatio="none" className="absolute inset-0 h-full w-full" style={{ overflow: "visible" }}>
      {children}
    </svg>
  );
}

export function straightPath(x1: number, y1: number, x2: number, y2: number) {
  return `M ${x1} ${y1} L ${x2} ${y2}`;
}

export function elbowPath(x1: number, y1: number, x2: number, y2: number) {
  const midX = (x1 + x2) / 2;
  return `M ${x1} ${y1} C ${midX} ${y1}, ${midX} ${y2}, ${x2} ${y2}`;
}

export function DiagramEdge({
  id,
  d,
  color = "var(--color-ink-300)",
  width = 0.7,
  animated = true,
  dashed = false,
  dotDuration = 2.6,
  dotDelay = 0,
}: {
  id: string;
  d: string;
  color?: string;
  width?: number;
  animated?: boolean;
  dashed?: boolean;
  dotDuration?: number;
  dotDelay?: number;
}) {
  return (
    <g>
      <path id={id} d={d} fill="none" stroke={color} strokeWidth={width} strokeDasharray={dashed ? "2 2" : undefined} strokeLinecap="round" />
      {animated && (
        <circle r={1.4} fill={color}>
          <animateMotion dur={`${dotDuration}s`} begin={`${dotDelay}s`} repeatCount="indefinite">
            <mpath href={`#${id}`} />
          </animateMotion>
        </circle>
      )}
    </g>
  );
}

export function DiagramNode({
  x,
  y,
  w = 34,
  icon: Icon,
  label,
  sublabel,
  color = "var(--color-teal-700)",
  dimmed = false,
  delay = 0,
  onClick,
}: {
  x: number;
  y: number;
  w?: number;
  icon?: LucideIcon;
  label: string;
  sublabel?: string;
  color?: string;
  dimmed?: boolean;
  delay?: number;
  onClick?: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: dimmed ? 0.35 : 1, scale: 1 }}
      transition={{ duration: 0.4, delay }}
      onClick={onClick}
      className={cn(
        "absolute flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-1 rounded-xl border bg-white px-2.5 py-2 text-center shadow-[var(--shadow-card)]",
        onClick && "cursor-pointer hover:shadow-[var(--shadow-lifted)] transition-shadow"
      )}
      style={{ left: pctX(x), top: pctY(y), width: `${(w / VB_W) * 100}%`, borderColor: `color-mix(in srgb, ${color} 35%, transparent)` }}
    >
      {Icon && (
        <span className="flex h-6 w-6 items-center justify-center rounded-lg" style={{ backgroundColor: `color-mix(in srgb, ${color} 15%, transparent)`, color }}>
          <Icon size={13} strokeWidth={2} />
        </span>
      )}
      <span className="text-[10.5px] font-semibold leading-tight text-ink-900">{label}</span>
      {sublabel && <span className="text-[9px] leading-tight text-ink-400">{sublabel}</span>}
    </motion.div>
  );
}

export function EdgeLabel({ x, y, text }: { x: number; y: number; text: string }) {
  return (
    <div
      className="absolute -translate-x-1/2 -translate-y-1/2 whitespace-nowrap rounded-md bg-cream-50 px-1.5 py-0.5 text-[9px] font-medium text-ink-400"
      style={{ left: pctX(x), top: pctY(y) }}
    >
      {text}
    </div>
  );
}
