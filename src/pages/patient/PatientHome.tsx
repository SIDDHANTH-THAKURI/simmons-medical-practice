import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Bot, CalendarClock, CalendarPlus, Clock, CreditCard, MapPin, Phone,
  ReceiptText, RefreshCcw, Sparkles, Stethoscope,
} from "lucide-react";
import { useCurrentPatient } from "@/store/useCurrentUser";
import { useAppStore } from "@/store/useAppStore";
import { useChatStore } from "@/store/useChatStore";
import { providerById } from "@/data/providers";
import { CLINIC_INFO } from "@/data/clinicInfo";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { formatCurrency, formatDate, formatTime } from "@/lib/utils";

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

export default function PatientHome() {
  const patient = useCurrentPatient()!;
  const appointments = useAppStore((s) => s.appointments);
  const invoices = useAppStore((s) => s.invoices);
  const recalls = useAppStore((s) => s.recalls);
  const openChat = useChatStore((s) => s.open);

  const mine = appointments.filter((a) => a.patientId === patient.id);
  const upcoming = mine
    .filter((a) => ["confirmed", "pending"].includes(a.status) && new Date(a.scheduledAt) > new Date())
    .sort((a, b) => new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime())[0];

  const outstanding = invoices.filter((i) => i.patientId === patient.id && i.status !== "paid");
  const outstandingTotal = outstanding.reduce((sum, i) => sum + i.gapPayment, 0);
  const myRecalls = recalls.filter((r) => r.patientId === patient.id && (r.status === "due" || r.status === "overdue"));

  const provider = upcoming ? providerById(upcoming.providerId) : undefined;

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
        <p className="text-[13px] font-medium text-ink-500">{formatDate(new Date(), { weekday: "long" })}</p>
        <h1 className="mt-1 font-display text-3xl font-semibold text-ink-900">{greeting()}, {patient.firstName}</h1>
      </motion.div>

      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          {upcoming ? (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
              className="relative overflow-hidden rounded-2xl bg-teal-900 p-6 text-white shadow-[var(--shadow-lifted)] sm:p-7"
            >
              <div className="pointer-events-none absolute -right-10 -top-10 h-48 w-48 rounded-full bg-teal-600/30 blur-3xl" />
              <div className="relative flex flex-col justify-between gap-6 sm:flex-row sm:items-center">
                <div>
                  <Badge variant="good" className="bg-white/15 text-white">
                    {upcoming.status === "confirmed" ? "Confirmed" : "Awaiting confirmation"}
                  </Badge>
                  <p className="mt-3 text-[13px] text-teal-200">Your next appointment</p>
                  <p className="mt-1 text-2xl font-semibold text-balance">{upcoming.reason}</p>
                  <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-1.5 text-[13.5px] text-teal-100">
                    <span className="inline-flex items-center gap-1.5"><Stethoscope size={14} /> {provider?.name}</span>
                    <span className="inline-flex items-center gap-1.5"><CalendarClock size={14} /> {formatDate(upcoming.scheduledAt, { weekday: "long" })}</span>
                    <span className="inline-flex items-center gap-1.5"><Clock size={14} /> {formatTime(upcoming.scheduledAt)}</span>
                  </div>
                </div>
                <div className="flex shrink-0 flex-col gap-2 sm:items-end">
                  <Link to="/patient/app/appointments">
                    <Button variant="accent" size="md" className="w-full sm:w-auto">Manage booking</Button>
                  </Link>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl border border-dashed border-ink-300 bg-white p-7 text-center">
              <p className="text-[15px] font-semibold text-ink-800">No upcoming appointments</p>
              <p className="mt-1.5 text-[13.5px] text-ink-500">Ready when you are — booking takes less than a minute.</p>
              <Link to="/patient/app/book">
                <Button className="mt-4"><CalendarPlus size={16} /> Book an appointment</Button>
              </Link>
            </motion.div>
          )}

          <div>
            <p className="mb-3 text-[13px] font-semibold uppercase tracking-wider text-ink-400">Quick actions</p>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {[
                { to: "/patient/app/book", icon: CalendarPlus, label: "Book appointment", color: "var(--color-teal-700)" },
                { to: "/patient/app/billing", icon: CreditCard, label: "Pay a bill", color: "var(--color-terracotta-500)" },
                { to: "/patient/app/appointments", icon: RefreshCcw, label: "Reschedule", color: "var(--color-chart-1)" },
                { to: "/patient/app/assistant", icon: Bot, label: "Ask assistant", color: "var(--color-amber-500)" },
              ].map((a) => (
                <Link
                  key={a.label}
                  to={a.to}
                  className="flex flex-col items-start gap-3 rounded-2xl border border-ink-900/8 bg-white p-4 transition-all hover:-translate-y-0.5 hover:shadow-[var(--shadow-card)]"
                >
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl" style={{ backgroundColor: `color-mix(in srgb, ${a.color} 14%, transparent)`, color: a.color }}>
                    <a.icon size={17} />
                  </span>
                  <span className="text-[13px] font-medium text-ink-700">{a.label}</span>
                </Link>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-ink-900/8 bg-white p-6">
            <div className="flex items-center justify-between">
              <p className="text-[15px] font-semibold text-ink-900">Recent visits</p>
              <Link to="/patient/app/appointments" className="text-[12.5px] font-semibold text-teal-700 hover:text-teal-900">View all</Link>
            </div>
            <div className="mt-4 divide-y divide-ink-900/6">
              {mine
                .filter((a) => a.status === "completed")
                .sort((a, b) => new Date(b.scheduledAt).getTime() - new Date(a.scheduledAt).getTime())
                .slice(0, 3)
                .map((a) => (
                  <div key={a.id} className="flex items-center justify-between py-3">
                    <div>
                      <p className="text-[13.5px] font-medium text-ink-800">{a.reason}</p>
                      <p className="text-[12px] text-ink-400">{providerById(a.providerId)?.name} · {formatDate(a.scheduledAt)}</p>
                    </div>
                    <Badge variant="good">Completed</Badge>
                  </div>
                ))}
              {mine.filter((a) => a.status === "completed").length === 0 && (
                <p className="py-6 text-center text-[13px] text-ink-400">No past visits yet.</p>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {myRecalls.length > 0 && (
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="rounded-2xl border border-amber-200 bg-amber-50 p-5">
              <p className="flex items-center gap-1.5 text-[13px] font-semibold text-amber-700">
                <Sparkles size={14} /> Due for a check-in
              </p>
              <div className="mt-3 space-y-2.5">
                {myRecalls.map((r) => (
                  <div key={r.id} className="flex items-center justify-between text-[13px]">
                    <span className="text-ink-700">{r.type}</span>
                    <Badge variant={r.status === "overdue" ? "critical" : "warning"}>{r.status}</Badge>
                  </div>
                ))}
              </div>
              <Link to="/patient/app/book">
                <Button size="sm" variant="secondary" className="mt-4 w-full">Book this in</Button>
              </Link>
            </motion.div>
          )}

          {outstandingTotal > 0 && (
            <div className="rounded-2xl border border-ink-900/8 bg-white p-5">
              <p className="flex items-center gap-1.5 text-[13px] font-semibold text-ink-700">
                <ReceiptText size={14} /> Outstanding balance
              </p>
              <p className="mt-2 text-2xl font-semibold text-ink-900 tabular-nums">{formatCurrency(outstandingTotal)}</p>
              <p className="mt-1 text-[12px] text-ink-400">{outstanding.length} invoice{outstanding.length > 1 ? "s" : ""} awaiting payment</p>
              <Link to="/patient/app/billing">
                <Button size="sm" className="mt-4 w-full">Review &amp; pay</Button>
              </Link>
            </div>
          )}

          <div className="rounded-2xl border border-terracotta-200 bg-terracotta-50 p-5">
            <p className="flex items-center gap-1.5 text-[13px] font-semibold text-terracotta-800">
              <Bot size={14} /> Ask the assistant
            </p>
            <p className="mt-2 text-[13px] leading-relaxed text-ink-600">
              "When's my next appointment?", "How much do I owe?", "Book me in with Dr Kim" — try it now.
            </p>
            <Button size="sm" variant="accent" className="mt-4 w-full" onClick={openChat}>Start a conversation</Button>
          </div>

          <div className="rounded-2xl border border-ink-900/8 bg-white p-5">
            <p className="text-[13px] font-semibold text-ink-700">Practice details</p>
            <div className="mt-3 space-y-2.5 text-[13px] text-ink-500">
              <p className="flex items-start gap-2"><MapPin size={14} className="mt-0.5 shrink-0" /> {CLINIC_INFO.address}</p>
              <p className="flex items-center gap-2"><Phone size={14} className="shrink-0" /> {CLINIC_INFO.phone}</p>
              <p className="flex items-center gap-2"><Clock size={14} className="shrink-0" /> {CLINIC_INFO.hours[0].time}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
