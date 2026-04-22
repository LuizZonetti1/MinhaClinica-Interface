export type PatientStatus = "ACTIVE" | "INACTIVE" | "BLOCKED";

export interface PatientListItem {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  avatarUrl: string | null;
  status: PatientStatus;
  isActive: boolean;
  lastVisit: string | null;
  totalAppointments: number;
  createdAt: string;
}

export interface PatientListResponse {
  count: number;
  items: PatientListItem[];
}

export interface PatientSummary {
  total: number;
  active: number;
  inactive: number;
  newThisMonth: number;
}

export interface PatientAuditAddress {
  zipCode: string | null;
  street: string | null;
  number: string | null;
  complement: string | null;
  neighborhood: string | null;
  city: string | null;
  state: string | null;
}

export interface PatientAuditMedical {
  bloodType: string | null;
  allergies: string | null;
  medications: string | null;
  conditions: string | null;
  observations: string | null;
  emergencyContactName: string | null;
  emergencyContactPhone: string | null;
}

export interface PatientAuditReportItem {
  id: string;
  appointmentId: string;
  appointmentDate: string | null;
  startTime: string | null;
  endTime: string | null;
  appointmentType: string | null;
  appointmentStatus: string | null;
  appointmentNotes: string | null;
  professionalName: string;
  professionalSpecialty: string | null;
  chiefComplaint: string | null;
  symptoms: string | null;
  diagnosis: string | null;
  treatment: string | null;
  prescription: string | null;
  observations: string | null;
  attachments: string[];
  createdAt: string | null;
  updatedAt: string | null;
}

export interface PatientAuditDetails {
  patient: {
    id: string;
    userId: string;
    name: string;
    email: string;
    phone: string | null;
    avatarUrl: string | null;
    status: PatientStatus;
    isActive: boolean;
    cpf: string;
    rg: string | null;
    dateOfBirth: string | null;
    gender: string | null;
    alternativePhone: string | null;
    noShowCount: number;
    totalAppointments: number;
    completedAppointments: number;
    lastVisit: string | null;
    createdAt: string | null;
    updatedAt: string | null;
    address: PatientAuditAddress;
    medical: PatientAuditMedical;
  };
  reports: PatientAuditReportItem[];
}

// ─── Reception-specific types ─────────────────────────────────────────────────

export interface ReceptionPatientListItem {
  id: string;
  name: string;
  email: string;
  cpf: string | null;
  phone: string | null;
  avatarUrl: string | null;
  status: PatientStatus;
  lastVisit: string | null;
  totalAppointments: number;
  createdAt: string;
}

export interface ReceptionPatientListResponse {
  count: number;
  items: ReceptionPatientListItem[];
}

export interface ReceptionAppointmentItem {
  id: string;
  date: string | null;
  startTime: string | null;
  endTime: string | null;
  professionalName: string | null;
  professionalSpecialty: string | null;
  appointmentType: string | null;
  status: string | null;
  notes: string | null;
}

export interface ReceptionAppointmentListResponse {
  count: number;
  items: ReceptionAppointmentItem[];
}

export type Gender = "MALE" | "FEMALE" | "OTHER" | "PREFER_NOT_TO_SAY";

export type BloodType = "A+" | "A-" | "B+" | "B-" | "AB+" | "AB-" | "O+" | "O-";

export interface RegisterPatientByReceptionPayload {
  // required
  name: string;
  email: string;
  cpf: string;
  phone: string;
  dateOfBirth: string;
  gender: Gender;
  // optional – documents
  rg?: string | null;
  // optional – address
  zipCode?: string | null;
  street?: string | null;
  number?: string | null;
  complement?: string | null;
  neighborhood?: string | null;
  city?: string | null;
  state?: string | null;
  // optional – health
  alternativePhone?: string | null;
  bloodType?: BloodType | null;
  allergies?: string | null;
  medications?: string | null;
  conditions?: string | null;
  observations?: string | null;
  // optional – emergency contact
  emergencyContactName?: string | null;
  emergencyContactPhone?: string | null;
}

export type PatientAppointmentStatus =
  | "SCHEDULED"
  | "CONFIRMED"
  | "WAITING"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "NO_SHOW"
  | "CANCELLED";

export interface PatientAppointmentListItem {
  id: string;
  appointmentDate: string;
  startTime: string;
  endTime: string;
  type: string;
  status: PatientAppointmentStatus | string;
  channel: string;
  notes: string | null;
  professionalName: string;
  professionalAvatarUrl: string | null;
  primarySpecialty: string | null;
  clinicName: string | null;
  clinicId?: string | null;
  professionalId?: string | null;
}

export interface PatientAppointmentsListResult {
  total: number;
  appointments: PatientAppointmentListItem[];
}

export type PatientBookingAppointmentType = "CONSULTATION" | "RETURN" | "EXAM" | "EMERGENCY";

export interface PatientBookingClinicItem {
  id: string;
  tradeName: string;
  logoUrl: string | null;
  city: string;
  state: string;
  street: string;
  number: string;
  neighborhood: string;
}

export interface PatientBookingProfessionalItem {
  id: string;
  userId: string;
  name: string;
  specialty: string | null;
  defaultAppointmentDuration: number;
  bufferTime: number;
  calendarColor: string;
  avatarUrl: string | null;
}

export interface PatientBookingSlotItem {
  startTime: string;
  endTime: string;
  available: boolean;
}

export interface PatientBookingSlotsResult {
  date: string;
  professionalId: string;
  duration: number;
  bufferTime: number;
  slots: PatientBookingSlotItem[];
}

export interface PatientCreateBookingPayload {
  clinicId: string;
  professionalId: string;
  appointmentDate: string;
  startTime: string;
  type: PatientBookingAppointmentType;
  notes?: string;
}

export interface PatientBookingCreatedAppointment {
  id: string;
  patientName: string;
  patientCpf: string;
  professionalName: string;
  professionalSpecialty: string | null;
  clinicName: string;
  clinicAddress: string | null;
  appointmentDate: string;
  startTime: string;
  endTime: string;
  type: string;
  notes: string | null;
}
