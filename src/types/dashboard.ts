export interface DashboardSummary {
  totalPatients: number;
  appointmentsToday: number;
  totalProfessionals: number;
  monthlyBalance: number;
  referenceDate: string;
  appointmentsThisMonth: number;
}

export interface HistoricalItem {
  month: string;
  consultations: number;
  revenue: number;
}

// ─── Reports ──────────────────────────────────────────────────────────────────

export interface MonthlyStatsItem {
  month: string;
  consultations: number;
  cancellations: number;
  revenue: number;
}

export interface FinancialItem {
  month: string;
  entradas: number;
  saidas: number;
  lucro: number;
}

export interface AppointmentStatusItem {
  name: string;
  value: number;
}

export interface TopProfessionalItem {
  rank: number;
  name: string;
  specialty: string;
  consultations: number;
}

export interface TopSpecialtyItem {
  rank: number;
  name: string;
  consultations: number;
}

export interface ReportSummary {
  consultationsCount: number;
  totalRevenue: number;
  cancellationsCount: number;
  estimatedProfit: number;
}

export interface ReportData {
  summary: ReportSummary;
  monthly: MonthlyStatsItem[];
  financial: FinancialItem[];
  statusDistribution: AppointmentStatusItem[];
  revenueTrend: HistoricalItem[];
  topProfessionals: TopProfessionalItem[];
  topSpecialties: TopSpecialtyItem[];
  referenceLabel: string;
}

// ─── Reception Dashboard ─────────────────────────────────────────────────────

export type AppointmentStatus = "WAITING" | "CHECKED_IN" | "IN_PROGRESS" | "DONE" | "CANCELLED";
export type AppointmentStatusUpdate =
  | "SCHEDULED"
  | "CONFIRMED"
  | "WAITING"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "NO_SHOW"
  | "CANCELLED";

export interface TodayAppointmentItem {
  id: string;
  time: string;
  patientName: string;
  doctorName: string;
  status: AppointmentStatus;
  avatarUrl?: string | null;
  appointmentType?: string | null;
}

export interface ReceptionDashboardSummary {
  consultationsToday: number;
  awaitingCheckin: number;
  checkinsDone: number;
  pendingConfirmations: number;
}

export interface ReceptionDashboardData {
  summary: ReceptionDashboardSummary;
  appointments: TodayAppointmentItem[];
}

// ─── Agendas (Reception Schedules) ──────────────────────────────────────────

export type AgendaSlotStatus =
  | "SCHEDULED"
  | "CONFIRMED"
  | "WAITING"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "NO_SHOW"
  | "CANCELLED";

export interface AgendaSlot {
  time: string;
  libre: boolean;
  appointmentId?: string | null;
  patientName?: string | null;
  status?: AgendaSlotStatus | null;
}

export interface AgendaProfessional {
  id: string;
  name: string;
  specialty: string;
  avatarUrl?: string | null;
  slots: AgendaSlot[];
}

export interface AgendasResponse {
  date: string;
  professionals: AgendaProfessional[];
}
