import { motion } from "framer-motion";
import { Bot, CalendarClock, CreditCard, FileHeart, ReceiptText, ShieldCheck, Stethoscope, UserRound } from "lucide-react";
import { Container } from "@/components/Container";

const STEPS = [
  { label: "Reason", icon: Stethoscope },
  { label: "Provider", icon: UserRound },
  { label: "Time", icon: CalendarClock },
  { label: "Confirm", icon: ShieldCheck },
];

const FEATURES = [
  {
    icon: CalendarClock,
    title: "Book in under a minute",
    body: "A guided 4-step flow — reason, provider, time, confirm — synced live so double-bookings simply can't happen.",
  },
  {
    icon: ReceiptText,
    title: "Billing that makes sense",
    body: "Every invoice shows the Medicare rebate and any gap payment side-by-side, with full history and receipts on demand.",
  },
  {
    icon: FileHeart,
    title: "Medicare &amp; insurance, sorted",
    body: "Card details, claim status and private health extras live in one place — no more digging through old emails.",
  },
  {
    icon: CreditCard,
    title: "Pay in a couple of taps",
    body: "Outstanding balances are rare on a bulk-billed practice — when they happen, paying them shouldn't be a chore.",
  },
];

export function PatientFeatures() {
  return (
    <section id="patients" className="py-24 lg:py-32 bg-white/60 border-y border-ink-900/8">
      <Container>
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="text-[13px] font-semibold uppercase tracking-wider text-teal-700">For patients</p>
            <h2 className="mt-3 font-display text-4xl font-semibold text-ink-900 text-balance">
              A portal patients actually enjoy using.
            </h2>
            <p className="mt-4 max-w-lg text-[16px] text-ink-600 text-balance">
              Booking, billing, Medicare and an AI assistant that knows the practice — all in a calm, uncluttered
              patient app.
            </p>

            <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2">
              {FEATURES.map((f) => (
                <motion.div
                  key={f.title}
                  initial={{ opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-teal-100 text-teal-700">
                    <f.icon size={17} strokeWidth={1.75} />
                  </div>
                  <h3 className="mt-3 text-[14.5px] font-semibold text-ink-900" dangerouslySetInnerHTML={{ __html: f.title }} />
                  <p className="mt-1.5 text-[13.5px] leading-relaxed text-ink-500" dangerouslySetInnerHTML={{ __html: f.body }} />
                </motion.div>
              ))}
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="rounded-2xl border border-ink-900/8 bg-white p-7 shadow-[var(--shadow-lifted)]"
          >
            <p className="text-[11px] font-semibold uppercase tracking-wider text-ink-400">Book an appointment</p>
            <p className="mt-1 text-[15px] font-semibold text-ink-900">4 quick steps, synced live with the practice</p>

            <div className="mt-7 flex items-center">
              {STEPS.map((s, i) => (
                <div key={s.label} className="flex flex-1 items-center last:flex-none">
                  <div className="flex flex-col items-center gap-2">
                    <div
                      className="flex h-11 w-11 items-center justify-center rounded-full text-white"
                      style={{ backgroundColor: i <= 1 ? "var(--color-teal-700)" : "var(--color-ink-200)" }}
                    >
                      <s.icon size={18} className={i <= 1 ? "text-white" : "text-ink-500"} />
                    </div>
                    <span className="text-[11px] font-medium text-ink-500">{s.label}</span>
                  </div>
                  {i < STEPS.length - 1 && (
                    <div className="mx-2 h-0.5 flex-1 rounded-full" style={{ backgroundColor: i < 1 ? "var(--color-teal-700)" : "var(--color-ink-200)" }} />
                  )}
                </div>
              ))}
            </div>

            <div className="mt-8 space-y-3">
              <div className="flex items-center justify-between rounded-xl bg-cream-50 p-4">
                <div>
                  <p className="text-[13px] font-medium text-ink-800">Full skin check</p>
                  <p className="text-[11.5px] text-ink-400">with Dr Rachel Kim · Tuesdays</p>
                </div>
                <span className="text-[11px] font-semibold text-teal-700 bg-teal-100 rounded-full px-2.5 py-1">Selected</span>
              </div>
              <div className="rounded-xl border border-dashed border-ink-300 p-4">
                <p className="text-[12px] text-ink-500">Next available: <span className="font-semibold text-ink-800">Tue 18 Aug, 9:15 AM</span></p>
              </div>
              <div className="flex items-center gap-2 rounded-xl bg-terracotta-50 p-3.5 text-terracotta-800">
                <Bot size={16} />
                <p className="text-[12px] font-medium">Prefer to chat? The assistant can book this for you too.</p>
              </div>
            </div>
          </motion.div>
        </div>
      </Container>
    </section>
  );
}
