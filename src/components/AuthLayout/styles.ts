import styled from 'styled-components';
import { theme } from '../../themes/themes';

export const Container = styled.div`
  min-height: 100vh;
  width: 100%;
  background: ${theme.colors.gradients.primary};
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px ${theme.spacing.xl};
  overflow-y: auto;
`;

export const Content = styled.div`
  width: 100%;
  max-width: 520px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${theme.spacing.xl};
  margin: auto;
`;
