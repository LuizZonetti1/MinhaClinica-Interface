import styled from 'styled-components';
import { theme } from '../../themes/themes';

export const LogoContainer = styled.div<{ $variant: 'default' | 'auth' }>`
  display: flex;
  align-items: center;
  gap: ${props => (props.$variant === 'auth' ? '6px' : '16px')};
`;

export const IconWrapper = styled.div<{ $variant: 'default' | 'auth' }>`
  width: ${props => (props.$variant === 'auth' ? '28px' : '48px')};
  height: ${props => (props.$variant === 'auth' ? '28px' : '48px')};
  background-color: ${props => (props.$variant === 'auth' ? theme.colors.primary : theme.colors.surface)};
  border-radius: ${theme.borderRadius.sm};
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0px 10px 15px rgba(0, 0, 0, 0.1), 0px 4px 6px rgba(0, 0, 0, 0.05);

  svg {
    color: ${props => (props.$variant === 'auth' ? theme.colors.text.inverse : theme.colors.primary)};
    width: ${props => (props.$variant === 'auth' ? '16px' : '24px')};
    height: ${props => (props.$variant === 'auth' ? '16px' : '24px')};
  }
`;

export const TextWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

export const Title = styled.h1<{ $variant: 'default' | 'auth' }>`
  font-family: 'Roboto', sans-serif;
  font-weight: 700;
  font-size: ${props => (props.$variant === 'auth' ? '16px' : '24px')};
  line-height: ${props => (props.$variant === 'auth' ? '1.2' : '24px')};
  color: ${props => (props.$variant === 'auth' ? theme.colors.primaryHover : theme.colors.text.inverse)};
  margin: 0;
`;

export const Subtitle = styled.p`
  font-family: 'Roboto', sans-serif;
  font-weight: 400;
  font-size: 14px;
  line-height: 21px;
  color: ${theme.colors.text.inverse};
  opacity: 0.9;
  margin: 0;
`;
