import {
  Calendar,
  ChevronRight,
  Clock3,
  MapPin,
  Plus,
  Search,
  X,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "../../../components/Button";
import { Input } from "../../../components/Input";
import {
  createPatientBookingAppointment,
  getPatientBookingSlots,
  listPatientBookingProfessionals,
  searchPatientBookingClinics,
} from "../../../services/patient-booking.service";
import { listPatientAppointments } from "../../../services/patient-appointments.service";
import type {
  PatientAppointmentListItem,
  PatientAppointmentsListResult,
  PatientAppointmentStatus,
  PatientBookingAppointmentType,
  PatientBookingClinicItem,
  PatientBookingProfessionalItem,
  PatientBookingSlotItem,
} from "../../../types/patient";
import { getApiErrorMessage } from "../../../utils/getApiErrorMessage";
import { notifyError, notifyInfo, notifySuccess } from "../../../utils/toast";
import {
  ActionRow,
  AppointmentBody,
  AppointmentCard,
  AppointmentsList,
  AppointmentTopBar,
  BookingEmpty,
  BookingField,
  BookingForm,
  BookingGrid,
  BookingHint,
  BookingInput,
  BookingLabel,
  BookingSelect,
  BookingTextarea,
  CancelButton,
  CardCode,
  ClinicResultButton,
  ClinicResultMeta,
  ClinicResultsList,
  ClinicResultTitle,
  ClinicText,
  DatePill,
  EmptyState,
  FilterChip,
  FiltersRow,
  ModalActions,
  ModalCard,
  ModalCloseButton,
  ModalGrid,
  ModalHeader,
  ModalItem,
  ModalLabel,
  ModalOverlay,
  ModalTitle,
  ModalValue,
  PageTitle,
  PageWrapper,
  ProfessionalBlock,
  ProfessionalName,
  SearchRow,
  SlotButton,
  SlotsGrid,
  SpecialtyText,
  StatusBadge,
  StatusMessage,
  TopRow,
  ViewButton,
} from "./styles";
import type { AppointmentBadgeVariant } from "./styles";

type FilterKey = "ALL" | "CONFIRMED" | "PENDING" | "CANCELLED";

const EMPTY_RESULT: PatientAppointmentsListResult = {
  total: 0,
  appointments: [],
};

const FILTER_OPTIONS: Array<{ key: FilterKey; label: string }> = [
  { key: "ALL", label: "Todos" },
  { key: "CONFIRMED", label: "Confirmado" },
  { key: "PENDING", label: "Pendente" },
  { key: "CANCELLED", label: "Cancelado" },
];

const FILTER_TO_STATUS: Record<FilterKey, PatientAppointmentStatus | undefined> = {
  ALL: undefined,
  CONFIRMED: "CONFIRMED",
  PENDING: "SCHEDULED",
  CANCELLED: "CANCELLED",
};

const STATUS_META: Record<string, { label: string; variant: AppointmentBadgeVariant }> = {
  CONFIRMED: { label: "Confirmado", variant: "confirmed" },
  SCHEDULED: { label: "Pendente", variant: "pending" },
  WAITING: { label: "Aguardando", variant: "waiting" },
  IN_PROGRESS: { label: "Em atendimento", variant: "progress" },
  COMPLETED: { label: "Compareceu", variant: "completed" },
  NO_SHOW: { label: "Nao compareceu", variant: "cancelled" },
  CANCELLED: { label: "Cancelado", variant: "cancelled" },
};

const DEFAULT_TIMEZONE = "America/Sao_Paulo";
const NO_SHOW_GRACE_MINUTES = 30;

const BOOKING_TYPE_OPTIONS: Array<{ value: PatientBookingAppointmentType; label: string }> = [
  { value: "CONSULTATION", label: "Consulta" },
  { value: "RETURN", label: "Retorno" },
  { value: "EXAM", label: "Exame" },
  { value: "EMERGENCY", label: "Emergencia" },
];

const formatDateBr = (value: string): string => {
  const match = value.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (match) return `${match[3]}/${match[2]}/${match[1]}`;

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "--/--/----";

  return date.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

const formatLongDate = (value: string): string => {
  const match = value.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (match) {
    const asDate = new Date(`${match[1]}-${match[2]}-${match[3]}T00:00:00`);
    return asDate.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  }

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return "--";
  return parsed.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
};

const getLocalDateISO = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
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
      return "Urgencia";
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

const STATUS_ALIASES: Record<string, string> = {
  DONE: "COMPLETED",
  FINISHED: "COMPLETED",
  CONCLUDED: "COMPLETED",
  CONCLUIDO: "COMPLETED",
  NOSHOW: "NO_SHOW",
};

const normalizeAppointmentStatus = (status: string): string => {
  const normalized = status.trim().toUpperCase();
  return STATUS_ALIASES[normalized] ?? normalized;
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

const hasNoShowWindowElapsed = (appointmentDate: string, startTime: string): boolean => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(appointmentDate)) return false;

  const appointmentMinutes = parseTimeToMinutes(startTime);
  if (appointmentMinutes === null) return false;

  const nowInSaoPaulo = getNowInSaoPaulo();
  if (appointmentDate < nowInSaoPaulo.dateIso) return true;
  if (appointmentDate > nowInSaoPaulo.dateIso) return false;

  return nowInSaoPaulo.minutesOfDay >= appointmentMinutes + NO_SHOW_GRACE_MINUTES;
};

const resolveDisplayStatus = (appointment: PatientAppointmentListItem): string => {
  const normalized = normalizeAppointmentStatus(appointment.status);

  if (
    ["SCHEDULED", "CONFIRMED"].includes(normalized) &&
    hasNoShowWindowElapsed(appointment.appointmentDate, appointment.startTime)
  ) {
    return "NO_SHOW";
  }

  return normalized;
};

const normalizeSearch = (value: string): string =>
  value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();

const filterClinicsIgnoringAccents = (
  clinics: PatientBookingClinicItem[],
  query: string,
): PatientBookingClinicItem[] => {
  const normalizedQuery = normalizeSearch(query);
  if (!normalizedQuery) return clinics;

  return clinics.filter((clinic) => {
    const haystack = normalizeSearch(
      `${clinic.tradeName} ${clinic.city} ${clinic.state} ${clinic.neighborhood}`,
    );
    return haystack.includes(normalizedQuery);
  });
};

const getStatusMeta = (status: string) =>
  STATUS_META[normalizeAppointmentStatus(status)] ?? { label: status, variant: "default" as const };

const isPendingStatus = (status: string) => normalizeAppointmentStatus(status) === "SCHEDULED";

const PatientAppointmentsPage = () => {
  const todayIso = useMemo(() => getLocalDateISO(new Date()), []);
  const allClinicsCacheRef = useRef<PatientBookingClinicItem[] | null>(null);

  const [result, setResult] = useState<PatientAppointmentsListResult>(EMPTY_RESULT);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState<FilterKey>("ALL");
  const [selectedAppointment, setSelectedAppointment] =
    useState<PatientAppointmentListItem | null>(null);

  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [bookingClinicQuery, setBookingClinicQuery] = useState("");
  const [bookingClinics, setBookingClinics] = useState<PatientBookingClinicItem[]>([]);
  const [bookingClinicsLoading, setBookingClinicsLoading] = useState(false);
  const [selectedClinic, setSelectedClinic] = useState<PatientBookingClinicItem | null>(null);
  const [bookingProfessionals, setBookingProfessionals] = useState<PatientBookingProfessionalItem[]>(
    [],
  );
  const [bookingProfessionalsLoading, setBookingProfessionalsLoading] = useState(false);
  const [selectedProfessionalId, setSelectedProfessionalId] = useState("");
  const [bookingDate, setBookingDate] = useState(todayIso);
  const [bookingSlots, setBookingSlots] = useState<PatientBookingSlotItem[]>([]);
  const [bookingSlotsLoading, setBookingSlotsLoading] = useState(false);
  const [selectedSlotStartTime, setSelectedSlotStartTime] = useState("");
  const [bookingType, setBookingType] = useState<PatientBookingAppointmentType>("CONSULTATION");
  const [bookingNotes, setBookingNotes] = useState("");
  const [bookingSubmitting, setBookingSubmitting] = useState(false);

  useEffect(() => {
    let mounted = true;

    const loadAppointments = async () => {
      setLoading(true);
      setErrorMessage(null);

      try {
        const response = await listPatientAppointments(FILTER_TO_STATUS[activeFilter]);
        if (!mounted) return;
        setResult(response);
      } catch (error: unknown) {
        if (!mounted) return;
        const message = getApiErrorMessage(error, "Nao foi possivel carregar os agendamentos.");
        setErrorMessage(message);
        setResult(EMPTY_RESULT);
        notifyError(message);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    void loadAppointments();

    return () => {
      mounted = false;
    };
  }, [activeFilter]);

  useEffect(() => {
    if (!isBookingOpen) return;
    const query = bookingClinicQuery.trim();

    if (!query) {
      setBookingClinics([]);
      setBookingClinicsLoading(false);
      return;
    }

    let active = true;
    const timer = window.setTimeout(async () => {
      setBookingClinicsLoading(true);

      try {
        const clinics = await searchPatientBookingClinics(query);
        if (!active) return;

        if (clinics.length > 0) {
          setBookingClinics(clinics);
          return;
        }

        if (!allClinicsCacheRef.current) {
          allClinicsCacheRef.current = await searchPatientBookingClinics("");
          if (!active) return;
        }

        const fallbackClinics = filterClinicsIgnoringAccents(
          allClinicsCacheRef.current ?? [],
          query,
        );
        setBookingClinics(fallbackClinics);
      } catch (error: unknown) {
        if (!active) return;
        setBookingClinics([]);
        notifyError(getApiErrorMessage(error, "Nao foi possivel buscar clinicas."));
      } finally {
        if (active) setBookingClinicsLoading(false);
      }
    }, 300);

    return () => {
      active = false;
      window.clearTimeout(timer);
    };
  }, [bookingClinicQuery, isBookingOpen]);

  useEffect(() => {
    if (!isBookingOpen || !selectedClinic?.id) {
      setBookingProfessionals([]);
      setSelectedProfessionalId("");
      return;
    }

    let active = true;

    const loadProfessionals = async () => {
      setBookingProfessionalsLoading(true);
      try {
        const professionals = await listPatientBookingProfessionals(selectedClinic.id);
        if (!active) return;
        setBookingProfessionals(professionals);
      } catch (error: unknown) {
        if (!active) return;
        setBookingProfessionals([]);
        notifyError(getApiErrorMessage(error, "Nao foi possivel carregar profissionais."));
      } finally {
        if (active) setBookingProfessionalsLoading(false);
      }
    };

    void loadProfessionals();

    return () => {
      active = false;
    };
  }, [isBookingOpen, selectedClinic?.id]);

  useEffect(() => {
    if (!isBookingOpen || !selectedClinic?.id || !selectedProfessionalId || !bookingDate) {
      setBookingSlots([]);
      setSelectedSlotStartTime("");
      return;
    }

    let active = true;

    const loadSlots = async () => {
      setBookingSlotsLoading(true);
      try {
        const response = await getPatientBookingSlots(
          selectedClinic.id,
          selectedProfessionalId,
          bookingDate,
        );
        if (!active) return;
        setBookingSlots(response.slots);
        setSelectedSlotStartTime((current) =>
          response.slots.some((slot) => slot.available && slot.startTime === current) ? current : "",
        );
      } catch (error: unknown) {
        if (!active) return;
        setBookingSlots([]);
        setSelectedSlotStartTime("");
        notifyError(getApiErrorMessage(error, "Nao foi possivel carregar os horarios."));
      } finally {
        if (active) setBookingSlotsLoading(false);
      }
    };

    void loadSlots();

    return () => {
      active = false;
    };
  }, [bookingDate, isBookingOpen, selectedClinic?.id, selectedProfessionalId]);

  const visibleAppointments = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    if (!query) return result.appointments;

    return result.appointments.filter((appointment) => {
      const professional = appointment.professionalName.toLowerCase();
      const clinic = (appointment.clinicName ?? "").toLowerCase();
      const specialty = (appointment.primarySpecialty ?? "").toLowerCase();
      return professional.includes(query) || clinic.includes(query) || specialty.includes(query);
    });
  }, [result.appointments, searchTerm]);

  const resetBookingState = () => {
    setBookingClinicQuery("");
    setBookingClinics([]);
    setSelectedClinic(null);
    setBookingProfessionals([]);
    setSelectedProfessionalId("");
    setBookingDate(todayIso);
    setBookingSlots([]);
    setSelectedSlotStartTime("");
    setBookingType("CONSULTATION");
    setBookingNotes("");
    setBookingSubmitting(false);
  };

  const openBookingModal = () => {
    setSelectedAppointment(null);
    resetBookingState();
    setIsBookingOpen(true);
  };

  const closeBookingModal = () => {
    setIsBookingOpen(false);
    resetBookingState();
  };

  const handleCreateBooking = async () => {
    if (!selectedClinic) {
      notifyError("Selecione uma clinica.");
      return;
    }
    if (!selectedProfessionalId) {
      notifyError("Selecione um profissional.");
      return;
    }
    if (!bookingDate) {
      notifyError("Selecione a data.");
      return;
    }
    if (!selectedSlotStartTime) {
      notifyError("Selecione um horario disponivel.");
      return;
    }

    setBookingSubmitting(true);

    try {
      await createPatientBookingAppointment({
        clinicId: selectedClinic.id,
        professionalId: selectedProfessionalId,
        appointmentDate: bookingDate,
        startTime: selectedSlotStartTime,
        type: bookingType,
        notes: bookingNotes.trim() || undefined,
      });

      const refreshed = await listPatientAppointments(FILTER_TO_STATUS[activeFilter]);
      setResult(refreshed);

      notifySuccess("Agendamento criado com sucesso.");
      closeBookingModal();
    } catch (error: unknown) {
      notifyError(getApiErrorMessage(error, "Nao foi possivel criar o agendamento."));
    } finally {
      setBookingSubmitting(false);
    }
  };

  return (
    <PageWrapper>
      <TopRow>
        <PageTitle>Meus Agendamentos</PageTitle>
        <Button
          type="button"
          variant="primary"
          size="medium"
          icon={<Plus size={16} />}
          onClick={openBookingModal}
        >
          Novo Agendamento
        </Button>
      </TopRow>

      <SearchRow>
        <Input
          fullWidth
          icon={<Search size={16} />}
          placeholder="Buscar por profissional ou clinica..."
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

      {loading && <StatusMessage>Carregando agendamentos...</StatusMessage>}
      {!loading && errorMessage && <StatusMessage $error>{errorMessage}</StatusMessage>}

      {!loading && !errorMessage && (
        <>
          {visibleAppointments.length === 0 ? (
            <EmptyState>Nenhum agendamento encontrado para o filtro selecionado.</EmptyState>
          ) : (
            <AppointmentsList>
              {visibleAppointments.map((appointment, index) => {
                const displayStatus = resolveDisplayStatus(appointment);
                const statusMeta = getStatusMeta(displayStatus);
                return (
                  <AppointmentCard key={appointment.id || `${appointment.appointmentDate}-${index}`}>
                    <AppointmentTopBar>
                      <StatusBadge $variant={statusMeta.variant}>{statusMeta.label}</StatusBadge>
                      <CardCode>#{String(index + 1).padStart(4, "0")}</CardCode>
                    </AppointmentTopBar>

                    <AppointmentBody>
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
                            Ver / Editar
                            <ChevronRight size={14} />
                          </ViewButton>
                          {isPendingStatus(displayStatus) && (
                            <CancelButton
                              type="button"
                              onClick={() => notifyInfo("Cancelamento sera liberado em breve.")}
                            >
                              Cancelar
                            </CancelButton>
                          )}
                        </ActionRow>
                      </ProfessionalBlock>

                      <DatePill>
                        <Calendar size={14} />
                        {formatDateBr(appointment.appointmentDate)}
                        <Clock3 size={14} />
                        {appointment.startTime}
                      </DatePill>
                    </AppointmentBody>
                  </AppointmentCard>
                );
              })}
            </AppointmentsList>
          )}
        </>
      )}

      {selectedAppointment && (
        <ModalOverlay onClick={() => setSelectedAppointment(null)}>
          <ModalCard onClick={(event) => event.stopPropagation()}>
            <ModalHeader>
              <ModalTitle>Detalhes do agendamento</ModalTitle>
              <ModalCloseButton
                type="button"
                onClick={() => setSelectedAppointment(null)}
                aria-label="Fechar"
              >
                <X size={18} />
              </ModalCloseButton>
            </ModalHeader>

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

            <ModalActions>
              <Button variant="outline" size="small" onClick={() => setSelectedAppointment(null)}>
                Fechar
              </Button>
            </ModalActions>
          </ModalCard>
        </ModalOverlay>
      )}

      {isBookingOpen && (
        <ModalOverlay onClick={closeBookingModal}>
          <ModalCard onClick={(event) => event.stopPropagation()}>
            <ModalHeader>
              <ModalTitle>Novo Agendamento</ModalTitle>
              <ModalCloseButton type="button" onClick={closeBookingModal} aria-label="Fechar">
                <X size={18} />
              </ModalCloseButton>
            </ModalHeader>

            <BookingForm>
              <BookingField>
                <BookingLabel>Buscar clinica</BookingLabel>
                <BookingInput
                  type="text"
                  placeholder="Digite nome da clinica ou cidade..."
                  value={bookingClinicQuery}
                  onChange={(event) => {
                    setBookingClinicQuery(event.target.value);
                    setSelectedClinic(null);
                    setSelectedProfessionalId("");
                    setSelectedSlotStartTime("");
                  }}
                />
                <BookingHint>Selecione uma clinica para carregar os profissionais.</BookingHint>
              </BookingField>

              {bookingClinicsLoading ? (
                <BookingEmpty>Buscando clinicas...</BookingEmpty>
              ) : (
                <ClinicResultsList>
                  {bookingClinics.map((clinic) => (
                    <ClinicResultButton
                      key={clinic.id}
                      type="button"
                      $selected={selectedClinic?.id === clinic.id}
                      onClick={() => {
                        setSelectedClinic(clinic);
                        setBookingClinicQuery(clinic.tradeName);
                        setSelectedProfessionalId("");
                        setSelectedSlotStartTime("");
                      }}
                    >
                      <ClinicResultTitle>{clinic.tradeName}</ClinicResultTitle>
                      <ClinicResultMeta>
                        {clinic.city}/{clinic.state}
                      </ClinicResultMeta>
                    </ClinicResultButton>
                  ))}
                  {!bookingClinics.length && bookingClinicQuery.trim().length > 0 && (
                    <BookingEmpty>Nenhuma clinica encontrada para este termo.</BookingEmpty>
                  )}
                </ClinicResultsList>
              )}

              <BookingGrid>
                <BookingField>
                  <BookingLabel>Profissional</BookingLabel>
                  <BookingSelect
                    value={selectedProfessionalId}
                    onChange={(event) => {
                      setSelectedProfessionalId(event.target.value);
                      setSelectedSlotStartTime("");
                    }}
                    disabled={!selectedClinic || bookingProfessionalsLoading}
                  >
                    <option value="">
                      {bookingProfessionalsLoading ? "Carregando..." : "Selecione"}
                    </option>
                    {bookingProfessionals.map((professional) => (
                      <option key={professional.id} value={professional.id}>
                        {professional.name}
                        {professional.specialty ? ` - ${professional.specialty}` : ""}
                      </option>
                    ))}
                  </BookingSelect>
                </BookingField>

                <BookingField>
                  <BookingLabel>Data</BookingLabel>
                  <BookingInput
                    type="date"
                    min={todayIso}
                    value={bookingDate}
                    onChange={(event) => {
                      setBookingDate(event.target.value);
                      setSelectedSlotStartTime("");
                    }}
                  />
                </BookingField>
              </BookingGrid>

              <BookingField>
                <BookingLabel>Horario</BookingLabel>
                {bookingSlotsLoading ? (
                  <BookingEmpty>Carregando horarios...</BookingEmpty>
                ) : (
                  <>
                    {!!bookingSlots.length && (
                      <SlotsGrid>
                        {bookingSlots.map((slot) => (
                          <SlotButton
                            key={`${slot.startTime}-${slot.endTime}`}
                            type="button"
                            $available={slot.available}
                            $selected={selectedSlotStartTime === slot.startTime && slot.available}
                            disabled={!slot.available}
                            onClick={() => slot.available && setSelectedSlotStartTime(slot.startTime)}
                          >
                            {slot.startTime}
                          </SlotButton>
                        ))}
                      </SlotsGrid>
                    )}
                    {!bookingSlots.length && (
                      <BookingEmpty>
                        Selecione clinica, profissional e data para ver os horarios.
                      </BookingEmpty>
                    )}
                  </>
                )}
              </BookingField>

              <BookingGrid>
                <BookingField>
                  <BookingLabel>Tipo de consulta</BookingLabel>
                  <BookingSelect
                    value={bookingType}
                    onChange={(event) =>
                      setBookingType(event.target.value as PatientBookingAppointmentType)
                    }
                  >
                    {BOOKING_TYPE_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </BookingSelect>
                </BookingField>
              </BookingGrid>

              <BookingField>
                <BookingLabel>Observacoes (opcional)</BookingLabel>
                <BookingTextarea
                  placeholder="Adicione observacoes se necessario..."
                  value={bookingNotes}
                  onChange={(event) => setBookingNotes(event.target.value)}
                />
              </BookingField>
            </BookingForm>

            <ModalActions>
              <Button variant="outline" size="small" onClick={closeBookingModal}>
                Cancelar
              </Button>
              <Button
                variant="primary"
                size="small"
                onClick={() => void handleCreateBooking()}
                disabled={bookingSubmitting}
              >
                {bookingSubmitting ? "Agendando..." : "Confirmar Agendamento"}
              </Button>
            </ModalActions>
          </ModalCard>
        </ModalOverlay>
      )}
    </PageWrapper>
  );
};

export default PatientAppointmentsPage;
