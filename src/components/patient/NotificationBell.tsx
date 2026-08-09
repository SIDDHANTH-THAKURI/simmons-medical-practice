import { useState, useRef, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Bell, BellRing, CreditCard, FlaskConical, RefreshCcw, Settings2 } from "lucide-react";
import { useAppStore } from "@/store/useAppStore";
import { useCurrentPatient } from "@/store/useCurrentUser";
import { formatRelativeTime, cn } from "@/lib/utils";
import type { Notification } from "@/types";

const KIND_ICON: Record<Notification["kind"], typeof Bell> = {
  reminder: BellRing,
  billing: CreditCard,
  result: FlaskConical,
  recall: RefreshCcw,
  system: Settings2,
};

export function NotificationBell() {
  const patient = useCurrentPatient();
  const notifications = useAppStore((s) => s.notifications);
  const markRead = useAppStore((s) => s.markNotificationRead);
  const markAllRead = useAppStore((s) => s.markAllNotificationsRead);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  if (!patient) return null;
  const mine = notifications.filter((n) => n.patientId === patient.id).slice(0, 12);
  const unread = mine.filter((n) => !n.read).length;

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="relative flex h-10 w-10 items-center justify-center rounded-xl text-ink-500 hover:bg-ink-900/5"
        aria-label="Notifications"
      >
        <Bell size={19} />
        {unread > 0 && (
          <span className="absolute right-1.5 top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-terracotta-500 px-1 text-[9.5px] font-bold text-white">
            {unread}
          </span>
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.98 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 z-40 mt-2 w-80 overflow-hidden rounded-2xl border border-ink-900/8 bg-white shadow-[var(--shadow-lifted)]"
          >
            <div className="flex items-center justify-between border-b border-ink-900/8 px-4 py-3">
              <p className="text-[13.5px] font-semibold text-ink-900">Notifications</p>
              {unread > 0 && (
                <button onClick={() => markAllRead(patient.id)} className="text-[11.5px] font-medium text-teal-700 hover:text-teal-900">
                  Mark all read
                </button>
              )}
            </div>
            <div className="max-h-96 overflow-y-auto">
              {mine.length === 0 && <p className="px-4 py-8 text-center text-[13px] text-ink-400">You're all caught up.</p>}
              {mine.map((n) => {
                const Icon = KIND_ICON[n.kind];
                return (
                  <button
                    key={n.id}
                    onClick={() => markRead(n.id)}
                    className={cn("flex w-full items-start gap-3 border-b border-ink-900/5 px-4 py-3 text-left hover:bg-cream-50 last:border-b-0", !n.read && "bg-teal-50/40")}
                  >
                    <span className={cn("mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full", n.read ? "bg-ink-100 text-ink-400" : "bg-teal-100 text-teal-700")}>
                      <Icon size={13} />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-[12.5px] font-semibold text-ink-800">{n.title}</span>
                      <span className="block text-[12px] leading-snug text-ink-500">{n.body}</span>
                      <span className="mt-0.5 block text-[10.5px] text-ink-300">{formatRelativeTime(n.createdAt)}</span>
                    </span>
                    {!n.read && <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-terracotta-500" />}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
