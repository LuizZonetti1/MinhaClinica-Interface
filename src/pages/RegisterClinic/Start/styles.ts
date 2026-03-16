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

export const Row = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${theme.spacing.sm};
  width: 100%;
  min-width: 0;

  > * {
    min-width: 0;
  }
`;

export const FieldGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.sm};
  width: 100%;
`;

export const Label = styled.label`
  font-family: 'Roboto', sans-serif;
  font-size: 14px;
  font-weight: 500;
  color: ${theme.colors.text.secondary};
  margin-bottom: 4px;
`;

export const Select = styled.select`
  height: 48px;
  padding: 0 ${theme.spacing.md};
  background-color: ${theme.colors.background};
  border: 2px solid ${theme.colors.border.lighter};
  border-radius: ${theme.borderRadius.md};
  font-family: 'Roboto', sans-serif;
  font-size: 14px;
  font-weight: 400;
  color: ${theme.colors.text.primary};
  width: 100%;
  cursor: pointer;
  outline: none;
  transition: border-color 0.2s;

  &:focus {
    border-color: ${theme.colors.primary};
  }
`;

export const Footer = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
`;

export const RequirementsText = styled.p`
  margin: 2px 0 0;
  font-family: "Roboto", sans-serif;
  font-size: 12px;
  line-height: 1.4;
  color: ${theme.colors.text.muted};
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
