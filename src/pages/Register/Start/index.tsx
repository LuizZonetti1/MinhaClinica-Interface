import { ArrowRight, Mail, User } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router";
import { AuthLayout } from "../../../components/AuthLayout";
import { Button } from "../../../components/Button";
import { Card } from "../../../components/Card";
import { Input } from "../../../components/Input";
import { Logo } from "../../../components/Logo";
import { Stepper } from "../../../components/Stepper";
import { registerStart } from "../../../services/auth.service";
import { getApiErrorMessage } from "../../../utils/getApiErrorMessage";
import { Container, Footer, FooterLink, FooterText, Form, Title } from "./styles";

const RegisterStart = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const response = await registerStart({ name, email });
      // Salva o e-mail para usar nas próximas etapas
      localStorage.setItem("@minhaclinica:register_email", email);

      if (response.redirectToComplete && response.tempToken) {
        // Caso 3: email já verificado mas cadastro não finalizado — pula etapa 2
        localStorage.setItem("@minhaclinica:token", response.tempToken);
        navigate("/registro/completo");
      } else {
        // Casos 1 e 2: fluxo normal — ir para verificação de email
        navigate("/registro/verificar");
      }
    } catch (err: unknown) {
      setError(getApiErrorMessage(err, "Erro ao iniciar cadastro. Tente novamente."));
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    { label: "Início", status: "active" as const },
    { label: "Verificação", status: "inactive" as const },
    { label: "Completar", status: "inactive" as const },
  ];

  return (
    <AuthLayout>
      <Card padding="small">
        <Container>
          <Logo variant="auth" showSubtitle={false} />

          <Stepper steps={steps} />

          <Title>Criar conta</Title>

          <Form onSubmit={handleSubmit}>
            <Input
              label="Nome completo"
              type="text"
              placeholder="Digite seu nome completo"
              value={name}
              onChange={(e) => setName(e.target.value)}
              icon={<User />}
              fullWidth
              required
            />

            <Input
              label="Email"
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              icon={<Mail />}
              fullWidth
              required
            />

            {error && <p style={{ color: "red", fontSize: 13, margin: 0 }}>{error}</p>}

            <Button
              type="submit"
              variant="primary"
              size="medium"
              fullWidth
              icon={<ArrowRight />}
              iconPosition="right"
              disabled={loading}
            >
              {loading ? "Enviando..." : "Continuar"}
            </Button>
          </Form>

          <Footer>
            <FooterText>
              Já tem uma conta? <FooterLink to="/login">Fazer login</FooterLink>
            </FooterText>
          </Footer>
        </Container>
      </Card>
    </AuthLayout>
  );
};

export default RegisterStart;
