import styled from 'styled-components';
import { theme } from '../../themes/themes';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  box-sizing: border-box;
  overflow-x: hidden;
`;

export const TabsList = styled.div`
  display: flex;
  flex-wrap: nowrap;
  border-bottom: 1px solid ${theme.colors.border.light};
  background-color: ${theme.colors.background};
  overflow-x: auto;
  
  /* Hide scrollbar but keep functionality */
  scrollbar-width: none;
  -ms-overflow-style: none;
  
  &::-webkit-scrollbar {
    display: none;
  }
`;

export const TabButton = styled.button<{
  $active: boolean;
  $disabled?: boolean;
  $completed?: boolean;
}>`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${theme.spacing.xs};
  padding: ${theme.spacing.md} ${theme.spacing.sm};
  background: none;
  border: none;
  border-bottom: 2px solid ${props =>
    props.$active
      ? theme.colors.primary
      : props.$completed
        ? theme.colors.success ?? '#22c55e'
        : 'transparent'};
  font-family: 'Roboto', sans-serif;
  font-size: 13px;
  font-weight: ${props => (props.$active ? '600' : '400')};
  color: ${props =>
    props.$disabled
      ? theme.colors.text.muted
      : props.$completed
        ? theme.colors.success ?? '#22c55e'
        : props.$active
          ? theme.colors.primary
          : theme.colors.text.muted};
  cursor: ${props => (props.$disabled ? 'not-allowed' : 'pointer')};
  opacity: ${props => (props.$disabled ? '0.5' : '1')};
  transition: all 0.2s;
  white-space: nowrap;
  min-width: 0;

  .icon {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;

    svg {
      width: 14px;
      height: 14px;
    }
  }

  &:hover {
    color: ${props =>
    props.$disabled
      ? theme.colors.text.muted
      : props.$completed
        ? theme.colors.success ?? '#22c55e'
        : theme.colors.primary};
    background-color: ${props => (props.$disabled ? 'transparent' : theme.colors.surfaceMuted)};
  }
`;

export const TabContent = styled.div`
  padding: ${theme.spacing.md} 0;
`;
