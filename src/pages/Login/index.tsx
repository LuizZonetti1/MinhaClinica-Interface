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
import { isRememberMeEnabled } from "../../utils/authStorage";
import { getApiErrorMessage } from "../../utils/getApiErrorMessage";
import { notifySuccess } from "../../utils/toast";
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
  const [rememberMe, setRememberMe] = useState(() => isRememberMeEnabled());
  const [loading, setLoading] = useState(false);
  const [inlineError, setInlineError] = useState("");

  const INVALID_LOGIN_MESSAGE = "Email ou senha incorretos. Verifique e tente novamente.";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setInlineError("");
    setLoading(true);
    try {
      const response = await login({ email, password }, rememberMe);
      setUser(response.user);
      notifySuccess("Login realizado com sucesso.");
      navigate("/dashboard", { replace: true });
    } catch (err: unknown) {
      const apiMessage = getApiErrorMessage(err, INVALID_LOGIN_MESSAGE);
      const normalized = apiMessage.toLowerCase();

      if (
        normalized.includes("email") ||
        normalized.includes("e-mail") ||
        normalized.includes("senha") ||
        normalized.includes("credencial") ||
        normalized.includes("invalid")
      ) {
        setInlineError(INVALID_LOGIN_MESSAGE);
      } else {
        setInlineError(apiMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <Card>
        <Container>
          <Logo variant="auth" showSubtitle={false} />
          <Title>Minha Clinica</Title>
          <Subtitle>Bem-vindo de volta</Subtitle>

          <Form onSubmit={handleSubmit}>
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (inlineError) setInlineError("");
              }}
              icon={<Mail />}
              fullWidth
              required
            />

            <Input
              type={showPassword ? "text" : "password"}
              placeholder="Senha"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (inlineError) setInlineError("");
              }}
              icon={<Lock />}
              iconPosition="left"
              rightIcon={showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              onRightIconClick={() => setShowPassword(!showPassword)}
              fullWidth
              required
            />

            {inlineError && <ErrorText>{inlineError}</ErrorText>}

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
          </Form>

          <Footer>
            <FooterText>
              Nao tem uma conta? <FooterLink to="/register/start">Cadastre-se</FooterLink>
            </FooterText>
          </Footer>
        </Container>
      </Card>
    </AuthLayout>
  );
};

export default Login;
