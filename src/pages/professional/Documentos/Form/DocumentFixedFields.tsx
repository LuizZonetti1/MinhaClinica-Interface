import type {
  ClinicalDocumentStatus,
  DocumentAppointmentContext,
} from "../../../../types/clinical-document";
import { formatIsoDateToBr } from "../../../../utils/dateParsers";
import {
  FormFieldGroup,
  FormLabel,
  FormSubLabel,
  FormTextarea,
  ReadonlyField,
  ReadonlyFieldsGrid,
  ReadonlyLabel,
  ReadonlyValue,
  SectionCard,
  SectionTitle,
  StatusBadge,
} from "./styles";

interface DocumentFixedFieldsProps {
  appointmentContext: DocumentAppointmentContext;
  status: ClinicalDocumentStatus;
  internalNotes: string;
  onInternalNotesChange: (value: string) => void;
  disabled?: boolean;
  onBlurAutosave?: () => void;
}

const DocumentFixedFields = ({
  appointmentContext,
  status,
  internalNotes,
  onInternalNotesChange,
  disabled,
  onBlurAutosave,
}: DocumentFixedFieldsProps) => {
  const docStatus = status.toUpperCase();
  const statusVariant =
    docStatus === "FINALIZED"
      ? "finalized"
      : docStatus === "SENT"
        ? "finalized"
        : docStatus === "ADDENDUM"
          ? "finalized"
          : "draft";
  const statusLabel =
    docStatus === "FINALIZED"
      ? "Finalizado"
      : docStatus === "SENT"
        ? "Enviado"
        : docStatus === "ADDENDUM"
          ? "Adendo"
          : "Rascunho";

  return (
    <SectionCard>
      <SectionTitle>Dados da Consulta</SectionTitle>

      <ReadonlyFieldsGrid>
        <ReadonlyField>
          <ReadonlyLabel>Paciente</ReadonlyLabel>
          <ReadonlyValue title="Preenchido automaticamente pela consulta">
            {appointmentContext.patientName}
          </ReadonlyValue>
        </ReadonlyField>

        <ReadonlyField>
          <ReadonlyLabel>Profissional responsavel</ReadonlyLabel>
          <ReadonlyValue title="Preenchido automaticamente pela consulta">
            {appointmentContext.professionalName}
          </ReadonlyValue>
        </ReadonlyField>

        <ReadonlyField>
          <ReadonlyLabel>Registro do conselho</ReadonlyLabel>
          <ReadonlyValue title="Preenchido automaticamente pela consulta">
            {appointmentContext.councilRegistration || "—"}
          </ReadonlyValue>
        </ReadonlyField>

        <ReadonlyField>
          <ReadonlyLabel>Data de emissao</ReadonlyLabel>
          <ReadonlyValue title="Preenchido automaticamente pela consulta">
            {formatIsoDateToBr(appointmentContext.appointmentDate)}
          </ReadonlyValue>
        </ReadonlyField>

        <ReadonlyField>
          <ReadonlyLabel>Hora</ReadonlyLabel>
          <ReadonlyValue title="Preenchido automaticamente pela consulta">
            {appointmentContext.startTime}
          </ReadonlyValue>
        </ReadonlyField>

        <ReadonlyField>
          <ReadonlyLabel>Status</ReadonlyLabel>
          <div>
            <StatusBadge $variant={statusVariant}>{statusLabel}</StatusBadge>
          </div>
        </ReadonlyField>
      </ReadonlyFieldsGrid>

      <FormFieldGroup>
        <FormLabel>Observacoes internas</FormLabel>
        <FormSubLabel>Notas internas que nao aparecem no documento impresso</FormSubLabel>
        <FormTextarea
          value={internalNotes}
          onChange={(e) => onInternalNotesChange(e.target.value)}
          onBlur={onBlurAutosave}
          placeholder="Anotacoes internas sobre este documento..."
          disabled={disabled}
          rows={3}
        />
      </FormFieldGroup>
    </SectionCard>
  );
};

export default DocumentFixedFields;
