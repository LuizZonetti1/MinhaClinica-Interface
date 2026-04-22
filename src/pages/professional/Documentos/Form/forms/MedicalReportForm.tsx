import type { MedicalReportContent } from "../../../../../types/clinical-document";
import {
  FormFieldGroup,
  FormInput,
  FormLabel,
  FormRow,
  FormSubLabel,
  FormTextarea,
  SectionBanner,
  SectionCard,
  SectionTitle,
} from "../styles";

interface MedicalReportFormProps {
  content: MedicalReportContent;
  onChange: <K extends keyof MedicalReportContent>(
    field: K,
    value: MedicalReportContent[K],
  ) => void;
  errors: Partial<Record<keyof MedicalReportContent, string>>;
  disabled?: boolean;
}

const MedicalReportForm = ({ content, onChange, errors, disabled }: MedicalReportFormProps) => (
  <SectionCard>
    <SectionTitle>Conteudo do Laudo</SectionTitle>
    <SectionBanner>
      Documento formal com conclusao pericial. A secao de Conclusao e obrigatoria e destacada no
      documento final.
    </SectionBanner>

    <FormRow>
      <FormFieldGroup $error={Boolean(errors.purpose)}>
        <FormLabel>Finalidade do laudo *</FormLabel>
        <FormInput
          value={content.purpose}
          onChange={(e) => onChange("purpose", e.target.value)}
          placeholder="Ex: Fins previdenciarios, Seguro de vida"
          disabled={disabled}
        />
      </FormFieldGroup>

      <FormFieldGroup $error={Boolean(errors.examType)}>
        <FormLabel>Tipo de exame / procedimento *</FormLabel>
        <FormInput
          value={content.examType}
          onChange={(e) => onChange("examType", e.target.value)}
          placeholder="Ex: Ressonancia magnetica de joelho"
          disabled={disabled}
        />
      </FormFieldGroup>
    </FormRow>

    <FormFieldGroup>
      <FormLabel>Data do exame realizado</FormLabel>
      <FormInput
        type="date"
        value={content.examDate}
        onChange={(e) => onChange("examDate", e.target.value)}
        disabled={disabled}
      />
    </FormFieldGroup>

    <FormFieldGroup $error={Boolean(errors.findings)}>
      <FormLabel>Historico e achados clinicos *</FormLabel>
      <FormTextarea
        value={content.findings}
        onChange={(e) => onChange("findings", e.target.value)}
        placeholder="Descricao dos achados clinicos e exames realizados..."
        disabled={disabled}
      />
    </FormFieldGroup>

    <FormFieldGroup $error={Boolean(errors.conclusion)}>
      <FormLabel>Conclusao *</FormLabel>
      <FormSubLabel>
        Parte obrigatoria e destacada no documento — seja preciso e objetivo
      </FormSubLabel>
      <FormTextarea
        $highlighted
        value={content.conclusion}
        onChange={(e) => onChange("conclusion", e.target.value)}
        placeholder="Conclusao do laudo..."
        disabled={disabled}
      />
    </FormFieldGroup>

    <FormFieldGroup>
      <FormLabel>CID-10</FormLabel>
      <FormInput
        value={content.cid}
        onChange={(e) => onChange("cid", e.target.value)}
        placeholder="Ex: M23.5"
        disabled={disabled}
      />
    </FormFieldGroup>
  </SectionCard>
);

export default MedicalReportForm;
