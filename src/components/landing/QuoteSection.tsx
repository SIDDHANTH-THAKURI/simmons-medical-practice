import { motion } from "framer-motion";
import { Container } from "@/components/Container";
import { Avatar } from "@/components/ui/Avatar";

export function QuoteSection() {
  return (
    <section className="py-24 lg:py-28">
      <Container className="max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6 }}
          className="rounded-2xl border border-ink-900/8 bg-white p-10 text-center shadow-[var(--shadow-card)]"
        >
          <svg width="34" height="26" viewBox="0 0 34 26" fill="none" className="mx-auto text-terracotta-300">
            <path d="M0 26V15.6C0 6.8 5.4 1 14.6 0l1.4 4.6C10.6 6 8 9 8 13.4h6V26H0Zm18 0V15.6C18 6.8 23.4 1 32.6 0L34 4.6C28.6 6 26 9 26 13.4h6V26H18Z" fill="currentColor" />
          </svg>
          <p className="mt-4 font-display text-2xl leading-snug text-ink-800 text-balance">
            "Our biggest issue isn't any one thing breaking — it's that nothing talks to anything else. I'm the one
            holding it all together, and I don't have time to be the IT department too."
          </p>
          <div className="mt-7 flex items-center justify-center gap-3">
            <Avatar name="Paul Simmons" color="var(--color-teal-700)" size={40} />
            <div className="text-left">
              <p className="text-[14px] font-semibold text-ink-900">Dr Paul Simmons</p>
              <p className="text-[12.5px] text-ink-500">Owner &amp; GP, Simmons Medical Practice</p>
            </div>
          </div>
          <p className="mt-5 text-[11.5px] text-ink-400">Paraphrased from the practice's original problem brief to ABC Partners.</p>
        </motion.div>
      </Container>
    </section>
  );
}
