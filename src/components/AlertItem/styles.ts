import styled from 'styled-components';
import { theme } from '../../themes/themes';

type AlertType = 'warning' | 'success' | 'info';

const alertStyles = {
    warning: {
        bg: 'rgba(234, 179, 8, 0.14)',
        outline: 'rgba(234, 179, 8, 0.28)',
        border: theme.colors.warning,
    },
    success: {
        bg: 'rgba(34, 197, 94, 0.14)',
        outline: 'rgba(34, 197, 94, 0.28)',
        border: theme.colors.success,
    },
    info: {
        bg: 'rgba(14, 165, 233, 0.14)',
        outline: 'rgba(14, 165, 233, 0.28)',
        border: theme.colors.info,
    },
};

export const AlertWrapper = styled.div<{ $type: AlertType }>`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  border-radius: ${theme.borderRadius.md};
  border: 1px solid ${({ $type }) => alertStyles[$type].outline};
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
  color: ${theme.colors.text.primary};
  margin: 0;
`;
