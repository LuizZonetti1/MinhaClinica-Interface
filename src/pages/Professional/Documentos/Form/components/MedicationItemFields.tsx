import type { MedicationItem } from "../../../../../types/clinical-document";
import { FormFieldGroup, FormInput, FormLabel, FormRow, FormRow3Col } from "../styles";

interface MedicationItemFieldsProps {
  medication: MedicationItem;
  onChange: (field: keyof MedicationItem, value: string) => void;
  showQuantity?: boolean;
  disabled?: boolean;
}

const MedicationItemFields = ({
  medication,
  onChange,
  showQuantity,
  disabled,
}: MedicationItemFieldsProps) => (
  <>
    <FormRow>
      <FormFieldGroup>
        <FormLabel>Nome do medicamento *</FormLabel>
        <FormInput
          value={medication.name}
          onChange={(e) => onChange("name", e.target.value)}
          placeholder="Ex: Amoxicilina 500mg"
          disabled={disabled}
        />
      </FormFieldGroup>

      <FormFieldGroup>
        <FormLabel>Dosagem *</FormLabel>
        <FormInput
          value={medication.dosage}
          onChange={(e) => onChange("dosage", e.target.value)}
          placeholder="Ex: 1 comprimido, 500mg"
          disabled={disabled}
        />
      </FormFieldGroup>
    </FormRow>

    <FormRow3Col>
      <FormFieldGroup>
        <FormLabel>Frequencia *</FormLabel>
        <FormInput
          value={medication.frequency}
          onChange={(e) => onChange("frequency", e.target.value)}
          placeholder="Ex: a cada 8 horas"
          disabled={disabled}
        />
      </FormFieldGroup>

      <FormFieldGroup>
        <FormLabel>Duracao *</FormLabel>
        <FormInput
          value={medication.duration}
          onChange={(e) => onChange("duration", e.target.value)}
          placeholder="Ex: 7 dias, uso continuo"
          disabled={disabled}
        />
      </FormFieldGroup>

      {showQuantity && (
        <FormFieldGroup>
          <FormLabel>Quantidade total *</FormLabel>
          <FormInput
            value={medication.quantity}
            onChange={(e) => onChange("quantity", e.target.value)}
            placeholder="Ex: 30 comprimidos"
            disabled={disabled}
          />
        </FormFieldGroup>
      )}
    </FormRow3Col>

    <FormFieldGroup>
      <FormLabel>Instrucoes de uso</FormLabel>
      <FormInput
        value={medication.instructions}
        onChange={(e) => onChange("instructions", e.target.value)}
        placeholder="Ex: Tomar durante as refeicoes"
        disabled={disabled}
      />
    </FormFieldGroup>
  </>
);

export default MedicationItemFields;
