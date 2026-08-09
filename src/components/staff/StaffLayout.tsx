import { useEffect, useRef, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { NavLink } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { LogOut, Menu, RotateCcw, X } from "lucide-react";
import { StaffSidebar } from "./StaffSidebar";
import { RoleSwitcher } from "./RoleSwitcher";
import { PracticeMark } from "@/components/Logo";
import { STAFF_NAV } from "@/data/staffNav";
import { canAccess } from "@/data/permissions";
import { useAuthStore } from "@/store/useAuthStore";
import { useAppStore } from "@/store/useAppStore";
import { useCurrentStaff, useMyPermissions } from "@/store/useCurrentUser";
import { useToastStore } from "@/store/useToastStore";
import { cn } from "@/lib/utils";

export function StaffLayout() {
  const staff = useCurrentStaff();
  const perms = useMyPermissions();
  const logout = useAuthStore((s) => s.logout);
  const resetAllData = useAppStore((s) => s.resetAllData);
  const logAudit = useAppStore((s) => s.logAudit);
  const showToast = useToastStore((s) => s.show);
  const navigate = useNavigate();
  const location = useLocation();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const lastLogged = useRef<string | null>(null);

  useEffect(() => {
    if (!staff || lastLogged.current === location.pathname) return;
    lastLogged.current = location.pathname;
    const item = STAFF_NAV.find((n) => (n.end ? location.pathname === n.to : location.pathname.startsWith(n.to)));
    logAudit({
      actorName: `${staff.firstName} ${staff.lastName}`,
      actorRole: staff.role,
      action: "opened module",
      target: item?.label ?? "Dashboard",
      module: item?.to.split("/").pop() ?? "dashboard",
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname, staff]);

  if (!staff || !perms) return null;

  return (
    <div className="flex min-h-screen bg-cream-50">
      <StaffSidebar />

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-ink-900/8 bg-cream-50/90 px-5 backdrop-blur lg:px-8">
          <div className="flex items-center gap-2">
            <button onClick={() => setDrawerOpen(true)} className="text-ink-700 lg:hidden">
              <Menu size={22} />
            </button>
            <div className="flex items-center gap-2 lg:hidden">
              <PracticeMark size={26} />
              <span className="font-display text-[14px] font-semibold text-ink-900">Staff Portal</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                resetAllData();
                showToast({ variant: "info", title: "Demo data reset", description: "All records regenerated." });
              }}
              className="hidden h-9 items-center gap-1.5 rounded-xl px-3 text-[12.5px] font-medium text-ink-400 hover:bg-ink-900/5 hover:text-ink-600 sm:flex"
            >
              <RotateCcw size={14} /> Reset demo
            </button>
            <RoleSwitcher />
          </div>
        </header>

        <main className="flex-1 pb-10">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="mx-auto w-full max-w-7xl px-5 py-6 lg:px-8 lg:py-8"
          >
            <Outlet />
          </motion.div>
        </main>
      </div>

      <AnimatePresence>
        {drawerOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDrawerOpen(false)}
              className="fixed inset-0 z-40 bg-ink-900/50 lg:hidden"
            />
            <motion.div
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
              className="fixed inset-y-0 left-0 z-50 flex w-72 flex-col bg-white lg:hidden"
            >
              <div className="flex items-center justify-between p-5">
                <div className="flex items-center gap-2">
                  <PracticeMark size={26} />
                  <span className="font-display text-[14px] font-semibold text-ink-900">Staff Portal</span>
                </div>
                <button onClick={() => setDrawerOpen(false)} className="text-ink-500"><X size={20} /></button>
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
                      onClick={(e) => (locked ? e.preventDefault() : setDrawerOpen(false))}
                      className={({ isActive }) =>
                        cn(
                          "flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-[13.5px] font-medium",
                          locked ? "text-ink-300" : isActive ? "bg-teal-800 text-white" : "text-ink-600 hover:bg-ink-900/5"
                        )
                      }
                    >
                      <item.icon size={17} strokeWidth={1.9} />
                      {item.label}
                    </NavLink>
                  );
                })}
              </nav>
              <div className="p-4">
                <button
                  onClick={() => { logout(); navigate("/"); }}
                  className="flex w-full items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-[13px] font-medium text-ink-500 hover:bg-ink-900/5"
                >
                  <LogOut size={16} /> Log out
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
