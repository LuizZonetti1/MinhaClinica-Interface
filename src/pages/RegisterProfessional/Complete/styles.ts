import styled from "styled-components";
import { theme } from "../../../themes/themes";

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${theme.spacing.md};
  width: 100%;
`;

export const Title = styled.h2`
  margin: 0;
  align-self: flex-start;
  font-family: "Roboto", sans-serif;
  font-size: 20px;
  font-weight: 700;
  color: ${theme.colors.text.primary};
  line-height: 1.2;
`;

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.md};
  width: 100%;
`;

export const Row = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${theme.spacing.sm};
  width: 100%;

  > * {
    min-width: 0;
  }

  @media (max-width: ${theme.breakpoints.tablet}) {
    grid-template-columns: 1fr;
  }
`;

export const ErrorText = styled.p`
  margin: 0;
  font-family: "Roboto", sans-serif;
  font-size: 13px;
  color: ${theme.colors.error};
`;

export const RequirementsText = styled.p`
  margin: 4px 0 0;
  font-family: "Roboto", sans-serif;
  font-size: 12px;
  line-height: 1.4;
  color: ${theme.colors.text.muted};
`;
