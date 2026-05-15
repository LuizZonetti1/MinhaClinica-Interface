// ─── Enums ────────────────────────────────────────────────────────────────────

export type TransactionType = "INCOME" | "EXPENSE";

export type PaymentMethod =
  | "CASH"
  | "DEBIT_CARD"
  | "CREDIT_CARD"
  | "PIX"
  | "BANK_TRANSFER"
  | "CHECK";

export type PaymentStatus = "PENDING" | "PAID" | "CANCELLED" | "REFUNDED";

// ─── API payloads ─────────────────────────────────────────────────────────────

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
  createdById?: string;
}

// ─── Filtros / período ────────────────────────────────────────────────────────

export type ReportPeriod = "1m" | "3m" | "6m" | "12m";

// ─── Estados de formulário de transação ──────────────────────────────────────

export type TransactionFormState = {
  type: TransactionType;
  title: string;
  amount: string;
  category: string;
  paymentMethod: PaymentMethod | "";
  paymentStatus: PaymentStatus;
  referenceDate: string;
  notes: string;
};

export type EditTransactionForm = {
  type: TransactionType;
  title: string;
  amount: string;
  paymentStatus: PaymentStatus;
  referenceDate: string;
};

// ─── Props de modais de transação ─────────────────────────────────────────────

export interface TransactionModalProps {
  onClose: () => void;
  onCreated: () => void;
}

export interface TransactionEditModalProps {
  transaction: TransactionHistoryItem;
  onClose: () => void;
  onUpdated: () => void;
}
