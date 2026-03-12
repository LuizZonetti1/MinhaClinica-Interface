// ─── Service Types ────────────────────────────────────────────────────────────
import type { UserRole } from "./enums";

export type DateLike = Date | string | null | undefined;

export type ApiListPayload<T> = T[] | { data: T[] } | { items: T[] };

// ─── Page Types ───────────────────────────────────────────────────────────────
export type ProfessionalStatus = "ACTIVE" | "INACTIVE";
export type StaffRole = "PROFESSIONAL" | "RECEPTIONIST";

export interface ProfessionalItem {
    id: string;
    name: string;
    email: string;
    specialty: string;
    monthlyConsultations: number;
    status: ProfessionalStatus;
}

export interface NewStaffFormData {
    name: string;
    email: string;
    role: StaffRole;
    specialty: string;
}

export interface InviteProfessionalPayload {
    name: string;
    email: string;
    specialty: string;
}

export interface InviteProfessionalResponse {
    message: string;
}

export type StaffInviteRole = "RECEPTIONIST" | "ADMIN";

export interface InviteStaffPayload {
    name: string;
    email: string;
    role: StaffInviteRole;
}

export interface InviteStaffResponse {
    message: string;
}

export interface UpdateProfessionalPayload {
    name: string;
    email: string;
    specialty: string;
    professionalCouncil: string;
    registrationNumber: string;
    registrationState: string;
    defaultAppointmentDuration?: number;
    isActive: boolean;
}

export interface UpdateReceptionistPayload {
    name: string;
    email: string;
    isActive: boolean;
}

export interface ProfessionalRegisterCompletePayload {
    cpf: string;
    phone: string;
    password: string;
    professionalCouncil: string;
    registrationNumber: string;
    registrationState: string;
    defaultAppointmentDuration?: number;
}

export interface ProfessionalRegisterCompleteResponse {
    message: string;
    accessToken: string;
    user: {
        id: string;
        name: string;
        email: string;
        role: UserRole;
    };
}

export interface StaffRegisterCompletePayload {
    cpf: string;
    phone: string;
    password: string;
}

export interface StaffRegisterCompleteResponse {
    message: string;
    accessToken: string;
    user: {
        id: string;
        name: string;
        email: string;
        role: UserRole;
    };
}

// ─── API Response Types ───────────────────────────────────────────────────────
export interface ReceptionistListItem {
    id: string;
    userId?: string;
    name: string;
    email: string;
    phone: string | null;
    status: string;
    role: string;
    avatarUrl: string | null;
    lastLoginAt: Date | null;
    createdAt: Date;
    appointmentsThisMonth: number;
    isActive?: boolean;
}

export interface ProfessionalListItem {
    id: string;
    userId: string;
    name: string;
    email: string;
    phone: string | null;
    status: string;
    avatarUrl: string | null;
    lastLoginAt: Date | null;
    createdAt: Date;
    isActive: boolean;
    professionalCouncil: string;
    registrationNumber: string;
    registrationState: string;
    specialties: string[];
    appointmentsThisMonth: number;
    defaultAppointmentDuration?: number;
    specialty?: string;
}

export interface ProfessionalApiListItem
    extends Omit<ProfessionalListItem, "lastLoginAt" | "createdAt"> {
    lastLoginAt: DateLike;
    createdAt: DateLike;
}

export interface ReceptionistApiListItem
    extends Omit<ReceptionistListItem, "lastLoginAt" | "createdAt"> {
    lastLoginAt: DateLike;
    createdAt: DateLike;
}
