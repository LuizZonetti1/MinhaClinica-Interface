import { Calendar, Eye, EyeOff, Lock, Phone, User } from "lucide-react";
import { useState } from "react";
import { Input } from "../../../components/Input";
import { FieldGroup, Label, RadioButton, RadioGroup, RequirementsText, Row } from "./styles";

interface PersonalDataTabProps {
  formData: {
    cpf: string;
    phone: string;
    password: string;
    confirmPassword: string;
    birthDate: string;
    gender: string;
  };
  onChange: (field: string, value: string) => void;
  cpfError?: string;
  showRequirementsHint?: boolean;
}

const maskCPF = (value: string) =>
  value
    .replace(/\D/g, "")
    .slice(0, 11)
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})$/, "$1-$2");

const maskPhone = (value: string) =>
  value
    .replace(/\D/g, "")
    .slice(0, 11)
    .replace(/(\d{2})(\d)/, "($1) $2")
    .replace(/(\d{5})(\d{1,4})$/, "$1-$2");

export const PersonalDataTab = ({
  formData,
  onChange,
  cpfError,
  showRequirementsHint = false,
}: PersonalDataTabProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <FieldGroup>
      <Row>
        <Input
          label="CPF *"
          type="text"
          placeholder="000.000.000-00"
          value={formData.cpf}
          onChange={(e) => onChange("cpf", maskCPF(e.target.value))}
          icon={<User />}
          fullWidth
          required
          error={cpfError}
        />

        <Input
          label="Telefone *"
          type="tel"
          placeholder="(00) 00000-0000"
          value={formData.phone}
          onChange={(e) => onChange("phone", maskPhone(e.target.value))}
          icon={<Phone />}
          fullWidth
          required
        />
      </Row>

      <Row>
        <Input
          label="Senha *"
          type={showPassword ? "text" : "password"}
          placeholder="Crie sua senha"
          value={formData.password}
          onChange={(e) => onChange("password", e.target.value)}
          icon={<Lock />}
          rightIcon={showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          onRightIconClick={() => setShowPassword((previous) => !previous)}
          fullWidth
          required
        />

        <Input
          label="Confirmar Senha *"
          type={showConfirmPassword ? "text" : "password"}
          placeholder="Repita a senha"
          value={formData.confirmPassword}
          onChange={(e) => onChange("confirmPassword", e.target.value)}
          icon={<Lock />}
          rightIcon={showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          onRightIconClick={() => setShowConfirmPassword((previous) => !previous)}
          fullWidth
          required
        />
      </Row>

      {showRequirementsHint && (
        <RequirementsText>
          Para avancar: CPF com 11 digitos, telefone com 10 ou 11 digitos, senha com no minimo 6
          caracteres (maiuscula, minuscula e numero) e confirmacao igual.
        </RequirementsText>
      )}

      <Input
        label="Data de Nascimento *"
        type="date"
        value={formData.birthDate}
        onChange={(e) => onChange("birthDate", e.target.value)}
        icon={<Calendar />}
        fullWidth
        required
      />

      <div>
        <Label>Gênero *</Label>
        <RadioGroup>
          <RadioButton $checked={formData.gender === "masculino"}>
            <input
              type="radio"
              name="gender"
              value="masculino"
              checked={formData.gender === "masculino"}
              onChange={(e) => onChange("gender", e.target.value)}
            />
            Masculino
          </RadioButton>

          <RadioButton $checked={formData.gender === "feminino"}>
            <input
              type="radio"
              name="gender"
              value="feminino"
              checked={formData.gender === "feminino"}
              onChange={(e) => onChange("gender", e.target.value)}
            />
            Feminino
          </RadioButton>

          <RadioButton $checked={formData.gender === "outro"}>
            <input
              type="radio"
              name="gender"
              value="outro"
              checked={formData.gender === "outro"}
              onChange={(e) => onChange("gender", e.target.value)}
            />
            Outro
          </RadioButton>

          <RadioButton $checked={formData.gender === "nao-informar"}>
            <input
              type="radio"
              name="gender"
              value="nao-informar"
              checked={formData.gender === "nao-informar"}
              onChange={(e) => onChange("gender", e.target.value)}
            />
            Prefiro não informar
          </RadioButton>
        </RadioGroup>
      </div>
    </FieldGroup>
  );
};
