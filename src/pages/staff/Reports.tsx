import { Area, AreaChart, Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Download } from "lucide-react";
import { useAppStore } from "@/store/useAppStore";
import { useModuleAccess } from "@/store/useCurrentUser";
import { useToastStore } from "@/store/useToastStore";
import { AccessRestricted } from "@/components/ui/EmptyState";
import { Card } from "@/components/ui/Card";
import { Meter } from "@/components/ui/Meter";
import { ChartTooltip } from "@/components/ui/ChartTooltip";
import { Button } from "@/components/ui/Button";
import {
  QUARTER_LABEL, bookingChannelSplit, practiceKpis, revenueAtRiskTrend, weeklyAttendanceTrend,
} from "@/data/kpiConstants";
import { formatCurrency } from "@/lib/utils";

export default function Reports() {
  const level = useModuleAccess("reports");
  const recalls = useAppStore((s) => s.recalls);
  const showToast = useToastStore((s) => s.show);

  if (level === "none") return <AccessRestricted moduleName="Reports" />;

  const overdue = recalls.filter((r) => r.status === "overdue").length;
  const compliance = recalls.length ? Math.round(((recalls.length - overdue) / recalls.length) * 100) : 100;
  const maxChannel = Math.max(...bookingChannelSplit.map((c) => c.value));

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-semibold text-ink-900">Reports</h1>
          <p className="mt-1.5 text-[14px] text-ink-500">The full analytics picture — {QUARTER_LABEL}.</p>
        </div>
        <Button
          variant="secondary"
          onClick={() => showToast({ variant: "success", title: "Export queued", description: "Quarterly report will download shortly." })}
        >
          <Download size={15} /> Export report
        </Button>
      </div>

      <div className="mt-7 grid grid-cols-1 gap-5 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <div className="p-5 pb-0">
            <p className="text-[15px] font-semibold text-ink-900">Appointments &amp; attendance trend</p>
            <p className="text-[12.5px] text-ink-500">Weekly, {QUARTER_LABEL}</p>
          </div>
          <div className="h-72 px-2 pb-4 pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={weeklyAttendanceTrend} margin={{ left: 0, right: 12, top: 8, bottom: 0 }}>
                <defs>
                  <linearGradient id="attendanceFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--color-seq-400)" stopOpacity={0.22} />
                    <stop offset="100%" stopColor="var(--color-seq-400)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid vertical={false} stroke="var(--color-chart-grid)" />
                <XAxis dataKey="week" tick={{ fontSize: 11, fill: "var(--color-chart-muted)" }} axisLine={{ stroke: "var(--color-chart-axis)" }} tickLine={false} />
                <YAxis yAxisId="left" tick={{ fontSize: 11, fill: "var(--color-chart-muted)" }} axisLine={false} tickLine={false} width={30} />
                <Tooltip content={<ChartTooltip />} />
                <Area yAxisId="left" type="monotone" dataKey="appointments" name="Appointments" stroke="var(--color-seq-400)" strokeWidth={2} fill="url(#attendanceFill)" dot={false} activeDot={{ r: 4 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card>
          <div className="p-5 pb-0">
            <p className="text-[15px] font-semibold text-ink-900">Recall compliance</p>
            <p className="text-[12.5px] text-ink-500">On-schedule vs overdue</p>
          </div>
          <div className="p-5">
            <Meter value={compliance} valueLabel={`${compliance}%`} label="On schedule" color="var(--color-teal-600)" trackColor="var(--color-teal-100)" />
            <div className="mt-5 flex items-center justify-between rounded-xl bg-cream-50 p-3.5">
              <span className="text-[12.5px] text-ink-600">Overdue recalls</span>
              <span className="text-[14px] font-semibold text-terracotta-700">{overdue}</span>
            </div>
            <div className="mt-2.5 flex items-center justify-between rounded-xl bg-cream-50 p-3.5">
              <span className="text-[12.5px] text-ink-600">Total tracked</span>
              <span className="text-[14px] font-semibold text-ink-800">{recalls.length}</span>
            </div>
          </div>
        </Card>
      </div>

      <div className="mt-5 grid grid-cols-1 gap-5 xl:grid-cols-5">
        <Card className="xl:col-span-3">
          <div className="p-5 pb-0">
            <p className="text-[15px] font-semibold text-ink-900">Revenue at risk</p>
            <p className="text-[12.5px] text-ink-500">Rejected claims, {QUARTER_LABEL}</p>
          </div>
          <div className="h-56 px-2 pb-4 pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueAtRiskTrend} margin={{ left: 4, right: 12, top: 4, bottom: 4 }} barCategoryGap={28}>
                <CartesianGrid vertical={false} stroke="var(--color-chart-grid)" />
                <XAxis dataKey="month" tick={{ fontSize: 11.5, fill: "var(--color-chart-muted)" }} axisLine={{ stroke: "var(--color-chart-axis)" }} tickLine={false} />
                <YAxis tickFormatter={(v) => `$${v}`} tick={{ fontSize: 11, fill: "var(--color-chart-muted)" }} axisLine={false} tickLine={false} width={44} />
                <Tooltip cursor={{ fill: "var(--color-terracotta-50)" }} content={<ChartTooltip formatter={(v) => formatCurrency(Number(v))} />} />
                <Bar dataKey="amount" name="Revenue at risk" fill="var(--color-chart-2)" radius={[4, 4, 0, 0]} maxBarSize={56} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p className="px-5 pb-5 text-[12px] text-ink-400">Total this quarter: <span className="font-semibold text-ink-700">{formatCurrency(practiceKpis.revenueAtRisk)}</span> across {practiceKpis.claimsRejectedCount} rejected claims.</p>
        </Card>

        <Card className="xl:col-span-2">
          <div className="p-5 pb-0">
            <p className="text-[15px] font-semibold text-ink-900">Booking channel</p>
            <p className="text-[12.5px] text-ink-500">How patients booked</p>
          </div>
          <div className="space-y-4 p-5">
            {bookingChannelSplit.map((c, i) => (
              <Meter
                key={c.channel}
                value={c.value}
                max={maxChannel}
                label={c.channel}
                valueLabel={`${c.value}%`}
                color={["var(--color-chart-1)", "var(--color-chart-2)", "var(--color-chart-3)"][i]}
                trackColor="var(--color-cream-200)"
              />
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
