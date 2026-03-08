import styled from 'styled-components';
import { theme } from '../../themes/themes';

type AlertType = 'warning' | 'success' | 'info';

const alertStyles = {
    warning: {
        bg: '#FEF3C7',
        border: theme.colors.warning,
    },
    success: {
        bg: '#F0FDF4',
        border: theme.colors.success,
    },
    info: {
        bg: '#EFF6FF',
        border: '#BFDBFE',
    },
};

export const AlertWrapper = styled.div<{ $type: AlertType }>`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  border-radius: ${theme.borderRadius.md};
  border-left: 3px solid ${({ $type }) => alertStyles[$type].border};
  background-color: ${({ $type }) => alertStyles[$type].bg};
`;

export const AlertIcon = styled.img`
  width: 18px;
  height: 18px;
  flex-shrink: 0;
`;

export const AlertText = styled.p`
  font-family: 'Roboto', sans-serif;
  font-size: 14px;
  font-weight: 400;
  color: ${theme.colors.border.dark};
  margin: 0;
`;
