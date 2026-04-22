import type { MedicationItem, PrescriptionContent } from "../../../../../types/clinical-document";
import DynamicList from "../components/DynamicList";
import MedicationItemFields from "../components/MedicationItemFields";
import { SectionBanner, SectionCard, SectionTitle } from "../styles";

interface PrescriptionFormProps {
  content: PrescriptionContent;
  onChange: <K extends keyof PrescriptionContent>(field: K, value: PrescriptionContent[K]) => void;
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

const PrescriptionForm = ({
  content,
  onChange,
  errors: _errors,
  disabled,
}: PrescriptionFormProps) => {
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
      <SectionTitle>Conteudo da Receita</SectionTitle>
      <SectionBanner>
        Prescricao de medicamentos. Adicione um ou mais itens. Duas vias serao geradas na impressao.
      </SectionBanner>

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
            disabled={disabled}
          />
        )}
      />
    </SectionCard>
  );
};

export default PrescriptionForm;
