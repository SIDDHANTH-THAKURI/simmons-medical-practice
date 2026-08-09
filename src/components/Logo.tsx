import { cn } from "@/lib/utils";

export function PracticeMark({ size = 36 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 36 36" fill="none" className="shrink-0">
      <rect width="36" height="36" rx="10" fill="var(--color-teal-800)" />
      <path d="M18 10v16M10 18h16" stroke="var(--color-terracotta-400)" strokeWidth="4.5" strokeLinecap="round" />
    </svg>
  );
}

export function PracticeLogo({ size = 36, className, subtitle }: { size?: number; className?: string; subtitle?: string }) {
  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      <PracticeMark size={size} />
      <div className="leading-tight">
        <p className="font-display font-semibold text-ink-900" style={{ fontSize: size * 0.42 }}>
          Simmons Medical Practice
        </p>
        {subtitle && <p className="text-[11px] font-medium uppercase tracking-wider text-ink-500">{subtitle}</p>}
      </div>
    </div>
  );
}

export function AbcMark({ size = 34 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 34 34" fill="none" className="shrink-0">
      <rect width="34" height="34" rx="9" fill="var(--color-ink-900)" />
      <circle cx="11" cy="17" r="4.5" fill="var(--color-teal-400)" />
      <circle cx="20" cy="10.5" r="4.5" fill="var(--color-terracotta-400)" />
      <circle cx="20" cy="23.5" r="4.5" fill="var(--color-amber-300)" />
    </svg>
  );
}

export function AbcLogo({ size = 34, className, dark = false }: { size?: number; className?: string; dark?: boolean }) {
  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      <AbcMark size={size} />
      <div className="leading-tight">
        <p className={cn("font-semibold tracking-tight", dark ? "text-white" : "text-ink-900")} style={{ fontSize: size * 0.44 }}>
          ABC Partners
        </p>
        <p className={cn("text-[10px] font-medium uppercase tracking-wider", dark ? "text-white/60" : "text-ink-500")}>
          IT &amp; Financial Partnership
        </p>
      </div>
    </div>
  );
}
