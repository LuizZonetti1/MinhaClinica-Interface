import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useRef,
    useState,
} from "react";
import type { ReactNode } from "react";
import {
    fetchNotifications,
    markAllNotificationsRead,
    markNotificationRead,
    deleteNotification,
} from "../services/notification.service";
import type { NotificationItem } from "../types/notification";
import { getAuthToken } from "../utils/authStorage";

interface NotificationContextData {
    notifications: NotificationItem[];
    unreadCount: number;
    isLoading: boolean;
    isPanelOpen: boolean;
    anchorRect: DOMRect | null;
    openPanel: (anchor?: HTMLElement | null) => void;
    closePanel: () => void;
    refresh: () => Promise<void>;
    markRead: (id: string) => Promise<void>;
    markAllRead: () => Promise<void>;
    deleteNotif: (id: string) => Promise<void>;
}

const NotificationContext = createContext<NotificationContextData | undefined>(undefined);

const POLL_INTERVAL_MS = 30_000;

export function NotificationProvider({ children }: { children: ReactNode }) {
    const [notifications, setNotifications] = useState<NotificationItem[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [isPanelOpen, setIsPanelOpen] = useState(false);
    const [anchorRect, setAnchorRect] = useState<DOMRect | null>(null);

    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

    const refresh = useCallback(async () => {
        try {
            setIsLoading(true);
            const result = await fetchNotifications();
            setNotifications(result.notifications);
            setUnreadCount(result.unreadCount);
        } catch {
            // silently ignore network errors for polling
        } finally {
            setIsLoading(false);
        }
    }, []);

    const openPanel = useCallback((anchor?: HTMLElement | null) => {
        if (anchor) {
            setAnchorRect(anchor.getBoundingClientRect());
        } else {
            setAnchorRect(null);
        }
        setIsPanelOpen(true);
        refresh();
    }, [refresh]);

    const closePanel = useCallback(() => {
        setIsPanelOpen(false);
    }, []);

    const markRead = useCallback(async (id: string) => {
        await markNotificationRead(id);
        setNotifications((prev) =>
            prev.map((n) =>
                n.id === id ? { ...n, readAt: new Date().toISOString(), status: "READ" } : n,
            ),
        );
        setUnreadCount((prev) => Math.max(0, prev - 1));
    }, []);

    const markAllRead = useCallback(async () => {
        await markAllNotificationsRead();
        setNotifications((prev) =>
            prev.map((n) => ({ ...n, readAt: n.readAt ?? new Date().toISOString(), status: "READ" as const })),
        );
        setUnreadCount(0);
    }, []);

    const deleteNotif = useCallback(async (id: string) => {
        const target = notifications.find((n) => n.id === id);
        await deleteNotification(id);
        setNotifications((prev) => prev.filter((n) => n.id !== id));
        if (target && !target.readAt) {
            setUnreadCount((prev) => Math.max(0, prev - 1));
        }
    }, [notifications]);

    // Carregar na montagem e depois fazer polling (apenas quando há token)
    useEffect(() => {
        if (!getAuthToken()) return;

        refresh();

        intervalRef.current = setInterval(() => {
            refresh();
        }, POLL_INTERVAL_MS);

        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, [refresh]);

    return (
        <NotificationContext.Provider
            value={{
                notifications,
                unreadCount,
                isLoading,
                isPanelOpen,
                anchorRect,
                openPanel,
                closePanel,
                refresh,
                markRead,
                markAllRead,
                deleteNotif,
            }}
        >
            {children}
        </NotificationContext.Provider>
    );
}

export function useNotifications(): NotificationContextData {
    const ctx = useContext(NotificationContext);
    if (!ctx) {
        throw new Error("useNotifications deve ser usado dentro de NotificationProvider");
    }
    return ctx;
}
