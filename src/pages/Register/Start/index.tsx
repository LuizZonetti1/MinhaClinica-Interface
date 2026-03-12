import { ArrowRight, Mail, User } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router";
import { AuthLayout } from "../../../components/AuthLayout";
import { Button } from "../../../components/Button";
import { Card } from "../../../components/Card";
import { Input } from "../../../components/Input";
import { Logo } from "../../../components/Logo";
import { Stepper } from "../../../components/Stepper";
import { registerStart } from "../../../services/patient.service";
import { storeAuthToken } from "../../../utils/authStorage";
import { getApiErrorMessage } from "../../../utils/getApiErrorMessage";
import { notifyError, notifySuccess } from "../../../utils/toast";
import { Container, Footer, FooterLink, FooterText, Form, Title } from "./styles";

const RegisterStart = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await registerStart({ name, email });
      localStorage.setItem("@minhaclinica:register_email", email);

      if (response.redirectToComplete && response.tempToken) {
        storeAuthToken(response.tempToken);
        notifySuccess("Email ja verificado. Complete seu cadastro.");
        navigate("/registro/completo");
      } else {
        notifySuccess("Link de verificacao enviado para seu email.");
        navigate("/registro/verificar");
      }
    } catch (err: unknown) {
      notifyError(getApiErrorMessage(err, "Erro ao iniciar cadastro. Tente novamente."));
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    { label: "Inicio", status: "active" as const },
    { label: "Verificacao", status: "inactive" as const },
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
              Ja tem uma conta? <FooterLink to="/login">Fazer login</FooterLink>
            </FooterText>
          </Footer>
        </Container>
      </Card>
    </AuthLayout>
  );
};

export default RegisterStart;
