import {
  Bell,
  CalendarCheck2,
  CalendarDays,
  CalendarPlus2,
  CheckCircle,
  ClipboardCheck,
  Clock,
  UserPlus,
} from "lucide-react";
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
    icon: <CalendarDays size={22} color="#2563EB" />,
    iconBg: theme.colors.featureBg.blue,
    label: "Consultas Hoje",
    value: String(summary.consultationsToday),
  },
  {
    icon: <Clock size={22} color="#EA580C" />,
    iconBg: theme.colors.featureBg.orange,
    label: "Aguardando Check-in",
    value: String(summary.awaitingCheckin),
  },
  {
    icon: <CheckCircle size={22} color="#16A34A" />,
    iconBg: theme.colors.featureBg.green,
    label: "Check-ins Realizados",
    value: String(summary.checkinsDone),
  },
  {
    icon: <Bell size={22} color="var(--mc-status-waiting-text)" />,
    iconBg: "var(--mc-status-waiting-bg)",
    label: "Confirmações Pendentes",
    value: String(summary.pendingConfirmations),
  },
];

const QUICK_ACCESS = [
  {
    icon: <CalendarPlus2 size={20} />,
    label: "Marcar Consulta",
    color: "#2563EB",
    path: "/recepcao/marcar-consulta",
  },
  {
    icon: <UserPlus size={20} />,
    label: "Cadastrar Paciente",
    color: "#16A34A",
    path: "/recepcao/cadastrar-paciente",
  },
  {
    icon: <CalendarCheck2 size={20} />,
    label: "Ver Agendas",
    color: "#9333EA",
    path: "/recepcao/agendas",
  },
  {
    icon: <ClipboardCheck size={20} />,
    label: "Check-in",
    color: "#EA580C",
    path: "/recepcao/checkin",
  },
];

const STATUS_CONFIG: Record<
  AppointmentStatus,
  { label: string; variant: "waiting" | "checkin" | "progress" | "done" | "cancelled" | "noshow" }
> = {
  WAITING: { label: "Aguardando", variant: "waiting" },
  CHECKED_IN: { label: "Check-in OK", variant: "checkin" },
  IN_PROGRESS: { label: "Em Atendimento", variant: "progress" },
  DONE: { label: "Concluído", variant: "done" },
  CANCELLED: { label: "Cancelado", variant: "cancelled" },
  NO_SHOW: { label: "Não Compareceu", variant: "noshow" },
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
    let isMounted = true;

    const loadDashboard = async (silent = false) => {
      try {
        const data = await getReceptionDashboard();
        if (!isMounted) return;
        setDashData(data);
      } catch {
        if (!silent && isMounted) {
          notifyError("Erro ao carregar dados do painel.");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    void loadDashboard(false);

    // Sincroniza mudancas automaticas de status no backend (ex.: WAITING -> NO_SHOW).
    const intervalId = window.setInterval(() => {
      void loadDashboard(true);
    }, 60000);

    return () => {
      isMounted = false;
      window.clearInterval(intervalId);
    };
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
          {dashData && ` Hoje há ${dashData.summary.consultationsToday} consultas agendadas.`}
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
                  <EmptyStateCell colSpan={4}>Nenhum paciente agendado para hoje.</EmptyStateCell>
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
                        <StatusBadge $variant={config.variant}>{config.label}</StatusBadge>
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
