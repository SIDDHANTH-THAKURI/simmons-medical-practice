import { Link } from "react-router-dom";
import { ClipboardList, RefreshCcw, Syringe, Users2 } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Avatar } from "@/components/ui/Avatar";
import { StatTile } from "@/components/ui/StatTile";
import { EmptyState } from "@/components/ui/EmptyState";
import { useAppStore } from "@/store/useAppStore";
import { providerById } from "@/data/providers";
import { formatDate, formatTime } from "@/lib/utils";

function isToday(iso: string) {
  return new Date(iso).toDateString() === new Date().toDateString();
}

export function NurseDashboard() {
  const appointments = useAppStore((s) => s.appointments);
  const patients = useAppStore((s) => s.patients);
  const recalls = useAppStore((s) => s.recalls);

  const today = appointments
    .filter((a) => isToday(a.scheduledAt) && a.status !== "cancelled")
    .sort((a, b) => new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime());

  const dueRecalls = recalls
    .filter((r) => r.status === "due" || r.status === "overdue")
    .sort((a) => (a.status === "overdue" ? -1 : 1));

  function patientName(id: string) {
    const p = patients.find((pt) => pt.id === id);
    return p ? `${p.firstName} ${p.lastName}` : "Unknown";
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatTile label="Patients through today" value={String(today.length)} icon={<Users2 size={16} />} accent="var(--color-teal-600)" />
        <StatTile label="Recalls due" value={String(dueRecalls.length)} icon={<RefreshCcw size={16} />} accent="var(--color-terracotta-500)" />
        <StatTile label="Immunisations today" value={String(today.filter((a) => a.type === "Immunisation").length)} icon={<Syringe size={16} />} accent="var(--color-chart-3)" />
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <Card>
          <div className="p-5 pb-0">
            <p className="text-[15px] font-semibold text-ink-900">Today's patients</p>
            <p className="text-[12.5px] text-ink-500">Across all providers</p>
          </div>
          <div className="divide-y divide-ink-900/6 p-5 pt-3">
            {today.slice(0, 10).map((a) => (
              <div key={a.id} className="flex items-center justify-between py-2.5">
                <div className="flex items-center gap-3">
                  <Avatar name={patientName(a.patientId)} size={32} />
                  <div>
                    <p className="text-[13px] font-medium text-ink-900">{patientName(a.patientId)}</p>
                    <p className="text-[11.5px] text-ink-400">{a.reason} · {providerById(a.providerId)?.shortName}</p>
                  </div>
                </div>
                <span className="text-[12px] text-ink-500 tabular-nums">{formatTime(a.scheduledAt)}</span>
              </div>
            ))}
            {today.length === 0 && <EmptyState icon={<ClipboardList size={28} strokeWidth={1.5} />} title="Nothing scheduled today" />}
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between p-5 pb-0">
            <p className="text-[15px] font-semibold text-ink-900">Recalls needing follow-up</p>
            <Link to="/staff/app/patients" className="text-[12.5px] font-semibold text-teal-700 hover:text-teal-900">Patient records</Link>
          </div>
          <div className="divide-y divide-ink-900/6 p-5 pt-3">
            {dueRecalls.slice(0, 10).map((r) => (
              <div key={r.id} className="flex items-center justify-between py-2.5">
                <div>
                  <p className="text-[13px] font-medium text-ink-900">{patientName(r.patientId)}</p>
                  <p className="text-[11.5px] text-ink-400">{r.type} · due {formatDate(r.dueDate)}</p>
                </div>
                <Badge variant={r.status === "overdue" ? "critical" : "warning"}>{r.status}</Badge>
              </div>
            ))}
            {dueRecalls.length === 0 && <p className="py-6 text-center text-[13px] text-ink-400">All recalls up to date.</p>}
          </div>
        </Card>
      </div>
    </div>
  );
}
