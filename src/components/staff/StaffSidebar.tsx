import { NavLink, useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";
import { PracticeLogo } from "@/components/Logo";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { STAFF_NAV } from "@/data/staffNav";
import { roleLabels } from "@/data/permissions";
import { useAuthStore } from "@/store/useAuthStore";
import { useCurrentStaff, useMyPermissions } from "@/store/useCurrentUser";
import { canAccess, permissionLabels } from "@/data/permissions";
import { cn } from "@/lib/utils";

export function StaffSidebar() {
  const staff = useCurrentStaff();
  const perms = useMyPermissions();
  const logout = useAuthStore((s) => s.logout);
  const navigate = useNavigate();

  if (!staff || !perms) return null;

  return (
    <aside className="hidden w-64 shrink-0 flex-col border-r border-ink-900/8 bg-white/70 lg:flex">
      <div className="p-6">
        <PracticeLogo size={30} subtitle="Staff Portal" />
      </div>

      <nav className="flex-1 space-y-1 px-3">
        {STAFF_NAV.map((item) => {
          const level = item.module ? perms[item.module] : "full";
          const locked = !canAccess(level);
          return (
            <NavLink
              key={item.to}
              to={locked ? "#" : item.to}
              end={item.end}
              onClick={(e) => locked && e.preventDefault()}
              className={({ isActive }) =>
                cn(
                  "flex items-center justify-between gap-2 rounded-xl px-3.5 py-2.5 text-[13.5px] font-medium transition-colors",
                  locked ? "cursor-not-allowed text-ink-300" : isActive ? "bg-teal-800 text-white" : "text-ink-600 hover:bg-ink-900/5"
                )
              }
              title={locked ? `Restricted — ${permissionLabels[level]}` : undefined}
            >
              <span className="flex items-center gap-3">
                <item.icon size={17} strokeWidth={1.9} />
                {item.label}
              </span>
              {level === "read" && !locked && <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />}
              {level === "own" && !locked && <span className="h-1.5 w-1.5 rounded-full bg-chart-1" />}
            </NavLink>
          );
        })}
      </nav>

      <div className="border-t border-ink-900/8 p-4">
        <div className="flex items-center gap-2.5 rounded-xl p-2">
          <Avatar name={`${staff.firstName} ${staff.lastName}`} color={staff.avatarColor} size={36} />
          <div className="min-w-0 flex-1">
            <p className="truncate text-[13px] font-semibold text-ink-900">{staff.firstName} {staff.lastName}</p>
            <Badge variant="brand" className="mt-0.5">{roleLabels[staff.role]}</Badge>
          </div>
        </div>
        <button
          onClick={() => {
            logout();
            navigate("/");
          }}
          className="mt-2 flex w-full items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-[13px] font-medium text-ink-500 hover:bg-ink-900/5 hover:text-terracotta-700"
        >
          <LogOut size={16} /> Log out
        </button>
      </div>
    </aside>
  );
}
