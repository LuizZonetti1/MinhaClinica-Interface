export type DayOfWeek =
  | "MONDAY"
  | "TUESDAY"
  | "WEDNESDAY"
  | "THURSDAY"
  | "FRIDAY"
  | "SATURDAY"
  | "SUNDAY";

export interface WorkingHour {
  dayOfWeek: DayOfWeek;
  isWorking: boolean;
  startTime: string; // "HH:mm"
  endTime: string; // "HH:mm"
  lunchBreakStart: string | null; // "HH:mm"
  lunchBreakEnd: string | null; // "HH:mm"
}

export interface ProfessionalSpecialty {
  specialtyId: string;
  name: string;
  isPrimary: boolean;
}

export interface ProfessionalProfileData {
  // Dados pessoais
  name: string;
  email: string;
  phone: string;
  avatarUrl: string | null;

  // Dados profissionais
  professionalCouncil: string; // "CRM"
  registrationNumber: string; // "12345"
  registrationState: string; // "SP"
  bio: string | null;
  formations: string | null;
  defaultAppointmentDuration: number; // minutos
  isActive: boolean;

  // Estatísticas
  totalPatientsAttended: number;
  yearsAtClinic: number;
  avgRating: number;
  punctualityPercent: number;

  // Relacionamentos
  specialties: ProfessionalSpecialty[];
  workingHours: WorkingHour[];
}

export interface UpdateProfessionalProfilePayload {
  name?: string;
  phone?: string | null;
  registrationNumber?: string;
  registrationState?: string;
  defaultAppointmentDuration?: number;
  bio?: string | null;
  formations?: string | null;
  workingHours?: WorkingHour[];
}
