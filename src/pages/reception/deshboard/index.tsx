
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { QuickAccessCard } from "../../../components/QuickAccessCard";
import { StatCard } from "../../../components/StatCard";
import { useAuth } from "../../../contexts";
import { getReceptionDashboard } from "../../../services/reception.service";
import { theme } from "../../../themes/themes";
import type {
  AppointmentStatus,
  ReceptionDashboardData,
  ReceptionDashboardSummary,
} from "../../../types/dashboard";
import { notifyError } from "../../../utils/toast";
import {
  DoctorLabel,
  EmptyStateCell,
  HeroBanner,
  HeroSubtitle,
  HeroTitle,
  PageWrapper,
  QuickAccessGrid,
  QuickAccessSection,
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

// ─── Helpers ──────────────────────────────────────────────────────────────────

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return "Bom dia";
  if (hour < 18) return "Boa tarde";
  return "Boa noite";
};

const getFormattedDate = () =>
  new Date().toLocaleDateString("pt-BR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

// ─── Static config ────────────────────────────────────────────────────────────

const buildStats = (summary: ReceptionDashboardSummary) => [
  {
    icon: "/icons/reception-stat-today.svg",
    iconBg: theme.colors.featureBg.blue,
    label: "Consultas Hoje",
    value: String(summary.consultationsToday),
  },
  {
    icon: "/icons/reception-stat-checkin-pending.svg",
    iconBg: theme.colors.featureBg.orange,
    label: "Aguardando Check-in",
    value: String(summary.awaitingCheckin),
  },
  {
    icon: "/icons/reception-stat-checkin-done.svg",
    iconBg: theme.colors.featureBg.green,
    label: "Check-ins Realizados",
    value: String(summary.checkinsDone),
  },
  {
    icon: "/icons/reception-stat-confirmations.svg",
    iconBg: "#FEF9C3",
    label: "Confirmações Pendentes",
    value: String(summary.pendingConfirmations),
  },
];

const QUICK_ACCESS = [
  {
    icon: "/icons/quick-schedule.svg",
    label: "Marcar Consulta",
    color: "#2563EB",
    path: "/recepcao/marcar-consulta",
  },
  {
    icon: "/icons/quick-patients.svg",
    label: "Cadastrar Paciente",
    color: "#16A34A",
    path: "/recepcao/cadastrar-paciente",
  },
  {
    icon: "/icons/quick-agendas.svg",
    label: "Ver Agendas",
    color: "#9333EA",
    path: "/recepcao/agendas",
  },
  {
    icon: "/icons/quick-checkin.svg",
    label: "Check-in",
    color: "#EA580C",
    path: "/recepcao/checkin",
  },
];

const STATUS_CONFIG: Record<
  AppointmentStatus,
  { label: string; variant: "waiting" | "checkin" | "progress" | "done" | "cancelled" }
> = {
  WAITING:    { label: "Aguardando",     variant: "waiting"   },
  CHECKED_IN: { label: "Check-in OK",   variant: "checkin"   },
  IN_PROGRESS:{ label: "Em Atendimento",variant: "progress"  },
  DONE:       { label: "Concluído",      variant: "done"      },
  CANCELLED:  { label: "Cancelado",      variant: "cancelled" },
};

const EMPTY_SUMMARY: ReceptionDashboardSummary = {
  consultationsToday: 0,
  awaitingCheckin: 0,
  checkinsDone: 0,
  pendingConfirmations: 0,
};

// ─── Component ────────────────────────────────────────────────────────────────

const ReceptionDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [dashData, setDashData] = useState<ReceptionDashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getReceptionDashboard()
      .then(setDashData)
      .catch(() => notifyError("Erro ao carregar dados do painel."))
      .finally(() => setLoading(false));
  }, []);

  const firstName = user?.name.split(" ").slice(0, 2).join(" ") ?? "Recepcionista";
  const greeting = getGreeting();
  const today = getFormattedDate();
  const stats = buildStats(dashData?.summary ?? EMPTY_SUMMARY);

  return (
    <PageWrapper>
      {/* Hero Banner */}
      <HeroBanner>
        <HeroTitle>
          {greeting}, {firstName}! 👋
        </HeroTitle>
        <HeroSubtitle>
          Painel da recepção — {today}.
          {dashData &&
            ` Hoje há ${dashData.summary.consultationsToday} consultas agendadas.`}
        </HeroSubtitle>
      </HeroBanner>

      {/* Stats */}
      <StatsGrid>
        {stats.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </StatsGrid>

      {/* Ações Rápidas */}
      <QuickAccessSection>
        <SectionTitle>Ações Rápidas</SectionTitle>
        <QuickAccessGrid>
          {QUICK_ACCESS.map((card) => (
            <QuickAccessCard
              key={card.label}
              icon={card.icon}
              label={card.label}
              color={card.color}
              onClick={() => navigate(card.path)}
            />
          ))}
        </QuickAccessGrid>
      </QuickAccessSection>

      {/* Pacientes de Hoje */}
      <div>
        <SectionTitle>Pacientes de Hoje</SectionTitle>
        <TableCard>
          <TableElement>
            <thead>
              <TableHeaderRow>
                <TableHeaderCell>Horário</TableHeaderCell>
                <TableHeaderCell>Paciente</TableHeaderCell>
                <TableHeaderCell>Profissional</TableHeaderCell>
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
                  <EmptyStateCell colSpan={4}>
                    Nenhum paciente agendado para hoje.
                  </EmptyStateCell>
                </tr>
              ) : (
                dashData.appointments.map((appt) => {
                  const config = STATUS_CONFIG[appt.status];
                  return (
                    <TableRow key={appt.id}>
                      <TableCell>
                        <TimeLabel>{appt.time}</TimeLabel>
                      </TableCell>
                      <TableCell>{appt.patientName}</TableCell>
                      <TableCell>
                        <DoctorLabel>{appt.doctorName}</DoctorLabel>
                      </TableCell>
                      <TableCell>
                        <StatusBadge $variant={config.variant}>
                          {config.label}
                        </StatusBadge>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </tbody>
          </TableElement>
        </TableCard>
      </div>
    </PageWrapper>
  );
};

export default ReceptionDashboard;
