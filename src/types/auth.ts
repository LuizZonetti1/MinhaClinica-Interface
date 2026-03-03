import type { Gender, UserRole } from "./enums";

export interface LoginPayload {
    email: string;
    password: string;
}

export interface LoginResponse {
    accessToken: string;
    user: {
        id: string;
        name: string;
        email: string;
        role: UserRole;
    };
}

export interface RegisterStartPayload {
    name: string;
    email: string;
}

export interface RegisterStartResponse {
    message: string;
    email?: string;
    tempToken?: string;
    redirectToComplete?: boolean;
}

// token é passado como path param: GET /api/auth/verify-email/:token
export interface VerifyEmailResponse {
    tempToken: string; // JWT temporário para usar na etapa Complete
    message: string;
}

export interface ResendVerificationPayload {
    email: string;
    type?: string; // ex: "patient"
}

// ─── Etapa 3: Completar Cadastro ─────────────────────────────────────────────
export interface RegisterCompletePayload {
    cpf: string;
    phone: string;
    password: string;
    dateOfBirth: string; // YYYY-MM-DD
    gender: Gender;
    address: {
        cep: string;
        street: string;
        number: string;
        complement?: string;
        neighborhood: string;
        city: string;
        state: string;
    };
    medicalInfo: {
        bloodType: string;
        allergies: string;
        medications: string;
        conditions: string;
        emergencyName?: string;
        emergencyPhone?: string;
    };
}

export interface RegisterCompleteResponse {
    message: string;
    accessToken: string; // JWT definitivo de sessão
    user: {
        id: string;
        name: string;
        email: string;
        role: UserRole;
    };
}
