import { Eye, EyeOff, IdCard, Lock, Phone } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { AuthLayout } from "../../../components/AuthLayout";
import { Button } from "../../../components/Button";
import { Card } from "../../../components/Card";
import { Input } from "../../../components/Input";
import { Logo } from "../../../components/Logo";
import { Stepper } from "../../../components/Stepper";
import { useAuth } from "../../../contexts";
import { receptionRegisterComplete } from "../../../services/reception.service";
import { storeAuthToken } from "../../../utils/authStorage";
import { maskCPF } from "../../../utils/formatters";
import { handleEnterNavigation } from "../../../utils/enterNavigation";
import { getApiErrorMessage } from "../../../utils/getApiErrorMessage";
import { notifyError, notifySuccess } from "../../../utils/toast";
import { stripCPF } from "../../../utils/validateCPF";
import { Container, Form, RequirementsText, Row, Title } from "./styles";

type ReceptionCompleteFormData = {
  cpf: string;
  phone: string;
  password: string;
};

const INITIAL_FORM_DATA: ReceptionCompleteFormData = {
  cpf: "",
  phone: "",
  password: "",
};

const onlyDigits = (value: string) => value.replace(/\D/g, "");

const maskPhone = (value: string) =>
  value
    .replace(/\D/g, "")
    .slice(0, 11)
    .replace(/(\d{2})(\d)/, "($1) $2")
    .replace(/(\d{5})(\d{1,4})$/, "$1-$2");

const PASSWORD_REQUIREMENTS_TEXT =
  "Senha com no minimo 6 caracteres, incluindo letra maiuscula, minuscula e numero.";

const isPasswordStrong = (value: string) =>
  value.length >= 6 && /[A-Z]/.test(value) && /[a-z]/.test(value) && /\d/.test(value);

const RegisterReceptionComplete = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { setUser } = useAuth();

  const [formData, setFormData] = useState<ReceptionCompleteFormData>(INITIAL_FORM_DATA);
  const [fieldErrors, setFieldErrors] = useState<
    Partial<Record<keyof ReceptionCompleteFormData, string>>
  >({});
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const tempToken = new URLSearchParams(window.location.hash.slice(1)).get("tempToken");
    if (tempToken) {
      storeAuthToken(tempToken);
    }
  }, [searchParams]);

  const steps = [
    { label: "Convite", status: "completed" as const },
    { label: "Verificacao", status: "completed" as const },
    { label: "Completar", status: "active" as const },
  ];

  const handleFieldChange = (field: keyof ReceptionCompleteFormData, value: string): void => {
    let nextValue = value;

    if (field === "cpf") nextValue = maskCPF(value);
    if (field === "phone") nextValue = maskPhone(value);

    setFormData((prev) => ({ ...prev, [field]: nextValue }));
    setFieldErrors((prev) => {
      if (!prev[field]) return prev;
      const next = { ...prev };
      delete next[field];
      return next;
    });
  };

  const validate = (): Partial<Record<keyof ReceptionCompleteFormData, string>> => {
    const errors: Partial<Record<keyof ReceptionCompleteFormData, string>> = {};
    const cpfDigits = onlyDigits(formData.cpf);
    const phoneDigits = onlyDigits(formData.phone);

    if (cpfDigits.length !== 11) errors.cpf = "CPF deve ter 11 digitos.";
    if (phoneDigits.length < 10 || phoneDigits.length > 11) {
      errors.phone = "Telefone deve ter 10 ou 11 digitos.";
    }
    if (!isPasswordStrong(formData.password.trim())) {
      errors.password = PASSWORD_REQUIREMENTS_TEXT;
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
      const response = await receptionRegisterComplete({
        cpf: stripCPF(formData.cpf),
        phone: formData.phone.replace(/\D/g, ""),
        password: formData.password,
      });

      setUser(response.user);
      notifySuccess("Cadastro da recepção concluído com sucesso.");
      navigate("/dashboard", { replace: true });
    } catch (err: unknown) {
      notifyError(getApiErrorMessage(err, "Erro ao concluir cadastro da recepção."));
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <Card padding="small">
        <Container>
          <Logo variant="auth" showSubtitle={false} />
          <Title>Completar cadastro da recepção</Title>
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
                onKeyDown={handleEnterNavigation}
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
                onKeyDown={handleEnterNavigation}
                error={fieldErrors.phone}
                fullWidth
                required
              />
            </Row>

            <Input
              label="Senha"
              type={showPassword ? "text" : "password"}
              placeholder="Minimo 6 caracteres"
              icon={<Lock />}
              value={formData.password}
              onChange={(event) => handleFieldChange("password", event.target.value)}
              onKeyDown={handleEnterNavigation}
              error={fieldErrors.password}
              rightIcon={showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              onRightIconClick={() => setShowPassword((prev) => !prev)}
              fullWidth
              required
            />

            <RequirementsText>
              Para concluir: CPF com 11 digitos, telefone com 10 ou 11 digitos e{" "}
              {PASSWORD_REQUIREMENTS_TEXT.toLowerCase()}
            </RequirementsText>

            <Button type="submit" variant="primary" size="medium" fullWidth disabled={loading}>
              {loading ? "Concluindo..." : "Concluir cadastro"}
            </Button>
          </Form>
        </Container>
      </Card>
    </AuthLayout>
  );
};

export default RegisterReceptionComplete;
