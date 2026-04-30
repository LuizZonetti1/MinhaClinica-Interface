import styled, { css } from "styled-components";
import { theme } from "../../../themes/themes";

export const PageWrapper = styled.div`
  padding: 32px;
`;

export const TopSection = styled.div`
  margin-bottom: 32px;
`;

export const PageTitle = styled.h1`
  margin: 0 0 6px;
  font-family: "Roboto", sans-serif;
  font-size: 24px;
  font-weight: 700;
  color: ${theme.colors.text.primary};
`;

export const PageSubtitle = styled.p`
  margin: 0;
  font-family: "Roboto", sans-serif;
  font-size: 15px;
  font-weight: 400;
  color: ${theme.colors.text.muted};
`;

export const CardGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
  margin-bottom: 32px;

  @media (max-width: ${theme.breakpoints.desktop}) {
    grid-template-columns: 1fr;
  }
`;

export const SectionCard = styled.div<{ $fullWidth?: boolean }>`
  background-color: ${theme.colors.surface};
  border: 1.5px solid ${theme.colors.border.light};
  border-radius: ${theme.borderRadius.lg};
  padding: 32px;
  box-shadow: ${theme.shadows.sm};

  ${({ $fullWidth }) =>
    $fullWidth &&
    css`
      grid-column: 1 / -1;
    `}
`;

export const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding-bottom: 16px;
  margin-bottom: 24px;
  border-bottom: 1.5px solid ${theme.colors.border.light};
  color: ${theme.colors.text.secondary};
`;

export const SectionHeaderTitle = styled.h3`
  margin: 0;
  font-family: "Roboto", sans-serif;
  font-size: 16px;
  font-weight: 600;
  color: ${theme.colors.text.primary};
`;

export const FormFields = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const FormFieldsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, minmax(180px, 1fr));
  gap: 16px;

  @media (max-width: 1280px) {
    grid-template-columns: repeat(3, minmax(180px, 1fr));
  }

  @media (max-width: 960px) {
    grid-template-columns: repeat(2, minmax(180px, 1fr));
  }

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

export const FieldGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const FieldLabel = styled.label`
  font-family: "Roboto", sans-serif;
  font-size: 14px;
  font-weight: 500;
  color: ${theme.colors.text.secondary};
`;

export const FieldSelect = styled.select`
  width: 100%;
  height: 48px;
  border-radius: ${theme.borderRadius.md};
  border: 1.5px solid ${theme.colors.border.light};
  background-color: ${theme.colors.surface};
  padding: 0 14px;
  font-family: "Roboto", sans-serif;
  font-size: 14px;
  color: ${theme.colors.text.primary};
  outline: none;

  &:focus {
    border-color: ${theme.colors.primary};
  }
`;

export const ToggleRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 16px 0;
  border-bottom: 1.5px solid ${theme.colors.border.lighter};

  &:last-child {
    border-bottom: none;
    padding-bottom: 0;
  }
`;

export const ToggleInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

export const ToggleName = styled.span`
  font-family: "Roboto", sans-serif;
  font-size: 14px;
  font-weight: 500;
  color: ${theme.colors.text.primary};
`;

export const ToggleDesc = styled.span`
  font-family: "Roboto", sans-serif;
  font-size: 12px;
  font-weight: 400;
  color: ${theme.colors.text.muted};
`;

export const TimeoutRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 16px 0;
  border-bottom: 1.5px solid ${theme.colors.border.lighter};
`;

export const TimeoutSelect = styled.select`
  width: 128px;
  height: 48px;
  border-radius: ${theme.borderRadius.md};
  border: 1.5px solid ${theme.colors.border.light};
  background-color: ${theme.colors.surface};
  padding: 0 12px;
  font-family: "Roboto", sans-serif;
  font-size: 14px;
  color: ${theme.colors.text.primary};
  flex-shrink: 0;
  outline: none;

  &:focus {
    border-color: ${theme.colors.primary};
  }
`;

export const PlanRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 16px 0 0;
`;

export const PlanInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

export const PlanName = styled.span`
  font-family: "Roboto", sans-serif;
  font-size: 14px;
  font-weight: 500;
  color: ${theme.colors.text.primary};
`;

export const PlanSubtext = styled.span`
  font-family: "Roboto", sans-serif;
  font-size: 12px;
  font-weight: 400;
  color: ${theme.colors.text.muted};
`;

export const GerenciarButton = styled.button`
  display: flex;
  align-items: center;
  gap: 6px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  font-family: "Roboto", sans-serif;
  font-size: 14px;
  font-weight: 600;
  color: #9333ea;
  white-space: nowrap;

  &:hover {
    opacity: 0.8;
  }
`;

export const SaveRow = styled.div`
  display: flex;
  justify-content: flex-end;
`;

