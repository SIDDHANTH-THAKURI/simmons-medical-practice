interface TooltipPayloadItem {
  name?: string;
  value?: number | string;
  color?: string;
  unit?: string;
}

export function ChartTooltip({
  active,
  payload,
  label,
  formatter,
}: {
  active?: boolean;
  payload?: TooltipPayloadItem[];
  label?: string;
  formatter?: (value: number | string, name?: string) => string;
}) {
  if (!active || !payload || payload.length === 0) return null;

  return (
    <div className="rounded-xl border border-ink-900/8 bg-white px-3.5 py-2.5 shadow-[var(--shadow-lifted)]">
      {label && <p className="mb-1 text-[11.5px] font-semibold text-ink-700">{label}</p>}
      <div className="space-y-1">
        {payload.map((p, i) => (
          <div key={i} className="flex items-center gap-2 text-[12px]">
            {p.color && <span className="h-2 w-2 rounded-full" style={{ backgroundColor: p.color }} />}
            {p.name && <span className="text-ink-500">{p.name}</span>}
            <span className="font-semibold text-ink-900 tabular-nums">
              {formatter && p.value !== undefined ? formatter(p.value, p.name) : p.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
