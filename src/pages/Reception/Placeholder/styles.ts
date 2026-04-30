import styled from "styled-components";
import { theme } from "../../../themes/themes";

export const PageWrapper = styled.section`
  padding: 32px;
`;

export const Card = styled.div`
  background-color: ${theme.colors.surface};
  border: 1.5px solid ${theme.colors.border.lighter};
  border-radius: ${theme.borderRadius.lg};
  box-shadow: ${theme.shadows.sm};
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const Title = styled.h1`
  margin: 0;
  font-family: "Roboto", sans-serif;
  font-size: 24px;
  font-weight: 700;
  color: ${theme.colors.text.primary};
`;

export const Description = styled.p`
  margin: 0;
  font-family: "Inter", sans-serif;
  font-size: 14px;
  color: ${theme.colors.text.muted};
`;
