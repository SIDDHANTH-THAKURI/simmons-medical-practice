import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronDown, Lock, Mail } from "lucide-react";
import { AuthShell } from "@/components/auth/AuthShell";
import { Button } from "@/components/ui/Button";
import { FieldWrap, Input } from "@/components/ui/Field";
import { Avatar } from "@/components/ui/Avatar";
import { useAuthStore } from "@/store/useAuthStore";
import { roleCardStaffId, staffById } from "@/data/providers";
import { defaultPermissions, roleDescriptions, roleLabels } from "@/data/permissions";
import type { StaffRole } from "@/types";
import { sleep } from "@/lib/utils";
import { cn } from "@/lib/utils";

const ROLES: StaffRole[] = ["owner", "delegated_admin", "gp", "nurse", "reception", "specialist"];

function fullCount(role: StaffRole) {
  return Object.values(defaultPermissions[role]).filter((v) => v === "full").length;
}

export default function StaffLogin() {
  const navigate = useNavigate();
  const loginStaff = useAuthStore((s) => s.loginStaff);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);

  function signInAs(role: StaffRole) {
    loginStaff(roleCardStaffId[role]);
    navigate("/staff/app");
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    await sleep(600);
    signInAs("owner");
  }

  return (
    <AuthShell
      side="ink"
      backTo="/portal"
      panelTitle="Every role, exactly the access it needs."
      panelBody="From reception to the practice owner — sign in as any role below to see the staff portal adapt in real time."
    >
      <h1 className="font-display text-3xl font-semibold text-ink-900">Staff sign in</h1>
      <p className="mt-2 text-[14px] text-ink-500">Select your role to continue — this mirrors the practice's real access model.</p>

      <div className="mt-7 grid grid-cols-1 gap-3 sm:grid-cols-2">
        {ROLES.map((role) => {
          const staff = staffById(roleCardStaffId[role]);
          if (!staff) return null;
          return (
            <button
              key={role}
              onClick={() => signInAs(role)}
              className="group flex flex-col items-start rounded-xl border border-ink-900/10 bg-white p-4 text-left transition-all hover:-translate-y-0.5 hover:border-teal-400 hover:shadow-[var(--shadow-card)]"
            >
              <div className="flex w-full items-center gap-3">
                <Avatar name={`${staff.firstName} ${staff.lastName}`} color={staff.avatarColor} size={38} />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[13.5px] font-semibold text-ink-900">{staff.firstName} {staff.lastName}</p>
                  <p className="truncate text-[11.5px] text-ink-400">{roleLabels[role]}</p>
                </div>
              </div>
              <p className="mt-2.5 text-[11.5px] leading-snug text-ink-500">{roleDescriptions[role]}</p>
              <div className="mt-3 flex items-center justify-between w-full">
                <span className={cn("text-[10.5px] font-semibold rounded-full px-2 py-0.5", fullCount(role) >= 4 ? "bg-teal-100 text-teal-700" : "bg-cream-200 text-ink-500")}>
                  {fullCount(role)}/5 modules full access
                </span>
                <span className="text-[11.5px] font-semibold text-teal-700 opacity-0 group-hover:opacity-100 transition-opacity">Sign in →</span>
              </div>
            </button>
          );
        })}
      </div>

      <button
        onClick={() => setShowForm((s) => !s)}
        className="mt-6 flex w-full items-center justify-center gap-1.5 text-[13px] font-medium text-ink-400 hover:text-ink-600"
      >
        or sign in with email <ChevronDown size={14} className={cn("transition-transform", showForm && "rotate-180")} />
      </button>

      {showForm && (
        <form onSubmit={handleSubmit} className="mt-4 space-y-3 border-t border-ink-900/8 pt-5">
          <FieldWrap label="Work email" htmlFor="semail">
            <Input id="semail" type="email" icon={<Mail size={16} />} placeholder="you@simmonsmedical.com.au" required />
          </FieldWrap>
          <FieldWrap label="Password" htmlFor="spass">
            <Input id="spass" type="password" icon={<Lock size={16} />} placeholder="••••••••" required />
          </FieldWrap>
          <Button type="submit" size="lg" className="w-full" loading={loading}>Sign in</Button>
        </form>
      )}
    </AuthShell>
  );
}
