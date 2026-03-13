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
