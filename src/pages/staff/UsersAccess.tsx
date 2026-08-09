import { useState } from "react";
import { Check, Lock, MinusCircle, RotateCcw, ShieldAlert } from "lucide-react";
import { useAppStore } from "@/store/useAppStore";
import { useModuleAccess } from "@/store/useCurrentUser";
import { useToastStore } from "@/store/useToastStore";
import { AccessRestricted } from "@/components/ui/EmptyState";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { staffDirectory } from "@/data/providers";
import { defaultPermissions, moduleLabels, permissionLabels, roleLabels } from "@/data/permissions";
import type { PermissionLevel, RolePermissions } from "@/types";
import { cn } from "@/lib/utils";

const CYCLE: PermissionLevel[] = ["full", "read", "own", "none"];

function LevelIcon({ level }: { level: PermissionLevel }) {
  if (level === "full") return <Check size={13} />;
  if (level === "none") return <MinusCircle size={13} />;
  return <Lock size={12} />;
}

const LEVEL_STYLE: Record<PermissionLevel, string> = {
  full: "bg-[#0ca30c]/10 text-[#006300]",
  read: "bg-[#fab219]/15 text-amber-700",
  own: "bg-chart-1/10 text-[#184f95]",
  none: "bg-ink-900/6 text-ink-400",
};

export default function UsersAccess() {
  const level = useModuleAccess("securityUsers");
  const permissionOverrides = useAppStore((s) => s.permissionOverrides);
  const setPermissionOverride = useAppStore((s) => s.setPermissionOverride);
  const resetPermissionOverrides = useAppStore((s) => s.resetPermissionOverrides);
  const getEffectivePermissions = useAppStore((s) => s.getEffectivePermissions);
  const showToast = useToastStore((s) => s.show);
  const [selected, setSelected] = useState(staffDirectory[0].id);

  if (level === "none") return <AccessRestricted moduleName="Users & Access" />;
  const canEdit = level === "full";

  const staff = staffDirectory.find((s) => s.id === selected)!;
  const effective = getEffectivePermissions(staff);
  const hasOverride = !!permissionOverrides[staff.id] && Object.keys(permissionOverrides[staff.id]).length > 0;

  function cycle(module: keyof RolePermissions) {
    if (!canEdit) return;
    const current = effective[module];
    const next = CYCLE[(CYCLE.indexOf(current) + 1) % CYCLE.length];
    setPermissionOverride(staff.id, { [module]: next });
    showToast({ variant: "info", title: `${staff.firstName}'s access updated`, description: `${moduleLabels[module]} → ${permissionLabels[next]}` });
  }

  return (
    <div>
      <h1 className="font-display text-3xl font-semibold text-ink-900">Users &amp; Access</h1>
      <p className="mt-1.5 text-[14px] text-ink-500">Roles and permissions administration — {canEdit ? "click any cell to change it" : "view only, your role can't edit access"}.</p>

      {!canEdit && (
        <div className="mt-4 flex items-center gap-2 rounded-xl border border-ink-200 bg-cream-100 px-4 py-2.5 text-[12.5px] text-ink-600">
          <ShieldAlert size={15} /> You have read-only access to this module.
        </div>
      )}

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[260px_1fr]">
        <div className="space-y-1 rounded-2xl border border-ink-900/8 bg-white p-2">
          {staffDirectory.map((s) => (
            <button
              key={s.id}
              onClick={() => setSelected(s.id)}
              className={cn(
                "flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-left transition-colors",
                selected === s.id ? "bg-teal-800 text-white" : "hover:bg-cream-50"
              )}
            >
              <Avatar name={`${s.firstName} ${s.lastName}`} color={s.avatarColor} size={32} />
              <span className="min-w-0 flex-1">
                <span className={cn("block truncate text-[13px] font-medium", selected === s.id ? "text-white" : "text-ink-800")}>{s.firstName} {s.lastName}</span>
                <span className={cn("block truncate text-[11px]", selected === s.id ? "text-teal-100" : "text-ink-400")}>{roleLabels[s.role]}</span>
              </span>
              {permissionOverrides[s.id] && Object.keys(permissionOverrides[s.id]).length > 0 && (
                <span className={cn("h-1.5 w-1.5 shrink-0 rounded-full", selected === s.id ? "bg-amber-300" : "bg-amber-500")} />
              )}
            </button>
          ))}
        </div>

        <div className="rounded-2xl border border-ink-900/8 bg-white p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <Avatar name={`${staff.firstName} ${staff.lastName}`} color={staff.avatarColor} size={44} />
              <div>
                <p className="text-[15px] font-semibold text-ink-900">{staff.firstName} {staff.lastName}</p>
                <p className="text-[12.5px] text-ink-500">{staff.title}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="brand">{roleLabels[staff.role]}</Badge>
              {hasOverride && <Badge variant="warning">Custom overrides</Badge>}
            </div>
          </div>

          {hasOverride && canEdit && (
            <button
              onClick={() => {
                resetPermissionOverrides(staff.id);
                showToast({ variant: "info", title: "Reset to role default" });
              }}
              className="mt-4 flex items-center gap-1.5 text-[12.5px] font-semibold text-teal-700 hover:text-teal-900"
            >
              <RotateCcw size={13} /> Reset to {roleLabels[staff.role]} default
            </button>
          )}

          <div className="mt-6 divide-y divide-ink-900/6 rounded-xl border border-ink-900/8 overflow-hidden">
            {(Object.keys(moduleLabels) as (keyof RolePermissions)[]).map((mod) => {
              const lvl = effective[mod];
              const isDefault = defaultPermissions[staff.role][mod] === lvl;
              return (
                <div key={mod} className="flex items-center justify-between bg-cream-25 px-5 py-3.5">
                  <div>
                    <p className="text-[13.5px] font-medium text-ink-800">{moduleLabels[mod]}</p>
                    {!isDefault && <p className="text-[11px] text-amber-600">Default for {roleLabels[staff.role]}: {permissionLabels[defaultPermissions[staff.role][mod]]}</p>}
                  </div>
                  <button
                    onClick={() => cycle(mod)}
                    disabled={!canEdit}
                    className={cn(
                      "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[12px] font-semibold transition-transform",
                      LEVEL_STYLE[lvl],
                      canEdit && "hover:scale-105 active:scale-95 cursor-pointer",
                      !canEdit && "cursor-not-allowed opacity-80"
                    )}
                  >
                    <LevelIcon level={lvl} /> {permissionLabels[lvl]}
                  </button>
                </div>
              );
            })}
          </div>
          <p className="mt-4 text-[11.5px] text-ink-400">
            Access is enforced by the data layer, not the screen — this matrix is the actual source of truth the rest of the portal reads from. Try switching to {staff.firstName} via the demo role switcher to see it applied.
          </p>
        </div>
      </div>
    </div>
  );
}
