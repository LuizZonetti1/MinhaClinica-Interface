import { Phone } from "lucide-react";
import { Input } from "../../../components/Input";
import { EmergencyBox, EmergencyTitle, FieldGroup, Row, Select } from "./styles";

interface MedicalInfoTabProps {
  formData: any;
  onChange: (field: string, value: string) => void;
}

export const MedicalInfoTab = ({ formData, onChange }: MedicalInfoTabProps) => {
  return (
    <FieldGroup>
      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        <label
          style={{ fontFamily: "Roboto", fontSize: "14px", fontWeight: 500, color: "#4B5563" }}
        >
          Tipo Sanguíneo
        </label>
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
      </div>

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
            onChange={(e) => onChange("emergencyPhone", e.target.value)}
            icon={<Phone />}
            fullWidth
          />
        </Row>
      </EmergencyBox>
    </FieldGroup>
  );
};
