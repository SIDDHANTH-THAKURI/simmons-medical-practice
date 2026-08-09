import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { CalendarClock, CalendarPlus, Clock, MapPin, MessageSquareText, Stethoscope, X } from "lucide-react";
import { useCurrentPatient } from "@/store/useCurrentUser";
import { useAppStore } from "@/store/useAppStore";
import { useToastStore } from "@/store/useToastStore";
import { providerById } from "@/data/providers";
import { CLINIC_INFO } from "@/data/clinicInfo";
import { getNextAvailableDays, getOpenSlotsForDate } from "@/lib/scheduling";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { EmptyState } from "@/components/ui/EmptyState";
import { cn, formatDate, formatTime } from "@/lib/utils";
import type { Appointment, AppointmentStatus } from "@/types";

const STATUS_VARIANT: Record<AppointmentStatus, "good" | "warning" | "critical" | "info" | "neutral"> = {
  confirmed: "good",
  pending: "warning",
  completed: "neutral",
  cancelled: "critical",
  "no-show": "critical",
  rescheduled: "info",
};

function dayLabel(d: Date) {
  return new Intl.DateTimeFormat("en-AU", { weekday: "short", day: "numeric", month: "short" }).format(d);
}
function timeLabel(d: Date) {
  return new Intl.DateTimeFormat("en-AU", { hour: "numeric", minute: "2-digit", hour12: true }).format(d);
}

function RescheduleModal({ appt, onClose }: { appt: Appointment; onClose: () => void }) {
  const appointments = useAppStore((s) => s.appointments);
  const rescheduleAppointment = useAppStore((s) => s.rescheduleAppointment);
  const patient = useCurrentPatient()!;
  const showToast = useToastStore((s) => s.show);
  const [day, setDay] = useState<Date | null>(null);
  const [slot, setSlot] = useState<Date | null>(null);

  const days = useMemo(() => getNextAvailableDays(appt.providerId, appointments, 8), [appt.providerId, appointments]);
  const slots = useMemo(() => (day ? getOpenSlotsForDate(appt.providerId, day, appointments) : []), [appt.providerId, day, appointments]);

  function confirm() {
    if (!slot) return;
    rescheduleAppointment(appt.id, slot.toISOString(), `${patient.firstName} ${patient.lastName}`);
    showToast({ variant: "success", title: "Appointment rescheduled", description: dayLabel(slot) + " at " + timeLabel(slot) });
    onClose();
  }

  return (
    <Modal open onClose={onClose} title="Reschedule appointment" description={appt.reason} size="lg">
      <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
        {days.map((d) => (
          <button
            key={d.toISOString()}
            onClick={() => { setDay(d); setSlot(null); }}
            className={cn(
              "flex shrink-0 flex-col items-center rounded-xl border px-4 py-2.5",
              day?.toDateString() === d.toDateString() ? "border-teal-700 bg-teal-800 text-white" : "border-ink-900/10 text-ink-600 hover:border-teal-300"
            )}
          >
            <span className="text-[11px] font-medium opacity-80">{new Intl.DateTimeFormat("en-AU", { weekday: "short" }).format(d)}</span>
            <span className="text-[14px] font-semibold">{d.getDate()}</span>
          </button>
        ))}
      </div>
      {day && (
        <div className="mt-5 grid grid-cols-3 gap-2 sm:grid-cols-4">
          {slots.map((s) => (
            <button
              key={s.toISOString()}
              onClick={() => setSlot(s)}
              className={cn(
                "rounded-lg border py-2 text-[12.5px] font-medium",
                slot?.getTime() === s.getTime() ? "border-teal-700 bg-teal-800 text-white" : "border-ink-900/10 text-ink-600 hover:border-teal-300"
              )}
            >
              {timeLabel(s)}
            </button>
          ))}
          {slots.length === 0 && <p className="col-span-full text-[13px] text-ink-400">No openings this day.</p>}
        </div>
      )}
      <div className="mt-6 flex justify-end gap-3">
        <Button variant="ghost" onClick={onClose}>Cancel</Button>
        <Button onClick={confirm} disabled={!slot}>Confirm new time</Button>
      </div>
    </Modal>
  );
}

function AppointmentCard({ appt, onReschedule }: { appt: Appointment; onReschedule: () => void }) {
  const provider = providerById(appt.providerId);
  const cancelAppointment = useAppStore((s) => s.cancelAppointment);
  const patient = useCurrentPatient()!;
  const showToast = useToastStore((s) => s.show);
  const [confirmCancel, setConfirmCancel] = useState(false);
  const upcoming = ["confirmed", "pending"].includes(appt.status);

  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-ink-900/8 bg-white p-5 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-start gap-3.5">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-teal-50 text-teal-700">
          <Stethoscope size={18} />
        </div>
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-[14px] font-semibold text-ink-900">{appt.reason}</p>
            <Badge variant={STATUS_VARIANT[appt.status]}>{appt.status.replace("-", " ")}</Badge>
          </div>
          <p className="mt-1 text-[12.5px] text-ink-500">{provider?.name} · {provider?.specialty}</p>
          <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-[12.5px] text-ink-500">
            <span className="inline-flex items-center gap-1.5"><CalendarClock size={13} /> {formatDate(appt.scheduledAt, { weekday: "long" })}</span>
            <span className="inline-flex items-center gap-1.5"><Clock size={13} /> {formatTime(appt.scheduledAt)}</span>
            <span className="inline-flex items-center gap-1.5"><MapPin size={13} /> {CLINIC_INFO.address.split(",")[0]}</span>
          </div>
        </div>
      </div>

      {upcoming ? (
        <div className="flex shrink-0 gap-2">
          <Button size="sm" variant="secondary" onClick={onReschedule}>Reschedule</Button>
          <Button size="sm" variant="ghost" className="text-terracotta-700 hover:bg-terracotta-50" onClick={() => setConfirmCancel(true)}>
            Cancel
          </Button>
        </div>
      ) : (
        <Link to="/patient/app/book">
          <Button size="sm" variant="secondary">Book again</Button>
        </Link>
      )}

      <Modal open={confirmCancel} onClose={() => setConfirmCancel(false)} title="Cancel this appointment?" size="sm">
        <p className="text-[13.5px] text-ink-600">{appt.reason} with {provider?.name} on {formatDate(appt.scheduledAt)} at {formatTime(appt.scheduledAt)}.</p>
        <div className="mt-6 flex justify-end gap-3">
          <Button variant="ghost" onClick={() => setConfirmCancel(false)}>Keep it</Button>
          <Button
            variant="danger"
            onClick={() => {
              cancelAppointment(appt.id, `${patient.firstName} ${patient.lastName}`);
              showToast({ variant: "info", title: "Appointment cancelled" });
              setConfirmCancel(false);
            }}
          >
            <X size={15} /> Yes, cancel
          </Button>
        </div>
      </Modal>
    </div>
  );
}

export default function Appointments() {
  const patient = useCurrentPatient()!;
  const appointments = useAppStore((s) => s.appointments);
  const [tab, setTab] = useState<"upcoming" | "past">("upcoming");
  const [rescheduling, setRescheduling] = useState<Appointment | null>(null);

  const mine = appointments.filter((a) => a.patientId === patient.id);
  const upcoming = mine
    .filter((a) => ["confirmed", "pending"].includes(a.status))
    .sort((a, b) => new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime());
  const past = mine
    .filter((a) => ["completed", "cancelled", "no-show", "rescheduled"].includes(a.status))
    .sort((a, b) => new Date(b.scheduledAt).getTime() - new Date(a.scheduledAt).getTime());

  const list = tab === "upcoming" ? upcoming : past;

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-semibold text-ink-900">Appointments</h1>
          <p className="mt-1.5 text-[14px] text-ink-500">Everything booked, past and upcoming.</p>
        </div>
        <Link to="/patient/app/book">
          <Button><CalendarPlus size={16} /> New appointment</Button>
        </Link>
      </div>

      <div className="mt-6 inline-flex rounded-xl bg-cream-100 p-1">
        {(["upcoming", "past"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={cn(
              "rounded-lg px-4 py-2 text-[13px] font-semibold capitalize transition-colors",
              tab === t ? "bg-white text-ink-900 shadow-sm" : "text-ink-500"
            )}
          >
            {t} {t === "upcoming" ? `(${upcoming.length})` : `(${past.length})`}
          </button>
        ))}
      </div>

      <motion.div layout className="mt-5 space-y-3">
        {list.map((a) => (
          <AppointmentCard key={a.id} appt={a} onReschedule={() => setRescheduling(a)} />
        ))}
        {list.length === 0 && (
          <EmptyState
            icon={<MessageSquareText size={30} strokeWidth={1.5} />}
            title={tab === "upcoming" ? "Nothing booked yet" : "No past visits"}
            description={tab === "upcoming" ? "Book your next appointment in under a minute." : "Your visit history will show up here."}
            action={tab === "upcoming" && (
              <Link to="/patient/app/book"><Button>Book an appointment</Button></Link>
            )}
          />
        )}
      </motion.div>

      {rescheduling && <RescheduleModal appt={rescheduling} onClose={() => setRescheduling(null)} />}
    </div>
  );
}
