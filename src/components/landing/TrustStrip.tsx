import { motion } from "framer-motion";
import { Container } from "@/components/Container";

const STATS = [
  { value: "3", label: "Full-time GPs, 1 visiting specialist" },
  { value: "100%", label: "Bulk-billed standard consultations" },
  { value: "83%", label: "Patient attendance rate" },
  { value: "24/7", label: "AI assistant availability" },
];

export function TrustStrip() {
  return (
    <section className="border-y border-ink-900/8 bg-white/60">
      <Container className="grid grid-cols-2 divide-x divide-ink-900/8 py-10 sm:grid-cols-4">
        {STATS.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.5, delay: i * 0.08 }}
            className="px-4 text-center sm:px-6"
          >
            <p className="font-display text-3xl font-semibold text-teal-800 tabular-nums">{s.value}</p>
            <p className="mt-1.5 text-[12.5px] leading-snug text-ink-500">{s.label}</p>
          </motion.div>
        ))}
      </Container>
    </section>
  );
}
