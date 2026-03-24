import styled from "styled-components";
import { theme } from "../../../themes/themes";

export const PageWrapper = styled.div`
  padding: 32px;
  display: flex;
  flex-direction: column;
  gap: 32px;
`;

// ─── Hero Banner ──────────────────────────────────────────────────────────────

export const HeroBanner = styled.div`
  background: ${theme.colors.gradients.primary};
  border-radius: ${theme.borderRadius.lg};
  padding: 28px 32px;
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

export const HeroTitle = styled.h1`
  font-family: "Roboto", sans-serif;
  font-size: 24px;
  font-weight: 700;
  color: ${theme.colors.text.inverse};
  margin: 0;
`;

export const HeroSubtitle = styled.p`
  font-family: "Roboto", sans-serif;
  font-size: 15px;
  font-weight: 400;
  color: ${theme.colors.text.inverse};
  opacity: 0.9;
  margin: 0;
`;

// ─── Stats ────────────────────────────────────────────────────────────────────

export const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;

  @media (max-width: ${theme.breakpoints.desktop}) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: ${theme.breakpoints.tablet}) {
    grid-template-columns: 1fr;
  }
`;

// ─── Sections ─────────────────────────────────────────────────────────────────

export const SectionTitle = styled.h2`
  font-family: "Roboto", sans-serif;
  font-size: 18px;
  font-weight: 600;
  color: ${theme.colors.text.primary};
  margin: 0 0 16px;
`;

export const QuickAccessSection = styled.div``;

export const QuickAccessGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;

  @media (max-width: ${theme.breakpoints.desktop}) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: ${theme.breakpoints.tablet}) {
    grid-template-columns: 1fr;
  }
`;

// ─── Agenda Table ─────────────────────────────────────────────────────────────

export const TableCard = styled.div`
  background-color: ${theme.colors.surface};
  border-radius: ${theme.borderRadius.lg};
  border: 1.5px solid ${theme.colors.border.lighter};
  box-shadow: ${theme.shadows.sm};
  overflow: hidden;
`;

export const TableElement = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

export const TableHeaderRow = styled.tr`
  background-color: ${theme.colors.surfaceMuted};
`;

export const TableHeaderCell = styled.th`
  padding: 10px 24px;
  font-family: "Inter", sans-serif;
  font-size: 12px;
  font-weight: 600;
  color: ${theme.colors.text.muted};
  text-transform: uppercase;
  letter-spacing: 0.04em;
  text-align: left;
  border-bottom: 1px solid ${theme.colors.border.lighter};

  &:last-child {
    text-align: right;
  }
`;

export const TableRow = styled.tr`
  &:not(:last-child) {
    border-bottom: 1px solid ${theme.colors.border.lighter};
  }

  &:hover {
    background-color: ${theme.colors.surfaceMuted};
  }
`;

export const TableCell = styled.td`
  padding: 14px 24px;
  font-family: "Inter", sans-serif;
  font-size: 14px;
  color: ${theme.colors.text.primary};

  &:last-child {
    text-align: right;
  }
`;

export const TimeLabel = styled.span`
  font-family: "Roboto", sans-serif;
  font-size: 14px;
  font-weight: 600;
  color: ${theme.colors.primary};
`;

export const AppointmentTypeLabel = styled.span`
  font-family: "Inter", sans-serif;
  font-size: 13px;
  color: ${theme.colors.text.muted};
`;

export const StatusBadge = styled.span<{
  $variant:
    | "confirmed"
    | "scheduled"
    | "waiting"
    | "progress"
    | "completed"
    | "noshow"
    | "cancelled";
}>`
  display: inline-block;
  font-family: "Inter", sans-serif;
  font-size: 12px;
  font-weight: 500;
  padding: 3px 10px;
  border-radius: 9999px;
  white-space: nowrap;
  border: 1px solid transparent;

  ${({ $variant }) => {
    switch ($variant) {
      case "confirmed":
        return "background-color: #DBEAFE; color: #1E40AF; border-color: #BFDBFE;";
      case "scheduled":
        return "background-color: #FEF3C7; color: #92400E; border-color: #FDE68A;";
      case "waiting":
        return "background-color: #FEF3C7; color: #92400E; border-color: #FDE68A;";
      case "progress":
        return "background-color: #E0E7FF; color: #3730A3; border-color: #C7D2FE;";
      case "completed":
        return "background-color: #DCFCE7; color: #166534; border-color: #BBF7D0;";
      case "noshow":
        return "background-color: #FEE2E2; color: #991B1B; border-color: #FECACA;";
      case "cancelled":
        return "background-color: #F3F4F6; color: #374151; border-color: #E5E7EB;";
    }
  }}
`;

export const EmptyStateCell = styled.td`
  padding: 32px 24px;
  text-align: center;
  font-family: "Inter", sans-serif;
  font-size: 14px;
  color: ${theme.colors.text.muted};
`;
