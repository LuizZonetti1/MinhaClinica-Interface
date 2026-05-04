import { api } from "../config/api";
import type { NotificationItem, NotificationListResult } from "../types/notification";
import { toRecord, toTrimmedStringValue } from "../utils/parsers";

const BASE_PATH = "/notifications";

const normalizeNotification = (value: unknown): NotificationItem | null => {
    const item = toRecord(value);
    if (!item) return null;

    const id = toTrimmedStringValue(item.id);
    if (!id) return null;

    return {
        id,
        type: toTrimmedStringValue(item.type) as NotificationItem["type"],
        channel: (toTrimmedStringValue(item.channel) || "IN_APP") as NotificationItem["channel"],
        status: (toTrimmedStringValue(item.status) || "SENT") as NotificationItem["status"],
        subject: toTrimmedStringValue(item.subject, "") || null,
        message: toTrimmedStringValue(item.message),
        readAt: toTrimmedStringValue(item.readAt, "") || null,
        sentAt: toTrimmedStringValue(item.sentAt, "") || null,
        createdAt: toTrimmedStringValue(item.createdAt),
        metadata: item.metadata && typeof item.metadata === "object" && !Array.isArray(item.metadata)
            ? (item.metadata as Record<string, unknown>)
            : null,
        appointmentId: toTrimmedStringValue(item.appointmentId, "") || null,
    };
};

export async function fetchNotifications(): Promise<NotificationListResult> {
    const response = await api.get<unknown>(BASE_PATH);
    const root = toRecord(response.data) ?? {};
    const data = toRecord(root.data) ?? root;

    const rawNotifications = Array.isArray(data.notifications)
        ? data.notifications
        : [];

    const notifications: NotificationItem[] = rawNotifications
        .map(normalizeNotification)
        .filter((n): n is NotificationItem => n !== null);

    const unreadCount =
        typeof data.unreadCount === "number"
            ? data.unreadCount
            : notifications.filter((n) => !n.readAt).length;

    return { notifications, unreadCount };
}

export async function markNotificationRead(id: string): Promise<void> {
    await api.patch(`${BASE_PATH}/${id}/read`);
}

export async function markAllNotificationsRead(): Promise<void> {
    await api.patch(`${BASE_PATH}/read-all`);
}

export async function sendAnnouncement(payload: {
    subject: string;
    message: string;
    targetRoles?: string[];
}): Promise<{ sent: number }> {
    const response = await api.post<unknown>(`${BASE_PATH}/announcements`, payload);
    const root = toRecord(response.data) ?? {};
    const data = toRecord(root.data) ?? {};
    return { sent: typeof data.sent === "number" ? data.sent : 0 };
}

export async function searchNotificationUsers(q: string): Promise<
    Array<{ id: string; name: string; email: string; phone: string | null; role: string }>
> {
    const response = await api.get<unknown>(`${BASE_PATH}/search-users`, { params: { q } });
    const root = toRecord(response.data) ?? {};
    const data = Array.isArray(root.data) ? root.data : [];
    return data.map((u: unknown) => {
        const item = toRecord(u) ?? {};
        return {
            id: toTrimmedStringValue(item.id),
            name: toTrimmedStringValue(item.name),
            email: toTrimmedStringValue(item.email),
            phone: toTrimmedStringValue(item.phone, "") || null,
            role: toTrimmedStringValue(item.role),
        };
    });
}

export async function sendDirectMessage(payload: {
    recipientUserId: string;
    subject: string;
    message: string;
}): Promise<void> {
    await api.post(`${BASE_PATH}/direct`, payload);
}

export async function deleteNotification(id: string): Promise<void> {
    await api.delete(`${BASE_PATH}/${id}`);
}
