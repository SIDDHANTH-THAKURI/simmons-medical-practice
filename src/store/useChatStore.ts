import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { ChatMessage } from "@/types";
import { uid, formatCurrency } from "@/lib/utils";
import { useAppStore } from "./useAppStore";
import { useAuthStore } from "./useAuthStore";
import { providers, providerById } from "@/data/providers";
import { getNextAvailableDays, getOpenSlotsForDate } from "@/lib/scheduling";
import { FOLLOWUPS, SUGGESTED_QUESTIONS, matchIntent, staticAnswer } from "@/data/chatbotEngine";

interface FlowOption {
  label: string;
  value: string;
}

type FlowKind = "book" | "reschedule" | "cancel";
type FlowStep = "pick_appt" | "reason" | "provider" | "day" | "time" | "confirm";

interface PendingFlow {
  kind: FlowKind;
  step: FlowStep;
  options: FlowOption[];
  reason?: string;
  providerId?: string;
  day?: string;
  targetApptId?: string;
}

interface ChatState {
  messages: ChatMessage[];
  isOpen: boolean;
  isTyping: boolean;
  pendingFlow: PendingFlow | null;
  open: () => void;
  close: () => void;
  toggle: () => void;
  resetConversation: () => void;
  sendUserMessage: (text: string) => void;
}

function normalize(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9 ]/g, " ").replace(/\s+/g, " ").trim();
}

function matchOption(text: string, options: FlowOption[]): FlowOption | null {
  const n = normalize(text);
  const exact = options.find((o) => normalize(o.label) === n);
  if (exact) return exact;
  const partial = options.find((o) => normalize(o.label).includes(n) || n.includes(normalize(o.label)));
  return partial ?? null;
}

function dayLabel(d: Date): string {
  return new Intl.DateTimeFormat("en-AU", { weekday: "short", day: "numeric", month: "short" }).format(d);
}
function timeLabel(d: Date): string {
  return new Intl.DateTimeFormat("en-AU", { hour: "numeric", minute: "2-digit", hour12: true }).format(d);
}

function assistantMsg(text: string, quickReplies?: string[]): ChatMessage {
  return { id: uid("msg"), role: "assistant", text, timestamp: new Date().toISOString(), quickReplies };
}
function userMsg(text: string): ChatMessage {
  return { id: uid("msg"), role: "user", text, timestamp: new Date().toISOString() };
}

const REASON_CHIPS = ["General consultation", "Follow-up review", "Prescription renewal", "Something else"];

export const useChatStore = create<ChatState>()(
  persist(
    (set, get) => ({
      messages: [],
      isOpen: false,
      isTyping: false,
      pendingFlow: null,

      open: () => {
        set({ isOpen: true });
        if (get().messages.length === 0) {
          const session = useAuthStore.getState().session;
          const patient =
            session?.kind === "patient"
              ? useAppStore.getState().patients.find((p) => p.id === session.id)
              : null;
          const name = patient ? `, ${patient.firstName}` : "";
          set({
            messages: [
              assistantMsg(
                `Hi${name}! I'm the Simmons Medical Practice assistant. I can book appointments, answer billing questions, or connect you with reception. What can I help with?`,
                SUGGESTED_QUESTIONS
              ),
            ],
          });
        }
      },
      close: () => set({ isOpen: false }),
      toggle: () => (get().isOpen ? get().close() : get().open()),
      resetConversation: () => set({ messages: [], pendingFlow: null }),

      sendUserMessage: (rawText) => {
        const text = rawText.trim();
        if (!text) return;

        const session = useAuthStore.getState().session;
        const patient =
          session?.kind === "patient" ? useAppStore.getState().patients.find((p) => p.id === session.id) : null;

        set((s) => ({ messages: [...s.messages, userMsg(text)] }));

        if (!patient) {
          set((s) => ({ messages: [...s.messages, assistantMsg("Please sign in to use the assistant.")] }));
          return;
        }

        const flow = get().pendingFlow;
        set({ isTyping: true });

        window.setTimeout(() => {
          const reply = flow ? continueFlow(text, flow, patient.id) : startFromIntent(text, patient.id);
          set((s) => ({
            messages: [...s.messages, reply.message],
            pendingFlow: reply.nextFlow,
            isTyping: false,
          }));
        }, 420 + Math.random() * 380);
      },
    }),
    {
      name: "smp-chat-v1",
      partialize: (s) => ({ messages: s.messages }),
    }
  )
);

function startFromIntent(text: string, patientId: string): { message: ChatMessage; nextFlow: PendingFlow | null } {
  const intent = matchIntent(text);
  const app = useAppStore.getState();

  switch (intent) {
    case "book_appointment": {
      const dueRecalls = app.recalls.filter((r) => r.patientId === patientId && r.status !== "completed" && r.status !== "scheduled");
      const chips = [...new Set([...dueRecalls.map((r) => r.type), ...REASON_CHIPS])].slice(0, 4);
      return {
        message: assistantMsg("Sure — what's the reason for your visit?", chips),
        nextFlow: { kind: "book", step: "reason", options: chips.map((c) => ({ label: c, value: c })) },
      };
    }
    case "reschedule_appointment":
    case "cancel_appointment": {
      const kind: FlowKind = intent === "reschedule_appointment" ? "reschedule" : "cancel";
      const upcoming = app.appointments
        .filter((a) => a.patientId === patientId && ["confirmed", "pending"].includes(a.status) && new Date(a.scheduledAt) > new Date())
        .sort((a, b) => new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime());
      if (upcoming.length === 0) {
        return {
          message: assistantMsg("You don't have any upcoming appointments right now.", ["Book an appointment"]),
          nextFlow: null,
        };
      }
      if (upcoming.length === 1) {
        return kind === "cancel" ? beginCancelConfirm(upcoming[0].id, upcoming[0].reason) : beginRescheduleDay(upcoming[0].id);
      }
      const options = upcoming.map((a) => ({
        label: `${a.reason} — ${dayLabel(new Date(a.scheduledAt))}`,
        value: a.id,
      }));
      return {
        message: assistantMsg(`Which appointment would you like to ${kind}?`, options.map((o) => o.label)),
        nextFlow: { kind, step: "pick_appt", options },
      };
    }
    case "view_appointments": {
      const upcoming = app.appointments
        .filter((a) => a.patientId === patientId && ["confirmed", "pending"].includes(a.status) && new Date(a.scheduledAt) > new Date())
        .sort((a, b) => new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime());
      if (upcoming.length === 0) {
        return { message: assistantMsg("You don't have any upcoming appointments booked.", FOLLOWUPS.fallback), nextFlow: null };
      }
      const lines = upcoming
        .slice(0, 4)
        .map((a) => {
          const prov = providerById(a.providerId);
          return `• ${a.reason} with ${prov?.shortName ?? "your provider"} — ${dayLabel(new Date(a.scheduledAt))} at ${timeLabel(new Date(a.scheduledAt))}`;
        })
        .join("\n");
      return { message: assistantMsg(`Here's what's coming up:\n${lines}`, FOLLOWUPS.view_appointments), nextFlow: null };
    }
    case "billing_balance": {
      const outstanding = app.invoices.filter((i) => i.patientId === patientId && i.status !== "paid");
      const total = outstanding.reduce((sum, i) => sum + i.gapPayment, 0);
      const message =
        total > 0
          ? `You have ${formatCurrency(total)} outstanding across ${outstanding.length} invoice${outstanding.length > 1 ? "s" : ""}. You can pay from the Billing tab.`
          : "You're all paid up — no outstanding balance. Nice!";
      return { message: assistantMsg(message, FOLLOWUPS.billing_balance), nextFlow: null };
    }
    case "billing_history": {
      const mine = app.invoices
        .filter((i) => i.patientId === patientId)
        .sort((a, b) => new Date(b.issuedAt).getTime() - new Date(a.issuedAt).getTime())
        .slice(0, 3);
      if (mine.length === 0) {
        return { message: assistantMsg("I can't find any past invoices on your account yet.", FOLLOWUPS.billing_history), nextFlow: null };
      }
      const lines = mine
        .map((i) => `• ${new Date(i.issuedAt).toLocaleDateString("en-AU", { day: "numeric", month: "short" })} — ${formatCurrency(i.totalAmount)} (${i.status})`)
        .join("\n");
      return { message: assistantMsg(`Your recent billing:\n${lines}`, FOLLOWUPS.billing_history), nextFlow: null };
    }
    case "recalls_due": {
      const due = app.recalls.filter((r) => r.patientId === patientId && (r.status === "due" || r.status === "overdue"));
      if (due.length === 0) {
        return { message: assistantMsg("You're all caught up — no recalls due right now.", FOLLOWUPS.fallback), nextFlow: null };
      }
      const lines = due.map((r) => `• ${r.type}${r.status === "overdue" ? " (overdue)" : ""}`).join("\n");
      return { message: assistantMsg(`You have a couple of things due:\n${lines}\nWant me to book one in?`, FOLLOWUPS.recalls_due), nextFlow: null };
    }
    default: {
      const text = staticAnswer(intent) ?? staticAnswer("fallback")!;
      return { message: assistantMsg(text, FOLLOWUPS[intent] ?? FOLLOWUPS.fallback), nextFlow: null };
    }
  }
}

function beginCancelConfirm(apptId: string, reason: string): { message: ChatMessage; nextFlow: PendingFlow | null } {
  const options = [{ label: "Yes, cancel it", value: "yes" }, { label: "No, keep it", value: "no" }];
  return {
    message: assistantMsg(`Just to confirm — cancel "${reason}"?`, options.map((o) => o.label)),
    nextFlow: { kind: "cancel", step: "confirm", options, targetApptId: apptId },
  };
}

function beginRescheduleDay(apptId: string): { message: ChatMessage; nextFlow: PendingFlow | null } {
  const appt = useAppStore.getState().appointments.find((a) => a.id === apptId)!;
  const days = getNextAvailableDays(appt.providerId, useAppStore.getState().appointments, 5);
  if (days.length === 0) {
    return { message: assistantMsg("I couldn't find any open days in the next month — please call reception to reschedule.", FOLLOWUPS.escalate_human), nextFlow: null };
  }
  const options = days.map((d) => ({ label: dayLabel(d), value: d.toISOString() }));
  return {
    message: assistantMsg("Which day works better?", options.map((o) => o.label)),
    nextFlow: { kind: "reschedule", step: "day", options, targetApptId: apptId },
  };
}

function continueFlow(text: string, flow: PendingFlow, patientId: string): { message: ChatMessage; nextFlow: PendingFlow | null } {
  const app = useAppStore.getState();
  const match = matchOption(text, flow.options);

  if (!match) {
    return {
      message: assistantMsg("Please pick one of the options below, or type \"cancel\" to stop.", flow.options.map((o) => o.label)),
      nextFlow: flow,
    };
  }

  if (normalize(match.label) === "cancel") {
    return { message: assistantMsg("No worries — let me know if you'd like to start again.", FOLLOWUPS.fallback), nextFlow: null };
  }

  switch (flow.step) {
    case "pick_appt": {
      const appt = app.appointments.find((a) => a.id === match.value)!;
      return flow.kind === "cancel" ? beginCancelConfirm(appt.id, appt.reason) : beginRescheduleDay(appt.id);
    }

    case "reason": {
      const gpOptions = providers.map((p) => ({ label: p.shortName, value: p.id }));
      gpOptions.push({ label: "No preference", value: "any" });
      return {
        message: assistantMsg("Who would you like to see?", gpOptions.map((o) => o.label)),
        nextFlow: { ...flow, step: "provider", reason: match.label, options: gpOptions },
      };
    }

    case "provider": {
      const patient = app.patients.find((p) => p.id === patientId)!;
      const providerId = match.value === "any" ? patient.registeredProviderId : match.value;
      const days = getNextAvailableDays(providerId, app.appointments, 5);
      if (days.length === 0) {
        return { message: assistantMsg("That provider doesn't have any open days in the next month — try another provider or call reception.", FOLLOWUPS.escalate_human), nextFlow: null };
      }
      const options = days.map((d) => ({ label: dayLabel(d), value: d.toISOString() }));
      const provider = providerById(providerId);
      return {
        message: assistantMsg(`Here are the next available days with ${provider?.shortName}:`, options.map((o) => o.label)),
        nextFlow: { ...flow, step: "day", providerId, options },
      };
    }

    case "day": {
      const date = new Date(match.value);
      const slots = getOpenSlotsForDate(flow.providerId!, date, app.appointments).slice(0, 8);
      if (slots.length === 0) {
        return { message: assistantMsg("That day just filled up — please pick another.", flow.options.map((o) => o.label)), nextFlow: flow };
      }
      const options = slots.map((d) => ({ label: timeLabel(d), value: d.toISOString() }));
      return {
        message: assistantMsg(`Pick a time on ${dayLabel(date)}:`, options.map((o) => o.label)),
        nextFlow: { ...flow, step: "time", day: date.toISOString(), options },
      };
    }

    case "time": {
      const provider = providerById(flow.providerId!);
      const when = new Date(match.value);
      const options = [{ label: "Confirm booking", value: "confirm" }, { label: "Start over", value: "cancel" }];
      return {
        message: assistantMsg(
          `Confirm: ${flow.reason} with ${provider?.shortName} on ${dayLabel(when)} at ${timeLabel(when)}?`,
          options.map((o) => o.label)
        ),
        nextFlow: { ...flow, step: "confirm", options, day: when.toISOString() },
      };
    }

    case "confirm": {
      if (flow.kind === "book" && match.value === "confirm") {
        const provider = providerById(flow.providerId!)!;
        app.addAppointment({
          patientId,
          providerId: provider.id,
          reason: flow.reason!,
          type: "Standard Consult",
          durationMins: 15,
          scheduledAt: flow.day!,
          channel: "ai-assistant",
        });
        return {
          message: assistantMsg(
            `You're all set! ${flow.reason} with ${provider.shortName} on ${dayLabel(new Date(flow.day!))} at ${timeLabel(new Date(flow.day!))} — added to your Appointments.`,
            ["View my appointments", "Anything else?"]
          ),
          nextFlow: null,
        };
      }
      if (flow.kind === "reschedule" && match.value === "confirm") {
        const patient = app.patients.find((p) => p.id === patientId)!;
        app.rescheduleAppointment(flow.targetApptId!, flow.day!, `${patient.firstName} ${patient.lastName}`);
        return {
          message: assistantMsg(`Done — your appointment is now on ${dayLabel(new Date(flow.day!))} at ${timeLabel(new Date(flow.day!))}.`, ["View my appointments", "Anything else?"]),
          nextFlow: null,
        };
      }
      if (flow.kind === "cancel" && match.value === "yes") {
        const patient = app.patients.find((p) => p.id === patientId)!;
        app.cancelAppointment(flow.targetApptId!, `${patient.firstName} ${patient.lastName}`);
        return { message: assistantMsg("Your appointment has been cancelled.", ["Book a new appointment", "Anything else?"]), nextFlow: null };
      }
      return { message: assistantMsg("No changes made. Anything else I can help with?", FOLLOWUPS.fallback), nextFlow: null };
    }

    default:
      return { message: assistantMsg(staticAnswer("fallback")!, FOLLOWUPS.fallback), nextFlow: null };
  }
}
