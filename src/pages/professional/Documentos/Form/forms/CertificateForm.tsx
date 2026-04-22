import { useMemo } from "react";
import type { CertificateContent } from "../../../../../types/clinical-document";
import {
  FormFieldGroup,
  FormInput,
  FormLabel,
  FormRow,
  FormRow3Col,
  FormSelect,
  FormSubLabel,
  FormTextarea,
  SectionBanner,
  SectionCard,
  SectionTitle,
} from "../styles";

interface CertificateFormProps {
  content: CertificateContent;
  onChange: <K extends keyof CertificateContent>(field: K, value: CertificateContent[K]) => void;
  errors: Partial<Record<keyof CertificateContent, string>>;
  disabled?: boolean;
}

const addDays = (dateStr: string, days: number): string => {
  if (!dateStr || !days) return "";
  const date = new Date(`${dateStr}T12:00:00`);
  date.setDate(date.getDate() + days - 1);
  return date.toISOString().slice(0, 10);
};

const CertificateForm = ({ content, onChange, errors, disabled }: CertificateFormProps) => {
  const handleDaysChange = (value: string) => {
    const days = value === "" ? null : Number(value);
    onChange("daysOfRest", days);
    if (days && days > 0 && content.startDate) {
      onChange("endDate", addDays(content.startDate, days));
    }
  };

  const handleStartDateChange = (value: string) => {
    onChange("startDate", value);
    if (content.daysOfRest && content.daysOfRest > 0 && value) {
      onChange("endDate", addDays(value, content.daysOfRest));
    }
  };

  const daysValue = useMemo(
    () => (content.daysOfRest !== null ? String(content.daysOfRest) : ""),
    [content.daysOfRest],
  );

  return (
    <SectionCard>
      <SectionTitle>Conteudo do Atestado</SectionTitle>
      <SectionBanner>
        Documento legal de afastamento. O CID e opcional — o paciente pode recusar sua inclusao.
      </SectionBanner>

      <FormRow3Col>
        <FormFieldGroup $error={Boolean(errors.daysOfRest)}>
          <FormLabel>Dias de afastamento *</FormLabel>
          <FormInput
            type="number"
            min={1}
            value={daysValue}
            onChange={(e) => handleDaysChange(e.target.value)}
            placeholder="Ex: 3"
            disabled={disabled}
          />
        </FormFieldGroup>

        <FormFieldGroup $error={Boolean(errors.startDate)}>
          <FormLabel>Data de inicio *</FormLabel>
          <FormInput
            type="date"
            value={content.startDate}
            onChange={(e) => handleStartDateChange(e.target.value)}
            disabled={disabled}
          />
        </FormFieldGroup>

        <FormFieldGroup $error={Boolean(errors.endDate)}>
          <FormLabel>Data de termino *</FormLabel>
          <FormInput
            type="date"
            value={content.endDate}
            onChange={(e) => onChange("endDate", e.target.value)}
            disabled={disabled}
          />
        </FormFieldGroup>
      </FormRow3Col>

      <FormRow>
        <FormFieldGroup>
          <FormLabel>CID-10</FormLabel>
          <FormSubLabel>Opcional — inclusao depende do consentimento do paciente</FormSubLabel>
          <FormInput
            value={content.cid}
            onChange={(e) => onChange("cid", e.target.value)}
            placeholder="Ex: J06.9"
            disabled={disabled}
          />
        </FormFieldGroup>

        <FormFieldGroup>
          <FormLabel>Descricao do diagnostico</FormLabel>
          <FormSubLabel>Descricao que aparecera no documento</FormSubLabel>
          <FormInput
            value={content.diagnosisDescription}
            onChange={(e) => onChange("diagnosisDescription", e.target.value)}
            placeholder="Ex: Infeccao aguda das vias aereas superiores"
            disabled={disabled}
          />
        </FormFieldGroup>
      </FormRow>

      <FormFieldGroup>
        <FormLabel>Finalidade</FormLabel>
        <FormSelect
          value={content.purpose}
          onChange={(e) => onChange("purpose", e.target.value)}
          disabled={disabled}
        >
          <option value="">Selecione...</option>
          <option value="WORK">Trabalho</option>
          <option value="SCHOOL">Escola</option>
          <option value="SOCIAL_SECURITY">Previdencia Social</option>
          <option value="OTHER">Outros</option>
        </FormSelect>
      </FormFieldGroup>

      <FormFieldGroup>
        <FormLabel>Observacoes</FormLabel>
        <FormTextarea
          value={content.observations}
          onChange={(e) => onChange("observations", e.target.value)}
          placeholder="Observacoes adicionais..."
          disabled={disabled}
        />
      </FormFieldGroup>
    </SectionCard>
  );
};

export default CertificateForm;
