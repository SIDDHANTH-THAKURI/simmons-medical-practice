import { CLINIC_INFO } from "./clinicInfo";

export type IntentId =
  | "greeting"
  | "thanks"
  | "book_appointment"
  | "reschedule_appointment"
  | "cancel_appointment"
  | "view_appointments"
  | "billing_balance"
  | "billing_history"
  | "medicare_info"
  | "insurance_info"
  | "clinic_hours"
  | "clinic_location"
  | "telehealth_info"
  | "what_to_bring"
  | "recalls_due"
  | "notifications"
  | "escalate_human"
  | "emergency"
  | "fallback";

interface IntentDef {
  id: IntentId;
  keywords: string[];
  phrases?: string[];
}

const INTENTS: IntentDef[] = [
  {
    id: "emergency",
    keywords: ["emergency", "000", "ambulance", "suicidal", "overdose", "stroke"],
    phrases: ["chest pain", "can't breathe", "cannot breathe", "severe bleeding", "allergic reaction"],
  },
  {
    id: "greeting",
    keywords: ["hi", "hello", "hey", "morning", "afternoon", "evening"],
  },
  {
    id: "thanks",
    keywords: ["thanks", "thank", "cheers", "appreciate", "awesome", "great"],
  },
  {
    id: "book_appointment",
    keywords: ["book", "booking", "schedule", "appointment"],
    phrases: ["make an appointment", "see a doctor", "see the doctor", "new appointment", "book in"],
  },
  {
    id: "reschedule_appointment",
    keywords: ["reschedule", "postpone", "move"],
    phrases: ["change my appointment", "different time", "different day", "move my appointment"],
  },
  {
    id: "cancel_appointment",
    keywords: ["cancel"],
    phrases: ["can't make it", "won't be able to make", "cant make it"],
  },
  {
    id: "view_appointments",
    keywords: ["upcoming", "next"],
    phrases: ["my appointments", "my appointment", "when is my appointment", "do i have an appointment"],
  },
  {
    id: "billing_balance",
    keywords: ["owe", "balance", "outstanding", "bill", "invoice", "cost"],
    phrases: ["how much do i owe", "what do i owe"],
  },
  {
    id: "billing_history",
    keywords: ["receipt", "receipts"],
    phrases: ["billing history", "previous bills", "past invoices", "payment history"],
  },
  {
    id: "medicare_info",
    keywords: ["medicare", "rebate", "claim", "mbs"],
    phrases: ["bulk bill", "bulk billed", "bulk-billed", "bulk billing"],
  },
  {
    id: "insurance_info",
    keywords: ["insurance", "cover", "fund"],
    phrases: ["private health", "health fund"],
  },
  {
    id: "clinic_hours",
    keywords: ["hours", "open", "close", "closing"],
    phrases: ["opening hours", "what time"],
  },
  {
    id: "clinic_location",
    keywords: ["address", "location", "directions", "parking"],
    phrases: ["where are you", "how do i get"],
  },
  {
    id: "telehealth_info",
    keywords: ["telehealth", "video"],
    phrases: ["phone consult", "video call", "online consult"],
  },
  {
    id: "what_to_bring",
    keywords: [],
    phrases: ["what should i bring", "what do i need to bring", "first visit", "new patient"],
  },
  {
    id: "recalls_due",
    keywords: ["recall", "overdue", "screening"],
    phrases: ["care plan due", "am i due"],
  },
  {
    id: "notifications",
    keywords: ["notifications"],
    phrases: ["reminders sent", "did you send", "did you text"],
  },
  {
    id: "escalate_human",
    keywords: ["reception", "human", "person"],
    phrases: ["talk to a person", "speak to someone", "speak to a person", "real person", "call me"],
  },
];

function normalize(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9' ]/g, " ").replace(/\s+/g, " ").trim();
}

export function matchIntent(rawText: string): IntentId {
  const text = normalize(rawText);
  if (!text) return "fallback";

  for (const intent of INTENTS) {
    if (intent.phrases?.some((p) => text.includes(p))) return intent.id;
  }

  const tokens = text.split(" ");
  let best: { id: IntentId; score: number } = { id: "fallback", score: 0 };
  for (const intent of INTENTS) {
    const score = intent.keywords.filter((k) => tokens.includes(k)).length;
    if (score > best.score) best = { id: intent.id, score };
  }
  return best.score > 0 ? best.id : "fallback";
}

export const SUGGESTED_QUESTIONS: string[] = [
  "Book me an appointment",
  "When's my next appointment?",
  "How much do I owe?",
  "Are you bulk billing?",
  "What are your opening hours?",
  "I need to reschedule",
];

export const FOLLOWUPS: Partial<Record<IntentId, string[]>> = {
  greeting: ["Book an appointment", "When's my next appointment?", "How much do I owe?"],
  book_appointment: [],
  view_appointments: ["Reschedule it", "Cancel it", "Book another"],
  billing_balance: ["Show billing history", "Pay now", "Am I bulk billed?"],
  billing_history: ["How much do I owe?", "Book an appointment"],
  medicare_info: ["What do I owe?", "Book an appointment"],
  insurance_info: ["What do I owe?", "Book an appointment"],
  clinic_hours: ["Where are you located?", "Book an appointment"],
  clinic_location: ["What are your opening hours?", "Book an appointment"],
  telehealth_info: ["Book an appointment", "What should I bring?"],
  what_to_bring: ["Book an appointment", "What are your opening hours?"],
  recalls_due: ["Book an appointment", "Remind me later"],
  notifications: ["When's my next appointment?"],
  escalate_human: [],
  emergency: [],
  fallback: ["Book an appointment", "How much do I owe?", "Talk to reception"],
  thanks: ["Anything else?"],
  cancel_appointment: ["Book a new appointment"],
  reschedule_appointment: [],
};

export function staticAnswer(intent: IntentId): string | null {
  switch (intent) {
    case "greeting":
      return "Hi, I'm the Simmons Medical Practice assistant. I can book or change appointments, answer billing questions, or point you to reception for anything clinical. What do you need?";
    case "thanks":
      return "You're welcome! Anything else I can help with?";
    case "medicare_info":
      return `${CLINIC_INFO.bulkBillingNote}`;
    case "insurance_info":
      return "We don't bill private health funds directly for GP consultations — standard visits are bulk-billed to Medicare instead. If a procedure carries a gap payment, you're welcome to claim that back through your private health extras, depending on your policy.";
    case "clinic_hours":
      return CLINIC_INFO.hours.map((h) => `${h.day}: ${h.time}`).join("\n");
    case "clinic_location":
      return `We're at ${CLINIC_INFO.address}. ${CLINIC_INFO.parkingNote}`;
    case "telehealth_info":
      return CLINIC_INFO.telehealthNote;
    case "what_to_bring":
      return CLINIC_INFO.newPatientNote;
    case "notifications":
      return "I send appointment reminders by SMS or email based on your notification preferences in Profile — you can check exactly what's gone out from the Notifications panel.";
    case "escalate_human":
      return `I've flagged this for reception — they'll follow up shortly. If it's urgent, you can call us directly on ${CLINIC_INFO.phone}.`;
    case "emergency":
      return "If this is a medical emergency, please call 000 immediately or go to your nearest emergency department. I'm not able to provide clinical advice — I've also flagged this conversation for reception to follow up.";
    case "fallback":
      return "I'm not quite sure I caught that. I can book or change appointments, answer billing and Medicare questions, or connect you with reception — what would you like to do?";
    default:
      return null;
  }
}
