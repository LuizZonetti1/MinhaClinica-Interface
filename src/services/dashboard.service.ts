import { api } from '../config/api';

export interface DashboardSummary {
  totalPatients: number;
  appointmentsToday: number;
  totalProfessionals: number;
  monthlyBalance: number;
  referenceDate: string;
  appointmentsThisMonth: number;
}

export const getDashboardSummary = async (): Promise<DashboardSummary> => {
  const { data } = await api.get<DashboardSummary>('/dashboard');
  return data;
};

export interface HistoricalItem {
  month: string;
  consultations: number;
  revenue: number;
}
