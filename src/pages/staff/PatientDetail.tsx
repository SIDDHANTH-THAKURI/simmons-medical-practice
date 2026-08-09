import { useEffect, useRef } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Calendar, FileText, Mail, MapPin, Phone, Pencil, Receipt, ShieldAlert } from "lucide-react";
import { useAppStore } from "@/store/useAppStore";
import { useCurrentStaff, useModuleAccess } from "@/store/useCurrentUser";
import { AccessRestricted, EmptyState } from "@/components/ui/EmptyState";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { providerById } from "@/data/providers";
import { formatCurrency, formatDate, formatTime } from "@/lib/utils";
import type { AppointmentStatus, ClaimStatus } from "@/types";

const APPT_VARIANT: Record<AppointmentStatus, "good" | "warning" | "critical" | "info" | "neutral"> = {
  confirmed: "good", pending: "warning", completed: "neutral", cancelled: "critical", "no-show": "critical", rescheduled: "info",
};
const CLAIM_VARIANT: Record<ClaimStatus, "good" | "warning" | "critical"> = { paid: "good", pending: "warning", rejected: "critical" };

function age(dob: string) {
  return new Date().getFullYear() - new Date(dob).getFullYear();
}

export default function PatientDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const staff = useCurrentStaff()!;
  const level = useModuleAccess("records");
  const patients = useAppStore((s) => s.patients);
  const appointments = useAppStore((s) => s.appointments);
  const documents = useAppStore((s) => s.documents);
  const claims = useAppStore((s) => s.claims);
  const recalls = useAppStore((s) => s.recalls);
  const logAudit = useAppStore((s) => s.logAudit);
  const logged = useRef<string | null>(null);

  const patient = patients.find((p) => p.id === id);
  const myApptIds = appointments.filter((a) => a.providerId === staff.providerId).map((a) => a.patientId);
  const segregatedBlock = level === "own" && patient && !myApptIds.includes(patient.id);

  useEffect(() => {
    if (!patient || segregatedBlock || logged.current === patient.id) return;
    logged.current = patient.id;
    logAudit({
      actorName: `${staff.firstName} ${staff.lastName}`,
      actorRole: staff.role,
      action: "opened record",
      target: `${patient.firstName} ${patient.lastName}`,
      module: "patients",
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [patient?.id, segregatedBlock]);

  if (level === "none") return <AccessRestricted moduleName="Patient Records" />;
  if (!patient) return <EmptyState title="Patient not found" action={<Link to="/staff/app/patients">Back to records</Link>} />;
  if (segregatedBlock) return <AccessRestricted moduleName="This patient record" />;

  const mine = appointments.filter((a) => a.patientId === patient.id).sort((a, b) => new Date(b.scheduledAt).getTime() - new Date(a.scheduledAt).getTime());
  const docs = documents.filter((d) => d.patientId === patient.id);
  const patientClaims = claims.filter((c) => c.patientId === patient.id);
  const patientRecalls = recalls.filter((r) => r.patientId === patient.id);

  return (
    <div>
      <button onClick={() => navigate(-1)} className="mb-5 flex items-center gap-1.5 text-[13px] font-medium text-ink-500 hover:text-ink-800">
        <ArrowLeft size={14} /> Back to records
      </button>

      <div className="flex flex-col justify-between gap-4 rounded-2xl border border-ink-900/8 bg-white p-6 sm:flex-row sm:items-center">
        <div className="flex items-center gap-4">
          <Avatar name={`${patient.firstName} ${patient.lastName}`} color={patient.avatarColor} size={56} />
          <div>
            <p className="text-[18px] font-semibold text-ink-900">{patient.firstName} {patient.lastName}</p>
            <p className="text-[13px] text-ink-500">{age(patient.dob)} years · DOB {formatDate(patient.dob)} · {providerById(patient.registeredProviderId)?.name}</p>
          </div>
        </div>
        {level === "full" && (
          <button className="flex items-center gap-1.5 self-start rounded-xl border border-ink-900/10 px-3.5 py-2 text-[12.5px] font-medium text-ink-600 hover:bg-cream-50 sm:self-auto">
            <Pencil size={14} /> Edit demographics
          </button>
        )}
      </div>

      <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-3">
        <div className="space-y-5 lg:col-span-2">
          <Card>
            <div className="p-5 pb-0"><p className="text-[15px] font-semibold text-ink-900">Appointment history</p></div>
            <div className="divide-y divide-ink-900/6 p-5 pt-3">
              {mine.map((a) => (
                <div key={a.id} className="flex items-center justify-between py-2.5">
                  <div>
                    <p className="text-[13.5px] font-medium text-ink-900">{a.reason}</p>
                    <p className="text-[11.5px] text-ink-400">{providerById(a.providerId)?.name} · {formatDate(a.scheduledAt)} at {formatTime(a.scheduledAt)}</p>
                  </div>
                  <Badge variant={APPT_VARIANT[a.status]}>{a.status.replace("-", " ")}</Badge>
                </div>
              ))}
              {mine.length === 0 && <p className="py-6 text-center text-[13px] text-ink-400">No appointments on file.</p>}
            </div>
          </Card>

          <Card>
            <div className="p-5 pb-0"><p className="text-[15px] font-semibold text-ink-900">Documents &amp; results</p></div>
            <div className="divide-y divide-ink-900/6 p-5 pt-3">
              {docs.map((d) => (
                <div key={d.id} className="flex items-center justify-between py-2.5">
                  <div className="flex items-center gap-2.5">
                    <FileText size={15} className="text-ink-400" />
                    <div>
                      <p className="text-[13px] font-medium text-ink-900">{d.title}</p>
                      <p className="text-[11px] text-ink-400 capitalize">{d.type} · {formatDate(d.createdAt)}</p>
                    </div>
                  </div>
                  {d.flaggedForReview ? <Badge variant="warning">Needs review</Badge> : <Badge variant="neutral">Reviewed</Badge>}
                </div>
              ))}
              {docs.length === 0 && <p className="py-6 text-center text-[13px] text-ink-400">No documents on file.</p>}
            </div>
          </Card>

          {level === "full" && (
            <Card>
              <div className="p-5 pb-0"><p className="flex items-center gap-1.5 text-[15px] font-semibold text-ink-900"><Receipt size={15} /> Claims</p></div>
              <div className="divide-y divide-ink-900/6 p-5 pt-3">
                {patientClaims.map((c) => (
                  <div key={c.id} className="flex items-center justify-between py-2.5">
                    <div>
                      <p className="text-[13px] font-medium text-ink-900">MBS {c.mbsItem} · {c.description}</p>
                      <p className="text-[11px] text-ink-400">{formatDate(c.submittedAt)}</p>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <span className="text-[12.5px] font-medium text-ink-700 tabular-nums">{formatCurrency(c.claimAmount)}</span>
                      <Badge variant={CLAIM_VARIANT[c.claimStatus]}>{c.claimStatus}</Badge>
                    </div>
                  </div>
                ))}
                {patientClaims.length === 0 && <p className="py-6 text-center text-[13px] text-ink-400">No claims on file.</p>}
              </div>
            </Card>
          )}
        </div>

        <div className="space-y-5">
          <Card>
            <div className="p-5 pb-0"><p className="text-[13px] font-semibold text-ink-700">Contact</p></div>
            <div className="space-y-2.5 p-5 pt-3 text-[13px]">
              <p className="flex items-center gap-2.5 text-ink-700"><Mail size={14} className="text-ink-400" /> {patient.email}</p>
              <p className="flex items-center gap-2.5 text-ink-700"><Phone size={14} className="text-ink-400" /> {patient.phone}</p>
              <p className="flex items-center gap-2.5 text-ink-700"><MapPin size={14} className="text-ink-400" /> {patient.address}, {patient.suburb}</p>
            </div>
          </Card>

          <Card>
            <div className="p-5 pb-0"><p className="text-[13px] font-semibold text-ink-700">Medicare</p></div>
            <div className="space-y-2 p-5 pt-3 text-[13px]">
              <div className="flex justify-between"><span className="text-ink-400">Number</span><span className="font-medium text-ink-800 tabular-nums">{patient.medicareNumber}</span></div>
              <div className="flex justify-between"><span className="text-ink-400">Ref.</span><span className="font-medium text-ink-800">{patient.medicareRefNo}</span></div>
              {patient.concessionCard && <div className="flex justify-between"><span className="text-ink-400">Concession</span><span className="font-medium text-ink-800">{patient.concessionCard}</span></div>}
            </div>
          </Card>

          {patientRecalls.length > 0 && (
            <Card>
              <div className="p-5 pb-0"><p className="flex items-center gap-1.5 text-[13px] font-semibold text-ink-700"><Calendar size={14} /> Recalls</p></div>
              <div className="space-y-2.5 p-5 pt-3">
                {patientRecalls.map((r) => (
                  <div key={r.id} className="flex items-center justify-between text-[12.5px]">
                    <span className="text-ink-700">{r.type}</span>
                    <Badge variant={r.status === "overdue" ? "critical" : r.status === "due" ? "warning" : "neutral"}>{r.status}</Badge>
                  </div>
                ))}
              </div>
            </Card>
          )}

          <div className="flex items-start gap-2 rounded-xl bg-cream-100 p-4 text-[11.5px] leading-relaxed text-ink-500">
            <ShieldAlert size={14} className="mt-0.5 shrink-0" />
            This view was just recorded in the security audit log against your account.
          </div>
        </div>
      </div>
    </div>
  );
}
