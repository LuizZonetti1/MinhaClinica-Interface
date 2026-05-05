import { CalendarDays, CheckCircle, MessageSquare, User, Users } from "lucide-react";
import { useEffect, useState } from "react";
import QuickActions from "../../../components/QuickActions";
import { StatCard } from "../../../components/StatCard";
import { useAuth } from "../../../contexts";
import { getProfessionalDashboard } from "../../../services/professional.service";
import { theme } from "../../../themes/themes";
import type {
  AgendaSlotStatus,
  ProfessionalDashboardData,
  ProfessionalDashboardSummary,
} from "../../../types/dashboard";
import { notifyError } from "../../../utils/toast";
import { getFormattedDate, getGreeting } from "../../../utils/formatters";
import { APPOINTMENT_TYPE_LABELS } from "../../../utils/statusLabels";
import {
  AppointmentTypeLabel,
  EmptyStateCell,
  HeroBanner,
  HeroSubtitle,
  HeroTitle,
  PageWrapper,
  SectionTitle,
  StatsGrid,
  StatusBadge,
  TableCard,
  TableCell,
  TableElement,
  TableHeaderCell,
  TableHeaderRow,
  TableRow,
  TimeLabel,
} from "./styles";


// ─── Static config ────────────────────────────────────────────────────────────

const buildStats = (s: ProfessionalDashboardSummary) => [
  {
    icon: <CalendarDays size={22} color="#2563EB" />,
    iconBg: theme.colors.featureBg.blue,
    label: "Consultas Hoje",
    value: String(s.consultasHoje),
  },
  {
    icon: <CheckCircle size={22} color="#16A34A" />,
    iconBg: theme.colors.featureBg.green,
    label: "Confirmadas",
    value: String(s.confirmadas),
  },
  {
    icon: <Users size={22} color="#9333EA" />,
    iconBg: theme.colors.featureBg.purple,
    label: "Pacientes do Mês",
    value: String(s.pacientesDoMes),
  },
];

const QUICK_ACCESS = [
  {
    icon: <CalendarDays size={20} />,
    label: "Ver Agenda Completa",
    color: "#2563EB",
    path: "/profissional/agenda",
  },
  {
    icon: <MessageSquare size={20} />,
    label: "Comentários de Pacientes",
    color: "#16A34A",
    path: "/profissional/comentarios",
  },
  {
    icon: <User size={20} />,
    label: "Meu Perfil",
    color: "#9333EA",
    path: "/profissional/perfil",
  },
];

type BadgeVariant =
  | "confirmed"
  | "scheduled"
  | "waiting"
  | "progress"
  | "completed"
  | "noshow"
  | "cancelled";

const STATUS_CONFIG: Record<AgendaSlotStatus, { label: string; variant: BadgeVariant }> = {
  CONFIRMED: { label: "Confirmado", variant: "confirmed" },
  SCHEDULED: { label: "Pendente", variant: "scheduled" },
  WAITING: { label: "Aguardando", variant: "waiting" },
  IN_PROGRESS: { label: "Em Atendimento", variant: "progress" },
  COMPLETED_WITH_ADDENDUM: { label: "Concluido com adendo", variant: "completed" },
  COMPLETED: { label: "Concluído", variant: "completed" },
  NO_SHOW: { label: "Não Compareceu", variant: "noshow" },
  CANCELLED: { label: "Cancelado", variant: "cancelled" },
  RESCHEDULED: { label: "Remarcado", variant: "scheduled" },
};

const EMPTY_SUMMARY: ProfessionalDashboardSummary = {
  consultasHoje: 0,
  confirmadas: 0,
  pacientesDoMes: 0,
};

// ─── Component ────────────────────────────────────────────────────────────────

const ProfessionalDashboard = () => {
  const { user } = useAuth();
  const [dashData, setDashData] = useState<ProfessionalDashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const load = async (silent = false) => {
      try {
        const data = await getProfessionalDashboard();
        if (isMounted) setDashData(data);
      } catch {
        if (!silent && isMounted) notifyError("Erro ao carregar dados do painel.");
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

  const displayName = user?.name.split(" ").slice(0, 2).join(" ") ?? "Profissional";
  const greeting = getGreeting();
  const today = getFormattedDate();
  const stats = buildStats(dashData?.summary ?? EMPTY_SUMMARY);

  return (
    <PageWrapper>
      {/* Hero Banner */}
      <HeroBanner>
        <HeroTitle>
          {greeting}, {displayName}! 👋
        </HeroTitle>
        <HeroSubtitle>
          {dashData
            ? `Você tem ${dashData.summary.consultasHoje} consultas agendadas para hoje — ${today}`
            : `Carregando suas consultas de hoje — ${today}`}
        </HeroSubtitle>
      </HeroBanner>

      {/* Stats */}
      <StatsGrid>
        {stats.map((s) => (
          <StatCard key={s.label} {...s} />
        ))}
      </StatsGrid>

      {/* Agenda de Hoje */}
      <div>
        <SectionTitle>Agenda de Hoje</SectionTitle>
        <TableCard>
          <TableElement>
            <thead>
              <TableHeaderRow>
                <TableHeaderCell>Horário</TableHeaderCell>
                <TableHeaderCell>Paciente</TableHeaderCell>
                <TableHeaderCell>Tipo</TableHeaderCell>
                <TableHeaderCell>Status</TableHeaderCell>
              </TableHeaderRow>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <EmptyStateCell colSpan={4}>Carregando...</EmptyStateCell>
                </tr>
              ) : !dashData || dashData.appointments.length === 0 ? (
                <tr>
                  <EmptyStateCell colSpan={4}>Nenhuma consulta agendada para hoje.</EmptyStateCell>
                </tr>
              ) : (
                dashData.appointments.map((appt) => {
                  const cfg = STATUS_CONFIG[appt.status];
                  return (
                    <TableRow key={appt.id}>
                      <TableCell>
                        <TimeLabel>{appt.time}</TimeLabel>
                      </TableCell>
                      <TableCell>{appt.patientName}</TableCell>
                      <TableCell>
                        <AppointmentTypeLabel>
                          {APPOINTMENT_TYPE_LABELS[appt.appointmentType ?? ""] ?? appt.appointmentType ?? "—"}
                        </AppointmentTypeLabel>
                      </TableCell>
                      <TableCell>
                        <StatusBadge $variant={cfg.variant}>{cfg.label}</StatusBadge>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </tbody>
          </TableElement>
        </TableCard>
      </div>

      {/* Acesso Rápido */}
      <QuickActions actions={QUICK_ACCESS} />
    </PageWrapper>
  );
};

export default ProfessionalDashboard;
