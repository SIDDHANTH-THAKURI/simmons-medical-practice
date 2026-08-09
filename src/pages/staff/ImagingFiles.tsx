import { useState } from "react";
import { Link } from "react-router-dom";
import { Archive, Database, File, FileImage, FileText, Snowflake } from "lucide-react";
import { useAppStore } from "@/store/useAppStore";
import { useModuleAccess } from "@/store/useCurrentUser";
import { AccessRestricted, EmptyState } from "@/components/ui/EmptyState";
import { Badge } from "@/components/ui/Badge";
import type { DocumentType } from "@/types";
import { formatDate, cn } from "@/lib/utils";

const TYPE_ICON: Record<DocumentType, typeof File> = {
  pathology: FileText,
  radiology: FileImage,
  referral: FileText,
  imaging: FileImage,
  "clinical-note": FileText,
  "care-plan": FileText,
};

const TIER_INFO = {
  hot: { label: "Hot storage", icon: Database, desc: "Instant access, last 7 days", color: "var(--color-teal-600)" },
  cool: { label: "Cool storage", icon: Snowflake, desc: "Fast retrieval, 8–20 days", color: "var(--color-chart-1)" },
  archive: { label: "Archive", icon: Archive, desc: "Compliance retention, 20+ days", color: "var(--color-ink-400)" },
};

export default function ImagingFiles() {
  const level = useModuleAccess("resultsImaging");
  const documents = useAppStore((s) => s.documents);
  const patients = useAppStore((s) => s.patients);
  const [tier, setTier] = useState<"all" | keyof typeof TIER_INFO>("all");

  if (level === "none") return <AccessRestricted moduleName="Imaging & Files" />;

  const list = (tier === "all" ? documents : documents.filter((d) => d.storageTier === tier)).sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  function patientName(id: string) {
    const p = patients.find((pt) => pt.id === id);
    return p ? `${p.firstName} ${p.lastName}` : "Unknown";
  }

  const counts = { hot: 0, cool: 0, archive: 0 } as Record<string, number>;
  documents.forEach((d) => (counts[d.storageTier] = (counts[d.storageTier] ?? 0) + 1));

  return (
    <div>
      <h1 className="font-display text-3xl font-semibold text-ink-900">Imaging &amp; Files</h1>
      <p className="mt-1.5 text-[14px] text-ink-500">Tiered object storage — retention-period aware.</p>

      <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
        {(Object.keys(TIER_INFO) as (keyof typeof TIER_INFO)[]).map((t) => {
          const info = TIER_INFO[t];
          return (
            <button
              key={t}
              onClick={() => setTier(tier === t ? "all" : t)}
              className={cn("flex items-center gap-3 rounded-2xl border p-4 text-left transition-colors", tier === t ? "border-teal-600 bg-teal-50" : "border-ink-900/8 bg-white hover:border-teal-300")}
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-xl" style={{ backgroundColor: `color-mix(in srgb, ${info.color} 14%, transparent)`, color: info.color }}>
                <info.icon size={18} />
              </span>
              <span>
                <span className="block text-[13.5px] font-semibold text-ink-900">{info.label} · {counts[t] ?? 0}</span>
                <span className="block text-[11.5px] text-ink-500">{info.desc}</span>
              </span>
            </button>
          );
        })}
      </div>

      <div className="mt-6 overflow-hidden rounded-2xl border border-ink-900/8 bg-white">
        <div className="hidden grid-cols-12 gap-3 border-b border-ink-900/8 bg-cream-25 px-5 py-2.5 text-[11.5px] font-semibold uppercase tracking-wider text-ink-400 sm:grid">
          <span className="col-span-4">File</span>
          <span className="col-span-3">Patient</span>
          <span className="col-span-2">Size</span>
          <span className="col-span-3">Retention until</span>
        </div>
        <div className="divide-y divide-ink-900/6">
          {list.map((d) => {
            const Icon = TYPE_ICON[d.type];
            return (
              <div key={d.id} className="grid grid-cols-2 items-center gap-3 px-5 py-3.5 sm:grid-cols-12">
                <div className="col-span-2 flex items-center gap-2.5 sm:col-span-4">
                  <Icon size={16} className="shrink-0 text-ink-400" />
                  <div className="min-w-0">
                    <p className="truncate text-[13px] font-medium text-ink-900">{d.title}</p>
                    <p className="text-[11px] text-ink-400 capitalize">{d.type.replace("-", " ")}</p>
                  </div>
                </div>
                <Link to={`/staff/app/patients/${d.patientId}`} className="hidden text-[13px] text-teal-700 hover:underline sm:col-span-3 sm:block">{patientName(d.patientId)}</Link>
                <span className="hidden text-[12.5px] text-ink-500 sm:col-span-2 sm:block">{(d.sizeKb / 1024).toFixed(1)} MB</span>
                <div className="hidden items-center justify-between sm:col-span-3 sm:flex">
                  <span className="text-[12.5px] text-ink-500">{formatDate(d.retentionUntil)}</span>
                  <Badge variant="neutral" className="capitalize">{d.storageTier}</Badge>
                </div>
              </div>
            );
          })}
        </div>
        {list.length === 0 && <EmptyState title="No files in this tier" className="border-none" />}
      </div>
    </div>
  );
}
