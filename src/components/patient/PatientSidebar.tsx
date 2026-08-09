import { NavLink, useNavigate } from "react-router-dom";
import { Bot, CalendarPlus, CreditCard, Home, LogOut, ListChecks, UserRound } from "lucide-react";
import { PracticeLogo } from "@/components/Logo";
import { Avatar } from "@/components/ui/Avatar";
import { useAuthStore } from "@/store/useAuthStore";
import { useCurrentPatient } from "@/store/useCurrentUser";
import { cn } from "@/lib/utils";

const NAV = [
  { to: "/patient/app", end: true, label: "Home", icon: Home },
  { to: "/patient/app/appointments", label: "Appointments", icon: ListChecks },
  { to: "/patient/app/book", label: "Book Appointment", icon: CalendarPlus },
  { to: "/patient/app/billing", label: "Billing & Medicare", icon: CreditCard },
  { to: "/patient/app/assistant", label: "Assistant", icon: Bot },
  { to: "/patient/app/profile", label: "Profile", icon: UserRound },
];

export function PatientSidebar() {
  const patient = useCurrentPatient();
  const logout = useAuthStore((s) => s.logout);
  const navigate = useNavigate();

  return (
    <aside className="hidden w-64 shrink-0 flex-col border-r border-ink-900/8 bg-white/70 lg:flex">
      <div className="p-6">
        <PracticeLogo size={30} />
      </div>

      <nav className="flex-1 space-y-1 px-3">
        {NAV.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-[13.5px] font-medium transition-colors",
                isActive ? "bg-teal-800 text-white" : "text-ink-600 hover:bg-ink-900/5"
              )
            }
          >
            <item.icon size={17} strokeWidth={1.9} />
            {item.label}
          </NavLink>
        ))}
      </nav>

      {patient && (
        <div className="border-t border-ink-900/8 p-4">
          <div className="flex items-center gap-2.5 rounded-xl p-2">
            <Avatar name={`${patient.firstName} ${patient.lastName}`} color={patient.avatarColor} size={36} />
            <div className="min-w-0 flex-1">
              <p className="truncate text-[13px] font-semibold text-ink-900">{patient.firstName} {patient.lastName}</p>
              <p className="truncate text-[11px] text-ink-400">{patient.email}</p>
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
      )}
    </aside>
  );
}
