import { Link } from "react-router";
import styled from "styled-components";
import { theme } from "../../../themes/themes";

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${theme.spacing.md};
  width: 100%;
  box-sizing: border-box;
  overflow-x: hidden;
`;

export const Title = styled.h2`
  font-family: 'Roboto', sans-serif;
  font-size: 20px;
  font-weight: 700;
  color: ${theme.colors.text.primary};
  margin: 0;
  align-self: flex-start;
`;

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.md};
  width: 100%;
`;

export const Footer = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
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
