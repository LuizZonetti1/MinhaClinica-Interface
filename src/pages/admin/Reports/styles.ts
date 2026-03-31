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
`;

export const TabRow = styled.div`
  display: flex;
  gap: 0;
  border-bottom: 2px solid ${theme.colors.border.light};
`;

export const TabButton = styled.button<{ $active: boolean }>`
  padding: 10px 24px;
  font-family: "Roboto", sans-serif;
  font-size: 14px;
  font-weight: 600;
  color: ${({ $active }) => ($active ? theme.colors.primary : theme.colors.text.secondary)};
  background: none;
  border: none;
  border-bottom: 2px solid ${({ $active }) => ($active ? theme.colors.primary : "transparent")};
  margin-bottom: -2px;
  cursor: pointer;
  transition: color 0.15s, border-color 0.15s;

  &:hover {
    color: ${theme.colors.primary};
  }
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

export const ExportButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  height: 40px;
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  font-weight: 500;
  color: ${theme.colors.text.inverse};
  background-color: ${theme.colors.primary};
  border: none;
  border-radius: ${theme.borderRadius.sm};
  padding: 0 18px;
  cursor: pointer;
  white-space: nowrap;
  transition: background-color 0.15s;

  &:hover {
    background-color: ${theme.colors.primaryHover};
  }

  &:active {
    background-color: ${theme.colors.primaryActive};
  }
`;

export const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;

  > div {
    border-top: 4px solid transparent;
  }

  > div:nth-child(1) {
    border-top-color: ${theme.colors.primary};
  }

  > div:nth-child(2) {
    border-top-color: ${theme.colors.warningHover};
  }

  > div:nth-child(3) {
    border-top-color: ${theme.colors.success};
  }

  > div:nth-child(4) {
    border-top-color: ${EXPENSE_ACCENT_COLOR};
  }

  @media (max-width: ${theme.breakpoints.desktop}) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: ${theme.breakpoints.tablet}) {
    grid-template-columns: 1fr;
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

export const ChartCard = styled.div`
  background-color: ${theme.colors.surface};
  border-radius: ${theme.borderRadius.lg};
  border: 1.5px solid ${theme.colors.border.lighter};
  box-shadow: ${theme.shadows.sm};
  padding: 24px;
`;

export const ChartHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 24px;
  flex-wrap: wrap;
  gap: 12px;
`;

export const ChartTitle = styled.h3`
  font-family: 'Roboto', sans-serif;
  font-size: 16px;
  font-weight: 600;
  color: ${theme.colors.text.primary};
  margin: 0 0 24px;
`;

export const FinancialSummary = styled.div`
  display: flex;
  gap: 24px;
`;

export const FinancialSummaryItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
  text-align: right;
`;

export const FinancialSummaryLabel = styled.p`
  font-family: 'Inter', sans-serif;
  font-size: 12px;
  color: ${theme.colors.text.muted};
  margin: 0;
`;

export const FinancialSummaryValue = styled.p<{ $color: string }>`
  font-family: 'Roboto', sans-serif;
  font-size: 15px;
  font-weight: 700;
  color: ${({ $color }) => $color};
  margin: 0;
`;

export const Grid2Col = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px;

  @media (max-width: ${theme.breakpoints.desktop}) {
    grid-template-columns: 1fr;
  }
`;

export const RankingList = styled.div`
  display: flex;
  flex-direction: column;
`;

export const RankingItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 0;

  &:not(:last-child) {
    border-bottom: 1px solid ${theme.colors.border.lighter};
  }
`;

export const RankingBadge = styled.span`
  font-family: 'Inter', sans-serif;
  font-size: 12px;
  font-weight: 600;
  color: ${theme.colors.primary};
  background-color: ${theme.colors.featureBg.blue};
  border-radius: ${theme.borderRadius.sm};
  padding: 2px 8px;
  white-space: nowrap;
  flex-shrink: 0;
`;

export const RankingInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

export const RankingName = styled.p`
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  font-weight: 500;
  color: ${theme.colors.text.primary};
  margin: 0;
`;

export const RankingSpecialty = styled.p`
  font-family: 'Inter', sans-serif;
  font-size: 12px;
  color: ${theme.colors.text.muted};
  margin: 0;
`;

export const RankingCount = styled.span`
  font-family: 'Inter', sans-serif;
  font-size: 13px;
  font-weight: 600;
  color: ${theme.colors.primary};
  white-space: nowrap;
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

