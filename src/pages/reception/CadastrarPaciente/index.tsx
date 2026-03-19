import type { ChangeEvent, FormEvent } from "react";
import { useState } from "react";
import { useNavigate } from "react-router";
import { Button } from "../../../components/Button";
import { Input } from "../../../components/Input";
import { registerPatientByReception } from "../../../services/reception.service";
import type { BloodType, Gender, RegisterPatientByReceptionPayload } from "../../../types/patient";
import { maskPhoneInput } from "../../../utils/formatters";
import { getApiErrorMessage } from "../../../utils/getApiErrorMessage";
import { notifySuccess, notifyError } from "../../../utils/toast";
import {
  FieldBlock,
  FieldError,
  FieldLabel,
  FormActions,
  FormCard,
  FormDivider,
  FormGrid,
  FormSection,
  FormSelect,
  FormTextarea,
  FullWidthCell,
  PageTitle,
  PageWrapper,
  SectionOptionalTag,
  SectionTitle,
} from "./styles";

// ─── Static options ───────────────────────────────────────────────────────────

const GENDER_OPTIONS: { value: Gender; label: string }[] = [
  { value: "MALE", label: "Masculino" },
  { value: "FEMALE", label: "Feminino" },
  { value: "OTHER", label: "Outro" },
  { value: "PREFER_NOT_TO_SAY", label: "Prefiro não informar" },
];

const BLOOD_TYPE_OPTIONS: BloodType[] = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

// ─── Masking helpers ──────────────────────────────────────────────────────────

const maskCPF = (v: string) => {
  const d = v.replace(/\D/g, "").slice(0, 11);
  if (d.length <= 3) return d;
  if (d.length <= 6) return `${d.slice(0, 3)}.${d.slice(3)}`;
  if (d.length <= 9) return `${d.slice(0, 3)}.${d.slice(3, 6)}.${d.slice(6)}`;
  return `${d.slice(0, 3)}.${d.slice(3, 6)}.${d.slice(6, 9)}-${d.slice(9)}`;
};

const maskZipCode = (v: string) => {
  const d = v.replace(/\D/g, "").slice(0, 8);
  if (d.length <= 5) return d;
  return `${d.slice(0, 5)}-${d.slice(5)}`;
};

// ─── Form state ───────────────────────────────────────────────────────────────

interface FormState {
  name: string;
  email: string;
  cpf: string;
  phone: string;
  dateOfBirth: string;
  gender: string;
  rg: string;
  zipCode: string;
  street: string;
  number: string;
  complement: string;
  neighborhood: string;
  city: string;
  state: string;
  alternativePhone: string;
  bloodType: string;
  allergies: string;
  medications: string;
  conditions: string;
  observations: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
}

const INITIAL: FormState = {
  name: "", email: "", cpf: "", phone: "", dateOfBirth: "", gender: "",
  rg: "", zipCode: "", street: "", number: "", complement: "",
  neighborhood: "", city: "", state: "", alternativePhone: "", bloodType: "",
  allergies: "", medications: "", conditions: "", observations: "",
  emergencyContactName: "", emergencyContactPhone: "",
};

type FormErrors = Partial<Record<keyof FormState, string>>;

// ─── Validation ───────────────────────────────────────────────────────────────

const validate = (form: FormState): FormErrors => {
  const errors: FormErrors = {};

  if (!form.name.trim() || form.name.trim().length < 3)
    errors.name = "Nome deve ter ao menos 3 caracteres";

  if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim()))
    errors.email = "E-mail inválido";

  if (!form.cpf.trim())
    errors.cpf = "CPF obrigatorio";

  const phoneDigits = form.phone.replace(/\D/g, "");
  if (!phoneDigits || phoneDigits.length < 10 || phoneDigits.length > 11)
    errors.phone = "Telefone inválido (10 ou 11 dígitos)";

  if (!form.dateOfBirth)
    errors.dateOfBirth = "Data de nascimento obrigatória";

  if (!form.gender)
    errors.gender = "Gênero obrigatório";

  if (form.state && form.state.trim().length > 0 && form.state.trim().length !== 2)
    errors.state = "Use a sigla do estado (ex: SP)";

  return errors;
};

// ─── Payload builder ──────────────────────────────────────────────────────────

const buildPayload = (form: FormState): RegisterPatientByReceptionPayload => {
  const opt = (v: string): string | null => v.trim() || null;
  return {
    name: form.name.trim(),
    email: form.email.trim(),
    cpf: form.cpf,
    phone: form.phone,
    dateOfBirth: form.dateOfBirth,
    gender: form.gender as Gender,
    rg: opt(form.rg),
    zipCode: opt(form.zipCode),
    street: opt(form.street),
    number: opt(form.number),
    complement: opt(form.complement),
    neighborhood: opt(form.neighborhood),
    city: opt(form.city),
    state: opt(form.state)?.toUpperCase() ?? null,
    alternativePhone: opt(form.alternativePhone),
    bloodType: (opt(form.bloodType) as BloodType | null),
    allergies: opt(form.allergies),
    medications: opt(form.medications),
    conditions: opt(form.conditions),
    observations: opt(form.observations),
    emergencyContactName: opt(form.emergencyContactName),
    emergencyContactPhone: opt(form.emergencyContactPhone),
  };
};

// ─── Component ────────────────────────────────────────────────────────────────

const ReceptionCadastrarPacientePage = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState<FormState>(INITIAL);
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);

  const set = (field: keyof FormState, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const handlePhone = (e: ChangeEvent<HTMLInputElement>) =>
    set("phone", maskPhoneInput(e.target.value));

  const handleAltPhone = (e: ChangeEvent<HTMLInputElement>) =>
    set("alternativePhone", maskPhoneInput(e.target.value));

  const handleEmergencyPhone = (e: ChangeEvent<HTMLInputElement>) =>
    set("emergencyContactPhone", maskPhoneInput(e.target.value));

  const handleCPF = (e: ChangeEvent<HTMLInputElement>) =>
    set("cpf", maskCPF(e.target.value));

  const handleZipCode = (e: ChangeEvent<HTMLInputElement>) =>
    set("zipCode", maskZipCode(e.target.value));

  const handleState = (e: ChangeEvent<HTMLInputElement>) =>
    set("state", e.target.value.replace(/[^a-zA-Z]/g, "").slice(0, 2).toUpperCase());

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const errs = validate(form);
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setLoading(true);
    try {
      await registerPatientByReception(buildPayload(form));
      notifySuccess("Paciente cadastrado com sucesso!");
      navigate("/recepcao/dashboard");
    } catch (err) {
      notifyError(getApiErrorMessage(err, "Erro ao cadastrar paciente."));
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageWrapper>
      <PageTitle>Cadastrar Novo Paciente</PageTitle>

      <FormCard as="form" onSubmit={handleSubmit} noValidate>

        {/* ── Dados Pessoais ──────────────────────────────────────────── */}
        <FormSection>
          <SectionTitle>Dados Pessoais</SectionTitle>
          <FormGrid>
            <FullWidthCell>
              <Input
                label="Nome Completo *"
                placeholder="Nome completo do paciente"
                value={form.name}
                onChange={(e) => set("name", e.target.value)}
                error={errors.name}
                fullWidth
              />
            </FullWidthCell>

            <Input
              label="E-mail *"
              type="email"
              placeholder="email@exemplo.com"
              value={form.email}
              onChange={(e) => set("email", e.target.value)}
              error={errors.email}
              fullWidth
            />
            <Input
              label="Telefone *"
              placeholder="(00) 00000-0000"
              value={form.phone}
              onChange={handlePhone}
              error={errors.phone}
              fullWidth
            />

            <Input
              label="Data de Nascimento *"
              type="date"
              value={form.dateOfBirth}
              onChange={(e) => set("dateOfBirth", e.target.value)}
              error={errors.dateOfBirth}
              fullWidth
            />
            <Input
              label="CPF *"
              placeholder="000.000.000-00"
              value={form.cpf}
              onChange={handleCPF}
              error={errors.cpf}
              fullWidth
            />

            <FieldBlock>
              <FieldLabel>Gênero *</FieldLabel>
              <FormSelect
                value={form.gender}
                $hasError={!!errors.gender}
                onChange={(e) => set("gender", e.target.value)}
              >
                <option value="">Selecione...</option>
                {GENDER_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </FormSelect>
              {errors.gender && <FieldError>{errors.gender}</FieldError>}
            </FieldBlock>

            <Input
              label="RG"
              placeholder="00.000.000-0"
              value={form.rg}
              onChange={(e) => set("rg", e.target.value)}
              fullWidth
            />
          </FormGrid>
        </FormSection>

        <FormDivider />

        {/* ── Endereço ────────────────────────────────────────────────── */}
        <FormSection>
          <SectionTitle>
            Endereço <SectionOptionalTag>(Opcional)</SectionOptionalTag>
          </SectionTitle>
          <FormGrid>
            <Input
              label="CEP"
              placeholder="00000-000"
              value={form.zipCode}
              onChange={handleZipCode}
              fullWidth
            />
            <Input
              label="Estado (UF)"
              placeholder="SP"
              value={form.state}
              onChange={handleState}
              error={errors.state}
              fullWidth
            />

            <Input
              label="Rua / Logradouro"
              placeholder="Av. Paulista"
              value={form.street}
              onChange={(e) => set("street", e.target.value)}
              fullWidth
            />
            <Input
              label="Número"
              placeholder="1578"
              value={form.number}
              onChange={(e) => set("number", e.target.value)}
              fullWidth
            />

            <Input
              label="Complemento"
              placeholder="Apto 42"
              value={form.complement}
              onChange={(e) => set("complement", e.target.value)}
              fullWidth
            />
            <Input
              label="Bairro"
              placeholder="Bela Vista"
              value={form.neighborhood}
              onChange={(e) => set("neighborhood", e.target.value)}
              fullWidth
            />

            <FullWidthCell>
              <Input
                label="Cidade"
                placeholder="São Paulo"
                value={form.city}
                onChange={(e) => set("city", e.target.value)}
                fullWidth
              />
            </FullWidthCell>
          </FormGrid>
        </FormSection>

        <FormDivider />

        {/* ── Informações de Saúde ─────────────────────────────────────── */}
        <FormSection>
          <SectionTitle>
            Informações de Saúde <SectionOptionalTag>(Opcional)</SectionOptionalTag>
          </SectionTitle>
          <FormGrid>
            <FieldBlock>
              <FieldLabel>Tipo Sanguíneo</FieldLabel>
              <FormSelect
                value={form.bloodType}
                onChange={(e) => set("bloodType", e.target.value)}
              >
                <option value="">Selecione...</option>
                {BLOOD_TYPE_OPTIONS.map((bt) => (
                  <option key={bt} value={bt}>{bt}</option>
                ))}
              </FormSelect>
            </FieldBlock>

            <Input
              label="Telefone Alternativo"
              placeholder="(00) 00000-0000"
              value={form.alternativePhone}
              onChange={handleAltPhone}
              fullWidth
            />

            <FieldBlock>
              <FieldLabel>Alergias</FieldLabel>
              <FormTextarea
                placeholder="Liste as alergias conhecidas..."
                value={form.allergies}
                onChange={(e) => set("allergies", e.target.value)}
              />
            </FieldBlock>

            <FieldBlock>
              <FieldLabel>Medicamentos em Uso</FieldLabel>
              <FormTextarea
                placeholder="Liste os medicamentos em uso..."
                value={form.medications}
                onChange={(e) => set("medications", e.target.value)}
              />
            </FieldBlock>

            <FieldBlock>
              <FieldLabel>Condições / Diagnósticos</FieldLabel>
              <FormTextarea
                placeholder="Ex: Hipertensão, Diabetes..."
                value={form.conditions}
                onChange={(e) => set("conditions", e.target.value)}
              />
            </FieldBlock>

            <FieldBlock>
              <FieldLabel>Observações</FieldLabel>
              <FormTextarea
                placeholder="Informações adicionais relevantes..."
                value={form.observations}
                onChange={(e) => set("observations", e.target.value)}
              />
            </FieldBlock>
          </FormGrid>
        </FormSection>

        <FormDivider />

        {/* ── Contato de Emergência ────────────────────────────────────── */}
        <FormSection>
          <SectionTitle>
            Contato de Emergência <SectionOptionalTag>(Opcional)</SectionOptionalTag>
          </SectionTitle>
          <FormGrid>
            <Input
              label="Nome do Contato"
              placeholder="Maria da Silva"
              value={form.emergencyContactName}
              onChange={(e) => set("emergencyContactName", e.target.value)}
              fullWidth
            />
            <Input
              label="Telefone do Contato"
              placeholder="(00) 00000-0000"
              value={form.emergencyContactPhone}
              onChange={handleEmergencyPhone}
              fullWidth
            />
          </FormGrid>
        </FormSection>

        {/* ── Ações ───────────────────────────────────────────────────── */}
        <FormActions>
          <Button
            variant="outline"
            type="button"
            onClick={() => navigate(-1)}
            disabled={loading}
          >
            Cancelar
          </Button>
          <Button variant="primary" type="submit" disabled={loading}>
            {loading ? "Cadastrando..." : "Cadastrar Paciente"}
          </Button>
        </FormActions>

      </FormCard>
    </PageWrapper>
  );
};

export default ReceptionCadastrarPacientePage;

