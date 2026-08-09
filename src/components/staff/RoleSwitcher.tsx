import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, Repeat } from "lucide-react";
import { Avatar } from "@/components/ui/Avatar";
import { staffDirectory } from "@/data/providers";
import { roleLabels } from "@/data/permissions";
import { useAuthStore } from "@/store/useAuthStore";
import { useCurrentStaff } from "@/store/useCurrentUser";
import { cn } from "@/lib/utils";

export function RoleSwitcher() {
  const current = useCurrentStaff();
  const loginStaff = useAuthStore((s) => s.loginStaff);
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  if (!current) return null;

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 rounded-xl border border-ink-900/10 bg-white px-3 py-2 text-[12.5px] font-medium text-ink-600 hover:border-teal-400"
      >
        <Repeat size={14} className="text-terracotta-600" />
        Demo: switch role
        <ChevronDown size={14} className={cn("transition-transform", open && "rotate-180")} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.98 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 z-40 mt-2 w-72 overflow-hidden rounded-2xl border border-ink-900/8 bg-white shadow-[var(--shadow-lifted)]"
          >
            <p className="border-b border-ink-900/8 px-4 py-2.5 text-[11.5px] font-semibold uppercase tracking-wider text-ink-400">
              Switch staff account
            </p>
            <div className="max-h-96 overflow-y-auto p-1.5">
              {staffDirectory.map((s) => (
                <button
                  key={s.id}
                  onClick={() => {
                    loginStaff(s.id);
                    setOpen(false);
                    navigate("/staff/app");
                  }}
                  className={cn(
                    "flex w-full items-center gap-2.5 rounded-xl px-2.5 py-2 text-left hover:bg-cream-50",
                    current.id === s.id && "bg-teal-50"
                  )}
                >
                  <Avatar name={`${s.firstName} ${s.lastName}`} color={s.avatarColor} size={32} />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[13px] font-medium text-ink-800">{s.firstName} {s.lastName}</span>
                    <span className="block truncate text-[11px] text-ink-400">{roleLabels[s.role]}</span>
                  </span>
                  {current.id === s.id && <span className="text-[10px] font-semibold text-teal-700">Active</span>}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
