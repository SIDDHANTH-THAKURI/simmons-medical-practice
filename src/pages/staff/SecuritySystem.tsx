import { useMemo, useState } from "react";
import {
  Cloud, Fingerprint, Lock, PrinterCheck, RadioTower, ScrollText, ShieldAlert, ShieldCheck, Wrench,
} from "lucide-react";
import { useAppStore } from "@/store/useAppStore";
import { useModuleAccess } from "@/store/useCurrentUser";
import { AccessRestricted } from "@/components/ui/EmptyState";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { roleLabels } from "@/data/permissions";
import { formatDateTime } from "@/lib/utils";

const CONTROLS = [
  { icon: Cloud, label: "Hosting", detail: "Cloud, Australian region" },
  { icon: Lock, label: "Encryption", detail: "At rest and in transit" },
  { icon: ShieldCheck, label: "Backups", detail: "3-2-1, restore-tested regularly" },
  { icon: RadioTower, label: "Redundancy", detail: "Automatic failover active" },
  { icon: ShieldAlert, label: "Ransomware Protection", detail: "Endpoint plus immutable backups" },
  { icon: Wrench, label: "Patching", detail: "OS and clinical software current" },
  { icon: Fingerprint, label: "Remote Access", detail: "Multi-factor, no local copies" },
  { icon: PrinterCheck, label: "Secure Printing", detail: "Badge release, no unclaimed prints" },
  { icon: ScrollText, label: "Breach Monitoring", detail: "Access logging and alerts" },
];

export default function SecuritySystem() {
  const level = useModuleAccess("securityUsers");
  const auditLog = useAppStore((s) => s.auditLog);
  const [query, setQuery] = useState("");

  const filtered = useMemo(
    () =>
      auditLog.filter(
        (a) =>
          a.actorName.toLowerCase().includes(query.toLowerCase()) ||
          a.target.toLowerCase().includes(query.toLowerCase()) ||
          a.module.toLowerCase().includes(query.toLowerCase())
      ),
    [auditLog, query]
  );

  if (level === "none") return <AccessRestricted moduleName="Security & System" />;

  return (
    <div>
      <h1 className="font-display text-3xl font-semibold text-ink-900">Security &amp; System</h1>
      <p className="mt-1.5 text-[14px] text-ink-500">Nine controls, running today — plus every record view, logged.</p>

      <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
        {CONTROLS.map((c) => (
          <div key={c.label} className="flex items-center gap-3 rounded-xl border border-ink-900/8 bg-white p-4">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-teal-50 text-teal-700">
              <c.icon size={16} strokeWidth={1.75} />
            </span>
            <span className="min-w-0">
              <span className="flex items-center gap-1.5 text-[13px] font-medium text-ink-800">
                {c.label} <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#0ca30c]" />
              </span>
              <span className="block truncate text-[11.5px] text-ink-500">{c.detail}</span>
            </span>
          </div>
        ))}
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card className="p-5">
          <p className="text-[13px] font-semibold text-ink-700">Record retention</p>
          <p className="mt-1 text-[12.5px] text-ink-500">7 years · 25 years for minors, per Qld Health / RANZCP guidance.</p>
        </Card>
        <Card className="p-5">
          <p className="text-[13px] font-semibold text-ink-700">Notifiable Data Breaches</p>
          <p className="mt-1 text-[12.5px] text-ink-500">Scheme applies regardless of turnover — health providers always covered (OAIC).</p>
        </Card>
        <Card className="p-5">
          <p className="text-[13px] font-semibold text-ink-700">Data residency</p>
          <p className="mt-1 text-[12.5px] text-ink-500">Patient data never leaves Australian jurisdiction.</p>
        </Card>
      </div>

      <div className="mt-8 flex items-center justify-between">
        <p className="text-[15px] font-semibold text-ink-900">Live audit log</p>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by person, module or record…"
          className="h-9 w-64 rounded-lg border border-ink-900/12 bg-white px-3 text-[12.5px] placeholder:text-ink-300 focus:outline-none focus:ring-2 focus:ring-teal-500/30"
        />
      </div>
      <p className="mt-1 text-[12px] text-ink-400">Every view is logged against the signed-in user — not just who has access, but who looked, when. Navigate the portal and watch this list grow.</p>

      <div className="mt-4 max-h-[32rem] overflow-y-auto rounded-2xl border border-ink-900/8 bg-white">
        <div className="divide-y divide-ink-900/6">
          {filtered.slice(0, 120).map((a) => (
            <div key={a.id} className="flex items-center justify-between gap-3 px-5 py-3 font-mono text-[12px]">
              <div className="flex min-w-0 items-center gap-3">
                <span className="shrink-0 text-ink-400">{formatDateTime(a.timestamp)}</span>
                <span className="truncate text-ink-800">
                  <span className="font-semibold">{a.actorName}</span> <span className="text-ink-500">{a.action}:</span> {a.target}
                </span>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <Badge variant="neutral" className="font-sans capitalize">{roleLabels[a.actorRole as keyof typeof roleLabels] ?? a.actorRole}</Badge>
                <Badge variant="brand" className="font-sans capitalize">{a.module}</Badge>
              </div>
            </div>
          ))}
        </div>
        {filtered.length === 0 && <p className="px-5 py-10 text-center text-[13px] text-ink-400">No matching activity.</p>}
      </div>
    </div>
  );
}
