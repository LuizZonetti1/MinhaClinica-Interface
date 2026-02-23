import { ArrowRight, Mail, User } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router";
import { AuthLayout } from "../../../components/AuthLayout";
import { Button } from "../../../components/Button";
import { Card } from "../../../components/Card";
import { Input } from "../../../components/Input";
import { Logo } from "../../../components/Logo";
import { Stepper } from "../../../components/Stepper";
import { Container, Footer, FooterLink, FooterText, Form, Title } from "./styles";

const RegisterStart = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Register Start:", { name, email });
    // TODO: Send verification email
    navigate("/register/verify");
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

            <Button
              type="submit"
              variant="primary"
              size="medium"
              fullWidth
              icon={<ArrowRight />}
              iconPosition="right"
            >
              Continuar
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
