import {
  CalendarDays,
  CheckCircle,
  FileText,
  Settings,
  Stethoscope,
  TrendingUp,
  User,
  UserPlus,
  Users,
} from "lucide-react";
import { type ReactNode, useEffect, useState } from "react";
import { AlertItem } from "../../../components/AlertItem";
import { ConsultationsChart } from "../../../components/ConsultationsChart";
import QuickActions from "../../../components/QuickActions";
import { StatCard } from "../../../components/StatCard";
import { useAuth } from "../../../contexts";
import { getDashboardHistorical, getDashboardSummary } from "../../../services/admin.service";
import { getReceptionDashboard, updateAppointmentStatus } from "../../../services/reception.service";
import { theme } from "../../../themes/themes";
import type { AppointmentStatus, DashboardSummary, HistoricalItem, ReceptionDashboardData } from "../../../types/dashboard";
import { UserRole } from "../../../types/enums";
import { getFormattedDate, getGreeting } from "../../../utils/formatters";
import {
  AlertsList,
  AlertsSection,
  ChartCard,
  ChartTitle,
  CheckInButton,
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
  TodayPatientsSection,
} from "./styles";

// ─── Static card config ───────────────────────────────────────────────────────

const formatBalance = (value: number) => {
  const abs = Math.abs(value);
  const formatted = abs >= 1000 ? `R$ ${(abs / 1000).toFixed(1)}k` : `R$ ${abs}`;
  return value < 0 ? `-${formatted}` : formatted;
};

const buildStats = (data: DashboardSummary) => [
  {
    icon: <Users size={22} color="#2563EB" />,
    iconBg: theme.colors.featureBg.blue,
    label: "Total de Pacientes",
    value: String(data.totalPatients),
  },
  {
    icon: <CalendarDays size={22} color="#16A34A" />,
    iconBg: theme.colors.featureBg.green,
    label: "Consultas Hoje",
    value: String(data.appointmentsToday),
  },
  {
    icon: <Stethoscope size={22} color="#9333EA" />,
    iconBg: theme.colors.featureBg.purple,
    label: "Profissionais Ativos",
    value: String(data.totalProfessionals),
  },
  {
    icon: <TrendingUp size={22} color="#EA580C" />,
    iconBg: theme.colors.featureBg.orange,
    label: "Receita Mensal",
    value: formatBalance(data.monthlyBalance),
  },
];

const QUICK_ACCESS = [
  {
    icon: <Stethoscope size={20} />,
    label: "Gerenciar Profissionais",
    color: "#2563EB",
    path: "/admin/profissional",
  },
  {
    icon: <UserPlus size={20} />,
    label: "Gerenciar Pacientes",
    color: "#16A34A",
    path: "/admin/paciente/dashboard",
  },
  {
    icon: <FileText size={20} />,
    label: "Ver Relatórios",
    color: "#9333EA",
    path: "/admin/relatorios",
  },
  {
    icon: <Settings size={20} />,
    label: "Configurações",
    color: "#EA580C",
    path: "/admin/configuracoes",
  },
  {
    icon: <User size={20} />,
    label: "Meu Perfil",
    color: "#4B5563",
    path: "/admin/perfil",
  },
];

// ─── Component ────────────────────────────────────────────────────────────────

const toValidReferenceDate = (rawDate: string | null | undefined): Date => {
  if (!rawDate) return new Date();

  const parsed = new Date(rawDate);
  if (Number.isNaN(parsed.getTime())) return new Date();
  return parsed;
};

type AlertEntry = {
  type: "warning" | "success" | "info";
  icon: ReactNode;
  message: string;
};

const buildAlerts = (summary: DashboardSummary): AlertEntry[] => {
  const now = new Date();
  const alerts: AlertEntry[] = [];

  // Alerta 1: consultas hoje
  if (summary.appointmentsToday === 0) {
    alerts.push({
      type: "warning",
      icon: <CalendarDays size={18} />,
      message: "Nenhuma consulta agendada para hoje.",
    });
  } else {
    const plural = summary.appointmentsToday !== 1;
    alerts.push({
      type: "info",
      icon: <CalendarDays size={18} />,
      message: `${summary.appointmentsToday} consulta${plural ? "s" : ""} agendada${plural ? "s" : ""} para hoje.`,
    });
  }

  // Alerta 2: balanço mensal — exibido apenas a partir do dia 26 às 7h
  if (now.getDate() >= 26 && now.getHours() >= 7) {
    const refDate = toValidReferenceDate(summary.referenceDate);
    const monthName = refDate.toLocaleDateString("pt-BR", { month: "long" });
    const balanceFormatted = formatBalance(summary.monthlyBalance);

    if (summary.monthlyBalance < 0) {
      alerts.push({
        type: "warning",
        icon: <TrendingUp size={18} />,
        message: `Balanço de ${monthName} negativo: ${balanceFormatted}.`,
      });
    } else {
      alerts.push({
        type: "success",
        icon: <TrendingUp size={18} />,
        message: `Balanço de ${monthName} positivo: ${balanceFormatted}.`,
      });
    }
  }

  return alerts;
};

const getLastSixMonthsAbbr = (referenceDate = new Date()) => {
  const base = new Date(referenceDate.getFullYear(), referenceDate.getMonth(), 1);
  const formatter = new Intl.DateTimeFormat("pt-BR", { month: "short" });
  const months: string[] = [];

  for (let i = 5; i >= 0; i--) {
    const cursor = new Date(base.getFullYear(), base.getMonth() - i, 1);
    months.push(formatter.format(cursor).replace(".", ""));
  }

  return months;
};

const MONTH_TOKEN_BY_INDEX = [
  "jan",
  "fev",
  "mar",
  "abr",
  "mai",
  "jun",
  "jul",
  "ago",
  "set",
  "out",
  "nov",
  "dez",
];

const toMonthToken = (rawMonth: string): string => {
  const normalized = rawMonth
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();

  for (const token of MONTH_TOKEN_BY_INDEX) {
    if (normalized.includes(token)) return token;
  }

  const numericMatch = normalized.match(/(?:^|[^0-9])(0?[1-9]|1[0-2])(?:[^0-9]|$)/);
  if (numericMatch?.[1]) {
    return MONTH_TOKEN_BY_INDEX[Number(numericMatch[1]) - 1] ?? "";
  }

  const parsed = new Date(rawMonth);
  if (!Number.isNaN(parsed.getTime())) {
    return MONTH_TOKEN_BY_INDEX[parsed.getMonth()];
  }

  return "";
};

const buildChartDataFromHistorical = (
  historicalItems: HistoricalItem[],
  referenceDate: Date,
): HistoricalItem[] => {
  const monthMap = new Map<string, HistoricalItem>();

  for (const item of historicalItems) {
    const token = toMonthToken(item.month);
    if (!token) continue;
    monthMap.set(token, item);
  }

  return getLastSixMonthsAbbr(referenceDate).map((month) => {
    const token = toMonthToken(month);
    const found = monthMap.get(token);
    return found
      ? { month, consultations: found.consultations, revenue: found.revenue }
      : { month, consultations: 0, revenue: 0 };
  });
};

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

const AdminDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<ReturnType<typeof buildStats>>([]);
  const [appointmentsToday, setAppointmentsToday] = useState<number | null>(null);
  const [summaryData, setSummaryData] = useState<DashboardSummary | null>(null);
  const [chartData, setChartData] = useState<HistoricalItem[]>(() =>
    getLastSixMonthsAbbr().map((month) => ({ month, consultations: 0, revenue: 0 })),
  );
  const [receptionData, setReceptionData] = useState<ReceptionDashboardData | null>(null);
  const [checkingInId, setCheckingInId] = useState<string | null>(null);

  const hasReceptionistRole = !!(user?.roles?.includes(UserRole.RECEPTIONIST));
  const hasProfessionalRole = !!(user?.roles?.includes(UserRole.PROFESSIONAL));
  const showTodayPatients = hasReceptionistRole || hasProfessionalRole;

  const handleCheckin = async (id: string) => {
    setCheckingInId(id);
    try {
      await updateAppointmentStatus(id, "WAITING");
      setReceptionData((prev) =>
        prev
          ? {
            ...prev,
            appointments: prev.appointments.map((a) =>
              a.id === id ? { ...a, status: "CHECKED_IN" as AppointmentStatus } : a,
            ),
          }
          : prev,
      );
    } catch {
      // silently fail
    } finally {
      setCheckingInId(null);
    }
  };

  useEffect(() => {
    let mounted = true;

    const loadDashboard = async () => {
      const [summaryResult, historicalResult] = await Promise.allSettled([
        getDashboardSummary(),
        getDashboardHistorical(6),
      ]);

      if (!mounted) return;

      const fallbackData = (summary: DashboardSummary, referenceDate: Date): HistoricalItem[] => {
        const months = getLastSixMonthsAbbr(referenceDate);
        return months.map((month, i) =>
          i === months.length - 1
            ? {
              month,
              consultations: summary.appointmentsThisMonth,
              revenue: summary.monthlyBalance,
            }
            : { month, consultations: 0, revenue: 0 },
        );
      };

      if (summaryResult.status === "fulfilled") {
        const summary = summaryResult.value;
        setStats(buildStats(summary));
        setAppointmentsToday(summary.appointmentsToday);
        setSummaryData(summary);

        const referenceDate = toValidReferenceDate(summary.referenceDate);
        if (historicalResult.status === "fulfilled" && historicalResult.value.length > 0) {
          setChartData(buildChartDataFromHistorical(historicalResult.value, referenceDate));
        } else {
          setChartData(fallbackData(summary, referenceDate));
        }
        return;
      }

      if (historicalResult.status === "fulfilled" && historicalResult.value.length > 0) {
        setChartData(buildChartDataFromHistorical(historicalResult.value, new Date()));
      }
    };

    void loadDashboard();

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (!showTodayPatients) return;
    let mounted = true;

    getReceptionDashboard()
      .then((data) => { if (mounted) setReceptionData(data); })
      .catch(() => { /* silently fail — not critical */ });

    return () => { mounted = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showTodayPatients]);

  const firstName = user?.name.split(" ").slice(0, 2).join(" ") ?? "Administrador";
  const greeting = getGreeting();
  const today = getFormattedDate();

  return (
    <PageWrapper>
      {/* Hero Banner */}
      <HeroBanner>
        <HeroTitle>
          {greeting}, {firstName}! 🏥
        </HeroTitle>
        <HeroSubtitle>
          Visão geral da clínica — {today}.
          {appointmentsToday !== null && ` Hoje há ${appointmentsToday} consultas agendadas.`}
        </HeroSubtitle>
      </HeroBanner>

      {/* Stats */}
      <StatsGrid>
        {stats.map((stat) => (
          <StatCard
            key={stat.label}
            icon={stat.icon}
            iconBg={stat.iconBg}
            label={stat.label}
            value={stat.value}
          />
        ))}
      </StatsGrid>

      {/* Alerts */}
      {summaryData && (
        <AlertsSection>
          <SectionTitle>Alertas e Notificações</SectionTitle>
          <AlertsList>
            {buildAlerts(summaryData).map((alert) => (
              <AlertItem
                key={alert.message}
                type={alert.type}
                icon={alert.icon}
                message={alert.message}
              />
            ))}
          </AlertsList>
        </AlertsSection>
      )}

      {/* Chart */}
      <ChartCard>
        <ChartTitle>Evolução de Consultas e Receita (últimos 6 meses)</ChartTitle>
        <ConsultationsChart data={chartData} />
      </ChartCard>

      {/* Quick Access */}
      <QuickActions actions={QUICK_ACCESS} />

      {/* Pacientes de Hoje — visível apenas quando RECEPTIONIST role ativo */}
      {showTodayPatients && (
        <TodayPatientsSection>
          <SectionTitle>Pacientes de Hoje</SectionTitle>
          <TableCard>
            <TableElement>
              <thead>
                <TableHeaderRow>
                  <TableHeaderCell>Hora</TableHeaderCell>
                  <TableHeaderCell>Paciente</TableHeaderCell>
                  <TableHeaderCell>Profissional</TableHeaderCell>
                  <TableHeaderCell>Status</TableHeaderCell>
                  {hasReceptionistRole && <TableHeaderCell>Ação</TableHeaderCell>}
                </TableHeaderRow>
              </thead>
              <tbody>
                {receptionData && receptionData.appointments.length > 0 ? (
                  receptionData.appointments.map((appt) => {
                    const config = STATUS_CONFIG[appt.status] ?? { label: appt.status, variant: "waiting" as const };
                    return (
                      <TableRow key={appt.id}>
                        <TableCell>{appt.time}</TableCell>
                        <TableCell>{appt.patientName}</TableCell>
                        <TableCell>{appt.doctorName}</TableCell>
                        <TableCell>
                          <StatusBadge $variant={config.variant}>{config.label}</StatusBadge>
                        </TableCell>
                        {hasReceptionistRole && (
                          <TableCell>
                            {appt.status === "WAITING" ? (
                              <CheckInButton
                                type="button"
                                disabled={checkingInId === appt.id}
                                onClick={() => void handleCheckin(appt.id)}
                              >
                                <CheckCircle size={14} />
                                {checkingInId === appt.id ? "Aguarde..." : "Check-in"}
                              </CheckInButton>
                            ) : null}
                          </TableCell>
                        )}
                      </TableRow>
                    );
                  })
                ) : (
                  <tr>
                    <EmptyStateCell colSpan={hasReceptionistRole ? 5 : 4}>
                      {receptionData ? "Nenhum paciente agendado para hoje." : "Carregando..."}
                    </EmptyStateCell>
                  </tr>
                )}
              </tbody>
            </TableElement>
          </TableCard>
        </TodayPatientsSection>
      )}
    </PageWrapper>
  );
};

export default AdminDashboard;
