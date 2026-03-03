import styled from 'styled-components';
import { theme } from '../../../themes/themes';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${theme.spacing.sm};
  width: 100%;
  box-sizing: border-box;
  overflow-x: hidden;
`;

export const EmailIcon = styled.div`
  position: relative;
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, #DBEAFE 0%, #BFDBFE 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${theme.colors.primary};
  margin: ${theme.spacing.sm} 0;

  svg {
    width: 32px;
    height: 32px;
  }

  .check-badge {
    position: absolute;
    bottom: 0;
    right: 0;
    width: 28px;
    height: 28px;
    background-color: ${theme.colors.success};
    border-radius: 50%;
    border: 3px solid ${theme.colors.surface};
    display: flex;
    align-items: center;
    justify-content: center;
    color: ${theme.colors.text.inverse};

    svg {
      width: 14px;
      height: 14px;
    }
  }
`;

export const Title = styled.h2`
  font-family: 'Roboto', sans-serif;
  font-size: 20px;
  font-weight: 700;
  color: ${theme.colors.text.primary};
  margin: 0;
  text-align: center;
`;

export const Description = styled.p`
  font-family: 'Roboto', sans-serif;
  font-size: 14px;
  font-weight: 400;
  color: ${theme.colors.text.muted};
  margin: 0;
  text-align: center;
  line-height: 1.5;

  strong {
    color: ${theme.colors.text.primary};
    font-weight: 500;
  }
`;

export const InfoBox = styled.div`
  display: flex;
  gap: ${theme.spacing.sm};
  padding: ${theme.spacing.md};
  background-color: #EFF6FF;
  border: 1px solid #BFDBFE;
  border-radius: ${theme.borderRadius.md};
  width: 100%;

  svg {
    flex-shrink: 0;
    color: ${theme.colors.primary};
    margin-top: 2px;
    width: 16px;
    height: 16px;
  }
`;

export const InfoText = styled.p`
  font-family: 'Roboto', sans-serif;
  font-size: 13px;
  font-weight: 400;
  line-height: 1.5;
  color: ${theme.colors.text.secondary};
  margin: 0 0 4px 0;
`;

export const ResendButton = styled.button`
  background: none;
  border: none;
  font-family: 'Roboto', sans-serif;
  font-size: 16px;
  font-weight: 500;
  color: ${theme.colors.text.link};
  cursor: pointer;
  transition: color 0.2s;

  &:hover {
    color: ${theme.colors.text.linkHover};
    text-decoration: underline;
  }
`;

export const ResendText = styled.p`
  font-family: 'Roboto', sans-serif;
  font-size: 16px;
  font-weight: 500;
  color: ${theme.colors.text.link};
  margin: 0;
`;
