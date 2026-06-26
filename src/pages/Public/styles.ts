import styled from "styled-components";
import { theme } from "../../themes/themes";

/* ── Wrapper geral ── */
export const PageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: ${theme.colors.background};
`;

/* ── Nav (idêntico ao da Home) ── */
export const NavBar = styled.nav`
  display: flex;
  height: 80px;
  align-items: center;
  justify-content: space-between;
  padding: 0 ${theme.spacing.xxl};
  background: ${theme.colors.gradients.hero};
  width: 100%;

  @media (max-width: ${theme.breakpoints.tablet}) {
    padding: 0 ${theme.spacing.lg};
    height: 68px;
  }
`;

export const NavLogo = styled.button`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.lg};
  background: transparent;
  border: none;
  cursor: pointer;
`;

export const NavLogoIcon = styled.div`
  width: 44px;
  height: 44px;
  background: ${theme.colors.surface};
  border-radius: ${theme.borderRadius.sm};
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  display: flex;
  align-items: center;
  justify-content: center;

  svg { width: 24px; height: 24px; }
`;

export const NavLogoText = styled.span`
  font-family: 'Roboto', sans-serif;
  font-weight: 700;
  font-size: 20px;
  color: ${theme.colors.text.inverse};

  @media (max-width: ${theme.breakpoints.mobile}) {
    display: none;
  }
`;

export const NavActions = styled.div`
  display: flex;
  gap: ${theme.spacing.lg};
  align-items: center;
`;

export const NavBtnOutline = styled.button`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.sm};
  height: 44px;
  padding: 0 ${theme.spacing.xl};
  background: transparent;
  border: 2px solid ${theme.colors.surface};
  border-radius: ${theme.borderRadius.sm};
  color: ${theme.colors.text.inverse};
  font-family: 'Roboto', sans-serif;
  font-weight: 500;
  font-size: 15px;
  cursor: pointer;
  transition: background 0.2s;

  &:hover { background: rgba(255,255,255,0.12); }

  @media (max-width: ${theme.breakpoints.mobile}) {
    padding: 0 ${theme.spacing.lg};
    font-size: 13px;
  }
`;

export const NavBtnSolid = styled.button`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.sm};
  height: 44px;
  padding: 0 ${theme.spacing.xl};
  background: ${theme.colors.surface};
  border: 2px solid ${theme.colors.surface};
  border-radius: ${theme.borderRadius.sm};
  color: ${theme.colors.primaryHover};
  font-family: 'Roboto', sans-serif;
  font-weight: 600;
  font-size: 15px;
  cursor: pointer;
  transition: background 0.2s;

  &:hover { background: ${theme.colors.surfaceHover}; }

  @media (max-width: ${theme.breakpoints.mobile}) {
    padding: 0 ${theme.spacing.lg};
    font-size: 13px;
  }
`;

/* ── Hero compacto ── */
export const HeroBanner = styled.section`
  background: ${theme.colors.gradients.hero};
  padding: ${theme.spacing.xxxl} ${theme.spacing.xxl};
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: ${theme.spacing.xl};

  @media (max-width: ${theme.breakpoints.tablet}) {
    padding: ${theme.spacing.xxl} ${theme.spacing.lg};
  }
`;

export const HeroTag = styled.span`
  font-family: 'Roboto', sans-serif;
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: rgba(255,255,255,0.75);
`;

export const HeroIconBox = styled.div<{ $bg: string }>`
  width: 72px;
  height: 72px;
  background: ${props => props.$bg};
  border-radius: ${theme.borderRadius.md};
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8px 24px rgba(0,0,0,0.18);

  svg { width: 36px; height: 36px; }
`;

export const HeroTitle = styled.h1`
  margin: 0;
  font-family: 'Roboto', sans-serif;
  font-weight: 700;
  font-size: 44px;
  line-height: 1.15;
  color: ${theme.colors.text.inverse};
  max-width: 780px;

  @media (max-width: ${theme.breakpoints.tablet}) { font-size: 34px; }
  @media (max-width: ${theme.breakpoints.mobile}) { font-size: 28px; }
`;

export const HeroDesc = styled.p`
  margin: 0;
  font-family: 'Roboto', sans-serif;
  font-size: 18px;
  line-height: 1.65;
  color: rgba(255,255,255,0.88);
  max-width: 680px;

  @media (max-width: ${theme.breakpoints.mobile}) { font-size: 15px; }
`;

export const BackBtn = styled.button`
  display: flex;
  align-items: center;
  gap: 6px;
  background: rgba(255,255,255,0.18);
  border: 1px solid rgba(255,255,255,0.35);
  border-radius: ${theme.borderRadius.sm};
  color: ${theme.colors.text.inverse};
  padding: 8px 16px;
  font-family: 'Roboto', sans-serif;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s;
  align-self: flex-start;

  &:hover { background: rgba(255,255,255,0.28); }
`;

/* ── Grid de cards ── */
export const CardsSection = styled.section`
  padding: ${theme.spacing.xxxxl} ${theme.spacing.xxl};
  background: ${theme.colors.surface};

  @media (max-width: ${theme.breakpoints.tablet}) {
    padding: ${theme.spacing.xxxl} ${theme.spacing.lg};
  }
`;

export const CardsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: ${theme.spacing.xxl};
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;

  @media (max-width: ${theme.breakpoints.desktop}) {
    grid-template-columns: repeat(2, 1fr);
  }
  @media (max-width: ${theme.breakpoints.tablet}) {
    grid-template-columns: 1fr;
    gap: ${theme.spacing.xl};
  }
`;

export const Card = styled.article<{ $accentBg: string }>`
  background: ${theme.colors.surface};
  border: 2px solid ${theme.colors.border.light};
  border-radius: ${theme.borderRadius.md};
  padding: ${theme.spacing.xxl};
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.xl};
  transition: box-shadow 0.2s, border-color 0.2s;

  &:hover {
    box-shadow: ${theme.shadows.md};
    border-color: ${theme.colors.border.default};
  }

  .card-icon {
    width: 56px;
    height: 56px;
    background: ${props => props.$accentBg};
    border-radius: ${theme.borderRadius.sm};
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;

    svg { width: 28px; height: 28px; }
  }
`;

export const CardTitle = styled.h2`
  margin: 0;
  font-family: 'Roboto', sans-serif;
  font-weight: 600;
  font-size: 18px;
  line-height: 1.4;
  color: ${theme.colors.text.primary};
`;

export const CardText = styled.p`
  margin: 0;
  font-family: 'Roboto', sans-serif;
  font-size: 14.5px;
  line-height: 1.65;
  color: ${theme.colors.text.secondary};
`;

/* ── CTA ── */
export const CTASection = styled.section`
  background: ${theme.colors.gradients.cta};
  padding: ${theme.spacing.xxxl} ${theme.spacing.xxl};
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${theme.spacing.xl};
  text-align: center;

  @media (max-width: ${theme.breakpoints.tablet}) {
    padding: ${theme.spacing.xxl} ${theme.spacing.lg};
  }
`;

export const CTATitle = styled.h2`
  margin: 0;
  font-family: 'Roboto', sans-serif;
  font-weight: 700;
  font-size: 32px;
  color: ${theme.colors.text.inverse};

  @media (max-width: ${theme.breakpoints.mobile}) { font-size: 26px; }
`;

export const CTAText = styled.p`
  margin: 0;
  font-family: 'Roboto', sans-serif;
  font-size: 17px;
  color: rgba(255,255,255,0.88);
  max-width: 560px;
`;

export const CTAButton = styled.button`
  display: flex;
  align-items: center;
  gap: 10px;
  height: 52px;
  padding: 0 ${theme.spacing.xxl};
  background: ${theme.colors.surface};
  border: none;
  border-radius: ${theme.borderRadius.sm};
  color: ${theme.colors.primaryHover};
  font-family: 'Roboto', sans-serif;
  font-weight: 700;
  font-size: 16px;
  cursor: pointer;
  box-shadow: ${theme.shadows.lg};
  transition: all 0.2s;

  &:hover {
    background: ${theme.colors.surfaceHover};
    transform: translateY(-2px);
    box-shadow: ${theme.shadows.xl};
  }
`;

/* ── Footer (idêntico ao da Home) ── */
export const PageFooter = styled.footer`
  background: ${theme.colors.darker};
  padding: ${theme.spacing.xxxl} ${theme.spacing.xxl};
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.xxl};
  margin-top: auto;

  @media (max-width: ${theme.breakpoints.tablet}) {
    padding: ${theme.spacing.xxl} ${theme.spacing.lg};
  }
`;

export const FooterContent = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr;
  gap: ${theme.spacing.xxxl};
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;

  @media (max-width: ${theme.breakpoints.desktop}) {
    grid-template-columns: repeat(2, 1fr);
    gap: ${theme.spacing.xxl};
  }
  @media (max-width: ${theme.breakpoints.mobile}) {
    grid-template-columns: 1fr;
    gap: ${theme.spacing.xl};
  }
`;

export const FooterColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.lg};
`;

export const FooterLogoRow = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.lg};

  .logo-icon {
    width: 44px;
    height: 44px;
    background: ${theme.colors.surface};
    border-radius: ${theme.borderRadius.sm};
    display: flex;
    align-items: center;
    justify-content: center;
    svg { width: 22px; height: 22px; }
  }

  h3 {
    font-family: 'Roboto', sans-serif;
    font-weight: 700;
    font-size: 22px;
    color: ${theme.colors.text.inverse};
    margin: 0;
  }
`;

export const FooterDesc = styled.p`
  font-family: 'Roboto', sans-serif;
  font-size: 14px;
  line-height: 1.6;
  color: ${theme.colors.text.muted};
  margin: 0;
`;

export const FooterGroupTitle = styled.h4`
  font-family: 'Roboto', sans-serif;
  font-weight: 600;
  font-size: 16px;
  color: ${theme.colors.text.inverse};
  margin: 0;
`;

export const FooterNavLink = styled.a`
  font-family: 'Roboto', sans-serif;
  font-size: 14px;
  color: ${theme.colors.text.muted};
  text-decoration: none;
  cursor: pointer;
  transition: color 0.2s;

  &:hover { color: ${theme.colors.text.inverse}; }
`;

export const FooterDivider = styled.div`
  height: 1px;
  background: ${theme.colors.border.default};
  opacity: 0.18;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
`;

export const FooterBottom = styled.div`
  display: flex;
  justify-content: center;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;

  p {
    font-family: 'Roboto', sans-serif;
    font-size: 13px;
    color: ${theme.colors.text.muted};
    margin: 0;
  }
`;
