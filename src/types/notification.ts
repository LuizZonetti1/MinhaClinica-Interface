export type NotificationType =
    | "APPOINTMENT_CONFIRMATION"
    | "APPOINTMENT_REMINDER"
    | "APPOINTMENT_CANCELLATION"
    | "APPOINTMENT_RESCHEDULED"
    | "PASSWORD_RESET"
    | "WELCOME"
    | "BIRTHDAY"
    | "NO_SHOW_WARNING"
    | "NEW_BOOKING"
    | "CHECKIN_DONE"
    | "PATIENT_WAITING"
    | "REGISTRATION_COMPLETE"
    | "ANNOUNCEMENT"
    | "DIRECT_MESSAGE"
    | "PAYMENT_CONFIRMED"
    | "ACCOUNT_BLOCKED"
    | "REPORT_READY"
    | "APPOINTMENT_COMPLETED";

export type NotificationChannel = "EMAIL" | "SMS" | "WHATSAPP" | "IN_APP";
export type NotificationStatus = "PENDING" | "SENT" | "FAILED" | "READ";

export interface NotificationItem {
    id: string;
    type: NotificationType;
    channel: NotificationChannel;
    status: NotificationStatus;
    subject: string | null;
    message: string;
    readAt: string | null;
    sentAt: string | null;
    createdAt: string;
    metadata: Record<string, unknown> | null;
    appointmentId: string | null;
}

export interface NotificationListResult {
    notifications: NotificationItem[];
    unreadCount: number;
}
