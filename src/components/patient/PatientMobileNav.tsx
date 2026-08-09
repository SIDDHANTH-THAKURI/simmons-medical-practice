import { NavLink } from "react-router-dom";
import { Bot, CalendarPlus, Home, ListChecks, UserRound } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV = [
  { to: "/patient/app", end: true, label: "Home", icon: Home },
  { to: "/patient/app/appointments", label: "Visits", icon: ListChecks },
  { to: "/patient/app/book", label: "Book", icon: CalendarPlus },
  { to: "/patient/app/assistant", label: "Assistant", icon: Bot },
  { to: "/patient/app/profile", label: "Profile", icon: UserRound },
];

export function PatientMobileNav() {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-30 flex border-t border-ink-900/8 bg-white/95 backdrop-blur pb-[env(safe-area-inset-bottom)] lg:hidden">
      {NAV.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.end}
          className={({ isActive }) =>
            cn(
              "flex flex-1 flex-col items-center gap-1 py-2.5 text-[10.5px] font-medium",
              isActive ? "text-teal-800" : "text-ink-400"
            )
          }
        >
          {({ isActive }) => (
            <>
              <span className={cn("flex h-8 w-8 items-center justify-center rounded-full", isActive && "bg-teal-100")}>
                <item.icon size={18} strokeWidth={2} />
              </span>
              {item.label}
            </>
          )}
        </NavLink>
      ))}
    </nav>
  );
}
