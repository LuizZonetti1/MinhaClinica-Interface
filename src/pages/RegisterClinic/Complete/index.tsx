import { Check } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { AuthLayout } from "../../../components/AuthLayout";
import { Button } from "../../../components/Button";
import { Card } from "../../../components/Card";
import { Logo } from "../../../components/Logo";
import { Stepper } from "../../../components/Stepper";
import { useAuth } from "../../../contexts";
import { clinicRegisterComplete } from "../../../services/clinic.service";
import { storeAuthToken } from "../../../utils/authStorage";
import { getApiErrorMessage } from "../../../utils/getApiErrorMessage";
import { notifyError, notifySuccess } from "../../../utils/toast";
import { stripCPF } from "../../../utils/validateCPF";
import { AdminTab } from "./AdminTab";
import { Container, Title } from "./styles";

const RegisterClinicComplete = () => {
  const navigate = useNavigate();
  const { setUser } = useAuth();
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const tempToken = searchParams.get("tempToken");
    if (tempToken) {
      storeAuthToken(tempToken);
    }
  }, [searchParams]);

  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState({
    adminCpf: "",
    adminPhone: "",
    adminPassword: "",
    adminConfirmPassword: "",
    adminBirthDate: "",
    adminGender: "",
  });

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => {
      const next = { ...prev, [field]: value };
      setFieldErrors((errs) => {
        const updated = { ...errs };
        if (field === "adminPassword" || field === "adminConfirmPassword") {
          const pass = field === "adminPassword" ? value : next.adminPassword;
          const confirm = field === "adminConfirmPassword" ? value : next.adminConfirmPassword;
          if (confirm && pass !== confirm) {
            updated.adminConfirmPassword = "As senhas nao coincidem.";
          } else {
            delete updated.adminConfirmPassword;
          }
        }
        if (value.trim()) delete updated[field];
        return updated;
      });
      return next;
    });
  };

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!formData.adminCpf.trim()) errs.adminCpf = "CPF obrigatorio.";
    if (!formData.adminPhone.trim()) errs.adminPhone = "Telefone obrigatorio.";
    if (!formData.adminPassword.trim()) errs.adminPassword = "Senha obrigatoria.";
    if (!formData.adminConfirmPassword.trim()) {
      errs.adminConfirmPassword = "Confirme a senha.";
    } else if (formData.adminPassword !== formData.adminConfirmPassword) {
      errs.adminConfirmPassword = "As senhas nao coincidem.";
    }
    if (!formData.adminBirthDate.trim()) errs.adminBirthDate = "Data de nascimento obrigatoria.";
    if (!formData.adminGender.trim()) errs.adminGender = "Selecione um genero.";
    return errs;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setFieldErrors(errs);
      return;
    }
    setFieldErrors({});
    setLoading(true);
    try {
      const response = await clinicRegisterComplete({
        cpf: stripCPF(formData.adminCpf),
        phone: formData.adminPhone.replace(/\D/g, ""),
        password: formData.adminPassword,
        dateOfBirth: formData.adminBirthDate,
        gender: formData.adminGender,
      });
      setUser(response.user);
      localStorage.removeItem("@minhaclinica:clinic_register_email");
      notifySuccess("Cadastro concluido com sucesso.");
      navigate("/dashboard", { replace: true });
    } catch (err: unknown) {
      notifyError(getApiErrorMessage(err, "Erro ao concluir cadastro. Tente novamente."));
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    { label: "Inicio", status: "completed" as const },
    { label: "Verificacao", status: "completed" as const },
    { label: "Completar", status: "active" as const },
  ];

  return (
    <AuthLayout>
      <Card padding="small">
        <Container>
          <Logo variant="auth" showSubtitle={false} />
          <Title>Completar Cadastro</Title>

          <Stepper steps={steps} />

          <form onSubmit={handleSubmit} style={{ width: "100%" }}>
            <AdminTab formData={formData} onChange={handleChange} fieldErrors={fieldErrors} />

            <Button
              type="submit"
              variant="primary"
              size="medium"
              fullWidth
              icon={<Check />}
              iconPosition="left"
              disabled={loading}
              style={{ marginTop: "16px" }}
            >
              {loading ? "Enviando..." : "Concluir Cadastro"}
            </Button>
          </form>
        </Container>
      </Card>
    </AuthLayout>
  );
};

export default RegisterClinicComplete;
