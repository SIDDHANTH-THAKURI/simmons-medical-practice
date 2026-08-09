import { useState } from "react";
import { motion } from "framer-motion";
import { Check, Lock, MinusCircle, UserCog } from "lucide-react";
import { Container } from "@/components/Container";
import { defaultPermissions, moduleLabels, roleLabels } from "@/data/permissions";
import type { StaffRole } from "@/types";
import { cn } from "@/lib/utils";

const ROLES: StaffRole[] = ["owner", "delegated_admin", "gp", "nurse", "reception", "specialist"];

const FEATURES = [
  "Role-based access, enforced by the data layer — not just hidden buttons",
  "A live analytics dashboard built for a practice owner, not an IT admin",
  "Every record view logged automatically, ready for a compliance audit",
  "One login per person — no more shared credentials between staff",
];

function LevelIcon({ level }: { level: string }) {
  if (level === "full") return <Check size={14} className="text-[#006300]" />;
  if (level === "none") return <MinusCircle size={14} className="text-ink-300" />;
  return <Lock size={13} className="text-amber-600" />;
}

export function StaffFeatures() {
  const [role, setRole] = useState<StaffRole>("owner");
  const perms = defaultPermissions[role];

  return (
    <section id="staff" className="py-24 lg:py-32">
      <Container className="grid grid-cols-1 gap-16 lg:grid-cols-2 lg:items-center">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6 }}
          className="order-2 rounded-2xl border border-ink-900/8 bg-white p-6 shadow-[var(--shadow-lifted)] lg:order-1"
        >
          <div className="flex items-center gap-2 text-ink-500">
            <UserCog size={16} />
            <p className="text-[12px] font-semibold uppercase tracking-wider">Try it — pick a role</p>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {ROLES.map((r) => (
              <button
                key={r}
                onClick={() => setRole(r)}
                className={cn(
                  "rounded-full px-3 py-1.5 text-[12.5px] font-medium transition-colors",
                  role === r ? "bg-teal-800 text-white" : "bg-cream-100 text-ink-600 hover:bg-cream-200"
                )}
              >
                {roleLabels[r]}
              </button>
            ))}
          </div>

          <motion.div
            key={role}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            className="mt-5 divide-y divide-ink-900/6 rounded-xl border border-ink-900/8 overflow-hidden"
          >
            {(Object.keys(moduleLabels) as (keyof typeof moduleLabels)[]).map((mod) => (
              <div key={mod} className="flex items-center justify-between bg-cream-25 px-4 py-3">
                <span className="text-[13px] text-ink-700">{moduleLabels[mod]}</span>
                <span className="inline-flex items-center gap-1.5 text-[12px] font-medium text-ink-500">
                  <LevelIcon level={perms[mod]} />
                  {perms[mod] === "full" && "Full access"}
                  {perms[mod] === "read" && "Read only"}
                  {perms[mod] === "own" && "Own patients"}
                  {perms[mod] === "none" && "No access"}
                </span>
              </div>
            ))}
          </motion.div>
          <p className="mt-4 text-[12px] leading-relaxed text-ink-400">
            This is the actual permission matrix behind the staff portal — sign in as any role to see it applied for real.
          </p>
        </motion.div>

        <div className="order-1 lg:order-2">
          <p className="text-[13px] font-semibold uppercase tracking-wider text-terracotta-600">For the practice team</p>
          <h2 className="mt-3 font-display text-4xl font-semibold text-ink-900 text-balance">
            Everyone sees exactly what their role needs.
          </h2>
          <p className="mt-4 max-w-lg text-[16px] text-ink-600 text-balance">
            From reception to the practice owner, access is scoped by role — and for Dr Simmons, that means a
            portal that surfaces what matters without needing an IT background to use it.
          </p>
          <ul className="mt-8 space-y-4">
            {FEATURES.map((f) => (
              <li key={f} className="flex items-start gap-3">
                <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-teal-100 text-teal-700">
                  <Check size={12} />
                </span>
                <span className="text-[14.5px] leading-relaxed text-ink-700">{f}</span>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </section>
  );
}
