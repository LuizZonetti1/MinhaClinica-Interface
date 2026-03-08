import { Eye, EyeOff, Lock, Mail } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router";
import { AuthLayout } from "../../components/AuthLayout";
import { Button } from "../../components/Button";
import { Card } from "../../components/Card";
import { Input } from "../../components/Input";
import { Logo } from "../../components/Logo";
import { useAuth } from "../../contexts";
import { login } from "../../services/auth.service";
import { getApiErrorMessage } from "../../utils/getApiErrorMessage";
import {
  Checkbox,
  CheckboxLabel,
  Container,
  ErrorText,
  Footer,
  FooterLink,
  FooterText,
  ForgotLink,
  Form,
  RememberRow,
  Subtitle,
  Title,
} from "./styles";

const Login = () => {
  const navigate = useNavigate();
  const { setUser } = useAuth();

  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const response = await login({ email, password });
      setUser(response.user);
      navigate("/dashboard", { replace: true });
    } catch (err: unknown) {
      setError(getApiErrorMessage(err, "E-mail ou senha inválidos."));
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <Card>
        <Container>
          <Logo variant="auth" showSubtitle={false} />
          <Title>Minha Clínica</Title>
          <Subtitle>Bem-vindo de volta</Subtitle>

          <Form onSubmit={handleSubmit}>
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              icon={<Mail />}
              fullWidth
              required
            />

            <Input
              type={showPassword ? "text" : "password"}
              placeholder="Senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              icon={<Lock />}
              iconPosition="left"
              rightIcon={showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              onRightIconClick={() => setShowPassword(!showPassword)}
              fullWidth
              required
            />

            <RememberRow>
              <CheckboxLabel>
                <Checkbox
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                Lembrar-me
              </CheckboxLabel>
              <ForgotLink to="/forgot-password">Esqueci a senha</ForgotLink>
            </RememberRow>

            <Button type="submit" variant="primary" size="medium" fullWidth disabled={loading}>
              {loading ? "Entrando..." : "Entrar"}
            </Button>

            {error && <ErrorText>{error}</ErrorText>}
          </Form>

          <Footer>
            <FooterText>
              Não tem uma conta? <FooterLink to="/register/start">Cadastre-se</FooterLink>
            </FooterText>
          </Footer>
        </Container>
      </Card>
    </AuthLayout>
  );
};

export default Login;
