import styled from "styled-components";
import { theme } from "../../../themes/themes";

const EXPENSE_ACCENT_COLOR = "var(--mc-action-delete-text, #DC2626)";
const EXPENSE_BG_COLOR = "var(--mc-action-delete-bg, #FEE2E2)";

export const PageWrapper = styled.div`
  padding: 32px;
  display: flex;
  flex-direction: column;
  gap: 32px;
`;

export const PageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 16px;
  flex-wrap: wrap;
`;

export const PageTitle = styled.h2`
  font-family: 'Roboto', sans-serif;
  font-size: 28px;
  font-weight: 700;
  color: ${theme.colors.text.primary};
  margin: 0 0 6px;
`;

export const PageSubtitle = styled.p`
  font-family: 'Roboto', sans-serif;
  font-size: 14px;
  color: ${theme.colors.text.muted};
  margin: 0;
`;

export const HeaderControls = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  flex-shrink: 0;
  flex-wrap: wrap;
  justify-content: flex-end;
`;

export const PeriodSelect = styled.select`
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  color: ${theme.colors.text.primary};
  background-color: ${theme.colors.surface};
  border: 1.5px solid ${theme.colors.border.default};
  border-radius: ${theme.borderRadius.sm};
  padding: 8px 12px;
  outline: none;
  cursor: pointer;

  &:focus {
    border-color: ${theme.colors.border.focus};
  }
`;

export const TableCard = styled.div`
  background-color: ${theme.colors.surface};
  border: 1px solid ${theme.colors.border.light};
  border-radius: ${theme.borderRadius.lg};
  overflow: auto;
`;

export const TableElement = styled.table`
  width: 100%;
  min-width: 820px;
  border-collapse: collapse;

  th {
    text-align: left;
    padding: 14px 24px;
    font-family: "Roboto", sans-serif;
    font-size: 13px;
    letter-spacing: 0.04em;
    font-weight: 700;
    color: ${theme.colors.text.secondary};
    background-color: ${theme.colors.surfaceMuted};
  }

  td {
    padding: 16px 24px;
    font-family: "Roboto", sans-serif;
    font-size: 15px;
    color: ${theme.colors.text.primary};
    border-top: 1px solid ${theme.colors.border.light};
    vertical-align: middle;
  }
`;

export const EmptyStateCell = styled.td`
  text-align: center;
  color: ${theme.colors.text.secondary};
  padding: 24px;
`;

export const TransactionTypeBadge = styled.span<{ $type: "INCOME" | "EXPENSE" }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 2px 10px;
  border-radius: ${theme.borderRadius.sm};
  font-family: "Roboto", sans-serif;
  font-size: 12px;
  font-weight: 700;
  color: ${({ $type }) => ($type === "INCOME" ? theme.colors.success : EXPENSE_ACCENT_COLOR)};
  background-color: ${({ $type }) =>
    $type === "INCOME" ? theme.colors.featureBg.green : EXPENSE_BG_COLOR};
`;

export const TransactionAmount = styled.span<{ $type: "INCOME" | "EXPENSE" }>`
  font-family: "Roboto", sans-serif;
  font-size: 15px;
  font-weight: 700;
  color: ${({ $type }) => ($type === "INCOME" ? theme.colors.success : EXPENSE_ACCENT_COLOR)};
`;

export const StatusMessage = styled.p`
  font-family: 'Roboto', sans-serif;
  font-size: 15px;
  color: ${theme.colors.text.muted};
  margin: 0;
`;

export const ModalForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const FormRow = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;

  @media (max-width: ${theme.breakpoints.tablet}) {
    grid-template-columns: 1fr;
  }
`;

export const FormField = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

export const FormLabel = styled.label`
  font-family: 'Inter', sans-serif;
  font-size: 13px;
  font-weight: 500;
  color: ${theme.colors.text.secondary};
`;

export const FormInput = styled.input`
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  color: ${theme.colors.text.primary};
  background-color: ${theme.colors.surface};
  border: 1.5px solid ${theme.colors.border.default};
  border-radius: ${theme.borderRadius.sm};
  padding: 8px 12px;
  outline: none;
  width: 100%;
  box-sizing: border-box;

  &:focus {
    border-color: ${theme.colors.border.focus};
  }

  &::placeholder {
    color: ${theme.colors.text.disabled};
  }
`;

export const FormSelect = styled.select`
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  color: ${theme.colors.text.primary};
  background-color: ${theme.colors.surface};
  border: 1.5px solid ${theme.colors.border.default};
  border-radius: ${theme.borderRadius.sm};
  padding: 8px 12px;
  outline: none;
  cursor: pointer;
  width: 100%;
  box-sizing: border-box;

  &:focus {
    border-color: ${theme.colors.border.focus};
  }
`;

export const FormTextarea = styled.textarea`
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  color: ${theme.colors.text.primary};
  background-color: ${theme.colors.surface};
  border: 1.5px solid ${theme.colors.border.default};
  border-radius: ${theme.borderRadius.sm};
  padding: 8px 12px;
  outline: none;
  resize: vertical;
  min-height: 72px;
  width: 100%;
  box-sizing: border-box;

  &:focus {
    border-color: ${theme.colors.border.focus};
  }

  &::placeholder {
    color: ${theme.colors.text.disabled};
  }
`;
