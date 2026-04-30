import { Plus, Trash2 } from "lucide-react";
import type {
  InterventionItem,
  InterventionType,
  TreatmentPlanContent,
} from "../../../../../types/clinical-document";
import DynamicList from "../components/DynamicList";
import {
  DynamicListAddButton,
  DynamicListContainer,
  DynamicListItem,
  DynamicListItemHeader,
  DynamicListItemNumber,
  DynamicListRemoveBtn,
  FormFieldGroup,
  FormInput,
  FormLabel,
  FormRow,
  FormSelect,
  SectionBanner,
  SectionCard,
  SectionTitle,
} from "../styles";

interface TreatmentPlanFormProps {
  content: TreatmentPlanContent;
  onChange: <K extends keyof TreatmentPlanContent>(
    field: K,
    value: TreatmentPlanContent[K],
  ) => void;
  errors: Partial<Record<string, string>>;
  disabled?: boolean;
}

const EMPTY_INTERVENTION: InterventionItem = { type: "", description: "" };

const INTERVENTION_TYPE_LABELS: Record<InterventionType, string> = {
  MEDICATION: "Medicacao",
  LIFESTYLE: "Estilo de vida",
  MONITORING: "Monitoramento",
  PHYSIOTHERAPY: "Fisioterapia",
  PROCEDURE: "Procedimento",
};

const TreatmentPlanForm = ({ content, onChange, errors, disabled }: TreatmentPlanFormProps) => {
  // Goals
  const addGoal = () => {
    onChange("goals", [...content.goals, ""]);
  };

  const removeGoal = (index: number) => {
    onChange(
      "goals",
      content.goals.filter((_, i) => i !== index),
    );
  };

  const updateGoal = (index: number, value: string) => {
    const updated = content.goals.map((g, i) => (i === index ? value : g));
    onChange("goals", updated);
  };

  // Interventions
  const addIntervention = () => {
    onChange("interventions", [...content.interventions, { ...EMPTY_INTERVENTION }]);
  };

  const removeIntervention = (index: number) => {
    onChange(
      "interventions",
      content.interventions.filter((_, i) => i !== index),
    );
  };

  const updateIntervention = (index: number, field: keyof InterventionItem, value: string) => {
    const updated = content.interventions.map((item, i) =>
      i === index ? { ...item, [field]: value } : item,
    );
    onChange("interventions", updated);
  };

  // Follow-up interval
  const intervalDays = content.followUpIntervalDays ?? "";

  return (
    <SectionCard>
      <SectionTitle>Conteudo do Plano de Tratamento</SectionTitle>
      <SectionBanner>
        Planejamento estruturado do tratamento. Obrigatorio para fisioterapia (COFFITO) e amplamente
        utilizado em odontologia.
      </SectionBanner>

      <FormRow>
        <FormFieldGroup $error={Boolean(errors.diagnosis)}>
          <FormLabel>Diagnostico *</FormLabel>
          <FormInput
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

      {/* Goals — simple string list */}
      <FormFieldGroup>
        <FormLabel>Objetivos do tratamento</FormLabel>
        <DynamicListContainer>
          {content.goals.map((goal, index) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: strings sem ID estável
            <DynamicListItem key={`goal-${index}`}>
              <DynamicListItemHeader>
                <DynamicListItemNumber>Objetivo {index + 1}</DynamicListItemNumber>
                {content.goals.length > 0 && (
                  <DynamicListRemoveBtn
                    type="button"
                    onClick={() => removeGoal(index)}
                    disabled={disabled}
                  >
                    <Trash2 size={14} />
                  </DynamicListRemoveBtn>
                )}
              </DynamicListItemHeader>
              <FormInput
                value={goal}
                onChange={(e) => updateGoal(index, e.target.value)}
                placeholder="Ex: Reducao da dor em 50% em 4 semanas"
                disabled={disabled}
              />
            </DynamicListItem>
          ))}
          <DynamicListAddButton type="button" onClick={addGoal} disabled={disabled}>
            <Plus size={14} />
            Adicionar objetivo
          </DynamicListAddButton>
        </DynamicListContainer>
      </FormFieldGroup>

      {/* Interventions */}
      <FormFieldGroup>
        <FormLabel>Intervencoes planejadas</FormLabel>
        <DynamicList
          items={content.interventions}
          onAdd={addIntervention}
          onRemove={removeIntervention}
          addLabel="Adicionar intervencao"
          itemLabel="Intervencao"
          minItems={0}
          disabled={disabled}
          renderItem={(item, index) => (
            <FormRow>
              <FormFieldGroup>
                <FormLabel>Tipo</FormLabel>
                <FormSelect
                  value={item.type}
                  onChange={(e) => updateIntervention(index, "type", e.target.value)}
                  disabled={disabled}
                >
                  <option value="">Selecione...</option>
                  {(Object.keys(INTERVENTION_TYPE_LABELS) as InterventionType[]).map((key) => (
                    <option key={key} value={key}>
                      {INTERVENTION_TYPE_LABELS[key]}
                    </option>
                  ))}
                </FormSelect>
              </FormFieldGroup>

              <FormFieldGroup>
                <FormLabel>Descricao *</FormLabel>
                <FormInput
                  value={item.description}
                  onChange={(e) => updateIntervention(index, "description", e.target.value)}
                  placeholder="Ex: Exercicios de fortalecimento lombar"
                  disabled={disabled}
                />
              </FormFieldGroup>
            </FormRow>
          )}
        />
      </FormFieldGroup>

      <FormFieldGroup>
        <FormLabel>Intervalo de retorno (dias)</FormLabel>
        <FormInput
          type="number"
          min={1}
          value={intervalDays}
          onChange={(e) =>
            onChange("followUpIntervalDays", e.target.value === "" ? null : Number(e.target.value))
          }
          placeholder="Ex: 30"
          disabled={disabled}
        />
      </FormFieldGroup>
    </SectionCard>
  );
};

export default TreatmentPlanForm;
