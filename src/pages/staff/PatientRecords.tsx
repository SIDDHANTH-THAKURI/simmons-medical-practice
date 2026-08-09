import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ChevronRight, Search, ShieldCheck, UserPlus } from "lucide-react";
import { useAppStore } from "@/store/useAppStore";
import { useCurrentStaff, useModuleAccess } from "@/store/useCurrentUser";
import { AccessRestricted, EmptyState } from "@/components/ui/EmptyState";
import { Avatar } from "@/components/ui/Avatar";
import { providerById } from "@/data/providers";
import { formatDate } from "@/lib/utils";

function age(dob: string) {
  return new Date().getFullYear() - new Date(dob).getFullYear();
}

export default function PatientRecords() {
  const staff = useCurrentStaff()!;
  const level = useModuleAccess("records");
  const patients = useAppStore((s) => s.patients);
  const appointments = useAppStore((s) => s.appointments);
  const [query, setQuery] = useState("");

  const visiblePatients = useMemo(() => {
    if (level !== "own") return patients;
    const ownIds = new Set(appointments.filter((a) => a.providerId === staff.providerId).map((a) => a.patientId));
    return patients.filter((p) => ownIds.has(p.id));
  }, [level, patients, appointments, staff.providerId]);

  const filtered = visiblePatients.filter((p) =>
    `${p.firstName} ${p.lastName}`.toLowerCase().includes(query.toLowerCase())
  );

  if (level === "none") return <AccessRestricted moduleName="Patient Records" />;

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-semibold text-ink-900">Patient Records</h1>
          <p className="mt-1.5 text-[14px] text-ink-500">{visiblePatients.length} patients {level === "own" && "· your patients only"}</p>
        </div>
        {level === "full" && (
          <button className="flex items-center gap-1.5 rounded-xl bg-teal-800 px-4 py-2.5 text-[13px] font-medium text-white hover:bg-teal-900">
            <UserPlus size={15} /> New patient
          </button>
        )}
      </div>

      {level === "own" && (
        <div className="mt-4 flex items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 px-4 py-2.5 text-[12.5px] text-amber-800">
          <ShieldCheck size={15} /> Segregated access — the query only returns patients linked to your own appointments.
        </div>
      )}
      {level === "read" && (
        <div className="mt-4 flex items-center gap-2 rounded-xl border border-ink-200 bg-cream-100 px-4 py-2.5 text-[12.5px] text-ink-600">
          Read-only access — you can look up patient details but can't edit records.
        </div>
      )}

      <div className="relative mt-6 max-w-sm">
        <Search size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-400" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search patients…"
          className="h-11 w-full rounded-xl border border-ink-900/12 bg-white pl-10 pr-3.5 text-[14px] placeholder:text-ink-300 focus:outline-none focus:ring-2 focus:ring-teal-500/30"
        />
      </div>

      <div className="mt-5 overflow-hidden rounded-2xl border border-ink-900/8 bg-white">
        <div className="hidden grid-cols-12 gap-3 border-b border-ink-900/8 bg-cream-25 px-5 py-2.5 text-[11.5px] font-semibold uppercase tracking-wider text-ink-400 sm:grid">
          <span className="col-span-4">Patient</span>
          <span className="col-span-2">Age</span>
          <span className="col-span-3">Registered GP</span>
          <span className="col-span-3">Suburb</span>
        </div>
        <div className="divide-y divide-ink-900/6">
          {filtered.map((p) => (
            <Link key={p.id} to={`/staff/app/patients/${p.id}`} className="grid grid-cols-2 items-center gap-3 px-5 py-3.5 hover:bg-cream-50 sm:grid-cols-12">
              <div className="col-span-2 flex items-center gap-3 sm:col-span-4">
                <Avatar name={`${p.firstName} ${p.lastName}`} color={p.avatarColor} size={36} />
                <div className="min-w-0">
                  <p className="truncate text-[13.5px] font-medium text-ink-900">{p.firstName} {p.lastName}</p>
                  <p className="truncate text-[11.5px] text-ink-400 sm:hidden">{formatDate(p.dob)}</p>
                </div>
              </div>
              <span className="hidden text-[13px] text-ink-600 sm:col-span-2 sm:block">{age(p.dob)} yrs</span>
              <span className="hidden text-[13px] text-ink-600 sm:col-span-3 sm:block">{providerById(p.registeredProviderId)?.name}</span>
              <div className="hidden items-center justify-between sm:col-span-3 sm:flex">
                <span className="text-[13px] text-ink-600">{p.suburb.split(" QLD")[0]}</span>
                <ChevronRight size={16} className="text-ink-300" />
              </div>
            </Link>
          ))}
        </div>
        {filtered.length === 0 && <EmptyState title="No patients found" description="Try a different search term." className="border-none" />}
      </div>
    </div>
  );
}
