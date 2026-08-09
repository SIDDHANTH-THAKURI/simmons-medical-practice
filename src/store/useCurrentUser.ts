import { useAuthStore } from "./useAuthStore";
import { useAppStore } from "./useAppStore";
import { staffById } from "@/data/providers";
import type { PatientUser, RolePermissions, StaffUser } from "@/types";

export function useCurrentPatient(): PatientUser | null {
  const session = useAuthStore((s) => s.session);
  const patients = useAppStore((s) => s.patients);
  if (session?.kind !== "patient") return null;
  return patients.find((p) => p.id === session.id) ?? null;
}

export function useCurrentStaff(): StaffUser | null {
  const session = useAuthStore((s) => s.session);
  if (session?.kind !== "staff") return null;
  return staffById(session.id) ?? null;
}

export function useIsAuthenticated(): boolean {
  return useAuthStore((s) => s.session !== null);
}

export function useMyPermissions(): RolePermissions | null {
  const staff = useCurrentStaff();
  const getEffective = useAppStore((s) => s.getEffectivePermissions);
  if (!staff) return null;
  return getEffective(staff);
}

export function useModuleAccess(module: keyof RolePermissions) {
  const perms = useMyPermissions();
  return perms ? perms[module] : "none";
}
