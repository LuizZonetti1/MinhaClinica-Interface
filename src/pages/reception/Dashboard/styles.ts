import styled from "styled-components";
import { theme } from "../../../themes/themes";

export const PageWrapper = styled.div`
  padding: 32px;
  display: flex;
  flex-direction: column;
  gap: 32px;
`;

export const HeroBanner = styled.div`
  background: ${theme.colors.gradients.primary};
  border-radius: ${theme.borderRadius.lg};
  padding: 28px 32px;
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

export const HeroTitle = styled.h1`
  font-family: 'Roboto', sans-serif;
  font-size: 24px;
  font-weight: 700;
  color: ${theme.colors.text.inverse};
  margin: 0;
`;

export const HeroSubtitle = styled.p`
  font-family: 'Roboto', sans-serif;
  font-size: 15px;
  font-weight: 400;
  color: ${theme.colors.text.inverse};
  opacity: 0.9;
  margin: 0;
`;

export const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;

  @media (max-width: ${theme.breakpoints.desktop}) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: ${theme.breakpoints.tablet}) {
    grid-template-columns: 1fr;
  }
`;

export const SectionTitle = styled.h2`
  font-family: 'Roboto', sans-serif;
  font-size: 18px;
  font-weight: 600;
  color: ${theme.colors.text.primary};
  margin: 0 0 16px;
`;

export const QuickAccessSection = styled.div``;

export const QuickAccessGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;

  @media (max-width: ${theme.breakpoints.desktop}) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: ${theme.breakpoints.tablet}) {
    grid-template-columns: 1fr;
  }
`;

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
  font-family: 'Inter', sans-serif;
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
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  color: ${theme.colors.text.primary};

  &:last-child {
    text-align: right;
  }
`;

export const TimeLabel = styled.span`
  font-family: 'Roboto', sans-serif;
  font-size: 14px;
  font-weight: 600;
  color: ${theme.colors.primary};
`;

export const DoctorLabel = styled.span`
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  color: ${theme.colors.text.muted};
`;

export const StatusBadge = styled.span<{
  $variant: "waiting" | "checkin" | "progress" | "done" | "cancelled" | "noshow";
}>`
  display: inline-block;
  font-family: 'Inter', sans-serif;
  font-size: 12px;
  font-weight: 500;
  padding: 3px 10px;
  border-radius: 9999px;
  white-space: nowrap;
  border: 1px solid transparent;

  ${({ $variant }) => {
    switch ($variant) {
      case "waiting":
        return "background-color: var(--mc-status-waiting-bg); color: var(--mc-status-waiting-text); border-color: var(--mc-status-waiting-border);";
      case "checkin":
        return "background-color: var(--mc-status-checkin-bg); color: var(--mc-status-checkin-text); border-color: var(--mc-status-checkin-border);";
      case "progress":
        return "background-color: var(--mc-status-progress-bg); color: var(--mc-status-progress-text); border-color: var(--mc-status-progress-border);";
      case "done":
        return "background-color: var(--mc-status-done-bg); color: var(--mc-status-done-text); border-color: var(--mc-status-done-border);";
      case "cancelled":
        return "background-color: var(--mc-status-cancelled-bg); color: var(--mc-status-cancelled-text); border-color: var(--mc-status-cancelled-border);";
      case "noshow":
        return "background-color: #FEF3C7; color: #92400E; border-color: #FCD34D;";
    }
  }}
`;

export const EmptyStateCell = styled.td`
  padding: 32px 24px;
  text-align: center;
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  color: ${theme.colors.text.muted};
`;

export const CheckInButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 5px 12px;
  border-radius: ${theme.borderRadius.md};
  border: 1px solid #6ee7b7;
  background: #d1fae5;
  color: #065f46;
  font-family: 'Inter', sans-serif;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  white-space: nowrap;
  transition: filter 0.15s;

  &:hover:not(:disabled) {
    filter: brightness(0.95);
  }

  &:disabled {
    opacity: 0.6;
    cursor: default;
  }
`;
