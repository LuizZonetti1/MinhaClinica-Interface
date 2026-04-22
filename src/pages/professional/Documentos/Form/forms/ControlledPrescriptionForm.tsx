import type {
  ControlledPrescriptionContent,
  MedicationItem,
} from "../../../../../types/clinical-document";
import DynamicList from "../components/DynamicList";
import MedicationItemFields from "../components/MedicationItemFields";
import {
  FormFieldGroup,
  FormInput,
  FormLabel,
  FormTextarea,
  SectionBanner,
  SectionCard,
  SectionTitle,
} from "../styles";

interface ControlledPrescriptionFormProps {
  content: ControlledPrescriptionContent;
  onChange: <K extends keyof ControlledPrescriptionContent>(
    field: K,
    value: ControlledPrescriptionContent[K],
  ) => void;
  errors: Partial<Record<string, string>>;
  disabled?: boolean;
}

const EMPTY_MEDICATION: MedicationItem = {
  name: "",
  dosage: "",
  frequency: "",
  duration: "",
  instructions: "",
  quantity: "",
};

const ControlledPrescriptionForm = ({
  content,
  onChange,
  errors,
  disabled,
}: ControlledPrescriptionFormProps) => {
  const updateMedication = (index: number, field: keyof MedicationItem, value: string) => {
    const updated = content.medications.map((med, i) =>
      i === index ? { ...med, [field]: value } : med,
    );
    onChange("medications", updated);
  };

  const addMedication = () => {
    onChange("medications", [...content.medications, { ...EMPTY_MEDICATION }]);
  };

  const removeMedication = (index: number) => {
    onChange(
      "medications",
      content.medications.filter((_, i) => i !== index),
    );
  };

  return (
    <SectionCard>
      <SectionTitle>Conteudo da Receita de Controle Especial</SectionTitle>
      <SectionBanner $variant="amber">
        RECEITA DE CONTROLE ESPECIAL — Siga rigorosamente as exigencias da ANVISA. Este documento
        exige dados completos do paciente.
      </SectionBanner>

      <FormFieldGroup $error={Boolean(errors.patientAddress)}>
        <FormLabel>Endereco completo do paciente *</FormLabel>
        <FormTextarea
          value={content.patientAddress}
          onChange={(e) => onChange("patientAddress", e.target.value)}
          placeholder="Rua, numero, bairro, cidade, estado, CEP"
          disabled={disabled}
          rows={2}
        />
      </FormFieldGroup>

      <FormFieldGroup $error={Boolean(errors.notificationNumber)}>
        <FormLabel>Numero de notificacao *</FormLabel>
        <FormInput
          value={content.notificationNumber}
          onChange={(e) => onChange("notificationNumber", e.target.value)}
          placeholder="Ex: A-SP-0012345"
          disabled={disabled}
        />
      </FormFieldGroup>

      <DynamicList
        items={content.medications}
        onAdd={addMedication}
        onRemove={removeMedication}
        addLabel="Adicionar medicamento"
        itemLabel="Medicamento"
        disabled={disabled}
        renderItem={(med, index) => (
          <MedicationItemFields
            medication={med}
            onChange={(field, value) => updateMedication(index, field, value)}
            showQuantity
            disabled={disabled}
          />
        )}
      />
    </SectionCard>
  );
};

export default ControlledPrescriptionForm;
