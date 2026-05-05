import {
  Bell,
  CalendarDays,
  CalendarRange,
  CheckCircle,
  ChevronRight,
  Clock3,
  FileText,
  User,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { Button } from "../../../components/Button";
import { Modal } from "../../../components/Modal";
import QuickActions from "../../../components/QuickActions";
import { Skeleton } from "../../../components/Skeleton";
import { StatCard } from "../../../components/StatCard";
import { useAuth } from "../../../contexts";
import { listPatientAppointments } from "../../../services/patient-appointments.service";
import {
  confirmPatientAppointment,
  getPatientDashboard,
} from "../../../services/patient-dashboard.service";
import { theme } from "../../../themes/themes";
import type { PatientDashboardData, PatientNextAppointment } from "../../../types/dashboard";
import type { PatientAppointmentListItem } from "../../../types/patient";
import { formatIsoDateToBr, formatIsoDateToLongPtBr } from "../../../utils/dateParsers";
import { getGreeting } from "../../../utils/formatters";
import { getApiErrorMessage } from "../../../utils/getApiErrorMessage";
import {
  getNowInTimeZone,
  hasNoShowWindowElapsedForDate,
  parseTimeToMinutes,
} from "../../../utils/timeParsers";
import { notifyError, notifySuccess } from "../../../utils/toast";
import {
  AppointmentAction,
  AppointmentBody,
  AppointmentDateRow,
  AppointmentMeta,
  AppointmentProfessional,
  type AppointmentStatusVariant,
  AppointmentTopBar,
  ConfirmPresenceButton,
  DetailItem,
  DetailLabel,
  DetailLink,
  DetailsGrid,
  DetailValue,
  EmptyCardText,
  HeroBanner,
  HeroSubtitle,
  HeroTitle,
  NextAppointmentCard,
  NextAppointmentContent,
  NextAppointmentsList,
  PageWrapper,
  QuickAccessGrid,
  QuickAccessSection,
  SectionHeader,
  SectionTitle,
  StatsGrid,
  StatusBadge,
} from "./styles";

const EMPTY_DASHBOARD: PatientDashboardData = {
  stats: {
    upcomingCount: 0,
    completedCount: 0,
    lastAppointmentDate: null,
    unreadNotifications: 0,
  },
  nextAppointment: null,
  upcomingAppointments: [],
};

const QUICK_ACCESS = [
  {
    icon: <CalendarRange size={20} />,
    label: "Meus Agendamentos",
    color: "#2563EB",
    path: "/paciente/agendamentos",
  },
  {
    icon: <Clock3 size={20} />,
    label: "Histórico",
    color: "#9333EA",
    path: "/paciente/historico",
  },
  {
    icon: <Bell size={20} />,
    label: "Notificações",
    color: "#EA580C",
    path: "/paciente/notificacoes",
  },
  {
    icon: <User size={20} />,
    label: "Meu Perfil",
    color: "#16A34A",
    path: "/paciente/perfil",
  },
];

const shouldHideFromUpcoming = (appointment: PatientNextAppointment): boolean => {
  const normalizedStatus = appointment.status.trim().toUpperCase();
  if (!["SCHEDULED", "CONFIRMED"].includes(normalizedStatus)) return false;
  return hasNoShowWindowElapsedForDate(appointment.appointmentDate, appointment.startTime);
};

// ─── Recent history helpers ────────────────────────────────────────────────────

const HIST_STATUS_ALIASES: Record<string, string> = {
  DONE: "COMPLETED",
  FINISHED: "COMPLETED",
  CONCLUDED: "COMPLETED",
  NOSHOW: "NO_SHOW",
  CANCELED: "CANCELLED",
};

const normalizeHistSt = (status: string): string => {
  const up = status
    .trim()
    .toUpperCase()
    .replace(/[\s-]+/g, "_");
  return HIST_STATUS_ALIASES[up] ?? up;
};

const isHistoricalAppt = (appt: PatientAppointmentListItem): boolean => {
  const st = normalizeHistSt(appt.status);
  if (["COMPLETED", "NO_SHOW", "CANCELLED", "RESCHEDULED"].includes(st)) return true;
  const now = getNowInTimeZone();
  if (appt.appointmentDate < now.dateIso) return true;
  if (appt.appointmentDate > now.dateIso) return false;
  const mins = parseTimeToMinutes(appt.endTime) ?? parseTimeToMinutes(appt.startTime);
  return mins !== null && now.minutesOfDay >= mins;
};

const histSortStamp = (appt: PatientAppointmentListItem): number => {
  const m = appt.appointmentDate.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!m) return 0;
  return (
    Date.UTC(Number(m[1]), Number(m[2]) - 1, Number(m[3])) +
    (parseTimeToMinutes(appt.startTime) ?? 0) * 60_000
  );
};

const HIST_STATUS_META: Record<string, { label: string; variant: AppointmentStatusVariant }> = {
  COMPLETED: { label: "Realizada", variant: "neutral" },
  NO_SHOW: { label: "Não compareceu", variant: "danger" },
  CANCELLED: { label: "Cancelada", variant: "danger" },
  RESCHEDULED: { label: "Reagendada", variant: "warning" },
  IN_PROGRESS: { label: "Em atendimento", variant: "warning" },
  WAITING: { label: "Aguardando", variant: "warning" },
  CONFIRMED: { label: "Confirmada", variant: "success" },
  SCHEDULED: { label: "Agendada", variant: "info" },
};

const RECENT_HISTORY_LIMIT = 6;

const formatDate = (isoDate: string | null | undefined): string => {
  return formatIsoDateToBr(isoDate, "--/--/----");
};

const formatFullDate = (isoDate: string | null | undefined): string => {
  return formatIsoDateToLongPtBr(isoDate, "--");
};

const mapStatusLabel = (status: string): string => {
  const normalizedStatus = status.trim().toUpperCase();

  switch (normalizedStatus) {
    case "CONFIRMED":
      return "Confirmada";
    case "SCHEDULED":
      return "Agendada";
    case "WAITING":
      return "Aguardando";
    case "IN_PROGRESS":
      return "Em atendimento";
    case "COMPLETED":
      return "Concluída";
    case "DONE":
      return "Concluída";
    case "RESCHEDULED":
      return "Reagendada";
    case "NO_SHOW":
      return "Não compareceu";
    case "CANCELLED":
      return "Cancelada";
    default:
      return normalizedStatus || "Agendada";
  }
};

const mapStatusVariant = (status: string): AppointmentStatusVariant => {
  const normalizedStatus = status.trim().toUpperCase();

  switch (normalizedStatus) {
    case "CONFIRMED":
      return "success";
    case "SCHEDULED":
      return "info";
    case "WAITING":
    case "IN_PROGRESS":
      return "warning";
    case "COMPLETED":
    case "DONE":
      return "neutral";
    case "RESCHEDULED":
      return "info";
    case "NO_SHOW":
    case "CANCELLED":
      return "danger";
    default:
      return "info";
  }
};

const mapTypeLabel = (type: string): string => {
  const normalizedType = type.trim().toUpperCase();

  switch (normalizedType) {
    case "FIRST_CONSULTATION":
      return "Primeira consulta";
    case "CONSULTATION":
      return "Consulta";
    case "RETURN":
      return "Retorno";
    case "ROUTINE":
      return "Rotina";
    case "EXAM":
      return "Exame";
    case "EMERGENCY":
      return "Urgência";
    default:
      return normalizedType || "Consulta";
  }
};

const mapChannelLabel = (channel: string): string => {
  const normalizedChannel = channel.trim().toUpperCase();

  switch (normalizedChannel) {
    case "IN_PERSON":
      return "Presencial";
    case "ONLINE":
      return "Online";
    case "TELEMEDICINE":
      return "Telemedicina";
    default:
      return normalizedChannel || "Presencial";
  }
};

const formatAppointmentDateTime = (isoDate: string, time: string): string => {
  const fallback = `${formatDate(isoDate)} às ${time}`;
  const match = isoDate.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (!match) return fallback;

  const localDate = new Date(`${match[1]}-${match[2]}-${match[3]}T00:00:00`);
  if (Number.isNaN(localDate.getTime())) return fallback;

  const prettyDate = localDate.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  return `${prettyDate} às ${time}`;
};

const PatientDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState<PatientDashboardData>(EMPTY_DASHBOARD);
  const [loading, setLoading] = useState(true);
  const [confirmingAppointmentId, setConfirmingAppointmentId] = useState<string | null>(null);
  const [selectedAppointmentId, setSelectedAppointmentId] = useState<string | null>(null);
  const [recentHistory, setRecentHistory] = useState<PatientAppointmentListItem[]>([]);

  useEffect(() => {
    let mounted = true;

    const loadDashboard = async () => {
      try {
        const [data, histResult] = await Promise.all([
          getPatientDashboard(),
          listPatientAppointments().catch(() => ({ total: 0, appointments: [] })),
        ]);
        if (!mounted) return;
        setDashboardData(data);
        const recent = histResult.appointments
          .filter(isHistoricalAppt)
          .sort((a, b) => histSortStamp(b) - histSortStamp(a))
          .slice(0, RECENT_HISTORY_LIMIT);
        setRecentHistory(recent);
      } catch (error: unknown) {
        if (!mounted) return;
        notifyError(
          getApiErrorMessage(error, "Não foi possível carregar o dashboard do paciente."),
        );
        setDashboardData(EMPTY_DASHBOARD);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    void loadDashboard();

    return () => {
      mounted = false;
    };
  }, []);

  const greeting = getGreeting();
  const firstName = user?.name.split(" ")[0] ?? "Paciente";
  const todayLabel = new Date().toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  const upcomingAppointments = dashboardData.upcomingAppointments.filter(
    (appointment) => !shouldHideFromUpcoming(appointment),
  );

  const stats = [
    {
      icon: <CalendarDays size={22} color="#2563EB" />,
      iconBg: theme.colors.featureBg.blue,
      label: "Próximas consultas",
      value: String(upcomingAppointments.length),
    },
    {
      icon: <CheckCircle size={22} color="#16A34A" />,
      iconBg: theme.colors.featureBg.green,
      label: "Concluídas",
      value: String(dashboardData.stats.completedCount),
    },
    {
      icon: <Clock3 size={22} color="#9333EA" />,
      iconBg: theme.colors.featureBg.purple,
      label: "Última consulta",
      value: formatDate(dashboardData.stats.lastAppointmentDate),
    },
    {
      icon: <Bell size={22} color="#EA580C" />,
      iconBg: theme.colors.featureBg.orange,
      label: "Não lidas",
      value: String(dashboardData.stats.unreadNotifications),
    },
  ];

  const selectedAppointment =
    upcomingAppointments.find((appointment) => appointment.id === selectedAppointmentId) ?? null;

  const closeDetailsModal = () => {
    setSelectedAppointmentId(null);
  };

  const isAppointmentConfirmable = (appointment: PatientNextAppointment) =>
    appointment.status.trim().toUpperCase() === "SCHEDULED";

  const handleConfirmPresence = async (appointment: PatientNextAppointment) => {
    if (!appointment.id || !isAppointmentConfirmable(appointment)) return;

    setConfirmingAppointmentId(appointment.id);

    try {
      await confirmPatientAppointment(appointment.id);

      setDashboardData((previous) => {
        const updatedAppointments = previous.upcomingAppointments.map((current) =>
          current.id === appointment.id ? { ...current, status: "CONFIRMED" } : current,
        );

        return {
          ...previous,
          nextAppointment: updatedAppointments[0] ?? null,
          upcomingAppointments: updatedAppointments,
        };
      });

      notifySuccess("Presença confirmada com sucesso.");
    } catch (error: unknown) {
      notifyError(getApiErrorMessage(error, "Não foi possível confirmar presença."));
    } finally {
      setConfirmingAppointmentId(null);
    }
  };

  return (
    <PageWrapper>
      <HeroBanner>
        <HeroTitle>
          {greeting}, {firstName}!
        </HeroTitle>
        <HeroSubtitle>
          {loading ? <Skeleton width={220} height={16} /> : `Painel do paciente - ${todayLabel}`}
        </HeroSubtitle>
      </HeroBanner>

      {loading ? (
        <StatsGrid>
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={`patient-dashboard-stat-skeleton-${index}`}
              style={{
                backgroundColor: theme.colors.surface,
                borderRadius: theme.borderRadius.md,
                boxShadow: theme.shadows.md,
                padding: 24,
                display: "flex",
                flexDirection: "column",
                gap: 16,
              }}
            >
              <Skeleton width={48} height={48} radius={10} />
              <Skeleton width="58%" height={14} />
              <Skeleton width="32%" height={30} />
            </div>
          ))}
        </StatsGrid>
      ) : (
        <StatsGrid>
          {stats.map((item) => (
            <StatCard key={item.label} {...item} />
          ))}
        </StatsGrid>
      )}

      <div>
        <SectionHeader>
          <SectionTitle>
            {loading
              ? "Próximas Consultas"
              : upcomingAppointments.length <= 1
                ? "Próxima Consulta"
                : "Próximas Consultas"}
          </SectionTitle>
        </SectionHeader>
        {loading ? (
          <NextAppointmentsList>
            {Array.from({ length: 2 }).map((_, index) => (
              <NextAppointmentCard key={`patient-dashboard-appointment-skeleton-${index}`}>
                <div style={{ padding: 16 }}>
                  <Skeleton width={94} height={24} radius={999} />
                  <div style={{ marginTop: 14 }}>
                    <Skeleton width="54%" height={20} />
                  </div>
                  <div style={{ marginTop: 8 }}>
                    <Skeleton width="66%" height={14} />
                  </div>
                  <div style={{ marginTop: 8 }}>
                    <Skeleton width="42%" height={14} />
                  </div>
                  <div style={{ marginTop: 16 }}>
                    <Skeleton width={168} height={40} radius={10} />
                  </div>
                </div>
              </NextAppointmentCard>
            ))}
          </NextAppointmentsList>
        ) : !upcomingAppointments.length ? (
          <NextAppointmentCard>
            <EmptyCardText>Nenhuma consulta futura encontrada.</EmptyCardText>
          </NextAppointmentCard>
        ) : (
          <NextAppointmentsList>
            {upcomingAppointments.map((appointment, index) => (
              <NextAppointmentCard
                key={`${appointment.id || index}-${appointment.appointmentDate}-${appointment.startTime}`}
              >
                <AppointmentTopBar>
                  <StatusBadge $variant={mapStatusVariant(appointment.status)}>
                    {mapStatusLabel(appointment.status)}
                  </StatusBadge>
                  <DetailLink
                    type="button"
                    onClick={() => setSelectedAppointmentId(appointment.id)}
                  >
                    Ver detalhes
                    <ChevronRight size={14} />
                  </DetailLink>
                </AppointmentTopBar>

                <NextAppointmentContent>
                  <AppointmentBody>
                    <div>
                      <AppointmentProfessional>
                        {appointment.professionalName}
                      </AppointmentProfessional>
                      <AppointmentMeta>
                        {appointment.clinicName ?? "Clinica nao informada"}
                        {appointment.primarySpecialty ? ` - ${appointment.primarySpecialty}` : ""}
                      </AppointmentMeta>
                      <AppointmentDateRow>
                        <CalendarDays size={14} />
                        {formatAppointmentDateTime(
                          appointment.appointmentDate,
                          appointment.startTime,
                        )}
                      </AppointmentDateRow>
                    </div>

                    <AppointmentAction>
                      <ConfirmPresenceButton
                        type="button"
                        onClick={() => void handleConfirmPresence(appointment)}
                        disabled={
                          confirmingAppointmentId === appointment.id ||
                          !isAppointmentConfirmable(appointment)
                        }
                      >
                        {confirmingAppointmentId === appointment.id
                          ? "Confirmando..."
                          : isAppointmentConfirmable(appointment)
                            ? "Confirmar Presenca"
                            : "Presenca confirmada"}
                      </ConfirmPresenceButton>
                    </AppointmentAction>
                  </AppointmentBody>
                </NextAppointmentContent>
              </NextAppointmentCard>
            ))}
          </NextAppointmentsList>
        )}
      </div>

      <QuickActions actions={QUICK_ACCESS} />

      {/* Consultas Anteriores */}
      {!loading && recentHistory.length > 0 && (
        <div>
          <SectionHeader>
            <SectionTitle>Consultas Anteriores</SectionTitle>
            <DetailLink type="button" onClick={() => navigate("/paciente/historico")}>
              Ver histórico completo
              <ChevronRight size={14} />
            </DetailLink>
          </SectionHeader>
          <NextAppointmentsList>
            {recentHistory.map((appt, index) => {
              const st = normalizeHistSt(appt.status);
              const meta = HIST_STATUS_META[st] ?? {
                label: st,
                variant: "info" as AppointmentStatusVariant,
              };
              return (
                <NextAppointmentCard key={appt.id || `hist-${index}`}>
                  <AppointmentTopBar>
                    <StatusBadge $variant={meta.variant}>{meta.label}</StatusBadge>
                  </AppointmentTopBar>
                  <NextAppointmentContent>
                    <AppointmentBody>
                      <div>
                        <AppointmentProfessional>{appt.professionalName}</AppointmentProfessional>
                        <AppointmentMeta>
                          {appt.clinicName ?? "Clínica não informada"}
                          {appt.primarySpecialty ? ` - ${appt.primarySpecialty}` : ""}
                        </AppointmentMeta>
                        <AppointmentDateRow>
                          <CalendarDays size={14} />
                          {formatAppointmentDateTime(appt.appointmentDate, appt.startTime)}
                        </AppointmentDateRow>
                      </div>
                      {st === "COMPLETED" && (
                        <AppointmentAction>
                          <DetailLink
                            type="button"
                            onClick={() =>
                              navigate(
                                `/paciente/documentos?consulta=${appt.id}&paciente=${encodeURIComponent(appt.professionalName)}`,
                              )
                            }
                          >
                            <FileText size={14} />
                            Ver documentos
                          </DetailLink>
                        </AppointmentAction>
                      )}
                    </AppointmentBody>
                  </NextAppointmentContent>
                </NextAppointmentCard>
              );
            })}
          </NextAppointmentsList>
        </div>
      )}

      {selectedAppointment && (
        <Modal
          isOpen={Boolean(selectedAppointment)}
          onClose={closeDetailsModal}
          title="Detalhes da consulta"
          actions={
            <>
              <Button variant="outline" size="small" onClick={closeDetailsModal}>
                Fechar
              </Button>
              <ConfirmPresenceButton
                type="button"
                onClick={() => void handleConfirmPresence(selectedAppointment)}
                disabled={
                  confirmingAppointmentId === selectedAppointment.id ||
                  !isAppointmentConfirmable(selectedAppointment)
                }
              >
                {confirmingAppointmentId === selectedAppointment.id
                  ? "Confirmando..."
                  : isAppointmentConfirmable(selectedAppointment)
                    ? "Confirmar Presenca"
                    : "Presenca confirmada"}
              </ConfirmPresenceButton>
            </>
          }
        >
          <DetailsGrid>
            <DetailItem>
              <DetailLabel>Profissional</DetailLabel>
              <DetailValue>{selectedAppointment.professionalName}</DetailValue>
            </DetailItem>
            <DetailItem>
              <DetailLabel>Status</DetailLabel>
              <DetailValue>{mapStatusLabel(selectedAppointment.status)}</DetailValue>
            </DetailItem>
            <DetailItem>
              <DetailLabel>Data</DetailLabel>
              <DetailValue>{formatFullDate(selectedAppointment.appointmentDate)}</DetailValue>
            </DetailItem>
            <DetailItem>
              <DetailLabel>Horario</DetailLabel>
              <DetailValue>
                {selectedAppointment.startTime} - {selectedAppointment.endTime}
              </DetailValue>
            </DetailItem>
            <DetailItem>
              <DetailLabel>Tipo</DetailLabel>
              <DetailValue>{mapTypeLabel(selectedAppointment.type)}</DetailValue>
            </DetailItem>
            <DetailItem>
              <DetailLabel>Modalidade</DetailLabel>
              <DetailValue>{mapChannelLabel(selectedAppointment.channel)}</DetailValue>
            </DetailItem>
            <DetailItem>
              <DetailLabel>Clinica</DetailLabel>
              <DetailValue>{selectedAppointment.clinicName ?? "Clinica nao informada"}</DetailValue>
            </DetailItem>
            <DetailItem>
              <DetailLabel>Especialidade</DetailLabel>
              <DetailValue>{selectedAppointment.primarySpecialty ?? "Nao informada"}</DetailValue>
            </DetailItem>
          </DetailsGrid>
        </Modal>
      )}
    </PageWrapper>
  );
};

export default PatientDashboard;
