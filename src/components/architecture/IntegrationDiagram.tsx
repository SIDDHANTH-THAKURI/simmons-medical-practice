import { Database, LayoutDashboard, Receipt, Smartphone, Workflow } from "lucide-react";
import { DiagramCanvas, DiagramEdge, DiagramNode, EdgeLabel, EdgeLayer, elbowPath, straightPath } from "./diagramPrimitives";

export function IntegrationDiagram() {
  return (
    <div>
      <div className="overflow-x-auto">
        <DiagramCanvas>
          <EdgeLayer>
            <DiagramEdge id="int-e1" d={elbowPath(24, 20, 78, 46)} color="var(--color-teal-500)" />
            <DiagramEdge id="int-e2" d={elbowPath(24, 75, 78, 52)} color="var(--color-teal-500)" dotDelay={0.3} />
            <DiagramEdge id="int-e3" d={straightPath(94, 48, 94, 78)} color="var(--color-ink-400)" dotDelay={0.5} />
            <DiagramEdge id="int-e4" d={elbowPath(108, 42, 150, 18)} color="var(--color-chart-1)" dotDelay={0.2} />
            <DiagramEdge id="int-e5" d={elbowPath(108, 50, 150, 50)} color="var(--color-terracotta-400)" dotDelay={0.6} />
            <DiagramEdge id="int-e6" d={elbowPath(108, 56, 150, 82)} color="var(--color-chart-3)" dotDelay={0.8} />
            <DiagramEdge id="int-e7" d={straightPath(150, 24, 150, 42)} color="var(--color-ink-300)" dashed animated={false} />
          </EdgeLayer>

          <DiagramNode x={20} y={20} icon={Smartphone} label="Patient App" sublabel="booking, billing, chat" color="var(--color-teal-600)" />
          <DiagramNode x={20} y={75} icon={LayoutDashboard} label="Staff Portal" sublabel="records, claims, reports" color="var(--color-teal-600)" delay={0.05} />

          <DiagramNode x={90} y={48} w={38} icon={Workflow} label="Integration / API Layer" sublabel="one data model, no duplicate entry" color="var(--color-ink-700)" delay={0.15} />
          <DiagramNode x={94} y={85} icon={Database} label="Practice Database" sublabel="patients · appointments · claims" color="var(--color-ink-500)" delay={0.25} />

          <DiagramNode x={158} y={15} icon={LayoutDashboard} label="Best Practice Bp Premier" sublabel="clinical PMS" color="var(--color-chart-1)" delay={0.35} />
          <DiagramNode x={158} y={50} icon={Smartphone} label="HotDoc" sublabel="booking · SMS/email reminders" color="var(--color-terracotta-500)" delay={0.45} />
          <DiagramNode x={158} y={85} icon={Receipt} label="Xero" sublabel="accounting · reconciliation" color="var(--color-chart-3)" delay={0.55} />

          <EdgeLabel x={51} y={30} text="live booking sync" />
          <EdgeLabel x={129} y={30} text="clinical record" />
          <EdgeLabel x={129} y={58} text="reminders" />
          <EdgeLabel x={129} y={78} text="billing export" />
        </DiagramCanvas>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div className="rounded-xl bg-teal-50 p-4">
          <p className="text-[12.5px] font-semibold text-teal-800">One entry point</p>
          <p className="mt-1 text-[12px] text-ink-600">A booking made in the patient app or by reception lands in the same record — never re-typed.</p>
        </div>
        <div className="rounded-xl bg-terracotta-50 p-4">
          <p className="text-[12.5px] font-semibold text-terracotta-800">Reminders, automatic</p>
          <p className="mt-1 text-[12px] text-ink-600">HotDoc triggers SMS/email off the same appointment record — no separate list to maintain.</p>
        </div>
        <div className="rounded-xl bg-cream-100 p-4">
          <p className="text-[12.5px] font-semibold text-ink-700">Billing, reconciled</p>
          <p className="mt-1 text-[12px] text-ink-600">Claims and invoices export to Xero — reconciliation status is visible, not a monthly guessing game.</p>
        </div>
      </div>
    </div>
  );
}
