import type { UserRole } from "./enums";

// ─── Clinic Register ──────────────────────────────────────────────────────────

export interface ClinicRegisterStartPayload {
    // Dados da clínica
    legalName: string;
    tradeName: string;
    cnpj: string;
    phone: string;
    clinicEmail: string;
    website?: string;
    // Endereço (campos flat conforme schema)
    zipCode: string;
    street: string;
    number: string;
    complement?: string;
    neighborhood: string;
    city: string;
    state: string;
    // Responsável (dispara o e-mail de verificação)
    ownerName: string;
    ownerEmail: string;
}

export interface ClinicRegisterStartResponse {
    message: string;
    email?: string;
    redirectToComplete?: boolean;
    tempToken?: string;
}

// ─── Etapa 2a: Verificar token do e-mail ─────────────────────────────────────
export interface ClinicRegisterVerifyPayload {
    token: string;
}

export interface ClinicRegisterVerifyResponse {
    tempToken: string;
    message: string;
}

// ─── Etapa 2b: Reenviar e-mail de verificação ────────────────────────────────
export interface ClinicRegisterResendPayload {
    email: string;
}

export interface ClinicRegisterCompletePayload {
    // Apenas dados pessoais do responsável/admin
    cpf: string;
    phone: string;
    password: string;
    dateOfBirth: string; // YYYY-MM-DD
    gender: string;
}

export interface ClinicRegisterCompleteResponse {
    message: string;
    accessToken: string;
    user: {
        id: string;
        name: string;
        email: string;
        role: UserRole;
    };
    clinic: {
        id: string;
        tradeName: string;
    };
}

// ─── Clinic ───────────────────────────────────────────────────────────────────
export interface Clinic {
    id: string;
    name: string;
    cnpj: string;
    phone: string;
    email: string;
    address: {
        cep: string;
        street: string;
        number: string;
        complement?: string;
        neighborhood: string;
        city: string;
        state: string;
    };
    createdAt: string;
    updatedAt: string;
}

export interface CreateClinicPayload {
    name: string;
    cnpj: string;
    phone: string;
    email: string;
    address: {
        cep: string;
        street: string;
        number: string;
        complement?: string;
        neighborhood: string;
        city: string;
        state: string;
    };
}

export type UpdateClinicPayload = Partial<CreateClinicPayload>;

export interface ClinicListResponse {
    data: Clinic[];
    total: number;
}
