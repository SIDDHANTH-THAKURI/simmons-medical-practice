import { create } from "zustand";
import { persist } from "zustand/middleware";
import { buildSeedData } from "@/data/seed";
import { defaultPermissions } from "@/data/permissions";
import { avatarPalette } from "@/data/patients";
import type {
  Appointment,
  AppointmentStatus,
  AuditLogEntry,
  BookingChannel,
  Claim,
  ClaimStatus,
  Invoice,
  Notification,
  NotifyPrefs,
  PatientDocument,
  PatientUser,
  Recall,
  Reminder,
  RolePermissions,
  StaffUser,
} from "@/types";
import { uid } from "@/lib/utils";

interface NewAppointmentInput {
  patientId: string;
  providerId: string;
  reason: string;
  type: string;
  durationMins: number;
  scheduledAt: string;
  channel: BookingChannel;
  notes?: string;
}

interface NewPatientInput {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dob: string;
  medicareNumber?: string;
  registeredProviderId: string;
}

interface AppState {
  patients: PatientUser[];
  appointments: Appointment[];
  claims: Claim[];
  invoices: Invoice[];
  documents: PatientDocument[];
  reminders: Reminder[];
  recalls: Recall[];
  auditLog: AuditLogEntry[];
  notifications: Notification[];
  permissionOverrides: Record<string, Partial<RolePermissions>>;
  seededAt: string;

  addAppointment: (input: NewAppointmentInput) => Appointment;
  cancelAppointment: (id: string, actor: string) => void;
  rescheduleAppointment: (id: string, newScheduledAt: string, actor: string) => void;
  updateAppointmentStatus: (id: string, status: AppointmentStatus) => void;
  checkInAppointment: (id: string) => void;

  payInvoice: (id: string, method: string) => void;
  updateClaimStatus: (id: string, status: ClaimStatus, reason?: string) => void;
  markDocumentReviewed: (id: string) => void;
  updateRecallStatus: (id: string, status: Recall["status"]) => void;

  addPatient: (input: NewPatientInput) => PatientUser;
  updateNotifyPrefs: (patientId: string, prefs: NotifyPrefs) => void;
  updatePatient: (patientId: string, patch: Partial<PatientUser>) => void;

  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: (patientId: string) => void;
  pushNotification: (n: Omit<Notification, "id" | "createdAt" | "read">) => void;

  logAudit: (entry: Omit<AuditLogEntry, "id" | "timestamp">) => void;

  setPermissionOverride: (staffId: string, patch: Partial<RolePermissions>) => void;
  resetPermissionOverrides: (staffId?: string) => void;
  getEffectivePermissions: (staff: StaffUser) => RolePermissions;

  resetAllData: () => void;
}

function freshState() {
  const seed = buildSeedData();
  return {
    ...seed,
    permissionOverrides: {} as Record<string, Partial<RolePermissions>>,
    seededAt: new Date().toISOString(),
  };
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      ...freshState(),

      addAppointment: (input) => {
        const appt: Appointment = {
          id: uid("appt"),
          patientId: input.patientId,
          providerId: input.providerId,
          reason: input.reason,
          type: input.type,
          scheduledAt: input.scheduledAt,
          durationMins: input.durationMins,
          status: "confirmed",
          channel: input.channel,
          notes: input.notes,
          reminderSent: false,
          reminderConfirmed: false,
          createdAt: new Date().toISOString(),
        };
        set((s) => ({ appointments: [...s.appointments, appt] }));
        const patient = get().patients.find((p) => p.id === input.patientId);
        get().pushNotification({
          patientId: input.patientId,
          kind: "system",
          title: "Appointment booked",
          body: `${input.reason} confirmed for ${new Date(input.scheduledAt).toLocaleDateString("en-AU", { weekday: "long", day: "numeric", month: "short" })}.`,
        });
        get().logAudit({
          actorName: patient ? `${patient.firstName} ${patient.lastName}` : "Patient",
          actorRole: "patient",
          action: input.channel === "ai-assistant" ? "booked via AI assistant" : "booked appointment",
          target: input.reason,
          module: "patients",
        });
        return appt;
      },

      cancelAppointment: (id, actor) => {
        set((s) => ({
          appointments: s.appointments.map((a) => (a.id === id ? { ...a, status: "cancelled" } : a)),
        }));
        const appt = get().appointments.find((a) => a.id === id);
        if (appt) {
          get().pushNotification({
            patientId: appt.patientId,
            kind: "system",
            title: "Appointment cancelled",
            body: `${appt.reason} on ${new Date(appt.scheduledAt).toLocaleDateString("en-AU", { day: "numeric", month: "short" })} has been cancelled.`,
          });
          get().logAudit({ actorName: actor, actorRole: "patient", action: "cancelled appointment", target: appt.reason, module: "patients" });
        }
      },

      rescheduleAppointment: (id, newScheduledAt, actor) => {
        set((s) => ({
          appointments: s.appointments.map((a) =>
            a.id === id ? { ...a, scheduledAt: newScheduledAt, status: "confirmed", reminderSent: false, reminderConfirmed: false } : a
          ),
        }));
        const appt = get().appointments.find((a) => a.id === id);
        if (appt) {
          get().pushNotification({
            patientId: appt.patientId,
            kind: "system",
            title: "Appointment rescheduled",
            body: `${appt.reason} moved to ${new Date(newScheduledAt).toLocaleDateString("en-AU", { weekday: "long", day: "numeric", month: "short" })}.`,
          });
          get().logAudit({ actorName: actor, actorRole: "patient", action: "rescheduled appointment", target: appt.reason, module: "patients" });
        }
      },

      updateAppointmentStatus: (id, status) => {
        set((s) => ({ appointments: s.appointments.map((a) => (a.id === id ? { ...a, status } : a)) }));
      },

      checkInAppointment: (id) => {
        set((s) => ({
          appointments: s.appointments.map((a) => (a.id === id ? { ...a, checkedInAt: new Date().toISOString() } : a)),
        }));
      },

      payInvoice: (id, method) => {
        set((s) => ({
          invoices: s.invoices.map((inv) =>
            inv.id === id ? { ...inv, status: "paid", paidAt: new Date().toISOString(), paymentMethod: method } : inv
          ),
        }));
        const inv = get().invoices.find((i) => i.id === id);
        if (inv) {
          get().pushNotification({
            patientId: inv.patientId,
            kind: "billing",
            title: "Payment received",
            body: `Thanks — your payment of $${inv.gapPayment.toFixed(2)} has been received.`,
          });
        }
      },

      updateClaimStatus: (id, status, reason) => {
        set((s) => ({
          claims: s.claims.map((c) =>
            c.id === id
              ? { ...c, claimStatus: status, rejectionReason: status === "rejected" ? reason : undefined, processedAt: new Date().toISOString() }
              : c
          ),
        }));
      },

      markDocumentReviewed: (id) => {
        set((s) => ({
          documents: s.documents.map((d) => (d.id === id ? { ...d, reviewed: true, flaggedForReview: false } : d)),
        }));
      },

      updateRecallStatus: (id, status) => {
        set((s) => ({ recalls: s.recalls.map((r) => (r.id === id ? { ...r, status } : r)) }));
      },

      addPatient: (input) => {
        const patient: PatientUser = {
          kind: "patient",
          id: uid("pat"),
          firstName: input.firstName,
          lastName: input.lastName,
          email: input.email,
          phone: input.phone,
          dob: input.dob,
          medicareNumber: input.medicareNumber ?? "",
          medicareRefNo: "1",
          medicareExpiry: "",
          address: "",
          suburb: "Toowong QLD 4066",
          avatarColor: avatarPalette[get().patients.length % avatarPalette.length],
          registeredProviderId: input.registeredProviderId,
          notifyPrefs: { sms: true, email: true, reminderHoursBefore: 24 },
          emergencyContact: { name: "", relationship: "", phone: "" },
          createdAt: new Date().toISOString(),
        };
        set((s) => ({ patients: [...s.patients, patient] }));
        get().logAudit({
          actorName: `${patient.firstName} ${patient.lastName}`,
          actorRole: "patient",
          action: "created patient account",
          target: "Sign up",
          module: "patients",
        });
        return patient;
      },

      updateNotifyPrefs: (patientId, prefs) => {
        set((s) => ({
          patients: s.patients.map((p) => (p.id === patientId ? { ...p, notifyPrefs: prefs } : p)),
        }));
      },

      updatePatient: (patientId, patch) => {
        set((s) => ({
          patients: s.patients.map((p) => (p.id === patientId ? { ...p, ...patch } : p)),
        }));
      },

      markNotificationRead: (id) => {
        set((s) => ({ notifications: s.notifications.map((n) => (n.id === id ? { ...n, read: true } : n)) }));
      },

      markAllNotificationsRead: (patientId) => {
        set((s) => ({
          notifications: s.notifications.map((n) => (n.patientId === patientId ? { ...n, read: true } : n)),
        }));
      },

      pushNotification: (n) => {
        set((s) => ({
          notifications: [
            { ...n, id: uid("notif"), createdAt: new Date().toISOString(), read: false },
            ...s.notifications,
          ],
        }));
      },

      logAudit: (entry) => {
        set((s) => ({
          auditLog: [
            { ...entry, id: uid("audit"), timestamp: new Date().toISOString() },
            ...s.auditLog,
          ].slice(0, 400),
        }));
      },

      setPermissionOverride: (staffId, patch) => {
        set((s) => ({
          permissionOverrides: {
            ...s.permissionOverrides,
            [staffId]: { ...s.permissionOverrides[staffId], ...patch },
          },
        }));
      },

      resetPermissionOverrides: (staffId) => {
        set((s) => {
          if (!staffId) return { permissionOverrides: {} };
          const next = { ...s.permissionOverrides };
          delete next[staffId];
          return { permissionOverrides: next };
        });
      },

      getEffectivePermissions: (staff) => {
        const base = defaultPermissions[staff.role];
        const override = get().permissionOverrides[staff.id];
        return override ? { ...base, ...override } : base;
      },

      resetAllData: () => set({ ...freshState() }),
    }),
    {
      name: "smp-app-data-v1",
      partialize: (s) => ({
        patients: s.patients,
        appointments: s.appointments,
        claims: s.claims,
        invoices: s.invoices,
        documents: s.documents,
        reminders: s.reminders,
        recalls: s.recalls,
        auditLog: s.auditLog,
        notifications: s.notifications,
        permissionOverrides: s.permissionOverrides,
        seededAt: s.seededAt,
      }),
    }
  )
);
