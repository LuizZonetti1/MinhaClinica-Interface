import styled from 'styled-components';
import { theme } from '../../themes/themes';

export const Container = styled.div<{ $fullWidth: boolean }>`
  display: flex;
  flex-direction: column;
  gap: 6px;
  width: ${props => (props.$fullWidth ? '100%' : 'auto')};
  min-width: 0;
`;

export const Label = styled.label`
  font-family: 'Roboto', sans-serif;
  font-size: 14px;
  font-weight: 500;
  color: ${theme.colors.text.secondary};
`;

export const InputWrapper = styled.div<{ $hasError: boolean }>`
  position: relative;
  display: flex;
  align-items: center;
  background-color: ${theme.colors.surface};
  border: 2px solid ${props => (props.$hasError ? theme.colors.border.error : theme.colors.border.lighter)};
  border-radius: ${theme.borderRadius.md};
  transition: border-color 0.2s;
  min-width: 0;
  width: 100%;

  &:focus-within {
    border-color: ${props => (props.$hasError ? theme.colors.border.error : theme.colors.border.focus)};
  }

  .icon {
    display: flex;
    align-items: center;
    justify-content: center;
    color: ${theme.colors.text.muted};
    flex-shrink: 0;
    
    &.left {
      margin-left: ${theme.spacing.md};
    }
    
    &.right {
      margin-right: ${theme.spacing.md};
      cursor: pointer;
    }

    svg {
      width: 16px;
      height: 16px;
    }
  }
`;

export const StyledInput = styled.input<{ $hasIcon: boolean; $iconPosition: 'left' | 'right'; $hasRightIcon?: boolean }>`
  flex: 1;
  height: 48px;
  padding: 0 ${theme.spacing.md};
  padding-left: ${props => (props.$hasIcon && props.$iconPosition === 'left' ? theme.spacing.sm : theme.spacing.md)};
  padding-right: ${props => (props.$hasRightIcon || (props.$hasIcon && props.$iconPosition === 'right') ? theme.spacing.sm : theme.spacing.md)};
  border: none;
  background: none;
  outline: none;
  font-family: 'Roboto', sans-serif;
  font-size: 14px;
  font-weight: 400;
  color: ${theme.colors.text.primary};
  min-width: 0;

  &::placeholder {
    color: ${theme.colors.text.disabled};
    font-size: 13px;
  }
`;

export const ErrorMessage = styled.span`
  font-family: 'Roboto', sans-serif;
  font-size: 12px;
  font-weight: 400;
  color: ${theme.colors.error};
`;
