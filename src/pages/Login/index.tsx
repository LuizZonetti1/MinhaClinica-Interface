import { useState } from 'react';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { AuthLayout } from '../../components/AuthLayout';
import { Card } from '../../components/Card';
import { Logo } from '../../components/Logo';
import { Input } from '../../components/Input';
import { Button } from '../../components/Button';
import { Container, Title, Subtitle, Form, RememberRow, Checkbox, CheckboxLabel, ForgotLink, Footer, FooterText, FooterLink } from './styles';

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Login:', { email, password, rememberMe });
    // TODO: Implement authentication logic
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
              type={showPassword ? 'text' : 'password'}
              placeholder="Senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              icon={<Lock />}
              iconPosition="left"
              fullWidth
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              style={{
                position: 'absolute',
                right: '16px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                color: '#9CA3AF'
              }}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>

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

            <Button type="submit" variant="primary" size="medium" fullWidth>
              Entrar
            </Button>
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
