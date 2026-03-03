import { api } from "../config/api";
import type {
    Clinic,
    ClinicListResponse,
    ClinicRegisterCompletePayload,
    ClinicRegisterCompleteResponse,
    ClinicRegisterResendPayload,
    ClinicRegisterStartPayload,
    ClinicRegisterStartResponse,
    ClinicRegisterVerifyPayload,
    ClinicRegisterVerifyResponse,
    CreateClinicPayload,
    UpdateClinicPayload,
} from "../types/clinic";

// ─── Etapa 1: Início do cadastro da clínica ───────────────────────────────────
// POST /api/clinics/register/start
export const clinicRegisterStart = async (
    payload: ClinicRegisterStartPayload,
): Promise<ClinicRegisterStartResponse> => {
    const { data } = await api.post<ClinicRegisterStartResponse>(
        "/clinics/register/start",
        payload,
    );
    return data;
};

// ─── Etapa 2a: Verificar token do e-mail ─────────────────────────────────────
// POST /api/clinics/register/verify
export const clinicRegisterVerify = async (
    payload: ClinicRegisterVerifyPayload,
): Promise<ClinicRegisterVerifyResponse> => {
    const { data } = await api.post<ClinicRegisterVerifyResponse>(
        "/clinics/register/verify",
        payload,
    );
    localStorage.setItem("@minhaclinica:token", data.tempToken);
    return data;
};

// ─── Etapa 2b: Reenviar e-mail de verificação ────────────────────────────────
// POST /api/clinics/register/resend-verification
export const clinicRegisterResend = async (
    payload: ClinicRegisterResendPayload,
): Promise<void> => {
    await api.post("/clinics/register/resend-verification", payload);
};

// ─── Etapa 3: Completar cadastro da clínica ───────────────────────────────────
// POST /api/clinics/register/complete  🔒 tempClinicAuth
export const clinicRegisterComplete = async (
    payload: ClinicRegisterCompletePayload,
): Promise<ClinicRegisterCompleteResponse> => {
    const { data } = await api.post<ClinicRegisterCompleteResponse>(
        "/clinics/register/complete",
        payload,
    );
    if (data.accessToken) {
        localStorage.setItem("@minhaclinica:token", data.accessToken);
    }
    return data;
};

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
