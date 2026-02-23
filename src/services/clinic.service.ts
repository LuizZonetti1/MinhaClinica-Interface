import { api } from "../config/api";
import type {
    Clinic,
    ClinicListResponse,
    CreateClinicPayload,
    UpdateClinicPayload,
} from "../types/clinic";

// POST /api/clinics/create
export const createClinic = async (
    payload: CreateClinicPayload,
): Promise<Clinic> => {
    const { data } = await api.post<Clinic>("/clinics/create", payload);
    return data;
};

// GET /api/clinics/list
export const listClinics = async (): Promise<ClinicListResponse> => {
    const { data } = await api.get<ClinicListResponse>("/clinics/list");
    return data;
};

// GET /api/clinics/:id
export const getClinic = async (id: string): Promise<Clinic> => {
    const { data } = await api.get<Clinic>(`/clinics/${id}`);
    return data;
};

// PUT /api/clinics/:id
export const updateClinic = async (
    id: string,
    payload: UpdateClinicPayload,
): Promise<Clinic> => {
    const { data } = await api.put<Clinic>(`/clinics/${id}`, payload);
    return data;
};

// DELETE /api/clinics/:id
export const deleteClinic = async (id: string): Promise<void> => {
    await api.delete(`/clinics/${id}`);
};
