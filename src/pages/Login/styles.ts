import { Link } from "react-router";
import styled from "styled-components";
import { theme } from "../../themes/themes";

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${theme.spacing.lg};
  width: 100%;
`;

export const Title = styled.h1`
  font-family: 'Roboto', sans-serif;
  font-size: 26px;
  font-weight: 700;
  color: ${theme.colors.text.primary};
  margin: 0;
`;

export const Subtitle = styled.p`
  font-family: 'Roboto', sans-serif;
  font-size: 15px;
  font-weight: 400;
  color: ${theme.colors.text.muted};
  margin: 0;
`;

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.lg};
  width: 100%;
  position: relative;
`;

export const RememberRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
`;

export const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.sm};
  font-family: 'Roboto', sans-serif;
  font-size: 14px;
  font-weight: 400;
  color: ${theme.colors.text.secondary};
  cursor: pointer;
`;

export const Checkbox = styled.input`
  width: 18px;
  height: 18px;
  cursor: pointer;
`;

export const ForgotLink = styled(Link)`
  font-family: 'Roboto', sans-serif;
  font-size: 14px;
  font-weight: 400;
  color: ${theme.colors.text.link};
  text-decoration: none;
  transition: color 0.2s;

  &:hover {
    color: ${theme.colors.text.linkHover};
    text-decoration: underline;
  }
`;

export const Footer = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  margin-top: ${theme.spacing.lg};
`;

export const FooterText = styled.p`
  font-family: 'Roboto', sans-serif;
  font-size: 14px;
  font-weight: 400;
  color: ${theme.colors.text.muted};
  margin: 0;
`;

export const FooterLink = styled(Link)`
  font-family: 'Roboto', sans-serif;
  font-size: 14px;
  font-weight: 400;
  color: ${theme.colors.text.link};
  text-decoration: none;
  margin-left: 4px;

  &:hover {
    color: ${theme.colors.text.linkHover};
    text-decoration: underline;
  }
`;

export const ErrorText = styled.p`
  font-family: 'Roboto', sans-serif;
  font-size: 13px;
  font-weight: 500;
  color: ${theme.colors.error};
  margin: 0;
  text-align: center;
`;
