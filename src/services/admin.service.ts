import { api } from "../config/api";
import type { DashboardSummary, HistoricalItem } from "../types/dashboard";
import { toNumberValue, toRecord, toTrimmedStringValue } from "../utils/parsers";
import { requestWithEndpointFallback } from "../utils/requestFallback";
import { getPatientSummary, listPatientsAdmin } from "./patient-admin.service";
import {
  deactivateProfessional,
  getProfessionalById,
  inviteProfessional,
  listProfessionals,
  updateProfessional,
} from "./professional.service";
import {
  deactivateReceptionist,
  getReceptionistById,
  inviteStaff,
  listReceptionists,
  updateReceptionist,
} from "./reception.service";

export const getDashboardSummary = async (): Promise<DashboardSummary> => {
  const { data } = await api.get<DashboardSummary>("/dashboard");
  return data;
};

const DASHBOARD_HISTORICAL_ENDPOINTS = ["/dashboard/historical", "/admin/dashboard/historical"];

const extractHistoricalRows = (payload: unknown): unknown[] => {
  if (Array.isArray(payload)) return payload;

  const root = toRecord(payload);
  if (!root) return [];

  const direct = root.items ?? root.data ?? root.results ?? root.historical;
  if (Array.isArray(direct)) return direct;

  const nested = toRecord(direct);
  if (!nested) return [];

  return Array.isArray(nested.items) ? nested.items : [];
};

const normalizeHistoricalItem = (value: unknown): HistoricalItem | null => {
  const item = toRecord(value);
  if (!item) return null;

  const month = toTrimmedStringValue(item.month);
  if (!month) return null;

  return {
    month,
    consultations: toNumberValue(item.consultations ?? item.appointments ?? item.totalAppointments, 0),
    revenue: toNumberValue(item.revenue ?? item.amount ?? item.totalRevenue, 0),
  };
};

export const getDashboardHistorical = async (months = 6): Promise<HistoricalItem[]> => {
  return requestWithEndpointFallback(
    DASHBOARD_HISTORICAL_ENDPOINTS,
    async (endpoint) => {
      const { data } = await api.get<unknown>(endpoint, { params: { months } });
      return extractHistoricalRows(data)
        .map(normalizeHistoricalItem)
        .filter((item): item is HistoricalItem => item !== null);
    },
    { fallbackMessage: "Nao foi possivel carregar a evolucao historica do dashboard." },
  );
};

export {
  deactivateProfessional,
  deactivateReceptionist,
  getPatientSummary,
  getProfessionalById,
  getReceptionistById,
  inviteProfessional,
  inviteStaff,
  listPatientsAdmin,
  listProfessionals,
  listReceptionists,
  updateProfessional,
  updateReceptionist,
};
