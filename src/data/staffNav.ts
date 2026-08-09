import type { LucideIcon } from "lucide-react";
import { BarChart3, FlaskConical, FolderOpen, LayoutDashboard, Receipt, ShieldCheck, UserCog, Users } from "lucide-react";
import type { RolePermissions } from "@/types";

export interface StaffNavItem {
  to: string;
  end?: boolean;
  label: string;
  icon: LucideIcon;
  module: keyof RolePermissions | null;
}

export const STAFF_NAV: StaffNavItem[] = [
  { to: "/staff/app", end: true, label: "Dashboard", icon: LayoutDashboard, module: null },
  { to: "/staff/app/patients", label: "Patient Records", icon: Users, module: "records" },
  { to: "/staff/app/results", label: "Results Inbox", icon: FlaskConical, module: "resultsImaging" },
  { to: "/staff/app/imaging", label: "Imaging & Files", icon: FolderOpen, module: "resultsImaging" },
  { to: "/staff/app/claims", label: "Claims & Billing", icon: Receipt, module: "claims" },
  { to: "/staff/app/reports", label: "Reports", icon: BarChart3, module: "reports" },
  { to: "/staff/app/security", label: "Security & System", icon: ShieldCheck, module: "securityUsers" },
  { to: "/staff/app/users", label: "Users & Access", icon: UserCog, module: "securityUsers" },
];
