import { useState } from "react";
import { motion } from "framer-motion";
import { DiagramCanvas, DiagramEdge, EdgeLayer, pctX, pctY, straightPath, VB_W } from "./diagramPrimitives";
import { cn } from "@/lib/utils";

interface Entity {
  id: string;
  name: string;
  x: number;
  y: number;
  w: number;
  color: string;
  fields: { name: string; tag?: "PK" | "FK" }[];
}

const ENTITIES: Entity[] = [
  { id: "ROLE", name: "ROLE", x: 20, y: 10, w: 34, color: "var(--color-chart-7)", fields: [{ name: "role_id", tag: "PK" }, { name: "role_name" }] },
  { id: "APP_USER", name: "APP_USER", x: 72, y: 8, w: 36, color: "var(--color-chart-7)", fields: [{ name: "user_id", tag: "PK" }, { name: "role_id", tag: "FK" }, { name: "provider_id", tag: "FK" }] },
  { id: "CLAIM", name: "CLAIM", x: 178, y: 10, w: 36, color: "var(--color-terracotta-500)", fields: [{ name: "claim_id", tag: "PK" }, { name: "mbs_item" }, { name: "claim_status" }] },
  { id: "PROVIDER", name: "PROVIDER", x: 18, y: 48, w: 34, color: "var(--color-teal-700)", fields: [{ name: "provider_id", tag: "PK" }, { name: "is_partner" }, { name: "is_segregated" }] },
  { id: "PATIENT", name: "PATIENT", x: 74, y: 48, w: 34, color: "var(--color-teal-600)", fields: [{ name: "patient_id", tag: "PK" }, { name: "medicare_number" }] },
  { id: "APPOINTMENT", name: "APPOINTMENT", x: 128, y: 26, w: 40, color: "var(--color-chart-1)", fields: [{ name: "appointment_id", tag: "PK" }, { name: "scheduled_datetime" }, { name: "status" }] },
  { id: "REMINDER", name: "REMINDER", x: 178, y: 40, w: 36, color: "var(--color-chart-3)", fields: [{ name: "reminder_id", tag: "PK" }, { name: "channel" }, { name: "send_status" }] },
  { id: "DOCUMENT", name: "DOCUMENT", x: 128, y: 58, w: 38, color: "var(--color-ink-500)", fields: [{ name: "document_id", tag: "PK" }, { name: "doc_type" }, { name: "storage_uri" }] },
  { id: "SHARED_COST", name: "SHARED_COST", x: 74, y: 86, w: 36, color: "var(--color-amber-500)", fields: [{ name: "cost_id", tag: "PK" }, { name: "paid_by", tag: "FK" }, { name: "amount" }] },
  { id: "COST_ALLOCATION", name: "COST_ALLOCATION", x: 128, y: 86, w: 42, color: "var(--color-amber-500)", fields: [{ name: "allocation_id", tag: "PK" }, { name: "provider_id", tag: "FK" }, { name: "allocated_amount" }] },
];

const RELATIONSHIPS: { from: string; to: string; label: string }[] = [
  { from: "ROLE", to: "APP_USER", label: "grants" },
  { from: "APP_USER", to: "PROVIDER", label: "linked to" },
  { from: "PROVIDER", to: "PATIENT", label: "registers" },
  { from: "PROVIDER", to: "APPOINTMENT", label: "delivers" },
  { from: "PATIENT", to: "APPOINTMENT", label: "books" },
  { from: "APPOINTMENT", to: "CLAIM", label: "generates" },
  { from: "APPOINTMENT", to: "REMINDER", label: "triggers" },
  { from: "PATIENT", to: "DOCUMENT", label: "has" },
  { from: "PROVIDER", to: "SHARED_COST", label: "pays" },
  { from: "SHARED_COST", to: "COST_ALLOCATION", label: "split into" },
  { from: "COST_ALLOCATION", to: "PROVIDER", label: "owes" },
];

const byId = Object.fromEntries(ENTITIES.map((e) => [e.id, e]));

export function DatabaseDiagram() {
  const [active, setActive] = useState<string | null>(null);

  const connected = new Set<string>();
  if (active) {
    RELATIONSHIPS.forEach((r) => {
      if (r.from === active) connected.add(r.to);
      if (r.to === active) connected.add(r.from);
    });
  }

  return (
    <div>
      <p className="mb-4 text-[12.5px] text-ink-500">Hover an entity to trace its relationships. Designed by the project's Backend Developer.</p>
      <div className="overflow-x-auto">
        <DiagramCanvas>
          <EdgeLayer>
            {RELATIONSHIPS.map((r, i) => {
              const a = byId[r.from];
              const b = byId[r.to];
              const isDim = active && !(r.from === active || r.to === active);
              return (
                <g key={i} opacity={isDim ? 0.15 : 1}>
                  <DiagramEdge id={`db-e${i}`} d={straightPath(a.x, a.y, b.x, b.y)} color="var(--color-ink-300)" animated={!isDim} dotDelay={i * 0.15} />
                </g>
              );
            })}
          </EdgeLayer>

          {RELATIONSHIPS.map((r, i) => {
            const a = byId[r.from];
            const b = byId[r.to];
            const mx = (a.x + b.x) / 2;
            const my = (a.y + b.y) / 2;
            const isDim = active && !(r.from === active || r.to === active);
            return (
              <div
                key={i}
                className={cn("absolute -translate-x-1/2 -translate-y-1/2 whitespace-nowrap rounded-md border border-ink-900/8 bg-cream-50 px-1.5 py-0.5 text-[8.5px] font-medium text-ink-500 transition-opacity", isDim && "opacity-0")}
                style={{ left: pctX(mx), top: pctY(my) }}
              >
                {r.label}
              </div>
            );
          })}

          {ENTITIES.map((e, i) => {
            const isDim = active && active !== e.id && !connected.has(e.id);
            return (
              <motion.div
                key={e.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: isDim ? 0.25 : 1, y: 0 }}
                transition={{ duration: 0.35, delay: i * 0.04 }}
                onMouseEnter={() => setActive(e.id)}
                onMouseLeave={() => setActive(null)}
                className="absolute -translate-x-1/2 -translate-y-1/2 cursor-default overflow-hidden rounded-lg border border-ink-900/10 bg-white shadow-[var(--shadow-card)]"
                style={{ left: pctX(e.x), top: pctY(e.y), width: `${(e.w / VB_W) * 100}%` }}
              >
                <div className="px-2 py-1 text-center text-[9.5px] font-bold tracking-wide text-white" style={{ backgroundColor: e.color }}>
                  {e.name}
                </div>
                <div className="divide-y divide-ink-900/6">
                  {e.fields.map((f) => (
                    <div key={f.name} className="flex items-center justify-between gap-1.5 px-2 py-[3px]">
                      <span className={cn("truncate text-[8.5px]", f.tag === "PK" ? "font-bold text-ink-900" : "text-ink-600")}>{f.name}</span>
                      {f.tag && <span className="shrink-0 text-[7px] font-bold text-ink-300">{f.tag}</span>}
                    </div>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </DiagramCanvas>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="rounded-xl bg-cream-100 p-4">
          <p className="text-[12.5px] font-semibold text-ink-800">Role-based access, in the schema</p>
          <p className="mt-1 text-[12px] text-ink-600">is_partner / is_segregated on PROVIDER drive exactly what a signed-in role can query — access enforced by the database, not the screen.</p>
        </div>
        <div className="rounded-xl bg-amber-50 p-4">
          <p className="text-[12.5px] font-semibold text-amber-800">New: GP cost-sharing</p>
          <p className="mt-1 text-[12px] text-ink-600">SHARED_COST and COST_ALLOCATION track equipment costs Dr Simmons pays upfront and what each GP owes back.</p>
        </div>
      </div>
    </div>
  );
}
