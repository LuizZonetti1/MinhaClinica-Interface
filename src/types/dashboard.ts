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
