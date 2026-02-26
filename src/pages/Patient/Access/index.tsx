import { LogIn, UserPlus } from "lucide-react";
import { useNavigate } from "react-router";
import { AuthLayout } from "../../../components/AuthLayout";
import { Button } from "../../../components/Button";
import { Card } from "../../../components/Card";
import { Logo } from "../../../components/Logo";
import {
  ActionCard,
  ActionSubtitle,
  ActionsContainer,
  ActionTitle,
  Container,
  Divider,
  DividerText,
  Subtitle,
  Title,
} from "./styles";

const PatientAccess = () => {
  const navigate = useNavigate();

  return (
    <AuthLayout>
      <Card>
        <Container>
          <Logo variant="auth" showSubtitle={false} />
          <Title>Minha Clínica</Title>
          <Subtitle>Acesso do Paciente</Subtitle>

          <ActionsContainer>
            <ActionCard onClick={() => navigate("/login")}>
              <div className="icon-wrapper">
                <LogIn size={28} strokeWidth={2} />
              </div>
              <div>
                <ActionTitle>Já tenho uma conta</ActionTitle>
                <ActionSubtitle>Faça login para acessar o portal do paciente</ActionSubtitle>
              </div>
            </ActionCard>

            <Divider>
              <DividerText>ou</DividerText>
            </Divider>

            <ActionCard onClick={() => navigate("/registro/inicial")}>
              <div className="icon-wrapper secondary">
                <UserPlus size={28} strokeWidth={2} />
              </div>
              <div>
                <ActionTitle>Criar nova conta</ActionTitle>
                <ActionSubtitle>
                  Faça seu pré-cadastro e aguarde aprovação da clínica
                </ActionSubtitle>
              </div>
            </ActionCard>
          </ActionsContainer>

          <Button variant="outline" size="medium" fullWidth onClick={() => navigate("/")}>
            Voltar ao início
          </Button>
        </Container>
      </Card>
    </AuthLayout>
  );
};

export default PatientAccess;
