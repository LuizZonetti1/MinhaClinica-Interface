import { Phone } from "lucide-react";
import { Input } from "../../../components/Input";
import { EmergencyBox, EmergencyTitle, FieldGroup, Label, Row, Select } from "./styles";

interface MedicalInfoTabProps {
  formData: any;
  onChange: (field: string, value: string) => void;
}

const maskPhone = (value: string) =>
  value
    .replace(/\D/g, "")
    .slice(0, 11)
    .replace(/(\d{2})(\d)/, "($1) $2")
    .replace(/(\d{5})(\d{1,4})$/, "$1-$2");

export const MedicalInfoTab = ({ formData, onChange }: MedicalInfoTabProps) => {
  return (
    <FieldGroup>
      <FieldGroup>
        <Label>Tipo Sanguíneo</Label>
        <Select value={formData.bloodType} onChange={(e) => onChange("bloodType", e.target.value)}>
          <option value="">Selecione</option>
          <option value="A+">A+</option>
          <option value="A-">A-</option>
          <option value="B+">B+</option>
          <option value="B-">B-</option>
          <option value="AB+">AB+</option>
          <option value="AB-">AB-</option>
          <option value="O+">O+</option>
          <option value="O-">O-</option>
        </Select>
      </FieldGroup>

      <Input
        label="Alergias conhecidas"
        type="text"
        placeholder="Ex: penicilina, látex, dipirona... (ou 'Nenhuma')"
        value={formData.allergies}
        onChange={(e) => onChange("allergies", e.target.value)}
        fullWidth
      />

      <Input
        label="Medicamentos em uso contínuo"
        type="text"
        placeholder="Ex: Losartana 50mg, Metformina... (ou 'Nenhum')"
        value={formData.medications}
        onChange={(e) => onChange("medications", e.target.value)}
        fullWidth
      />

      <Input
        label="Condições médicas pré-existentes"
        type="text"
        placeholder="Ex: diabetes, hipertensão, asma... (ou 'Nenhuma')"
        value={formData.conditions}
        onChange={(e) => onChange("conditions", e.target.value)}
        fullWidth
      />

      <EmergencyBox>
        <EmergencyTitle>Contato de Emergência</EmergencyTitle>
        <Row>
          <Input
            label="Nome e parentesco"
            type="text"
            placeholder="Ex: João Silva — Pai"
            value={formData.emergencyName}
            onChange={(e) => onChange("emergencyName", e.target.value)}
            fullWidth
          />

          <Input
            label="Telefone de emergência"
            type="tel"
            placeholder="(00) 00000-0000"
            value={formData.emergencyPhone}
            onChange={(e) => onChange("emergencyPhone", maskPhone(e.target.value))}
            icon={<Phone />}
            fullWidth
          />
        </Row>
      </EmergencyBox>
    </FieldGroup>
  );
};
