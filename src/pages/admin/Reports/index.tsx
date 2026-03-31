import { Ban, CalendarDays, FileDown, Pencil, Plus, TrendingDown, TrendingUp } from "lucide-react";
import { useEffect, useState } from "react";
import {
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Button } from "../../../components/Button";
import { GroupedBarChart } from "../../../components/GroupedBarChart";
import { Modal } from "../../../components/Modal";
import { Skeleton } from "../../../components/Skeleton";
import { StatCard } from "../../../components/StatCard";
import { useAuth } from "../../../contexts";
import {
  createTransaction,
  getReportData,
  getTransactionsHistory,
  updateTransaction,
  type CreateTransactionPayload,
  type PaymentMethod,
  type PaymentStatus,
  type TransactionHistoryItem,
  type TransactionType,
  type UpdateTransactionPayload,
} from "../../../services/reports.service";
import { theme } from "../../../themes/themes";
import type { BarSeries } from "../../../types/components";
import type { ReportData } from "../../../types/dashboard";
import { toInputDate } from "../../../utils/dateParsers";
import { formatCurrencyBRL, formatDateDayMonthYear } from "../../../utils/formatters";
import { getApiErrorMessage } from "../../../utils/getApiErrorMessage";
import { notifyError, notifySuccess } from "../../../utils/toast";
import {
  ChartCard,
  ChartHeader,
  ChartTitle,
  ExportButton,
  FinancialSummary,
  FinancialSummaryItem,
  FinancialSummaryLabel,
  FinancialSummaryValue,
  FormField,
  FormInput,
  FormLabel,
  FormRow,
  FormSelect,
  FormTextarea,
  Grid2Col,
  HeaderControls,
  ModalForm,
  EmptyStateCell,
  PageHeader,
  PageSubtitle,
  PageTitle,
  PageWrapper,
  PeriodSelect,
  RankingBadge,
  RankingCount,
  RankingInfo,
  RankingItem,
  RankingList,
  RankingName,
  RankingSpecialty,
  StatsGrid,
  StatusMessage,
  TableCard,
  TableElement,
  TabButton,
  TabRow,
  TransactionAmount,
  TransactionTypeBadge,
} from "./styles";

const PERIOD_OPTIONS = [
  { value: "1m", label: "Último mês" },
  { value: "3m", label: "Último trimestre" },
  { value: "6m", label: "Últimos 6 meses" },
  { value: "12m", label: "Último ano" },
];
const REVENUE_TREND_FIXED_PERIOD = "6m";

type ActiveTab = "analytics" | "transactions";

const TRANSACTION_TYPE_LABEL: Record<TransactionType, string> = {
  INCOME: "Entrada",
  EXPENSE: "Saída",
};

const PERIOD_TO_MONTHS: Record<string, number> = {
  "1m": 1,
  "3m": 3,
  "6m": 6,
  "12m": 12,
};

const resolveMonthsFromPeriod = (period: string): number => {
  const normalized = period.trim().toLowerCase();
  const mapped = PERIOD_TO_MONTHS[normalized];
  if (mapped) return mapped;

  const parsed = Number(normalized.replace(/\D+/g, ""));
  if (Number.isFinite(parsed) && parsed > 0) return parsed;

  return 6;
};

const STATUS_COLORS: Record<string, string> = {
  Confirmados: theme.colors.success,
  Pendentes: theme.colors.warning,
  Cancelados: theme.colors.error,
};

const EXPENSE_ACCENT_COLOR = "var(--mc-action-delete-text, #DC2626)";
const EXPENSE_BG_COLOR = "var(--mc-action-delete-bg, #FEE2E2)";

const formatCurrency = (value: number) => {
  const sign = value < 0 ? "-" : "";
  const absValue = Math.abs(value);
  return `${sign}R$${absValue.toLocaleString("pt-BR", { maximumFractionDigits: 0 })}`;
};

const formatCurrencyInput = (rawValue: string): string => {
  const digits = rawValue.replace(/\D/g, "");
  if (!digits) return "";

  const amount = Number(digits) / 100;
  return amount.toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

const formatCompactCurrency = (value: number) => {
  const sign = value < 0 ? "-" : "";
  const absValue = Math.abs(value);

  if (absValue >= 1000) {
    const compact = absValue >= 10000 ? (absValue / 1000).toFixed(0) : (absValue / 1000).toFixed(1);
    return `${sign}R$${compact.replace(".", ",")}k`;
  }

  return `${sign}R$${absValue.toLocaleString("pt-BR", { maximumFractionDigits: 0 })}`;
};

const formatCount = (v: number) => String(v);

const parseNumber = (value: unknown): number | null => {
  if (typeof value === "number" && Number.isFinite(value)) return value;

  if (typeof value === "string") {
    const normalized = value
      .trim()
      .replace(/\s+/g, "")
      .replace(/\.(?=\d{3}\b)/g, "")
      .replace(",", ".");

    const parsed = Number(normalized);
    if (Number.isFinite(parsed)) return parsed;
  }

  return null;
};

const MONTH_TOKEN_TO_INDEX: Record<string, number> = {
  jan: 0,
  feb: 1,
  fev: 1,
  mar: 2,
  apr: 3,
  abr: 3,
  may: 4,
  mai: 4,
  jun: 5,
  jul: 6,
  aug: 7,
  ago: 7,
  sep: 8,
  set: 8,
  oct: 9,
  out: 9,
  nov: 10,
  dec: 11,
  dez: 11,
};

const normalizeMonthToken = (value: string): string =>
  value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z]/g, "")
    .slice(0, 3);

const toMonthKey = (year: number, monthIndex: number) =>
  `${year}-${String(monthIndex + 1).padStart(2, "0")}`;

const parseMonthIndexFromLabel = (value: string): number | null => {
  const token = normalizeMonthToken(value);
  const mapped = MONTH_TOKEN_TO_INDEX[token];
  if (mapped !== undefined) return mapped;

  const numericMonthMatch = value.match(/(?:^|[^0-9])(0?[1-9]|1[0-2])(?:[^0-9]|$)/);
  if (numericMonthMatch?.[1]) return Number(numericMonthMatch[1]) - 1;

  const date = new Date(value);
  if (!Number.isNaN(date.getTime())) return date.getMonth();

  return null;
};

const extractYearFromLabel = (value: string): number | null => {
  const yearMatch = value.match(/(19|20)\d{2}/);
  if (!yearMatch) return null;

  const year = Number(yearMatch[0]);
  if (!Number.isFinite(year)) return null;

  return year;
};

const inferYearForMonth = (monthIndex: number, referenceDate: Date): number => {
  const currentMonthIndex = referenceDate.getMonth();
  const currentYear = referenceDate.getFullYear();

  // Se o mes eh maior que o mes atual, ele pertence ao ano anterior.
  return monthIndex > currentMonthIndex ? currentYear - 1 : currentYear;
};

const resolveMonthKeyFromLabel = (rawMonth: string, referenceDate: Date): string | null => {
  const monthIndex = parseMonthIndexFromLabel(rawMonth);
  if (monthIndex === null) return null;

  const explicitYear = extractYearFromLabel(rawMonth);
  const year = explicitYear ?? inferYearForMonth(monthIndex, referenceDate);
  return toMonthKey(year, monthIndex);
};

const pickFirstMeaningfulNumber = (...values: Array<number | undefined>): number => {
  const finiteValues = values.filter((value): value is number => Number.isFinite(value ?? NaN));
  const nonZero = finiteValues.find((value) => value !== 0);
  if (nonZero !== undefined) return nonZero;

  return finiteValues[0] ?? 0;
};

const formatMonthLabel = (date: Date, referenceDate: Date): string => {
  const monthName = date
    .toLocaleDateString("pt-BR", { month: "short" })
    .replace(".", "")
    .toLowerCase();

  const shortYear =
    date.getFullYear() !== referenceDate.getFullYear() ? `/${String(date.getFullYear()).slice(-2)}` : "";

  const base = `${monthName}${shortYear}`;
  return base.charAt(0).toUpperCase() + base.slice(1);
};

const buildMonthlyEvolutionData = (
  data: ReportData,
  period: string,
  referenceDate = new Date(),
) => {
  const monthsCount = resolveMonthsFromPeriod(period);
  const monthlyByKey = new Map<
    string,
    {
      consultations: number;
      cancellations: number;
      revenue: number;
    }
  >();
  const trendByKey = new Map<
    string,
    {
      consultations: number;
      revenue: number;
    }
  >();
  const financialIncomeByKey = new Map<string, number>();

  for (const item of data.monthly) {
    const rawMonth = String(item.month ?? "");
    const key = resolveMonthKeyFromLabel(rawMonth, referenceDate);
    if (!key) continue;

    const previous = monthlyByKey.get(key) ?? {
      consultations: 0,
      cancellations: 0,
      revenue: 0,
    };

    monthlyByKey.set(key, {
      consultations: previous.consultations + item.consultations,
      cancellations: previous.cancellations + item.cancellations,
      revenue: previous.revenue + item.revenue,
    });
  }

  for (const item of data.revenueTrend) {
    const rawMonth = String(item.month ?? "");
    const key = resolveMonthKeyFromLabel(rawMonth, referenceDate);
    if (!key) continue;

    const previous = trendByKey.get(key) ?? {
      consultations: 0,
      revenue: 0,
    };

    trendByKey.set(key, {
      consultations: previous.consultations + item.consultations,
      revenue: previous.revenue + item.revenue,
    });
  }

  for (const item of data.financial) {
    const rawMonth = String(item.month ?? "");
    const key = resolveMonthKeyFromLabel(rawMonth, referenceDate);
    if (!key) continue;

    const previousIncome = financialIncomeByKey.get(key) ?? 0;
    financialIncomeByKey.set(key, previousIncome + item.entradas);
  }

  const timeline: ReportData["monthly"] = [];

  for (let offset = monthsCount - 1; offset >= 0; offset -= 1) {
    const date = new Date(referenceDate.getFullYear(), referenceDate.getMonth() - offset, 1);
    const key = toMonthKey(date.getFullYear(), date.getMonth());
    const monthlyValues = monthlyByKey.get(key);
    const trendValues = trendByKey.get(key);
    const financialIncome = financialIncomeByKey.get(key);

    timeline.push({
      month: formatMonthLabel(date, referenceDate),
      consultations: pickFirstMeaningfulNumber(
        monthlyValues?.consultations,
        trendValues?.consultations,
      ),
      cancellations: monthlyValues?.cancellations ?? 0,
      revenue: pickFirstMeaningfulNumber(
        monthlyValues?.revenue,
        trendValues?.revenue,
        financialIncome,
      ),
    });
  }

  return timeline;
};

const getMostRecentFinancialItem = (financial: ReportData["financial"]) => {
  if (!financial.length) return null;

  const currentMonthIndex = new Date().getMonth();
  const scored = financial
    .map((item) => {
      const monthIndex = MONTH_TOKEN_TO_INDEX[normalizeMonthToken(String(item.month ?? ""))];
      if (monthIndex === undefined) return null;

      const monthsAgo = (currentMonthIndex - monthIndex + 12) % 12;
      return { item, monthsAgo };
    })
    .filter((entry): entry is { item: ReportData["financial"][number]; monthsAgo: number } => entry !== null)
    .sort((a, b) => a.monthsAgo - b.monthsAgo);

  if (scored.length) return scored[0].item;
  return financial[financial.length - 1];
};

const readSummaryNumber = (summary: Record<string, unknown>, keys: string[]): number | null => {
  for (const key of keys) {
    const parsed = parseNumber(summary[key]);
    if (parsed !== null) return parsed;
  }

  return null;
};

const MONTHLY_SERIES: BarSeries[] = [
  { dataKey: "cancellations", name: "Cancelamentos", color: "#9CA3AF" },
  { dataKey: "consultations", name: "Consultas", color: theme.colors.primary },
  { dataKey: "revenue", name: "Receita", color: "#818CF8", yAxisId: "right" },
];

const FINANCIAL_SERIES: BarSeries[] = [
  { dataKey: "entradas", name: "Entradas", color: theme.colors.success },
  { dataKey: "saidas", name: "Saídas", color: "#374151" },
  { dataKey: "lucro", name: "Lucro", color: theme.colors.primary },
];

type TransactionFormState = {
  type: TransactionType;
  title: string;
  amount: string;
  category: string;
  paymentMethod: PaymentMethod | "";
  paymentStatus: PaymentStatus;
  referenceDate: string;
  notes: string;
};

const EMPTY_FORM: TransactionFormState = {
  type: "INCOME",
  title: "",
  amount: "",
  category: "",
  paymentMethod: "",
  paymentStatus: "PENDING",
  referenceDate: "",
  notes: "",
};

interface TransactionModalProps {
  onClose: () => void;
  onCreated: () => void;
}

interface TransactionEditModalProps {
  transaction: TransactionHistoryItem;
  onClose: () => void;
  onUpdated: () => void;
}

type EditTransactionForm = {
  type: TransactionType;
  title: string;
  amount: string;
  paymentStatus: PaymentStatus;
  referenceDate: string;
};

const TransactionModal = ({ onClose, onCreated }: TransactionModalProps) => {
  const [form, setForm] = useState<TransactionFormState>(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;

    if (name === "amount") {
      setForm((prev) => ({ ...prev, amount: formatCurrencyInput(value) }));
      return;
    }

    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const amountNumber = parseNumber(form.amount);
    if (amountNumber === null || amountNumber <= 0) {
      notifyError("Informe um valor valido maior que zero.");
      return;
    }

    const payload: CreateTransactionPayload = {
      type: form.type,
      title: form.title.trim(),
      amount: amountNumber,
      ...(form.category?.trim() && { category: form.category.trim() }),
      ...(form.paymentMethod && { paymentMethod: form.paymentMethod }),
      ...(form.paymentStatus && { paymentStatus: form.paymentStatus }),
      ...(form.referenceDate?.trim() && { referenceDate: form.referenceDate.trim() }),
      ...(form.notes?.trim() ? { notes: form.notes.trim() } : { notes: null }),
    };

    setSubmitting(true);
    try {
      await createTransaction(payload);
      notifySuccess("Transação criada com sucesso!");
      onCreated();
      onClose();
    } catch (err) {
      notifyError(getApiErrorMessage(err, "Erro ao criar transação."));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen
      onClose={onClose}
      title="Nova Transação"
      actions={
        <>
          <Button variant="outline" type="button" onClick={onClose} disabled={submitting}>
            Cancelar
          </Button>
          <Button variant="primary" type="submit" form="new-transaction-form" disabled={submitting}>
            {submitting ? "Salvando..." : "Salvar transação"}
          </Button>
        </>
      }
    >
      <ModalForm id="new-transaction-form" onSubmit={(e) => void handleSubmit(e)}>
        <FormRow>
          <FormField>
            <FormLabel htmlFor="type">Tipo *</FormLabel>
            <FormSelect id="type" name="type" value={form.type} onChange={handleChange} required>
              <option value="INCOME">Entrada</option>
              <option value="EXPENSE">Saída</option>
            </FormSelect>
          </FormField>

          <FormField>
            <FormLabel htmlFor="paymentStatus">Status do pagamento</FormLabel>
            <FormSelect id="paymentStatus" name="paymentStatus" value={form.paymentStatus} onChange={handleChange}>
              <option value="PENDING">Pendente</option>
              <option value="PAID">Pago</option>
              <option value="CANCELLED">Cancelado</option>
              <option value="REFUNDED">Reembolsado</option>
            </FormSelect>
          </FormField>
        </FormRow>

        <FormField>
          <FormLabel htmlFor="title">Título *</FormLabel>
          <FormInput
            id="title"
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="Ex: Consulta Dr. Silva"
            minLength={3}
            maxLength={200}
            required
          />
        </FormField>

        <FormRow>
          <FormField>
            <FormLabel htmlFor="amount">Valor (R$) *</FormLabel>
            <FormInput
              id="amount"
              name="amount"
              type="text"
              inputMode="numeric"
              value={form.amount}
              onChange={handleChange}
              placeholder="0,00"
              required
            />
          </FormField>

          <FormField>
            <FormLabel htmlFor="category">Categoria</FormLabel>
            <FormInput
              id="category"
              name="category"
              value={form.category}
              onChange={handleChange}
              placeholder="Ex: Consultas"
              maxLength={100}
            />
          </FormField>
        </FormRow>

        <FormRow>
          <FormField>
            <FormLabel htmlFor="paymentMethod">Forma de pagamento</FormLabel>
            <FormSelect id="paymentMethod" name="paymentMethod" value={form.paymentMethod} onChange={handleChange}>
              <option value="">Não informado</option>
              <option value="CASH">Dinheiro</option>
              <option value="DEBIT_CARD">Cartao de debito</option>
              <option value="CREDIT_CARD">Cartao de credito</option>
              <option value="PIX">Pix</option>
              <option value="BANK_TRANSFER">Transferencia bancaria</option>
              <option value="CHECK">Cheque</option>
            </FormSelect>
          </FormField>

          <FormField>
            <FormLabel htmlFor="referenceDate">Data de referência</FormLabel>
            <FormInput
              id="referenceDate"
              name="referenceDate"
              type="date"
              value={form.referenceDate}
              onChange={handleChange}
            />
          </FormField>
        </FormRow>

        <FormField>
          <FormLabel htmlFor="notes">Observações</FormLabel>
          <FormTextarea
            id="notes"
            name="notes"
            value={form.notes}
            onChange={handleChange}
            placeholder="Observações adicionais..."
            maxLength={1000}
          />
        </FormField>
      </ModalForm>
    </Modal>
  );
};

const TransactionEditModal = ({ transaction, onClose, onUpdated }: TransactionEditModalProps) => {
  const [form, setForm] = useState<EditTransactionForm>({
    type: transaction.type,
    title: transaction.title,
    amount: String(transaction.amount),
    paymentStatus: transaction.paymentStatus ?? "PENDING",
    referenceDate: toInputDate(transaction.date),
  });
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const amountNumber = Number(form.amount);
    if (!Number.isFinite(amountNumber) || amountNumber <= 0) {
      notifyError("Informe um valor valido maior que zero.");
      return;
    }

    const payload: UpdateTransactionPayload = {
      type: form.type,
      title: form.title.trim(),
      amount: amountNumber,
      paymentStatus: form.paymentStatus,
      ...(form.referenceDate.trim() && { referenceDate: form.referenceDate.trim() }),
    };

    setSubmitting(true);
    try {
      await updateTransaction(transaction.id, payload);
      notifySuccess("Transação atualizada com sucesso!");
      onUpdated();
      onClose();
    } catch (err) {
      notifyError(getApiErrorMessage(err, "Erro ao atualizar transação."));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen
      onClose={onClose}
      title="Editar Transação"
      actions={
        <>
          <Button variant="outline" type="button" onClick={onClose} disabled={submitting}>
            Cancelar
          </Button>
          <Button variant="primary" type="submit" form="edit-transaction-form" disabled={submitting}>
            {submitting ? "Salvando..." : "Salvar alterações"}
          </Button>
        </>
      }
    >
      <ModalForm id="edit-transaction-form" onSubmit={(e) => void handleSubmit(e)}>
        <FormRow>
          <FormField>
            <FormLabel htmlFor="edit-type">Tipo *</FormLabel>
            <FormSelect id="edit-type" name="type" value={form.type} onChange={handleChange} required>
              <option value="INCOME">Entrada</option>
              <option value="EXPENSE">Saída</option>
            </FormSelect>
          </FormField>

          <FormField>
            <FormLabel htmlFor="edit-paymentStatus">Status do pagamento *</FormLabel>
            <FormSelect
              id="edit-paymentStatus"
              name="paymentStatus"
              value={form.paymentStatus}
              onChange={handleChange}
              required
            >
              <option value="PENDING">Pendente</option>
              <option value="PAID">Pago</option>
              <option value="CANCELLED">Cancelado</option>
              <option value="REFUNDED">Reembolsado</option>
            </FormSelect>
          </FormField>
        </FormRow>

        <FormField>
          <FormLabel htmlFor="edit-title">Título *</FormLabel>
          <FormInput
            id="edit-title"
            name="title"
            value={form.title}
            onChange={handleChange}
            minLength={3}
            maxLength={200}
            required
          />
        </FormField>

        <FormRow>
          <FormField>
            <FormLabel htmlFor="edit-amount">Valor (R$) *</FormLabel>
            <FormInput
              id="edit-amount"
              name="amount"
              type="number"
              min="0.01"
              step="0.01"
              value={form.amount}
              onChange={handleChange}
              required
            />
          </FormField>

          <FormField>
            <FormLabel htmlFor="edit-referenceDate">Data de referência</FormLabel>
            <FormInput
              id="edit-referenceDate"
              name="referenceDate"
              type="date"
              value={form.referenceDate}
              onChange={handleChange}
            />
          </FormField>
        </FormRow>
      </ModalForm>
    </Modal>
  );
};

const buildStats = (
  totalConsultas: number,
  totalCancelamentos: number,
  totalEntradas: number,
  totalSaidas: number,
) => [
  {
    icon: <CalendarDays size={24} color="#2563EB" />,
    iconBg: theme.colors.featureBg.blue,
    label: "Consultas no período",
    value: totalConsultas.toLocaleString("pt-BR"),
  },
  {
    icon: <Ban size={24} color="#EA580C" />,
    iconBg: theme.colors.featureBg.orange,
    label: "Cancelamentos",
    value: totalCancelamentos.toLocaleString("pt-BR"),
  },
  {
    icon: <TrendingUp size={24} color="#16A34A" />,
    iconBg: theme.colors.featureBg.green,
    label: "Entradas no período",
    value: formatCurrency(totalEntradas),
  },
  {
    icon: <TrendingDown size={24} color={EXPENSE_ACCENT_COLOR} />,
    iconBg: EXPENSE_BG_COLOR,
    label: "Saídas no período",
    value: formatCurrency(totalSaidas),
  },
];

  const formatTransactionDate = (value: string) => formatDateDayMonthYear(value, "-");

const formatTransactionAmount = (amount: number, type: TransactionType) => {
  const formatted = formatCurrencyBRL(Math.abs(amount));
  return type === "EXPENSE" ? `-${formatted}` : formatted;
};

const normalizeComparableText = (value: string): string =>
  value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();

const isUnknownDisplayName = (value: string): boolean => {
  const normalized = normalizeComparableText(value);
  return (
    normalized === "" ||
    normalized === "-" ||
    normalized === "unknown" ||
    normalized === "desconhecido" ||
    normalized === "nao informado" ||
    normalized === "nao-informado" ||
    normalized === "sem nome" ||
    normalized === "null" ||
    normalized === "undefined"
  );
};

const getResponsibleDisplayName = (apiName: string, authenticatedName?: string) => {
  if (!isUnknownDisplayName(apiName)) return apiName;
  if (authenticatedName && !isUnknownDisplayName(authenticatedName)) return authenticatedName;
  return "-";
};

const ReportsPage = () => {
  const { user } = useAuth();
  const [period, setPeriod] = useState("1m");
  const [activeTab, setActiveTab] = useState<ActiveTab>("analytics");
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [fixedRevenueTrend, setFixedRevenueTrend] = useState<ReportData["revenueTrend"]>([]);
  const [transactionsHistory, setTransactionsHistory] = useState<TransactionHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [historyError, setHistoryError] = useState<string | null>(null);
  const [isTransactionModalOpen, setIsTransactionModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<TransactionHistoryItem | null>(null);

  const load = async () => {
    setLoading(true);
    setHistoryLoading(true);
    setError(null);
    setHistoryError(null);

    const [reportResult, historyResult, fixedTrendResult] = await Promise.allSettled([
      getReportData(period),
      getTransactionsHistory(period),
      getReportData(REVENUE_TREND_FIXED_PERIOD),
    ]);

    if (reportResult.status === "fulfilled") {
      setReportData(reportResult.value);
    } else {
      setError("Erro ao carregar dados do relatorio.");
      notifyError("Erro ao carregar dados do relatorio.");
    }

    if (historyResult.status === "fulfilled") {
      setTransactionsHistory(historyResult.value);
    } else {
      setTransactionsHistory([]);
      setHistoryError("Erro ao carregar histórico de transações.");
    }

    if (fixedTrendResult.status === "fulfilled") {
      setFixedRevenueTrend(fixedTrendResult.value.revenueTrend);
    } else {
      setFixedRevenueTrend([]);
    }

    setLoading(false);
    setHistoryLoading(false);
  };

  useEffect(() => {
    void load();
  }, [period]);

  if (loading) {
    return (
      <PageWrapper>
        <PageHeader>
          <div>
            <Skeleton width={260} height={32} />
            <div style={{ marginTop: 8 }}>
              <Skeleton width={180} height={14} />
            </div>
          </div>
          <HeaderControls>
            <Skeleton width={120} height={40} />
            <Skeleton width={140} height={40} />
            <Skeleton width={120} height={40} />
          </HeaderControls>
        </PageHeader>

        <TabRow>
          <TabButton type="button" $active>
            <Skeleton width={96} height={14} />
          </TabButton>
          <TabButton type="button" $active={false}>
            <Skeleton width={150} height={14} />
          </TabButton>
        </TabRow>

        <StatsGrid>
          {Array.from({ length: 4 }).map((_, index) => (
            <ChartCard key={`report-stat-skeleton-${index}`}>
              <Skeleton width="55%" height={12} />
              <div style={{ marginTop: 12 }}>
                <Skeleton width="42%" height={30} />
              </div>
            </ChartCard>
          ))}
        </StatsGrid>

        <ChartCard>
          <Skeleton width={260} height={16} />
          <div style={{ marginTop: 20 }}>
            <Skeleton width="100%" height={260} radius={12} />
          </div>
        </ChartCard>

        <Grid2Col>
          <ChartCard>
            <Skeleton width={220} height={16} />
            <div style={{ marginTop: 20 }}>
              <Skeleton width="100%" height={220} radius={12} />
            </div>
          </ChartCard>
          <ChartCard>
            <Skeleton width={220} height={16} />
            <div style={{ marginTop: 20 }}>
              <Skeleton width="100%" height={220} radius={12} />
            </div>
          </ChartCard>
        </Grid2Col>
      </PageWrapper>
    );
  }

  if (error || !reportData) {
    return (
      <PageWrapper>
        <StatusMessage style={{ color: theme.colors.error }}>
          {error ?? "Erro ao carregar relatorio."}
        </StatusMessage>
      </PageWrapper>
    );
  }

  const summary = reportData.summary as unknown as Record<string, unknown>;

  const fallbackEntradas = reportData.financial.reduce((s, i) => s + i.entradas, 0);
  const fallbackSaidas = reportData.financial.reduce((s, i) => s + i.saidas, 0);
  const fallbackLucro = reportData.financial.reduce((s, i) => s + i.lucro, 0);

  const summaryEntradas = readSummaryNumber(summary, [
    "totalIncome",
    "entradas",
    "totalEntradas",
    "totalRevenue",
  ]);
  const summarySaidas = readSummaryNumber(summary, ["totalExpense", "saidas", "totalSaidas"]);
  const summaryLucro = readSummaryNumber(summary, [
    "amount",
    "profit",
    "totalProfit",
    "lucro",
    "estimatedProfit",
  ]);

  const recentFinancial = getMostRecentFinancialItem(reportData.financial);
  const monthlyEvolutionData = buildMonthlyEvolutionData(reportData, period);

  // Para "último mês", usa o mês mais recente do próprio dataset financeiro.
  const financialEntradas = period === "1m" ? (recentFinancial?.entradas ?? fallbackEntradas) : fallbackEntradas;
  const financialSaidas = period === "1m" ? (recentFinancial?.saidas ?? fallbackSaidas) : fallbackSaidas;
  const financialLucro = period === "1m" ? (recentFinancial?.lucro ?? fallbackLucro) : fallbackLucro;

  const fallbackConsultas = monthlyEvolutionData.reduce((s, i) => s + i.consultations, 0);
  const fallbackCancelamentos = monthlyEvolutionData.reduce((s, i) => s + i.cancellations, 0);
  const monthlyConsultas = fallbackConsultas;
  const monthlyCancelamentos = fallbackCancelamentos;

  const totalEntradas = period === "1m" ? financialEntradas : (summaryEntradas ?? financialEntradas);
  const totalSaidas = period === "1m" ? financialSaidas : (summarySaidas ?? financialSaidas);
  const totalLucro = period === "1m" ? financialLucro : (summaryLucro ?? financialLucro);
  const totalConsultas = monthlyConsultas;
  const totalCancelamentos = monthlyCancelamentos;
  const revenueTrendData = fixedRevenueTrend.length ? fixedRevenueTrend : reportData.revenueTrend;

  const stats = buildStats(totalConsultas, totalCancelamentos, totalEntradas, totalSaidas);

  return (
    <PageWrapper>
      <PageHeader>
        <div>
          <PageTitle>Relatorios e Analises</PageTitle>
          <PageSubtitle>{reportData.referenceLabel}</PageSubtitle>
        </div>

        <HeaderControls>
          <PeriodSelect value={period} onChange={(e) => setPeriod(e.target.value)}>
            {PERIOD_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </PeriodSelect>

          <Button
            variant="primary"
            size="small"
            icon={<Plus size={15} />}
            onClick={() => setIsTransactionModalOpen(true)}
          >
            Nova Transação
          </Button>

          <ExportButton type="button">
            <FileDown size={15} />
            Exportar PDF
          </ExportButton>
        </HeaderControls>
      </PageHeader>

      <TabRow>
        <TabButton $active={activeTab === "analytics"} onClick={() => setActiveTab("analytics")}>
          Relatorios
        </TabButton>
        <TabButton $active={activeTab === "transactions"} onClick={() => setActiveTab("transactions")}>
          Histórico de transações ({transactionsHistory.length})
        </TabButton>
      </TabRow>

      {activeTab === "analytics" && (
        <>
          <StatsGrid>
            {stats.map((s) => (
              <StatCard key={s.label} {...s} />
            ))}
          </StatsGrid>

          <ChartCard>
            <ChartTitle>Evolucao mensal - Consultas e Receita</ChartTitle>
            <GroupedBarChart
              data={monthlyEvolutionData}
              series={MONTHLY_SERIES}
              leftFormatter={formatCount}
              rightFormatter={formatCompactCurrency}
            />
          </ChartCard>

          <ChartCard>
            <ChartHeader>
              <ChartTitle style={{ margin: 0 }}>Fluxo financeiro - Entradas, Saídas e Lucro (R$)</ChartTitle>

              <FinancialSummary>
                <FinancialSummaryItem>
                  <FinancialSummaryLabel>Entradas no período</FinancialSummaryLabel>
                  <FinancialSummaryValue $color={theme.colors.success}>
                    {formatCurrency(totalEntradas)}
                  </FinancialSummaryValue>
                </FinancialSummaryItem>

                <FinancialSummaryItem>
                  <FinancialSummaryLabel>Saídas no período</FinancialSummaryLabel>
                  <FinancialSummaryValue $color="#374151">{formatCurrency(totalSaidas)}</FinancialSummaryValue>
                </FinancialSummaryItem>

                <FinancialSummaryItem>
                  <FinancialSummaryLabel>Lucro no período</FinancialSummaryLabel>
                  <FinancialSummaryValue $color={theme.colors.primary}>
                    {formatCurrency(totalLucro)}
                  </FinancialSummaryValue>
                </FinancialSummaryItem>
              </FinancialSummary>
            </ChartHeader>

            <GroupedBarChart
              data={reportData.financial}
              series={FINANCIAL_SERIES}
              leftFormatter={formatCompactCurrency}
            />
          </ChartCard>

          <Grid2Col>
            <ChartCard>
              <ChartTitle>Status - {reportData.referenceLabel}</ChartTitle>
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie
                    data={reportData.statusDistribution}
                    innerRadius={60}
                    outerRadius={90}
                    dataKey="value"
                    nameKey="name"
                    paddingAngle={3}
                  >
                    {reportData.statusDistribution.map((entry) => (
                      <Cell key={entry.name} fill={STATUS_COLORS[entry.name] ?? "#CBD5E1"} />
                    ))}
                  </Pie>

                  <Tooltip
                    formatter={(value: number | undefined, name: string | undefined) => [
                      value ?? 0,
                      name ?? "",
                    ]}
                  />

                  <Legend
                    iconType="circle"
                    iconSize={10}
                    wrapperStyle={{ fontFamily: "Inter", fontSize: 13 }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </ChartCard>

            <ChartCard>
              <ChartTitle>Tendência de Receita (R$) - Últimos 6 meses</ChartTitle>
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={revenueTrendData} margin={{ top: 8, right: 24, left: 8, bottom: 0 }}>
                  <XAxis
                    dataKey="month"
                    tick={{ fontFamily: "Inter", fontSize: 12, fill: "#6b7280" }}
                    axisLine={false}
                    tickLine={false}
                  />

                  <YAxis
                    tickFormatter={formatCompactCurrency}
                    tick={{ fontFamily: "Inter", fontSize: 12, fill: "#6b7280" }}
                    axisLine={false}
                    tickLine={false}
                  />

                  <Tooltip
                    formatter={(value: number | undefined) => [formatCompactCurrency(value ?? 0), "Receita"]}
                  />

                  <Legend
                    iconType="circle"
                    iconSize={10}
                    wrapperStyle={{ fontFamily: "Inter", fontSize: 13 }}
                  />

                  <Line
                    type="monotone"
                    dataKey="revenue"
                    name="Receita"
                    stroke={theme.colors.success}
                    strokeWidth={2}
                    dot={{ r: 4, fill: theme.colors.success }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartCard>
          </Grid2Col>

          <Grid2Col>
            <ChartCard>
              <ChartTitle>Top profissionais (consultas)</ChartTitle>
              <RankingList>
                {reportData.topProfessionals.map((prof) => (
                  <RankingItem key={prof.rank}>
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <RankingBadge>#{prof.rank}</RankingBadge>
                      <RankingInfo>
                        <RankingName>{prof.name}</RankingName>
                        <RankingSpecialty>{prof.specialty}</RankingSpecialty>
                      </RankingInfo>
                    </div>
                    <RankingCount>{prof.consultations} consultas</RankingCount>
                  </RankingItem>
                ))}
              </RankingList>
            </ChartCard>

            <ChartCard>
              <ChartTitle>Top especialidades</ChartTitle>
              <RankingList>
                {reportData.topSpecialties.map((spec) => (
                  <RankingItem key={spec.rank}>
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <RankingBadge>#{spec.rank}</RankingBadge>
                      <RankingName>{spec.name}</RankingName>
                    </div>
                    <RankingCount>{spec.consultations}</RankingCount>
                  </RankingItem>
                ))}
              </RankingList>
            </ChartCard>
          </Grid2Col>
        </>
      )}

      {activeTab === "transactions" && (
        <TableCard>
          <TableElement>
            <thead>
              <tr>
                <th>RESPONSAVEL</th>
                <th>TIPO</th>
                <th>TÍTULO</th>
                <th>VALOR</th>
                <th>DATA</th>
                <th>AÇÕES</th>
              </tr>
            </thead>
            <tbody>
              {historyLoading &&
                Array.from({ length: 4 }).map((_, index) => (
                  <tr key={`history-skeleton-${index}`}>
                    <td>
                      <Skeleton width={120} height={14} />
                    </td>
                    <td>
                      <Skeleton width={68} height={24} radius={999} />
                    </td>
                    <td>
                      <Skeleton width={180} height={14} />
                    </td>
                    <td>
                      <Skeleton width={88} height={14} />
                    </td>
                    <td>
                      <Skeleton width={92} height={14} />
                    </td>
                    <td>
                      <Skeleton width={70} height={30} radius={8} />
                    </td>
                  </tr>
                ))}

              {!historyLoading && historyError && (
                <tr>
                  <EmptyStateCell colSpan={6}>{historyError}</EmptyStateCell>
                </tr>
              )}

              {!historyLoading && !historyError && transactionsHistory.length === 0 && (
                <tr>
                  <EmptyStateCell colSpan={6}>Nenhuma transação encontrada no período.</EmptyStateCell>
                </tr>
              )}

              {!historyLoading &&
                !historyError &&
                transactionsHistory.map((transaction, index) => (
                  <tr key={`${transaction.id}-${index}`}>
                    <td>{getResponsibleDisplayName(transaction.name, user?.name)}</td>
                    <td>
                      <TransactionTypeBadge $type={transaction.type}>
                        {TRANSACTION_TYPE_LABEL[transaction.type]}
                      </TransactionTypeBadge>
                    </td>
                    <td>{transaction.title}</td>
                    <td>
                      <TransactionAmount $type={transaction.type}>
                        {formatTransactionAmount(transaction.amount, transaction.type)}
                      </TransactionAmount>
                    </td>
                    <td>{formatTransactionDate(transaction.date)}</td>
                    <td>
                      <Button
                        type="button"
                        size="small"
                        variant="outline"
                        icon={<Pencil size={14} />}
                        onClick={() => setEditingTransaction(transaction)}
                        disabled={transaction.id.startsWith("tx-")}
                      >
                        Editar
                      </Button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </TableElement>
        </TableCard>
      )}

      {isTransactionModalOpen && (
        <TransactionModal
          onClose={() => setIsTransactionModalOpen(false)}
          onCreated={() => void load()}
        />
      )}

      {editingTransaction && (
        <TransactionEditModal
          transaction={editingTransaction}
          onClose={() => setEditingTransaction(null)}
          onUpdated={() => void load()}
        />
      )}
    </PageWrapper>
  );
};

export default ReportsPage;

