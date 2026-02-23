import styled from 'styled-components';
import { theme } from '../../themes/themes';

export const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0;
  width: 100%;
  margin: 0 auto;
`;

export const StepItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  flex-shrink: 0;
`;

export const StepCircle = styled.div<{ $status: 'completed' | 'active' | 'inactive' }>`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'Roboto', sans-serif;
  font-size: 14px;
  font-weight: 600;
  transition: all 0.3s;

  ${props => {
    if (props.$status === 'completed') {
      return `
        background-color: ${theme.colors.success};
        color: ${theme.colors.text.inverse};
        box-shadow: 0px 4px 8px rgba(22, 163, 74, 0.3);
      `;
    }
    if (props.$status === 'active') {
      return `
        background: linear-gradient(135deg, ${theme.colors.primary} 0%, ${theme.colors.primaryActive} 100%);
        color: ${theme.colors.text.inverse};
        box-shadow: 0px 4px 8px rgba(37, 99, 235, 0.3);
      `;
    }
    return `
      background-color: ${theme.colors.border.default};
      color: ${theme.colors.text.inverse};
    `;
  }}

  svg {
    width: 14px;
    height: 14px;
  }
`;

export const StepLabel = styled.span<{ $status: 'completed' | 'active' | 'inactive' }>`
  font-family: 'Roboto', sans-serif;
  font-size: 12px;
  font-weight: 600;
  color: ${props => {
    if (props.$status === 'completed') return theme.colors.success;
    if (props.$status === 'active') return theme.colors.primary;
    return theme.colors.text.muted;
  }};
  text-align: center;
  white-space: nowrap;
`;

export const StepLine = styled.div<{ $completed: boolean }>`
  width: 60px;
  height: 2px;
  background-color: ${props => (props.$completed ? theme.colors.primary : theme.colors.border.default)};
  flex-shrink: 0;
  align-self: flex-start;
  margin-top: 17px;
  margin-left: 10px;
  margin-right: 10px;
  transition: background-color 0.3s;
`;
