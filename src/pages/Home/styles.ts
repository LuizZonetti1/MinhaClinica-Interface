import Styled from 'styled-components';
import { theme } from '../../themes/themes';

export const Container = Styled.div`
    background-color: ${theme.colors.surface};
    display: flex;
    flex-direction: column;
    width: 100%;
`;

export const HeroContainer = Styled.section`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    position: relative;
    width: 100%;
    min-height: 100vh;
    background: ${theme.colors.gradients.hero};
    overflow: hidden;
`;

export const Nav = Styled.nav`
    display: flex;
    height: 100px;
    align-items: center;
    justify-content: space-between;
    padding: 0 ${theme.spacing.xxl};
    width: 100%;

    @media (max-width: ${theme.breakpoints.tablet}) {
        padding: 0 ${theme.spacing.lg};
        height: 80px;
    }
`;

export const LogoContainer = Styled.div`
    display: flex;
    gap: ${theme.spacing.lg};
    align-items: center;
    height: 49px;
`;

export const IconContainer = Styled.div`
    background-color: ${theme.colors.surface};
    border-radius: ${theme.borderRadius.sm};
    box-shadow: 0px 10px 15px rgba(0, 0, 0, 0.1), 0px 4px 6px rgba(0, 0, 0, 0.05);
    width: 48px;
    height: 48px;
    display: flex;
    align-items: center;
    justify-content: center;
`;

export const Icon = Styled.div`
    width: 28px;
    height: 28px;
    
    svg {
        width: 100%;
        height: 100%;
    }
`;

export const TextContainer = Styled.div`
    display: flex;
    flex-direction: column;
    gap: 4px;

    @media (max-width: ${theme.breakpoints.mobile}) {
        display: none;
    }
`;

export const LogoTitle = Styled.h1`
    font-family: 'Roboto', sans-serif;
    font-weight: 700;
    font-size: 24px;
    line-height: 24px;
    color: ${theme.colors.text.inverse};
    margin: 0;
`;

export const LogoSubtitle = Styled.p`
    font-family: 'Roboto', sans-serif;
    font-weight: 400;
    font-size: 14px;
    line-height: 21px;
    color: ${theme.colors.text.inverse};
    opacity: 0.9;
    margin: 0;
`;

export const HeaderButtons = Styled.div`
    display: flex;
    gap: ${theme.spacing.lg};
    align-items: center;
    height: 52px;

    @media (max-width: ${theme.breakpoints.mobile}) {
        gap: ${theme.spacing.sm};
    }
`;

export const ButtonLogin = Styled.button`
    display: flex;
    align-items: center;
    justify-content: center;
    gap: ${theme.spacing.sm};
    height: 52px;
    padding: 0 ${theme.spacing.xl};
    background-color: transparent;
    border: 2px solid ${theme.colors.surface};
    border-radius: ${theme.borderRadius.sm};
    color: ${theme.colors.text.inverse};
    font-family: 'Roboto', sans-serif;
    font-weight: 500;
    font-size: 16px;
    line-height: 24px;
    cursor: pointer;
    transition: all 0.2s;

    &:hover {
        background-color: rgba(255, 255, 255, 0.1);
    }

    svg {
        width: 18px;
        height: 18px;
    }

    @media (max-width: ${theme.breakpoints.mobile}) {
        padding: 0 ${theme.spacing.lg};
        font-size: 14px;
        
        span {
            display: none;
        }
    }
`;

export const ButtonRegister = Styled.button`
    display: flex;
    align-items: center;
    justify-content: center;
    gap: ${theme.spacing.sm};
    height: 52px;
    padding: 0 ${theme.spacing.xl};
    background-color: ${theme.colors.surface};
    border: 2px solid ${theme.colors.surface};
    border-radius: ${theme.borderRadius.sm};
    color: ${theme.colors.primaryHover};
    font-family: 'Roboto', sans-serif;
    font-weight: 500;
    font-size: 16px;
    line-height: 24px;
    cursor: pointer;
    transition: all 0.2s;

    &:hover {
        background-color: ${theme.colors.surfaceHover};
    }

    svg {
        width: 18px;
        height: 18px;
    }

    @media (max-width: ${theme.breakpoints.mobile}) {
        padding: 0 ${theme.spacing.lg};
        font-size: 14px;
        
        span {
            display: none;
        }
    }
`;

export const HeroSection = Styled.div`
    position: relative;
    width: 100%;
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: ${theme.spacing.xxxxl} ${theme.spacing.xxl};

    @media (max-width: ${theme.breakpoints.tablet}) {
        padding: ${theme.spacing.xxxl} ${theme.spacing.lg};
    }
`;

export const HeroTitle = Styled.h2`
    font-family: 'Roboto', sans-serif;
    font-weight: 700;
    font-size: 60px;
    line-height: 72px;
    text-align: center;
    color: ${theme.colors.text.inverse};
    margin: 0 0 ${theme.spacing.xl} 0;
    max-width: 900px;

    @media (max-width: ${theme.breakpoints.tablet}) {
        font-size: 40px;
        line-height: 48px;
    }

    @media (max-width: ${theme.breakpoints.mobile}) {
        font-size: 32px;
        line-height: 40px;
    }
`;

export const HeroDescription = Styled.p`
    font-family: 'Roboto', sans-serif;
    font-weight: 400;
    font-size: 20px;
    line-height: 30px;
    text-align: center;
    color: ${theme.colors.text.inverse};
    opacity: 0.9;
    margin: 0 0 40px 0;
    max-width: 750px;

    @media (max-width: ${theme.breakpoints.tablet}) {
        font-size: 18px;
        line-height: 27px;
    }

    @media (max-width: ${theme.breakpoints.mobile}) {
        font-size: 16px;
        line-height: 24px;
    }
`;

export const CTAButtons = Styled.div`
    display: flex;
    gap: ${theme.spacing.lg};
    align-items: center;

    @media (max-width: ${theme.breakpoints.mobile}) {
        flex-direction: column;
        width: 100%;
        max-width: 320px;
    }
`;

export const ButtonPrimary = Styled.button`
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    height: 56px;
    padding: 0 ${theme.spacing.xxl};
    background-color: ${theme.colors.surface};
    border: none;
    border-radius: ${theme.borderRadius.sm};
    box-shadow: ${theme.shadows.lg};
    color: ${theme.colors.primaryHover};
    font-family: 'Roboto', sans-serif;
    font-weight: 600;
    font-size: 17px;
    line-height: 24px;
    cursor: pointer;
    transition: all 0.2s;

    &:hover {
        background-color: ${theme.colors.surfaceHover};
        transform: translateY(-2px);
        box-shadow: ${theme.shadows.xl};
    }

    svg {
        width: 20px;
        height: 20px;
    }

    @media (max-width: ${theme.breakpoints.mobile}) {
        width: 100%;
    }
`;

export const ButtonSecondary = Styled.button`
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    height: 56px;
    padding: 0 ${theme.spacing.xxl};
    background-color: transparent;
    border: 2px solid ${theme.colors.surface};
    border-radius: ${theme.borderRadius.sm};
    color: ${theme.colors.text.inverse};
    font-family: 'Roboto', sans-serif;
    font-weight: 600;
    font-size: 17px;
    line-height: 24px;
    cursor: pointer;
    transition: all 0.2s;

    &:hover {
        background-color: rgba(255, 255, 255, 0.1);
        transform: translateY(-2px);
    }

    svg {
        width: 20px;
        height: 20px;
    }

    @media (max-width: ${theme.breakpoints.mobile}) {
        width: 100%;
    }
`;

// Features Section
export const FeaturesSection = Styled.section`
    background-color: ${theme.colors.surface};
    padding: ${theme.spacing.xxxxl} ${theme.spacing.xxl};
    display: flex;
    flex-direction: column;
    gap: ${theme.spacing.xxxl};

    @media (max-width: ${theme.breakpoints.tablet}) {
        padding: ${theme.spacing.xxxl} ${theme.spacing.lg};
    }
`;

export const SectionHeader = Styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: ${theme.spacing.lg};
`;

export const SectionTitle = Styled.h2`
    font-family: 'Roboto', sans-serif;
    font-weight: 700;
    font-size: 40px;
    line-height: 60px;
    text-align: center;
    color: ${theme.colors.text.primary};
    margin: 0;

    @media (max-width: ${theme.breakpoints.tablet}) {
        font-size: 32px;
        line-height: 48px;
    }

    @media (max-width: ${theme.breakpoints.mobile}) {
        font-size: 28px;
        line-height: 42px;
    }
`;

export const SectionDescription = Styled.p`
    font-family: 'Roboto', sans-serif;
    font-weight: 400;
    font-size: 18px;
    line-height: 28.8px;
    text-align: center;
    color: ${theme.colors.text.secondary};
    margin: 0;

    @media (max-width: ${theme.breakpoints.mobile}) {
        font-size: 16px;
        line-height: 24px;
    }
`;

export const FeaturesGrid = Styled.div`
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

export const FeatureCard = Styled.div<{ $bgColor?: string }>`
    background-color: ${theme.colors.surface};
    border: 2px solid ${theme.colors.border.light};
    border-radius: ${theme.borderRadius.md};
    padding: ${theme.spacing.xxl};
    display: flex;
    flex-direction: column;
    gap: ${theme.spacing.xl};

    .icon-container {
        width: 64px;
        height: 64px;
        background-color: ${props => props.$bgColor || theme.colors.featureBg.blue};
        border-radius: ${theme.borderRadius.sm};
        display: flex;
        align-items: center;
        justify-content: center;

        svg {
            width: 32px;
            height: 32px;
        }
    }
`;

export const FeatureTitle = Styled.h3`
    font-family: 'Roboto', sans-serif;
    font-weight: 600;
    font-size: 20px;
    line-height: 30px;
    color: ${theme.colors.text.primary};
    margin: 0;
`;

export const FeatureDescription = Styled.p`
    font-family: 'Roboto', sans-serif;
    font-weight: 400;
    font-size: 15.2px;
    line-height: 24.32px;
    color: ${theme.colors.text.secondary};
    margin: 0;
`;

// Steps Section
export const StepsSection = Styled.section`
    background-color: ${theme.colors.background};
    padding: ${theme.spacing.xxxxl} ${theme.spacing.xxl};
    display: flex;
    flex-direction: column;
    gap: ${theme.spacing.xxxl};

    @media (max-width: ${theme.breakpoints.tablet}) {
        padding: ${theme.spacing.xxxl} ${theme.spacing.lg};
    }
`;

export const StepsGrid = Styled.div`
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: ${theme.spacing.xxl};
    max-width: 900px;
    margin: 0 auto;
    width: 100%;

    @media (max-width: ${theme.breakpoints.tablet}) {
        grid-template-columns: 1fr;
        gap: ${theme.spacing.xl};
    }
`;

export const StepCard = Styled.div`
    background-color: ${theme.colors.surface};
    border: 2px solid ${theme.colors.border.light};
    border-radius: ${theme.borderRadius.md};
    padding: ${theme.spacing.xxxl} ${theme.spacing.xxl} ${theme.spacing.xxl};
    box-shadow: ${theme.shadows.md};
    position: relative;
    display: flex;
    flex-direction: column;
    gap: ${theme.spacing.xl};

    .step-number {
        position: absolute;
        top: -16px;
        left: 24px;
        width: 48px;
        height: 48px;
        background: linear-gradient(135deg, ${theme.colors.primary} 0%, ${theme.colors.primaryActive} 100%);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        color: ${theme.colors.text.inverse};
        font-family: 'Roboto', sans-serif;
        font-weight: 700;
        font-size: 20px;
        box-shadow: 0px 10px 15px rgba(0, 0, 0, 0.1), 0px 4px 6px rgba(0, 0, 0, 0.05);
    }

    .icon-container {
        width: 56px;
        height: 56px;
        background-color: ${theme.colors.featureBg.blue};
        border-radius: ${theme.borderRadius.sm};
        display: flex;
        align-items: center;
        justify-content: center;

        svg {
            width: 28px;
            height: 28px;
        }
    }
`;

export const StepTitle = Styled.h3`
    font-family: 'Roboto', sans-serif;
    font-weight: 600;
    font-size: 20px;
    line-height: 30px;
    color: ${theme.colors.text.primary};
    margin: 0;
`;

export const StepDescription = Styled.p`
    font-family: 'Roboto', sans-serif;
    font-weight: 400;
    font-size: 15.2px;
    line-height: 24.32px;
    color: ${theme.colors.text.secondary};
    margin: 0;
`;

// Patient Steps Grid (3 columns)
export const PatientStepsGrid = Styled.div`
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

// CTA Section
export const CTASection = Styled.section`
    background: ${theme.colors.gradients.cta};
    padding: ${theme.spacing.xxxxl} ${theme.spacing.xxl};
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: ${theme.spacing.xl};

    @media (max-width: ${theme.breakpoints.tablet}) {
        padding: ${theme.spacing.xxxl} ${theme.spacing.lg};
    }
`;

export const CTATitle = Styled.h2`
    font-family: 'Roboto', sans-serif;
    font-weight: 700;
    font-size: 40px;
    line-height: 60px;
    text-align: center;
    color: ${theme.colors.text.inverse};
    margin: 0;

    @media (max-width: ${theme.breakpoints.tablet}) {
        font-size: 32px;
        line-height: 48px;
    }

    @media (max-width: ${theme.breakpoints.mobile}) {
        font-size: 28px;
        line-height: 42px;
    }
`;

export const CTADescription = Styled.p`
    font-family: 'Roboto', sans-serif;
    font-weight: 400;
    font-size: 20px;
    line-height: 30px;
    text-align: center;
    color: ${theme.colors.text.inverse};
    opacity: 0.95;
    margin: 0;
    max-width: 600px;

    @media (max-width: ${theme.breakpoints.mobile}) {
        font-size: 18px;
        line-height: 27px;
    }
`;

// Footer
export const Footer = Styled.footer`
    background-color: ${theme.colors.darker};
    padding: ${theme.spacing.xxxl} ${theme.spacing.xxl};
    display: flex;
    flex-direction: column;
    gap: ${theme.spacing.xxl};

    @media (max-width: ${theme.breakpoints.tablet}) {
        padding: ${theme.spacing.xxl} ${theme.spacing.lg};
    }
`;

export const FooterContent = Styled.div`
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

export const FooterColumn = Styled.div`
    display: flex;
    flex-direction: column;
    gap: ${theme.spacing.lg};
`;

export const FooterLogo = Styled.div`
    display: flex;
    align-items: center;
    gap: ${theme.spacing.lg};

    .logo-icon {
        width: 48px;
        height: 48px;
        background-color: ${theme.colors.surface};
        border-radius: ${theme.borderRadius.sm};
        box-shadow: 0px 10px 15px rgba(0, 0, 0, 0.1), 0px 4px 6px rgba(0, 0, 0, 0.05);
        display: flex;
        align-items: center;
        justify-content: center;

        svg {
            width: 24px;
            height: 24px;
        }
    }

    h3 {
        font-family: 'Roboto', sans-serif;
        font-weight: 700;
        font-size: 24px;
        line-height: 24px;
        color: ${theme.colors.text.inverse};
        margin: 0;
    }
`;

export const FooterText = Styled.p`
    font-family: 'Roboto', sans-serif;
    font-weight: 400;
    font-size: 15.2px;
    line-height: 24.32px;
    color: ${theme.colors.text.muted};
    margin: 0;
`;

export const FooterTitle = Styled.h4`
    font-family: 'Roboto', sans-serif;
    font-weight: 600;
    font-size: 18px;
    line-height: 27px;
    color: ${theme.colors.text.inverse};
    margin: 0;
`;

export const FooterLink = Styled.a`
    font-family: 'Roboto', sans-serif;
    font-weight: 400;
    font-size: 15.2px;
    line-height: 22.8px;
    color: ${theme.colors.text.muted};
    text-decoration: none;
    cursor: pointer;
    transition: color 0.2s;

    &:hover {
        color: ${theme.colors.text.inverse};
    }
`;

export const FooterDivider = Styled.div`
    height: 1px;
    background-color: ${theme.colors.border.default};
    opacity: 0.2;
    max-width: 1200px;
    margin: 0 auto;
    width: 100%;
`;

export const FooterBottom = Styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    max-width: 1200px;
    margin: 0 auto;
    width: 100%;

    p {
        font-family: 'Roboto', sans-serif;
        font-weight: 400;
        font-size: 14px;
        color: ${theme.colors.text.muted};
        margin: 0;
    }
`;
