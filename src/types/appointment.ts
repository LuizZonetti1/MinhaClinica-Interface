export interface PatientSearchResult {
  id: string;
  name: string;
  cpf: string;
  email?: string | null;
  phone?: string | null;
  avatarUrl?: string | null;
  isEmailVerified?: boolean | null;
}

export interface AppointmentProfessional {
  id: string;
  name: string;
  specialty: string;
  defaultDuration: number; // minutes
  calendarColor: string;
  clinicName?: string | null;
  clinicAddress?: string | null;
}

export interface AppointmentSlot {
  time: string; // "HH:mm"
  available: boolean;
}

export const AppointmentType = {
  CONSULTATION: "CONSULTATION",
  RETURN: "RETURN",
  EXAM: "EXAM",
  EMERGENCY: "EMERGENCY",
} as const;

export type AppointmentType = (typeof AppointmentType)[keyof typeof AppointmentType];

export interface CreateAppointmentPayload {
  patientId: string;
  professionalId: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  type?: AppointmentType;
  notes?: string;
}

export interface AppointmentConfirmation {
  id: string;
  patientName: string;
  patientCpf: string;
  professionalName: string;
  specialty: string;
  clinicName?: string | null;
  clinicAddress?: string | null;
  date: string;
  time: string;
  endTime?: string | null;
  type?: AppointmentType | null;
}
