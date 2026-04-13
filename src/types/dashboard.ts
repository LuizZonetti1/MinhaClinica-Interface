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
  color?: string;
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

export type AppointmentStatus =
  | "WAITING"
  | "CHECKED_IN"
  | "IN_PROGRESS"
  | "DONE"
  | "CANCELLED"
  | "NO_SHOW";

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

export interface ProfessionalDashboardSummary {
  consultasHoje: number;
  confirmadas: number;
  pacientesDoMes: number;
}

export interface PatientDashboardStats {
  upcomingCount: number;
  completedCount: number;
  lastAppointmentDate: string | null;
  unreadNotifications: number;
}

export interface PatientNextAppointment {
  id: string;
  status: string;
  appointmentDate: string;
  startTime: string;
  endTime: string;
  type: string;
  channel: string;
  professionalName: string;
  professionalAvatarUrl: string | null;
  primarySpecialty: string | null;
  clinicName: string | null;
}

export interface PatientDashboardData {
  stats: PatientDashboardStats;
  nextAppointment: PatientNextAppointment | null;
  upcomingAppointments: PatientNextAppointment[];
}

export type AgendaSlotStatus =
  | "SCHEDULED"
  | "CONFIRMED"
  | "WAITING"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "NO_SHOW"
  | "CANCELLED";

export interface ProfessionalAppointment {
  id: string;
  time: string;
  endTime?: string | null;
  patientId?: string | null;
  patientName: string;
  patientAvatarUrl?: string | null;
  professionalName?: string | null;
  professionalId?: string | null;
  appointmentType?: string | null;
  status: AgendaSlotStatus;
}

export interface ProfessionalDashboardData {
  summary: ProfessionalDashboardSummary;
  appointments: ProfessionalAppointment[];
}

export interface ProfessionalAgendaDay {
  date: string;
  appointments: ProfessionalAppointment[];
  totalAppointments: number;
  confirmedAppointments: number;
  completedAppointments: number;
  hasAppointments: boolean;
}

export interface ProfessionalMonthlyAgendaSummary {
  appointmentsCount: number;
  confirmedCount: number;
  completedCount: number;
  daysWithAppointments: number;
  patientsCount: number;
}

export interface ProfessionalMonthlyAgendaData {
  referenceMonth: string;
  startDate: string;
  endDate: string;
  days: ProfessionalAgendaDay[];
  summary: ProfessionalMonthlyAgendaSummary;
}

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
