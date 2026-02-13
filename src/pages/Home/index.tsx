import {
  Container,
  Nav,
  LogoContainer,
  IconContainer,
  Icon,
  TextContainer,
  LogoTitle,
  LogoSubtitle,
  HeaderButtons,
  ButtonLogin,
  ButtonRegister,
  HeroSection,
  HeroTitle,
  HeroDescription,
  CTAButtons,
  ButtonPrimary,
  ButtonSecondary,
} from "./styles";
import { Stethoscope, LogIn, Building2, Heart } from "lucide-react";

const Home = () => {
  return (
    <Container>
      <Nav>
        <LogoContainer>
          <IconContainer>
            <Icon>
              <Stethoscope size={28} color="#2563EB" strokeWidth={2.33} />
            </Icon>
          </IconContainer>
          <TextContainer>
            <LogoTitle>Minha Clínica</LogoTitle>
            <LogoSubtitle>Gestão Inteligente de Saúde</LogoSubtitle>
          </TextContainer>
        </LogoContainer>

        <HeaderButtons>
          <ButtonLogin>
            <LogIn size={18} />
            Entrar
          </ButtonLogin>

          <ButtonRegister>
            <Building2 size={18} />
            Cadastrar Clínica
          </ButtonRegister>
        </HeaderButtons>
      </Nav>

      <HeroSection>
        <HeroTitle>Transforme a gestão da sua clínica</HeroTitle>
        <HeroDescription>
          Plataforma completa para gerenciar agendamentos, pacientes e equipe
          médica. Simplifique processos, economize tempo e ofereça uma melhor
          experiência aos seus pacientes.
        </HeroDescription>

        <CTAButtons>
          <ButtonPrimary>
            <Building2 size={24} />
            Cadastrar Minha Clínica
          </ButtonPrimary>

          <ButtonSecondary>
            <Heart size={24} />
            Sou Paciente
          </ButtonSecondary>
        </CTAButtons>
      </HeroSection>
    </Container>
  );
};

export default Home;