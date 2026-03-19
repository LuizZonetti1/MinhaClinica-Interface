import {
  Bell,
  CalendarDays,
  CheckCircle,
  FileText,
  LayoutDashboard,
  Settings,
  Stethoscope,
  TrendingUp,
  User,
  UserPlus,
  Users,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { AlertItem } from "../../../components/AlertItem";
import { ConsultationsChart } from "../../../components/ConsultationsChart";
import { QuickAccessCard } from "../../../components/QuickAccessCard";
import { StatCard } from "../../../components/StatCard";
import { useAuth } from "../../../contexts";
import { getDashboardSummary } from "../../../services/admin.service";
import { theme } from "../../../themes/themes";
import type { DashboardSummary, HistoricalItem } from "../../../types/dashboard";
import {
  AlertsList,
  AlertsSection,
  ChartCard,
  ChartTitle,
  HeroBanner,
  HeroSubtitle,
  HeroTitle,
  PageWrapper,
  QuickAccessGrid,
  QuickAccessSection,
  SectionTitle,
  StatsGrid,
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

const ALERTS = [
  {
    type: "warning" as const,
    icon: <Bell size={18} />,
    message: "3 profissionais com agenda vazia esta semana.",
  },
  {
    type: "success" as const,
    icon: <CheckCircle size={18} />,
    message: "Meta de consultas de Fevereiro atingida (280/250).",
  },
  {
    type: "info" as const,
    icon: <CalendarDays size={18} />,
    message: "5 pacientes aguardando confirmação de consulta.",
  },
];

const QUICK_ACCESS = [
  {
    icon: <Stethoscope size={20} />,
    label: "Gerenciar Profissionais",
    color: "#2563EB",
    path: "/admin/profissional/dashboard",
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
  {
    icon: <LayoutDashboard size={20} />,
    label: "Painel da Recepção",
    color: "#1E40AF",
    path: "/recepcao/dashboard",
  },
];

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

// ─── Component ────────────────────────────────────────────────────────────────

const getLastSixMonthsAbbr = () => {
  const months: string[] = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date();
    d.setMonth(d.getMonth() - i);
    months.push(d.toLocaleDateString("pt-BR", { month: "short" }).replace(".", ""));
  }
  return months;
};

const AdminDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState<ReturnType<typeof buildStats>>([]);
  const [appointmentsToday, setAppointmentsToday] = useState<number | null>(null);
  const [chartData, setChartData] = useState<HistoricalItem[]>(() =>
    getLastSixMonthsAbbr().map((month) => ({ month, consultations: 0, revenue: 0 })),
  );

  useEffect(() => {
    getDashboardSummary()
      .then((data) => {
        setStats(buildStats(data));
        setAppointmentsToday(data.appointmentsToday);
        const months = getLastSixMonthsAbbr();
        setChartData(
          months.map((month, i) =>
            i === months.length - 1
              ? { month, consultations: data.appointmentsThisMonth, revenue: data.monthlyBalance }
              : { month, consultations: 0, revenue: 0 },
          ),
        );
      })
      .catch(console.error);
  }, []);

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
      <AlertsSection>
        <SectionTitle>Alertas e Notificações</SectionTitle>
        <AlertsList>
          {ALERTS.map((alert) => (
            <AlertItem
              key={alert.message}
              type={alert.type}
              icon={alert.icon}
              message={alert.message}
            />
          ))}
        </AlertsList>
      </AlertsSection>

      {/* Chart */}
      <ChartCard>
        <ChartTitle>Evolução de Consultas e Receita (últimos 6 meses)</ChartTitle>
        <ConsultationsChart data={chartData} />
      </ChartCard>

      {/* Quick Access */}
      <QuickAccessSection>
        <SectionTitle>Acesso Rápido</SectionTitle>
        <QuickAccessGrid>
          {QUICK_ACCESS.map((item) => (
            <QuickAccessCard
              key={item.label}
              icon={item.icon}
              label={item.label}
              color={item.color}
              onClick={() => navigate(item.path)}
            />
          ))}
        </QuickAccessGrid>
      </QuickAccessSection>
    </PageWrapper>
  );
};

export default AdminDashboard;
