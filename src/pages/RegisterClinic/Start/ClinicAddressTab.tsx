import { Loader2, MapPin } from "lucide-react";
import { useEffect, useState } from "react";
import { Input } from "../../../components/Input";
import { fetchCep } from "../../../utils/fetchCep";
import { FieldGroup, Label, Row, Select } from "./styles";

const maskCEP = (value: string) =>
  value
    .replace(/\D/g, "")
    .slice(0, 8)
    .replace(/(\d{5})(\d{1,3})$/, "$1-$2");

interface ClinicAddressTabProps {
  formData: {
    zipCode: string;
    street: string;
    number: string;
    complement: string;
    neighborhood: string;
    city: string;
    state: string;
  };
  onChange: (field: string, value: string) => void;
}

export const ClinicAddressTab = ({ formData, onChange }: ClinicAddressTabProps) => {
  const [loadingCep, setLoadingCep] = useState(false);

  useEffect(() => {
    const digits = formData.zipCode.replace(/\D/g, "");
    if (digits.length !== 8) return;

    let cancelled = false;
    setLoadingCep(true);
    fetchCep(digits).then((address) => {
      if (cancelled || !address) return;
      if (address.street) onChange("street", address.street);
      if (address.neighborhood) onChange("neighborhood", address.neighborhood);
      if (address.city) onChange("city", address.city);
      if (address.state) onChange("state", address.state);
    }).finally(() => {
      if (!cancelled) setLoadingCep(false);
    });

    return () => { cancelled = true; };
  }, [formData.zipCode]);

  return (
    <FieldGroup>
      <Input
        label="CEP *"
        type="text"
        placeholder="00000-000"
        value={formData.zipCode}
        onChange={(e) => onChange("zipCode", maskCEP(e.target.value))}
        icon={loadingCep ? <Loader2 size={16} className="animate-spin" /> : <MapPin />}
        fullWidth
        required
      />

      <Input
        label="Logradouro (Rua / Av.) *"
        type="text"
        placeholder="Rua, Avenida..."
        value={formData.street}
        onChange={(e) => onChange("street", e.target.value)}
        disabled={loadingCep}
        fullWidth
        required
      />

      <Row>
        <Input
          label="Número *"
          type="text"
          placeholder="123"
          value={formData.number}
          onChange={(e) => onChange("number", e.target.value)}
          fullWidth
          required
        />

        <Input
          label="Complemento"
          type="text"
          placeholder="Sala, Andar, Bloco..."
          value={formData.complement}
          onChange={(e) => onChange("complement", e.target.value)}
          fullWidth
        />
      </Row>

      <Input
        label="Bairro *"
        type="text"
        placeholder="Nome do bairro"
        value={formData.neighborhood}
        onChange={(e) => onChange("neighborhood", e.target.value)}
        disabled={loadingCep}
        fullWidth
        required
      />

      <Row>
        <Input
          label="Cidade *"
          type="text"
          placeholder="São Paulo"
          value={formData.city}
          onChange={(e) => onChange("city", e.target.value)}
          disabled={loadingCep}
          fullWidth
          required
        />

        <FieldGroup>
          <Label>Estado (UF) *</Label>
          <Select
            value={formData.state}
            onChange={(e) => onChange("state", e.target.value)}
            required
          >
            <option value="">Selecione</option>
            <option value="AC">AC</option>
            <option value="AL">AL</option>
            <option value="AP">AP</option>
            <option value="AM">AM</option>
            <option value="BA">BA</option>
            <option value="CE">CE</option>
            <option value="DF">DF</option>
            <option value="ES">ES</option>
            <option value="GO">GO</option>
            <option value="MA">MA</option>
            <option value="MT">MT</option>
            <option value="MS">MS</option>
            <option value="MG">MG</option>
            <option value="PA">PA</option>
            <option value="PB">PB</option>
            <option value="PR">PR</option>
            <option value="PE">PE</option>
            <option value="PI">PI</option>
            <option value="RJ">RJ</option>
            <option value="RN">RN</option>
            <option value="RS">RS</option>
            <option value="RO">RO</option>
            <option value="RR">RR</option>
            <option value="SC">SC</option>
            <option value="SP">SP</option>
            <option value="SE">SE</option>
            <option value="TO">TO</option>
          </Select>
        </FieldGroup>
      </Row>
    </FieldGroup>
  );
};
