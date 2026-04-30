import type { ConsentFormContent } from "../../../../../types/clinical-document";
import {
  CheckboxField,
  FormFieldGroup,
  FormInput,
  FormLabel,
  FormSubLabel,
  FormTextarea,
  SectionBanner,
  SectionCard,
  SectionTitle,
} from "../styles";

interface ConsentFormFormProps {
  content: ConsentFormContent;
  onChange: <K extends keyof ConsentFormContent>(field: K, value: ConsentFormContent[K]) => void;
  errors: Partial<Record<keyof ConsentFormContent, string>>;
  disabled?: boolean;
}

const ConsentFormForm = ({ content, onChange, errors, disabled }: ConsentFormFormProps) => (
  <SectionCard>
    <SectionTitle>Conteudo do Termo de Consentimento</SectionTitle>
    <SectionBanner>
      Documento juridico. Requer linguagem acessivel ao paciente. A confirmacao de ciencia do
      paciente e obrigatoria antes de finalizar.
    </SectionBanner>

    <FormFieldGroup $error={Boolean(errors.procedureName)}>
      <FormLabel>Nome do procedimento *</FormLabel>
      <FormInput
        value={content.procedureName}
        onChange={(e) => onChange("procedureName", e.target.value)}
        placeholder="Ex: Extracao de terceiro molar"
        disabled={disabled}
      />
    </FormFieldGroup>

    <FormFieldGroup $error={Boolean(errors.procedureDescription)}>
      <FormLabel>Descricao do procedimento *</FormLabel>
      <FormSubLabel>
        Use linguagem clara e acessivel — evite termos tecnicos excessivos
      </FormSubLabel>
      <FormTextarea
        value={content.procedureDescription}
        onChange={(e) => onChange("procedureDescription", e.target.value)}
        placeholder="Descreva o procedimento de forma clara para o paciente..."
        disabled={disabled}
      />
    </FormFieldGroup>

    <FormFieldGroup $error={Boolean(errors.risks)}>
      <FormLabel>Riscos *</FormLabel>
      <FormTextarea
        value={content.risks}
        onChange={(e) => onChange("risks", e.target.value)}
        placeholder="Ex: Infeccao, sangramento, reacao anestesica"
        disabled={disabled}
      />
    </FormFieldGroup>

    <FormFieldGroup $error={Boolean(errors.benefits)}>
      <FormLabel>Beneficios *</FormLabel>
      <FormTextarea
        value={content.benefits}
        onChange={(e) => onChange("benefits", e.target.value)}
        placeholder="Beneficios esperados do procedimento..."
        disabled={disabled}
      />
    </FormFieldGroup>

    <FormFieldGroup>
      <FormLabel>Alternativas ao tratamento</FormLabel>
      <FormTextarea
        value={content.alternatives}
        onChange={(e) => onChange("alternatives", e.target.value)}
        placeholder="Opcoes alternativas ao tratamento proposto..."
        disabled={disabled}
      />
    </FormFieldGroup>

    <FormFieldGroup>
      <FormLabel>Nome da testemunha</FormLabel>
      <FormInput
        value={content.witnessName}
        onChange={(e) => onChange("witnessName", e.target.value)}
        placeholder="Nome completo da testemunha (opcional)"
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
        Confirmo que o paciente foi informado e expressou consentimento ao tratamento *
      </CheckboxField>
    </FormFieldGroup>
  </SectionCard>
);

export default ConsentFormForm;
