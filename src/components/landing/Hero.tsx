import { Link } from "react-router-dom";
import { motion, type Variants } from "framer-motion";
import { ArrowRight, Bot, CalendarCheck2, MapPin, ShieldCheck, Sparkles } from "lucide-react";
import { Container } from "@/components/Container";
import { Button } from "@/components/ui/Button";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 18 },
  show: (i: number) => ({ opacity: 1, y: 0, transition: { duration: 0.6, delay: 0.08 * i, ease: [0.16, 1, 0.3, 1] } }),
};

function BrowserMock() {
  return (
    <div className="rounded-2xl border border-ink-900/10 bg-white shadow-[var(--shadow-lifted)] overflow-hidden">
      <div className="flex items-center gap-2 border-b border-ink-900/8 bg-cream-50 px-4 py-3">
        <span className="h-2.5 w-2.5 rounded-full bg-terracotta-300" />
        <span className="h-2.5 w-2.5 rounded-full bg-amber-300" />
        <span className="h-2.5 w-2.5 rounded-full bg-teal-300" />
        <div className="ml-3 flex-1 rounded-md bg-white border border-ink-900/8 px-3 py-1 text-[11px] text-ink-400">
          portal.simmonsmedical.com.au/dashboard
        </div>
      </div>
      <div className="p-5">
        <p className="text-[11px] font-medium uppercase tracking-wider text-ink-400">Good morning, Dr Simmons</p>
        <p className="mt-0.5 text-[15px] font-semibold text-ink-900">Here's how the practice is tracking</p>
        <div className="mt-4 grid grid-cols-3 gap-3">
          {[
            { label: "Appointments", value: "1,177", color: "var(--color-teal-700)" },
            { label: "Attendance", value: "83%", color: "var(--color-chart-3)" },
            { label: "No-show rate", value: "11.7%", color: "var(--color-terracotta-500)" },
          ].map((k) => (
            <div key={k.label} className="rounded-xl bg-cream-50 border border-ink-900/6 p-3">
              <p className="text-[10.5px] text-ink-500">{k.label}</p>
              <p className="mt-1 text-lg font-semibold tabular-nums" style={{ color: k.color }}>{k.value}</p>
            </div>
          ))}
        </div>
        <div className="mt-3 flex items-end gap-1.5 rounded-xl border border-ink-900/6 bg-cream-50 p-3 h-20">
          {[40, 55, 48, 62, 58, 70, 66, 78, 72, 84].map((h, i) => (
            <div key={i} className="flex-1 rounded-t-sm" style={{ height: `${h}%`, backgroundColor: "var(--color-teal-400)", opacity: 0.55 + i * 0.04 }} />
          ))}
        </div>
        <div className="mt-3 flex items-center gap-3 rounded-xl border border-ink-900/6 p-3">
          <div className="h-8 w-8 shrink-0 rounded-full bg-teal-100 flex items-center justify-center text-teal-700">
            <CalendarCheck2 size={16} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[12.5px] font-medium text-ink-800 truncate">Olivia Taylor — Mental health review</p>
            <p className="text-[11px] text-ink-400">Today, 10:00 AM · Dr James Chen</p>
          </div>
          <span className="text-[10.5px] font-semibold text-teal-700 bg-teal-100 rounded-full px-2 py-1">Confirmed</span>
        </div>
      </div>
    </div>
  );
}

function PhoneMock() {
  return (
    <div className="w-[190px] rounded-[1.75rem] border-4 border-ink-900 bg-ink-900 shadow-[var(--shadow-lifted)]">
      <div className="rounded-[1.4rem] overflow-hidden bg-cream-25">
        <div className="flex justify-center bg-ink-900 py-1.5">
          <div className="h-1 w-10 rounded-full bg-ink-700" />
        </div>
        <div className="p-3.5">
          <p className="text-[10px] text-ink-400">Wednesday, 9:02 AM</p>
          <p className="text-[13px] font-semibold text-ink-900 mt-0.5">Hi Olivia 👋</p>
          <div className="mt-3 rounded-xl bg-teal-800 p-3 text-white">
            <p className="text-[9.5px] uppercase tracking-wide text-teal-200">Upcoming</p>
            <p className="text-[12px] font-semibold mt-1">Dr James Chen</p>
            <p className="text-[10.5px] text-teal-100">Today · 10:00 AM</p>
          </div>
          <div className="mt-2.5 grid grid-cols-2 gap-2">
            <div className="rounded-lg bg-white border border-ink-900/8 p-2 text-center">
              <p className="text-[9px] text-ink-400">Reschedule</p>
            </div>
            <div className="rounded-lg bg-white border border-ink-900/8 p-2 text-center">
              <p className="text-[9px] text-ink-400">Billing</p>
            </div>
          </div>
          <div className="mt-2.5 flex items-center gap-2 rounded-xl bg-terracotta-500 p-2.5 text-white">
            <Bot size={14} />
            <p className="text-[10.5px] font-medium">Ask the assistant…</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export function Hero() {
  return (
    <section className="relative overflow-hidden pt-40 pb-24 lg:pt-48 lg:pb-32">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-24 left-1/2 h-[36rem] w-[62rem] -translate-x-1/2 rounded-full bg-teal-100/60 blur-3xl" />
        <div className="absolute top-40 right-0 h-72 w-72 rounded-full bg-terracotta-100/70 blur-3xl" />
      </div>

      <Container className="grid grid-cols-1 items-center gap-16 lg:grid-cols-2">
        <div>
          <motion.div variants={fadeUp} initial="hidden" animate="show" custom={0} className="inline-flex items-center gap-2 rounded-full border border-teal-700/15 bg-teal-50 px-3.5 py-1.5 text-[12.5px] font-medium text-teal-800">
            <MapPin size={13} />
            24 Grafton Street, Toowong QLD · General Practice
          </motion.div>

          <motion.h1
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={1}
            className="mt-6 font-display text-[2.6rem] leading-[1.08] font-semibold text-ink-900 text-balance sm:text-6xl"
          >
            One practice portal, built around every patient.
          </motion.h1>

          <motion.p variants={fadeUp} initial="hidden" animate="show" custom={2} className="mt-6 max-w-lg text-[17px] leading-relaxed text-ink-600 text-balance">
            Simmons Medical Practice's booking, billing and care coordination —
            in one secure portal for patients and staff, with an AI assistant
            that handles the busywork so your team can focus on care.
          </motion.p>

          <motion.div variants={fadeUp} initial="hidden" animate="show" custom={3} className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Link to="/portal">
              <Button size="lg" className="w-full sm:w-auto">
                Access Your Portal <ArrowRight size={17} />
              </Button>
            </Link>
            <a href="#patients">
              <Button size="lg" variant="secondary" className="w-full sm:w-auto">
                See what's inside
              </Button>
            </a>
          </motion.div>

          <motion.div variants={fadeUp} initial="hidden" animate="show" custom={4} className="mt-10 flex flex-wrap items-center gap-x-7 gap-y-3 text-[13px] text-ink-500">
            <span className="inline-flex items-center gap-1.5"><ShieldCheck size={15} className="text-teal-700" /> Australian-hosted &amp; encrypted</span>
            <span className="inline-flex items-center gap-1.5"><Sparkles size={15} className="text-terracotta-500" /> 100% bulk-billed standard visits</span>
            <span className="inline-flex items-center gap-1.5"><Bot size={15} className="text-teal-700" /> AI assistant, available 24/7</span>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="relative mx-auto w-full max-w-md lg:max-w-none"
        >
          <div className="animate-float">
            <BrowserMock />
          </div>
          <motion.div
            className="absolute -bottom-10 -right-4 hidden sm:block animate-float"
            style={{ animationDelay: "1.2s" }}
          >
            <PhoneMock />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.9, duration: 0.5 }}
            className="absolute -left-10 -top-6 hidden items-center gap-2 rounded-xl border border-ink-900/8 bg-white px-3 py-2 shadow-[var(--shadow-card)] sm:flex"
          >
            <span className="h-2 w-2 rounded-full bg-[#0ca30c] animate-pulse-ring" />
            <span className="text-[12px] font-medium text-ink-700">Reminder sent via SMS</span>
          </motion.div>
        </motion.div>
      </Container>
    </section>
  );
}
