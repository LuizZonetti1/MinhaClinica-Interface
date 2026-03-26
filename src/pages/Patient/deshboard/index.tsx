import {
  Bell,
  CalendarDays,
  CalendarRange,
  CheckCircle,
  ChevronRight,
  Clock3,
  X,
  User,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { Button } from "../../../components/Button";
import { QuickAccessCard } from "../../../components/QuickAccessCard";
import { StatCard } from "../../../components/StatCard";
import { useAuth } from "../../../contexts";
import {
  confirmPatientAppointment,
  getPatientDashboard,
} from "../../../services/patient-dashboard.service";
import { theme } from "../../../themes/themes";
import type { PatientDashboardData, PatientNextAppointment } from "../../../types/dashboard";
import { getApiErrorMessage } from "../../../utils/getApiErrorMessage";
import { notifyError, notifySuccess } from "../../../utils/toast";
import {
  AppointmentAction,
  AppointmentBody,
  AppointmentDateRow,
  AppointmentMeta,
  AppointmentProfessional,
  type AppointmentStatusVariant,
  AppointmentTopBar,
  DetailsGrid,
  DetailItem,
  DetailLabel,
  DetailValue,
  ConfirmPresenceButton,
  DetailLink,
  EmptyCardText,
  HeroBanner,
  HeroSubtitle,
  HeroTitle,
  ModalActions,
  ModalCard,
  ModalCloseButton,
  ModalOverlay,
  ModalTitle,
  ModalTitleRow,
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
    label: "Historico",
    color: "#9333EA",
    path: "/paciente/historico",
  },
  {
    icon: <Bell size={20} />,
    label: "Notificacoes",
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

const DEFAULT_TIMEZONE = "America/Sao_Paulo";
const NO_SHOW_GRACE_MINUTES = 30;

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return "Bom dia";
  if (hour < 18) return "Boa tarde";
  return "Boa noite";
};

const parseTimeToMinutes = (timeValue: string): number | null => {
  const match = timeValue.match(/^(\d{2}):(\d{2})$/);
  if (!match) return null;

  const hours = Number(match[1]);
  const minutes = Number(match[2]);
  if (!Number.isInteger(hours) || !Number.isInteger(minutes)) return null;
  if (hours < 0 || hours > 23 || minutes < 0 || minutes > 59) return null;

  return hours * 60 + minutes;
};

const getNowInSaoPaulo = (): { dateIso: string; minutesOfDay: number } => {
  const now = new Date();
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: DEFAULT_TIMEZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(now);

  const map = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  const year = map.year ?? "0000";
  const month = map.month ?? "01";
  const day = map.day ?? "01";
  const hour = Number(map.hour ?? "0");
  const minute = Number(map.minute ?? "0");

  return {
    dateIso: `${year}-${month}-${day}`,
    minutesOfDay: hour * 60 + minute,
  };
};

const shouldHideFromUpcoming = (appointment: PatientNextAppointment): boolean => {
  const normalizedStatus = appointment.status.trim().toUpperCase();
  if (!["SCHEDULED", "CONFIRMED"].includes(normalizedStatus)) return false;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(appointment.appointmentDate)) return false;

  const appointmentMinutes = parseTimeToMinutes(appointment.startTime);
  if (appointmentMinutes === null) return false;

  const nowInSaoPaulo = getNowInSaoPaulo();
  if (appointment.appointmentDate < nowInSaoPaulo.dateIso) return true;
  if (appointment.appointmentDate > nowInSaoPaulo.dateIso) return false;

  return nowInSaoPaulo.minutesOfDay >= appointmentMinutes + NO_SHOW_GRACE_MINUTES;
};

const formatDate = (isoDate: string | null | undefined): string => {
  if (!isoDate) return "--/--/----";
  const match = isoDate.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (match) {
    return `${match[3]}/${match[2]}/${match[1]}`;
  }

  const parsed = new Date(isoDate);
  if (Number.isNaN(parsed.getTime())) return "--/--/----";
  return parsed.toLocaleDateString("pt-BR");
};

const formatFullDate = (isoDate: string | null | undefined): string => {
  if (!isoDate) return "--";

  const match = isoDate.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (match) {
    const asDate = new Date(`${match[1]}-${match[2]}-${match[3]}T00:00:00`);
    return asDate.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  }

  const parsed = new Date(isoDate);
  if (Number.isNaN(parsed.getTime())) return "--";
  return parsed.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
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
      return "Concluida";
    case "NO_SHOW":
      return "Nao compareceu";
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
      return "neutral";
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
      return "Urgencia";
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
  const fallback = `${formatDate(isoDate)} as ${time}`;
  const match = isoDate.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (!match) return fallback;

  const localDate = new Date(`${match[1]}-${match[2]}-${match[3]}T00:00:00`);
  if (Number.isNaN(localDate.getTime())) return fallback;

  const prettyDate = localDate.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  return `${prettyDate} as ${time}`;
};

const PatientDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState<PatientDashboardData>(EMPTY_DASHBOARD);
  const [loading, setLoading] = useState(true);
  const [confirmingAppointmentId, setConfirmingAppointmentId] = useState<string | null>(null);
  const [selectedAppointmentId, setSelectedAppointmentId] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const loadDashboard = async () => {
      try {
        const data = await getPatientDashboard();
        if (!mounted) return;
        setDashboardData(data);
      } catch (error: unknown) {
        if (!mounted) return;
        notifyError(
          getApiErrorMessage(error, "Nao foi possivel carregar o dashboard do paciente."),
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
      label: "Proximas consultas",
      value: String(upcomingAppointments.length),
    },
    {
      icon: <CheckCircle size={22} color="#16A34A" />,
      iconBg: theme.colors.featureBg.green,
      label: "Concluidas",
      value: String(dashboardData.stats.completedCount),
    },
    {
      icon: <Clock3 size={22} color="#9333EA" />,
      iconBg: theme.colors.featureBg.purple,
      label: "Ultima consulta",
      value: formatDate(dashboardData.stats.lastAppointmentDate),
    },
    {
      icon: <Bell size={22} color="#EA580C" />,
      iconBg: theme.colors.featureBg.orange,
      label: "Nao lidas",
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

      notifySuccess("Presenca confirmada com sucesso.");
    } catch (error: unknown) {
      notifyError(getApiErrorMessage(error, "Nao foi possivel confirmar presenca."));
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
          {loading ? "Carregando seus dados..." : `Painel do paciente - ${todayLabel}`}
        </HeroSubtitle>
      </HeroBanner>

      <StatsGrid>
        {stats.map((item) => (
          <StatCard key={item.label} {...item} />
        ))}
      </StatsGrid>

      <div>
        <SectionHeader>
          <SectionTitle>
            {upcomingAppointments.length <= 1 ? "Proxima Consulta" : "Proximas Consultas"}
          </SectionTitle>
        </SectionHeader>
        {!upcomingAppointments.length ? (
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
                  <DetailLink type="button" onClick={() => setSelectedAppointmentId(appointment.id)}>
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

      <QuickAccessSection>
        <SectionTitle>Acesso Rapido</SectionTitle>
        <QuickAccessGrid>
          {QUICK_ACCESS.map((item) => (
            <QuickAccessCard
              key={item.label}
              icon={item.icon}
              label={item.label}
              color={item.color}
              onClick={() => navigate(item.path)}
            />
          ))}
        </QuickAccessGrid>
      </QuickAccessSection>

      {selectedAppointment && (
        <ModalOverlay onClick={closeDetailsModal}>
          <ModalCard onClick={(event) => event.stopPropagation()}>
            <ModalTitleRow>
              <ModalTitle>Detalhes da consulta</ModalTitle>
              <ModalCloseButton type="button" onClick={closeDetailsModal} aria-label="Fechar">
                <X size={18} />
              </ModalCloseButton>
            </ModalTitleRow>

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

            <ModalActions>
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
            </ModalActions>
          </ModalCard>
        </ModalOverlay>
      )}
    </PageWrapper>
  );
};

export default PatientDashboard;
