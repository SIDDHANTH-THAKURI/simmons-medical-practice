import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, BellRing, LayoutDashboard, Network, Receipt } from "lucide-react";
import { Container } from "@/components/Container";

const PROBLEMS = [
  {
    n: "01",
    icon: Network,
    title: "Ageing, unreliable network",
    quote: "Outages hit reception, consulting rooms and the visiting specialist's room alike — bulk-billing claims can fail mid-consult when the connection drops.",
    fix: "A segmented, redundant network — clinical, admin and guest Wi-Fi on separate VLANs, with automatic failover so one dropped connection can't take down the practice.",
    cta: "See the network design",
    to: "/system-architecture?tab=network",
  },
  {
    n: "02",
    icon: Receipt,
    title: "Disconnected accounting",
    quote: "Accounting software sits apart from the patient management system, duplicating data entry for billing and reconciliation.",
    fix: "Billing flows from the practice system straight into Xero — one data model, no duplicate entry, with reconciliation status visible in Claims & Billing.",
    cta: "See the integration flow",
    to: "/system-architecture?tab=integration",
  },
  {
    n: "03",
    icon: BellRing,
    title: "No automated reminders",
    quote: "The patient management system can't trigger SMS/email reminders, contributing to avoidable missed appointments.",
    fix: "Automated SMS &amp; email reminders, plus an AI assistant that can rebook in seconds — cutting no-shows from 19.7% to 7.1% when a reminder goes out.",
    cta: "See the AI assistant",
    to: "/system-architecture?tab=ai",
  },
  {
    n: "04",
    icon: LayoutDashboard,
    title: "No proactive technology advice",
    quote: "Investment decisions are reactive rather than planned — there's no standing forum for forward-looking guidance.",
    fix: "A live owner dashboard replaces ad-hoc advice with a standing view of the practice — attendance, claims and revenue at risk, visible the moment you log in.",
    cta: "Explore the staff portal",
    to: "/portal",
  },
];

export function ProblemsSection() {
  return (
    <section className="py-24 lg:py-32">
      <Container>
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-[13px] font-semibold uppercase tracking-wider text-terracotta-600">Built for the problems that matter</p>
          <h2 className="mt-3 font-display text-4xl font-semibold text-ink-900 text-balance">
            Four problems Dr Simmons raised. Four things this portal fixes.
          </h2>
          <p className="mt-4 text-[16px] text-ink-600 text-balance">
            Every recommendation traces back to something the practice actually told us — not a generic feature list.
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-2">
          {PROBLEMS.map((p, i) => (
            <motion.div
              key={p.n}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.55, delay: (i % 2) * 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="group flex flex-col rounded-2xl border border-ink-900/8 bg-white p-7 shadow-[var(--shadow-card)] transition-shadow hover:shadow-[var(--shadow-lifted)]"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-teal-800 text-white">
                  <p.icon size={20} strokeWidth={1.75} />
                </div>
                <span className="font-display text-2xl text-ink-200">{p.n}</span>
              </div>

              <h3 className="mt-5 text-[17px] font-semibold text-ink-900">{p.title}</h3>
              <p className="mt-2.5 border-l-2 border-terracotta-300 pl-3 text-[13.5px] italic leading-relaxed text-ink-500">
                "{p.quote}"
              </p>

              <div className="mt-4 flex-1 rounded-xl bg-teal-50/70 p-4">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-teal-700">The fix</p>
                <p className="mt-1.5 text-[13.5px] leading-relaxed text-ink-700" dangerouslySetInnerHTML={{ __html: p.fix }} />
              </div>

              <Link
                to={p.to}
                className="mt-5 inline-flex items-center gap-1.5 text-[13.5px] font-semibold text-teal-800 group-hover:gap-2.5 transition-all"
              >
                {p.cta} <ArrowRight size={15} />
              </Link>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
}
