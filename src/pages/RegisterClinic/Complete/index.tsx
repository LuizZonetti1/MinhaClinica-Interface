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
import { getApiErrorMessage } from "../../../utils/getApiErrorMessage";
import { stripCPF } from "../../../utils/validateCPF";
import { AdminTab } from "./AdminTab";
import { Container, Title } from "./styles";

const RegisterClinicComplete = () => {
  const navigate = useNavigate();
  const { setUser } = useAuth();
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // O backend redireciona direto para esta rota com ?tempToken=&name=&email=
  // Salva o tempToken no localStorage para o interceptor do Axios usá-lo no POST
  useEffect(() => {
    const tempToken = searchParams.get("tempToken");
    if (tempToken) {
      localStorage.setItem("@minhaclinica:token", tempToken);
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
        // Valida senhas em tempo real
        if (field === "adminPassword" || field === "adminConfirmPassword") {
          const pass = field === "adminPassword" ? value : next.adminPassword;
          const confirm = field === "adminConfirmPassword" ? value : next.adminConfirmPassword;
          if (confirm && pass !== confirm) {
            updated.adminConfirmPassword = "As senhas não coincidem.";
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
    if (!formData.adminCpf.trim()) errs.adminCpf = "CPF obrigatório.";
    if (!formData.adminPhone.trim()) errs.adminPhone = "Telefone obrigatório.";
    if (!formData.adminPassword.trim()) errs.adminPassword = "Senha obrigatória.";
    if (!formData.adminConfirmPassword.trim()) {
      errs.adminConfirmPassword = "Confirme a senha.";
    } else if (formData.adminPassword !== formData.adminConfirmPassword) {
      errs.adminConfirmPassword = "As senhas não coincidem.";
    }
    if (!formData.adminBirthDate.trim()) errs.adminBirthDate = "Data de nascimento obrigatória.";
    if (!formData.adminGender.trim()) errs.adminGender = "Selecione um gênero.";
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
    setError("");
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
      navigate("/dashboard", { replace: true });
    } catch (err: unknown) {
      setError(getApiErrorMessage(err, "Erro ao concluir cadastro. Tente novamente."));
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    { label: "Início", status: "completed" as const },
    { label: "Verificação", status: "completed" as const },
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

            {error && <p style={{ color: "red", fontSize: 13, margin: "8px 0 0" }}>{error}</p>}

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
