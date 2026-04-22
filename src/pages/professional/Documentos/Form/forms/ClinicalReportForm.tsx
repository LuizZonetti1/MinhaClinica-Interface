import type { ClinicalReportContent } from "../../../../../types/clinical-document";
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

interface ClinicalReportFormProps {
  content: ClinicalReportContent;
  onChange: <K extends keyof ClinicalReportContent>(
    field: K,
    value: ClinicalReportContent[K],
  ) => void;
  errors: Partial<Record<keyof ClinicalReportContent, string>>;
  disabled?: boolean;
}

const ClinicalReportForm = ({ content, onChange, errors, disabled }: ClinicalReportFormProps) => (
  <SectionCard>
    <SectionTitle>Conteudo do Relatorio Clinico</SectionTitle>
    <SectionBanner>
      Documento narrativo de texto livre. Preencha cada secao com as informacoes relevantes do
      atendimento.
    </SectionBanner>

    <FormFieldGroup $error={Boolean(errors.anamnesis)}>
      <FormLabel>Queixa principal *</FormLabel>
      <FormSubLabel>O que o paciente relatou como motivo da consulta</FormSubLabel>
      <FormTextarea
        value={content.anamnesis}
        onChange={(e) => onChange("anamnesis", e.target.value)}
        placeholder="Ex: Dor lombar persistente ha 3 semanas, com piora ao levantar peso"
        disabled={disabled}
      />
    </FormFieldGroup>

    <FormFieldGroup>
      <FormLabel>Historico relevante</FormLabel>
      <FormSubLabel>
        Doencas previas, cirurgias, medicamentos em uso, antecedentes familiares
      </FormSubLabel>
      <FormTextarea
        value={content.history}
        onChange={(e) => onChange("history", e.target.value)}
        placeholder="Ex: Paciente nega comorbidades. Sem uso de medicamentos continuos..."
        disabled={disabled}
      />
    </FormFieldGroup>

    <FormFieldGroup>
      <FormLabel>Exame fisico / Avaliacao</FormLabel>
      <FormSubLabel>Achados do exame fisico ou avaliacao realizada</FormSubLabel>
      <FormTextarea
        value={content.physicalExam}
        onChange={(e) => onChange("physicalExam", e.target.value)}
        placeholder="Ex: Dor a palpacao na regiao lombar L4-L5..."
        disabled={disabled}
      />
    </FormFieldGroup>

    <FormFieldGroup>
      <FormLabel>Exames complementares</FormLabel>
      <FormSubLabel>Resultados de exames ja realizados, se houver</FormSubLabel>
      <FormTextarea
        value={content.complementaryExams}
        onChange={(e) => onChange("complementaryExams", e.target.value)}
        placeholder="Ex: RNM de coluna lombar: protrusao discal L4-L5"
        disabled={disabled}
      />
    </FormFieldGroup>

    <FormRow>
      <FormFieldGroup $error={Boolean(errors.diagnosis)}>
        <FormLabel>Hipotese diagnostica</FormLabel>
        <FormTextarea
          value={content.diagnosis}
          onChange={(e) => onChange("diagnosis", e.target.value)}
          placeholder="Ex: Lombalgia cronica"
          disabled={disabled}
        />
      </FormFieldGroup>

      <FormFieldGroup>
        <FormLabel>CID-10</FormLabel>
        <FormInput
          value={content.cid}
          onChange={(e) => onChange("cid", e.target.value)}
          placeholder="Ex: M54.5"
          disabled={disabled}
        />
      </FormFieldGroup>
    </FormRow>

    <FormFieldGroup $error={Boolean(errors.treatment)}>
      <FormLabel>Conduta adotada *</FormLabel>
      <FormSubLabel>Tratamento prescrito, orientacoes e encaminhamentos</FormSubLabel>
      <FormTextarea
        value={content.treatment}
        onChange={(e) => onChange("treatment", e.target.value)}
        placeholder="Ex: Prescrito anti-inflamatorio por 7 dias, encaminhado para fisioterapia"
        disabled={disabled}
      />
    </FormFieldGroup>

    <FormFieldGroup>
      <FormLabel>Prognostico</FormLabel>
      <FormSubLabel>Previsao de evolucao do quadro</FormSubLabel>
      <FormTextarea
        value={content.prognosis}
        onChange={(e) => onChange("prognosis", e.target.value)}
        placeholder="Ex: Bom prognostico com tratamento adequado"
        disabled={disabled}
      />
    </FormFieldGroup>
  </SectionCard>
);

export default ClinicalReportForm;
