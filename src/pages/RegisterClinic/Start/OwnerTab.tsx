import { Mail, User } from "lucide-react";
import { Input } from "../../../components/Input";
import { FieldGroup } from "./styles";

interface OwnerTabProps {
  formData: {
    ownerName: string;
    ownerEmail: string;
  };
  onChange: (field: string, value: string) => void;
}

export const OwnerTab = ({ formData, onChange }: OwnerTabProps) => {
  return (
    <FieldGroup>
      <Input
        label="Nome completo do responsável *"
        type="text"
        placeholder="Nome completo do administrador da clínica"
        value={formData.ownerName}
        onChange={(e) => onChange("ownerName", e.target.value)}
        icon={<User />}
        fullWidth
        required
      />

      <Input
        label="E-mail do responsável *"
        type="email"
        placeholder="responsavel@suaclinica.com.br"
        value={formData.ownerEmail}
        onChange={(e) => onChange("ownerEmail", e.target.value)}
        icon={<Mail />}
        fullWidth
        required
      />

      <p style={{ fontSize: 13, color: "#6b7280", margin: 0, lineHeight: 1.5 }}>
        Um link de verificação será enviado para este e-mail após o envio.
      </p>
    </FieldGroup>
  );
};
