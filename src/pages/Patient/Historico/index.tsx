import { Calendar, CalendarCheck2, ChevronRight, Clock3, FileText, MapPin, Search, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { Button } from "../../../components/Button";
import { Input } from "../../../components/Input";
import { Modal } from "../../../components/Modal";
import { StatCard } from "../../../components/StatCard";
import { listPatientAppointments } from "../../../services/patient-appointments.service";
import { confirmPatientAppointment } from "../../../services/patient-dashboard.service";
import { theme } from "../../../themes/themes";
import type { PatientAppointmentListItem, PatientAppointmentsListResult } from "../../../types/patient";
import { formatIsoDateToBr, formatIsoDateToLongPtBr } from "../../../utils/dateParsers";
import { getApiErrorMessage } from "../../../utils/getApiErrorMessage";
import {
  getNowInTimeZone,
  hasNoShowWindowElapsedForDate,
  parseTimeToMinutes,
} from "../../../utils/timeParsers";
import { notifyError, notifySuccess } from "../../../utils/toast";
import {
  ActionRow,
  CardBody,
  CardCode,
  CardTopBar,
  ClinicText,
  ConfirmPresenceBtn,
  DatePill,
  EmptyState,
  FilterChip,
  FiltersRow,
  HeaderRow,
  HistoryCard,
  HistoryList,
  ModalGrid,
  ModalItem,
  ModalLabel,
  ModalValue,
  PageTitle,
  PageWrapper,
  ProfessionalBlock,
  ProfessionalName,
  SearchRow,
  SectionTitle,
  SpecialtyText,
  StatsGrid,
  StatusBadge,
  StatusMessage,
  ViewButton,
  type AppointmentBadgeVariant,
} from "./styles";

type FilterKey = "ALL" | "COMPLETED" | "NO_SHOW" | "CANCELLED";

const EMPTY_RESULT: PatientAppointmentsListResult = {
  total: 0,
  appointments: [],
};

const FILTER_OPTIONS: Array<{ key: FilterKey; label: string }> = [
  { key: "ALL", label: "Todos" },
  { key: "COMPLETED", label: "Compareceu" },
  { key: "NO_SHOW", label: "Não compareceu" },
  { key: "CANCELLED", label: "Cancelado" },
];

const STATUS_META: Record<string, { label: string; variant: AppointmentBadgeVariant }> = {
  COMPLETED: { label: "Compareceu", variant: "completed" },
  COMPLETED_WITH_ADDENDUM: { label: "Compareceu", variant: "completed" },
  NO_SHOW: { label: "Não compareceu", variant: "noshow" },
  CANCELLED: { label: "Cancelado", variant: "cancelled" },
  RESCHEDULED: { label: "Reagendado", variant: "rescheduled" },
};

const UPCOMING_STATUS_META: Record<string, { label: string; variant: AppointmentBadgeVariant }> = {
  SCHEDULED: { label: "Agendada", variant: "upcoming" },
  CONFIRMED: { label: "Confirmada", variant: "confirmed" },
  WAITING: { label: "Aguardando", variant: "confirmed" },
  IN_PROGRESS: { label: "Em atendimento", variant: "confirmed" },
};

const STATUS_ALIASES: Record<string, string> = {
  DONE: "COMPLETED",
  FINISHED: "COMPLETED",
  CONCLUDED: "COMPLETED",
  CONCLUIDO: "COMPLETED",
  NOSHOW: "NO_SHOW",
  CANCELED: "CANCELLED",
};

const normalizeStatus = (status: string): string => {
  const normalized = status.trim().toUpperCase().replace(/[\s-]+/g, "_");
  return STATUS_ALIASES[normalized] ?? normalized;
};

const normalizeSearch = (value: string): string =>
  value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();

const hasNoShowWindowElapsed = (appointmentDate: string, startTime: string): boolean => {
  return hasNoShowWindowElapsedForDate(appointmentDate, startTime);
};

const resolveDisplayStatus = (appointment: PatientAppointmentListItem): string => {
  const normalized = normalizeStatus(appointment.status);
  if (
    ["SCHEDULED", "CONFIRMED", "WAITING"].includes(normalized) &&
    hasNoShowWindowElapsed(appointment.appointmentDate, appointment.startTime)
  ) {
    return "NO_SHOW";
  }
  return normalized;
};

const isHistoricalAppointment = (appointment: PatientAppointmentListItem): boolean => {
  const displayStatus = resolveDisplayStatus(appointment);
  if (["COMPLETED", "COMPLETED_WITH_ADDENDUM", "NO_SHOW", "CANCELLED", "RESCHEDULED"].includes(displayStatus)) return true;

  const now = getNowInTimeZone();
  if (appointment.appointmentDate < now.dateIso) return true;
  if (appointment.appointmentDate > now.dateIso) return false;

  const referenceMinutes =
    parseTimeToMinutes(appointment.endTime) ?? parseTimeToMinutes(appointment.startTime);
  if (referenceMinutes === null) return false;

  return now.minutesOfDay >= referenceMinutes;
};

const getStatusMeta = (status: string) =>
  STATUS_META[normalizeStatus(status)] ?? { label: "Historico", variant: "default" as const };

const statusMatchesFilter = (status: string, filter: FilterKey): boolean => {
  const normalized = normalizeStatus(status);
  if (filter === "ALL") return true;
  if (filter === "CANCELLED") {
    return normalized === "CANCELLED" || normalized === "RESCHEDULED";
  }
  return normalized === filter;
};

const toSortStamp = (appointment: PatientAppointmentListItem): number => {
  const dateMatch = appointment.appointmentDate.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!dateMatch) return 0;

  const dayStart = Date.UTC(
    Number(dateMatch[1]),
    Number(dateMatch[2]) - 1,
    Number(dateMatch[3]),
    0,
    0,
    0,
    0,
  );
  const startMinutes = parseTimeToMinutes(appointment.startTime) ?? 0;
  return dayStart + startMinutes * 60 * 1000;
};

const formatDateBr = (value: string): string => {
  return formatIsoDateToBr(value, "--/--/----", { strictIsoOnly: true });
};

const formatLongDate = (value: string): string => {
  return formatIsoDateToLongPtBr(value, "--");
};

const mapTypeLabel = (type: string): string => {
  const normalized = type.trim().toUpperCase();

  switch (normalized) {
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
      return normalized || "Consulta";
  }
};

const mapChannelLabel = (channel: string): string => {
  const normalized = channel.trim().toUpperCase();

  switch (normalized) {
    case "IN_PERSON":
      return "Presencial";
    case "ONLINE":
      return "Online";
    case "ONLINE_PORTAL":
      return "Portal Online";
    case "TELEMEDICINE":
      return "Telemedicina";
    default:
      return normalized || "Presencial";
  }
};

const PatientHistoryPage = () => {
  const navigate = useNavigate();
  const [result, setResult] = useState<PatientAppointmentsListResult>(EMPTY_RESULT);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState<FilterKey>("ALL");
  const [selectedAppointment, setSelectedAppointment] = useState<PatientAppointmentListItem | null>(
    null,
  );
  const [confirmingId, setConfirmingId] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const loadHistory = async () => {
      setLoading(true);
      setErrorMessage(null);

      try {
        const response = await listPatientAppointments();
        if (!mounted) return;
        setResult(response);
      } catch (error: unknown) {
        if (!mounted) return;
        const message = getApiErrorMessage(error, "Nao foi possivel carregar o historico.");
        setErrorMessage(message);
        setResult(EMPTY_RESULT);
        notifyError(message);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    void loadHistory();

    return () => {
      mounted = false;
    };
  }, []);

  const historicalAppointments = useMemo(
    () => result.appointments.filter(isHistoricalAppointment),
    [result.appointments],
  );

  const upcomingAppointments = useMemo(
    () =>
      result.appointments
        .filter((appt) => !isHistoricalAppointment(appt))
        .sort((a, b) => toSortStamp(a) - toSortStamp(b)),
    [result.appointments],
  );

  const handleConfirmPresence = async (id: string) => {
    setConfirmingId(id);
    try {
      await confirmPatientAppointment(id);
      setResult((prev) => ({
        ...prev,
        appointments: prev.appointments.map((a) =>
          a.id === id ? { ...a, status: "CONFIRMED" } : a,
        ),
      }));
      notifySuccess("Presença confirmada com sucesso.");
    } catch (err) {
      notifyError(getApiErrorMessage(err, "Não foi possível confirmar presença."));
    } finally {
      setConfirmingId(null);
    }
  };

  const filteredAppointments = useMemo(() => {
    const query = normalizeSearch(searchTerm);

    return historicalAppointments
      .filter((appointment) => statusMatchesFilter(resolveDisplayStatus(appointment), activeFilter))
      .filter((appointment) => {
        if (!query) return true;
        const haystack = normalizeSearch(
          `${appointment.professionalName} ${appointment.clinicName ?? ""} ${appointment.primarySpecialty ?? ""
          } ${mapTypeLabel(appointment.type)}`,
        );
        return haystack.includes(query);
      })
      .sort((left, right) => toSortStamp(right) - toSortStamp(left));
  }, [activeFilter, historicalAppointments, searchTerm]);

  const stats = useMemo(() => {
    const completed = historicalAppointments.filter(
      (appointment) => resolveDisplayStatus(appointment) === "COMPLETED",
    ).length;
    const noShow = historicalAppointments.filter(
      (appointment) => resolveDisplayStatus(appointment) === "NO_SHOW",
    ).length;
    const cancelled = historicalAppointments.filter((appointment) =>
      ["CANCELLED", "RESCHEDULED"].includes(resolveDisplayStatus(appointment)),
    ).length;

    return [
      {
        icon: <CalendarCheck2 size={20} color="#2563EB" />,
        iconBg: theme.colors.featureBg.blue,
        label: "Total no historico",
        value: String(historicalAppointments.length),
      },
      {
        icon: <CalendarCheck2 size={20} color="#16A34A" />,
        iconBg: theme.colors.featureBg.green,
        label: "Compareceu",
        value: String(completed),
      },
      {
        icon: <Clock3 size={20} color="#DC2626" />,
        iconBg: theme.colors.featureBg.orange,
        label: "Não compareceu",
        value: String(noShow),
      },
      {
        icon: <X size={20} color="#B91C1C" />,
        iconBg: theme.colors.featureBg.orange,
        label: "Canceladas",
        value: String(cancelled),
      },
    ];
  }, [historicalAppointments]);

  return (
    <PageWrapper>
      <HeaderRow>
        <PageTitle>Historico de Consultas</PageTitle>
      </HeaderRow>

      <StatsGrid>
        {stats.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </StatsGrid>

      <SearchRow>
        <Input
          fullWidth
          icon={<Search size={16} />}
          placeholder="Buscar por profissional, clinica ou especialidade..."
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
        />
      </SearchRow>

      <FiltersRow>
        {FILTER_OPTIONS.map((filter) => (
          <FilterChip
            key={filter.key}
            type="button"
            $active={activeFilter === filter.key}
            onClick={() => setActiveFilter(filter.key)}
          >
            {filter.label}
          </FilterChip>
        ))}
      </FiltersRow>

      {!loading && !errorMessage && upcomingAppointments.length > 0 && (
        <div>
          <SectionTitle>Próximas Consultas</SectionTitle>
          <HistoryList>
            {upcomingAppointments.map((appt, index) => {
              const st = appt.status ?? "SCHEDULED";
              const meta =
                UPCOMING_STATUS_META[st] ?? { label: "Agendada", variant: "upcoming" as AppointmentBadgeVariant };
              return (
                <HistoryCard key={appt.id || `up-${index}`}>
                  <CardTopBar>
                    <StatusBadge $variant={meta.variant}>{meta.label}</StatusBadge>
                  </CardTopBar>
                  <CardBody>
                    <ProfessionalBlock>
                      <ProfessionalName>{appt.professionalName}</ProfessionalName>
                      <SpecialtyText>
                        {appt.primarySpecialty ?? "Especialidade não informada"}
                      </SpecialtyText>
                      <ClinicText>
                        <MapPin size={13} />
                        {appt.clinicName ?? "Clínica não informada"}
                      </ClinicText>
                      <ActionRow>
                        {st === "SCHEDULED" && (
                          <ConfirmPresenceBtn
                            type="button"
                            disabled={confirmingId === appt.id}
                            onClick={() => void handleConfirmPresence(appt.id)}
                          >
                            {confirmingId === appt.id ? "Confirmando..." : "Confirmar Presença"}
                          </ConfirmPresenceBtn>
                        )}
                      </ActionRow>
                    </ProfessionalBlock>
                    <DatePill>
                      <Calendar size={14} />
                      {formatDateBr(appt.appointmentDate)}
                      <Clock3 size={14} />
                      {appt.startTime}
                    </DatePill>
                  </CardBody>
                </HistoryCard>
              );
            })}
          </HistoryList>
        </div>
      )}

      {loading && <StatusMessage>Carregando historico...</StatusMessage>}
      {!loading && errorMessage && <StatusMessage $error>{errorMessage}</StatusMessage>}

      {!loading && !errorMessage && (
        <>
          {filteredAppointments.length === 0 ? (
            <EmptyState>Nenhuma consulta encontrada para os filtros selecionados.</EmptyState>
          ) : (
            <HistoryList>
              {filteredAppointments.map((appointment, index) => {
                const displayStatus = resolveDisplayStatus(appointment);
                const statusMeta = getStatusMeta(displayStatus);

                return (
                  <HistoryCard key={appointment.id || `${appointment.appointmentDate}-${index}`}>
                    <CardTopBar>
                      <StatusBadge $variant={statusMeta.variant}>{statusMeta.label}</StatusBadge>
                      <CardCode>#{String(index + 1).padStart(4, "0")}</CardCode>
                    </CardTopBar>

                    <CardBody>
                      <ProfessionalBlock>
                        <ProfessionalName>{appointment.professionalName}</ProfessionalName>
                        <SpecialtyText>
                          {appointment.primarySpecialty ?? "Especialidade nao informada"}
                        </SpecialtyText>
                        <ClinicText>
                          <MapPin size={13} />
                          {appointment.clinicName ?? "Clinica nao informada"}
                        </ClinicText>

                        <ActionRow>
                          <ViewButton type="button" onClick={() => setSelectedAppointment(appointment)}>
                            Ver detalhes
                            <ChevronRight size={14} />
                          </ViewButton>
                          {displayStatus === "COMPLETED" && (
                            <ViewButton
                              type="button"
                              onClick={() =>
                                navigate(
                                  `/paciente/documentos?consulta=${appointment.id}&paciente=${encodeURIComponent(appointment.professionalName)}`,
                                )
                              }
                            >
                              <FileText size={14} />
                              Ver documentos
                            </ViewButton>
                          )}
                        </ActionRow>
                      </ProfessionalBlock>

                      <DatePill>
                        <Calendar size={14} />
                        {formatDateBr(appointment.appointmentDate)}
                        <Clock3 size={14} />
                        {appointment.startTime}
                      </DatePill>
                    </CardBody>
                  </HistoryCard>
                );
              })}
            </HistoryList>
          )}
        </>
      )}

      {selectedAppointment && (
        <Modal
          isOpen={Boolean(selectedAppointment)}
          onClose={() => setSelectedAppointment(null)}
          title="Detalhes da consulta"
          actions={
            <Button variant="outline" size="small" onClick={() => setSelectedAppointment(null)}>
              Fechar
            </Button>
          }
        >
          <ModalGrid>
            <ModalItem>
              <ModalLabel>Profissional</ModalLabel>
              <ModalValue>{selectedAppointment.professionalName}</ModalValue>
            </ModalItem>
            <ModalItem>
              <ModalLabel>Status</ModalLabel>
              <ModalValue>{getStatusMeta(resolveDisplayStatus(selectedAppointment)).label}</ModalValue>
            </ModalItem>
            <ModalItem>
              <ModalLabel>Data</ModalLabel>
              <ModalValue>{formatLongDate(selectedAppointment.appointmentDate)}</ModalValue>
            </ModalItem>
            <ModalItem>
              <ModalLabel>Horario</ModalLabel>
              <ModalValue>
                {selectedAppointment.startTime} - {selectedAppointment.endTime}
              </ModalValue>
            </ModalItem>
            <ModalItem>
              <ModalLabel>Tipo</ModalLabel>
              <ModalValue>{mapTypeLabel(selectedAppointment.type)}</ModalValue>
            </ModalItem>
            <ModalItem>
              <ModalLabel>Modalidade</ModalLabel>
              <ModalValue>{mapChannelLabel(selectedAppointment.channel)}</ModalValue>
            </ModalItem>
            <ModalItem>
              <ModalLabel>Clinica</ModalLabel>
              <ModalValue>{selectedAppointment.clinicName ?? "Clinica nao informada"}</ModalValue>
            </ModalItem>
            <ModalItem>
              <ModalLabel>Observacoes</ModalLabel>
              <ModalValue>{selectedAppointment.notes ?? "Sem observacoes."}</ModalValue>
            </ModalItem>
          </ModalGrid>
        </Modal>
      )}
    </PageWrapper>
  );
};

export default PatientHistoryPage;
