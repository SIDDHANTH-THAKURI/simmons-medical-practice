export type StaffRole =
  | "owner"
  | "delegated_admin"
  | "gp"
  | "nurse"
  | "reception"
  | "specialist";

export type PermissionLevel = "full" | "read" | "own" | "none";

export interface RolePermissions {
  records: PermissionLevel;
  resultsImaging: PermissionLevel;
  claims: PermissionLevel;
  reports: PermissionLevel;
  securityUsers: PermissionLevel;
}

export interface NotifyPrefs {
  sms: boolean;
  email: boolean;
  reminderHoursBefore: 24 | 48 | 72;
}

export interface PatientUser {
  kind: "patient";
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dob: string;
  medicareNumber: string;
  medicareRefNo: string;
  medicareExpiry: string;
  address: string;
  suburb: string;
  avatarColor: string;
  registeredProviderId: string;
  concessionCard?: "Health Care Card" | "Pensioner Concession Card";
  privateHealthFund?: string;
  privateHealthMemberNo?: string;
  notifyPrefs: NotifyPrefs;
  emergencyContact: { name: string; relationship: string; phone: string };
  createdAt: string;
}

export interface StaffUser {
  kind: "staff";
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: StaffRole;
  title: string;
  providerId?: string;
  avatarColor: string;
  segregated?: boolean;
}

export type AppUser = PatientUser | StaffUser;

export type ProviderType = "gp" | "specialist";

export interface Provider {
  id: string;
  name: string;
  shortName: string;
  type: ProviderType;
  specialty: string;
  isPartner: boolean;
  isSegregated: boolean;
  employment: "full-time" | "part-time" | "visiting";
  color: string;
  bio: string;
  availableDays: number[];
}

export type AppointmentStatus =
  | "confirmed"
  | "pending"
  | "completed"
  | "cancelled"
  | "no-show"
  | "rescheduled";

export type BookingChannel = "online" | "phone" | "ai-assistant" | "walk-in";

export interface Appointment {
  id: string;
  patientId: string;
  providerId: string;
  reason: string;
  type: string;
  scheduledAt: string;
  durationMins: number;
  status: AppointmentStatus;
  channel: BookingChannel;
  notes?: string;
  reminderSent?: boolean;
  reminderConfirmed?: boolean;
  checkedInAt?: string;
  createdAt: string;
}

export type ClaimStatus = "paid" | "pending" | "rejected";

export interface Claim {
  id: string;
  appointmentId: string;
  patientId: string;
  providerId: string;
  mbsItem: string;
  description: string;
  claimAmount: number;
  claimStatus: ClaimStatus;
  rejectionReason?: string;
  submittedAt: string;
  processedAt?: string;
}

export type InvoiceStatus = "paid" | "outstanding" | "overdue" | "processing";

export interface InvoiceLineItem {
  description: string;
  amount: number;
}

export interface Invoice {
  id: string;
  patientId: string;
  appointmentId?: string;
  issuedAt: string;
  dueAt: string;
  items: InvoiceLineItem[];
  totalAmount: number;
  medicareRebate: number;
  gapPayment: number;
  status: InvoiceStatus;
  paidAt?: string;
  paymentMethod?: string;
}

export type DocumentType =
  | "pathology"
  | "radiology"
  | "referral"
  | "imaging"
  | "clinical-note"
  | "care-plan";

export interface PatientDocument {
  id: string;
  patientId: string;
  providerId: string;
  type: DocumentType;
  title: string;
  createdAt: string;
  flaggedForReview: boolean;
  reviewed: boolean;
  sizeKb: number;
  retentionUntil: string;
  storageTier: "hot" | "cool" | "archive";
}

export interface Reminder {
  id: string;
  appointmentId: string;
  patientId: string;
  channel: "sms" | "email";
  sentAt: string;
  status: "sent" | "confirmed" | "rescheduled" | "failed";
  message: string;
}

export interface Recall {
  id: string;
  patientId: string;
  type: string;
  dueDate: string;
  status: "due" | "overdue" | "scheduled" | "completed";
}

export interface SharedCost {
  id: string;
  paidByProviderId: string;
  category: string;
  description: string;
  amount: number;
  incurredAt: string;
}

export interface CostAllocation {
  id: string;
  costId: string;
  providerId: string;
  allocatedAmount: number;
  status: "owed" | "settled";
}

export interface AuditLogEntry {
  id: string;
  actorName: string;
  actorRole: StaffRole | "patient" | "system";
  action: string;
  target: string;
  module: string;
  timestamp: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  text: string;
  timestamp: string;
  quickReplies?: string[];
}

export interface Notification {
  id: string;
  patientId: string;
  title: string;
  body: string;
  createdAt: string;
  read: boolean;
  kind: "reminder" | "billing" | "result" | "system" | "recall";
}
