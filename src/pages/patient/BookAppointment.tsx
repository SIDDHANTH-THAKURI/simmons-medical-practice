import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Bot, Calendar, Check, CheckCircle2, ChevronRight, UserRound } from "lucide-react";
import { useCurrentPatient } from "@/store/useCurrentUser";
import { useAppStore } from "@/store/useAppStore";
import { useToastStore } from "@/store/useToastStore";
import { useChatStore } from "@/store/useChatStore";
import { providers } from "@/data/providers";
import { getNextAvailableDays, getOpenSlotsForDate } from "@/lib/scheduling";
import { Button } from "@/components/ui/Button";
import { Avatar } from "@/components/ui/Avatar";
import { cn } from "@/lib/utils";
import type { Provider } from "@/types";

const STEPS = ["Reason", "Provider", "Time", "Confirm"];
const REASON_CHIPS = ["General consultation", "Follow-up review", "Prescription renewal", "Vaccination", "Skin check", "Mental health review"];

function dayLabel(d: Date) {
  return new Intl.DateTimeFormat("en-AU", { weekday: "short", day: "numeric", month: "short" }).format(d);
}
function timeLabel(d: Date) {
  return new Intl.DateTimeFormat("en-AU", { hour: "numeric", minute: "2-digit", hour12: true }).format(d);
}

export default function BookAppointment() {
  const patient = useCurrentPatient()!;
  const appointments = useAppStore((s) => s.appointments);
  const addAppointment = useAppStore((s) => s.addAppointment);
  const recalls = useAppStore((s) => s.recalls);
  const showToast = useToastStore((s) => s.show);
  const openChat = useChatStore((s) => s.open);
  const navigate = useNavigate();

  const [step, setStep] = useState(0);
  const [reason, setReason] = useState("");
  const [providerId, setProviderId] = useState<string | null>(null);
  const [day, setDay] = useState<Date | null>(null);
  const [slot, setSlot] = useState<Date | null>(null);
  const [booked, setBooked] = useState(false);

  const myRecallChips = recalls.filter((r) => r.patientId === patient.id && r.status !== "completed" && r.status !== "scheduled").map((r) => r.type);
  const chips = [...new Set([...myRecallChips, ...REASON_CHIPS])].slice(0, 6);

  const selectedProvider = providers.find((p) => p.id === providerId) ?? null;

  const availableDays = useMemo(
    () => (providerId ? getNextAvailableDays(providerId, appointments, 10) : []),
    [providerId, appointments]
  );
  const slotsForDay = useMemo(
    () => (providerId && day ? getOpenSlotsForDate(providerId, day, appointments) : []),
    [providerId, day, appointments]
  );

  function next() {
    setStep((s) => Math.min(s + 1, STEPS.length - 1));
  }
  function back() {
    setStep((s) => Math.max(s - 1, 0));
  }

  function confirmBooking() {
    if (!selectedProvider || !slot) return;
    addAppointment({
      patientId: patient.id,
      providerId: selectedProvider.id,
      reason: reason || "General consultation",
      type: "Standard Consult",
      durationMins: 15,
      scheduledAt: slot.toISOString(),
      channel: "online",
    });
    setBooked(true);
    showToast({ variant: "success", title: "Appointment booked", description: `${reason} with ${selectedProvider.shortName}` });
  }

  if (booked) {
    return (
      <div className="mx-auto max-w-md py-16 text-center">
        <motion.div initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring", stiffness: 200, damping: 16 }}>
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-teal-100 text-teal-700">
            <CheckCircle2 size={32} />
          </div>
        </motion.div>
        <h1 className="mt-6 font-display text-2xl font-semibold text-ink-900">You're all booked in</h1>
        <p className="mt-2 text-[14px] text-ink-500">
          {reason} with {selectedProvider?.name} on {day && dayLabel(day)} at {slot && timeLabel(slot)}. We've added it to your appointments and you'll get a reminder beforehand.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Button onClick={() => navigate("/patient/app/appointments")}>View my appointments</Button>
          <Button
            variant="secondary"
            onClick={() => {
              setBooked(false);
              setStep(0);
              setReason("");
              setProviderId(null);
              setDay(null);
              setSlot(null);
            }}
          >
            Book another
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="font-display text-3xl font-semibold text-ink-900">Book an appointment</h1>
      <p className="mt-1.5 text-[14px] text-ink-500">Four quick steps — synced live, no phone call needed.</p>

      <div className="mt-8 flex items-center">
        {STEPS.map((s, i) => (
          <div key={s} className="flex flex-1 items-center last:flex-none">
            <div className="flex flex-col items-center gap-1.5">
              <div
                className={cn(
                  "flex h-9 w-9 items-center justify-center rounded-full text-[13px] font-semibold transition-colors",
                  i < step ? "bg-teal-700 text-white" : i === step ? "bg-teal-800 text-white ring-4 ring-teal-100" : "bg-ink-100 text-ink-400"
                )}
              >
                {i < step ? <Check size={15} /> : i + 1}
              </div>
              <span className={cn("text-[11px] font-medium", i <= step ? "text-ink-700" : "text-ink-400")}>{s}</span>
            </div>
            {i < STEPS.length - 1 && <div className={cn("mx-2 h-0.5 flex-1 rounded-full transition-colors", i < step ? "bg-teal-700" : "bg-ink-100")} />}
          </div>
        ))}
      </div>

      <div className="mt-9 rounded-2xl border border-ink-900/8 bg-white p-6 sm:p-7">
        <AnimatePresence mode="wait">
          <motion.div key={step} initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }} transition={{ duration: 0.2 }}>
            {step === 0 && (
              <div>
                <p className="text-[15px] font-semibold text-ink-900">What's the reason for your visit?</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {chips.map((c) => (
                    <button
                      key={c}
                      onClick={() => setReason(c)}
                      className={cn(
                        "rounded-full border px-3.5 py-2 text-[13px] font-medium transition-colors",
                        reason === c ? "border-teal-700 bg-teal-800 text-white" : "border-ink-900/10 bg-white text-ink-600 hover:border-teal-400"
                      )}
                    >
                      {c}
                    </button>
                  ))}
                </div>
                <input
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Or describe it in your own words…"
                  className="mt-4 h-11 w-full rounded-xl border border-ink-900/12 bg-white px-3.5 text-[14px] placeholder:text-ink-300 focus:outline-none focus:ring-2 focus:ring-teal-500/30"
                />
              </div>
            )}

            {step === 1 && (
              <div>
                <p className="text-[15px] font-semibold text-ink-900">Who would you like to see?</p>
                <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {providers.map((p: Provider) => (
                    <button
                      key={p.id}
                      onClick={() => setProviderId(p.id)}
                      className={cn(
                        "flex items-start gap-3 rounded-xl border p-4 text-left transition-colors",
                        providerId === p.id ? "border-teal-700 bg-teal-50" : "border-ink-900/10 hover:border-teal-300"
                      )}
                    >
                      <Avatar name={p.name} color={p.color} size={40} />
                      <div className="min-w-0">
                        <p className="text-[13.5px] font-semibold text-ink-900">{p.name}</p>
                        <p className="text-[12px] text-ink-500">{p.specialty}</p>
                        {p.id === patient.registeredProviderId && (
                          <span className="mt-1 inline-block text-[10.5px] font-semibold text-teal-700">Your usual GP</span>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {step === 2 && selectedProvider && (
              <div>
                <p className="text-[15px] font-semibold text-ink-900">Pick a day &amp; time with {selectedProvider.shortName}</p>
                <div className="mt-4 flex gap-2 overflow-x-auto pb-1 no-scrollbar">
                  {availableDays.map((d) => (
                    <button
                      key={d.toISOString()}
                      onClick={() => {
                        setDay(d);
                        setSlot(null);
                      }}
                      className={cn(
                        "flex shrink-0 flex-col items-center rounded-xl border px-4 py-2.5 transition-colors",
                        day?.toDateString() === d.toDateString() ? "border-teal-700 bg-teal-800 text-white" : "border-ink-900/10 text-ink-600 hover:border-teal-300"
                      )}
                    >
                      <span className="text-[11px] font-medium opacity-80">{new Intl.DateTimeFormat("en-AU", { weekday: "short" }).format(d)}</span>
                      <span className="text-[14px] font-semibold">{d.getDate()}</span>
                    </button>
                  ))}
                </div>

                {day && (
                  <div className="mt-5">
                    <p className="mb-2.5 text-[12.5px] font-medium text-ink-500">Available times on {dayLabel(day)}</p>
                    <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
                      {slotsForDay.map((s) => (
                        <button
                          key={s.toISOString()}
                          onClick={() => setSlot(s)}
                          className={cn(
                            "rounded-lg border py-2 text-[12.5px] font-medium transition-colors",
                            slot?.getTime() === s.getTime() ? "border-teal-700 bg-teal-800 text-white" : "border-ink-900/10 text-ink-600 hover:border-teal-300"
                          )}
                        >
                          {timeLabel(s)}
                        </button>
                      ))}
                      {slotsForDay.length === 0 && <p className="col-span-full text-[13px] text-ink-400">No openings this day — try another.</p>}
                    </div>
                  </div>
                )}
              </div>
            )}

            {step === 3 && selectedProvider && day && slot && (
              <div>
                <p className="text-[15px] font-semibold text-ink-900">Confirm your booking</p>
                <div className="mt-4 space-y-3 rounded-xl bg-cream-50 p-5">
                  <div className="flex items-center gap-3">
                    <Avatar name={selectedProvider.name} color={selectedProvider.color} size={40} />
                    <div>
                      <p className="text-[13.5px] font-semibold text-ink-900">{selectedProvider.name}</p>
                      <p className="text-[12px] text-ink-500">{selectedProvider.specialty}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3 border-t border-ink-900/8 pt-3 text-[13px]">
                    <div>
                      <p className="text-ink-400">Reason</p>
                      <p className="mt-0.5 font-medium text-ink-800">{reason || "General consultation"}</p>
                    </div>
                    <div>
                      <p className="text-ink-400">When</p>
                      <p className="mt-0.5 font-medium text-ink-800">{dayLabel(day)}, {timeLabel(slot)}</p>
                    </div>
                  </div>
                </div>
                <p className="mt-3 flex items-center gap-1.5 text-[12px] text-ink-400">
                  <Calendar size={13} /> A reminder will be sent by {patient.notifyPrefs.sms ? "SMS" : "email"} {patient.notifyPrefs.reminderHoursBefore}h beforehand.
                </p>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="mt-6 flex items-center justify-between">
        <div>
          {step > 0 && (
            <Button variant="ghost" onClick={back}>Back</Button>
          )}
        </div>
        <div className="flex items-center gap-3">
          <button onClick={openChat} className="hidden items-center gap-1.5 text-[12.5px] font-medium text-terracotta-600 hover:text-terracotta-800 sm:flex">
            <Bot size={14} /> Book via assistant instead
          </button>
          {step < 3 ? (
            <Button
              onClick={next}
              disabled={(step === 0 && !reason) || (step === 1 && !providerId) || (step === 2 && !slot)}
            >
              Continue <ChevronRight size={16} />
            </Button>
          ) : (
            <Button onClick={confirmBooking} variant="accent">
              <UserRound size={16} /> Confirm booking
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
