import type { ReferralContent } from "../../../../../types/clinical-document";
import {
  FormFieldGroup,
  FormInput,
  FormLabel,
  FormRow,
  FormSelect,
  FormSubLabel,
  FormTextarea,
  SectionBanner,
  SectionCard,
  SectionTitle,
} from "../styles";

interface ReferralFormProps {
  content: ReferralContent;
  onChange: <K extends keyof ReferralContent>(field: K, value: ReferralContent[K]) => void;
  errors: Partial<Record<keyof ReferralContent, string>>;
  disabled?: boolean;
}

const ReferralForm = ({ content, onChange, errors, disabled }: ReferralFormProps) => (
  <SectionCard>
    <SectionTitle>Conteudo do Encaminhamento</SectionTitle>
    <SectionBanner>Encaminhamento para outro profissional ou especialidade.</SectionBanner>

    <FormRow>
      <FormFieldGroup $error={Boolean(errors.referredTo)}>
        <FormLabel>Especialidade de destino *</FormLabel>
        <FormInput
          value={content.referredTo}
          onChange={(e) => onChange("referredTo", e.target.value)}
          placeholder="Ex: Cardiologia, Ortopedia, Fisioterapia"
          disabled={disabled}
        />
      </FormFieldGroup>

      <FormFieldGroup>
        <FormLabel>Profissional de destino</FormLabel>
        <FormInput
          value={content.targetProfessional}
          onChange={(e) => onChange("targetProfessional", e.target.value)}
          placeholder="Ex: Dr. Carlos Melo"
          disabled={disabled}
        />
      </FormFieldGroup>
    </FormRow>

    <FormFieldGroup $error={Boolean(errors.reason)}>
      <FormLabel>Motivo do encaminhamento *</FormLabel>
      <FormSubLabel>Resumo clinico e justificativa do encaminhamento</FormSubLabel>
      <FormTextarea
        value={content.reason}
        onChange={(e) => onChange("reason", e.target.value)}
        placeholder="Ex: Paciente com dor toracica atipica, necessita avaliacao cardiologica"
        disabled={disabled}
      />
    </FormFieldGroup>

    <FormFieldGroup>
      <FormLabel>Historico clinico</FormLabel>
      <FormTextarea
        value={content.clinicalHistory}
        onChange={(e) => onChange("clinicalHistory", e.target.value)}
        placeholder="Historico relevante do paciente..."
        disabled={disabled}
      />
    </FormFieldGroup>

    <FormRow>
      <FormFieldGroup>
        <FormLabel>CID-10</FormLabel>
        <FormInput
          value={content.cid}
          onChange={(e) => onChange("cid", e.target.value)}
          placeholder="Ex: I20.0"
          disabled={disabled}
        />
      </FormFieldGroup>

      <FormFieldGroup $error={Boolean(errors.urgency)}>
        <FormLabel>Carater *</FormLabel>
        <FormSelect
          value={content.urgency}
          onChange={(e) => onChange("urgency", e.target.value)}
          disabled={disabled}
        >
          <option value="">Selecione...</option>
          <option value="ELECTIVE">Eletivo</option>
          <option value="URGENT">Urgente</option>
          <option value="EMERGENCY">Emergencia</option>
        </FormSelect>
      </FormFieldGroup>
    </FormRow>
  </SectionCard>
);

export default ReferralForm;
