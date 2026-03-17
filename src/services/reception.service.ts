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
import type {
    AppointmentStatus,
    ReceptionDashboardData,
    TodayAppointmentItem,
} from "../types/dashboard";

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

// ─── Reception Dashboard ─────────────────────────────────────────────────────

const toNum = (v: unknown): number => {
    if (typeof v === "number" && Number.isFinite(v)) return v;
    if (typeof v === "string") {
        const p = Number(v.trim());
        if (Number.isFinite(p)) return p;
    }
    return 0;
};

const toStr = (v: unknown, fallback = ""): string =>
    typeof v === "string" ? v : fallback;

const toRec = (v: unknown): Record<string, unknown> | null =>
    typeof v === "object" && v !== null ? (v as Record<string, unknown>) : null;

const normalizeStatus = (v: unknown): AppointmentStatus => {
    const s = String(v ?? "").toUpperCase();
    const valid: AppointmentStatus[] = ["WAITING", "CHECKED_IN", "IN_PROGRESS", "DONE", "CANCELLED"];
    return valid.includes(s as AppointmentStatus) ? (s as AppointmentStatus) : "WAITING";
};

const normalizeAppointment = (item: unknown): TodayAppointmentItem | null => {
    const r = toRec(item);
    if (!r) return null;
    return {
        id: toStr(r.id, String(Math.random())),
        time: toStr(r.time ?? r.scheduledTime ?? r.appointmentTime ?? r.startAt, "--:--"),
        patientName: toStr(r.patientName ?? r.patient, "—"),
        doctorName: toStr(r.doctorName ?? r.professional ?? r.doctor, "—"),
        status: normalizeStatus(r.status ?? r.appointmentStatus),
    };
};

const normalizeReceptionDashboard = (raw: unknown): ReceptionDashboardData => {
    const data = toRec(raw) ?? {};
    const summaryRaw = toRec(data.summary ?? data) ?? {};
    const appointmentsRaw = Array.isArray(data.appointments)
        ? data.appointments
        : Array.isArray(data.data)
        ? data.data
        : [];

    return {
        summary: {
            consultationsToday: toNum(
                summaryRaw.consultationsToday ??
                summaryRaw.appointmentsToday ??
                summaryRaw.totalConsultations ??
                data.consultationsToday,
            ),
            awaitingCheckin: toNum(
                summaryRaw.awaitingCheckin ??
                summaryRaw.pendingCheckin ??
                data.awaitingCheckin,
            ),
            checkinsDone: toNum(
                summaryRaw.checkinsDone ??
                summaryRaw.completedCheckins ??
                data.checkinsDone,
            ),
            pendingConfirmations: toNum(
                summaryRaw.pendingConfirmations ??
                summaryRaw.confirmationsPending ??
                data.pendingConfirmations,
            ),
        },
        appointments: appointmentsRaw
            .map(normalizeAppointment)
            .filter((a): a is TodayAppointmentItem => a !== null),
    };
};

export const getReceptionDashboard = async (): Promise<ReceptionDashboardData> => {
    const { data } = await api.get<unknown>("/reception/dashboard");
    return normalizeReceptionDashboard(data);
};
