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
