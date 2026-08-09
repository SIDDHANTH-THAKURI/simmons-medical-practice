import type {
  Appointment,
  AppointmentStatus,
  AuditLogEntry,
  BookingChannel,
  Claim,
  Invoice,
  Notification,
  PatientDocument,
  PatientUser,
  Recall,
  Reminder,
  StaffRole,
} from "@/types";
import { Rng } from "./rng";
import { providers, staffDirectory } from "./providers";
import { buildPatients, patientFlavorById, type PatientFlavor } from "./patients";

export const DEMO_PATIENT_ID = "pat-taylor-o";
export const DEMO_CHILD_PATIENT_ID = "pat-brown-n";

interface ApptKind {
  reason: string;
  type: string;
  duration: number;
}

const APPT_KINDS: Record<PatientFlavor, ApptKind[]> = {
  diabetes: [
    { reason: "Diabetes cycle of care review", type: "Care Plan", duration: 30 },
    { reason: "HbA1c results review", type: "Standard Consult", duration: 15 },
    { reason: "Diabetic foot check", type: "Long Consult", duration: 30 },
  ],
  hypertension: [
    { reason: "Blood pressure review", type: "Standard Consult", duration: 15 },
    { reason: "Medication review — hypertension", type: "Long Consult", duration: 30 },
  ],
  asthma: [
    { reason: "Asthma review", type: "Standard Consult", duration: 15 },
    { reason: "Asthma action plan update", type: "Long Consult", duration: 30 },
  ],
  antenatal: [
    { reason: "Antenatal shared-care visit", type: "Antenatal Visit", duration: 30 },
    { reason: "Pregnancy check-up", type: "Antenatal Visit", duration: 30 },
  ],
  immunisation: [
    { reason: "Childhood immunisation", type: "Immunisation", duration: 15 },
    { reason: "Vaccination catch-up", type: "Immunisation", duration: 15 },
  ],
  "skin-check": [
    { reason: "Full skin check", type: "Skin Check", duration: 30 },
    { reason: "Mole review", type: "Standard Consult", duration: 15 },
    { reason: "Suspicious lesion review", type: "Skin Procedure", duration: 45 },
  ],
  "mental-health-plan": [
    { reason: "Mental health care plan review", type: "Mental Health Consult", duration: 30 },
    { reason: "GP mental health consultation", type: "Mental Health Consult", duration: 30 },
  ],
  "cervical-screening": [
    { reason: "Cervical screening test", type: "Screening Test", duration: 15 },
    { reason: "Women's health check", type: "Long Consult", duration: 30 },
  ],
  cardiac: [
    { reason: "Cardiac review", type: "Long Consult", duration: 30 },
    { reason: "Heart health check", type: "Care Plan", duration: 30 },
    { reason: "ECG review", type: "Standard Consult", duration: 15 },
  ],
  none: [
    { reason: "General consultation", type: "Standard Consult", duration: 15 },
    { reason: "Prescription renewal", type: "Standard Consult", duration: 15 },
    { reason: "Sick certificate", type: "Standard Consult", duration: 15 },
    { reason: "Follow-up review", type: "Standard Consult", duration: 15 },
    { reason: "Health check", type: "Long Consult", duration: 30 },
  ],
};

const KIM_KINDS: ApptKind[] = [
  { reason: "Full skin check", type: "Skin Check", duration: 30 },
  { reason: "Mole mapping", type: "Skin Check", duration: 45 },
  { reason: "Suspicious lesion review", type: "Skin Procedure", duration: 30 },
  { reason: "Skin lesion excision", type: "Skin Procedure", duration: 45 },
];

export const TYPE_MBS: Record<string, { item: string; desc: string; fee: number }> = {
  "Standard Consult": { item: "23", desc: "Level B standard consultation", fee: 41.4 },
  "Long Consult": { item: "36", desc: "Level C long consultation", fee: 79.7 },
  "Extended Consult": { item: "44", desc: "Level D extended consultation", fee: 116.35 },
  "Care Plan": { item: "721", desc: "GP Management Plan", fee: 153.05 },
  "Mental Health Consult": { item: "2713", desc: "GP Mental Health Treatment Plan", fee: 101.75 },
  Immunisation: { item: "10991", desc: "Immunisation service", fee: 13.05 },
  "Antenatal Visit": { item: "16500", desc: "Antenatal attendance", fee: 69.35 },
  "Screening Test": { item: "2497", desc: "Cervical Screening Test attendance", fee: 41.4 },
  "Skin Check": { item: "701", desc: "Health assessment — skin check", fee: 61.85 },
  "Skin Procedure": { item: "31356", desc: "Excision of skin lesion", fee: 155.0 },
};

const REJECTION_REASONS = [
  "Incorrect MBS item for consultation length",
  "Duplicate claim already processed",
  "Patient Medicare details expired",
  "Referral not on file",
  "Provider number mismatch",
];

function startOfDay(d: Date): Date {
  const c = new Date(d);
  c.setHours(0, 0, 0, 0);
  return c;
}

function addDays(d: Date, n: number): Date {
  const c = new Date(d);
  c.setDate(c.getDate() + n);
  return c;
}

function atTime(d: Date, h: number, m: number): Date {
  const c = new Date(d);
  c.setHours(h, m, 0, 0);
  return c;
}

function slotCandidates(): { h: number; m: number }[] {
  const slots: { h: number; m: number }[] = [];
  for (let h = 8; h < 17; h++) {
    for (let m = 0; m < 60; m += 15) {
      if (h === 8 && m < 30) continue;
      if (h === 12 && m >= 30) continue;
      if (h === 13 && m < 15) continue;
      slots.push({ h, m });
    }
  }
  return slots;
}

function pastStatus(rng: Rng): AppointmentStatus {
  const r = rng.next();
  if (r < 0.78) return "completed";
  if (r < 0.9) return "no-show";
  if (r < 0.95) return "cancelled";
  return "rescheduled";
}

function channelFor(rng: Rng): BookingChannel {
  const r = rng.next();
  if (r < 0.54) return "online";
  if (r < 0.88) return "phone";
  if (r < 0.96) return "ai-assistant";
  return "walk-in";
}

export interface SeedData {
  patients: PatientUser[];
  appointments: Appointment[];
  claims: Claim[];
  invoices: Invoice[];
  documents: PatientDocument[];
  reminders: Reminder[];
  recalls: Recall[];
  auditLog: AuditLogEntry[];
  notifications: Notification[];
}

export function buildSeedData(): SeedData {
  const rng = new Rng(20260726);
  const patients = buildPatients();
  const patientById = new Map(patients.map((p) => [p.id, p]));
  const now = new Date();
  const today = startOfDay(now);
  const PAST_DAYS = 28;
  const FUTURE_DAYS = 14;

  const ownPoolByProvider = new Map<string, PatientUser[]>();
  for (const prov of providers) {
    ownPoolByProvider.set(
      prov.id,
      patients.filter((p) => p.registeredProviderId === prov.id)
    );
  }
  const skinCheckPool = patients.filter((p) => patientFlavorById[p.id] === "skin-check");

  const appointments: Appointment[] = [];
  let apptCounter = 0;

  for (const prov of providers) {
    for (let offset = -PAST_DAYS; offset <= FUTURE_DAYS; offset++) {
      const date = addDays(today, offset);
      if (!prov.availableDays.includes(date.getDay())) continue;

      const candidates = rng.shuffle(slotCandidates());
      const count = prov.type === "specialist" ? rng.int(7, 11) : rng.int(6, 10);
      const chosen = candidates.slice(0, count).sort((a, b) => a.h - b.h || a.m - b.m);

      for (const slot of chosen) {
        const scheduledAt = atTime(date, slot.h, slot.m);

        let patient: PatientUser;
        if (prov.type === "specialist") {
          patient = rng.bool(0.75) && skinCheckPool.length
            ? rng.pick(skinCheckPool)
            : rng.pick(patients);
        } else {
          const ownPool = ownPoolByProvider.get(prov.id)!;
          patient = rng.bool(0.8) && ownPool.length ? rng.pick(ownPool) : rng.pick(patients);
        }

        const flavor = patientFlavorById[patient.id] ?? "none";
        const kind = prov.type === "specialist" ? rng.pick(KIM_KINDS) : rng.pick(APPT_KINDS[flavor]);

        let status: AppointmentStatus;
        if (offset > 0) {
          status = rng.bool(0.82) ? "confirmed" : "pending";
        } else if (offset === 0) {
          status = scheduledAt.getTime() < now.getTime()
            ? (rng.bool(0.88) ? "completed" : "no-show")
            : (rng.bool(0.75) ? "confirmed" : "pending");
        } else {
          status = pastStatus(rng);
        }

        const channel = channelFor(rng);
        const reminderSent = status !== "cancelled" && rng.bool(0.92);
        const reminderConfirmed = reminderSent && channel !== "walk-in" && status !== "no-show" && rng.bool(0.72);

        apptCounter++;
        appointments.push({
          id: `appt-${apptCounter.toString().padStart(4, "0")}`,
          patientId: patient.id,
          providerId: prov.id,
          reason: kind.reason,
          type: kind.type,
          scheduledAt: scheduledAt.toISOString(),
          durationMins: kind.duration,
          status,
          channel,
          reminderSent,
          reminderConfirmed,
          checkedInAt: status === "completed" ? new Date(scheduledAt.getTime() - rng.int(2, 12) * 60000).toISOString() : undefined,
          createdAt: new Date(scheduledAt.getTime() - rng.int(1, 20) * 86400000).toISOString(),
        });
      }
    }
  }

  // Spotlight: guarantee the two patients referenced by name in the ABC
  // Partners deck (audit-log examples) have a rich, presentable history.
  const chen = "prov-chen";
  const ho = "prov-ho";
  appointments.push({
    id: "appt-spotlight-01",
    patientId: DEMO_PATIENT_ID,
    providerId: chen,
    reason: "Mental health care plan review",
    type: "Mental Health Consult",
    scheduledAt: atTime(addDays(today, 4), 10, 0).toISOString(),
    durationMins: 30,
    status: "confirmed",
    channel: "online",
    reminderSent: true,
    reminderConfirmed: true,
    createdAt: addDays(today, -3).toISOString(),
  });
  appointments.push({
    id: "appt-spotlight-02",
    patientId: DEMO_PATIENT_ID,
    providerId: chen,
    reason: "Prescription renewal",
    type: "Standard Consult",
    scheduledAt: atTime(addDays(today, 11), 14, 30).toISOString(),
    durationMins: 15,
    status: "pending",
    channel: "ai-assistant",
    reminderSent: false,
    createdAt: addDays(today, -1).toISOString(),
  });
  appointments.push({
    id: "appt-spotlight-03",
    patientId: DEMO_CHILD_PATIENT_ID,
    providerId: ho,
    reason: "Childhood immunisation",
    type: "Immunisation",
    scheduledAt: atTime(addDays(today, -6), 9, 15).toISOString(),
    durationMins: 15,
    status: "completed",
    channel: "phone",
    reminderSent: true,
    reminderConfirmed: true,
    checkedInAt: atTime(addDays(today, -6), 9, 10).toISOString(),
    createdAt: addDays(today, -14).toISOString(),
  });

  // ---- Claims -------------------------------------------------------
  const claims: Claim[] = [];
  let claimCounter = 0;
  for (const appt of appointments) {
    if (appt.status !== "completed") continue;
    const mbs = TYPE_MBS[appt.type] ?? TYPE_MBS["Standard Consult"];
    const r = rng.next();
    const isRecent = new Date(appt.scheduledAt).getTime() > now.getTime() - 5 * 86400000;
    const claimStatus = isRecent && r < 0.15 ? "pending" : r < 0.08 ? "rejected" : "paid";
    const submittedAt = new Date(new Date(appt.scheduledAt).getTime() + rng.int(1, 6) * 3600000);
    claimCounter++;
    claims.push({
      id: `claim-${claimCounter.toString().padStart(4, "0")}`,
      appointmentId: appt.id,
      patientId: appt.patientId,
      providerId: appt.providerId,
      mbsItem: mbs.item,
      description: mbs.desc,
      claimAmount: Math.round((mbs.fee + rng.int(-1, 1)) * 100) / 100,
      claimStatus,
      rejectionReason: claimStatus === "rejected" ? rng.pick(REJECTION_REASONS) : undefined,
      submittedAt: submittedAt.toISOString(),
      processedAt: claimStatus === "pending" ? undefined : new Date(submittedAt.getTime() + rng.int(1, 3) * 86400000).toISOString(),
    });
  }

  // ---- Invoices -------------------------------------------------------
  const invoices: Invoice[] = [];
  let invCounter = 0;
  for (const appt of appointments) {
    const mbs = TYPE_MBS[appt.type] ?? TYPE_MBS["Standard Consult"];
    if (appt.status === "completed") {
      const hasGap = appt.type === "Skin Procedure" && rng.bool(0.4);
      const gap = hasGap ? rng.int(40, 120) : 0;
      const paid = !hasGap || rng.bool(0.7);
      invCounter++;
      invoices.push({
        id: `inv-${invCounter.toString().padStart(4, "0")}`,
        patientId: appt.patientId,
        appointmentId: appt.id,
        issuedAt: appt.scheduledAt,
        dueAt: new Date(new Date(appt.scheduledAt).getTime() + 14 * 86400000).toISOString(),
        items: [{ description: `${appt.reason} — ${mbs.desc}`, amount: mbs.fee + gap }],
        totalAmount: mbs.fee + gap,
        medicareRebate: mbs.fee,
        gapPayment: gap,
        status: paid ? "paid" : "outstanding",
        paidAt: paid ? appt.scheduledAt : undefined,
        paymentMethod: paid ? rng.pick(["Bulk bill — Medicare", "EFTPOS", "Visa •••• 4471"]) : undefined,
      });
    } else if (appt.status === "no-show") {
      const r = rng.next();
      const status = r < 0.55 ? "outstanding" : r < 0.9 ? "paid" : "processing";
      invCounter++;
      invoices.push({
        id: `inv-${invCounter.toString().padStart(4, "0")}`,
        patientId: appt.patientId,
        appointmentId: appt.id,
        issuedAt: appt.scheduledAt,
        dueAt: new Date(new Date(appt.scheduledAt).getTime() + 14 * 86400000).toISOString(),
        items: [{ description: "Non-attendance fee — missed appointment", amount: 50 }],
        totalAmount: 50,
        medicareRebate: 0,
        gapPayment: 50,
        status,
        paidAt: status === "paid" ? appt.scheduledAt : undefined,
        paymentMethod: status === "paid" ? "Visa •••• 4471" : undefined,
      });
    }
  }

  // ---- Documents -------------------------------------------------------
  const documents: PatientDocument[] = [];
  let docCounter = 0;
  const DOC_BY_FLAVOR: Partial<Record<PatientFlavor, { type: PatientDocument["type"]; title: string }[]>> = {
    diabetes: [
      { type: "pathology", title: "HbA1c & lipid panel" },
      { type: "care-plan", title: "Diabetes cycle of care plan" },
    ],
    cardiac: [
      { type: "pathology", title: "Full blood count & troponin" },
      { type: "radiology", title: "Chest X-ray report" },
    ],
    hypertension: [{ type: "pathology", title: "UEC & lipid panel" }],
    antenatal: [
      { type: "radiology", title: "Obstetric ultrasound report" },
      { type: "referral", title: "Referral — obstetrician shared care" },
    ],
    "skin-check": [
      { type: "imaging", title: "Dermoscopy images — lesion mapping" },
      { type: "referral", title: "Referral — dermatology" },
    ],
    "mental-health-plan": [{ type: "care-plan", title: "GP Mental Health Treatment Plan" }],
    "cervical-screening": [{ type: "pathology", title: "Cervical Screening Test result" }],
    asthma: [{ type: "care-plan", title: "Asthma action plan" }],
    immunisation: [{ type: "clinical-note", title: "Immunisation record updated" }],
  };
  for (const patient of patients) {
    const flavor = patientFlavorById[patient.id] ?? "none";
    const docs = DOC_BY_FLAVOR[flavor] ?? [];
    for (const d of docs) {
      const ageDays = rng.int(1, 27);
      const createdAt = addDays(today, -ageDays);
      const isResult = d.type === "pathology" || d.type === "radiology";
      const flagged = isResult && rng.bool(0.4);
      docCounter++;
      const minor = today.getFullYear() - new Date(patient.dob).getFullYear() < 18;
      documents.push({
        id: `doc-${docCounter.toString().padStart(4, "0")}`,
        patientId: patient.id,
        providerId: patient.registeredProviderId,
        type: d.type,
        title: d.title,
        createdAt: createdAt.toISOString(),
        flaggedForReview: flagged,
        reviewed: !flagged,
        sizeKb: rng.int(180, 4200),
        retentionUntil: new Date(createdAt.getTime() + (minor ? 25 : 7) * 365 * 86400000).toISOString(),
        storageTier: ageDays < 7 ? "hot" : ageDays < 20 ? "cool" : "archive",
      });
    }
  }

  // ---- Reminders -------------------------------------------------------
  const reminders: Reminder[] = [];
  let remCounter = 0;
  for (const appt of appointments) {
    if (!appt.reminderSent) continue;
    const patient = patientById.get(appt.patientId)!;
    const channel = patient.notifyPrefs.sms ? "sms" : "email";
    const sentAt = new Date(
      new Date(appt.scheduledAt).getTime() - patient.notifyPrefs.reminderHoursBefore * 3600000
    );
    const provider = providers.find((p) => p.id === appt.providerId)!;
    const status: Reminder["status"] = appt.reminderConfirmed
      ? "confirmed"
      : appt.status === "rescheduled"
        ? "rescheduled"
        : appt.status === "cancelled"
          ? "failed"
          : "sent";
    remCounter++;
    reminders.push({
      id: `rem-${remCounter.toString().padStart(4, "0")}`,
      appointmentId: appt.id,
      patientId: appt.patientId,
      channel,
      sentAt: sentAt.toISOString(),
      status,
      message: `Reminder: appt with ${provider.shortName}, ${new Intl.DateTimeFormat("en-AU", { weekday: "short" }).format(new Date(appt.scheduledAt))} ${new Intl.DateTimeFormat("en-AU", { hour: "numeric", minute: "2-digit", hour12: true }).format(new Date(appt.scheduledAt))}. Reply C to confirm or R to reschedule.`,
    });
  }

  // ---- Recalls -------------------------------------------------------
  const recalls: Recall[] = [];
  let recallCounter = 0;
  function pushRecall(patientId: string, type: string, dueOffsetDays: number) {
    const dueDate = addDays(today, dueOffsetDays);
    recallCounter++;
    recalls.push({
      id: `recall-${recallCounter.toString().padStart(3, "0")}`,
      patientId,
      type,
      dueDate: dueDate.toISOString(),
      status: dueOffsetDays < 0 ? "overdue" : dueOffsetDays < 21 ? "due" : "scheduled",
    });
  }
  for (const patient of patients) {
    const flavor = patientFlavorById[patient.id] ?? "none";
    switch (flavor) {
      case "diabetes":
      case "cardiac":
      case "hypertension":
        pushRecall(patient.id, "Chronic disease cycle of care", rng.int(-14, 45));
        break;
      case "cervical-screening":
        pushRecall(patient.id, "Cervical Screening Test", rng.int(-30, 120));
        break;
      case "skin-check":
        pushRecall(patient.id, "Annual skin check", rng.int(-10, 200));
        break;
      case "immunisation":
        pushRecall(patient.id, "Immunisation — next dose due", rng.int(-7, 60));
        break;
      case "mental-health-plan":
        pushRecall(patient.id, "Mental health care plan review", rng.int(-5, 30));
        break;
      case "antenatal":
        pushRecall(patient.id, "Antenatal shared-care visit", rng.int(-3, 21));
        break;
      default:
        if (rng.bool(0.3)) pushRecall(patient.id, "Annual health check", rng.int(-5, 90));
    }
  }

  // ---- Notifications (patient-facing) -------------------------------------------------------
  const notifications: Notification[] = [];
  let notifCounter = 0;
  function pushNotification(
    patientId: string,
    kind: Notification["kind"],
    title: string,
    body: string,
    createdAt: Date,
    read = false
  ) {
    notifCounter++;
    notifications.push({
      id: `notif-${notifCounter.toString().padStart(4, "0")}`,
      patientId,
      kind,
      title,
      body,
      createdAt: createdAt.toISOString(),
      read,
    });
  }

  for (const appt of appointments) {
    const diffDays = (new Date(appt.scheduledAt).getTime() - today.getTime()) / 86400000;
    if (diffDays < -3 || diffDays > 14) continue;
    const provider = providers.find((p) => p.id === appt.providerId)!;
    const when = `${new Intl.DateTimeFormat("en-AU", { weekday: "long", day: "numeric", month: "short" }).format(new Date(appt.scheduledAt))} at ${new Intl.DateTimeFormat("en-AU", { hour: "numeric", minute: "2-digit", hour12: true }).format(new Date(appt.scheduledAt))}`;
    if (appt.reminderSent && diffDays >= 0) {
      pushNotification(
        appt.patientId,
        "reminder",
        "Upcoming appointment reminder",
        `You have an appointment with ${provider.shortName} on ${when}.`,
        new Date(new Date(appt.scheduledAt).getTime() - 24 * 3600000),
        diffDays < 5
      );
    }
    if (appt.status === "confirmed" && appt.channel !== "walk-in" && diffDays >= 0 && diffDays < 10) {
      pushNotification(
        appt.patientId,
        "system",
        "Appointment confirmed",
        `Your ${appt.reason.toLowerCase()} with ${provider.shortName} on ${when} is confirmed.`,
        new Date(appt.createdAt),
        true
      );
    }
  }
  for (const inv of invoices) {
    if (inv.status !== "outstanding") continue;
    const ageDays = (today.getTime() - new Date(inv.issuedAt).getTime()) / 86400000;
    if (ageDays > 21) continue;
    pushNotification(
      inv.patientId,
      "billing",
      "Payment outstanding",
      `You have an outstanding balance of $${inv.gapPayment.toFixed(2)} for your ${new Date(inv.issuedAt).toLocaleDateString("en-AU", { day: "numeric", month: "short" })} visit.`,
      new Date(inv.issuedAt),
      ageDays > 5
    );
  }
  for (const doc of documents) {
    if (!doc.reviewed || (doc.type !== "pathology" && doc.type !== "radiology")) continue;
    const ageDays = (today.getTime() - new Date(doc.createdAt).getTime()) / 86400000;
    if (ageDays > 10) continue;
    pushNotification(
      doc.patientId,
      "result",
      "Result available",
      `Your ${doc.title.toLowerCase()} is ready to view.`,
      new Date(new Date(doc.createdAt).getTime() + 86400000),
      ageDays > 3
    );
  }
  for (const recall of recalls) {
    if (recall.status !== "due" && recall.status !== "overdue") continue;
    pushNotification(
      recall.patientId,
      "recall",
      recall.status === "overdue" ? "Recall overdue" : "Recall due soon",
      `${recall.type} — ${recall.status === "overdue" ? "was due" : "due"} ${new Date(recall.dueDate).toLocaleDateString("en-AU", { day: "numeric", month: "short" })}. Book in when it suits you.`,
      addDays(today, -rng.int(0, 2)),
      rng.bool(0.4)
    );
  }
  notifications.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  // ---- Audit log seed -------------------------------------------------------
  const auditLog: AuditLogEntry[] = [];
  const yesterday = addDays(today, -1);
  const canon: [string, StaffRole, string, string, string][] = [
    ["Dr Paul Simmons", "owner", "opened module", "Security & System", "security"],
    ["Helen Simmons", "delegated_admin", "opened record", "Noah Brown", "patients"],
    ["Dr James Chen", "gp", "opened record", "Olivia Taylor", "patients"],
    ["Sophie Nguyen", "reception", "opened module", "Patients", "patients"],
  ];
  const canonTimes: [number, number, number][] = [
    [9, 41, 3],
    [9, 41, 47],
    [9, 42, 15],
    [9, 43, 2],
  ];
  canon.forEach(([actorName, actorRole, action, target, module], i) => {
    const [h, m, s] = canonTimes[i];
    const t = new Date(yesterday);
    t.setHours(h, m, s, 0);
    auditLog.push({
      id: `audit-canon-${i}`,
      actorName,
      actorRole,
      action,
      target,
      module,
      timestamp: t.toISOString(),
    });
  });

  const actions: { action: string; module: string; targets: string[] }[] = [
    { action: "opened module", module: "dashboard", targets: ["Dashboard"] },
    { action: "opened module", module: "reports", targets: ["Reports"] },
    { action: "opened module", module: "claims", targets: ["Claims & Billing"] },
    { action: "viewed record", module: "patients", targets: patients.slice(0, 14).map((p) => `${p.firstName} ${p.lastName}`) },
    { action: "processed claim", module: "claims", targets: claims.slice(0, 20).map((c) => c.id.toUpperCase()) },
    { action: "reviewed result", module: "results", targets: documents.filter((d) => d.type === "pathology").slice(0, 8).map((d) => d.title) },
    { action: "exported report", module: "reports", targets: ["Quarterly KPI export", "Attendance report", "Claims reconciliation"] },
    { action: "sent reminder batch", module: "dashboard", targets: ["42 upcoming appointments", "18 upcoming appointments"] },
    { action: "confirmed appointment", module: "patients", targets: appointments.slice(0, 10).map((a) => a.id.toUpperCase()) },
    { action: "downloaded document", module: "imaging", targets: documents.slice(0, 6).map((d) => d.title) },
  ];
  let auditCounter = 0;
  for (let i = 0; i < 46; i++) {
    const actor = rng.pick(staffDirectory);
    const bucket = rng.pick(actions);
    const target = rng.pick(bucket.targets);
    const daysAgo = rng.int(0, 13);
    const t = addDays(today, -daysAgo);
    t.setHours(rng.int(8, 17), rng.int(0, 59), rng.int(0, 59), 0);
    if (t.getTime() > now.getTime()) t.setDate(t.getDate() - 1);
    auditCounter++;
    auditLog.push({
      id: `audit-${auditCounter.toString().padStart(4, "0")}`,
      actorName: `${actor.firstName} ${actor.lastName}`,
      actorRole: actor.role,
      action: bucket.action,
      target,
      module: bucket.module,
      timestamp: t.toISOString(),
    });
  }
  auditLog.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  return { patients, appointments, claims, invoices, documents, reminders, recalls, auditLog, notifications };
}
