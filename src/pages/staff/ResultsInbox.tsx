import { useState } from "react";
import { Link } from "react-router-dom";
import { CheckCircle2, FlaskConical, Radiation } from "lucide-react";
import { useAppStore } from "@/store/useAppStore";
import { useModuleAccess } from "@/store/useCurrentUser";
import { useToastStore } from "@/store/useToastStore";
import { AccessRestricted, EmptyState } from "@/components/ui/EmptyState";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { providerById } from "@/data/providers";
import { formatDate, cn } from "@/lib/utils";

export default function ResultsInbox() {
  const level = useModuleAccess("resultsImaging");
  const documents = useAppStore((s) => s.documents);
  const patients = useAppStore((s) => s.patients);
  const markReviewed = useAppStore((s) => s.markDocumentReviewed);
  const showToast = useToastStore((s) => s.show);
  const [filter, setFilter] = useState<"flagged" | "all">("flagged");

  if (level === "none") return <AccessRestricted moduleName="Results Inbox" />;

  const results = documents.filter((d) => d.type === "pathology" || d.type === "radiology");
  const list = (filter === "flagged" ? results.filter((d) => d.flaggedForReview) : results).sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  function patientName(id: string) {
    const p = patients.find((pt) => pt.id === id);
    return p ? `${p.firstName} ${p.lastName}` : "Unknown";
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-semibold text-ink-900">Results Inbox</h1>
          <p className="mt-1.5 text-[14px] text-ink-500">Pathology &amp; radiology results, flagged for review.</p>
        </div>
        <div className="inline-flex rounded-xl bg-cream-100 p-1">
          {(["flagged", "all"] as const).map((f) => (
            <button key={f} onClick={() => setFilter(f)} className={cn("rounded-lg px-3.5 py-2 text-[13px] font-semibold capitalize", filter === f ? "bg-white text-ink-900 shadow-sm" : "text-ink-500")}>
              {f === "flagged" ? `Needs review (${results.filter((d) => d.flaggedForReview).length})` : `All (${results.length})`}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6 space-y-3">
        {list.map((d) => (
          <div key={d.id} className="flex flex-col gap-3 rounded-2xl border border-ink-900/8 bg-white p-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3.5">
              <div className={cn("flex h-11 w-11 shrink-0 items-center justify-center rounded-xl", d.type === "pathology" ? "bg-chart-1/10 text-chart-1" : "bg-terracotta-50 text-terracotta-600")}>
                {d.type === "pathology" ? <FlaskConical size={18} /> : <Radiation size={18} />}
              </div>
              <div>
                <p className="text-[14px] font-semibold text-ink-900">{d.title}</p>
                <Link to={`/staff/app/patients/${d.patientId}`} className="text-[12.5px] text-teal-700 hover:underline">{patientName(d.patientId)}</Link>
                <p className="text-[11.5px] text-ink-400">Ordered by {providerById(d.providerId)?.name} · {formatDate(d.createdAt)}</p>
              </div>
            </div>
            <div className="flex shrink-0 items-center gap-2.5">
              {d.flaggedForReview ? <Badge variant="warning">Needs review</Badge> : <Badge variant="good">Reviewed</Badge>}
              {d.flaggedForReview && (
                <Button
                  size="sm"
                  onClick={() => {
                    markReviewed(d.id);
                    showToast({ variant: "success", title: "Marked as reviewed" });
                  }}
                >
                  <CheckCircle2 size={14} /> Mark reviewed
                </Button>
              )}
            </div>
          </div>
        ))}
        {list.length === 0 && <EmptyState icon={<FlaskConical size={28} strokeWidth={1.5} />} title="Inbox zero" description="No results waiting on review." />}
      </div>
    </div>
  );
}
