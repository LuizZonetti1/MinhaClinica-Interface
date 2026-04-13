import { Check, Clock, Pencil } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  getReceptionTodayAppointments,
  updateAppointmentStatus,
} from "../../../services/reception.service";
import type {
  AppointmentStatus,
  AppointmentStatusUpdate,
  TodayAppointmentItem,
} from "../../../types/dashboard";
import { getApiErrorMessage } from "../../../utils/getApiErrorMessage";
import { notifyError, notifySuccess } from "../../../utils/toast";
import {
  ActionsCell,
  AppointmentMeta,
  AppointmentRow,
  AvatarCircle,
  CheckinButton,
  DropdownItem,
  DropdownMenu,
  DropdownWrapper,
  EditIconButton,
  EmptyState,
  ListCard,
  LoadingState,
  PageDate,
  PageHeader,
  PageTitle,
  PageWrapper,
  PatientInfo,
  PatientName,
  SectionCount,
  SectionHeader,
  SectionTitle,
  StatusBadge,
} from "./styles";

// ─── Constants ────────────────────────────────────────────────────────────────

const STATUS_LABELS: Record<AppointmentStatus, string> = {
  WAITING: "Aguardando",
  CHECKED_IN: "Check-in OK",
  IN_PROGRESS: "Em Atendimento",
  DONE: "Concluído",
  CANCELLED: "Cancelado",
  NO_SHOW: "Não Compareceu",
};

const STATUS_BADGE_VARIANT: Record<
  AppointmentStatus,
  "waiting" | "checkin" | "progress" | "done" | "cancelled"
> = {
  WAITING: "waiting",
  CHECKED_IN: "checkin",
  IN_PROGRESS: "progress",
  DONE: "done",
  CANCELLED: "cancelled",
  NO_SHOW: "cancelled",
};

type SectionVariant = "waiting" | "active" | "done" | "cancelled";

const SECTIONS: {
  key: string;
  label: string;
  variant: SectionVariant;
  statuses: AppointmentStatus[];
}[] = [
  {
    key: "waiting",
    label: "Aguardando Check-in",
    variant: "waiting",
    statuses: ["WAITING"],
  },
  {
    key: "active",
    label: "Em Atendimento / Check-in OK",
    variant: "active",
    statuses: ["CHECKED_IN", "IN_PROGRESS"],
  },
  {
    key: "done",
    label: "Concluídos",
    variant: "done",
    statuses: ["DONE"],
  },
  {
    key: "cancelled",
    label: "Cancelados",
    variant: "cancelled",
    statuses: ["CANCELLED"],
  },
];

const STATUS_UPDATE_OPTIONS: Array<{ value: AppointmentStatusUpdate; label: string }> = [
  { value: "SCHEDULED", label: "Agendado" },
  { value: "CONFIRMED", label: "Confirmado" },
  { value: "WAITING", label: "Check-in OK" },
  { value: "IN_PROGRESS", label: "Em Atendimento" },
  { value: "COMPLETED", label: "Concluido" },
  { value: "NO_SHOW", label: "Nao Compareceu" },
  { value: "CANCELLED", label: "Cancelado" },
];

const mapUpdateStatusToVisual = (status: AppointmentStatusUpdate): AppointmentStatus => {
  if (status === "SCHEDULED" || status === "CONFIRMED") return "WAITING";
  if (status === "WAITING") return "CHECKED_IN";
  if (status === "IN_PROGRESS") return "IN_PROGRESS";
  if (status === "COMPLETED") return "DONE";
  return "CANCELLED";
};

const defaultUpdateByVisualStatus: Record<AppointmentStatus, AppointmentStatusUpdate> = {
  WAITING: "SCHEDULED",
  CHECKED_IN: "WAITING",
  IN_PROGRESS: "IN_PROGRESS",
  DONE: "COMPLETED",
  CANCELLED: "CANCELLED",
  NO_SHOW: "NO_SHOW",
};

const getUpdateStatusLabel = (status: AppointmentStatusUpdate): string =>
  STATUS_UPDATE_OPTIONS.find((option) => option.value === status)?.label ?? status;

const APPOINTMENT_TYPE_LABELS: Record<string, string> = {
  CONSULTATION: "Consulta",
  RETURN: "Retorno",
  EXAM: "Exame",
  EMERGENCY: "Emergencia",
  FIRST_CONSULTATION: "Primeira Consulta",
  CONSULTA: "Consulta",
  RETORNO: "Retorno",
  EXAME: "Exame",
  EMERGENCIA: "Emergencia",
};

const getFormattedDate = () =>
  new Date().toLocaleDateString("pt-BR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

const getInitials = (name: string) =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");

const formatAppointmentType = (raw: string | null | undefined): string | null => {
  if (!raw) return null;
  const key = raw
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toUpperCase()
    .replace(/[\s-]+/g, "_");
  return APPOINTMENT_TYPE_LABELS[key] ?? raw.trim();
};

// ─── Row Dropdown ─────────────────────────────────────────────────────────────

type RowDropdownProps = {
  appointmentId: string;
  currentStatus: AppointmentStatus;
  onStatusChange: (id: string, status: AppointmentStatusUpdate) => void;
};

const RowDropdown = ({ appointmentId, currentStatus, onStatusChange }: RowDropdownProps) => {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    const handleOutsideClick = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [open]);

  const handleSelect = (status: AppointmentStatusUpdate) => {
    setOpen(false);
    if (mapUpdateStatusToVisual(status) !== currentStatus) {
      onStatusChange(appointmentId, status);
    }
  };

  const activeStatus = defaultUpdateByVisualStatus[currentStatus];

  return (
    <DropdownWrapper ref={wrapperRef}>
      <EditIconButton
        type="button"
        aria-label="Editar status"
        onClick={() => setOpen((prev) => !prev)}
      >
        <Pencil size={14} />
      </EditIconButton>

      {open && (
        <DropdownMenu>
          {STATUS_UPDATE_OPTIONS.map((statusOption) => (
            <DropdownItem
              key={statusOption.value}
              $active={statusOption.value === activeStatus}
              onClick={() => handleSelect(statusOption.value)}
            >
              {statusOption.label}
            </DropdownItem>
          ))}
        </DropdownMenu>
      )}
    </DropdownWrapper>
  );
};

// ─── Component ────────────────────────────────────────────────────────────────

const ReceptionCheckinPage = () => {
  const [appointments, setAppointments] = useState<TodayAppointmentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);
  const today = getFormattedDate();

  useEffect(() => {
    let isMounted = true;

    const load = async (silent = false) => {
      try {
        const data = await getReceptionTodayAppointments();
        if (isMounted) {
          setAppointments(data.appointments);
        }
      } catch (err: unknown) {
        if (!silent && isMounted) {
          notifyError(getApiErrorMessage(err, "Erro ao carregar consultas de hoje."));
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    void load(false);

    const timer = window.setInterval(() => void load(true), 60_000);
    return () => {
      isMounted = false;
      window.clearInterval(timer);
    };
  }, []);

  const handleStatusChange = useCallback(
    async (id: string, newStatus: AppointmentStatusUpdate) => {
      setUpdating(id);
      const visualStatus = mapUpdateStatusToVisual(newStatus);

      // optimistic update
      setAppointments((prev) =>
        prev.map((a) => (a.id === id ? { ...a, status: visualStatus } : a)),
      );

      try {
        await updateAppointmentStatus(id, newStatus);
        notifySuccess(`Status atualizado para "${getUpdateStatusLabel(newStatus)}".`);
      } catch (err: unknown) {
        // revert on failure
        setAppointments((prev) => {
          const original = appointments.find((a) => a.id === id);
          if (!original) return prev;
          return prev.map((a) => (a.id === id ? original : a));
        });
        notifyError(getApiErrorMessage(err, "Nao foi possivel atualizar o status."));
      } finally {
        setUpdating(null);
      }
    },
    [appointments],
  );

  const getSectionVariant = (status: AppointmentStatus): SectionVariant => {
    if (status === "WAITING") return "waiting";
    if (status === "CHECKED_IN" || status === "IN_PROGRESS") return "active";
    if (status === "DONE") return "done";
    return "cancelled";
  };

  return (
    <PageWrapper>
      <PageHeader>
        <PageTitle>Check-in de Pacientes</PageTitle>
        <PageDate>{today}</PageDate>
      </PageHeader>

      <ListCard>
        {loading ? (
          <LoadingState>Carregando consultas...</LoadingState>
        ) : appointments.length === 0 ? (
          <EmptyState>Nenhuma consulta agendada para hoje.</EmptyState>
        ) : (
          SECTIONS.map((section) => {
            const items = appointments.filter((a) => section.statuses.includes(a.status));
            if (items.length === 0) return null;

            return (
              <div key={section.key}>
                <SectionHeader $variant={section.variant}>
                  <SectionTitle $variant={section.variant}>{section.label}</SectionTitle>
                  <SectionCount $variant={section.variant}>{items.length}</SectionCount>
                </SectionHeader>

                {items.map((appt) => {
                  const initials = getInitials(appt.patientName);
                  const typeLabel =
                    formatAppointmentType(appt.appointmentType) ?? "Tipo nao informado";
                  const meta = [appt.time, appt.doctorName, typeLabel].filter(Boolean).join(" — ");
                  const badgeVariant = STATUS_BADGE_VARIANT[appt.status];
                  const avatarVariant = getSectionVariant(appt.status);
                  const isUpdating = updating === appt.id;

                  return (
                    <AppointmentRow key={appt.id}>
                      <AvatarCircle $variant={avatarVariant}>
                        {appt.avatarUrl ? (
                          <img src={appt.avatarUrl} alt={appt.patientName} />
                        ) : (
                          initials || "?"
                        )}
                      </AvatarCircle>

                      <PatientInfo>
                        <PatientName>{appt.patientName}</PatientName>
                        <AppointmentMeta>
                          <Clock size={13} />
                          {meta}
                        </AppointmentMeta>
                      </PatientInfo>

                      <ActionsCell>
                        <StatusBadge $variant={badgeVariant}>
                          {STATUS_LABELS[appt.status]}
                        </StatusBadge>

                        {appt.status === "WAITING" && (
                          <CheckinButton
                            type="button"
                            disabled={isUpdating}
                            onClick={() => void handleStatusChange(appt.id, "WAITING")}
                          >
                            <Check size={14} />
                            Check-in
                          </CheckinButton>
                        )}

                        <RowDropdown
                          appointmentId={appt.id}
                          currentStatus={appt.status}
                          onStatusChange={(id, status) => void handleStatusChange(id, status)}
                        />
                      </ActionsCell>
                    </AppointmentRow>
                  );
                })}
              </div>
            );
          })
        )}
      </ListCard>
    </PageWrapper>
  );
};

export default ReceptionCheckinPage;
