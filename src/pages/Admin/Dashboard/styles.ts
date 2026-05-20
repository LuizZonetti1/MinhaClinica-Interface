import styled from 'styled-components';
import { theme } from '../../../themes/themes';

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

export const AlertsSection = styled.div``;

export const AlertsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const ChartCard = styled.div`
  background-color: ${theme.colors.surface};
  border-radius: ${theme.borderRadius.lg};
  border: 1.5px solid ${theme.colors.border.lighter};
  box-shadow: ${theme.shadows.sm};
  padding: 24px;
`;

export const ChartTitle = styled.h2`
  font-family: 'Roboto', sans-serif;
  font-size: 16px;
  font-weight: 600;
  color: ${theme.colors.text.primary};
  margin: 0 0 24px;
`;

export const QuickAccessSection = styled.div``;

export const QuickAccessGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 16px;

  @media (max-width: ${theme.breakpoints.desktop}) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: ${theme.breakpoints.tablet}) {
    grid-template-columns: 1fr;
  }
`;

// ─── Pacientes de Hoje (visível apenas quando role RECEPTIONIST está ativo) ───

export const TodayPatientsSection = styled.div``;

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
  font-size: 14px;
`;

export const TableHeaderRow = styled.tr`
  background: ${theme.colors.background};
  border-bottom: 1.5px solid ${theme.colors.border.lighter};
`;

export const TableHeaderCell = styled.th`
  text-align: left;
  padding: 12px 16px;
  font-weight: 600;
  color: ${theme.colors.text.secondary};
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.04em;
`;

export const TableRow = styled.tr`
  border-bottom: 1px solid ${theme.colors.border.lighter};
  transition: background 0.15s;
  &:last-child { border-bottom: none; }
  &:hover { background: ${theme.colors.background}; }
`;

export const TableCell = styled.td`
  padding: 14px 16px;
  color: ${theme.colors.text.primary};
`;

export const EmptyStateCell = styled.td`
  padding: 32px 16px;
  text-align: center;
  color: ${theme.colors.text.secondary};
  font-size: 14px;
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

export type TodayBadgeVariant = "waiting" | "checkin" | "progress" | "done" | "cancelled" | "noshow";

export const StatusBadge = styled.span<{ $variant: TodayBadgeVariant }>`
  display: inline-block;
  padding: 3px 10px;
  border-radius: 99px;
  font-size: 12px;
  font-weight: 600;

  ${({ $variant }) => {
    switch ($variant) {
      case "waiting": return `color: var(--mc-status-waiting-text, #92400e); background: var(--mc-status-waiting-bg, #fef3c7); border: 1px solid var(--mc-status-waiting-border, #fcd34d);`;
      case "checkin": return `color: var(--mc-status-checkin-text, #166534); background: var(--mc-status-checkin-bg, #dcfce7); border: 1px solid var(--mc-status-checkin-border, #86efac);`;
      case "progress": return `color: var(--mc-status-progress-text, #1e40af); background: var(--mc-status-progress-bg, #dbeafe); border: 1px solid var(--mc-status-progress-border, #93c5fd);`;
      case "done": return `color: var(--mc-status-done-text, #374151); background: var(--mc-status-done-bg, #f3f4f6); border: 1px solid var(--mc-status-done-border, #d1d5db);`;
      case "cancelled": return `color: var(--mc-status-cancelled-text, #991b1b); background: var(--mc-status-cancelled-bg, #fee2e2); border: 1px solid var(--mc-status-cancelled-border, #fca5a5);`;
      case "noshow": return `color: #7c3aed; background: #f5f3ff; border: 1px solid #ddd6fe;`;
      default: return "";
    }
  }}
`;
