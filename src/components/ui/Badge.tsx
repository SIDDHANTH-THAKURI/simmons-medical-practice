import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type Variant = "good" | "warning" | "critical" | "info" | "neutral" | "brand";

const variants: Record<Variant, string> = {
  good: "bg-[#0ca30c]/10 text-[#006300]",
  warning: "bg-[#fab219]/15 text-amber-600",
  critical: "bg-[#d03b3b]/10 text-terracotta-800",
  info: "bg-[#2a78d6]/10 text-[#184f95]",
  neutral: "bg-ink-900/6 text-ink-600",
  brand: "bg-teal-800/10 text-teal-800",
};

const dotColor: Record<Variant, string> = {
  good: "bg-[#0ca30c]",
  warning: "bg-[#fab219]",
  critical: "bg-[#d03b3b]",
  info: "bg-[#2a78d6]",
  neutral: "bg-ink-400",
  brand: "bg-teal-700",
};

export function Badge({
  children,
  variant = "neutral",
  dot = false,
  className,
}: {
  children: ReactNode;
  variant?: Variant;
  dot?: boolean;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold tracking-wide",
        variants[variant],
        className
      )}
    >
      {dot && <span className={cn("h-1.5 w-1.5 rounded-full", dotColor[variant])} />}
      {children}
    </span>
  );
}
