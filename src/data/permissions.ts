import type { PermissionLevel, RolePermissions, StaffRole } from "@/types";

// Mirrors "Access Control & Identity" (proposal deck, p.15) exactly.
// Enforced centrally here — a locked module simply doesn't render for the
// signed-in role, echoing the deck's line: access is enforced by the data
// layer, not the screen.
export const defaultPermissions: Record<StaffRole, RolePermissions> = {
  owner: {
    records: "full",
    resultsImaging: "full",
    claims: "full",
    reports: "full",
    securityUsers: "full",
  },
  delegated_admin: {
    records: "full",
    resultsImaging: "full",
    claims: "read",
    reports: "full",
    securityUsers: "read",
  },
  gp: {
    records: "full",
    resultsImaging: "full",
    claims: "read",
    reports: "read",
    securityUsers: "none",
  },
  nurse: {
    records: "full",
    resultsImaging: "read",
    claims: "none",
    reports: "none",
    securityUsers: "none",
  },
  reception: {
    records: "read",
    resultsImaging: "none",
    claims: "none",
    reports: "none",
    securityUsers: "none",
  },
  specialist: {
    records: "own",
    resultsImaging: "own",
    claims: "read",
    reports: "none",
    securityUsers: "none",
  },
};

export const roleLabels: Record<StaffRole, string> = {
  owner: "Owner",
  delegated_admin: "Delegated Admin",
  gp: "GP / Clinician",
  nurse: "Nurse",
  reception: "Reception",
  specialist: "Visiting Specialist",
};

export const roleDescriptions: Record<StaffRole, string> = {
  owner: "Full administrative access across every module",
  delegated_admin: "Practice management access, delegated by the owner",
  gp: "Full clinical access to own and shared patient records",
  nurse: "Clinical access for treatment, results and recalls",
  reception: "Front-desk scheduling and read-only patient lookup",
  specialist: "Segregated access — own patients only",
};

export const permissionLabels: Record<PermissionLevel, string> = {
  full: "Full access",
  read: "Read only",
  own: "Own patients only",
  none: "No access",
};

export const permissionDot: Record<PermissionLevel, string> = {
  full: "●",
  read: "◐",
  own: "◑",
  none: "–",
};

export const moduleLabels: Record<keyof RolePermissions, string> = {
  records: "Patient Records",
  resultsImaging: "Results & Imaging",
  claims: "Claims & Billing",
  reports: "Reports",
  securityUsers: "Security & Users",
};

export function canAccess(level: PermissionLevel): boolean {
  return level !== "none";
}

export function canEdit(level: PermissionLevel): boolean {
  return level === "full";
}
