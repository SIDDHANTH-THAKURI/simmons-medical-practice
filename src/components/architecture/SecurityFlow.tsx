import { useState } from "react";
import { CheckCircle2, CircleSlash2, Cloud, Database, HardDrive, KeyRound, ShieldCheck, UserCheck } from "lucide-react";
import { motion } from "framer-motion";
import { DiagramCanvas, DiagramEdge, DiagramNode, EdgeLayer, elbowPath } from "./diagramPrimitives";
import { roleLabels } from "@/data/permissions";
import type { StaffRole } from "@/types";
import { cn } from "@/lib/utils";

const DEMO_ROLES: { role: StaffRole; module: string; allowed: boolean }[] = [
  { role: "owner", module: "Security & System", allowed: true },
  { role: "reception", module: "Security & System", allowed: false },
  { role: "nurse", module: "Claims & Billing", allowed: false },
  { role: "specialist", module: "Another GP's patient", allowed: false },
];

export function SecurityFlow() {
  const [demo, setDemo] = useState(0);
  const current = DEMO_ROLES[demo];

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-[12.5px] text-ink-500">Try a role below and watch how the query resolves.</p>
        <div className="flex flex-wrap gap-1.5">
          {DEMO_ROLES.map((d, i) => (
            <button
              key={i}
              onClick={() => setDemo(i)}
              className={cn("rounded-full px-3 py-1.5 text-[11.5px] font-medium", demo === i ? "bg-teal-800 text-white" : "bg-cream-100 text-ink-500 hover:bg-cream-200")}
            >
              {roleLabels[d.role]} → {d.module}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6 overflow-x-auto">
        <DiagramCanvas>
          <EdgeLayer>
            <DiagramEdge id="sec-e1" d={elbowPath(24, 50, 62, 50)} color="var(--color-ink-300)" />
            <DiagramEdge id="sec-e2" d={elbowPath(62, 50, 106, 50)} color="var(--color-ink-300)" dotDelay={0.3} />
            <DiagramEdge id="sec-e3" d={elbowPath(106, 50, 158, 26)} color={current.allowed ? "var(--color-status-good)" : "var(--color-ink-200)"} animated={current.allowed} dotDelay={0.6} />
            <DiagramEdge id="sec-e4" d={elbowPath(106, 50, 158, 74)} color={!current.allowed ? "var(--color-status-critical)" : "var(--color-ink-200)"} animated={!current.allowed} dotDelay={0.6} />
          </EdgeLayer>

          <DiagramNode x={24} y={50} icon={UserCheck} label={roleLabels[current.role]} sublabel="signs in" color="var(--color-teal-700)" />
          <DiagramNode x={62} y={50} icon={KeyRound} label="Role check" sublabel="permission matrix" color="var(--color-ink-600)" delay={0.1} />
          <DiagramNode x={106} y={50} icon={Database} label="Query filter" sublabel={current.module} color="var(--color-ink-600)" delay={0.2} />

          <motion.div key={demo + "-yes"} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <DiagramNode x={168} y={22} icon={CheckCircle2} label="Data returned" sublabel={current.allowed ? "access granted" : "n/a"} color={current.allowed ? "var(--color-status-good)" : "var(--color-ink-200)"} delay={0.3} />
          </motion.div>
          <motion.div key={demo + "-no"} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <DiagramNode x={168} y={78} icon={CircleSlash2} label="Empty result" sublabel={!current.allowed ? "access denied" : "n/a"} color={!current.allowed ? "var(--color-status-critical)" : "var(--color-ink-200)"} delay={0.3} />
          </motion.div>
        </DiagramCanvas>
      </div>

      <div className="mt-4 rounded-xl bg-cream-100 p-4 text-[12.5px] text-ink-600">
        {current.allowed ? (
          <span><span className="font-semibold text-[#006300]">Allowed</span> — {roleLabels[current.role]} has access, so the database query executes and returns real rows.</span>
        ) : (
          <span><span className="font-semibold text-terracotta-700">Blocked</span> — {roleLabels[current.role]} isn't permitted, so the query returns nothing. The screen never had data to hide.</span>
        )}
      </div>

      <div className="mt-10 border-t border-ink-900/8 pt-8">
        <p className="mb-4 flex items-center gap-1.5 text-[15px] font-semibold text-ink-900"><ShieldCheck size={16} /> 3-2-1 backup, always on</p>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-ink-900/8 bg-white p-5 text-center">
            <p className="font-display text-3xl font-semibold text-teal-800">3</p>
            <p className="mt-1 text-[12.5px] text-ink-500">copies of every record — production plus two backups</p>
            <div className="mt-3 flex justify-center gap-2 text-ink-400"><Database size={16} /><HardDrive size={16} /><Cloud size={16} /></div>
          </div>
          <div className="rounded-2xl border border-ink-900/8 bg-white p-5 text-center">
            <p className="font-display text-3xl font-semibold text-teal-800">2</p>
            <p className="mt-1 text-[12.5px] text-ink-500">different media types — local NAS and cloud storage</p>
            <div className="mt-3 flex justify-center gap-2 text-ink-400"><HardDrive size={16} /><Cloud size={16} /></div>
          </div>
          <div className="rounded-2xl border border-ink-900/8 bg-white p-5 text-center">
            <p className="font-display text-3xl font-semibold text-teal-800">1</p>
            <p className="mt-1 text-[12.5px] text-ink-500">copy offsite, encrypted, restore-tested regularly</p>
            <div className="mt-3 flex justify-center gap-2 text-ink-400"><Cloud size={16} /></div>
          </div>
        </div>
      </div>
    </div>
  );
}
