import type { ReactNode } from "react";
import type { Gender, UserRole } from "./enums";

// ─── Auth Context ─────────────────────────────────────────────────────────────
export interface User {
    id: string;
    name: string;
    email: string;
    role: UserRole;
    roles?: UserRole[];
    avatarUrl?: string;
}

export interface AuthContextData {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    setUser: (user: User | null) => void;
    logout: () => void;
    isPatient: () => boolean;
    isReceptionist: () => boolean;
    isProfessional: () => boolean;
    isAdmin: () => boolean;
    hasRole: (role: UserRole) => boolean;
    hasAnyRole: (roles: UserRole[]) => boolean;
    updateRoles: (roles: UserRole[]) => Promise<void>;
}

export interface AuthProviderProps {
    children: ReactNode;
}

// ─── Login ────────────────────────────────────────────────────────────────────
export interface LoginPayload {
    email: string;
    password: string;
    deviceToken?: string;
}

export interface LoginResponse {
    requires2FA: boolean;
    // Quando requires2FA = false
    token?: string;
    user?: {
        id: string;
        name: string;
        email: string;
        role: UserRole;
        roles?: UserRole[];
        avatarUrl?: string;
        clinicId?: string;
        clinicName?: string;
    };
    // Quando requires2FA = true
    tempToken?: string;
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
        avatarUrl?: string;
    };
}

// ─── 2FA ──────────────────────────────────────────────────────────────────────
export interface TwoFAStatusResponse {
    enabled: boolean;
    trustedDeviceCount: number;
}

export interface TwoFAValidatePayload {
    tempToken: string;
    code: string;
}

export interface TwoFAValidateResponse {
    token: string;
    deviceToken: string;
    user: {
        id: string;
        name: string;
        email: string;
        role: UserRole;
        roles?: UserRole[];
        clinicId?: string;
        clinicName?: string;
    };
}
