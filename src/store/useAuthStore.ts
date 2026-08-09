import { create } from "zustand";
import { persist } from "zustand/middleware";

export type SessionRef =
  | { kind: "patient"; id: string }
  | { kind: "staff"; id: string }
  | null;

interface AuthState {
  session: SessionRef;
  loginPatient: (id: string) => void;
  loginStaff: (id: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      session: null,
      loginPatient: (id) => set({ session: { kind: "patient", id } }),
      loginStaff: (id) => set({ session: { kind: "staff", id } }),
      logout: () => set({ session: null }),
    }),
    { name: "smp-auth-v1" }
  )
);
