import { api } from "../config/api";
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
import type { DashboardSummary } from "../types/dashboard";

export const getDashboardSummary = async (): Promise<DashboardSummary> => {
    const { data } = await api.get<DashboardSummary>("/dashboard");
    return data;
};

export {
    deactivateProfessional,
    deactivateReceptionist,
    getProfessionalById,
    getReceptionistById,
    inviteProfessional,
    inviteStaff,
    listProfessionals,
    listReceptionists,
    updateProfessional,
    updateReceptionist,
};
