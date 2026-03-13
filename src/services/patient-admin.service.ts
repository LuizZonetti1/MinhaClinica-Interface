import { api } from "../config/api";
import type {
  PatientListResponse,
  PatientSummary,
} from "../types/patient";

export const listPatientsAdmin = async (): Promise<PatientListResponse> => {
  const { data } = await api.get<PatientListResponse>("/patients");
  return {
    count: Number.isFinite(data?.count) ? data.count : 0,
    items: Array.isArray(data?.items) ? data.items : [],
  };
};

export const getPatientSummary = async (): Promise<PatientSummary> => {
  const { data } = await api.get<PatientSummary>("/patients/summary");
  return data;
};
