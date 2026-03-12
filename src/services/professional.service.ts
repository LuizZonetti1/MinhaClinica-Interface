import { isAxiosError } from "axios";
import { api } from "../config/api";
import { storeAuthToken } from "../utils/authStorage";
import type {
    ApiListPayload,
    DateLike,
    InviteProfessionalPayload,
    InviteProfessionalResponse,
    ProfessionalListItem,
    ProfessionalRegisterCompletePayload,
    ProfessionalRegisterCompleteResponse,
    UpdateProfessionalPayload,
} from "../types/professional";

type ProfessionalApiShape = {
    id: string;
    userId?: string;
    name: string;
    email: string;
    phone?: string | null;
    status?: string;
    avatarUrl?: string | null;
    lastLoginAt?: DateLike;
    createdAt?: DateLike;
    isActive?: boolean;
    professionalCouncil?: string;
    registrationNumber?: string;
    registrationState?: string;
    specialties?: string[] | null;
    specialty?: string | null;
    appointmentsThisMonth?: number;
    defaultAppointmentDuration?: number;
};

const toDateOrNull = (value: DateLike): Date | null => {
    if (!value) return null;
    return value instanceof Date ? value : new Date(value);
};

const toDateOrNow = (value: DateLike): Date => {
    const parsedDate = toDateOrNull(value);
    return parsedDate ?? new Date();
};

const getListItems = <T>(payload: ApiListPayload<T>): T[] => {
    if (Array.isArray(payload)) return payload;
    if ("data" in payload) return payload.data;
    return payload.items;
};

const getWithFallback = async <T>(primaryPath: string, fallbackPath?: string): Promise<T> => {
    try {
        const { data } = await api.get<T>(primaryPath);
        return data;
    } catch (error: unknown) {
        if (
            fallbackPath &&
            isAxiosError(error) &&
            error.response?.status === 404
        ) {
            const { data } = await api.get<T>(fallbackPath);
            return data;
        }

        throw error;
    }
};

const normalizeSpecialties = (item: ProfessionalApiShape): string[] => {
    if (Array.isArray(item.specialties) && item.specialties.length > 0) {
        return item.specialties.filter(Boolean);
    }

    if (typeof item.specialty === "string" && item.specialty.trim()) {
        return [item.specialty.trim()];
    }

    return [];
};

const mapProfessional = (item: ProfessionalApiShape): ProfessionalListItem => {
    const specialties = normalizeSpecialties(item);
    const status = item.status ?? (item.isActive ? "ACTIVE" : "INACTIVE");

    return {
        id: item.id,
        userId: item.userId ?? item.id,
        name: item.name,
        email: item.email,
        phone: item.phone ?? null,
        status,
        avatarUrl: item.avatarUrl ?? null,
        lastLoginAt: toDateOrNull(item.lastLoginAt),
        createdAt: toDateOrNow(item.createdAt),
        isActive: item.isActive ?? status === "ACTIVE",
        professionalCouncil: item.professionalCouncil ?? "",
        registrationNumber: item.registrationNumber ?? "",
        registrationState: item.registrationState ?? "",
        specialties,
        appointmentsThisMonth: item.appointmentsThisMonth ?? 0,
        defaultAppointmentDuration: item.defaultAppointmentDuration,
        specialty: specialties[0] ?? "",
    };
};

// GET /api/professionals
export const listProfessionals = async (): Promise<ProfessionalListItem[]> => {
    const data = await getWithFallback<ApiListPayload<ProfessionalApiShape>>(
        "/professionals",
        "/professionals/professionals",
    );

    return getListItems(data).map(mapProfessional);
};

// GET /api/professionals/:id
export const getProfessionalById = async (id: string): Promise<ProfessionalListItem> => {
    const { data } = await api.get<ProfessionalApiShape>(`/professionals/${id}`);
    return mapProfessional(data);
};

// PATCH /api/professionals/:id
export const updateProfessional = async (
    id: string,
    payload: UpdateProfessionalPayload,
): Promise<ProfessionalListItem> => {
    const { data } = await api.patch<ProfessionalApiShape>(
        `/professionals/${id}`,
        payload,
    );

    return mapProfessional(data);
};

// DELETE /api/professionals/:id
export const deactivateProfessional = async (id: string): Promise<void> => {
    await api.delete(`/professionals/${id}`);
};

// POST /api/professionals/invite
export const inviteProfessional = async (
    payload: InviteProfessionalPayload,
): Promise<InviteProfessionalResponse> => {
    const { data } = await api.post<InviteProfessionalResponse>(
        "/professionals/invite",
        payload,
    );
    return data;
};

// POST /api/professionals/complete
export const professionalRegisterComplete = async (
    payload: ProfessionalRegisterCompletePayload,
): Promise<ProfessionalRegisterCompleteResponse> => {
    const { data } = await api.post<ProfessionalRegisterCompleteResponse>(
        "/professionals/complete",
        payload,
    );

    if (data.accessToken) {
        storeAuthToken(data.accessToken);
    }

    return data;
};
