import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { LogOut, RotateCcw } from "lucide-react";
import { PatientSidebar } from "./PatientSidebar";
import { PatientMobileNav } from "./PatientMobileNav";
import { NotificationBell } from "./NotificationBell";
import { ChatWidget } from "@/components/chat/ChatWidget";
import { Avatar } from "@/components/ui/Avatar";
import { PracticeMark } from "@/components/Logo";
import { useCurrentPatient } from "@/store/useCurrentUser";
import { useAuthStore } from "@/store/useAuthStore";
import { useAppStore } from "@/store/useAppStore";
import { useToastStore } from "@/store/useToastStore";

export function PatientLayout() {
  const patient = useCurrentPatient();
  const logout = useAuthStore((s) => s.logout);
  const resetAllData = useAppStore((s) => s.resetAllData);
  const showToast = useToastStore((s) => s.show);
  const navigate = useNavigate();
  const location = useLocation();

  if (!patient) return null;

  return (
    <div className="flex min-h-screen bg-cream-50">
      <PatientSidebar />

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-ink-900/8 bg-cream-50/90 px-5 backdrop-blur lg:px-8">
          <div className="flex items-center gap-2 lg:hidden">
            <PracticeMark size={26} />
            <span className="font-display text-[14px] font-semibold text-ink-900">Simmons Medical</span>
          </div>
          <div className="hidden lg:block" />
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => {
                resetAllData();
                showToast({ variant: "info", title: "Demo data reset", description: "All records regenerated." });
              }}
              className="hidden h-10 items-center gap-1.5 rounded-xl px-3 text-[12.5px] font-medium text-ink-400 hover:bg-ink-900/5 hover:text-ink-600 sm:flex"
              title="Reset demo data"
            >
              <RotateCcw size={14} /> Reset demo
            </button>
            <NotificationBell />
            <div className="ml-1 flex items-center gap-2 lg:hidden">
              <Avatar name={`${patient.firstName} ${patient.lastName}`} color={patient.avatarColor} size={32} />
              <button onClick={() => { logout(); navigate("/"); }} className="flex h-9 w-9 items-center justify-center rounded-xl text-ink-400 hover:bg-ink-900/5">
                <LogOut size={16} />
              </button>
            </div>
          </div>
        </header>

        <main className="flex-1 pb-24 lg:pb-8">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="mx-auto w-full max-w-6xl px-5 py-6 lg:px-8 lg:py-8"
          >
            <Outlet />
          </motion.div>
        </main>
      </div>

      <PatientMobileNav />
      <ChatWidget />
    </div>
  );
}
