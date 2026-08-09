import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Bot, Database, Network, ShieldCheck, Workflow } from "lucide-react";
import { Container } from "@/components/Container";
import { PracticeLogo } from "@/components/Logo";
import { NetworkDiagram } from "@/components/architecture/NetworkDiagram";
import { IntegrationDiagram } from "@/components/architecture/IntegrationDiagram";
import { DatabaseDiagram } from "@/components/architecture/DatabaseDiagram";
import { SecurityFlow } from "@/components/architecture/SecurityFlow";
import { AiFlowDiagram } from "@/components/architecture/AiFlowDiagram";
import { cn } from "@/lib/utils";

const TABS = [
  { id: "network", label: "Network", icon: Network, blurb: "Segmented, redundant infrastructure across every room.", Comp: NetworkDiagram },
  { id: "integration", label: "Integration", icon: Workflow, blurb: "One data model behind booking, records and accounting.", Comp: IntegrationDiagram },
  { id: "database", label: "Database", icon: Database, blurb: "The entity model behind every system, access enforced at the query.", Comp: DatabaseDiagram },
  { id: "security", label: "Security", icon: ShieldCheck, blurb: "Role-based access and 3-2-1 backup, explained end to end.", Comp: SecurityFlow },
  { id: "ai", label: "AI Engineering", icon: Bot, blurb: "The virtual assistant's flow from patient message to action.", Comp: AiFlowDiagram },
] as const;

export default function SystemArchitecture() {
  const [params, setParams] = useSearchParams();
  const initial = TABS.find((t) => t.id === params.get("tab"))?.id ?? "network";
  const [active, setActive] = useState<string>(initial);

  useEffect(() => {
    const fromUrl = TABS.find((t) => t.id === params.get("tab"))?.id;
    if (fromUrl && fromUrl !== active) setActive(fromUrl);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params]);

  function selectTab(id: string) {
    setActive(id);
    setParams({ tab: id }, { replace: true });
  }

  const activeTab = TABS.find((t) => t.id === active) ?? TABS[0];

  return (
    <div className="min-h-screen bg-cream-50">
      <header className="border-b border-ink-900/8 bg-white/70 backdrop-blur">
        <Container className="flex h-16 items-center justify-between">
          <Link to="/"><PracticeLogo size={28} /></Link>
          <Link to="/" className="flex items-center gap-1.5 text-[13px] font-medium text-ink-500 hover:text-ink-800">
            <ArrowLeft size={14} /> Back to site
          </Link>
        </Container>
      </header>

      <Container className="py-10 lg:py-14">
        <p className="text-[13px] font-semibold uppercase tracking-wider text-terracotta-600">For the technically curious</p>
        <h1 className="mt-2 font-display text-4xl font-semibold text-ink-900 text-balance sm:text-5xl">System &amp; architecture</h1>
        <p className="mt-3 max-w-2xl text-[15.5px] text-ink-600 text-balance">
          How this portal actually works, visually — network, integrations, database, security and AI.
        </p>

        <div className="mt-8 flex gap-2 overflow-x-auto pb-1 no-scrollbar">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => selectTab(t.id)}
              className={cn(
                "flex shrink-0 items-center gap-2 rounded-xl border px-4 py-2.5 text-[13.5px] font-medium transition-colors",
                active === t.id ? "border-teal-700 bg-teal-800 text-white" : "border-ink-900/10 bg-white text-ink-600 hover:border-teal-300"
              )}
            >
              <t.icon size={16} /> {t.label}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="mt-8"
          >
            <div className="rounded-2xl border border-ink-900/8 bg-white p-6 sm:p-8">
              <div className="mb-6 flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-800 text-white">
                  <activeTab.icon size={18} />
                </span>
                <div>
                  <p className="text-[15px] font-semibold text-ink-900">{activeTab.label}</p>
                  <p className="text-[12.5px] text-ink-500">{activeTab.blurb}</p>
                </div>
              </div>
              <activeTab.Comp />
            </div>
          </motion.div>
        </AnimatePresence>
      </Container>
    </div>
  );
}
