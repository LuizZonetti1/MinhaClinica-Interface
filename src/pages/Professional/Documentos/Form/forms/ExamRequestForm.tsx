import type { ExamItem, ExamRequestContent } from "../../../../../types/clinical-document";
import DynamicList from "../components/DynamicList";
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

interface ExamRequestFormProps {
  content: ExamRequestContent;
  onChange: <K extends keyof ExamRequestContent>(field: K, value: ExamRequestContent[K]) => void;
  errors: Partial<Record<string, string>>;
  disabled?: boolean;
}

const EMPTY_EXAM: ExamItem = { name: "", code: "", instructions: "" };

const ExamRequestForm = ({ content, onChange, errors, disabled }: ExamRequestFormProps) => {
  const updateExam = (index: number, field: keyof ExamItem, value: string) => {
    const updated = content.exams.map((exam, i) =>
      i === index ? { ...exam, [field]: value } : exam,
    );
    onChange("exams", updated);
  };

  const addExam = () => {
    onChange("exams", [...content.exams, { ...EMPTY_EXAM }]);
  };

  const removeExam = (index: number) => {
    onChange(
      "exams",
      content.exams.filter((_, i) => i !== index),
    );
  };

  return (
    <SectionCard>
      <SectionTitle>Conteudo da Solicitacao de Exame</SectionTitle>
      <SectionBanner>
        Solicitacao de exames. Adicione todos os exames necessarios e informe a indicacao clinica.
      </SectionBanner>

      <DynamicList
        items={content.exams}
        onAdd={addExam}
        onRemove={removeExam}
        addLabel="Adicionar exame"
        itemLabel="Exame"
        disabled={disabled}
        renderItem={(exam, index) => (
          <>
            <FormRow>
              <FormFieldGroup>
                <FormLabel>Nome do exame *</FormLabel>
                <FormInput
                  value={exam.name}
                  onChange={(e) => updateExam(index, "name", e.target.value)}
                  placeholder="Ex: Hemograma completo"
                  disabled={disabled}
                />
              </FormFieldGroup>

              <FormFieldGroup>
                <FormLabel>Codigo</FormLabel>
                <FormInput
                  value={exam.code}
                  onChange={(e) => updateExam(index, "code", e.target.value)}
                  placeholder="Ex: HEMOGRAMA"
                  disabled={disabled}
                />
              </FormFieldGroup>
            </FormRow>

            <FormFieldGroup>
              <FormLabel>Instrucoes de preparo</FormLabel>
              <FormInput
                value={exam.instructions}
                onChange={(e) => updateExam(index, "instructions", e.target.value)}
                placeholder="Ex: Jejum de 8 horas"
                disabled={disabled}
              />
            </FormFieldGroup>
          </>
        )}
      />

      <FormFieldGroup $error={Boolean(errors.clinicalIndication)}>
        <FormLabel>Indicacao clinica *</FormLabel>
        <FormSubLabel>Justificativa medica para solicitacao dos exames</FormSubLabel>
        <FormTextarea
          value={content.clinicalIndication}
          onChange={(e) => onChange("clinicalIndication", e.target.value)}
          placeholder="Ex: Investigacao de anemia ferropriva"
          disabled={disabled}
        />
      </FormFieldGroup>

      <FormRow>
        <FormFieldGroup>
          <FormLabel>CID-10</FormLabel>
          <FormInput
            value={content.cid}
            onChange={(e) => onChange("cid", e.target.value)}
            placeholder="Ex: D50.9"
            disabled={disabled}
          />
        </FormFieldGroup>

        <FormFieldGroup>
          <FormLabel>Carater</FormLabel>
          <FormSelect
            value={content.urgency}
            onChange={(e) => onChange("urgency", e.target.value)}
            disabled={disabled}
          >
            <option value="">Selecione...</option>
            <option value="ROUTINE">Rotina</option>
            <option value="URGENT">Urgente</option>
          </FormSelect>
        </FormFieldGroup>
      </FormRow>
    </SectionCard>
  );
};

export default ExamRequestForm;
