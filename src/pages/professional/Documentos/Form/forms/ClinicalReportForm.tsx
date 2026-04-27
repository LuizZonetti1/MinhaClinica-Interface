import { Plus, X } from "lucide-react";
import { useRef, useState } from "react";
import styled from "styled-components";
import type { ClinicalReportContent } from "../../../../../types/clinical-document";
import { theme } from "../../../../../themes/themes";
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

// ─── TagListInput ─────────────────────────────────────────────────────────────

const TagWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const TagInputRow = styled.div`
  display: flex;
  gap: 8px;
`;

const TagTextInput = styled.input`
  flex: 1;
  font-family: "Roboto", sans-serif;
  font-size: 14px;
  color: ${theme.colors.text.primary};
  background: ${theme.colors.surface};
  border: 1px solid ${theme.colors.border.light};
  border-radius: 8px;
  padding: 8px 12px;
  outline: none;

  &:focus {
    border-color: ${theme.colors.border.default};
  }

  &::placeholder {
    color: ${theme.colors.text.muted};
  }

  &:disabled {
    background: ${theme.colors.surfaceMuted};
    cursor: not-allowed;
  }
`;

const TagAddButton = styled.button`
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 8px 14px;
  border-radius: 8px;
  border: 1px solid ${theme.colors.border.default};
  background: ${theme.colors.surface};
  color: ${theme.colors.text.secondary};
  font-family: "Roboto", sans-serif;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  white-space: nowrap;

  &:hover:not(:disabled) {
    background: ${theme.colors.surfaceMuted};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const TagItemList = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const TagItem = styled.li`
  display: flex;
  align-items: flex-start;
  gap: 8px;
  padding: 8px 12px;
  background: ${theme.colors.surfaceMuted};
  border: 1px solid ${theme.colors.border.light};
  border-radius: 8px;
  font-family: "Roboto", sans-serif;
  font-size: 14px;
  color: ${theme.colors.text.primary};
  line-height: 1.5;
`;

const TagItemText = styled.span`
  flex: 1;
`;

const TagRemoveButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 20px;
  height: 20px;
  border-radius: 4px;
  border: none;
  background: transparent;
  color: ${theme.colors.text.muted};
  cursor: pointer;
  padding: 0;
  margin-top: 1px;

  &:hover:not(:disabled) {
    background: #fee2e2;
    color: #dc2626;
  }

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
`;

interface TagListInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

const TagListInput = ({ value, onChange, placeholder, disabled }: TagListInputProps) => {
  const [input, setInput] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const items = value ? value.split("\n").filter((s) => s.trim() !== "") : [];

  const addItem = () => {
    const trimmed = input.trim();
    if (!trimmed) return;
    onChange([...items, trimmed].join("\n"));
    setInput("");
    inputRef.current?.focus();
  };

  const removeItem = (index: number) => {
    onChange(items.filter((_, i) => i !== index).join("\n"));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addItem();
    }
  };

  return (
    <TagWrapper>
      <TagInputRow>
        <TagTextInput
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
        />
        <TagAddButton type="button" onClick={addItem} disabled={disabled || !input.trim()}>
          <Plus size={14} />
          Adicionar
        </TagAddButton>
      </TagInputRow>

      {items.length > 0 && (
        <TagItemList>
          {items.map((item, index) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: lista sem ID estável
            <TagItem key={index}>
              <TagItemText>{item}</TagItemText>
              <TagRemoveButton
                type="button"
                title="Remover"
                onClick={() => removeItem(index)}
                disabled={disabled}
              >
                <X size={12} />
              </TagRemoveButton>
            </TagItem>
          ))}
        </TagItemList>
      )}
    </TagWrapper>
  );
};

// ─── ClinicalReportForm ───────────────────────────────────────────────────────

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
      <TagListInput
        value={content.complementaryExams}
        onChange={(val) => onChange("complementaryExams", val)}
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
      <TagListInput
        value={content.treatment}
        onChange={(val) => onChange("treatment", val)}
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
