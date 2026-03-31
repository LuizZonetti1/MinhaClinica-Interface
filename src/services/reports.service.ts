import { api } from "../config/api";
import type { ReportData } from "../types/dashboard";
import { toRecord, toTrimmedStringValue } from "../utils/parsers";

export type TransactionType = "INCOME" | "EXPENSE";
export type PaymentMethod = "CASH" | "DEBIT_CARD" | "CREDIT_CARD" | "PIX" | "BANK_TRANSFER" | "CHECK";
export type PaymentStatus = "PENDING" | "PAID" | "CANCELLED" | "REFUNDED";

export interface CreateTransactionPayload {
  type: TransactionType;
  title: string;
  amount: number;
  description?: string;
  category?: string;
  paymentMethod?: PaymentMethod;
  paymentStatus?: PaymentStatus;
  referenceDate?: string;
  dueDate?: string | null;
  notes?: string | null;
}

export interface UpdateTransactionPayload {
  type?: TransactionType;
  title?: string;
  amount?: number;
  description?: string;
  category?: string;
  paymentMethod?: PaymentMethod;
  paymentStatus?: PaymentStatus;
  referenceDate?: string;
  dueDate?: string | null;
  notes?: string | null;
}

export interface TransactionHistoryItem {
  id: string;
  name: string;
  type: TransactionType;
  title: string;
  amount: number;
  date: string;
  paymentStatus: PaymentStatus;
}

const toNumber = (value: unknown): number => {
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
  return 0;
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

const readStringFromRecord = (
  record: Record<string, unknown>,
  keys: string[],
  fallback = "",
): string => {
  for (const key of keys) {
    const value = record[key];
    if (typeof value === "string") {
      const parsed = toTrimmedStringValue(value, "");
      if (parsed) return parsed;
      continue;
    }

    const parsed = toTrimmedStringValue(value, "");
    if (parsed) return parsed;
  }

  return fallback;
};

const readNumberFromRecord = (
  record: Record<string, unknown>,
  keys: string[],
  fallback = 0,
): number => {
  for (const key of keys) {
    const parsed = toNumber(record[key]);
    if (parsed !== 0) return parsed;
    if (record[key] === 0 || record[key] === "0") return 0;
  }

  return fallback;
};

const normalizeTransactionType = (rawType: string, amount: number): TransactionType => {
  const normalized = rawType.trim().toUpperCase();
  if (
    normalized === "INCOME" ||
    normalized === "ENTRADA" ||
    normalized === "ENTRADAS" ||
    normalized === "RECEITA" ||
    normalized === "CREDIT"
  ) {
    return "INCOME";
  }

  if (
    normalized === "EXPENSE" ||
    normalized === "SAIDA" ||
    normalized === "SAÍDA" ||
    normalized === "SAIDAS" ||
    normalized === "DESPESA" ||
    normalized === "DEBIT"
  ) {
    return "EXPENSE";
  }

  return amount < 0 ? "EXPENSE" : "INCOME";
};

const normalizePaymentStatus = (rawStatus: string): PaymentStatus => {
  const normalized = rawStatus.trim().toUpperCase();

  if (normalized === "PAID" || normalized === "PAGO") return "PAID";
  if (normalized === "CANCELLED" || normalized === "CANCELED" || normalized === "CANCELADO") {
    return "CANCELLED";
  }
  if (normalized === "REFUNDED" || normalized === "REEMBOLSADO") return "REFUNDED";
  return "PENDING";
};

const normalizeComparableText = (value: string): string =>
  value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();

const isUnknownAuthorValue = (value: string): boolean => {
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

const sanitizeAuthorValue = (value: unknown): string => {
  if (typeof value === "number" && Number.isFinite(value)) return String(value);
  if (typeof value !== "string") return "";

  const trimmed = value.trim();
  if (isUnknownAuthorValue(trimmed)) return "";
  return trimmed;
};

const readTransactionAuthorName = (item: Record<string, unknown>): string => {
  const directKeys = [
    "createdByName",
    "created_by_name",
    "creatorName",
    "createdByUserName",
    "createdByUsername",
    "createdBy_user_name",
    "req.userName",
    "reqUserName",
    "authenticatedUserName",
    "userName",
    "username",
    "authorName",
    "responsibleName",
    "staffName",
    "receptionistName",
    "operatorName",
    "performedByName",
  ];

  for (const key of directKeys) {
    const value = sanitizeAuthorValue(item[key]);
    if (value) return value;
  }

  const nestedSourceKeys = [
    "createdBy",
    "creator",
    "req",
    "user",
    "author",
    "responsible",
    "staff",
    "receptionist",
    "operator",
    "performedBy",
  ];

  for (const key of nestedSourceKeys) {
    const nested = toRecord(item[key]);
    if (!nested) continue;

    const nestedKeys = [
      "name",
      "fullName",
      "displayName",
      "userName",
      "username",
      "login",
      "email",
    ];

    for (const nestedKey of nestedKeys) {
      const nestedValue = sanitizeAuthorValue(nested[nestedKey]);
      if (nestedValue) return nestedValue;
    }
  }

  return "-";
};

const normalizeTransactionList = (payload: unknown): TransactionHistoryItem[] => {
  const root = toRecord(payload);
  const arrayLike = Array.isArray(payload)
    ? payload
    : Array.isArray(root?.items)
      ? root.items
      : Array.isArray(root?.transactions)
        ? root.transactions
        : Array.isArray(root?.data)
          ? root.data
          : [];

  return arrayLike
    .map((rawItem, index) => {
      const item = toRecord(rawItem);
      if (!item) return null;

      const amount = readNumberFromRecord(item, ["amount", "value", "valor", "total", "price"]);
      const type = normalizeTransactionType(
        readStringFromRecord(item, ["type", "transactionType", "kind"]),
        amount,
      );
      const paymentStatus = normalizePaymentStatus(
        readStringFromRecord(item, ["paymentStatus", "status", "payment_state"], "PENDING"),
      );

      return {
        id:
          readStringFromRecord(item, ["id", "_id", "transactionId"], "").trim() ||
          `tx-${index + 1}`,
        name: readTransactionAuthorName(item),
        type,
        title: readStringFromRecord(
          item,
          ["title", "transactionTitle", "transactionName", "description", "category"],
          "-",
        ),
        amount: Math.abs(amount),
        date: readStringFromRecord(
          item,
          ["referenceDate", "date", "transactionDate", "createdAt", "dueDate"],
          "",
        ),
        paymentStatus,
      } satisfies TransactionHistoryItem;
    })
    .filter((item): item is TransactionHistoryItem => item !== null);
};

const normalizeReportData = (data: ReportData): ReportData => ({
  ...data,
  summary: {
    ...data.summary,
    consultationsCount: toNumber(data.summary.consultationsCount),
    totalRevenue: toNumber(data.summary.totalRevenue),
    cancellationsCount: toNumber(data.summary.cancellationsCount),
    estimatedProfit: toNumber(data.summary.estimatedProfit),
  },
  monthly: data.monthly.map((item) => ({
    ...item,
    consultations: toNumber(item.consultations),
    cancellations: toNumber(item.cancellations),
    revenue: toNumber(item.revenue),
  })),
  financial: data.financial.map((item) => ({
    ...item,
    entradas: toNumber(item.entradas),
    saidas: toNumber(item.saidas),
    lucro: toNumber(item.lucro),
  })),
  statusDistribution: data.statusDistribution.map((item) => ({
    ...item,
    value: toNumber(item.value),
  })),
  revenueTrend: data.revenueTrend.map((item) => ({
    ...item,
    consultations: toNumber(item.consultations),
    revenue: toNumber(item.revenue),
  })),
  topProfessionals: data.topProfessionals.map((item) => ({
    ...item,
    consultations: toNumber(item.consultations),
  })),
  topSpecialties: data.topSpecialties.map((item) => ({
    ...item,
    consultations: toNumber(item.consultations),
  })),
});

export const getReportData = async (period = "6m"): Promise<ReportData> => {
  const months = resolveMonthsFromPeriod(period);
  const { data } = await api.get<ReportData>("/reports", {
    params: {
      period,
      months,
    },
  });
  return normalizeReportData(data);
};

export const getTransactionsHistory = async (
  period = "6m",
): Promise<TransactionHistoryItem[]> => {
  const { data } = await api.get<unknown>("/transactions", {
    params: {
      period,
    },
  });

  return normalizeTransactionList(data);
};

export const createTransaction = async (payload: CreateTransactionPayload): Promise<void> => {
  const requestBody: CreateTransactionPayload = {
    type: payload.type,
    title: payload.title,
    amount: payload.amount,
    ...(payload.description !== undefined && { description: payload.description }),
    ...(payload.category !== undefined && { category: payload.category }),
    ...(payload.paymentMethod !== undefined && { paymentMethod: payload.paymentMethod }),
    ...(payload.paymentStatus !== undefined && { paymentStatus: payload.paymentStatus }),
    ...(payload.referenceDate !== undefined && { referenceDate: payload.referenceDate }),
    ...(payload.dueDate !== undefined && { dueDate: payload.dueDate }),
    ...(payload.notes !== undefined && { notes: payload.notes }),
  };

  await api.post("/transactions", requestBody);
};

export const updateTransaction = async (
  transactionId: string,
  payload: UpdateTransactionPayload,
): Promise<void> => {
  const requestBody: UpdateTransactionPayload = {
    ...(payload.type !== undefined && { type: payload.type }),
    ...(payload.title !== undefined && { title: payload.title }),
    ...(payload.amount !== undefined && { amount: payload.amount }),
    ...(payload.description !== undefined && { description: payload.description }),
    ...(payload.category !== undefined && { category: payload.category }),
    ...(payload.paymentMethod !== undefined && { paymentMethod: payload.paymentMethod }),
    ...(payload.paymentStatus !== undefined && { paymentStatus: payload.paymentStatus }),
    ...(payload.referenceDate !== undefined && { referenceDate: payload.referenceDate }),
    ...(payload.dueDate !== undefined && { dueDate: payload.dueDate }),
    ...(payload.notes !== undefined && { notes: payload.notes }),
  };

  await api.put(`/transactions/${transactionId}`, requestBody);
};
