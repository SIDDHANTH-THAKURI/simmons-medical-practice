import { useState } from "react";
import { Link } from "react-router-dom";
import { CheckCircle2, RefreshCw, Repeat2, Zap } from "lucide-react";
import { useAppStore } from "@/store/useAppStore";
import { useModuleAccess } from "@/store/useCurrentUser";
import { useToastStore } from "@/store/useToastStore";
import { AccessRestricted, EmptyState } from "@/components/ui/EmptyState";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { StatTile } from "@/components/ui/StatTile";
import { providerById } from "@/data/providers";
import { formatCurrency, formatRelativeTime, cn } from "@/lib/utils";
import type { ClaimStatus } from "@/types";

const VARIANT: Record<ClaimStatus, "good" | "warning" | "critical"> = { paid: "good", pending: "warning", rejected: "critical" };

export default function ClaimsBilling() {
  const level = useModuleAccess("claims");
  const claims = useAppStore((s) => s.claims);
  const patients = useAppStore((s) => s.patients);
  const updateClaimStatus = useAppStore((s) => s.updateClaimStatus);
  const showToast = useToastStore((s) => s.show);
  const [tab, setTab] = useState<"all" | ClaimStatus>("all");
  const [syncing, setSyncing] = useState(false);
  const [lastSync, setLastSync] = useState(() => new Date(Date.now() - 2 * 60000));

  if (level === "none") return <AccessRestricted moduleName="Claims & Billing" />;

  const sorted = [...claims].sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());
  const list = tab === "all" ? sorted : sorted.filter((c) => c.claimStatus === tab);

  const paid = claims.filter((c) => c.claimStatus === "paid");
  const pending = claims.filter((c) => c.claimStatus === "pending");
  const rejected = claims.filter((c) => c.claimStatus === "rejected");
  const revenueAtRisk = rejected.reduce((s, c) => s + c.claimAmount, 0);

  function patientName(id: string) {
    const p = patients.find((pt) => pt.id === id);
    return p ? `${p.firstName} ${p.lastName}` : "Unknown";
  }

  function resync() {
    setSyncing(true);
    setTimeout(() => {
      setSyncing(false);
      setLastSync(new Date());
      showToast({ variant: "success", title: "Synced with Xero", description: `${paid.length} transactions matched, 0 discrepancies` });
    }, 1100);
  }

  return (
    <div>
      <h1 className="font-display text-3xl font-semibold text-ink-900">Claims &amp; Billing</h1>
      <p className="mt-1.5 text-[14px] text-ink-500">Medicare reconciliation, rejected-claim flags, and the Xero sync status.</p>

      <div className="mt-6 flex flex-col justify-between gap-4 rounded-2xl border border-teal-200 bg-teal-50/60 p-5 sm:flex-row sm:items-center">
        <div className="flex items-center gap-3.5">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-teal-800 text-white">
            <Zap size={18} />
          </div>
          <div>
            <p className="text-[14px] font-semibold text-ink-900">Xero reconciliation — connected</p>
            <p className="text-[12.5px] text-ink-500">Last synced {formatRelativeTime(lastSync.toISOString())} · {paid.length} transactions matched · 0 discrepancies</p>
          </div>
        </div>
        <Button size="sm" variant="secondary" onClick={resync} loading={syncing}>
          <RefreshCw size={14} /> Sync now
        </Button>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatTile label="Total claims" value={String(claims.length)} icon={<Repeat2 size={16} />} accent="var(--color-teal-600)" />
        <StatTile label="Paid" value={String(paid.length)} icon={<CheckCircle2 size={16} />} accent="var(--color-status-good)" />
        <StatTile label="Pending" value={String(pending.length)} accent="var(--color-status-warning)" />
        <StatTile label="Revenue at risk" value={formatCurrency(revenueAtRisk)} accent="var(--color-status-critical)" />
      </div>

      <div className="mt-6 inline-flex rounded-xl bg-cream-100 p-1">
        {(["all", "paid", "pending", "rejected"] as const).map((t) => (
          <button key={t} onClick={() => setTab(t)} className={cn("rounded-lg px-3.5 py-2 text-[13px] font-semibold capitalize", tab === t ? "bg-white text-ink-900 shadow-sm" : "text-ink-500")}>
            {t}
          </button>
        ))}
      </div>

      <div className="mt-5 overflow-hidden rounded-2xl border border-ink-900/8 bg-white">
        <div className="hidden grid-cols-12 gap-3 border-b border-ink-900/8 bg-cream-25 px-5 py-2.5 text-[11.5px] font-semibold uppercase tracking-wider text-ink-400 sm:grid">
          <span className="col-span-3">Patient</span>
          <span className="col-span-3">Item</span>
          <span className="col-span-2">Provider</span>
          <span className="col-span-2">Amount</span>
          <span className="col-span-2">Status</span>
        </div>
        <div className="divide-y divide-ink-900/6">
          {list.slice(0, 40).map((c) => (
            <div key={c.id} className="grid grid-cols-2 items-center gap-3 px-5 py-3.5 sm:grid-cols-12">
              <Link to={`/staff/app/patients/${c.patientId}`} className="col-span-2 text-[13px] font-medium text-teal-700 hover:underline sm:col-span-3">{patientName(c.patientId)}</Link>
              <div className="hidden sm:col-span-3 sm:block">
                <p className="text-[13px] text-ink-800">MBS {c.mbsItem}</p>
                <p className="text-[11px] text-ink-400">{c.description}</p>
              </div>
              <span className="hidden text-[12.5px] text-ink-500 sm:col-span-2 sm:block">{providerById(c.providerId)?.shortName}</span>
              <span className="text-[13px] font-medium tabular-nums text-ink-800 sm:col-span-2">{formatCurrency(c.claimAmount)}</span>
              <div className="flex items-center justify-between gap-2 sm:col-span-2">
                <div>
                  <Badge variant={VARIANT[c.claimStatus]}>{c.claimStatus}</Badge>
                  {c.claimStatus === "rejected" && <p className="mt-1 text-[10.5px] text-ink-400">{c.rejectionReason}</p>}
                </div>
                {c.claimStatus === "rejected" && level === "full" && (
                  <button
                    onClick={() => {
                      updateClaimStatus(c.id, "pending");
                      showToast({ variant: "info", title: "Claim resubmitted" });
                    }}
                    className="text-[11px] font-semibold text-teal-700 hover:underline"
                  >
                    Resubmit
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
        {list.length === 0 && <EmptyState title="No claims here" className="border-none" />}
        {list.length > 40 && <p className="border-t border-ink-900/6 px-5 py-3 text-center text-[12px] text-ink-400">Showing 40 of {list.length}</p>}
      </div>
    </div>
  );
}
