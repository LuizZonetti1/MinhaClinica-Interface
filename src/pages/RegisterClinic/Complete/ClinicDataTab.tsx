import { Building2, Globe, Hash, Phone } from "lucide-react";
import { Input } from "../../../components/Input";
import { handleEnterNavigation } from "../../../utils/enterNavigation";
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

interface ClinicDataTabProps {
  formData: {
    legalName: string;
    tradeName: string;
    cnpj: string;
    phone: string;
    website: string;
  };
  onChange: (field: string, value: string) => void;
}

export const ClinicDataTab = ({ formData, onChange }: ClinicDataTabProps) => {
  return (
    <FieldGroup>
      <Input
        label="Razão social *"
        type="text"
        placeholder="Nome jurídico da clínica"
        value={formData.legalName}
        onChange={(e) => onChange("legalName", e.target.value)}
        onKeyDown={handleEnterNavigation}
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
        onKeyDown={handleEnterNavigation}
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
          onKeyDown={handleEnterNavigation}
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
          onKeyDown={handleEnterNavigation}
          icon={<Phone />}
          fullWidth
          required
        />
      </Row>

      <Input
        label="Website"
        type="url"
        placeholder="https://www.suaclinica.com.br"
        value={formData.website}
        onChange={(e) => onChange("website", e.target.value)}
        onKeyDown={handleEnterNavigation}
        icon={<Globe />}
        fullWidth
      />
    </FieldGroup>
  );
};
