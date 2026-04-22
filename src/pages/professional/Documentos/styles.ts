import styled, { css } from "styled-components";
import { theme } from "../../../themes/themes";

// ─── Layout ───────────────────────────────────────────────────────────────────

export const PageWrapper = styled.div`
  padding: 24px 20px 48px;
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

export const PageHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
`;

export const PageTitleGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

export const PageTitle = styled.h1`
  margin: 0;
  font-family: "Roboto", sans-serif;
  font-size: 22px;
  font-weight: 700;
  color: ${theme.colors.text.primary};
`;

export const PageSubtitle = styled.p`
  margin: 0;
  font-family: "Roboto", sans-serif;
  font-size: 13px;
  color: ${theme.colors.text.muted};
`;

export const HeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
`;

// ─── Appointment info bar ─────────────────────────────────────────────────────

export const AppointmentInfoBar = styled.div`
  display: flex;
  align-items: center;
  gap: 24px;
  padding: 14px 20px;
  border-radius: 12px;
  border: 1px solid ${theme.colors.border.light};
  background: ${theme.colors.surface};
  flex-wrap: wrap;
`;

export const InfoBarItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

export const InfoBarLabel = styled.span`
  font-family: "Roboto", sans-serif;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: ${theme.colors.text.muted};
`;

export const InfoBarValue = styled.span`
  font-family: "Roboto", sans-serif;
  font-size: 13px;
  font-weight: 500;
  color: ${theme.colors.text.primary};
`;

export type ConsultaStatusVariant =
  | "inProgress"
  | "completed"
  | "scheduled"
  | "withAddendum"
  | "default";

const consultaStatusStyles: Record<ConsultaStatusVariant, ReturnType<typeof css>> = {
  inProgress: css`
    color: #1e40af;
    background: #dbeafe;
    border: 1px solid #93c5fd;
  `,
  completed: css`
    color: #166534;
    background: #dcfce7;
    border: 1px solid #86efac;
  `,
  scheduled: css`
    color: #92400e;
    background: #fef3c7;
    border: 1px solid #fcd34d;
  `,
  withAddendum: css`
    color: #5b21b6;
    background: #ede9fe;
    border: 1px solid #c4b5fd;
  `,
  default: css`
    color: ${theme.colors.text.secondary};
    background: ${theme.colors.surfaceMuted};
    border: 1px solid ${theme.colors.border.light};
  `,
};

export const InfoBarStatusBadge = styled.span<{ $variant: ConsultaStatusVariant }>`
  display: inline-flex;
  align-items: center;
  padding: 3px 10px;
  border-radius: 20px;
  font-family: "Roboto", sans-serif;
  font-size: 12px;
  font-weight: 600;
  ${({ $variant }) => consultaStatusStyles[$variant]};
`;

// ─── Section ──────────────────────────────────────────────────────────────────

export const SectionTitle = styled.h2`
  margin: 0 0 14px;
  font-family: "Roboto", sans-serif;
  font-size: 15px;
  font-weight: 600;
  color: ${theme.colors.text.primary};
`;

// ─── Document type cards ──────────────────────────────────────────────────────

export const DocTypeGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;

  @media (max-width: 900px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 560px) {
    grid-template-columns: 1fr;
  }
`;

export const DocTypeCard = styled.button`
  display: flex;
  align-items: flex-start;
  gap: 16px;
  padding: 20px;
  border-radius: 12px;
  border: 1px solid ${theme.colors.border.light};
  background: ${theme.colors.surface};
  cursor: pointer;
  text-align: left;
  transition: border-color 0.15s ease, box-shadow 0.15s ease;

  &:hover {
    border-color: ${theme.colors.primary};
    box-shadow: 0 2px 8px rgba(59, 130, 246, 0.12);
  }

  &:active {
    background: ${theme.colors.surfaceMuted};
  }
`;

export const DocTypeIconWrap = styled.span<{ $bg: string; $color: string }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 38px;
  height: 38px;
  border-radius: 10px;
  flex-shrink: 0;
  background: ${({ $bg }) => $bg};
  color: ${({ $color }) => $color};
`;

export const DocTypeInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 3px;
`;

export const DocTypeLabel = styled.span`
  font-family: "Roboto", sans-serif;
  font-size: 16px;
  font-weight: 600;
  color: ${theme.colors.text.primary};
`;

export const DocTypeDescription = styled.span`
  font-family: "Roboto", sans-serif;
  font-size: 14px;
  color: ${theme.colors.text.muted};
  line-height: 1.4;
`;

// ─── Documents table ──────────────────────────────────────────────────────────

export const DocsTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  background: ${theme.colors.surface};
  border-radius: 12px;
  border: 1px solid ${theme.colors.border.light};
  overflow: hidden;
`;

export const DocsTableHead = styled.thead`
  background: ${theme.colors.surfaceMuted};
`;

export const DocsTableTh = styled.th`
  padding: 10px 16px;
  font-family: "Roboto", sans-serif;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  color: ${theme.colors.text.muted};
  text-align: left;
`;

export const DocsTableBody = styled.tbody``;

export const DocsTableRow = styled.tr`
  border-top: 1px solid ${theme.colors.border.lighter};

  &:hover {
    background: ${theme.colors.surfaceMuted};
  }
`;

export const DocsTableTd = styled.td`
  padding: 12px 16px;
  font-family: "Roboto", sans-serif;
  font-size: 13px;
  color: ${theme.colors.text.primary};
  vertical-align: middle;
`;

export type DocStatusVariant = "draft" | "finalized" | "sent" | "addendum";

const docStatusStyles: Record<DocStatusVariant, ReturnType<typeof css>> = {
  draft: css`
    color: ${theme.colors.text.secondary};
    background: ${theme.colors.surfaceMuted};
    border: 1px solid ${theme.colors.border.light};
  `,
  finalized: css`
    color: #166534;
    background: #dcfce7;
    border: 1px solid #86efac;
  `,
  sent: css`
    color: #1e40af;
    background: #dbeafe;
    border: 1px solid #93c5fd;
  `,
  addendum: css`
    color: #5b21b6;
    background: #ede9fe;
    border: 1px solid #c4b5fd;
  `,
};

export const DocStatusBadge = styled.span<{ $variant: DocStatusVariant }>`
  display: inline-flex;
  align-items: center;
  padding: 3px 10px;
  border-radius: 20px;
  font-family: "Roboto", sans-serif;
  font-size: 12px;
  font-weight: 600;
  ${({ $variant }) => docStatusStyles[$variant]};
`;

export const DocActionsCell = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
`;

export const DocActionBtn = styled.button<{ $danger?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  border-radius: 8px;
  border: 1px solid ${({ $danger }) => ($danger ? "#fca5a5" : theme.colors.border.light)};
  background: ${({ $danger }) => ($danger ? "#fff1f2" : theme.colors.surface)};
  color: ${({ $danger }) => ($danger ? theme.colors.error : theme.colors.text.secondary)};
  cursor: pointer;
  transition: background 0.15s ease, border-color 0.15s ease;

  &:hover {
    background: ${({ $danger }) => ($danger ? "#fee2e2" : theme.colors.surfaceMuted)};
    border-color: ${({ $danger }) => ($danger ? theme.colors.error : theme.colors.primary)};
    color: ${({ $danger }) => ($danger ? theme.colors.error : theme.colors.primary)};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export const EmptyTableMessage = styled.td`
  padding: 24px 16px;
  font-family: "Roboto", sans-serif;
  font-size: 13px;
  color: ${theme.colors.text.muted};
  text-align: center;
`;

// ─── States ───────────────────────────────────────────────────────────────────

export const StatusMessage = styled.p<{ $error?: boolean }>`
  font-family: "Roboto", sans-serif;
  font-size: 14px;
  color: ${({ $error }) => ($error ? theme.colors.error : theme.colors.text.muted)};
  text-align: center;
  padding: 32px 0;
`;
