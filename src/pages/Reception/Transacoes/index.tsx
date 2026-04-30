import { Pencil, Plus } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { Button } from "../../../components/Button";
import { Modal } from "../../../components/Modal";
import { Skeleton } from "../../../components/Skeleton";
import { useAuth } from "../../../contexts";
import {
  type CreateTransactionPayload,
  createTransaction,
  getTransactionsHistory,
  type PaymentMethod,
  type PaymentStatus,
  type TransactionHistoryItem,
  type TransactionType,
  type UpdateTransactionPayload,
  updateTransaction,
} from "../../../services/reports.service";
import { toInputDate } from "../../../utils/dateParsers";
import {
  formatCurrencyBRL,
  formatCurrencyInput,
  formatDateDayMonthYear,
  parseNumberFromInput,
} from "../../../utils/formatters";
import { getApiErrorMessage } from "../../../utils/getApiErrorMessage";
import { notifyError, notifySuccess } from "../../../utils/toast";
import {
  EmptyStateCell,
  FormField,
  FormInput,
  FormLabel,
  FormRow,
  FormSelect,
  FormTextarea,
  HeaderControls,
  ModalForm,
  PageHeader,
  PageSubtitle,
  PageTitle,
  PageWrapper,
  PeriodSelect,
  StatusMessage,
  TableCard,
  TableElement,
  TransactionAmount,
  TransactionTypeBadge,
} from "./styles";

type ReportPeriod = "1m" | "3m" | "6m" | "12m";

const PERIOD_OPTIONS: Array<{ label: string; value: ReportPeriod }> = [
  { label: "Último mês", value: "1m" },
  { label: "Trimestre", value: "3m" },
  { label: "6 meses", value: "6m" },
  { label: "Anual", value: "12m" },
];

const PERIOD_TO_MONTHS: Record<ReportPeriod, number> = {
  "1m": 1,
  "3m": 3,
  "6m": 6,
  "12m": 12,
};

const TRANSACTION_TYPE_LABEL: Record<TransactionType, string> = {
  INCOME: "Entrada",
  EXPENSE: "Saída",
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

const formatTransactionDate = (value: string) => formatDateDayMonthYear(value, "-");

const formatTransactionAmount = (amount: number, type: TransactionType) => {
  const formatted = formatCurrencyBRL(Math.abs(amount));
  return type === "EXPENSE" ? `-${formatted}` : formatted;
};

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

    const amountNumber = parseNumberFromInput(form.amount);
    if (amountNumber === null || amountNumber <= 0) {
      notifyError("Informe um valor válido maior que zero.");
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
            <FormSelect
              id="paymentStatus"
              name="paymentStatus"
              value={form.paymentStatus}
              onChange={handleChange}
            >
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
            <FormSelect
              id="paymentMethod"
              name="paymentMethod"
              value={form.paymentMethod}
              onChange={handleChange}
            >
              <option value="">Não informado</option>
              <option value="CASH">Dinheiro</option>
              <option value="DEBIT_CARD">Cartão de débito</option>
              <option value="CREDIT_CARD">Cartão de crédito</option>
              <option value="PIX">Pix</option>
              <option value="BANK_TRANSFER">Transferência bancária</option>
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const amountNumber = Number(form.amount);
    if (!Number.isFinite(amountNumber) || amountNumber <= 0) {
      notifyError("Informe um valor válido maior que zero.");
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
          <Button
            variant="primary"
            type="submit"
            form="edit-transaction-form"
            disabled={submitting}
          >
            {submitting ? "Salvando..." : "Salvar alterações"}
          </Button>
        </>
      }
    >
      <ModalForm id="edit-transaction-form" onSubmit={(e) => void handleSubmit(e)}>
        <FormRow>
          <FormField>
            <FormLabel htmlFor="edit-type">Tipo *</FormLabel>
            <FormSelect
              id="edit-type"
              name="type"
              value={form.type}
              onChange={handleChange}
              required
            >
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

const ReceptionTransacoesPage = () => {
  const { user } = useAuth();
  const [period, setPeriod] = useState<ReportPeriod>("1m");
  const [transactions, setTransactions] = useState<TransactionHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isTransactionModalOpen, setIsTransactionModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<TransactionHistoryItem | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await getTransactionsHistory(period);
      const months = PERIOD_TO_MONTHS[period];
      const now = new Date();
      const startDate = new Date(now.getFullYear(), now.getMonth() - (months - 1), 1);

      const filtered = data.filter((tx) => {
        if (!tx.date) return true;
        const isoMatch = /^(\d{4})-(\d{2})-(\d{2})/.exec(tx.date);
        const txDate = isoMatch
          ? new Date(Number(isoMatch[1]), Number(isoMatch[2]) - 1, Number(isoMatch[3]))
          : new Date(tx.date);
        return !Number.isNaN(txDate.getTime()) && txDate >= startDate;
      });

      setTransactions(filtered);
    } catch {
      setError("Erro ao carregar histórico de transações.");
      notifyError("Erro ao carregar histórico de transações.");
    } finally {
      setLoading(false);
    }
  }, [period]);

  useEffect(() => {
    void load();
  }, [load]);

  if (loading) {
    return (
      <PageWrapper>
        <PageHeader>
          <div>
            <Skeleton width={220} height={32} />
            <div style={{ marginTop: 8 }}>
              <Skeleton width={160} height={14} />
            </div>
          </div>
          <HeaderControls>
            <Skeleton width={120} height={40} />
            <Skeleton width={140} height={40} />
          </HeaderControls>
        </PageHeader>

        <TableCard>
          <TableElement>
            <thead>
              <tr>
                <th>RESPONSÁVEL</th>
                <th>TIPO</th>
                <th>TÍTULO</th>
                <th>VALOR</th>
                <th>DATA</th>
                <th>AÇÕES</th>
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: 5 }).map((_, index) => (
                // biome-ignore lint/suspicious/noArrayIndexKey: lista de skeleton estática
                <tr key={`skeleton-${index}`}>
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
            </tbody>
          </TableElement>
        </TableCard>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <PageHeader>
        <div>
          <PageTitle>Transações</PageTitle>
          <PageSubtitle>Histórico de entradas e saídas financeiras</PageSubtitle>
        </div>

        <HeaderControls>
          <PeriodSelect
            aria-label="Selecionar período"
            value={period}
            onChange={(event) => setPeriod(event.target.value as ReportPeriod)}
          >
            {PERIOD_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
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
        </HeaderControls>
      </PageHeader>

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
            {error && (
              <tr>
                <EmptyStateCell colSpan={6}>
                  <StatusMessage style={{ textAlign: "center" }}>{error}</StatusMessage>
                </EmptyStateCell>
              </tr>
            )}

            {!error && transactions.length === 0 && (
              <tr>
                <EmptyStateCell colSpan={6}>
                  Nenhuma transação encontrada no período.
                </EmptyStateCell>
              </tr>
            )}

            {!error &&
              transactions.map((transaction, index) => (
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

export default ReceptionTransacoesPage;
