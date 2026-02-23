import styled, { css } from "styled-components";
import { theme } from "../../themes/themes";
import type { ButtonSize, ButtonVariant } from "./index";

interface StyledButtonProps {
  $variant: ButtonVariant;
  $size: ButtonSize;
  $fullWidth: boolean;
}

const sizeStyles = {
  small: css`
    height: 40px;
    padding: 0 ${theme.spacing.lg};
    font-size: 14px;
    
    .icon {
      width: 16px;
      height: 16px;
      
      svg {
        width: 16px;
        height: 16px;
      }
    }
  `,
  medium: css`
    height: 48px;
    padding: 0 ${theme.spacing.xl};
    font-size: 15px;
    
    .icon {
      width: 18px;
      height: 18px;
      
      svg {
        width: 18px;
        height: 18px;
      }
    }
  `,
  large: css`
    height: 56px;
    padding: 0 ${theme.spacing.xxl};
    font-size: 17px;
    
    .icon {
      width: 20px;
      height: 20px;
      
      svg {
        width: 20px;
        height: 20px;
      }
    }
  `,
};

const variantStyles = {
  primary: css`
    background-color: ${theme.colors.primary};
    border: none;
    color: ${theme.colors.text.inverse};
    box-shadow: ${theme.shadows.md};

    &:hover:not(:disabled) {
      background-color: ${theme.colors.primaryHover};
      transform: translateY(-2px);
      box-shadow: 0px 8px 16px rgba(0, 0, 0, 0.2);
    }

    &:active:not(:disabled) {
      background-color: ${theme.colors.primaryActive};
      transform: translateY(0);
    }
  `,
  secondary: css`
    background-color: transparent;
    border: 2px solid ${theme.colors.surface};
    color: ${theme.colors.text.inverse};

    &:hover:not(:disabled) {
      background-color: rgba(255, 255, 255, 0.1);
      transform: translateY(-2px);
    }

    &:active:not(:disabled) {
      background-color: rgba(255, 255, 255, 0.2);
      transform: translateY(0);
    }
  `,
  outline: css`
    background-color: transparent;
    border: 2px solid ${theme.colors.border.default};
    color: ${theme.colors.text.primary};

    &:hover:not(:disabled) {
      border-color: ${theme.colors.primary};
      color: ${theme.colors.primary};
    }

    &:active:not(:disabled) {
      background-color: ${theme.colors.background};
    }
  `,
  text: css`
    background-color: transparent;
    border: none;
    color: ${theme.colors.text.link};
    padding: 0;
    height: auto;

    &:hover:not(:disabled) {
      color: ${theme.colors.text.linkHover};
      text-decoration: underline;
    }
  `,
};

export const StyledButton = styled.button<StyledButtonProps>`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${theme.spacing.sm};
  border-radius: ${theme.borderRadius.md};
  font-family: 'Roboto', sans-serif;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  width: ${(props) => (props.$fullWidth ? "100%" : "auto")};

  ${(props) => sizeStyles[props.$size]}
  ${(props) => variantStyles[props.$variant]}

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .icon {
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;
