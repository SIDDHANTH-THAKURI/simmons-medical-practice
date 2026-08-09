import { Link } from "react-router-dom";
import { CalendarCheck2, CheckCircle2, Clock, FlaskConical, ShieldCheck, Users2 } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Avatar } from "@/components/ui/Avatar";
import { StatTile } from "@/components/ui/StatTile";
import { EmptyState } from "@/components/ui/EmptyState";
import { useAppStore } from "@/store/useAppStore";
import type { StaffUser } from "@/types";
import { formatTime } from "@/lib/utils";

function isToday(iso: string) {
  const d = new Date(iso);
  const n = new Date();
  return d.toDateString() === n.toDateString();
}

export function ClinicianDashboard({ staff }: { staff: StaffUser }) {
  const appointments = useAppStore((s) => s.appointments);
  const patients = useAppStore((s) => s.patients);
  const documents = useAppStore((s) => s.documents);

  const today = appointments
    .filter((a) => a.providerId === staff.providerId && isToday(a.scheduledAt) && a.status !== "cancelled")
    .sort((a, b) => new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime());

  const completed = today.filter((a) => a.status === "completed").length;
  const next = today.find((a) => ["confirmed", "pending"].includes(a.status) && new Date(a.scheduledAt) > new Date());
  const myResults = documents.filter((d) => d.providerId === staff.providerId && d.flaggedForReview).slice(0, 5);

  function patientName(id: string) {
    const p = patients.find((pt) => pt.id === id);
    return p ? `${p.firstName} ${p.lastName}` : "Unknown patient";
  }

  return (
    <div className="space-y-6">
      {staff.segregated && (
        <div className="flex items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-[13px] text-amber-800">
          <ShieldCheck size={16} /> Segregated access — you're only seeing your own patients, as a visiting specialist.
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatTile label="Today's patients" value={String(today.length)} icon={<Users2 size={16} />} accent="var(--color-teal-600)" />
        <StatTile label="Completed so far" value={String(completed)} icon={<CheckCircle2 size={16} />} accent="var(--color-chart-3)" />
        <StatTile label="Results to review" value={String(myResults.length)} icon={<FlaskConical size={16} />} accent="var(--color-terracotta-500)" />
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <div className="flex items-center justify-between p-5 pb-0">
            <p className="text-[15px] font-semibold text-ink-900">Today's schedule</p>
            <Link to="/staff/app/patients" className="text-[12.5px] font-semibold text-teal-700 hover:text-teal-900">Patient records</Link>
          </div>
          <div className="divide-y divide-ink-900/6 p-5 pt-3">
            {today.map((a) => (
              <div key={a.id} className="flex items-center justify-between py-3">
                <div className="flex items-center gap-3">
                  <Avatar name={patientName(a.patientId)} size={34} />
                  <div>
                    <p className="text-[13.5px] font-medium text-ink-900">{patientName(a.patientId)}</p>
                    <p className="text-[12px] text-ink-500">{a.reason}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1 text-[12.5px] text-ink-500"><Clock size={12} /> {formatTime(a.scheduledAt)}</span>
                  <Badge variant={a.status === "completed" ? "neutral" : a.status === "confirmed" ? "good" : "warning"}>{a.status}</Badge>
                </div>
              </div>
            ))}
            {today.length === 0 && <EmptyState icon={<CalendarCheck2 size={28} strokeWidth={1.5} />} title="No appointments today" description="Enjoy the quiet one." />}
          </div>
        </Card>

        <Card>
          <div className="p-5 pb-0">
            <p className="text-[15px] font-semibold text-ink-900">Awaiting your review</p>
          </div>
          <div className="space-y-2.5 p-5">
            {myResults.map((d) => (
              <Link key={d.id} to="/staff/app/results" className="flex items-center justify-between rounded-xl bg-cream-50 p-3 hover:bg-cream-100">
                <div>
                  <p className="text-[12.5px] font-medium text-ink-800">{d.title}</p>
                  <p className="text-[11px] text-ink-400">{patientName(d.patientId)}</p>
                </div>
                <Badge variant="warning">New</Badge>
              </Link>
            ))}
            {myResults.length === 0 && <p className="py-6 text-center text-[13px] text-ink-400">Nothing waiting on you.</p>}
          </div>
        </Card>
      </div>

      {next && (
        <Card className="border-teal-200 bg-teal-50/50">
          <div className="flex flex-wrap items-center justify-between gap-3 p-5">
            <div>
              <p className="text-[12px] font-semibold uppercase tracking-wider text-teal-700">Up next</p>
              <p className="mt-1 text-[15px] font-semibold text-ink-900">{patientName(next.patientId)} · {next.reason}</p>
            </div>
            <span className="text-[16px] font-semibold text-teal-800 tabular-nums">{formatTime(next.scheduledAt)}</span>
          </div>
        </Card>
      )}
    </div>
  );
}
