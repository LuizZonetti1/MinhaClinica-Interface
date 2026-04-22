import type { BudgetContent, BudgetItem } from "../../../../../types/clinical-document";
import DynamicList from "../components/DynamicList";
import {
  CheckboxField,
  FinancialLabel,
  FinancialRow,
  FinancialSummaryBlock,
  FinancialValue,
  FormFieldGroup,
  FormInput,
  FormLabel,
  FormRow,
  FormTextarea,
  PaymentMethodsGrid,
  SectionBanner,
  SectionCard,
  SectionTitle,
} from "../styles";

interface BudgetFormProps {
  content: BudgetContent;
  onChange: <K extends keyof BudgetContent>(field: K, value: BudgetContent[K]) => void;
  errors: Partial<Record<string, string>>;
  disabled?: boolean;
}

const EMPTY_ITEM: BudgetItem = { description: "", quantity: 1, unitPrice: null, total: 0 };

const PAYMENT_METHOD_OPTIONS = [
  { value: "PIX", label: "PIX" },
  { value: "CREDIT_CARD", label: "Cartao de credito" },
  { value: "DEBIT_CARD", label: "Cartao de debito" },
  { value: "CASH", label: "Dinheiro" },
  { value: "INSURANCE", label: "Convenio" },
  { value: "BOLETO", label: "Boleto" },
];

const formatBRL = (value: number): string =>
  `R$ ${value.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

const recalculateTotals = (
  items: BudgetItem[],
  discount: number,
): { items: BudgetItem[]; subtotal: number; total: number } => {
  const updatedItems = items.map((item) => ({
    ...item,
    total: (item.quantity ?? 0) * (item.unitPrice ?? 0),
  }));
  const subtotal = updatedItems.reduce((sum, item) => sum + item.total, 0);
  return { items: updatedItems, subtotal, total: subtotal - discount };
};

const BudgetForm = ({ content, onChange, errors, disabled }: BudgetFormProps) => {
  const updateItem = (index: number, field: keyof BudgetItem, rawValue: string) => {
    const updated = content.items.map((item, i) => {
      if (i !== index) return item;

      if (field === "quantity" || field === "unitPrice") {
        const numValue = rawValue === "" ? null : Number(rawValue);
        return { ...item, [field]: numValue };
      }
      return { ...item, [field]: rawValue };
    });

    const { items, subtotal, total } = recalculateTotals(updated, content.discount);
    onChange("items", items);
    onChange("subtotal", subtotal);
    onChange("total", total);
  };

  const addItem = () => {
    onChange("items", [...content.items, { ...EMPTY_ITEM }]);
  };

  const removeItem = (index: number) => {
    const remaining = content.items.filter((_, i) => i !== index);
    const { items, subtotal, total } = recalculateTotals(remaining, content.discount);
    onChange("items", items);
    onChange("subtotal", subtotal);
    onChange("total", total);
  };

  const handleDiscountChange = (rawValue: string) => {
    const discount = rawValue === "" ? 0 : Number(rawValue);
    onChange("discount", discount);
    onChange("total", content.subtotal - discount);
  };

  const togglePaymentMethod = (method: string) => {
    const current = content.paymentMethods;
    const updated = current.includes(method)
      ? current.filter((m) => m !== method)
      : [...current, method];
    onChange("paymentMethods", updated);
  };

  return (
    <SectionCard>
      <SectionTitle>Conteudo do Orcamento</SectionTitle>
      <SectionBanner>
        Orcamento de procedimentos. Requer confirmacao de ciencia do paciente antes de finalizar.
      </SectionBanner>

      <DynamicList
        items={content.items}
        onAdd={addItem}
        onRemove={removeItem}
        addLabel="Adicionar item"
        itemLabel="Item"
        disabled={disabled}
        renderItem={(item, index) => (
          <>
            <FormFieldGroup>
              <FormLabel>Descricao do procedimento *</FormLabel>
              <FormInput
                value={item.description}
                onChange={(e) => updateItem(index, "description", e.target.value)}
                placeholder="Ex: Limpeza dentaria"
                disabled={disabled}
              />
            </FormFieldGroup>

            <FormRow>
              <FormFieldGroup>
                <FormLabel>Quantidade *</FormLabel>
                <FormInput
                  type="number"
                  min={1}
                  value={item.quantity ?? ""}
                  onChange={(e) => updateItem(index, "quantity", e.target.value)}
                  disabled={disabled}
                />
              </FormFieldGroup>

              <FormFieldGroup>
                <FormLabel>Valor unitario (R$) *</FormLabel>
                <FormInput
                  type="number"
                  min={0}
                  step={0.01}
                  value={item.unitPrice ?? ""}
                  onChange={(e) => updateItem(index, "unitPrice", e.target.value)}
                  disabled={disabled}
                />
              </FormFieldGroup>
            </FormRow>

            <FormFieldGroup>
              <FormLabel>Total do item</FormLabel>
              <FormInput value={formatBRL(item.total)} disabled readOnly />
            </FormFieldGroup>
          </>
        )}
      />

      <FinancialSummaryBlock>
        <FinancialRow>
          <FinancialLabel>Subtotal</FinancialLabel>
          <FinancialValue>{formatBRL(content.subtotal)}</FinancialValue>
        </FinancialRow>
        <FinancialRow>
          <FinancialLabel>Desconto (R$)</FinancialLabel>
          <FormInput
            type="number"
            min={0}
            step={0.01}
            value={content.discount || ""}
            onChange={(e) => handleDiscountChange(e.target.value)}
            disabled={disabled}
            style={{ maxWidth: 140, textAlign: "right" }}
          />
        </FinancialRow>
        <FinancialRow $highlight>
          <FinancialLabel>Total</FinancialLabel>
          <FinancialValue>{formatBRL(content.total)}</FinancialValue>
        </FinancialRow>
      </FinancialSummaryBlock>

      <FormRow>
        <FormFieldGroup>
          <FormLabel>Validade do orcamento (dias)</FormLabel>
          <FormInput
            type="number"
            min={1}
            value={content.validityDays ?? ""}
            onChange={(e) =>
              onChange("validityDays", e.target.value === "" ? null : Number(e.target.value))
            }
            placeholder="30"
            disabled={disabled}
          />
        </FormFieldGroup>
      </FormRow>

      <FormFieldGroup>
        <FormLabel>Formas de pagamento aceitas</FormLabel>
        <PaymentMethodsGrid>
          {PAYMENT_METHOD_OPTIONS.map((opt) => (
            <CheckboxField key={opt.value}>
              <input
                type="checkbox"
                checked={content.paymentMethods.includes(opt.value)}
                onChange={() => togglePaymentMethod(opt.value)}
                disabled={disabled}
              />
              {opt.label}
            </CheckboxField>
          ))}
        </PaymentMethodsGrid>
      </FormFieldGroup>

      <FormFieldGroup>
        <FormLabel>Observacoes</FormLabel>
        <FormTextarea
          value={content.observations}
          onChange={(e) => onChange("observations", e.target.value)}
          placeholder="Observacoes adicionais do orcamento..."
          disabled={disabled}
        />
      </FormFieldGroup>

      <FormFieldGroup $error={Boolean(errors.patientAcknowledged)}>
        <CheckboxField>
          <input
            type="checkbox"
            checked={content.patientAcknowledged}
            onChange={(e) => onChange("patientAcknowledged", e.target.checked)}
            disabled={disabled}
          />
          Confirmo que o paciente foi informado e esta ciente dos valores e condicoes *
        </CheckboxField>
      </FormFieldGroup>
    </SectionCard>
  );
};

export default BudgetForm;
