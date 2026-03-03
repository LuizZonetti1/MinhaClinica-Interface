import { Building2, Globe, Hash, Mail, Phone } from "lucide-react";
import { Input } from "../../../components/Input";
import { FieldGroup, Row } from "./styles";

const maskCNPJ = (value: string) =>
  value
    .replace(/\D/g, "")
    .slice(0, 14)
    .replace(/(\d{2})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1/$2")
    .replace(/(\d{4})(\d{1,2})$/, "$1-$2");

const maskPhone = (value: string) =>
  value
    .replace(/\D/g, "")
    .slice(0, 11)
    .replace(/(\d{2})(\d)/, "($1) $2")
    .replace(/(\d{5})(\d{1,4})$/, "$1-$2");

interface ClinicInfoTabProps {
  formData: {
    legalName: string;
    tradeName: string;
    cnpj: string;
    phone: string;
    email: string;
    website: string;
  };
  onChange: (field: string, value: string) => void;
}

export const ClinicInfoTab = ({ formData, onChange }: ClinicInfoTabProps) => {
  return (
    <FieldGroup>
      <Input
        label="Razão social *"
        type="text"
        placeholder="Nome jurídico da clínica"
        value={formData.legalName}
        onChange={(e) => onChange("legalName", e.target.value)}
        icon={<Building2 />}
        fullWidth
        required
      />

      <Input
        label="Nome fantasia *"
        type="text"
        placeholder="Nome pelo qual a clínica é conhecida"
        value={formData.tradeName}
        onChange={(e) => onChange("tradeName", e.target.value)}
        icon={<Building2 />}
        fullWidth
        required
      />

      <Row>
        <Input
          label="CNPJ *"
          type="text"
          placeholder="00.000.000/0000-00"
          value={formData.cnpj}
          onChange={(e) => onChange("cnpj", maskCNPJ(e.target.value))}
          icon={<Hash />}
          fullWidth
          required
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

      <Input
        label="E-mail da clínica *"
        type="email"
        placeholder="contato@suaclinica.com.br"
        value={formData.email}
        onChange={(e) => onChange("email", e.target.value)}
        icon={<Mail />}
        fullWidth
        required
      />

      <Input
        label="Website"
        type="url"
        placeholder="https://www.suaclinica.com.br"
        value={formData.website}
        onChange={(e) => onChange("website", e.target.value)}
        icon={<Globe />}
        fullWidth
      />
    </FieldGroup>
  );
};
