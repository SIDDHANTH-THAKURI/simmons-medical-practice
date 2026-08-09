import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Lock, Mail, Sparkles } from "lucide-react";
import { AuthShell } from "@/components/auth/AuthShell";
import { Button } from "@/components/ui/Button";
import { Checkbox, FieldWrap, Input } from "@/components/ui/Field";
import { useAuthStore } from "@/store/useAuthStore";
import { DEMO_PATIENT_ID } from "@/data/seed";
import { sleep } from "@/lib/utils";

const DEMO_ACCOUNTS = [
  { id: DEMO_PATIENT_ID, name: "Olivia Taylor", blurb: "Has an upcoming appointment & recall" },
  { id: "pat-wilson-c", name: "Charlotte Wilson", blurb: "Diabetes cycle-of-care patient" },
];

export default function PatientLogin() {
  const navigate = useNavigate();
  const loginPatient = useAuthStore((s) => s.loginPatient);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    await sleep(650);
    loginPatient(DEMO_PATIENT_ID);
    navigate("/patient/app");
  }

  function quickLogin(id: string) {
    loginPatient(id);
    navigate("/patient/app");
  }

  return (
    <AuthShell
      panelTitle="Your care, always a couple of taps away."
      panelBody="Book appointments, track billing and Medicare, and message the practice assistant — anytime, from anywhere."
    >
      <h1 className="font-display text-3xl font-semibold text-ink-900">Patient sign in</h1>
      <p className="mt-2 text-[14px] text-ink-500">New to the practice? <Link to="/patient/signup" className="font-semibold text-teal-700 hover:text-teal-800">Create an account</Link></p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-4">
        <FieldWrap label="Email address" htmlFor="email">
          <Input id="email" type="email" placeholder="you@example.com.au" icon={<Mail size={16} />} value={email} onChange={(e) => setEmail(e.target.value)} required />
        </FieldWrap>
        <FieldWrap label="Password" htmlFor="password">
          <Input id="password" type="password" placeholder="••••••••" icon={<Lock size={16} />} value={password} onChange={(e) => setPassword(e.target.value)} required />
        </FieldWrap>
        <div className="flex items-center justify-between">
          <Checkbox label="Remember me" defaultChecked />
          <span className="cursor-default text-[13px] font-medium text-teal-700">Forgot password?</span>
        </div>
        <Button type="submit" size="lg" className="w-full" loading={loading}>
          Sign in
        </Button>
      </form>

      <div className="mt-8 rounded-xl border border-dashed border-teal-300 bg-teal-50/60 p-4">
        <p className="flex items-center gap-1.5 text-[12.5px] font-semibold text-teal-800">
          <Sparkles size={14} /> Prototype demo access
        </p>
        <p className="mt-1 text-[12px] text-ink-500">Skip the form — jump straight into a pre-filled patient account.</p>
        <div className="mt-3 flex flex-col gap-2">
          {DEMO_ACCOUNTS.map((a) => (
            <button
              key={a.id}
              onClick={() => quickLogin(a.id)}
              className="flex items-center justify-between rounded-lg border border-ink-900/8 bg-white px-3.5 py-2.5 text-left hover:border-teal-400 hover:bg-teal-50/50 transition-colors"
            >
              <span>
                <span className="block text-[13px] font-semibold text-ink-800">{a.name}</span>
                <span className="block text-[11.5px] text-ink-400">{a.blurb}</span>
              </span>
              <span className="text-[11px] font-semibold text-teal-700">Use this →</span>
            </button>
          ))}
        </div>
      </div>
    </AuthShell>
  );
}
