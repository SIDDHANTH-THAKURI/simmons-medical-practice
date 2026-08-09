import { motion } from "framer-motion";
import { Container } from "@/components/Container";
import { Avatar } from "@/components/ui/Avatar";
import { AbcLogo } from "@/components/Logo";

const TEAM = [
  { name: "Narottam", role: "Team Lead", blurb: "Client relationship, scope & delivery", color: "var(--color-teal-700)" },
  { name: "Divya", role: "Network Engineer", blurb: "Infrastructure, connectivity & Wi-Fi", color: "var(--color-chart-1)" },
  { name: "Siddhanth", role: "Cybersecurity", blurb: "Access control, backup & compliance", color: "var(--color-chart-8)" },
  { name: "Fatemeh", role: "Backend Developer", blurb: "Data layer, integration & API design", color: "var(--color-chart-3)" },
  { name: "Parneet", role: "UI / UX Designer", blurb: "Patient & staff experience design", color: "var(--color-terracotta-500)" },
  { name: "Kiran", role: "AI Engineer", blurb: "Applied AI & automation features", color: "var(--color-amber-500)" },
];

export function TeamSection() {
  return (
    <section className="py-24 lg:py-32">
      <Container>
        <div className="mx-auto max-w-2xl text-center">
          <AbcLogo size={30} className="mx-auto justify-center" />
          <h2 className="mt-6 font-display text-4xl font-semibold text-ink-900 text-balance">
            One team, not two vendors.
          </h2>
          <p className="mt-4 text-[16px] text-ink-600 text-balance">
            IT and accounting under a single point of contact — network &amp; cloud security certified, with
            CPA-qualified accountants in-house.
          </p>
        </div>

        <div className="mt-14 grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-6">
          {TEAM.map((m, i) => (
            <motion.div
              key={m.name}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.45, delay: i * 0.06 }}
              className="flex flex-col items-center rounded-2xl border border-ink-900/8 bg-white p-5 text-center"
            >
              <Avatar name={m.name} color={m.color} size={52} />
              <p className="mt-3 text-[13.5px] font-semibold text-ink-900">{m.name}</p>
              <p className="text-[11.5px] font-medium text-terracotta-600">{m.role}</p>
              <p className="mt-1.5 text-[11.5px] leading-snug text-ink-500">{m.blurb}</p>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
}
