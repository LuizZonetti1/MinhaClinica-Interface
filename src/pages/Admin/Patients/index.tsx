import { ChevronDown, FileText, Pencil, Search } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router";
import { Input } from "../../../components/Input";
import { Skeleton } from "../../../components/Skeleton";
import {
  getPatientSummary,
  listPatientsAdmin,
} from "../../../services/patient-admin.service";
import {
  listReceptionPatientAppointments,
  updateAppointmentStatus,
} from "../../../services/reception.service";
import type { AppointmentStatusUpdate } from "../../../types/dashboard";
import type {
  PatientListItem,
  PatientSummary,
  ReceptionAppointmentItem,
} from "../../../types/patient";
import {
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
  ApptDocsButton,
  ApptDropdownWrapper,
  ApptEditButton,
  ApptInfo,
  ApptMeta,
  ApptMonthYear,
  ApptProfessional,
  ApptStatusBadge,
  ChevronWrapper,
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
} from "./styles";

const AVATAR_COLORS = ["#2563EB", "#16A34A", "#9333EA", "#EA580C", "#4B5563"];
const SUMMARY_SKELETON_COLORS = ["#3B82F6", "#22C55E", "#94A3B8", "#9333EA"];

const APPT_STATUS_LABELS: Record<string, string> = {
  WAITING: "Aguardando",
  CHECKED_IN: "Check-in realizado",
  IN_PROGRESS: "Em atendimento",
  DONE: "Conclída",
  COMPLETED: "Concluída",
  COMPLETED_WITH_ADDENDUM: "Concluída c/ adendo",
  CANCELLED: "Cancelada",
  NO_SHOW: "Não compareceu",
  SCHEDULED: "Agendada",
  CONFIRMED: "Confirmada",
  RESCHEDULED: "Reagendada",
};

const APPT_TYPE_LABELS: Record<string, string> = {
  CONSULTATION: "Consulta",
  FIRST_CONSULTATION: "Primeira consulta",
  RETURN: "Retorno",
  ROUTINE: "Rotina",
  EXAM: "Exame",
  EMERGENCY: "Urgência",
};

const apptTypeLabel = (type: string | null | undefined): string | null => {
  if (!type) return null;
  return APPT_TYPE_LABELS[type.trim().toUpperCase()] ?? type;
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
  const navigate = useNavigate();
  const date = parseDate(appt.date);
  const day = date ? String(date.getDate()).padStart(2, "0") : "—";
  const monthYear = date ? formatMonthYear(date) : "";
  const timeLabel = appt.startTime
    ? appt.endTime
      ? `${appt.startTime} – ${appt.endTime}`
      : appt.startTime
    : null;
  const typeParts = [appt.professionalSpecialty, apptTypeLabel(appt.appointmentType)].filter(Boolean);
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
      {(rawStatus === "COMPLETED" || rawStatus === "DONE" || rawStatus === "COMPLETED_WITH_ADDENDUM") && appt.id && (
        <ApptDocsButton
          type="button"
          title="Ver documentos"
          onClick={() =>
            navigate(
              `/admin/documentos?consulta=${appt.id}&paciente=${encodeURIComponent(appt.professionalName || "")}`,
            )
          }
        >
          <FileText size={12} />
          Documentos
        </ApptDocsButton>
      )}
    </AppointmentEntry>
  );
};

// ─── Patient Card Row ─────────────────────────────────────────────────────────

type PatientCardRowProps = {
  patient: PatientListItem;
  index: number;
};

const PatientCardRow = ({ patient, index }: PatientCardRowProps) => {
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
        </PatientStats>

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
            />
          ))}
        </PatientList>
      )}
    </PageWrapper>
  );
};

export default PatientsPage;
