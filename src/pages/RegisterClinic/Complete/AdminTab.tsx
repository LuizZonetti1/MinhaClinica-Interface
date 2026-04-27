import { Calendar, Lock, Phone, User } from "lucide-react";
import { Input } from "../../../components/Input";
import { maskCPF } from "../../../utils/formatters";
import { FieldGroup, Label, RadioButton, RadioGroup, RequirementsText, Row } from "./styles";

const PASSWORD_REQUIREMENTS_TEXT =
  "Senha com no minimo 6 caracteres, incluindo letra maiuscula, minuscula e numero.";

const maskPhone = (value: string) =>
  value
    .replace(/\D/g, "")
    .slice(0, 11)
    .replace(/(\d{2})(\d)/, "($1) $2")
    .replace(/(\d{5})(\d{1,4})$/, "$1-$2");

interface AdminTabProps {
  formData: {
    adminCpf: string;
    adminPhone: string;
    adminPassword: string;
    adminConfirmPassword: string;
    adminBirthDate: string;
    adminGender: string;
  };
  onChange: (field: string, value: string) => void;
  cpfError?: string;
  fieldErrors?: Record<string, string>;
}

export const AdminTab = ({ formData, onChange, cpfError, fieldErrors = {} }: AdminTabProps) => {
  return (
    <FieldGroup>
      <Row>
        <Input
          label="CPF do responsável *"
          type="text"
          placeholder="000.000.000-00"
          value={formData.adminCpf}
          onChange={(e) => onChange("adminCpf", maskCPF(e.target.value))}
          icon={<User />}
          fullWidth
          required
          error={cpfError ?? fieldErrors.adminCpf}
        />

        <Input
          label="Telefone pessoal *"
          type="tel"
          placeholder="(00) 00000-0000"
          value={formData.adminPhone}
          onChange={(e) => onChange("adminPhone", maskPhone(e.target.value))}
          icon={<Phone />}
          fullWidth
          required
          error={fieldErrors.adminPhone}
        />
      </Row>

      <Row>
        <Input
          label="Senha *"
          type="password"
          placeholder="Crie sua senha"
          value={formData.adminPassword}
          onChange={(e) => onChange("adminPassword", e.target.value)}
          icon={<Lock />}
          fullWidth
          required
          error={fieldErrors.adminPassword}
        />

        <Input
          label="Confirmar Senha *"
          type="password"
          placeholder="Repita a senha"
          value={formData.adminConfirmPassword}
          onChange={(e) => onChange("adminConfirmPassword", e.target.value)}
          icon={<Lock />}
          fullWidth
          required
          error={fieldErrors.adminConfirmPassword}
        />
      </Row>

      <RequirementsText>
        Para concluir: CPF, telefone e data de nascimento obrigatorios, genero selecionado e{" "}
        {PASSWORD_REQUIREMENTS_TEXT.toLowerCase()} A confirmacao deve ser igual a senha.
      </RequirementsText>

      <Input
        label="Data de nascimento *"
        type="date"
        value={formData.adminBirthDate}
        onChange={(e) => onChange("adminBirthDate", e.target.value)}
        icon={<Calendar />}
        fullWidth
        required
        error={fieldErrors.adminBirthDate}
      />

      <div>
        <Label>Gênero *</Label>
        {fieldErrors.adminGender && (
          <p style={{ color: "#e53e3e", fontSize: 12, margin: "2px 0 6px" }}>
            {fieldErrors.adminGender}
          </p>
        )}
        <RadioGroup>
          <RadioButton $checked={formData.adminGender === "MALE"}>
            <input
              type="radio"
              name="adminGender"
              value="MALE"
              checked={formData.adminGender === "MALE"}
              onChange={(e) => onChange("adminGender", e.target.value)}
            />
            Masculino
          </RadioButton>

          <RadioButton $checked={formData.adminGender === "FEMALE"}>
            <input
              type="radio"
              name="adminGender"
              value="FEMALE"
              checked={formData.adminGender === "FEMALE"}
              onChange={(e) => onChange("adminGender", e.target.value)}
            />
            Feminino
          </RadioButton>

          <RadioButton $checked={formData.adminGender === "OTHER"}>
            <input
              type="radio"
              name="adminGender"
              value="OTHER"
              checked={formData.adminGender === "OTHER"}
              onChange={(e) => onChange("adminGender", e.target.value)}
            />
            Outro
          </RadioButton>

          <RadioButton $checked={formData.adminGender === "PREFER_NOT_TO_SAY"}>
            <input
              type="radio"
              name="adminGender"
              value="PREFER_NOT_TO_SAY"
              checked={formData.adminGender === "PREFER_NOT_TO_SAY"}
              onChange={(e) => onChange("adminGender", e.target.value)}
            />
            Prefiro não informar
          </RadioButton>
        </RadioGroup>
      </div>
    </FieldGroup>
  );
};
