import { Calendar, ChevronRight, Clock3, FileText, MapPin, Plus, RotateCcw, Search } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router";
import { Button } from "../../../components/Button";
import { Input } from "../../../components/Input";
import { Modal } from "../../../components/Modal";
import {
  cancelAppointment,
  listPatientAppointments,
  rescheduleAppointment,
} from "../../../services/patient-appointments.service";
import {
  createPatientBookingAppointment,
  getPatientBookingSlots,
  listPatientBookingProfessionals,
  searchPatientBookingClinics,
} from "../../../services/patient-booking.service";
import type {
  PatientAppointmentListItem,
  PatientAppointmentStatus,
  PatientAppointmentsListResult,
  PatientBookingAppointmentType,
  PatientBookingClinicItem,
  PatientBookingProfessionalItem,
  PatientBookingSlotItem,
} from "../../../types/patient";
import {
  formatDateToIsoDate,
  formatIsoDateToBr,
  formatIsoDateToLongPtBr,
} from "../../../utils/dateParsers";
import { getApiErrorMessage } from "../../../utils/getApiErrorMessage";
import { hasNoShowWindowElapsedForDate } from "../../../utils/timeParsers";
import { notifyError, notifySuccess } from "../../../utils/toast";
import type { AppointmentBadgeVariant } from "./styles";
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
  ModalActionRow,
  ModalActionSection,
  ModalCancelBtn,
  ModalGrid,
  ModalInfoBanner,
  ModalItem,
  ModalLabel,
  ModalNotice,
  ModalRescheduleBtn,
  ModalValue,
  ModalWarningBox,
  PageTitle,
  PageWrapper,
  ProfessionalBlock,
  ProfessionalName,
  RescheduleForm,
  SearchRow,
  SlotButton,
  SlotsGrid,
  SpecialtyText,
  StatusBadge,
  StatusMessage,
  TopRow,
  ViewButton,
} from "./styles";

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
  RESCHEDULED: { label: "Remarcado", variant: "rescheduled" },
  WAITING: { label: "Aguardando", variant: "waiting" },
  IN_PROGRESS: { label: "Em atendimento", variant: "progress" },
  COMPLETED: { label: "Compareceu", variant: "completed" },
  NO_SHOW: { label: "Não compareceu", variant: "cancelled" },
  CANCELLED: { label: "Cancelado", variant: "cancelled" },
};

const BOOKING_TYPE_OPTIONS: Array<{ value: PatientBookingAppointmentType; label: string }> = [
  { value: "CONSULTATION", label: "Consulta" },
  { value: "RETURN", label: "Retorno" },
  { value: "EXAM", label: "Exame" },
  { value: "EMERGENCY", label: "Urgência" },
];

const formatDateBr = (value: string): string => formatIsoDateToBr(value, "--/--/----");

const formatLongDate = (value: string): string => formatIsoDateToLongPtBr(value, "--");

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

const hasNoShowWindowElapsed = (appointmentDate: string, startTime: string): boolean => {
  return hasNoShowWindowElapsedForDate(appointmentDate, startTime);
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

const PatientAppointmentsPage = () => {
  const navigate = useNavigate();
  const todayIso = useMemo(() => formatDateToIsoDate(new Date()), []);
  const allClinicsCacheRef = useRef<PatientBookingClinicItem[] | null>(null);

  const [result, setResult] = useState<PatientAppointmentsListResult>(EMPTY_RESULT);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState<FilterKey>("ALL");
  const [selectedAppointment, setSelectedAppointment] = useState<PatientAppointmentListItem | null>(
    null,
  );

  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [bookingClinicQuery, setBookingClinicQuery] = useState("");
  const [bookingClinics, setBookingClinics] = useState<PatientBookingClinicItem[]>([]);
  const [bookingClinicsLoading, setBookingClinicsLoading] = useState(false);
  const [selectedClinic, setSelectedClinic] = useState<PatientBookingClinicItem | null>(null);
  const [bookingProfessionals, setBookingProfessionals] = useState<
    PatientBookingProfessionalItem[]
  >([]);
  const [bookingProfessionalsLoading, setBookingProfessionalsLoading] = useState(false);
  const [selectedProfessionalId, setSelectedProfessionalId] = useState("");
  const [bookingDate, setBookingDate] = useState(todayIso);
  const [bookingSlots, setBookingSlots] = useState<PatientBookingSlotItem[]>([]);
  const [bookingSlotsLoading, setBookingSlotsLoading] = useState(false);
  const [selectedSlotStartTime, setSelectedSlotStartTime] = useState("");
  const [bookingType, setBookingType] = useState<PatientBookingAppointmentType>("CONSULTATION");
  const [bookingNotes, setBookingNotes] = useState("");
  const [bookingSubmitting, setBookingSubmitting] = useState(false);

  // ─── Reschedule / Cancel modal state ────────────────────────────────────────
  const [apptModalMode, setApptModalMode] = useState<"view" | "reschedule" | "confirmCancel">(
    "view",
  );
  const [reschedDate, setReschedDate] = useState(todayIso);
  const [reschedSlots, setReschedSlots] = useState<PatientBookingSlotItem[]>([]);
  const [reschedSlotsLoading, setReschedSlotsLoading] = useState(false);
  const [reschedSelectedSlot, setReschedSelectedSlot] = useState("");
  const [reschedSubmitting, setReschedSubmitting] = useState(false);
  const [cancelSubmitting, setCancelSubmitting] = useState(false);

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

    const cachedClinics = allClinicsCacheRef.current;

    if (cachedClinics) {
      setBookingClinics(filterClinicsIgnoringAccents(cachedClinics, query));
      setBookingClinicsLoading(false);
      return;
    }

    let active = true;
    const loadAllClinics = async () => {
      setBookingClinicsLoading(true);
      try {
        const allClinics = await searchPatientBookingClinics("");
        if (!active) return;

        allClinicsCacheRef.current = allClinics;
        setBookingClinics(filterClinicsIgnoringAccents(allClinics, query));
      } catch (error: unknown) {
        if (!active) return;
        setBookingClinics([]);
        notifyError(getApiErrorMessage(error, "Nao foi possivel buscar clinicas."));
      } finally {
        if (active) setBookingClinicsLoading(false);
      }
    };

    const timer = window.setTimeout(() => {
      void loadAllClinics();
    }, 180);

    return () => {
      active = false;
      window.clearTimeout(timer);
    };
  }, [bookingClinicQuery, isBookingOpen]);

  const shouldShowClinicSuggestions = bookingClinicQuery.trim().length > 0;

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
          response.slots.some((slot) => slot.available && slot.startTime === current)
            ? current
            : "",
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

  // Carrega os slots ao entrar no modo de remarcacao
  useEffect(() => {
    if (apptModalMode !== "reschedule") {
      setReschedSlots([]);
      return;
    }

    const clinicId = selectedAppointment?.clinicId;
    const professionalId = selectedAppointment?.professionalId;

    if (!clinicId || !professionalId || !reschedDate) {
      setReschedSlots([]);
      return;
    }

    let active = true;

    const loadSlots = async () => {
      setReschedSlotsLoading(true);
      try {
        const response = await getPatientBookingSlots(clinicId, professionalId, reschedDate);
        if (!active) return;
        setReschedSlots(response.slots);
        setReschedSelectedSlot("");
      } catch {
        if (!active) return;
        setReschedSlots([]);
        notifyError("Nao foi possivel carregar os horarios.");
      } finally {
        if (active) setReschedSlotsLoading(false);
      }
    };

    void loadSlots();

    return () => {
      active = false;
    };
  }, [apptModalMode, reschedDate, selectedAppointment]);

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

  // ─── Detail modal handlers ───────────────────────────────────────────────────

  const handleCloseDetailModal = () => {
    setSelectedAppointment(null);
    setApptModalMode("view");
    setReschedDate(todayIso);
    setReschedSlots([]);
    setReschedSelectedSlot("");
  };

  const openRescheduleMode = () => {
    setReschedDate(todayIso);
    setReschedSelectedSlot("");
    setApptModalMode("reschedule");
  };

  const handleRescheduleSubmit = async () => {
    if (!selectedAppointment || !reschedSelectedSlot) return;
    const clinicId = selectedAppointment.clinicId;
    const professionalId = selectedAppointment.professionalId;
    if (!clinicId || !professionalId) return;

    setReschedSubmitting(true);
    try {
      await rescheduleAppointment(selectedAppointment.id, {
        appointmentDate: reschedDate,
        startTime: reschedSelectedSlot,
        clinicId,
        professionalId,
      });
      const refreshed = await listPatientAppointments(FILTER_TO_STATUS[activeFilter]);
      setResult(refreshed);
      notifySuccess("Agendamento remarcado com sucesso.");
      handleCloseDetailModal();
    } catch (err: unknown) {
      notifyError(getApiErrorMessage(err, "Nao foi possivel remarcar o agendamento."));
    } finally {
      setReschedSubmitting(false);
    }
  };

  const handleCancelSubmit = async () => {
    if (!selectedAppointment) return;
    setCancelSubmitting(true);
    try {
      await cancelAppointment(selectedAppointment.id);
      const refreshed = await listPatientAppointments(FILTER_TO_STATUS[activeFilter]);
      setResult(refreshed);
      notifySuccess("Agendamento cancelado.");
      handleCloseDetailModal();
    } catch (err: unknown) {
      notifyError(getApiErrorMessage(err, "Nao foi possivel cancelar o agendamento."));
    } finally {
      setCancelSubmitting(false);
    }
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
                  <AppointmentCard
                    key={appointment.id || `${appointment.appointmentDate}-${index}`}
                  >
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
                          <ViewButton
                            type="button"
                            onClick={() => {
                              setApptModalMode("view");
                              setSelectedAppointment(appointment);
                            }}
                          >
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
                    </AppointmentBody>
                  </AppointmentCard>
                );
              })}
            </AppointmentsList>
          )}
        </>
      )}

      {selectedAppointment &&
        (() => {
          const canEdit = new Set(["SCHEDULED", "CONFIRMED"]).has(
            normalizeAppointmentStatus(selectedAppointment.status),
          );
          const hasRescheduleIds = Boolean(
            selectedAppointment.clinicId && selectedAppointment.professionalId,
          );
          const modalTitle =
            apptModalMode === "reschedule"
              ? "Remarcar agendamento"
              : apptModalMode === "confirmCancel"
                ? "Cancelar agendamento"
                : "Detalhes do agendamento";

          return (
            <Modal
              isOpen={Boolean(selectedAppointment)}
              onClose={handleCloseDetailModal}
              title={modalTitle}
              actions={
                apptModalMode === "reschedule" ? (
                  <>
                    <Button variant="outline" size="small" onClick={() => setApptModalMode("view")}>
                      Voltar
                    </Button>
                    <Button
                      variant="primary"
                      size="small"
                      onClick={() => void handleRescheduleSubmit()}
                      disabled={!reschedSelectedSlot || reschedSubmitting}
                    >
                      {reschedSubmitting ? "Remarcando..." : "Confirmar Remarcacao"}
                    </Button>
                  </>
                ) : apptModalMode === "confirmCancel" ? (
                  <>
                    <Button variant="outline" size="small" onClick={() => setApptModalMode("view")}>
                      Voltar
                    </Button>
                    <ModalCancelBtn
                      type="button"
                      onClick={() => void handleCancelSubmit()}
                      disabled={cancelSubmitting}
                    >
                      {cancelSubmitting ? "Cancelando..." : "Confirmar Cancelamento"}
                    </ModalCancelBtn>
                  </>
                ) : (
                  <Button variant="outline" size="small" onClick={handleCloseDetailModal}>
                    Fechar
                  </Button>
                )
              }
            >
              {apptModalMode === "view" && (
                <>
                  <ModalGrid>
                    <ModalItem>
                      <ModalLabel>Profissional</ModalLabel>
                      <ModalValue>{selectedAppointment.professionalName}</ModalValue>
                    </ModalItem>
                    <ModalItem>
                      <ModalLabel>Status</ModalLabel>
                      <ModalValue>
                        {getStatusMeta(resolveDisplayStatus(selectedAppointment)).label}
                      </ModalValue>
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
                      <ModalValue>
                        {selectedAppointment.clinicName ?? "Clinica nao informada"}
                      </ModalValue>
                    </ModalItem>
                    <ModalItem>
                      <ModalLabel>Observacoes</ModalLabel>
                      <ModalValue>{selectedAppointment.notes ?? "Sem observacoes."}</ModalValue>
                    </ModalItem>
                  </ModalGrid>

                  {canEdit && (
                    <ModalActionSection>
                      <ModalNotice>
                        Voce pode apenas remarcar ou cancelar este agendamento.
                      </ModalNotice>
                      <ModalActionRow>
                        <ModalRescheduleBtn
                          type="button"
                          onClick={openRescheduleMode}
                          disabled={!hasRescheduleIds}
                          title={
                            !hasRescheduleIds
                              ? "Remarcacao indisponivel para este agendamento"
                              : undefined
                          }
                        >
                          <RotateCcw size={15} />
                          Remarcar
                        </ModalRescheduleBtn>
                        <ModalCancelBtn
                          type="button"
                          onClick={() => setApptModalMode("confirmCancel")}
                        >
                          Cancelar consulta
                        </ModalCancelBtn>
                      </ModalActionRow>
                    </ModalActionSection>
                  )}
                </>
              )}

              {apptModalMode === "reschedule" && (
                <RescheduleForm>
                  <ModalInfoBanner>
                    <strong>{selectedAppointment.professionalName}</strong>
                    <span>
                      Agendado para {formatLongDate(selectedAppointment.appointmentDate)} às{" "}
                      {selectedAppointment.startTime}
                    </span>
                  </ModalInfoBanner>

                  <BookingField>
                    <BookingLabel>Nova data</BookingLabel>
                    <BookingInput
                      type="date"
                      min={todayIso}
                      value={reschedDate}
                      onChange={(event) => {
                        setReschedDate(event.target.value);
                        setReschedSelectedSlot("");
                      }}
                    />
                  </BookingField>

                  <BookingField>
                    <BookingLabel>Novo horario</BookingLabel>
                    {reschedSlotsLoading ? (
                      <BookingEmpty>Carregando horarios...</BookingEmpty>
                    ) : reschedSlots.length ? (
                      <SlotsGrid>
                        {reschedSlots.map((slot) => (
                          <SlotButton
                            key={slot.startTime}
                            type="button"
                            $available={slot.available}
                            $selected={reschedSelectedSlot === slot.startTime && slot.available}
                            disabled={!slot.available}
                            onClick={() => slot.available && setReschedSelectedSlot(slot.startTime)}
                          >
                            {slot.startTime}
                          </SlotButton>
                        ))}
                      </SlotsGrid>
                    ) : (
                      <BookingEmpty>
                        Selecione a data para ver os horarios disponiveis.
                      </BookingEmpty>
                    )}
                  </BookingField>
                </RescheduleForm>
              )}

              {apptModalMode === "confirmCancel" && (
                <ModalWarningBox>
                  Tem certeza que deseja cancelar este agendamento?
                  <br />
                  <br />
                  <strong>{selectedAppointment.professionalName}</strong>
                  <br />
                  {formatLongDate(selectedAppointment.appointmentDate)} às{" "}
                  {selectedAppointment.startTime}
                  <br />
                  <br />
                  Esta acao nao pode ser desfeita.
                </ModalWarningBox>
              )}
            </Modal>
          );
        })()}

      {isBookingOpen && (
        <Modal
          isOpen={isBookingOpen}
          onClose={closeBookingModal}
          title="Novo Agendamento"
          actions={
            <>
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
            </>
          }
        >
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

            {shouldShowClinicSuggestions && (
              <ClinicResultsList>
                {bookingClinics.map((clinic) => (
                  <ClinicResultButton
                    key={clinic.id}
                    type="button"
                    $selected={selectedClinic?.id === clinic.id}
                    onClick={() => {
                      setSelectedClinic(clinic);
                      setBookingClinicQuery(clinic.tradeName);
                      setBookingClinics([]);
                      setBookingClinicsLoading(false);
                      setSelectedProfessionalId("");
                      setSelectedSlotStartTime("");
                    }}
                  >
                    <div className="clinic-info">
                      <ClinicResultTitle>{clinic.tradeName}</ClinicResultTitle>
                      <ClinicResultMeta>
                        {clinic.city}/{clinic.state}
                      </ClinicResultMeta>
                    </div>
                    <ChevronRight size={15} />
                  </ClinicResultButton>
                ))}
                {!bookingClinics.length && !bookingClinicsLoading && (
                  <BookingEmpty>Nenhuma clinica encontrada para este termo.</BookingEmpty>
                )}
                {!bookingClinics.length && bookingClinicsLoading && (
                  <BookingEmpty>Buscando clinicas...</BookingEmpty>
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
        </Modal>
      )}
    </PageWrapper>
  );
};

export default PatientAppointmentsPage;
