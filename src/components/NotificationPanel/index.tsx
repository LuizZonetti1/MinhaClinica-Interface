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
    Trash2,
    UserCheck,
} from "lucide-react";
import type { ReactElement } from "react";
import { useState } from "react";
import { useAuth, useNotifications } from "../../contexts";
import type { NotificationItem, NotificationType } from "../../types/notification";
import { UserRole } from "../../types/enums";
import { AnnouncementModal } from "../AnnouncementModal";
import {
    Caret,
    DeleteButton,
    EmptyState,
    HeaderActions,
    IconWrap,
    List,
    LoadingState,
    MarkAllButton,
    NotifContent,
    NotifItem,
    NotifMessage,
    NotifSubject,
    NotifTime,
    Overlay,
    Panel,
    PanelFooter,
    PanelHeader,
    PanelTitle,
    SendButton,
    Spinner,
    UnreadDot,
    DetailBody,
    DetailHeader,
    DetailIconWrap,
    DetailTypeLabel,
    DetailMessageText,
    DetailMeta,
    DetailMetaLabel,
    DetailMetaValue,
} from "./styles";
import { Modal } from "../Modal";

type IconConfig = { icon: ReactElement; color: string };

function getIconConfig(type: NotificationType, size = 16): IconConfig {
    switch (type) {
        case "APPOINTMENT_CONFIRMATION":
        case "APPOINTMENT_RESCHEDULED":
        case "APPOINTMENT_REMINDER":
        case "NEW_BOOKING":
            return { icon: <Calendar size={size} />, color: "#3B82F6" };
        case "APPOINTMENT_COMPLETED":
        case "CHECKIN_DONE":
        case "REGISTRATION_COMPLETE":
        case "PAYMENT_CONFIRMED":
            return { icon: <CheckCircle size={size} />, color: "#22C55E" };
        case "APPOINTMENT_CANCELLATION":
        case "NO_SHOW_WARNING":
            return { icon: <BellOff size={size} />, color: "#EF4444" };
        case "PATIENT_WAITING":
            return { icon: <UserCheck size={size} />, color: "#EAB308" };
        case "ANNOUNCEMENT":
            return { icon: <Megaphone size={size} />, color: "#8B5CF6" };
        case "DIRECT_MESSAGE":
            return { icon: <MessageCircle size={size} />, color: "#0EA5E9" };
        case "ACCOUNT_BLOCKED":
            return { icon: <ShieldAlert size={size} />, color: "#EF4444" };
        default:
            return { icon: <Info size={size} />, color: "#6B7280" };
    }
}

const TYPE_LABELS: Record<NotificationType, string> = {
    APPOINTMENT_CONFIRMATION: "Confirmação de Consulta",
    APPOINTMENT_REMINDER: "Lembrete de Consulta",
    APPOINTMENT_CANCELLATION: "Cancelamento de Consulta",
    APPOINTMENT_RESCHEDULED: "Reagendamento de Consulta",
    PASSWORD_RESET: "Redefinição de Senha",
    WELCOME: "Boas-vindas",
    BIRTHDAY: "Aniversário",
    NO_SHOW_WARNING: "Aviso de Falta",
    NEW_BOOKING: "Nova Consulta",
    CHECKIN_DONE: "Check-in Realizado",
    PATIENT_WAITING: "Paciente Aguardando",
    REGISTRATION_COMPLETE: "Cadastro Completo",
    ANNOUNCEMENT: "Comunicado",
    DIRECT_MESSAGE: "Mensagem Direta",
    PAYMENT_CONFIRMED: "Pagamento Confirmado",
    ACCOUNT_BLOCKED: "Conta Bloqueada",
    REPORT_READY: "Relatório Disponível",
    APPOINTMENT_COMPLETED: "Consulta Finalizada",
};

function formatFullDate(isoString: string): string {
    return new Date(isoString).toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
}

function formatRelativeTime(isoString: string): string {
    const now = Date.now();
    const diff = now - new Date(isoString).getTime();
    const minutes = Math.floor(diff / 60_000);
    if (minutes < 1) return "agora";
    if (minutes < 60) return `${minutes}min atrás`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h atrás`;
    const days = Math.floor(hours / 24);
    return `${days}d atrás`;
}

function NotifRow({ item, onOpen }: { item: NotificationItem; onOpen: (item: NotificationItem) => void }) {
    const { markRead, deleteNotif } = useNotifications();
    const isUnread = !item.readAt;
    const { icon, color } = getIconConfig(item.type);

    return (
        <NotifItem
            $unread={isUnread}
            onClick={() => onOpen(item)}
            onMouseEnter={() => { if (isUnread) markRead(item.id); }}
        >
            <IconWrap $color={color}>{icon}</IconWrap>
            <NotifContent>
                <NotifSubject $unread={isUnread}>{item.subject ?? item.type}</NotifSubject>
                <NotifMessage>{item.message}</NotifMessage>
                <NotifTime>{formatRelativeTime(item.createdAt)}</NotifTime>
            </NotifContent>
            {isUnread && <UnreadDot />}
            <DeleteButton
                type="button"
                aria-label="Remover notificação"
                title="Remover"
                onClick={(e) => { e.stopPropagation(); deleteNotif(item.id); }}
            >
                <Trash2 size={13} />
            </DeleteButton>
        </NotifItem>
    );
}

export function NotificationPanel() {
    const { notifications, unreadCount, isLoading, isPanelOpen, anchorRect, closePanel, markAllRead } =
        useNotifications();
    const { user } = useAuth();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedNotif, setSelectedNotif] = useState<NotificationItem | null>(null);
    const canSend =
        user?.role === UserRole.ADMIN ||
        user?.role === UserRole.RECEPTIONIST ||
        user?.role === UserRole.PROFESSIONAL;

    if (!isPanelOpen) return null;

    // Posicionamento: abaixo do sino ou fallback no canto superior direito
    const PANEL_WIDTH = 380;
    const GAP = 10;
    const panelTop = anchorRect ? anchorRect.bottom + GAP : 64;
    const rawRight = anchorRect
        ? window.innerWidth - anchorRect.right
        : 16;
    // garante que não saia da tela pela esquerda
    const panelRight = Math.max(8, Math.min(rawRight, window.innerWidth - PANEL_WIDTH - 8));
    const caretCenterX = anchorRect
        ? anchorRect.left + anchorRect.width / 2
        : window.innerWidth - panelRight - PANEL_WIDTH / 2;
    const caretTop = anchorRect ? anchorRect.bottom + 1 : 55;

    return (
        <>
            <Overlay onClick={closePanel} />
            {anchorRect && (
                <Caret $top={caretTop} $centerX={caretCenterX} />
            )}
            <Panel $top={panelTop} $right={panelRight}>
                <PanelHeader>
                    <PanelTitle>
                        Avisos {unreadCount > 0 && (
                            <span style={{ fontWeight: 400, fontSize: "0.88rem", color: "inherit" }}>
                                ({unreadCount})
                            </span>
                        )}
                    </PanelTitle>
                    <HeaderActions>
                        {unreadCount > 0 && (
                            <MarkAllButton onClick={markAllRead} disabled={isLoading}>
                                Marcar lidas
                            </MarkAllButton>
                        )}
                    </HeaderActions>
                </PanelHeader>

                {isLoading && notifications.length === 0 ? (
                    <LoadingState>
                        <Spinner />
                    </LoadingState>
                ) : notifications.length === 0 ? (
                    <EmptyState>
                        <Bell size={32} strokeWidth={1.5} />
                        <span>Nenhum aviso por enquanto</span>
                    </EmptyState>
                ) : (
                    <List>
                        {notifications.map((n) => (
                            <NotifRow key={n.id} item={n} onOpen={setSelectedNotif} />
                        ))}
                    </List>
                )}

                {canSend && (
                    <PanelFooter>
                        <SendButton type="button" onClick={() => setIsModalOpen(true)}>
                            <SendHorizonal size={15} />
                            {user?.role === UserRole.PROFESSIONAL ? "Enviar Mensagem" : "Enviar Comunicado"}
                        </SendButton>
                    </PanelFooter>
                )}
            </Panel>

            {canSend && (
                <AnnouncementModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                />
            )}

            {selectedNotif && (
                <Modal
                    isOpen
                    onClose={() => setSelectedNotif(null)}
                    title={selectedNotif.subject ?? TYPE_LABELS[selectedNotif.type] ?? "Notificação"}
                >
                    <DetailBody>
                        <DetailHeader>
                            <DetailIconWrap $color={getIconConfig(selectedNotif.type, 22).color}>
                                {getIconConfig(selectedNotif.type, 22).icon}
                            </DetailIconWrap>
                            <DetailTypeLabel>{TYPE_LABELS[selectedNotif.type] ?? selectedNotif.type}</DetailTypeLabel>
                        </DetailHeader>

                        <DetailMessageText>{selectedNotif.message}</DetailMessageText>

                        <DetailMeta>
                            <DetailMetaLabel>Recebida em</DetailMetaLabel>
                            <DetailMetaValue>{formatFullDate(selectedNotif.createdAt)}</DetailMetaValue>
                        </DetailMeta>
                    </DetailBody>
                </Modal>
            )}
        </>
    );
}
