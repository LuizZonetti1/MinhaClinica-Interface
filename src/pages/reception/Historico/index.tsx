import { ChevronDown, FileText, Pencil, Search } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router";
import { Input } from "../../../components/Input";
import { Skeleton } from "../../../components/Skeleton";
import {
  listReceptionPatientAppointments,
  listReceptionPatients,
  updateAppointmentStatus,
} from "../../../services/reception.service";
import type { AppointmentStatusUpdate } from "../../../types/dashboard";
import type { ReceptionAppointmentItem, ReceptionPatientListItem } from "../../../types/patient";
import { getApiErrorMessage } from "../../../utils/getApiErrorMessage";
import { getInitials } from "../../../utils/formatters";
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
  TopRow,
} from "./styles";

const AVATAR_COLORS = ["#2563EB", "#16A34A", "#9333EA", "#EA580C", "#4B5563"];

const STATUS_UPDATE_OPTIONS: Array<{ value: AppointmentStatusUpdate; label: string }> = [
  { value: "SCHEDULED", label: "Agendada" },
  { value: "CONFIRMED", label: "Confirmada" },
  { value: "WAITING", label: "Check-in OK" },
  { value: "IN_PROGRESS", label: "Em Atendimento" },
  { value: "COMPLETED", label: "Concluída" },
  { value: "NO_SHOW", label: "Não compareceu" },
  { value: "CANCELLED", label: "Cancelada" },
];

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

const statusLabel = (status: string | null | undefined): string => {
  if (!status) return "—";
  return APPT_STATUS_LABELS[status.toUpperCase()] ?? status;
};

const parseDate = (dateStr: string | null | undefined): Date | null => {
  if (!dateStr) return null;
  try {
    // Strings no formato "YYYY-MM-DD" são UTC por padrão no construtor Date,
    // causando shift de fuso. Parseamos manualmente como data local.
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

// ─── Appointment Status Dropdown ─────────────────────────────────────────────

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
      ? `${appt.startTime} \u2013 ${appt.endTime}`
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

      {rawStatus && <ApptStatusBadge $status={rawStatus}>{statusLabel(rawStatus)}</ApptStatusBadge>}
      <ApptDropdown
        appointmentId={appt.id}
        currentRawStatus={rawStatus}
        onStatusChange={onStatusChange}
      />
      {(rawStatus === "COMPLETED" || rawStatus === "DONE") && appt.id && (
        <ApptDocsButton
          type="button"
          onClick={() =>
            navigate(
              `/recepcao/documentos?consulta=${appt.id}&paciente=${encodeURIComponent(appt.professionalName || "")}`,
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

type PatientCardRowProps = { patient: ReceptionPatientListItem; index: number };

const PatientCardRow = ({ patient, index }: PatientCardRowProps) => {
  const [expanded, setExpanded] = useState(false);
  const [appointments, setAppointments] = useState<ReceptionAppointmentItem[] | null>(null);
  const [loading, setLoading] = useState(false);
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
      setLoading(true);
      try {
        const response = await listReceptionPatientAppointments(patient.id);
        setAppointments(sortAppointments(response.items));
      } catch {
        notifyError("Erro ao carregar histórico do paciente.");
        setAppointments([]);
      } finally {
        setLoading(false);
      }
    }
  };

  const bgColor = AVATAR_COLORS[index % AVATAR_COLORS.length];
  const initials = getInitials(patient.name);
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
          {loading && <AccordionLoadingRow>Carregando histórico...</AccordionLoadingRow>}
          {!loading && appointments !== null && appointments.length === 0 && (
            <AccordionEmptyRow>Nenhuma consulta encontrada.</AccordionEmptyRow>
          )}
          {!loading &&
            appointments !== null &&
            appointments.map((appt) => (
              <AppointmentItem key={appt.id} appt={appt} onStatusChange={handleStatusChange} />
            ))}
        </AccordionBody>
      )}
    </PatientCard>
  );
};

const ReceptionHistoricoPage = () => {
  const [patients, setPatients] = useState<ReceptionPatientListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await listReceptionPatients();
        setPatients(response.items);
      } catch {
        const message = "Erro ao carregar pacientes.";
        setError(message);
        notifyError(message);
      } finally {
        setLoading(false);
      }
    };

    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filteredPatients = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    if (!q) return patients;
    return patients.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.email.toLowerCase().includes(q) ||
        (p.cpf ?? "").replace(/\D/g, "").includes(q.replace(/\D/g, "")),
    );
  }, [patients, searchTerm]);

  return (
    <PageWrapper>
      <TopRow>
        <PageTitle>Histórico de Pacientes</PageTitle>
      </TopRow>

      <FiltersRow>
        <SearchField>
          <Input
            fullWidth
            placeholder="Buscar por nome, e-mail ou CPF..."
            icon={<Search size={18} />}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
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
            <StatusMessage $variant="info">Nenhum paciente encontrado.</StatusMessage>
          )}
          {filteredPatients.map((patient, index) => (
            <PatientCardRow key={patient.id} patient={patient} index={index} />
          ))}
        </PatientList>
      )}
    </PageWrapper>
  );
};

export default ReceptionHistoricoPage;
