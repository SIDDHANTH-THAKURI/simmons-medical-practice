import type { ReactNode } from "react";
import { Lock } from "lucide-react";
import { cn } from "@/lib/utils";

export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
}: {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col items-center justify-center rounded-2xl border border-dashed border-ink-300 bg-cream-25 px-6 py-14 text-center", className)}>
      {icon && <div className="mb-4 text-ink-300">{icon}</div>}
      <p className="text-[15px] font-semibold text-ink-800">{title}</p>
      {description && <p className="mt-1.5 max-w-sm text-sm text-ink-500">{description}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

export function AccessRestricted({ moduleName }: { moduleName: string }) {
  return (
    <EmptyState
      icon={<Lock size={32} strokeWidth={1.5} />}
      title={`${moduleName} is restricted`}
      description="Access is enforced by the data layer, not the screen — your signed-in role doesn't have visibility into this module. Ask a practice admin if you believe this is wrong."
      className="min-h-[50vh]"
    />
  );
}
