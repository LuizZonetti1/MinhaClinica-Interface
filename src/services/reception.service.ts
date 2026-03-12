import { isAxiosError } from "axios";
import { api } from "../config/api";
import { storeAuthToken } from "../utils/authStorage";
import type {
    ApiListPayload,
    DateLike,
    InviteStaffPayload,
    InviteStaffResponse,
    ReceptionistListItem,
    StaffRegisterCompletePayload,
    StaffRegisterCompleteResponse,
    UpdateReceptionistPayload,
} from "../types/professional";

type ReceptionApiShape = {
    id: string;
    name: string;
    email: string;
    phone?: string | null;
    status?: string;
    role?: string;
    avatarUrl?: string | null;
    lastLoginAt?: DateLike;
    createdAt?: DateLike;
    appointmentsThisMonth?: number;
    isActive?: boolean;
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

const patchWithFallback = async <T>(
    primaryPath: string,
    payload: unknown,
    fallbackPath?: string,
): Promise<T> => {
    try {
        const { data } = await api.patch<T>(primaryPath, payload);
        return data;
    } catch (error: unknown) {
        if (
            fallbackPath &&
            isAxiosError(error) &&
            error.response?.status === 404
        ) {
            const { data } = await api.patch<T>(fallbackPath, payload);
            return data;
        }

        throw error;
    }
};

const deleteWithFallback = async (primaryPath: string, fallbackPath?: string): Promise<void> => {
    try {
        await api.delete(primaryPath);
    } catch (error: unknown) {
        if (
            fallbackPath &&
            isAxiosError(error) &&
            error.response?.status === 404
        ) {
            await api.delete(fallbackPath);
            return;
        }

        throw error;
    }
};

const mapReceptionist = (item: ReceptionApiShape): ReceptionistListItem => {
    const status = item.status ?? (item.isActive ? "ACTIVE" : "INACTIVE");

    return {
        id: item.id,
        name: item.name,
        email: item.email,
        phone: item.phone ?? null,
        status,
        role: item.role ?? "RECEPTIONIST",
        avatarUrl: item.avatarUrl ?? null,
        lastLoginAt: toDateOrNull(item.lastLoginAt),
        createdAt: toDateOrNow(item.createdAt),
        appointmentsThisMonth: item.appointmentsThisMonth ?? 0,
        isActive: item.isActive ?? status === "ACTIVE",
    };
};

// GET /api/reception
export const listReceptionists = async (): Promise<ReceptionistListItem[]> => {
    const data = await getWithFallback<ApiListPayload<ReceptionApiShape>>(
        "/reception",
        "/staff/receptionists",
    );

    return getListItems(data).map(mapReceptionist);
};

// GET /api/reception/:id
export const getReceptionistById = async (id: string): Promise<ReceptionistListItem> => {
    const data = await getWithFallback<ReceptionApiShape>(
        `/reception/${id}`,
        `/staff/receptionists/${id}`,
    );

    return mapReceptionist(data);
};

// PATCH /api/reception/:id
export const updateReceptionist = async (
    id: string,
    payload: UpdateReceptionistPayload,
): Promise<ReceptionistListItem> => {
    const data = await patchWithFallback<ReceptionApiShape>(
        `/reception/${id}`,
        payload,
        `/staff/receptionists/${id}`,
    );

    return mapReceptionist(data);
};

// DELETE /api/reception/:id
export const deactivateReceptionist = async (id: string): Promise<void> => {
    await deleteWithFallback(`/reception/${id}`, `/staff/receptionists/${id}`);
};

// POST /api/staff/invite
export const inviteStaff = async (
    payload: InviteStaffPayload,
): Promise<InviteStaffResponse> => {
    const { data } = await api.post<InviteStaffResponse>(
        "/staff/invite",
        payload,
    );
    return data;
};

// POST /api/staff/complete
export const receptionRegisterComplete = async (
    payload: StaffRegisterCompletePayload,
): Promise<StaffRegisterCompleteResponse> => {
    const { data } = await api.post<StaffRegisterCompleteResponse>(
        "/staff/complete",
        payload,
    );

    if (data.accessToken) {
        storeAuthToken(data.accessToken);
    }

    return data;
};
