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
}

export interface PatientAppointmentsListResult {
  total: number;
  appointments: PatientAppointmentListItem[];
}

export type PatientBookingAppointmentType =
  | "CONSULTATION"
  | "RETURN"
  | "EXAM"
  | "EMERGENCY";

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
