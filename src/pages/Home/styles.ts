import Styled from "styled-components";
import { theme } from "../../themes/themes";

export const Container = Styled.section`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    position: relative;
    width: 100%;
    height: 100vh;
    background: linear-gradient(137.44deg, ${theme.colors.primary} 0%, ${theme.colors.primaryActive} 100%);
`;

export const Nav = Styled.nav`
    display: flex;
    height: 100px;
    align-items: center;
    justify-content: space-between;
    padding: 0 32px;
    width: 100%;
`;

export const LogoContainer = Styled.div`
    display: flex;
    gap: 16px;
    align-items: center;
    height: 49px;
`;

export const IconContainer = Styled.div`
    background-color: ${theme.colors.surface};
    border-radius: 8px;
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
    gap: 16px;
    align-items: center;
    height: 52px;
`;

export const ButtonLogin = Styled.button`
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    height: 52px;
    padding: 0 24px;
    background-color: transparent;
    border: 2px solid ${theme.colors.surface};
    border-radius: 8px;
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
`;

export const ButtonRegister = Styled.button`
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    height: 52px;
    padding: 0 24px;
    background-color: ${theme.colors.surface};
    border: 2px solid ${theme.colors.surface};
    border-radius: 8px;
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
`;

export const HeroSection = Styled.div`
    position: relative;
    width: 100%;
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 64px 32px;
`;

export const HeroTitle = Styled.h1`
    font-family: 'Roboto', sans-serif;
    font-weight: 700;
    font-size: 56px;
    line-height: 61.6px;
    text-align: center;
    color: ${theme.colors.text.inverse};
    margin: 0 0 24px 0;
    max-width: 865px;
`;

export const HeroDescription = Styled.p`
    font-family: 'Roboto', sans-serif;
    font-weight: 400;
    font-size: 20px;
    line-height: 32px;
    text-align: center;
    color: ${theme.colors.text.inverse};
    opacity: 0.95;
    margin: 0 0 48px 0;
    max-width: 700px;
`;

export const CTAButtons = Styled.div`
    display: flex;
    gap: 24px;
    align-items: center;
`;

export const ButtonPrimary = Styled.button`
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 12px;
    height: 63px;
    padding: 0 32px;
    background-color: ${theme.colors.surface};
    border: none;
    border-radius: 8px;
    box-shadow: 0px 10px 15px rgba(0, 0, 0, 0.1), 0px 4px 6px rgba(0, 0, 0, 0.05);
    color: ${theme.colors.primaryHover};
    font-family: 'Roboto', sans-serif;
    font-weight: 600;
    font-size: 18px;
    line-height: 27px;
    cursor: pointer;
    transition: all 0.2s;

    &:hover {
        background-color: ${theme.colors.surfaceHover};
        transform: translateY(-2px);
        box-shadow: 0px 15px 20px rgba(0, 0, 0, 0.15), 0px 6px 8px rgba(0, 0, 0, 0.08);
    }

    svg {
        width: 24px;
        height: 24px;
    }
`;

export const ButtonSecondary = Styled.button`
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 12px;
    height: 63px;
    padding: 0 32px;
    background-color: transparent;
    border: 2px solid ${theme.colors.surface};
    border-radius: 8px;
    box-shadow: 0px 10px 15px rgba(0, 0, 0, 0.1), 0px 4px 6px rgba(0, 0, 0, 0.05);
    color: ${theme.colors.text.inverse};
    font-family: 'Roboto', sans-serif;
    font-weight: 600;
    font-size: 18px;
    line-height: 27px;
    cursor: pointer;
    transition: all 0.2s;

    &:hover {
        background-color: rgba(255, 255, 255, 0.1);
        transform: translateY(-2px);
        box-shadow: 0px 15px 20px rgba(0, 0, 0, 0.15), 0px 6px 8px rgba(0, 0, 0, 0.08);
    }

    svg {
        width: 24px;
        height: 24px;
    }
`;