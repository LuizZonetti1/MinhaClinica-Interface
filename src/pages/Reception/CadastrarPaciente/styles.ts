import styled from "styled-components";
import { theme } from "../../../themes/themes";

export const PageWrapper = styled.div`
  padding: 32px;
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

export const PageTitle = styled.h1`
  font-family: 'Roboto', sans-serif;
  font-size: 24px;
  font-weight: 700;
  color: ${theme.colors.text.primary};
  margin: 0;
`;

export const FormCard = styled.div`
  background: ${theme.colors.surface};
  border: 1px solid ${theme.colors.border.light};
  border-radius: ${theme.borderRadius.lg};
  padding: 28px 32px;
  display: flex;
  flex-direction: column;
  gap: 28px;
`;

export const FormSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

export const SectionTitle = styled.h2`
  font-family: 'Roboto', sans-serif;
  font-size: 16px;
  font-weight: 600;
  color: ${theme.colors.text.primary};
  margin: 0;
`;

export const SectionOptionalTag = styled.span`
  font-size: 13px;
  font-weight: 400;
  color: ${theme.colors.text.muted};
  margin-left: 8px;
`;

export const FormDivider = styled.hr`
  border: none;
  border-top: 1px solid ${theme.colors.border.lighter};
  margin: 0;
`;

export const FormGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;

  @media (max-width: ${theme.breakpoints.tablet}) {
    grid-template-columns: 1fr;
  }
`;

export const FullWidthCell = styled.div`
  grid-column: span 2;

  @media (max-width: ${theme.breakpoints.tablet}) {
    grid-column: span 1;
  }
`;

// ─── Field block (label + control + error) ────────────────────────────────────

export const FieldBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  min-width: 0;
`;

export const FieldLabel = styled.label`
  font-family: 'Roboto', sans-serif;
  font-size: 14px;
  font-weight: 500;
  color: ${theme.colors.text.secondary};
`;

export const FieldError = styled.span`
  font-family: 'Roboto', sans-serif;
  font-size: 12px;
  color: ${theme.colors.error};
`;

// ─── Select — matches InputWrapper + StyledInput style ───────────────────────

export const FormSelect = styled.select<{ $hasError?: boolean }>`
  height: 48px;
  width: 100%;
  padding: 0 ${theme.spacing.md};
  border: 2px solid ${({ $hasError }) =>
    $hasError ? theme.colors.border.error : theme.colors.border.lighter};
  border-radius: ${theme.borderRadius.md};
  background: ${theme.colors.surface};
  font-family: 'Roboto', sans-serif;
  font-size: 14px;
  font-weight: 400;
  color: ${theme.colors.text.primary};
  outline: none;
  cursor: pointer;
  transition: border-color 0.2s;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%236B7280' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 14px center;
  padding-right: 36px;

  &:focus {
    border-color: ${({ $hasError }) =>
      $hasError ? theme.colors.border.error : theme.colors.border.focus};
  }

  option[value=""] {
    color: ${theme.colors.text.disabled};
  }
`;

// ─── Textarea — matches InputWrapper + StyledInput style ─────────────────────

export const FormTextarea = styled.textarea<{ $hasError?: boolean }>`
  width: 100%;
  min-height: 88px;
  padding: ${theme.spacing.md};
  border: 2px solid ${({ $hasError }) =>
    $hasError ? theme.colors.border.error : theme.colors.border.lighter};
  border-radius: ${theme.borderRadius.md};
  background: ${theme.colors.surface};
  font-family: 'Roboto', sans-serif;
  font-size: 14px;
  font-weight: 400;
  color: ${theme.colors.text.primary};
  outline: none;
  resize: vertical;
  transition: border-color 0.2s;
  box-sizing: border-box;

  &::placeholder {
    color: ${theme.colors.text.disabled};
    font-size: 13px;
  }

  &:focus {
    border-color: ${({ $hasError }) =>
      $hasError ? theme.colors.border.error : theme.colors.border.focus};
  }
`;

// ─── Form actions ─────────────────────────────────────────────────────────────

export const FormActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding-top: 4px;
`;
