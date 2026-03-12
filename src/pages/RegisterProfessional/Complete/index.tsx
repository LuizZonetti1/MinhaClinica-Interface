import { Clock3, Eye, EyeOff, Hash, IdCard, Lock, MapPin, Phone, Shield } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { AuthLayout } from "../../../components/AuthLayout";
import { Button } from "../../../components/Button";
import { Card } from "../../../components/Card";
import { Input } from "../../../components/Input";
import { Logo } from "../../../components/Logo";
import { Stepper } from "../../../components/Stepper";
import { useAuth } from "../../../contexts";
import { professionalRegisterComplete } from "../../../services/professional.service";
import { storeAuthToken } from "../../../utils/authStorage";
import { getApiErrorMessage } from "../../../utils/getApiErrorMessage";
import { notifyError, notifySuccess } from "../../../utils/toast";
import { stripCPF } from "../../../utils/validateCPF";
import { Container, Form, Row, Title } from "./styles";

type ProfessionalCompleteFormData = {
  cpf: string;
  phone: string;
  password: string;
  professionalCouncil: string;
  registrationNumber: string;
  registrationState: string;
  defaultAppointmentDuration: string;
};

const INITIAL_FORM_DATA: ProfessionalCompleteFormData = {
  cpf: "",
  phone: "",
  password: "",
  professionalCouncil: "",
  registrationNumber: "",
  registrationState: "",
  defaultAppointmentDuration: "30",
};

const onlyDigits = (value: string) => value.replace(/\D/g, "");

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

const maskRegistrationNumber = (value: string) =>
  value
    .replace(/\D/g, "")
    .slice(0, 20)
    .replace(/\B(?=(\d{3})+(?!\d))/g, ".");

const RegisterProfessionalComplete = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { setUser } = useAuth();

  const [formData, setFormData] = useState<ProfessionalCompleteFormData>(INITIAL_FORM_DATA);
  const [fieldErrors, setFieldErrors] = useState<
    Partial<Record<keyof ProfessionalCompleteFormData, string>>
  >({});
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const tempToken = searchParams.get("tempToken");
    if (tempToken) {
      storeAuthToken(tempToken);
    }
  }, [searchParams]);

  const steps = [
    { label: "Convite", status: "completed" as const },
    { label: "Verificacao", status: "completed" as const },
    { label: "Completar", status: "active" as const },
  ];

  const handleFieldChange = (
    field: keyof ProfessionalCompleteFormData,
    value: string,
  ): void => {
    let nextValue = value;

    if (field === "cpf") nextValue = maskCPF(value);
    if (field === "phone") nextValue = maskPhone(value);
    if (field === "professionalCouncil") {
      nextValue = value.replace(/[^a-zA-Z]/g, "").toUpperCase().slice(0, 10);
    }
    if (field === "registrationNumber") nextValue = maskRegistrationNumber(value);
    if (field === "registrationState") {
      nextValue = value.replace(/[^a-zA-Z]/g, "").toUpperCase().slice(0, 2);
    }
    if (field === "defaultAppointmentDuration") nextValue = onlyDigits(value).slice(0, 3);

    setFormData((prev) => ({ ...prev, [field]: nextValue }));
    setFieldErrors((prev) => {
      if (!prev[field]) return prev;
      const next = { ...prev };
      delete next[field];
      return next;
    });
  };

  const validate = (): Partial<Record<keyof ProfessionalCompleteFormData, string>> => {
    const errors: Partial<Record<keyof ProfessionalCompleteFormData, string>> = {};
    const cpfDigits = onlyDigits(formData.cpf);
    const phoneDigits = onlyDigits(formData.phone);
    const registrationDigits = onlyDigits(formData.registrationNumber);

    if (cpfDigits.length !== 11) errors.cpf = "CPF deve ter 11 digitos.";
    if (phoneDigits.length < 10 || phoneDigits.length > 11) {
      errors.phone = "Telefone deve ter 10 ou 11 digitos.";
    }
    if (formData.password.trim().length < 6) errors.password = "Senha minima de 6 caracteres.";
    if (!formData.professionalCouncil.trim()) {
      errors.professionalCouncil = "Informe o conselho profissional.";
    }
    if (!registrationDigits) {
      errors.registrationNumber = "Informe o numero do registro.";
    }
    if (!/^[A-Z]{2}$/.test(formData.registrationState.trim())) {
      errors.registrationState = "UF deve ter 2 letras em maiusculo.";
    }

    if (formData.defaultAppointmentDuration.trim()) {
      const duration = Number(formData.defaultAppointmentDuration);
      if (Number.isNaN(duration) || duration <= 0) {
        errors.defaultAppointmentDuration = "Duracao deve ser um numero maior que zero.";
      }
    }

    return errors;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const errors = validate();
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setLoading(true);
    try {
      const response = await professionalRegisterComplete({
        cpf: stripCPF(formData.cpf),
        phone: formData.phone.replace(/\D/g, ""),
        password: formData.password,
        professionalCouncil: formData.professionalCouncil.trim().toUpperCase(),
        registrationNumber: formData.registrationNumber.replace(/\D/g, ""),
        registrationState: formData.registrationState.trim().toUpperCase(),
        defaultAppointmentDuration: formData.defaultAppointmentDuration.trim()
          ? Number(formData.defaultAppointmentDuration)
          : undefined,
      });

      setUser(response.user);
      notifySuccess("Cadastro do profissional concluido com sucesso.");
      navigate("/dashboard", { replace: true });
    } catch (err: unknown) {
      notifyError(getApiErrorMessage(err, "Erro ao concluir cadastro do profissional."));
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <Card padding="small">
        <Container>
          <Logo variant="auth" showSubtitle={false} />
          <Title>Completar cadastro profissional</Title>
          <Stepper steps={steps} />

          <Form onSubmit={handleSubmit}>
            <Row>
              <Input
                label="CPF"
                placeholder="000.000.000-00"
                icon={<IdCard />}
                inputMode="numeric"
                maxLength={14}
                value={formData.cpf}
                onChange={(event) => handleFieldChange("cpf", event.target.value)}
                error={fieldErrors.cpf}
                fullWidth
                required
              />

              <Input
                label="Telefone"
                placeholder="(00) 00000-0000"
                icon={<Phone />}
                inputMode="numeric"
                maxLength={15}
                value={formData.phone}
                onChange={(event) => handleFieldChange("phone", event.target.value)}
                error={fieldErrors.phone}
                fullWidth
                required
              />
            </Row>

            <Row>
              <Input
                label="Senha"
                type={showPassword ? "text" : "password"}
                placeholder="Minimo 6 caracteres"
                icon={<Lock />}
                value={formData.password}
                onChange={(event) => handleFieldChange("password", event.target.value)}
                error={fieldErrors.password}
                rightIcon={showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                onRightIconClick={() => setShowPassword((prev) => !prev)}
                fullWidth
                required
              />

              <Input
                label="Conselho profissional"
                placeholder="Ex: CRM, CRO, CREFITO"
                icon={<Shield />}
                value={formData.professionalCouncil}
                onChange={(event) => handleFieldChange("professionalCouncil", event.target.value)}
                error={fieldErrors.professionalCouncil}
                fullWidth
                required
              />
            </Row>

            <Row>
              <Input
                label="Numero do registro"
                placeholder="000.000.000"
                icon={<Hash />}
                inputMode="numeric"
                maxLength={26}
                value={formData.registrationNumber}
                onChange={(event) => handleFieldChange("registrationNumber", event.target.value)}
                error={fieldErrors.registrationNumber}
                fullWidth
                required
              />

              <Input
                label="UF do registro"
                placeholder="Ex: SP"
                icon={<MapPin />}
                maxLength={2}
                value={formData.registrationState}
                onChange={(event) => handleFieldChange("registrationState", event.target.value)}
                error={fieldErrors.registrationState}
                fullWidth
                required
              />
            </Row>

            <Input
              label="Duracao padrao da consulta (min)"
              placeholder="30"
              icon={<Clock3 />}
              inputMode="numeric"
              value={formData.defaultAppointmentDuration}
              onChange={(event) => handleFieldChange("defaultAppointmentDuration", event.target.value)}
              error={fieldErrors.defaultAppointmentDuration}
              fullWidth
            />

            <Button type="submit" variant="primary" size="medium" fullWidth disabled={loading}>
              {loading ? "Concluindo..." : "Concluir cadastro"}
            </Button>
          </Form>
        </Container>
      </Card>
    </AuthLayout>
  );
};

export default RegisterProfessionalComplete;
