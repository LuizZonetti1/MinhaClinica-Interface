import { ChevronDown, Eye, Pencil, Search } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Button } from "../../../components/Button";
import { Input } from "../../../components/Input";
import { Modal } from "../../../components/Modal";
import { Skeleton } from "../../../components/Skeleton";
import {
  getPatientDetailsAdmin,
  getPatientSummary,
  listPatientsAdmin,
} from "../../../services/patient-admin.service";
import {
  listReceptionPatientAppointments,
  updateAppointmentStatus,
} from "../../../services/reception.service";
import type { AppointmentStatusUpdate } from "../../../types/dashboard";
import type {
  PatientAuditDetails,
  PatientListItem,
  PatientSummary,
  ReceptionAppointmentItem,
} from "../../../types/patient";
import {
  formatDateDayMonthYear,
  formatPhoneNumber,
  normalizePhoneDigits,
} from "../../../utils/formatters";
import { getApiErrorMessage } from "../../../utils/getApiErrorMessage";
import { notifyError, notifySuccess } from "../../../utils/toast";
import {
  AccordionBody,
  AccordionEmptyRow,
  AccordionLoadingRow,
  AppointmentEntry,
  ApptDate,
  ApptDay,
  ApptDivider,
  ApptDropdownItem,
  ApptDropdownMenu,
  ApptDropdownWrapper,
  ApptEditButton,
  ApptInfo,
  ApptMeta,
  ApptMonthYear,
  ApptProfessional,
  ApptStatusBadge,
  ChevronWrapper,
  DetailItem,
  DetailLabel,
  DetailSection,
  DetailSectionTitle,
  DetailsGrid,
  DetailValue,
  FiltersRow,
  PageTitle,
  PageWrapper,
  PatientAvatar,
  PatientCard,
  PatientEmail,
  PatientList,
  PatientMeta,
  PatientName,
  PatientRow,
  PatientStats,
  SearchField,
  StatLabel,
  StatPill,
  StatusMessage,
  StatValue,
  SummaryCard,
  SummaryGrid,
  SummaryLabel,
  SummaryValue,
  TopRow,
  ViewDetailsButton,
} from "./styles";

const AVATAR_COLORS = ["#2563EB", "#16A34A", "#9333EA", "#EA580C", "#4B5563"];
const SUMMARY_SKELETON_COLORS = ["#3B82F6", "#22C55E", "#94A3B8", "#9333EA"];

const APPT_STATUS_LABELS: Record<string, string> = {
  WAITING: "Aguardando",
  CHECKED_IN: "Check-in realizado",
  IN_PROGRESS: "Em atendimento",
  DONE: "Concluída",
  COMPLETED: "Concluída",
  CANCELLED: "Cancelada",
  NO_SHOW: "Não compareceu",
  SCHEDULED: "Agendada",
  CONFIRMED: "Confirmada",
  RESCHEDULED: "Reagendada",
};

const STATUS_UPDATE_OPTIONS: Array<{ value: AppointmentStatusUpdate; label: string }> = [
  { value: "SCHEDULED", label: "Agendada" },
  { value: "CONFIRMED", label: "Confirmada" },
  { value: "WAITING", label: "Check-in OK" },
  { value: "IN_PROGRESS", label: "Em Atendimento" },
  { value: "COMPLETED", label: "Concluída" },
  { value: "NO_SHOW", label: "Não compareceu" },
  { value: "CANCELLED", label: "Cancelada" },
];

const parseDate = (dateStr: string | null | undefined): Date | null => {
  if (!dateStr) return null;
  try {
    const isoDate = /^(\d{4})-(\d{2})-(\d{2})/.exec(dateStr);
    if (isoDate) {
      const d = new Date(Number(isoDate[1]), Number(isoDate[2]) - 1, Number(isoDate[3]));
      return Number.isNaN(d.getTime()) ? null : d;
    }
    const d = new Date(dateStr);
    return Number.isNaN(d.getTime()) ? null : d;
  } catch {
    return null;
  }
};

const formatMonthYear = (date: Date): string =>
  date.toLocaleDateString("pt-BR", { month: "short", year: "numeric" }).replace(".", "");

const formatDateBR = (dateStr: string | null | undefined): string => {
  const d = parseDate(dateStr);
  if (!d) return "—";
  return d.toLocaleDateString("pt-BR");
};

const sortAppointments = (items: ReceptionAppointmentItem[]): ReceptionAppointmentItem[] =>
  [...items].sort((a, b) => {
    const da = parseDate(a.date)?.getTime() ?? 0;
    const db = parseDate(b.date)?.getTime() ?? 0;
    return db - da;
  });

const apptStatusLabel = (status: string | null | undefined): string => {
  if (!status) return "—";
  return APPT_STATUS_LABELS[status.toUpperCase()] ?? status;
};

const toDash = (value: string | null | undefined): string => {
  if (!value) return "-";
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : "-";
};

const statusLabel = (status: string | null | undefined) => {
  if (!status) return "-";

  const map: Record<string, string> = {
    ACTIVE: "Ativo",
    INACTIVE: "Inativo",
    BLOCKED: "Bloqueado",
    PENDING_ACTIVATION: "Pendente",
    EMAIL_VERIFIED: "Email verificado",
  };

  return map[status] ?? status;
};

const genderLabel = (gender: string | null | undefined) => {
  if (!gender) return "-";

  const map: Record<string, string> = {
    MALE: "Masculino",
    FEMALE: "Feminino",
    OTHER: "Outro",
    PREFER_NOT_TO_SAY: "Prefere nao informar",
  };

  return map[gender] ?? gender;
};

// ─── Appointment Dropdown ────────────────────────────────────────────────────

type ApptDropdownProps = {
  appointmentId: string;
  currentRawStatus: string;
  onStatusChange: (id: string, status: AppointmentStatusUpdate) => void;
};

const ApptDropdown = ({ appointmentId, currentRawStatus, onStatusChange }: ApptDropdownProps) => {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handleOutside = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, [open]);

  return (
    <ApptDropdownWrapper ref={wrapperRef}>
      <ApptEditButton
        type="button"
        aria-label="Alterar status"
        title="Alterar status"
        onClick={() => setOpen((prev) => !prev)}
      >
        <Pencil size={13} />
      </ApptEditButton>

      {open && (
        <ApptDropdownMenu>
          {STATUS_UPDATE_OPTIONS.map((opt) => (
            <ApptDropdownItem
              key={opt.value}
              $active={opt.value === currentRawStatus}
              onClick={() => {
                setOpen(false);
                onStatusChange(appointmentId, opt.value);
              }}
            >
              {opt.label}
            </ApptDropdownItem>
          ))}
        </ApptDropdownMenu>
      )}
    </ApptDropdownWrapper>
  );
};

// ─── Appointment Item ─────────────────────────────────────────────────────────

type AppointmentItemProps = {
  appt: ReceptionAppointmentItem;
  onStatusChange: (id: string, status: AppointmentStatusUpdate) => void;
};

const AppointmentItem = ({ appt, onStatusChange }: AppointmentItemProps) => {
  const date = parseDate(appt.date);
  const day = date ? String(date.getDate()).padStart(2, "0") : "—";
  const monthYear = date ? formatMonthYear(date) : "";
  const timeLabel = appt.startTime
    ? appt.endTime
      ? `${appt.startTime} – ${appt.endTime}`
      : appt.startTime
    : null;
  const typeParts = [appt.professionalSpecialty, appt.appointmentType].filter(Boolean);
  const meta = [timeLabel, ...typeParts].filter(Boolean).join(" · ");
  const rawStatus = (appt.status ?? "").toUpperCase();

  return (
    <AppointmentEntry>
      <ApptDate>
        <ApptDay>{day}</ApptDay>
        <ApptMonthYear>{monthYear}</ApptMonthYear>
      </ApptDate>

      <ApptDivider />

      <ApptInfo>
        <ApptProfessional>{appt.professionalName || "—"}</ApptProfessional>
        {meta && <ApptMeta>{meta}</ApptMeta>}
      </ApptInfo>

      {rawStatus && (
        <ApptStatusBadge $status={rawStatus}>{apptStatusLabel(rawStatus)}</ApptStatusBadge>
      )}
      <ApptDropdown
        appointmentId={appt.id}
        currentRawStatus={rawStatus}
        onStatusChange={onStatusChange}
      />
    </AppointmentEntry>
  );
};

// ─── Patient Card Row ─────────────────────────────────────────────────────────

type PatientCardRowProps = {
  patient: PatientListItem;
  index: number;
  onView: (patient: PatientListItem) => void;
};

const PatientCardRow = ({ patient, index, onView }: PatientCardRowProps) => {
  const [expanded, setExpanded] = useState(false);
  const [appointments, setAppointments] = useState<ReceptionAppointmentItem[] | null>(null);
  const [loadingAppts, setLoadingAppts] = useState(false);
  const fetchedRef = useRef(false);

  const handleStatusChange = useCallback(
    async (apptId: string, newStatus: AppointmentStatusUpdate) => {
      setAppointments(
        (prev) => prev?.map((a) => (a.id === apptId ? { ...a, status: newStatus } : a)) ?? null,
      );
      try {
        await updateAppointmentStatus(apptId, newStatus);
        notifySuccess("Status atualizado.");
      } catch (err: unknown) {
        notifyError(getApiErrorMessage(err, "Erro ao atualizar status."));
      }
    },
    [],
  );

  const toggle = async () => {
    const next = !expanded;
    setExpanded(next);

    if (next && !fetchedRef.current) {
      fetchedRef.current = true;
      setLoadingAppts(true);
      try {
        const response = await listReceptionPatientAppointments(patient.id);
        setAppointments(sortAppointments(response.items));
      } catch {
        notifyError("Erro ao carregar histórico do paciente.");
        setAppointments([]);
      } finally {
        setLoadingAppts(false);
      }
    }
  };

  const bgColor = AVATAR_COLORS[index % AVATAR_COLORS.length];
  const initials = patient.name
    .split(" ")
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? "")
    .join("");
  const lastVisitLabel = formatDateBR(patient.lastVisit);

  return (
    <PatientCard $expanded={expanded}>
      <PatientRow onClick={() => void toggle()} type="button">
        <PatientAvatar $bgColor={bgColor}>
          {patient.avatarUrl ? <img src={patient.avatarUrl} alt={patient.name} /> : initials}
        </PatientAvatar>

        <PatientMeta>
          <PatientName>{patient.name}</PatientName>
          <PatientEmail>{patient.email}</PatientEmail>
        </PatientMeta>

        <PatientStats>
          <StatPill>
            <StatLabel>Última visita</StatLabel>
            <StatValue>{lastVisitLabel}</StatValue>
          </StatPill>
          <StatPill>
            <StatLabel>Consultas</StatLabel>
            <StatValue>{patient.totalAppointments}</StatValue>
          </StatPill>
          <StatPill>
            <StatLabel>Status</StatLabel>
            <StatValue>{statusLabel(patient.status)}</StatValue>
          </StatPill>
        </PatientStats>

        <ViewDetailsButton
          type="button"
          aria-label={`Ver dados completos de ${patient.name}`}
          onClick={(e) => {
            e.stopPropagation();
            onView(patient);
          }}
        >
          <Eye size={14} />
          Ver dados
        </ViewDetailsButton>

        <ChevronWrapper $open={expanded}>
          <ChevronDown size={18} />
        </ChevronWrapper>
      </PatientRow>

      {expanded && (
        <AccordionBody>
          {loadingAppts && <AccordionLoadingRow>Carregando histórico...</AccordionLoadingRow>}
          {!loadingAppts && appointments !== null && appointments.length === 0 && (
            <AccordionEmptyRow>Nenhuma consulta encontrada.</AccordionEmptyRow>
          )}
          {!loadingAppts &&
            appointments !== null &&
            appointments.map((appt) => (
              <AppointmentItem key={appt.id} appt={appt} onStatusChange={handleStatusChange} />
            ))}
        </AccordionBody>
      )}
    </PatientCard>
  );
};

const PatientsPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [patients, setPatients] = useState<PatientListItem[]>([]);
  const [summary, setSummary] = useState<PatientSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isViewOpen, setIsViewOpen] = useState(false);
  const [viewPatient, setViewPatient] = useState<PatientListItem | null>(null);
  const [details, setDetails] = useState<PatientAuditDetails | null>(null);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [detailsError, setDetailsError] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);

    try {
      const [patientListResponse, patientSummary] = await Promise.all([
        listPatientsAdmin(),
        getPatientSummary(),
      ]);
      setPatients(patientListResponse.items);
      setSummary(patientSummary);
    } catch {
      const message = "Erro ao carregar pacientes. Tente novamente.";
      setError(message);
      notifyError(message);
    } finally {
      setLoading(false);
    }
  };

  // biome-ignore lint/correctness/useExhaustiveDependencies: run once on mount
  useEffect(() => {
    void fetchData();
  }, []);

  const filteredPatients = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    const phoneQuery = normalizePhoneDigits(q);
    if (q.length === 0) return patients;

    return patients.filter(
      (patient) =>
        patient.name.toLowerCase().includes(q) ||
        patient.email.toLowerCase().includes(q) ||
        (phoneQuery.length > 0 && normalizePhoneDigits(patient.phone).includes(phoneQuery)),
    );
  }, [patients, searchTerm]);

  const openView = async (patient: PatientListItem) => {
    setViewPatient(patient);
    setIsViewOpen(true);
    setDetails(null);
    setDetailsError(null);
    setDetailsLoading(true);

    try {
      const response = await getPatientDetailsAdmin(patient.id);
      setDetails(response);
    } catch {
      const message = "Erro ao carregar os dados completos do paciente.";
      setDetailsError(message);
      notifyError(message);
    } finally {
      setDetailsLoading(false);
    }
  };

  const closeView = () => {
    setIsViewOpen(false);
    setViewPatient(null);
    setDetails(null);
    setDetailsLoading(false);
    setDetailsError(null);
  };

  const selectedPatient = details?.patient;

  return (
    <PageWrapper>
      <TopRow>
        <PageTitle>Pacientes</PageTitle>
      </TopRow>

      {loading && !error && (
        <SummaryGrid>
          {SUMMARY_SKELETON_COLORS.map((color) => (
            <SummaryCard key={`summary-skeleton-${color}`} $borderColor={color}>
              <Skeleton width="55%" height={12} />
              <Skeleton width="42%" height={30} />
            </SummaryCard>
          ))}
        </SummaryGrid>
      )}

      {!loading && summary && (
        <SummaryGrid>
          <SummaryCard $borderColor="#3B82F6">
            <SummaryLabel>Total Cadastrado</SummaryLabel>
            <SummaryValue>{summary.total}</SummaryValue>
          </SummaryCard>
          <SummaryCard $borderColor="#22C55E">
            <SummaryLabel>Pacientes Ativos</SummaryLabel>
            <SummaryValue>{summary.active}</SummaryValue>
          </SummaryCard>
          <SummaryCard $borderColor="#94A3B8">
            <SummaryLabel>Pacientes Inativos</SummaryLabel>
            <SummaryValue>{summary.inactive}</SummaryValue>
          </SummaryCard>
          <SummaryCard $borderColor="#9333EA">
            <SummaryLabel>Novos este Mes</SummaryLabel>
            <SummaryValue>+{summary.newThisMonth}</SummaryValue>
          </SummaryCard>
        </SummaryGrid>
      )}

      <FiltersRow>
        <SearchField>
          <Input
            fullWidth
            placeholder="Buscar por nome, email ou telefone..."
            icon={<Search size={18} />}
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
          />
        </SearchField>
      </FiltersRow>

      {loading && !error && (
        <PatientList>
          {Array.from({ length: 6 }).map((_, i) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: lista de skeleton estática
            <PatientCard key={i}>
              <PatientRow as="div" style={{ cursor: "default" }}>
                <Skeleton variant="circle" width={40} height={40} />
                <PatientMeta>
                  <Skeleton width={160} height={14} />
                  <Skeleton width={220} height={12} style={{ marginTop: 4 }} />
                </PatientMeta>
              </PatientRow>
            </PatientCard>
          ))}
        </PatientList>
      )}

      {error && <StatusMessage $variant="error">{error}</StatusMessage>}

      {!loading && !error && (
        <PatientList>
          {filteredPatients.length === 0 && (
            <StatusMessage $variant={undefined}>Nenhum paciente encontrado.</StatusMessage>
          )}
          {filteredPatients.map((patient, index) => (
            <PatientCardRow
              key={patient.id}
              patient={patient}
              index={index}
              onView={(p) => void openView(p)}
            />
          ))}
        </PatientList>
      )}

      {isViewOpen && viewPatient && (
        <Modal
          isOpen={isViewOpen}
          onClose={closeView}
          title={selectedPatient?.name ?? viewPatient.name}
          actions={
            <Button size="small" variant="outline" onClick={closeView}>
              Fechar
            </Button>
          }
        >
          {detailsLoading && (
            <>
              <DetailSection>
                <DetailSectionTitle>Carregando dados do paciente</DetailSectionTitle>
                <DetailsGrid>
                  {Array.from({ length: 8 }, (_, i) => (
                    // biome-ignore lint/suspicious/noArrayIndexKey: lista de skeleton estática
                    <DetailItem key={`detail-loading-${i}`}>
                      <Skeleton width="50%" height={10} />
                      <Skeleton width="80%" height={14} />
                    </DetailItem>
                  ))}
                </DetailsGrid>
              </DetailSection>

              <DetailSection>
                <DetailSectionTitle>Carregando laudos</DetailSectionTitle>
                <Skeleton width="100%" height={110} />
                <Skeleton width="100%" height={110} />
              </DetailSection>
            </>
          )}

          {!detailsLoading && detailsError && (
            <StatusMessage $variant="error">{detailsError}</StatusMessage>
          )}

          {!detailsLoading && !detailsError && selectedPatient && (
            <>
              <DetailSection>
                <DetailSectionTitle>Dados pessoais</DetailSectionTitle>
                <DetailsGrid>
                  <DetailItem>
                    <DetailLabel>Nome</DetailLabel>
                    <DetailValue>{selectedPatient.name}</DetailValue>
                  </DetailItem>
                  <DetailItem>
                    <DetailLabel>Email</DetailLabel>
                    <DetailValue>{selectedPatient.email}</DetailValue>
                  </DetailItem>
                  <DetailItem>
                    <DetailLabel>Telefone principal</DetailLabel>
                    <DetailValue>{formatPhoneNumber(selectedPatient.phone)}</DetailValue>
                  </DetailItem>
                  <DetailItem>
                    <DetailLabel>Telefone alternativo</DetailLabel>
                    <DetailValue>{formatPhoneNumber(selectedPatient.alternativePhone)}</DetailValue>
                  </DetailItem>
                  <DetailItem>
                    <DetailLabel>CPF</DetailLabel>
                    <DetailValue>{toDash(selectedPatient.cpf)}</DetailValue>
                  </DetailItem>
                  <DetailItem>
                    <DetailLabel>RG</DetailLabel>
                    <DetailValue>{toDash(selectedPatient.rg)}</DetailValue>
                  </DetailItem>
                  <DetailItem>
                    <DetailLabel>Data de nascimento</DetailLabel>
                    <DetailValue>{formatDateDayMonthYear(selectedPatient.dateOfBirth)}</DetailValue>
                  </DetailItem>
                  <DetailItem>
                    <DetailLabel>Genero</DetailLabel>
                    <DetailValue>{genderLabel(selectedPatient.gender)}</DetailValue>
                  </DetailItem>
                  <DetailItem>
                    <DetailLabel>Status do usuario</DetailLabel>
                    <DetailValue>{statusLabel(selectedPatient.status)}</DetailValue>
                  </DetailItem>
                  <DetailItem>
                    <DetailLabel>Perfil ativo</DetailLabel>
                    <DetailValue>{selectedPatient.isActive ? "Sim" : "Nao"}</DetailValue>
                  </DetailItem>
                  <DetailItem>
                    <DetailLabel>Total de consultas</DetailLabel>
                    <DetailValue>{selectedPatient.totalAppointments}</DetailValue>
                  </DetailItem>
                  <DetailItem>
                    <DetailLabel>Consultas concluidas</DetailLabel>
                    <DetailValue>{selectedPatient.completedAppointments}</DetailValue>
                  </DetailItem>
                  <DetailItem>
                    <DetailLabel>Faltas registradas</DetailLabel>
                    <DetailValue>{selectedPatient.noShowCount}</DetailValue>
                  </DetailItem>
                  <DetailItem>
                    <DetailLabel>Ultima visita</DetailLabel>
                    <DetailValue>{formatDateDayMonthYear(selectedPatient.lastVisit)}</DetailValue>
                  </DetailItem>
                  <DetailItem>
                    <DetailLabel>Criado em</DetailLabel>
                    <DetailValue>{formatDateDayMonthYear(selectedPatient.createdAt)}</DetailValue>
                  </DetailItem>
                  <DetailItem>
                    <DetailLabel>Atualizado em</DetailLabel>
                    <DetailValue>{formatDateDayMonthYear(selectedPatient.updatedAt)}</DetailValue>
                  </DetailItem>
                </DetailsGrid>
              </DetailSection>

              <DetailSection>
                <DetailSectionTitle>Endereco</DetailSectionTitle>
                <DetailsGrid>
                  <DetailItem>
                    <DetailLabel>CEP</DetailLabel>
                    <DetailValue>{toDash(selectedPatient.address.zipCode)}</DetailValue>
                  </DetailItem>
                  <DetailItem>
                    <DetailLabel>Rua</DetailLabel>
                    <DetailValue>{toDash(selectedPatient.address.street)}</DetailValue>
                  </DetailItem>
                  <DetailItem>
                    <DetailLabel>Numero</DetailLabel>
                    <DetailValue>{toDash(selectedPatient.address.number)}</DetailValue>
                  </DetailItem>
                  <DetailItem>
                    <DetailLabel>Complemento</DetailLabel>
                    <DetailValue>{toDash(selectedPatient.address.complement)}</DetailValue>
                  </DetailItem>
                  <DetailItem>
                    <DetailLabel>Bairro</DetailLabel>
                    <DetailValue>{toDash(selectedPatient.address.neighborhood)}</DetailValue>
                  </DetailItem>
                  <DetailItem>
                    <DetailLabel>Cidade</DetailLabel>
                    <DetailValue>{toDash(selectedPatient.address.city)}</DetailValue>
                  </DetailItem>
                  <DetailItem>
                    <DetailLabel>Estado</DetailLabel>
                    <DetailValue>{toDash(selectedPatient.address.state)}</DetailValue>
                  </DetailItem>
                </DetailsGrid>
              </DetailSection>

              <DetailSection>
                <DetailSectionTitle>Dados clinicos</DetailSectionTitle>
                <DetailsGrid>
                  <DetailItem>
                    <DetailLabel>Tipo sanguineo</DetailLabel>
                    <DetailValue>{toDash(selectedPatient.medical.bloodType)}</DetailValue>
                  </DetailItem>
                  <DetailItem>
                    <DetailLabel>Alergias</DetailLabel>
                    <DetailValue>{toDash(selectedPatient.medical.allergies)}</DetailValue>
                  </DetailItem>
                  <DetailItem>
                    <DetailLabel>Medicamentos em uso</DetailLabel>
                    <DetailValue>{toDash(selectedPatient.medical.medications)}</DetailValue>
                  </DetailItem>
                  <DetailItem>
                    <DetailLabel>Condicoes pre-existentes</DetailLabel>
                    <DetailValue>{toDash(selectedPatient.medical.conditions)}</DetailValue>
                  </DetailItem>
                  <DetailItem>
                    <DetailLabel>Observacoes gerais</DetailLabel>
                    <DetailValue>{toDash(selectedPatient.medical.observations)}</DetailValue>
                  </DetailItem>
                  <DetailItem>
                    <DetailLabel>Contato de emergencia</DetailLabel>
                    <DetailValue>
                      {toDash(selectedPatient.medical.emergencyContactName)}
                    </DetailValue>
                  </DetailItem>
                  <DetailItem>
                    <DetailLabel>Telefone de emergencia</DetailLabel>
                    <DetailValue>
                      {formatPhoneNumber(selectedPatient.medical.emergencyContactPhone)}
                    </DetailValue>
                  </DetailItem>
                </DetailsGrid>
              </DetailSection>
            </>
          )}
        </Modal>
      )}
    </PageWrapper>
  );
};

export default PatientsPage;
