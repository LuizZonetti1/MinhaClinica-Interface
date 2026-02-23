import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Mail, Check, Info } from 'lucide-react';
import { AuthLayout } from '../../../components/AuthLayout';
import { Card } from '../../../components/Card';
import { Logo } from '../../../components/Logo';
import { Button } from '../../../components/Button';
import { Stepper } from '../../../components/Stepper';
import { 
  Container, 
  Title, 
  Description, 
  EmailIcon, 
  InfoBox, 
  InfoText, 
  InfoLink, 
  ResendButton,
  ResendText 
} from './styles';

const RegisterVerify = () => {
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(56);
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [countdown]);

  const handleResend = () => {
    console.log('Resending verification email...');
    setCountdown(56);
    setCanResend(false);
  };

  const handleContinue = () => {
    // Simulate email verification
    navigate('/register/complete');
  };

  const steps = [
    { label: 'Início', status: 'completed' as const },
    { label: 'Verificação', status: 'active' as const },
    { label: 'Completar', status: 'inactive' as const },
  ];

  return (
    <AuthLayout>
      <Card padding="small">
        <Container>
          <Logo variant="auth" showSubtitle={false} />
          
          <Stepper steps={steps} />

          <EmailIcon>
            <Mail size={40} strokeWidth={1.5} />
            <div className="check-badge">
              <Check size={16} strokeWidth={3} />
            </div>
          </EmailIcon>

          <Title>Verifique seu email</Title>
          <Description>
            Enviamos um link de verificação para <strong>usuario@email.com</strong>
          </Description>

          <InfoBox>
            <Info size={18} />
            <div>
              <InfoText>
                Não recebeu o email? Verifique sua pasta de spam ou reenvie o link.
              </InfoText>
              {!canResend && (
                <InfoLink>Você poderá reenviar em {countdown}s</InfoLink>
              )}
            </div>
          </InfoBox>

          {canResend ? (
            <ResendButton onClick={handleResend}>
              Reenviar email de verificação
            </ResendButton>
          ) : (
            <ResendText>Aguarde {countdown}s para reenviar</ResendText>
          )}

          <Button 
            onClick={handleContinue} 
            variant="primary" 
            size="medium" 
            fullWidth
          >
            Já verifiquei - Continuar
          </Button>
        </Container>
      </Card>
    </AuthLayout>
  );
};

export default RegisterVerify;
