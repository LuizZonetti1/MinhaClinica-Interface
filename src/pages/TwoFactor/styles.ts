import styled from "styled-components";
import { theme } from "../../themes/themes";

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${theme.spacing.lg};
  width: 100%;
`;

export const IconWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 72px;
  height: 72px;
  border-radius: 50%;
  background: ${theme.colors.primary}1A;
  color: ${theme.colors.primary};
`;

export const Title = styled.h1`
  font-family: 'Roboto', sans-serif;
  font-size: 22px;
  font-weight: 700;
  color: ${theme.colors.text.primary};
  margin: 0;
  text-align: center;
`;

export const Subtitle = styled.p`
  font-family: 'Roboto', sans-serif;
  font-size: 14px;
  font-weight: 400;
  color: ${theme.colors.text.muted};
  margin: 0;
  text-align: center;
  line-height: 1.5;
`;

export const CodeInputWrapper = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  margin-top: 8px;
`;

export const CodeInput = styled.input`
  width: 100%;
  max-width: 220px;
  padding: 14px 16px;
  font-size: 28px;
  font-weight: 700;
  letter-spacing: 8px;
  text-align: center;
  border: 2px solid ${theme.colors.border};
  border-radius: 10px;
  background: ${theme.colors.background};
  color: ${theme.colors.text.primary};
  outline: none;
  transition: border-color 0.2s;

  &:focus {
    border-color: ${theme.colors.primary};
  }

  &::placeholder {
    color: ${theme.colors.text.disabled};
    letter-spacing: 6px;
  }
`;

export const CodeHint = styled.p`
  font-family: 'Roboto', sans-serif;
  font-size: 12px;
  font-weight: 400;
  color: ${theme.colors.text.disabled};
  margin: 8px 0 0;
  text-align: center;
`;

export const ErrorText = styled.p`
  font-family: 'Roboto', sans-serif;
  font-size: 13px;
  font-weight: 500;
  color: ${theme.colors.error};
  margin: 8px 0 0;
  text-align: center;
`;
