import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Phone, User } from "lucide-react";
import { AuthShell } from "@/components/auth/AuthShell";
import { Button } from "@/components/ui/Button";
import { Checkbox, FieldWrap, Input, Select } from "@/components/ui/Field";
import { useAuthStore } from "@/store/useAuthStore";
import { useAppStore } from "@/store/useAppStore";
import { useToastStore } from "@/store/useToastStore";
import { providers } from "@/data/providers";
import { sleep } from "@/lib/utils";

export default function PatientSignup() {
  const navigate = useNavigate();
  const loginPatient = useAuthStore((s) => s.loginPatient);
  const addPatient = useAppStore((s) => s.addPatient);
  const showToast = useToastStore((s) => s.show);

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    dob: "",
    medicare: "",
    providerId: providers[0].id,
  });
  const [loading, setLoading] = useState(false);

  function update<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    await sleep(700);
    const patient = addPatient({
      firstName: form.firstName,
      lastName: form.lastName,
      email: form.email,
      phone: form.phone,
      dob: form.dob,
      medicareNumber: form.medicare,
      registeredProviderId: form.providerId,
    });
    loginPatient(patient.id);
    showToast({ variant: "success", title: `Welcome, ${patient.firstName}!`, description: "Your patient account has been created." });
    navigate("/patient/app");
  }

  return (
    <AuthShell
      side="ink"
      panelTitle="Joining takes less time than the hold music."
      panelBody="Tell us a little about yourself and you're straight into the portal — no separate paperwork, no waiting for a welcome email."
    >
      <h1 className="font-display text-3xl font-semibold text-ink-900">Create your account</h1>
      <p className="mt-2 text-[14px] text-ink-500">
        Already registered? <Link to="/patient/login" className="font-semibold text-teal-700 hover:text-teal-800">Sign in</Link>
      </p>

      <form onSubmit={handleSubmit} className="mt-7 space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <FieldWrap label="First name" htmlFor="firstName" required>
            <Input id="firstName" icon={<User size={16} />} value={form.firstName} onChange={(e) => update("firstName", e.target.value)} required />
          </FieldWrap>
          <FieldWrap label="Last name" htmlFor="lastName" required>
            <Input id="lastName" value={form.lastName} onChange={(e) => update("lastName", e.target.value)} required />
          </FieldWrap>
        </div>

        <FieldWrap label="Email address" htmlFor="email" required>
          <Input id="email" type="email" icon={<Mail size={16} />} value={form.email} onChange={(e) => update("email", e.target.value)} required />
        </FieldWrap>

        <div className="grid grid-cols-2 gap-3">
          <FieldWrap label="Mobile number" htmlFor="phone" required>
            <Input id="phone" icon={<Phone size={16} />} placeholder="04xx xxx xxx" value={form.phone} onChange={(e) => update("phone", e.target.value)} required />
          </FieldWrap>
          <FieldWrap label="Date of birth" htmlFor="dob" required>
            <Input id="dob" type="date" value={form.dob} onChange={(e) => update("dob", e.target.value)} required />
          </FieldWrap>
        </div>

        <FieldWrap label="Medicare number" htmlFor="medicare" hint="Optional — you can add this later from Profile.">
          <Input id="medicare" placeholder="2953 27418 1" value={form.medicare} onChange={(e) => update("medicare", e.target.value)} />
        </FieldWrap>

        <FieldWrap label="Preferred GP" htmlFor="provider">
          <Select id="provider" value={form.providerId} onChange={(e) => update("providerId", e.target.value)}>
            {providers.filter((p) => p.type === "gp").map((p) => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
            <option value={providers[0].id}>No preference</option>
          </Select>
        </FieldWrap>

        <Checkbox required label={<span>I agree to the <span className="font-medium text-ink-700">Privacy Policy</span> and <span className="font-medium text-ink-700">Terms of Use</span></span>} />

        <Button type="submit" size="lg" className="w-full" loading={loading}>
          Create account
        </Button>
      </form>
    </AuthShell>
  );
}
