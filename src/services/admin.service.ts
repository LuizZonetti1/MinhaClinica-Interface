import { api } from "../config/api";
import type { DashboardSummary } from "../types/dashboard";
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
