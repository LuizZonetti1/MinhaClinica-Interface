import styled from 'styled-components';
import { theme } from '../../themes/themes';

export const CardWrapper = styled.a<{ $color: string }>`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 20px;
  border-radius: ${theme.borderRadius.lg};
  border: 1.5px solid ${theme.colors.border.light};
  background-color: ${theme.colors.surface};
  cursor: pointer;
  text-decoration: none;
  transition: box-shadow 0.15s, border-color 0.15s;

  &:hover {
    box-shadow: ${theme.shadows.sm};
    border-color: ${({ $color }) => $color}44;
  }
`;

export const QuickIcon = styled.img`
  width: 20px;
  height: 20px;
  flex-shrink: 0;
`;

export const QuickLabel = styled.span<{ $color: string }>`
  font-family: 'Roboto', sans-serif;
  font-size: 14px;
  font-weight: 500;
  color: ${({ $color }) => $color};
`;
