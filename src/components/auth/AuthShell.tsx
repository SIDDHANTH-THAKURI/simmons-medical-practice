import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, ShieldCheck } from "lucide-react";
import { PracticeMark } from "@/components/Logo";

export function AuthShell({
  children,
  panelTitle,
  panelBody,
  backTo = "/portal",
  side = "teal",
}: {
  children: ReactNode;
  panelTitle: string;
  panelBody: string;
  backTo?: string;
  side?: "teal" | "ink";
}) {
  return (
    <div className="grid min-h-screen grid-cols-1 lg:grid-cols-2">
      <div className={`relative hidden flex-col justify-between overflow-hidden p-12 text-white lg:flex ${side === "teal" ? "bg-teal-900" : "bg-ink-900"}`}>
        <div className="pointer-events-none absolute -top-24 -left-24 h-96 w-96 rounded-full bg-teal-500/20 blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 right-0 h-72 w-72 rounded-full bg-terracotta-500/20 blur-3xl" />

        <Link to="/" className="relative flex items-center gap-2.5">
          <PracticeMark size={34} />
          <span className="font-display text-lg font-semibold">Simmons Medical Practice</span>
        </Link>

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="relative max-w-md">
          <h2 className="font-display text-4xl font-semibold leading-tight text-balance">{panelTitle}</h2>
          <p className="mt-4 text-[15px] leading-relaxed text-white/65 text-balance">{panelBody}</p>
        </motion.div>

        <div className="relative flex items-center gap-2 text-[13px] text-white/50">
          <ShieldCheck size={16} />
          Australian-hosted &amp; encrypted, always.
        </div>
      </div>

      <div className="flex flex-col justify-center px-6 py-12 sm:px-12 lg:px-16">
        <div className="mx-auto w-full max-w-sm">
          <div className="mb-8 flex items-center justify-between lg:hidden">
            <Link to="/" className="flex items-center gap-2">
              <PracticeMark size={30} />
              <span className="font-display text-[15px] font-semibold text-ink-900">Simmons Medical</span>
            </Link>
          </div>
          <Link to={backTo} className="mb-8 inline-flex items-center gap-1.5 text-[13px] font-medium text-ink-500 hover:text-ink-800">
            <ArrowLeft size={14} /> Back
          </Link>
          {children}
        </div>
      </div>
    </div>
  );
}
