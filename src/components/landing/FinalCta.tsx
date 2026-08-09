import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Stethoscope, Users } from "lucide-react";
import { Container } from "@/components/Container";
import { Button } from "@/components/ui/Button";

export function FinalCta() {
  return (
    <section className="py-24 lg:py-28">
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6 }}
          className="relative overflow-hidden rounded-3xl bg-teal-900 px-8 py-16 text-center sm:px-16"
        >
          <div className="pointer-events-none absolute -top-20 -right-16 h-64 w-64 rounded-full bg-terracotta-500/20 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 -left-10 h-64 w-64 rounded-full bg-teal-500/25 blur-3xl" />
          <h2 className="relative font-display text-4xl font-semibold text-white text-balance sm:text-5xl">
            See it for yourself.
          </h2>
          <p className="relative mx-auto mt-4 max-w-xl text-[16px] text-white/70 text-balance">
            Two portals, one practice. Log in as a patient or a staff member and explore exactly what Simmons
            Medical Practice gets on day one.
          </p>
          <div className="relative mt-9 flex flex-col justify-center gap-3 sm:flex-row">
            <Link to="/portal">
              <Button size="lg" variant="accent" className="w-full sm:w-auto">
                <Stethoscope size={17} /> Continue as Patient
              </Button>
            </Link>
            <Link to="/portal">
              <Button size="lg" className="w-full bg-white text-teal-900 hover:bg-cream-100 sm:w-auto">
                <Users size={17} /> Continue as Staff <ArrowRight size={16} />
              </Button>
            </Link>
          </div>
        </motion.div>
      </Container>
    </section>
  );
}
