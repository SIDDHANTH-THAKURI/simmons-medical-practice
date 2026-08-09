import { useState } from "react";
import { Bell, Mail, MapPin, Pencil, Phone, Save, ShieldAlert, UserRound } from "lucide-react";
import { useCurrentPatient } from "@/store/useCurrentUser";
import { useAppStore } from "@/store/useAppStore";
import { useToastStore } from "@/store/useToastStore";
import { Avatar } from "@/components/ui/Avatar";
import { FieldWrap, Input } from "@/components/ui/Field";
import { formatDate } from "@/lib/utils";
import { providerById } from "@/data/providers";

function ToggleRow({ label, hint, checked, onChange }: { label: string; hint: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="flex items-center justify-between py-3">
      <div>
        <p className="text-[13.5px] font-medium text-ink-800">{label}</p>
        <p className="text-[12px] text-ink-400">{hint}</p>
      </div>
      <button
        onClick={() => onChange(!checked)}
        className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${checked ? "bg-teal-700" : "bg-ink-200"}`}
      >
        <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${checked ? "translate-x-5" : "translate-x-0.5"}`} />
      </button>
    </div>
  );
}

export default function Profile() {
  const patient = useCurrentPatient()!;
  const updatePatient = useAppStore((s) => s.updatePatient);
  const updateNotifyPrefs = useAppStore((s) => s.updateNotifyPrefs);
  const showToast = useToastStore((s) => s.show);
  const provider = providerById(patient.registeredProviderId);

  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    phone: patient.phone,
    email: patient.email,
    address: patient.address,
    suburb: patient.suburb,
  });

  function save() {
    updatePatient(patient.id, form);
    setEditing(false);
    showToast({ variant: "success", title: "Profile updated" });
  }

  return (
    <div>
      <h1 className="font-display text-3xl font-semibold text-ink-900">Profile</h1>
      <p className="mt-1.5 text-[14px] text-ink-500">Your details, preferences and care team.</p>

      <div className="mt-7 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <div className="rounded-2xl border border-ink-900/8 bg-white p-6">
            <div className="flex items-center gap-4">
              <Avatar name={`${patient.firstName} ${patient.lastName}`} color={patient.avatarColor} size={56} />
              <div>
                <p className="text-[17px] font-semibold text-ink-900">{patient.firstName} {patient.lastName}</p>
                <p className="text-[13px] text-ink-500">DOB {formatDate(patient.dob)} · Patient since {formatDate(patient.createdAt)}</p>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-between">
              <p className="text-[12.5px] font-semibold uppercase tracking-wider text-ink-400">Contact details</p>
              {!editing ? (
                <button onClick={() => setEditing(true)} className="flex items-center gap-1.5 text-[12.5px] font-semibold text-teal-700 hover:text-teal-900">
                  <Pencil size={13} /> Edit
                </button>
              ) : (
                <button onClick={save} className="flex items-center gap-1.5 text-[12.5px] font-semibold text-teal-700 hover:text-teal-900">
                  <Save size={13} /> Save
                </button>
              )}
            </div>

            {!editing ? (
              <div className="mt-3 space-y-2.5 text-[13.5px]">
                <p className="flex items-center gap-2.5 text-ink-700"><Mail size={15} className="text-ink-400" /> {patient.email}</p>
                <p className="flex items-center gap-2.5 text-ink-700"><Phone size={15} className="text-ink-400" /> {patient.phone}</p>
                <p className="flex items-center gap-2.5 text-ink-700"><MapPin size={15} className="text-ink-400" /> {patient.address}, {patient.suburb}</p>
              </div>
            ) : (
              <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
                <FieldWrap label="Email"><Input value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} /></FieldWrap>
                <FieldWrap label="Phone"><Input value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} /></FieldWrap>
                <FieldWrap label="Address"><Input value={form.address} onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))} /></FieldWrap>
                <FieldWrap label="Suburb"><Input value={form.suburb} onChange={(e) => setForm((f) => ({ ...f, suburb: e.target.value }))} /></FieldWrap>
              </div>
            )}
          </div>

          <div className="rounded-2xl border border-ink-900/8 bg-white p-6">
            <p className="flex items-center gap-1.5 text-[13px] font-semibold text-ink-700"><Bell size={14} /> Notification preferences</p>
            <div className="mt-1 divide-y divide-ink-900/6">
              <ToggleRow
                label="SMS reminders"
                hint="Get a text before your appointment"
                checked={patient.notifyPrefs.sms}
                onChange={(v) => updateNotifyPrefs(patient.id, { ...patient.notifyPrefs, sms: v })}
              />
              <ToggleRow
                label="Email reminders"
                hint="Get an email confirmation & reminder"
                checked={patient.notifyPrefs.email}
                onChange={(v) => updateNotifyPrefs(patient.id, { ...patient.notifyPrefs, email: v })}
              />
            </div>
            <div className="mt-3 flex items-center justify-between">
              <p className="text-[13px] text-ink-500">Remind me</p>
              <div className="flex gap-1.5">
                {[24, 48, 72].map((h) => (
                  <button
                    key={h}
                    onClick={() => updateNotifyPrefs(patient.id, { ...patient.notifyPrefs, reminderHoursBefore: h as 24 | 48 | 72 })}
                    className={`rounded-lg px-2.5 py-1 text-[12px] font-medium ${patient.notifyPrefs.reminderHoursBefore === h ? "bg-teal-800 text-white" : "bg-cream-100 text-ink-500"}`}
                  >
                    {h}h before
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-ink-900/8 bg-white p-6">
            <p className="flex items-center gap-1.5 text-[13px] font-semibold text-ink-700"><ShieldAlert size={14} /> Emergency contact</p>
            <div className="mt-3 grid grid-cols-1 gap-2 text-[13.5px] sm:grid-cols-3">
              <p className="text-ink-700"><span className="block text-[11px] text-ink-400">Name</span>{patient.emergencyContact.name || "—"}</p>
              <p className="text-ink-700"><span className="block text-[11px] text-ink-400">Relationship</span>{patient.emergencyContact.relationship || "—"}</p>
              <p className="text-ink-700"><span className="block text-[11px] text-ink-400">Phone</span>{patient.emergencyContact.phone || "—"}</p>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-2xl border border-ink-900/8 bg-white p-5">
            <p className="flex items-center gap-1.5 text-[13px] font-semibold text-ink-700"><UserRound size={14} /> Your care team</p>
            {provider && (
              <div className="mt-3 flex items-center gap-3">
                <Avatar name={provider.name} color={provider.color} size={40} />
                <div>
                  <p className="text-[13.5px] font-semibold text-ink-900">{provider.name}</p>
                  <p className="text-[12px] text-ink-500">{provider.specialty}</p>
                </div>
              </div>
            )}
          </div>
          <div className="rounded-2xl bg-cream-100 p-5">
            <p className="text-[12.5px] leading-relaxed text-ink-500">
              This is a prototype account — updates you make here are stored locally in your browser and reset when you use "Reset demo".
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
