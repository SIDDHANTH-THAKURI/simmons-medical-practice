import { Link } from "react-router-dom";
import { Bar, BarChart, CartesianGrid, Cell, LabelList, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts";
import { AlertTriangle, ArrowRight, CalendarCheck2, TrendingDown, TrendingUp, Users2 } from "lucide-react";
import { StatTile } from "@/components/ui/StatTile";
import { Card } from "@/components/ui/Card";
import { StackedStatusBar } from "@/components/ui/StackedStatusBar";
import { Dumbbell } from "@/components/ui/Dumbbell";
import { ChartTooltip } from "@/components/ui/ChartTooltip";
import { Badge } from "@/components/ui/Badge";
import { useAppStore } from "@/store/useAppStore";
import { providerById } from "@/data/providers";
import { QUARTER_LABEL, claimsBreakdown, noShowByProvider, practiceKpis, reminderEffectiveness } from "@/data/kpiConstants";
import { formatCurrency, formatDate, formatRelativeTime } from "@/lib/utils";

export function OwnerDashboard() {
  const auditLog = useAppStore((s) => s.auditLog);
  const recalls = useAppStore((s) => s.recalls);
  const invoices = useAppStore((s) => s.invoices);

  const overdueRecalls = recalls.filter((r) => r.status === "overdue").length;
  const outstandingInvoices = invoices.filter((i) => i.status === "outstanding").length;

  const noShowData = noShowByProvider.map((d) => ({
    name: providerById(d.providerId)?.shortName ?? d.providerId,
    value: d.noShowRate,
  }));

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatTile
          label={`Appointments (${QUARTER_LABEL})`}
          value={practiceKpis.appointmentsQuarter.toLocaleString("en-AU")}
          icon={<CalendarCheck2 size={16} />}
          accent="var(--color-teal-600)"
          trend={[62, 68, 71, 75, 74, 80, 83]}
          delta={{ text: "+6.4% vs Q4", direction: "up", goodDirection: "up" }}
        />
        <StatTile
          label="Attendance rate"
          value={`${practiceKpis.attendanceRate}%`}
          icon={<Users2 size={16} />}
          accent="var(--color-chart-3)"
          trend={[76, 78, 79, 80, 81, 82, 83]}
          delta={{ text: "+4.2 pts vs Q4", direction: "up", goodDirection: "up" }}
        />
        <StatTile
          label="No-show rate"
          value={`${practiceKpis.noShowRate}%`}
          icon={<TrendingDown size={16} />}
          accent="var(--color-terracotta-500)"
          trend={[16.1, 15.2, 14.8, 13.9, 12.8, 12.1, 11.7]}
          delta={{ text: "−3.1 pts vs Q4", direction: "down", goodDirection: "down" }}
        />
        <StatTile
          label="Revenue at risk"
          value={formatCurrency(practiceKpis.revenueAtRisk)}
          icon={<AlertTriangle size={16} />}
          accent="var(--color-chart-8)"
          delta={{ text: `${practiceKpis.claimsRejectedCount} rejected claims`, direction: "up", goodDirection: "down" }}
        />
      </div>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-5">
        <Card className="xl:col-span-3">
          <div className="p-5 pb-0">
            <p className="text-[15px] font-semibold text-ink-900">No-show rate by provider</p>
            <p className="text-[12.5px] text-ink-500">{QUARTER_LABEL} · share of booked appointments not attended</p>
          </div>
          <div className="h-64 px-2 pb-4 pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={noShowData} layout="vertical" margin={{ left: 8, right: 28, top: 4, bottom: 4 }} barCategoryGap={14}>
                <CartesianGrid horizontal={false} stroke="var(--color-chart-grid)" />
                <XAxis type="number" tickFormatter={(v) => `${v}%`} tick={{ fontSize: 11, fill: "var(--color-chart-muted)" }} axisLine={{ stroke: "var(--color-chart-axis)" }} tickLine={false} domain={[0, "dataMax + 4"]} />
                <YAxis type="category" dataKey="name" width={78} tick={{ fontSize: 12.5, fill: "var(--color-ink-700)" }} axisLine={false} tickLine={false} />
                <Tooltip cursor={{ fill: "var(--color-teal-50)" }} content={<ChartTooltip formatter={(v) => `${v}%`} />} />
                <Bar dataKey="value" name="No-show rate" fill="var(--color-seq-400)" radius={[0, 4, 4, 0]} maxBarSize={22}>
                  <LabelList dataKey="value" position="right" formatter={(v) => `${v}%`} style={{ fontSize: 12, fontWeight: 600, fill: "var(--color-ink-700)" }} />
                  {noShowData.map((_, i) => (
                    <Cell key={i} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="xl:col-span-2">
          <div className="p-5 pb-0">
            <p className="text-[15px] font-semibold text-ink-900">Reminders work</p>
            <p className="text-[12.5px] text-ink-500">No-show rate, with vs without a reminder sent</p>
          </div>
          <div className="p-5">
            <Dumbbell
              lowLabel="No reminder sent"
              highLabel="Reminder sent"
              lowValue={reminderEffectiveness.withoutReminder}
              highValue={reminderEffectiveness.withReminder}
              max={22}
              lowColor="var(--color-terracotta-400)"
              highColor="var(--color-teal-700)"
            />
            <div className="mt-6 rounded-xl bg-teal-50 p-3.5 text-center">
              <p className="text-[13px] text-teal-800">
                <span className="font-semibold">{reminderEffectiveness.multiplier}× fewer</span> no-shows when a reminder goes out
              </p>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-5">
        <Card className="xl:col-span-3">
          <div className="p-5 pb-0 flex items-center justify-between">
            <div>
              <p className="text-[15px] font-semibold text-ink-900">Claims breakdown</p>
              <p className="text-[12.5px] text-ink-500">{QUARTER_LABEL} · {practiceKpis.claimsLodgedCount.toLocaleString("en-AU")} claims lodged</p>
            </div>
            <Link to="/staff/app/claims" className="flex items-center gap-1 text-[12.5px] font-semibold text-teal-700 hover:text-teal-900">
              View claims <ArrowRight size={13} />
            </Link>
          </div>
          <div className="p-5">
            <StackedStatusBar
              segments={[
                { label: "Paid", value: claimsBreakdown.paid, color: "var(--color-status-good)" },
                { label: "Pending", value: claimsBreakdown.pending, color: "var(--color-status-warning)" },
                { label: "Rejected", value: claimsBreakdown.rejected, color: "var(--color-status-critical)" },
              ]}
            />
          </div>
        </Card>

        <Card className="xl:col-span-2">
          <div className="p-5 pb-0">
            <p className="text-[15px] font-semibold text-ink-900">Needs attention</p>
            <p className="text-[12.5px] text-ink-500">Live, right now</p>
          </div>
          <div className="space-y-2.5 p-5">
            <div className="flex items-center justify-between rounded-xl bg-cream-50 p-3">
              <span className="text-[13px] text-ink-700">Overdue recalls</span>
              <Badge variant={overdueRecalls > 0 ? "critical" : "good"}>{overdueRecalls}</Badge>
            </div>
            <div className="flex items-center justify-between rounded-xl bg-cream-50 p-3">
              <span className="text-[13px] text-ink-700">Outstanding invoices</span>
              <Badge variant={outstandingInvoices > 0 ? "warning" : "good"}>{outstandingInvoices}</Badge>
            </div>
            <div className="flex items-center justify-between rounded-xl bg-cream-50 p-3">
              <span className="text-[13px] text-ink-700">Rejected claims</span>
              <Badge variant="critical">{practiceKpis.claimsRejectedCount}</Badge>
            </div>
            <Link to="/staff/app/reports" className="mt-1 flex items-center justify-center gap-1.5 rounded-xl border border-dashed border-ink-300 py-2.5 text-[12.5px] font-semibold text-ink-500 hover:border-teal-400 hover:text-teal-700">
              <TrendingUp size={14} /> Open full reports
            </Link>
          </div>
        </Card>
      </div>

      <Card>
        <div className="flex items-center justify-between p-5 pb-0">
          <p className="text-[15px] font-semibold text-ink-900">Recent activity</p>
          <Link to="/staff/app/security" className="text-[12.5px] font-semibold text-teal-700 hover:text-teal-900">Full audit log</Link>
        </div>
        <div className="divide-y divide-ink-900/6 p-5 pt-3">
          {auditLog.slice(0, 6).map((a) => (
            <div key={a.id} className="flex items-center justify-between py-2.5 text-[13px]">
              <span className="text-ink-600"><span className="font-medium text-ink-900">{a.actorName}</span> {a.action} <span className="text-ink-500">{a.target}</span></span>
              <span className="shrink-0 text-[11.5px] text-ink-400">{formatRelativeTime(a.timestamp)}</span>
            </div>
          ))}
        </div>
      </Card>

      <p className="text-center text-[11.5px] text-ink-300">Snapshot as of {formatDate(new Date())} · KPI figures reflect {QUARTER_LABEL}</p>
    </div>
  );
}
