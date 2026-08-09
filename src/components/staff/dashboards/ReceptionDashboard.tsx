import { useState } from "react";
import { CalendarClock, CheckCircle2, PhoneCall, Timer, Users2 } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Avatar } from "@/components/ui/Avatar";
import { StatTile } from "@/components/ui/StatTile";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { useAppStore } from "@/store/useAppStore";
import { providerById } from "@/data/providers";
import { formatTime, cn } from "@/lib/utils";

function isToday(iso: string) {
  return new Date(iso).toDateString() === new Date().toDateString();
}

export function ReceptionDashboard() {
  const appointments = useAppStore((s) => s.appointments);
  const patients = useAppStore((s) => s.patients);
  const checkInAppointment = useAppStore((s) => s.checkInAppointment);
  const [channel, setChannel] = useState<"all" | "online" | "phone" | "ai-assistant" | "walk-in">("all");

  const today = appointments
    .filter((a) => isToday(a.scheduledAt) && a.status !== "cancelled")
    .sort((a, b) => new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime());

  const filtered = channel === "all" ? today : today.filter((a) => a.channel === channel);
  const checkedIn = today.filter((a) => a.checkedInAt).length;
  const waiting = today.filter((a) => !a.checkedInAt && ["confirmed", "pending"].includes(a.status) && new Date(a.scheduledAt) <= new Date()).length;

  function patientName(id: string) {
    const p = patients.find((pt) => pt.id === id);
    return p ? `${p.firstName} ${p.lastName}` : "Unknown";
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatTile label="Today's appointments" value={String(today.length)} icon={<Users2 size={16} />} accent="var(--color-teal-600)" />
        <StatTile label="Checked in" value={String(checkedIn)} icon={<CheckCircle2 size={16} />} accent="var(--color-chart-3)" />
        <StatTile label="Waiting on arrival" value={String(waiting)} icon={<Timer size={16} />} accent="var(--color-terracotta-500)" />
      </div>

      <Card>
        <div className="flex flex-wrap items-center justify-between gap-3 p-5 pb-0">
          <p className="text-[15px] font-semibold text-ink-900">Today's front desk queue</p>
          <div className="flex gap-1.5">
            {(["all", "online", "phone", "ai-assistant", "walk-in"] as const).map((c) => (
              <button
                key={c}
                onClick={() => setChannel(c)}
                className={cn("rounded-full px-3 py-1 text-[11.5px] font-medium capitalize", channel === c ? "bg-teal-800 text-white" : "bg-cream-100 text-ink-500")}
              >
                {c === "ai-assistant" ? "AI" : c}
              </button>
            ))}
          </div>
        </div>
        <div className="divide-y divide-ink-900/6 p-5 pt-3">
          {filtered.map((a) => (
            <div key={a.id} className="flex flex-wrap items-center justify-between gap-3 py-3">
              <div className="flex items-center gap-3">
                <Avatar name={patientName(a.patientId)} size={36} />
                <div>
                  <p className="text-[13.5px] font-medium text-ink-900">{patientName(a.patientId)}</p>
                  <p className="text-[12px] text-ink-500">{a.reason} · {providerById(a.providerId)?.shortName}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1 text-[12.5px] text-ink-500"><CalendarClock size={12} /> {formatTime(a.scheduledAt)}</span>
                <Badge variant="neutral" className="capitalize">{a.channel === "ai-assistant" ? "AI assistant" : a.channel}</Badge>
                {a.checkedInAt ? (
                  <Badge variant="good">Checked in</Badge>
                ) : a.status === "completed" ? (
                  <Badge variant="neutral">Seen</Badge>
                ) : (
                  <Button size="sm" variant="secondary" onClick={() => checkInAppointment(a.id)}>Check in</Button>
                )}
              </div>
            </div>
          ))}
          {filtered.length === 0 && <EmptyState icon={<PhoneCall size={28} strokeWidth={1.5} />} title="No appointments in this view" />}
        </div>
      </Card>
    </div>
  );
}
