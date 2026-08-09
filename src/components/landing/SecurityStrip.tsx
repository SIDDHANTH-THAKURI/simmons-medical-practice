import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Cloud, Fingerprint, Lock, PrinterCheck, RadioTower, ScrollText, ShieldAlert, ShieldCheck, Wrench } from "lucide-react";
import { Container } from "@/components/Container";

const CONTROLS = [
  { icon: Cloud, label: "Australian-region hosting" },
  { icon: Lock, label: "Encrypted at rest & in transit" },
  { icon: ShieldCheck, label: "3-2-1 backups, restore-tested" },
  { icon: RadioTower, label: "Automatic failover" },
  { icon: ShieldAlert, label: "Ransomware protection" },
  { icon: Wrench, label: "Continuous patching" },
  { icon: Fingerprint, label: "Multi-factor remote access" },
  { icon: PrinterCheck, label: "Secure, badge-release printing" },
  { icon: ScrollText, label: "Full access logging" },
];

export function SecurityStrip() {
  return (
    <section id="security" className="py-24 lg:py-32 bg-white/60 border-y border-ink-900/8">
      <Container>
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-[13px] font-semibold uppercase tracking-wider text-teal-700">Security &amp; compliance</p>
          <h2 className="mt-3 font-display text-4xl font-semibold text-ink-900 text-balance">
            Nine controls, running quietly in the background.
          </h2>
          <p className="mt-4 text-[16px] text-ink-600 text-balance">
            No single point of failure, no single point of control — materially lower ransomware exposure than
            self-managed IT.
          </p>
        </div>

        <div className="mt-14 grid grid-cols-2 gap-4 sm:grid-cols-3">
          {CONTROLS.map((c, i) => (
            <motion.div
              key={c.label}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.4, delay: (i % 3) * 0.08 }}
              className="flex items-center gap-3 rounded-xl border border-ink-900/8 bg-white p-4"
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-teal-50 text-teal-700">
                <c.icon size={17} strokeWidth={1.75} />
              </div>
              <span className="text-[13px] font-medium text-ink-700">{c.label}</span>
            </motion.div>
          ))}
        </div>

        <div className="mt-10 flex justify-center">
          <Link to="/system-architecture?tab=security" className="inline-flex items-center gap-1.5 text-[14px] font-semibold text-teal-800 hover:gap-2.5 transition-all">
            See the compliance &amp; audit model <ArrowRight size={16} />
          </Link>
        </div>
      </Container>
    </section>
  );
}
