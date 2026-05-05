import {
    Bell,
    BellOff,
    Calendar,
    CheckCircle,
    Info,
    Megaphone,
    MessageCircle,
    SendHorizonal,
    ShieldAlert,
    UserCheck,
} from "lucide-react";
import type { ReactElement } from "react";
import { useRef, useState } from "react";
import { AnnouncementModal } from "../../../components/AnnouncementModal";
import { useNotifications } from "../../../contexts";
import type { NotificationItem, NotificationType } from "../../../types/notification";
import {
    CardContent,
    CardMessage,
    CardMeta,
    CardSubject,
    CardTime,
    EmptyState,
    IconWrap,
    MarkAllBtn,
    NotifCard,
    NotifList,
    PageSubtitle,
    PageTitle,
    PageWrapper,
    TitleBlock,
    TopRow,
    UnreadBadge,
} from "./styles";

type IconConfig = { icon: ReactElement; color: string };

function getIconConfig(type: NotificationType): IconConfig {
    switch (type) {
        case "APPOINTMENT_CONFIRMATION":
        case "APPOINTMENT_RESCHEDULED":
        case "APPOINTMENT_REMINDER":
        case "NEW_BOOKING":
            return { icon: <Calendar size={18} />, color: "#3B82F6" };
        case "APPOINTMENT_COMPLETED":
        case "CHECKIN_DONE":
        case "REGISTRATION_COMPLETE":
        case "PAYMENT_CONFIRMED":
            return { icon: <CheckCircle size={18} />, color: "#22C55E" };
        case "APPOINTMENT_CANCELLATION":
        case "NO_SHOW_WARNING":
            return { icon: <BellOff size={18} />, color: "#EF4444" };
        case "PATIENT_WAITING":
            return { icon: <UserCheck size={18} />, color: "#EAB308" };
        case "ANNOUNCEMENT":
            return { icon: <Megaphone size={18} />, color: "#8B5CF6" };
        case "DIRECT_MESSAGE":
            return { icon: <MessageCircle size={18} />, color: "#0EA5E9" };
        case "ACCOUNT_BLOCKED":
            return { icon: <ShieldAlert size={18} />, color: "#EF4444" };
        default:
            return { icon: <Info size={18} />, color: "#6B7280" };
    }
}

function formatDate(isoString: string): string {
    const date = new Date(isoString);
    return date.toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
}

function NotifRow({ item }: { item: NotificationItem }) {
    const { markRead } = useNotifications();
    const isUnread = !item.readAt;
    const { icon, color } = getIconConfig(item.type);
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const handleMouseEnter = () => {
        if (!isUnread) return;
        timerRef.current = setTimeout(() => void markRead(item.id), 600);
    };

    const handleMouseLeave = () => {
        if (timerRef.current) clearTimeout(timerRef.current);
    };

    return (
        <NotifCard
            $unread={isUnread}
            onClick={() => isUnread && markRead(item.id)}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <IconWrap $color={color}>{icon}</IconWrap>
            <CardContent>
                <CardSubject $unread={isUnread}>{item.subject ?? item.type}</CardSubject>
                <CardMessage>{item.message}</CardMessage>
                <CardMeta>
                    <CardTime>{formatDate(item.createdAt)}</CardTime>
                    {isUnread && <UnreadBadge>Nova</UnreadBadge>}
                </CardMeta>
            </CardContent>
        </NotifCard>
    );
}

const ReceptionNotificationsPage = () => {
    const { notifications, unreadCount, markAllRead, isLoading } = useNotifications();
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <PageWrapper>
            <TopRow>
                <TitleBlock>
                    <PageTitle>Notificações</PageTitle>
                    <PageSubtitle>
                        {unreadCount > 0
                            ? `${unreadCount} notificação${unreadCount > 1 ? "ões" : ""} não lida${unreadCount > 1 ? "s" : ""}`
                            : "Todas as notificações estão em dia"}
                    </PageSubtitle>
                </TitleBlock>
                <div style={{ display: "flex", gap: "10px" }}>
                    {unreadCount > 0 && (
                        <MarkAllBtn onClick={markAllRead} disabled={isLoading}>
                            Marcar todas como lidas
                        </MarkAllBtn>
                    )}
                    <MarkAllBtn
                        onClick={() => setIsModalOpen(true)}
                        style={{ display: "flex", alignItems: "center", gap: "6px" }}
                    >
                        <SendHorizonal size={15} />
                        Enviar Comunicado
                    </MarkAllBtn>
                </div>
            </TopRow>

            {notifications.length === 0 ? (
                <EmptyState>
                    <Bell size={48} strokeWidth={1.5} />
                    <span>Nenhuma notificação por enquanto</span>
                </EmptyState>
            ) : (
                <NotifList>
                    {notifications.map((n) => (
                        <NotifRow key={n.id} item={n} />
                    ))}
                </NotifList>
            )}

            <AnnouncementModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />
        </PageWrapper>
    );
};

export default ReceptionNotificationsPage;
