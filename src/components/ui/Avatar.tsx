import { initials, cn } from "@/lib/utils";

export function Avatar({
  name,
  color = "var(--color-teal-600)",
  size = 40,
  className,
  ring = false,
}: {
  name: string;
  color?: string;
  size?: number;
  className?: string;
  ring?: boolean;
}) {
  return (
    <div
      className={cn("inline-flex shrink-0 items-center justify-center rounded-full font-semibold text-white select-none", ring && "ring-2 ring-white", className)}
      style={{
        width: size,
        height: size,
        backgroundColor: color,
        fontSize: Math.max(11, size * 0.36),
      }}
    >
      {initials(name)}
    </div>
  );
}
