import styled from 'styled-components';
import { theme } from '../../themes/themes';

export const CardWrapper = styled.div`
  background-color: ${theme.colors.surface};
  border-radius: ${theme.borderRadius.md};
  box-shadow: ${theme.shadows.md};
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const IconBox = styled.div<{ $bgColor: string }>`
  width: 48px;
  height: 48px;
  border-radius: ${theme.borderRadius.sm};
  background-color: ${({ $bgColor }) => $bgColor};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  img {
    width: 24px;
    height: 24px;
  }

  span {
    display: flex;
    align-items: center;
    justify-content: center;
    line-height: 0;
  }

  svg {
    width: 24px;
    height: 24px;
  }
`;

export const StatLabel = styled.p`
  font-family: 'Roboto', sans-serif;
  font-size: 14px;
  font-weight: 400;
  color: ${theme.colors.text.secondary};
  margin: 0;
`;

export const StatValue = styled.p`
  font-family: 'Roboto', sans-serif;
  font-size: 32px;
  font-weight: 700;
  color: ${theme.colors.text.primary};
  margin: 0;
  line-height: 1.1;
`;
