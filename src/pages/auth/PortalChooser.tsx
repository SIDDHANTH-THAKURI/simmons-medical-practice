import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, ShieldCheck, Stethoscope, Users } from "lucide-react";
import { Container } from "@/components/Container";
import { PracticeLogo } from "@/components/Logo";

const OPTIONS = [
  {
    to: "/patient/login",
    icon: Stethoscope,
    title: "I'm a Patient",
    body: "Book appointments, manage billing and Medicare, and chat with the practice assistant.",
    color: "var(--color-teal-700)",
    bg: "bg-teal-50",
  },
  {
    to: "/staff/login",
    icon: Users,
    title: "I'm Practice Staff",
    body: "Reception, nursing, clinical or admin — sign in to your role-scoped staff portal.",
    color: "var(--color-terracotta-600)",
    bg: "bg-terracotta-50",
  },
];

export default function PortalChooser() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-cream-50 px-6 py-16">
      <div className="pointer-events-none absolute inset-0 -z-0">
        <div className="absolute -top-24 left-1/2 h-[32rem] w-[56rem] -translate-x-1/2 rounded-full bg-teal-100/60 blur-3xl" />
      </div>

      <Link to="/" className="absolute left-6 top-6 inline-flex items-center gap-1.5 text-[13px] font-medium text-ink-500 hover:text-ink-800 sm:left-10 sm:top-10">
        <ArrowLeft size={14} /> Back to site
      </Link>

      <Container className="relative flex max-w-3xl flex-col items-center text-center">
        <PracticeLogo size={36} />
        <motion.h1
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mt-8 font-display text-4xl font-semibold text-ink-900 text-balance sm:text-5xl"
        >
          Welcome back. Who's signing in?
        </motion.h1>
        <p className="mt-4 max-w-md text-[15.5px] text-ink-600">
          Choose your portal to continue — each one is tailored to what you need.
        </p>

        <div className="mt-12 grid w-full grid-cols-1 gap-5 sm:grid-cols-2">
          {OPTIONS.map((o, i) => (
            <motion.div
              key={o.to}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 + i * 0.1 }}
            >
              <Link
                to={o.to}
                className="group flex h-full flex-col items-start rounded-2xl border border-ink-900/8 bg-white p-8 text-left shadow-[var(--shadow-card)] transition-all hover:-translate-y-1 hover:shadow-[var(--shadow-lifted)]"
              >
                <div className={`flex h-14 w-14 items-center justify-center rounded-2xl ${o.bg}`} style={{ color: o.color }}>
                  <o.icon size={26} strokeWidth={1.75} />
                </div>
                <h2 className="mt-5 text-xl font-semibold text-ink-900">{o.title}</h2>
                <p className="mt-2 text-[13.5px] leading-relaxed text-ink-500">{o.body}</p>
                <span className="mt-6 inline-flex items-center gap-1.5 text-[13.5px] font-semibold group-hover:gap-2.5 transition-all" style={{ color: o.color }}>
                  Continue <ArrowRight size={15} />
                </span>
              </Link>
            </motion.div>
          ))}
        </div>

        <p className="mt-10 inline-flex items-center gap-1.5 text-[12.5px] text-ink-400">
          <ShieldCheck size={14} /> This is a demonstration prototype — no real patient data is used.
        </p>
      </Container>
    </div>
  );
}
