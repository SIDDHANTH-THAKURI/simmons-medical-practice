import { useState } from "react";
import { motion } from "framer-motion";
import {
  Cloud, HardDrive, Laptop, Network, Printer, Router, ShieldCheck, Stethoscope, Users, Wifi,
} from "lucide-react";
import { DiagramCanvas, DiagramEdge, DiagramNode, EdgeLayer, elbowPath } from "./diagramPrimitives";
import { cn } from "@/lib/utils";

const ROOMS = [
  { area: "reception", name: "Waiting Room / Reception", ap: "Admin AP", zone: "admin" },
  { area: "room1", name: "Consulting Room 1", ap: "Clinical AP", zone: "clinical" },
  { area: "room2", name: "Consulting Room 2", ap: "Clinical AP", zone: "clinical" },
  { area: "nurse", name: "Nurse / Treatment Room", ap: "Admin AP", zone: "admin" },
  { area: "comms", name: "Server / Comms Cupboard", ap: "UDM-Pro + Switch", zone: "infra" },
  { area: "room3", name: "Consulting Room 3", ap: "Clinical AP", zone: "clinical" },
  { area: "office", name: "Dr Simmons' Office", ap: "Admin AP", zone: "admin" },
  { area: "corridor", name: "Corridor", ap: "", zone: "corridor" },
  { area: "specialist", name: "Specialist Room (visiting)", ap: "Clinical AP", zone: "clinical" },
];

const ZONE_STYLE: Record<string, string> = {
  admin: "bg-terracotta-50 border-terracotta-200",
  clinical: "bg-teal-50 border-teal-200",
  infra: "bg-ink-100 border-ink-300",
  corridor: "bg-cream-100 border-cream-300 border-dashed",
};

function PhysicalLayout() {
  return (
    <div>
      <div
        className="grid gap-2.5 sm:gap-3"
        style={{
          gridTemplateColumns: "repeat(3, 1fr)",
          gridTemplateRows: "repeat(3, 1fr)",
          gridTemplateAreas: "'reception room1 room2' 'nurse comms room3' 'office corridor specialist'",
        }}
      >
        {ROOMS.map((r, i) => (
          <motion.div
            key={r.area}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            style={{ gridArea: r.area }}
            className={cn("flex min-h-[92px] flex-col items-center justify-center rounded-xl border p-3 text-center", ZONE_STYLE[r.zone])}
          >
            <p className="text-[12px] font-semibold leading-tight text-ink-800">{r.name}</p>
            {r.ap && (
              <p className="mt-1.5 flex items-center gap-1 text-[10.5px] text-ink-500">
                <Wifi size={11} /> {r.ap}
              </p>
            )}
          </motion.div>
        ))}
      </div>
      <div className="mt-4 flex flex-wrap gap-4 text-[11.5px] text-ink-500">
        <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-sm bg-teal-200 border border-teal-300" /> Clinical zone</span>
        <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-sm bg-terracotta-100 border border-terracotta-200" /> Admin zone</span>
        <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-sm bg-ink-100 border border-ink-300" /> Infrastructure</span>
      </div>
      <p className="mt-3 text-[11px] text-ink-400">Ground floor, indicative — not to scale, rooms inferred from the practice brief.</p>
    </div>
  );
}

function LogicalTopology() {
  return (
    <div className="overflow-x-auto">
      <DiagramCanvas>
        <EdgeLayer>
          <DiagramEdge id="net-e1" d={elbowPath(22, 12, 46, 12)} color="var(--color-ink-300)" />
          <DiagramEdge id="net-e2" d={elbowPath(46, 12, 46, 40)} color="var(--color-ink-300)" />
          <DiagramEdge id="net-e3" d={elbowPath(46, 50, 46, 70)} color="var(--color-ink-300)" />
          <DiagramEdge id="net-e4" d={elbowPath(46, 40, 78, 22)} color="var(--color-teal-500)" />
          <DiagramEdge id="net-e5" d={elbowPath(46, 40, 78, 40)} color="var(--color-teal-500)" />
          <DiagramEdge id="net-e6" d={elbowPath(46, 40, 78, 58)} color="var(--color-terracotta-400)" />
          <DiagramEdge id="net-e7" d={elbowPath(46, 40, 78, 76)} color="var(--color-ink-300)" />
          <DiagramEdge id="net-e8" d={elbowPath(78, 22, 122, 15)} color="var(--color-teal-500)" dotDelay={0.4} />
          <DiagramEdge id="net-e9" d={elbowPath(78, 22, 122, 30)} color="var(--color-teal-500)" dotDelay={0.7} />
          <DiagramEdge id="net-e10" d={elbowPath(78, 40, 122, 50)} color="var(--color-terracotta-400)" dotDelay={0.3} />
          <DiagramEdge id="net-e11" d={elbowPath(78, 40, 122, 65)} color="var(--color-terracotta-400)" dotDelay={0.6} />
          <DiagramEdge id="net-e12" d={elbowPath(78, 58, 122, 82)} color="var(--color-ink-300)" dashed />
          <DiagramEdge id="net-e13" d={elbowPath(46, 70, 78, 88)} color="var(--color-chart-1)" dashed />
        </EdgeLayer>

        <DiagramNode x={22} y={12} icon={Cloud} label="Internet (ISP)" sublabel="WAN" color="var(--color-ink-500)" />
        <DiagramNode x={46} y={12} icon={Router} label="UniFi Dream Machine Pro" sublabel="10.10.0.1 · Firewall/Router" color="var(--color-teal-700)" delay={0.1} />
        <DiagramNode x={46} y={40} icon={Network} label="UniFi Switch Lite 8 PoE" sublabel="10.10.40.2" color="var(--color-teal-700)" delay={0.15} />
        <DiagramNode x={46} y={70} icon={HardDrive} label="NAS" sublabel="10.10.40.20 · VLAN 40" color="var(--color-ink-600)" delay={0.2} />

        <DiagramNode x={78} y={22} icon={Wifi} label="U6-LR — Clinical Wing" sublabel="10.10.40.10" color="var(--color-teal-600)" delay={0.3} />
        <DiagramNode x={78} y={40} icon={Wifi} label="U6-LR — Reception/Admin" sublabel="10.10.40.11" color="var(--color-terracotta-500)" delay={0.35} />
        <DiagramNode x={78} y={58} icon={ShieldCheck} label="Guest Wi-Fi" sublabel="Isolated · VLAN 30" color="var(--color-ink-400)" delay={0.4} />
        <DiagramNode x={78} y={88} icon={Cloud} label="Offsite Cloud Backup" sublabel="Encrypted, AU region" color="var(--color-chart-1)" delay={0.45} />

        <DiagramNode x={128} y={12} icon={Stethoscope} label="GP 1 – 3" sublabel="VLAN 10 · .11–.13" color="var(--color-teal-600)" delay={0.5} />
        <DiagramNode x={128} y={30} icon={Stethoscope} label="Specialist" sublabel="VLAN 10 · .14" color="var(--color-teal-600)" delay={0.55} />
        <DiagramNode x={128} y={50} icon={Users} label="Reception 1–2" sublabel="VLAN 20 · .11–.12" color="var(--color-terracotta-500)" delay={0.6} />
        <DiagramNode x={128} y={65} icon={Printer} label="Printer / Nurse" sublabel="VLAN 20 · .13–.14" color="var(--color-terracotta-500)" delay={0.65} />
        <DiagramNode x={128} y={82} icon={Laptop} label="Patient devices" sublabel="VLAN 30 · DHCP only" color="var(--color-ink-400)" delay={0.7} />
      </DiagramCanvas>
    </div>
  );
}

export function NetworkDiagram() {
  const [tab, setTab] = useState<"physical" | "logical">("logical");
  return (
    <div>
      <div className="inline-flex rounded-xl bg-cream-100 p-1">
        {(["logical", "physical"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={cn("rounded-lg px-4 py-2 text-[13px] font-semibold capitalize", tab === t ? "bg-white text-ink-900 shadow-sm" : "text-ink-500")}
          >
            {t === "logical" ? "Network diagram" : "Physical layout"}
          </button>
        ))}
      </div>
      <div className="mt-6">{tab === "logical" ? <LogicalTopology /> : <PhysicalLayout />}</div>
    </div>
  );
}
