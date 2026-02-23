import type { LucideIcon } from "lucide-react";
import {
  BarChart3,
  Building2,
  Calendar,
  CheckCircle,
  Clock,
  FileText,
  Heart,
  Laptop,
  LogIn,
  Mail,
  Shield,
  Sparkles,
  Stethoscope,
  UserPlus,
  Users,
} from "lucide-react";
import {
  ButtonLogin,
  ButtonPrimary,
  ButtonRegister,
  ButtonSecondary,
  Container,
  CTAButtons,
  CTADescription,
  CTASection,
  CTATitle,
  FeatureCard,
  FeatureDescription,
  FeaturesGrid,
  FeaturesSection,
  FeatureTitle,
  Footer,
  FooterBottom,
  FooterColumn,
  FooterContent,
  FooterDivider,
  FooterLink,
  FooterLogo,
  FooterText,
  FooterTitle,
  HeaderButtons,
  HeroContainer,
  HeroDescription,
  HeroSection,
  HeroTitle,
  Icon,
  IconContainer,
  LogoContainer,
  LogoSubtitle,
  LogoTitle,
  Nav,
  PatientStepsGrid,
  SectionDescription,
  SectionHeader,
  SectionTitle,
  StepCard,
  StepDescription,
  StepsGrid,
  StepsSection,
  StepTitle,
  TextContainer,
} from "./styles";

// Types
interface Feature {
  icon: LucideIcon;
  title: string;
  description: string;
  bgColor: string;
  iconColor: string;
}

interface Step {
  number: number;
  icon: LucideIcon;
  title: string;
  description: string;
  iconColor: string;
  bgColor?: string;
}

// Features Data
const FEATURES: ReadonlyArray<Feature> = [
  {
    icon: Calendar,
    title: "Agendamento Inteligente",
    description:
      "Sistema completo de agendamentos com confirmações automáticas, lembretes por email e gerenciamento de horários em tempo real.",
    bgColor: "#dbeafe",
    iconColor: "#2563EB",
  },
  {
    icon: Users,
    title: "Gestão de Pacientes",
    description:
      "Prontuário eletrônico, histórico completo de consultas e informações centralizadas para um atendimento personalizado.",
    bgColor: "#dcfce7",
    iconColor: "#16A34A",
  },
  {
    icon: BarChart3,
    title: "Relatórios e Análises",
    description:
      "Dashboards intuitivos com métricas importantes para tomada de decisões estratégicas na gestão da sua clínica.",
    bgColor: "#f3e8ff",
    iconColor: "#9333EA",
  },
  {
    icon: Shield,
    title: "Segurança e Privacidade",
    description:
      "Proteção de dados conforme LGPD, com criptografia de ponta a ponta e backups automáticos diários.",
    bgColor: "#ffedd5",
    iconColor: "#EA580C",
  },
  {
    icon: Clock,
    title: "Acesso 24/7",
    description:
      "Acesse de qualquer lugar, a qualquer momento. Sistema responsivo que funciona em computadores, tablets e celulares.",
    bgColor: "#dbeafe",
    iconColor: "#2563EB",
  },
  {
    icon: Sparkles,
    title: "Interface Intuitiva",
    description:
      "Design moderno e fácil de usar. Sua equipe aprende em minutos, sem necessidade de treinamentos complexos.",
    bgColor: "#dcfce7",
    iconColor: "#16A34A",
  },
];

// Clinic Registration Steps Data
const CLINIC_STEPS: ReadonlyArray<Step> = [
  {
    number: 1,
    icon: FileText,
    title: "Dados Iniciais",
    description:
      "Preencha as informações básicas da sua clínica: nome, CNPJ, endereço e dados do responsável. Leva apenas 2 minutos.",
    iconColor: "#2563EB",
  },
  {
    number: 2,
    icon: Mail,
    title: "Verificação de Email",
    description:
      "Enviamos um código de verificação para o email cadastrado. Confirme para garantir a segurança da sua conta.",
    iconColor: "#2563EB",
  },
  {
    number: 3,
    icon: UserPlus,
    title: "Complete seu Perfil",
    description:
      "Adicione informações adicionais sobre você como proprietário e configure as preferências iniciais do sistema.",
    iconColor: "#2563EB",
  },
  {
    number: 4,
    icon: CheckCircle,
    title: "Pronto para Usar!",
    description:
      "Acesse o dashboard completo, convide sua equipe, cadastre pacientes e comece a agendar consultas imediatamente.",
    iconColor: "#2563EB",
  },
];

// Patient Registration Steps Data
const PATIENT_STEPS: ReadonlyArray<Step> = [
  {
    number: 1,
    icon: UserPlus,
    title: "Pré-Cadastro",
    description:
      "Faça um rápido pré-cadastro com suas informações básicas. Sua clínica irá aprovar e finalizar o cadastro.",
    iconColor: "#16A34A",
    bgColor: "#dcfce7",
  },
  {
    number: 2,
    icon: Mail,
    title: "Confirmação",
    description:
      "Receba um email de confirmação assim que a clínica aprovar seu cadastro e ativar seu acesso ao portal.",
    iconColor: "#16A34A",
    bgColor: "#dcfce7",
  },
  {
    number: 3,
    icon: Laptop,
    title: "Acesse o Portal",
    description:
      "Faça login e acesse seu histórico de consultas, exames, agendamentos e outras informações de saúde.",
    iconColor: "#16A34A",
    bgColor: "#dcfce7",
  },
];

const Home = () => {
  return (
    <Container>
      {/* Hero Section */}
      <HeroContainer>
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
            Plataforma completa para gerenciar agendamentos, pacientes e equipe médica. Simplifique
            processos, economize tempo e ofereça uma melhor experiência aos seus pacientes.
          </HeroDescription>

          <CTAButtons>
            <ButtonPrimary>
              <Building2 size={20} />
              Cadastrar Minha Clínica
            </ButtonPrimary>

            <ButtonSecondary>
              <Heart size={20} />
              Sou Paciente
            </ButtonSecondary>
          </CTAButtons>
        </HeroSection>
      </HeroContainer>

      {/* Features Section */}
      <FeaturesSection>
        <SectionHeader>
          <SectionTitle>Por que escolher Minha Clínica?</SectionTitle>
          <SectionDescription>
            Uma solução completa pensada para facilitar o dia a dia da sua clínica
          </SectionDescription>
        </SectionHeader>

        <FeaturesGrid>
          {FEATURES.map((feature) => {
            const IconComponent = feature.icon;
            return (
              <FeatureCard key={feature.title} bgColor={feature.bgColor}>
                <div className="icon-container">
                  <IconComponent size={32} color={feature.iconColor} />
                </div>
                <div>
                  <FeatureTitle>{feature.title}</FeatureTitle>
                  <FeatureDescription>{feature.description}</FeatureDescription>
                </div>
              </FeatureCard>
            );
          })}
        </FeaturesGrid>
      </FeaturesSection>

      {/* Clinic Registration Steps */}
      <StepsSection>
        <SectionHeader>
          <SectionTitle>Como funciona o cadastro da clínica?</SectionTitle>
          <SectionDescription>
            Em poucos passos você estará pronto para usar todo o sistema
          </SectionDescription>
        </SectionHeader>

        <StepsGrid>
          {CLINIC_STEPS.map((step) => {
            const IconComponent = step.icon;
            return (
              <StepCard key={step.number}>
                <div className="step-number">{step.number}</div>
                <div className="icon-container">
                  <IconComponent size={28} color={step.iconColor} />
                </div>
                <div>
                  <StepTitle>{step.title}</StepTitle>
                  <StepDescription>{step.description}</StepDescription>
                </div>
              </StepCard>
            );
          })}
        </StepsGrid>
      </StepsSection>

      {/* Patient Steps */}
      <FeaturesSection>
        <SectionHeader>
          <SectionTitle>Como funciona para pacientes?</SectionTitle>
          <SectionDescription>Acesso rápido e fácil ao portal do paciente</SectionDescription>
        </SectionHeader>

        <PatientStepsGrid>
          {PATIENT_STEPS.map((step) => {
            const IconComponent = step.icon;
            return (
              <StepCard key={step.number}>
                <div className="step-number">{step.number}</div>
                <div className="icon-container" style={{ backgroundColor: step.bgColor }}>
                  <IconComponent size={28} color={step.iconColor} />
                </div>
                <div>
                  <StepTitle>{step.title}</StepTitle>
                  <StepDescription>{step.description}</StepDescription>
                </div>
              </StepCard>
            );
          })}
        </PatientStepsGrid>
      </FeaturesSection>

      {/* CTA Section */}
      <CTASection>
        <CTATitle>Pronto para começar?</CTATitle>
        <CTADescription>
          Junte-se a centenas de clínicas que já transformaram sua gestão com Minha Clínica.
          Cadastre-se gratuitamente hoje mesmo!
        </CTADescription>

        <CTAButtons>
          <ButtonPrimary>
            <Building2 size={20} />
            Cadastrar Minha Clínica Agora
          </ButtonPrimary>

          <ButtonSecondary>
            <LogIn size={20} />
            Já tenho uma conta
          </ButtonSecondary>
        </CTAButtons>
      </CTASection>

      {/* Footer */}
      <Footer>
        <FooterContent>
          <FooterColumn>
            <FooterLogo>
              <div className="logo-icon">
                <Stethoscope size={24} color="#2563EB" />
              </div>
              <h3>Minha Clínica</h3>
            </FooterLogo>
            <FooterText>
              Solução completa para gestão de clínicas e consultórios médicos. Simplifique sua
              rotina e foque no que realmente importa: cuidar dos seus pacientes.
            </FooterText>
          </FooterColumn>

          <FooterColumn>
            <FooterTitle>Produto</FooterTitle>
            <FooterLink>Funcionalidades</FooterLink>
            <FooterLink>Preços</FooterLink>
            <FooterLink>Integrações</FooterLink>
            <FooterLink>Segurança</FooterLink>
          </FooterColumn>

          <FooterColumn>
            <FooterTitle>Recursos</FooterTitle>
            <FooterLink>Central de Ajuda</FooterLink>
            <FooterLink>Blog</FooterLink>
            <FooterLink>Suporte</FooterLink>
            <FooterLink>Documentação API</FooterLink>
          </FooterColumn>

          <FooterColumn>
            <FooterTitle>Empresa</FooterTitle>
            <FooterLink>Sobre Nós</FooterLink>
            <FooterLink>Contato</FooterLink>
            <FooterLink>Privacidade</FooterLink>
            <FooterLink>Termos de Uso</FooterLink>
          </FooterColumn>
        </FooterContent>

        <FooterDivider />

        <FooterBottom>
          <p>© 2026 Minha Clínica. Todos os direitos reservados.</p>
        </FooterBottom>
      </Footer>
    </Container>
  );
};

export default Home;
