import styled, { css } from "styled-components";
import { theme } from "../../../../themes/themes";

// ─── Page layout ──────────────────────────────────────────────────────────────

export const FormPageWrapper = styled.div`
  padding: 24px 20px 160px;
  display: flex;
  flex-direction: column;
  gap: 24px;
  max-width: 960px;
  margin: 0 auto;
  width: 100%;
`;

export const FormHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
`;

export const FormTitleGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

export const FormTitle = styled.h1`
  margin: 0;
  font-family: "Roboto", sans-serif;
  font-size: 22px;
  font-weight: 700;
  color: ${theme.colors.text.primary};
`;

export const FormSubtitle = styled.p`
  margin: 0;
  font-family: "Roboto", sans-serif;
  font-size: 13px;
  color: ${theme.colors.text.muted};
`;

// ─── Readonly fields (Bloco 1) ────────────────────────────────────────────────

export const ReadonlyFieldsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 12px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr 1fr;
  }

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

export const ReadonlyField = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

export const ReadonlyLabel = styled.label`
  font-family: "Roboto", sans-serif;
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.03em;
  text-transform: uppercase;
  color: ${theme.colors.text.muted};
`;

export const ReadonlyValue = styled.div`
  font-family: "Roboto", sans-serif;
  font-size: 14px;
  font-weight: 500;
  color: ${theme.colors.text.primary};
  background: ${theme.colors.surfaceMuted};
  border: 1px solid ${theme.colors.border.light};
  border-radius: 8px;
  padding: 10px 12px;
  cursor: default;

  &:hover {
    border-color: ${theme.colors.border.default};
  }
`;

export const StatusBadge = styled.span<{ $variant: "draft" | "finalized" }>`
  display: inline-flex;
  align-items: center;
  padding: 3px 10px;
  border-radius: 20px;
  font-family: "Roboto", sans-serif;
  font-size: 12px;
  font-weight: 600;

  ${({ $variant }) =>
    $variant === "finalized"
      ? css`
          color: #166534;
          background: #dcfce7;
          border: 1px solid #86efac;
        `
      : css`
          color: ${theme.colors.text.secondary};
          background: ${theme.colors.surfaceMuted};
          border: 1px solid ${theme.colors.border.light};
        `};
`;

// ─── Sections ─────────────────────────────────────────────────────────────────

export const SectionCard = styled.section`
  background: ${theme.colors.surface};
  border: 1px solid ${theme.colors.border.light};
  border-radius: 12px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const SectionTitle = styled.h2`
  margin: 0;
  font-family: "Roboto", sans-serif;
  font-size: 16px;
  font-weight: 700;
  color: ${theme.colors.text.primary};
`;

export const SectionBanner = styled.div<{ $variant?: "default" | "amber" }>`
  font-family: "Roboto", sans-serif;
  font-size: 13px;
  line-height: 1.5;
  padding: 12px 16px;
  border-radius: 8px;

  ${({ $variant }) =>
    $variant === "amber"
      ? css`
          color: #92400e;
          background: #fffbeb;
          border: 1px solid #fcd34d;
        `
      : css`
          color: #1e40af;
          background: #eff6ff;
          border: 1px solid #93c5fd;
        `};
`;

// ─── Form fields ──────────────────────────────────────────────────────────────

export const FormFieldGroup = styled.div<{ $error?: boolean }>`
  display: flex;
  flex-direction: column;
  gap: 4px;

  ${({ $error }) =>
    $error &&
    css`
      & textarea,
      & input,
      & select {
        border-color: ${theme.colors.border.error} !important;
      }
    `};
`;

export const FormLabel = styled.label`
  font-family: "Roboto", sans-serif;
  font-size: 14px;
  font-weight: 600;
  color: ${theme.colors.text.primary};
`;

export const FormSubLabel = styled.span`
  font-family: "Roboto", sans-serif;
  font-size: 12px;
  color: ${theme.colors.text.muted};
  margin-top: -2px;
`;

export const FormErrorText = styled.span`
  font-family: "Roboto", sans-serif;
  font-size: 12px;
  color: ${theme.colors.error};
  margin-top: 2px;
`;

export const FormTextarea = styled.textarea<{ $highlighted?: boolean }>`
  font-family: "Roboto", sans-serif;
  font-size: 14px;
  color: ${theme.colors.text.primary};
  background: ${theme.colors.surface};
  border: 1px solid ${theme.colors.border.light};
  border-radius: 8px;
  padding: 10px 12px;
  min-height: 80px;
  resize: vertical;
  outline: none;
  transition: border-color 0.2s;

  &:focus {
    border-color: ${theme.colors.primary.main};
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    background: ${theme.colors.surfaceMuted};
  }

  &::placeholder {
    color: ${theme.colors.text.disabled};
  }

  ${({ $highlighted }) =>
    $highlighted &&
    css`
      border-left: 3px solid ${theme.colors.primary.main};
      padding-left: 14px;
      background: #f8faff;
    `};
`;

export const FormInput = styled.input`
  font-family: "Roboto", sans-serif;
  font-size: 14px;
  color: ${theme.colors.text.primary};
  background: ${theme.colors.surface};
  border: 1px solid ${theme.colors.border.light};
  border-radius: 8px;
  padding: 10px 12px;
  height: 42px;
  outline: none;
  transition: border-color 0.2s;
  width: 100%;

  &:focus {
    border-color: ${theme.colors.primary.main};
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    background: ${theme.colors.surfaceMuted};
  }

  &::placeholder {
    color: ${theme.colors.text.disabled};
  }
`;

export const FormSelect = styled.select`
  font-family: "Roboto", sans-serif;
  font-size: 14px;
  color: ${theme.colors.text.primary};
  background: ${theme.colors.surface};
  border: 1px solid ${theme.colors.border.light};
  border-radius: 8px;
  padding: 10px 12px;
  height: 42px;
  outline: none;
  transition: border-color 0.2s;
  width: 100%;
  cursor: pointer;

  &:focus {
    border-color: ${theme.colors.primary.main};
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    background: ${theme.colors.surfaceMuted};
  }
`;

export const FormRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;

  @media (max-width: 560px) {
    grid-template-columns: 1fr;
  }
`;

export const FormRow3Col = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 12px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr 1fr;
  }

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

// ─── Dynamic list ─────────────────────────────────────────────────────────────

export const DynamicListContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const DynamicListItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 14px;
  border: 1px solid ${theme.colors.border.light};
  border-radius: 10px;
  background: ${theme.colors.surface};
  position: relative;
`;

export const DynamicListItemHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const DynamicListItemNumber = styled.span`
  font-family: "Roboto", sans-serif;
  font-size: 12px;
  font-weight: 600;
  color: ${theme.colors.text.muted};
  text-transform: uppercase;
  letter-spacing: 0.03em;
`;

export const DynamicListRemoveBtn = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border: none;
  border-radius: 6px;
  background: transparent;
  color: ${theme.colors.text.muted};
  cursor: pointer;
  transition: all 0.15s;

  &:hover {
    background: #fee2e2;
    color: #dc2626;
  }

  &:disabled {
    opacity: 0.3;
    cursor: not-allowed;
    &:hover {
      background: transparent;
      color: ${theme.colors.text.muted};
    }
  }
`;

export const DynamicListAddButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 10px 16px;
  border: 1px dashed ${theme.colors.border.default};
  border-radius: 8px;
  background: transparent;
  font-family: "Roboto", sans-serif;
  font-size: 13px;
  font-weight: 600;
  color: ${theme.colors.primary.main};
  cursor: pointer;
  transition: all 0.15s;

  &:hover {
    background: ${theme.colors.primary.main}08;
    border-color: ${theme.colors.primary.main};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

// ─── Footer ───────────────────────────────────────────────────────────────────

export const FormFooterWrapper = styled.div`
  position: fixed;
  bottom: 0;
  left: 256px;
  right: 0;
  background: ${theme.colors.surface};
  border-top: 1px solid ${theme.colors.border.light};
  padding: 12px 24px;
  z-index: 100;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
`;

export const AutosaveIndicator = styled.span`
  font-family: "Roboto", sans-serif;
  font-size: 11px;
  color: ${theme.colors.text.muted};
`;

export const FooterActions = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  flex-wrap: wrap;
`;

// ─── Preview block ────────────────────────────────────────────────────────────

export const PreviewBlock = styled.div`
  font-family: "Roboto", sans-serif;
  font-size: 13px;
  line-height: 1.6;
  color: ${theme.colors.text.secondary};
  background: ${theme.colors.surfaceMuted};
  border: 1px solid ${theme.colors.border.light};
  border-radius: 8px;
  padding: 14px 16px;
  font-style: italic;
`;

// ─── Checkbox field ───────────────────────────────────────────────────────────

export const CheckboxField = styled.label`
  display: flex;
  align-items: flex-start;
  gap: 10px;
  cursor: pointer;
  font-family: "Roboto", sans-serif;
  font-size: 14px;
  color: ${theme.colors.text.primary};
  line-height: 1.4;

  input[type="checkbox"] {
    width: 18px;
    height: 18px;
    margin-top: 2px;
    accent-color: ${theme.colors.primary.main};
    cursor: pointer;
    flex-shrink: 0;
  }
`;

// ─── Financial summary (Budget) ───────────────────────────────────────────────

export const FinancialSummaryBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 16px;
  background: ${theme.colors.surfaceMuted};
  border: 1px solid ${theme.colors.border.light};
  border-radius: 10px;
`;

export const FinancialRow = styled.div<{ $highlight?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-family: "Roboto", sans-serif;
  font-size: 14px;
  color: ${theme.colors.text.primary};

  ${({ $highlight }) =>
    $highlight &&
    css`
      font-size: 16px;
      font-weight: 700;
      padding-top: 8px;
      border-top: 1px solid ${theme.colors.border.light};
    `};
`;

export const FinancialLabel = styled.span`
  color: ${theme.colors.text.secondary};
`;

export const FinancialValue = styled.span`
  font-weight: 600;
`;

// ─── Payment methods checkboxes ───────────────────────────────────────────────

export const PaymentMethodsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 8px;

  @media (max-width: 560px) {
    grid-template-columns: 1fr 1fr;
  }
`;

// ─── Loading ──────────────────────────────────────────────────────────────────

export const LoadingWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 64px 24px;
  font-family: "Roboto", sans-serif;
  font-size: 14px;
  color: ${theme.colors.text.muted};
`;

export const ErrorWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 64px 24px;
  font-family: "Roboto", sans-serif;
  font-size: 14px;
  color: ${theme.colors.error};
`;
