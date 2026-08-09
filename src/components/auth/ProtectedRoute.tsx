import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuthStore } from "@/store/useAuthStore";

export function ProtectedRoute({ kind, children }: { kind: "patient" | "staff"; children: ReactNode }) {
  const session = useAuthStore((s) => s.session);

  if (!session || session.kind !== kind) {
    return <Navigate to={kind === "patient" ? "/patient/login" : "/staff/login"} replace />;
  }

  return <>{children}</>;
}
