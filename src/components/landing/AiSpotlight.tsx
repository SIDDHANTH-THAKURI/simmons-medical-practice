import { motion } from "framer-motion";
import { Bot, CalendarCheck2, HelpCircle, MessageSquareText, PhoneForwarded, RefreshCcw, User } from "lucide-react";
import { Container } from "@/components/Container";

const TRANSCRIPT = [
  { from: "user", text: "Can I get a skin check next week?" },
  { from: "bot", text: "Dr Rachel Kim has an opening Tue 19 Aug at 9:15 AM — want me to book it?" },
  { from: "user", text: "Yes please" },
  { from: "bot", text: "Done ✓ You're booked with Dr Kim, Tue 19 Aug at 9:15 AM. I've popped a reminder in your notifications too." },
];

const CAPABILITIES = [
  { icon: HelpCircle, label: "Answers common enquiries" },
  { icon: CalendarCheck2, label: "Books appointments" },
  { icon: RefreshCcw, label: "Reschedules or cancels" },
  { icon: MessageSquareText, label: "Sends reminders" },
  { icon: PhoneForwarded, label: "Escalates complex cases" },
];

export function AiSpotlight() {
  return (
    <section id="assistant" className="relative overflow-hidden py-24 lg:py-32 bg-ink-900">
      <div className="pointer-events-none absolute inset-0 -z-0">
        <div className="absolute -top-32 left-1/3 h-96 w-96 rounded-full bg-teal-700/25 blur-3xl" />
        <div className="absolute bottom-0 right-10 h-72 w-72 rounded-full bg-terracotta-600/20 blur-3xl" />
      </div>

      <Container className="relative grid grid-cols-1 gap-16 lg:grid-cols-2 lg:items-center">
        <div>
          <p className="text-[13px] font-semibold uppercase tracking-wider text-terracotta-300">Beyond a chatbot</p>
          <h2 className="mt-3 font-display text-4xl font-semibold text-white text-balance">
            An intelligent front desk, awake around the clock.
          </h2>
          <p className="mt-4 max-w-lg text-[16px] text-white/65 text-balance">
            The AI Virtual Patient Assistant handles routine admin — booking, rescheduling, FAQs — end to end, and
            hands anything clinical straight to your team.
          </p>

          <div className="mt-9 grid grid-cols-2 gap-3 sm:grid-cols-3">
            {CAPABILITIES.map((c, i) => (
              <motion.div
                key={c.label}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.4, delay: i * 0.06 }}
                className="rounded-xl border border-white/10 bg-white/5 p-3.5"
              >
                <c.icon size={17} className="text-teal-300" strokeWidth={1.75} />
                <p className="mt-2 text-[12px] leading-snug text-white/80">{c.label}</p>
              </motion.div>
            ))}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6 }}
          className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur"
        >
          <div className="flex items-center gap-2 border-b border-white/10 pb-4">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-terracotta-500 text-white">
              <Bot size={16} />
            </div>
            <div>
              <p className="text-[13px] font-semibold text-white">Practice Assistant</p>
              <p className="text-[11px] text-white/50">Typically replies instantly</p>
            </div>
          </div>

          <div className="mt-4 space-y-3">
            {TRANSCRIPT.map((m, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: 0.15 * i }}
                className={`flex items-end gap-2 ${m.from === "user" ? "justify-end" : "justify-start"}`}
              >
                {m.from === "bot" && (
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-terracotta-500/90 text-white">
                    <Bot size={12} />
                  </div>
                )}
                <div
                  className={`max-w-[78%] rounded-2xl px-3.5 py-2.5 text-[13px] leading-relaxed ${
                    m.from === "user" ? "bg-teal-600 text-white rounded-br-sm" : "bg-white/10 text-white/90 rounded-bl-sm"
                  }`}
                >
                  {m.text}
                </div>
                {m.from === "user" && (
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white/15 text-white">
                    <User size={12} />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </Container>
    </section>
  );
}
