import type { LucideIcon } from "lucide-react";
import {
  ArrowLeft,
  BarChart3,
  Bell,
  BookOpen,
  Building2,
  Calendar,
  CheckCircle,
  Clock,
  Code2,
  Database,
  FileCheck,
  FileText,
  Headphones,
  Heart,
  HelpCircle,
  Lock,
  LogIn,
  Mail,
  Plug,
  RefreshCw,
  Server,
  Shield,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  Tag,
  Users,
  Zap,
} from "lucide-react";
import { Link, useNavigate } from "react-router";
import type { PublicPageKey } from "./content";
import { PUBLIC_PAGES } from "./content";
import {
  BackBtn,
  Card,
  CardText,
  CardTitle,
  CardsGrid,
  CardsSection,
  CTAButton,
  CTASection,
  CTAText,
  CTATitle,
  FooterBottom,
  FooterColumn,
  FooterContent,
  FooterDesc,
  FooterDivider,
  FooterGroupTitle,
  FooterLogoRow,
  FooterNavLink,
  HeroBanner,
  HeroDesc,
  HeroIconBox,
  HeroTag,
  HeroTitle,
  NavActions,
  NavBar,
  NavBtnOutline,
  NavBtnSolid,
  NavLogo,
  NavLogoIcon,
  NavLogoText,
  PageFooter,
  PageWrapper,
} from "./styles";

/* ── Mapa de ícones por chave string ── */
const ICON_MAP: Readonly<Record<string, LucideIcon>> = {
  ArrowLeft,
  BarChart3,
  Bell,
  BookOpen,
  Building2,
  Calendar,
  CheckCircle,
  Clock,
  Code2,
  Database,
  FileCheck,
  FileText,
  Headphones,
  Heart,
  HelpCircle,
  Lock,
  Mail,
  Plug,
  RefreshCw,
  Server,
  Shield,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  Tag,
  Users,
  Zap,
};

function getIcon(key: string): LucideIcon {
  return ICON_MAP[key] ?? Sparkles;
}

interface PublicPageProps {
  pageKey: PublicPageKey;
}

const FOOTER_LINKS = {
  produto: [
    { label: "Funcionalidades", to: "/funcionalidades" },
    { label: "Preços", to: "/precos" },
    { label: "Integrações", to: "/integracoes" },
    { label: "Segurança", to: "/seguranca" },
  ],
  recursos: [
    { label: "Central de Ajuda", to: "/ajuda" },
    { label: "Blog", to: "/blog" },
    { label: "Suporte", to: "/suporte" },
  ],
  empresa: [
    { label: "Sobre Nós", to: "/sobre" },
    { label: "Contato", to: "/contato" },
    { label: "Privacidade", to: "/privacidade" },
    { label: "Termos de Uso", to: "/termos" },
  ],
};

const PublicPage = ({ pageKey }: PublicPageProps) => {
  const navigate = useNavigate();
  const page = PUBLIC_PAGES[pageKey];
  const HeroIcon = getIcon(page.heroIconKey);
  const currentYear = new Date().getFullYear();

  return (
    <PageWrapper>
      {/* Nav */}
      <NavBar>
        <NavLogo onClick={() => navigate("/")}>
          <NavLogoIcon>
            <Stethoscope size={22} color="#2563EB" strokeWidth={2.33} />
          </NavLogoIcon>
          <NavLogoText>Minha Clínica</NavLogoText>
        </NavLogo>

        <NavActions>
          <NavBtnOutline onClick={() => navigate("/login")}>
            <LogIn size={16} />
            Entrar
          </NavBtnOutline>
          <NavBtnSolid onClick={() => navigate("/clinica/registro/inicial")}>
            <Building2 size={16} />
            Cadastrar Clínica
          </NavBtnSolid>
        </NavActions>
      </NavBar>

      {/* Hero compacto */}
      <HeroBanner>
        <BackBtn onClick={() => navigate(-1)}>
          <ArrowLeft size={16} />
          Voltar
        </BackBtn>

        <HeroTag>{page.tag}</HeroTag>

        <HeroIconBox $bg={page.accentBg}>
          <HeroIcon size={36} color={page.accentColor} strokeWidth={1.8} />
        </HeroIconBox>

        <HeroTitle>{page.title}</HeroTitle>
        <HeroDesc>{page.description}</HeroDesc>
      </HeroBanner>

      {/* Cards */}
      <CardsSection>
        <CardsGrid>
          {page.sections.map((section) => {
            const SectionIcon = getIcon(section.iconKey);
            return (
              <Card key={section.title} $accentBg={page.accentBg}>
                <div className="card-icon">
                  <SectionIcon size={28} color={page.accentColor} strokeWidth={1.8} />
                </div>
                <div>
                  <CardTitle>{section.title}</CardTitle>
                  <CardText>{section.text}</CardText>
                </div>
              </Card>
            );
          })}
        </CardsGrid>
      </CardsSection>

      {/* CTA opcional */}
      {page.cta && (
        <CTASection>
          <CTATitle>Pronto para começar?</CTATitle>
          <CTAText>
            Junte-se a centenas de clínicas que já transformaram sua gestão com a Minha Clínica.
          </CTAText>
          <CTAButton
            onClick={() => {
              if (page.cta!.to.startsWith("mailto:")) {
                const email = page.cta!.to.replace("mailto:", "");
                window.open(`https://mail.google.com/mail/?view=cm&to=${email}`, "_blank");
              } else {
                navigate(page.cta!.to);
              }
            }}
          >
            {page.cta.label}
          </CTAButton>
        </CTASection>
      )}

      {/* Footer idêntico ao da Home */}
      <PageFooter>
        <FooterContent>
          <FooterColumn>
            <FooterLogoRow>
              <div className="logo-icon">
                <Stethoscope size={22} color="#2563EB" />
              </div>
              <h3>Minha Clínica</h3>
            </FooterLogoRow>
            <FooterDesc>
              Solução completa para gestão de clínicas e consultórios médicos. Simplifique sua
              rotina e foque no que realmente importa: cuidar dos seus pacientes.
            </FooterDesc>
          </FooterColumn>

          <FooterColumn>
            <FooterGroupTitle>Produto</FooterGroupTitle>
            {FOOTER_LINKS.produto.map((l) => (
              <FooterNavLink key={l.to} as={Link} to={l.to}>
                {l.label}
              </FooterNavLink>
            ))}
          </FooterColumn>

          <FooterColumn>
            <FooterGroupTitle>Recursos</FooterGroupTitle>
            {FOOTER_LINKS.recursos.map((l) => (
              <FooterNavLink key={l.to} as={Link} to={l.to}>
                {l.label}
              </FooterNavLink>
            ))}
          </FooterColumn>

          <FooterColumn>
            <FooterGroupTitle>Empresa</FooterGroupTitle>
            {FOOTER_LINKS.empresa.map((l) => (
              <FooterNavLink key={l.to} as={Link} to={l.to}>
                {l.label}
              </FooterNavLink>
            ))}
          </FooterColumn>
        </FooterContent>

        <FooterDivider />

        <FooterBottom>
          <p>© {currentYear} Minha Clínica. Todos os direitos reservados.</p>
        </FooterBottom>
      </PageFooter>
    </PageWrapper>
  );
};

export default PublicPage;

