import {
  Bot, CalendarCheck2, CircleUserRound, Info, LayoutDashboard, MessageCircleQuestion,
  PhoneForwarded, RefreshCcw, Send, Users2, Repeat, Workflow, TrendingUp, CheckCircle2, ArrowUpRight,
} from "lucide-react";
import { DiagramCanvas, DiagramEdge, DiagramNode, EdgeLayer, elbowPath } from "./diagramPrimitives";

const LENSES = [
  { icon: Workflow, title: "Workflow", body: "Sits inside existing HotDoc / Best Practice screens — no new system for staff to learn." },
  { icon: Repeat, title: "Automation", body: "Reminders, recalls and no-show scoring run on a schedule, not on staff initiative." },
  { icon: TrendingUp, title: "Scalability", body: "Same data foundation supports more practitioners or a second site without a redesign." },
];

const LIVE = ["AI Virtual Patient Assistant", "Appointment booking", "FAQs & patient enquiries", "Appointment reminders", "Care navigation"];
const FUTURE = ["Ambient clinical scribing", "Billing & coding assistance", "No-show prediction", "Chronic disease recall automation"];

export function AiFlowDiagram() {
  return (
    <div>
      <div className="overflow-x-auto">
        <DiagramCanvas>
          <EdgeLayer>
            <DiagramEdge id="ai-e0" d={elbowPath(24, 50, 48, 50)} color="var(--color-teal-500)" />
            <DiagramEdge id="ai-e1" d={elbowPath(62, 50, 100, 8)} color="var(--color-ink-300)" dotDelay={0.1} />
            <DiagramEdge id="ai-e2" d={elbowPath(62, 50, 100, 25)} color="var(--color-ink-300)" dotDelay={0.2} />
            <DiagramEdge id="ai-e3" d={elbowPath(62, 50, 100, 42)} color="var(--color-terracotta-400)" dotDelay={0.3} />
            <DiagramEdge id="ai-e4" d={elbowPath(62, 50, 100, 59)} color="var(--color-terracotta-400)" dotDelay={0.4} />
            <DiagramEdge id="ai-e5" d={elbowPath(62, 50, 100, 76)} color="var(--color-terracotta-400)" dotDelay={0.5} />
            <DiagramEdge id="ai-e6" d={elbowPath(62, 50, 100, 92)} color="var(--color-chart-8)" dotDelay={0.6} />

            <DiagramEdge id="ai-e7" d={elbowPath(120, 42, 158, 46)} color="var(--color-terracotta-400)" dotDelay={0.7} />
            <DiagramEdge id="ai-e8" d={elbowPath(120, 59, 158, 50)} color="var(--color-terracotta-400)" dotDelay={0.8} />
            <DiagramEdge id="ai-e9" d={elbowPath(120, 76, 158, 54)} color="var(--color-terracotta-400)" dotDelay={0.9} />
            <DiagramEdge id="ai-e10" d={elbowPath(120, 92, 158, 88)} color="var(--color-chart-8)" dotDelay={1} />
          </EdgeLayer>

          <DiagramNode x={22} y={50} icon={CircleUserRound} label="Patient" color="var(--color-teal-700)" />
          <DiagramNode x={55} y={50} w={30} icon={Bot} label="AI Assistant" sublabel="intent → action" color="var(--color-terracotta-500)" delay={0.1} />

          <DiagramNode x={112} y={8} icon={MessageCircleQuestion} label="Answers enquiries" color="var(--color-ink-500)" delay={0.2} />
          <DiagramNode x={112} y={25} icon={Info} label="Clinic information" color="var(--color-ink-500)" delay={0.25} />
          <DiagramNode x={112} y={42} icon={CalendarCheck2} label="Books appointments" color="var(--color-terracotta-500)" delay={0.3} />
          <DiagramNode x={112} y={59} icon={RefreshCcw} label="Reschedules / cancels" color="var(--color-terracotta-500)" delay={0.35} />
          <DiagramNode x={112} y={76} icon={Send} label="Sends reminders" color="var(--color-terracotta-500)" delay={0.4} />
          <DiagramNode x={112} y={92} icon={PhoneForwarded} label="Escalates complex cases" color="var(--color-chart-8)" delay={0.45} />

          <DiagramNode x={172} y={50} w={36} icon={LayoutDashboard} label="Patient Management System" color="var(--color-teal-700)" delay={0.55} />
          <DiagramNode x={172} y={90} w={36} icon={Users2} label="Reception / Clinical Staff" color="var(--color-chart-8)" delay={0.6} />
        </DiagramCanvas>
      </div>

      <div className="mt-2 flex items-start gap-2 rounded-xl bg-teal-50 p-3.5 text-[12px] text-teal-800">
        <CheckCircle2 size={15} className="mt-0.5 shrink-0" />
        Human-in-the-loop by design: every AI output is reviewed by clinical or admin staff before it reaches a patient record or claim.
      </div>

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {LENSES.map((l) => (
          <div key={l.title} className="rounded-2xl border border-ink-900/8 bg-white p-5">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-teal-50 text-teal-700"><l.icon size={17} /></span>
            <p className="mt-3 text-[13.5px] font-semibold text-ink-900">{l.title}</p>
            <p className="mt-1 text-[12.5px] leading-relaxed text-ink-500">{l.body}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-teal-200 bg-teal-50/50 p-5">
          <p className="flex items-center gap-1.5 text-[13px] font-semibold text-teal-800"><CheckCircle2 size={15} /> Live in this prototype</p>
          <ul className="mt-3 space-y-2">
            {LIVE.map((item) => (
              <li key={item} className="flex items-center gap-2 text-[13px] text-ink-700"><span className="h-1.5 w-1.5 rounded-full bg-teal-600" /> {item}</li>
            ))}
          </ul>
        </div>
        <div className="rounded-2xl border border-ink-900/8 bg-white p-5">
          <p className="flex items-center gap-1.5 text-[13px] font-semibold text-ink-700"><ArrowUpRight size={15} /> Future enhancements</p>
          <ul className="mt-3 space-y-2">
            {FUTURE.map((item) => (
              <li key={item} className="flex items-center gap-2 text-[13px] text-ink-500"><span className="h-1.5 w-1.5 rounded-full bg-ink-300" /> {item}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
