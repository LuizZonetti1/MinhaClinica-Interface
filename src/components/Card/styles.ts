import styled from 'styled-components';
import { theme } from '../../themes/themes';

const paddingSizes = {
  small: '20px',
  medium: '32px',
  large: '48px',
};

export const StyledCard = styled.div<{ $padding: 'small' | 'medium' | 'large' }>`
  background-color: ${theme.colors.surface};
  border-radius: 20px;
  padding: ${props => paddingSizes[props.$padding]};
  box-shadow: 0px 25px 50px rgba(0, 0, 0, 0.35);
  width: 100%;
  max-width: 520px;
  max-height: calc(100vh - 32px);
  overflow-y: auto;
  overflow-x: hidden;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  
  /* Custom scrollbar */
  &::-webkit-scrollbar {
    width: 8px;
  }
  
  &::-webkit-scrollbar-track {
    background: ${theme.colors.background};
    border-radius: 4px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: ${theme.colors.border.default};
    border-radius: 4px;
    
    &:hover {
      background: ${theme.colors.border.light};
    }
  }
`;
