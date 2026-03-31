import styled, { css } from "styled-components";
import { theme } from "../../../themes/themes";

export const PageWrapper = styled.div`
  padding: 32px;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const HeaderRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
`;

export const PageTitle = styled.h1`
  margin: 0;
  font-family: "Roboto", sans-serif;
  font-size: 32px;
  font-weight: 700;
  color: ${theme.colors.text.primary};
`;

export const SearchRow = styled.div`
  margin-top: 2px;
`;

export const FiltersRow = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
`;

export const FilterChip = styled.button<{ $active: boolean }>`
  height: 34px;
  padding: 0 14px;
  border-radius: 999px;
  border: 1px solid
    ${({ $active }) => ($active ? theme.colors.primary : theme.colors.border.default)};
  background: ${({ $active }) => ($active ? theme.colors.primary : theme.colors.surface)};
  color: ${({ $active }) => ($active ? theme.colors.text.inverse : theme.colors.text.secondary)};
  font-family: "Roboto", sans-serif;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    border-color: ${theme.colors.primary};
    color: ${({ $active }) => ($active ? theme.colors.text.inverse : theme.colors.primary)};
  }
`;

export const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 14px;

  @media (max-width: ${theme.breakpoints.desktop}) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: ${theme.breakpoints.tablet}) {
    grid-template-columns: 1fr;
  }
`;

export const HistoryList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const HistoryCard = styled.div`
  background: ${theme.colors.surface};
  border: 1px solid ${theme.colors.border.light};
  border-radius: ${theme.borderRadius.lg};
  box-shadow: ${theme.shadows.sm};
  overflow: hidden;
`;

export const CardTopBar = styled.div`
  min-height: 34px;
  background: ${theme.colors.surfaceMuted};
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding: 6px 16px;
`;

export type AppointmentBadgeVariant = "completed" | "noshow" | "cancelled" | "rescheduled" | "default";

const badgeVariantStyles: Record<AppointmentBadgeVariant, ReturnType<typeof css>> = {
  completed: css`
    color: var(--mc-status-done-text, #374151);
    background: var(--mc-status-done-bg, #f3f4f6);
    border: 1px solid var(--mc-status-done-border, #d1d5db);
  `,
  noshow: css`
    color: var(--mc-status-cancelled-text, #991b1b);
    background: var(--mc-status-cancelled-bg, #fee2e2);
    border: 1px solid var(--mc-status-cancelled-border, #fca5a5);
  `,
  cancelled: css`
    color: var(--mc-status-cancelled-text, #991b1b);
    background: var(--mc-status-cancelled-bg, #fee2e2);
    border: 1px solid var(--mc-status-cancelled-border, #fca5a5);
  `,
  rescheduled: css`
    color: var(--mc-status-waiting-text, #92400e);
    background: var(--mc-status-waiting-bg, #fef3c7);
    border: 1px solid var(--mc-status-waiting-border, #fcd34d);
  `,
  default: css`
    color: ${theme.colors.text.secondary};
    background: ${theme.colors.border.lighter};
    border: 1px solid ${theme.colors.border.default};
  `,
};

export const StatusBadge = styled.span<{ $variant: AppointmentBadgeVariant }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 999px;
  padding: 4px 10px;
  font-family: "Roboto", sans-serif;
  font-size: 12px;
  font-weight: 600;
  line-height: 1;
  ${({ $variant }) => badgeVariantStyles[$variant]}
`;

export const CardCode = styled.span`
  font-family: "Roboto", sans-serif;
  font-size: 12px;
  font-weight: 500;
  color: ${theme.colors.text.disabled};
`;

export const CardBody = styled.div`
  padding: 18px 16px 14px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;

  @media (max-width: ${theme.breakpoints.tablet}) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

export const ProfessionalBlock = styled.div`
  min-width: 0;
  flex: 1;
`;

export const ProfessionalName = styled.h3`
  margin: 0;
  font-family: "Roboto", sans-serif;
  font-size: 28px;
  font-weight: 700;
  color: ${theme.colors.text.primary};
  line-height: 1.15;

  @media (max-width: ${theme.breakpoints.desktop}) {
    font-size: 22px;
  }
`;

export const SpecialtyText = styled.p`
  margin: 8px 0 4px;
  font-family: "Roboto", sans-serif;
  font-size: 15px;
  font-weight: 400;
  color: ${theme.colors.text.muted};
`;

export const ClinicText = styled.p`
  margin: 0;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-family: "Roboto", sans-serif;
  font-size: 13px;
  color: ${theme.colors.text.disabled};
`;

export const DatePill = styled.div`
  min-height: 36px;
  border: 1px solid var(--mc-status-progress-border, #93c5fd);
  background: var(--mc-status-progress-bg, #dbeafe);
  color: var(--mc-status-progress-text, #1e40af);
  border-radius: 12px;
  padding: 8px 12px;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-family: "Roboto", sans-serif;
  font-size: 13px;
  font-weight: 600;
`;

export const ActionRow = styled.div`
  margin-top: 16px;
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const ViewButton = styled.button`
  height: 32px;
  border: 1px solid var(--mc-action-border, #bfdbfe);
  background: var(--mc-action-edit-bg, #eff6ff);
  color: var(--mc-action-edit-text, #1d4ed8);
  border-radius: 8px;
  padding: 0 12px;
  font-family: "Roboto", sans-serif;
  font-size: 13px;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;

  &:hover {
    filter: brightness(1.06);
  }
`;

export const StatusMessage = styled.p<{ $error?: boolean }>`
  margin: 8px 0;
  font-family: "Roboto", sans-serif;
  font-size: 14px;
  color: ${({ $error }) => ($error ? theme.colors.error : theme.colors.text.secondary)};
`;

export const EmptyState = styled.div`
  min-height: 140px;
  border: 1px dashed ${theme.colors.border.default};
  border-radius: ${theme.borderRadius.lg};
  background: ${theme.colors.surface};
  color: ${theme.colors.text.muted};
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  font-family: "Roboto", sans-serif;
  font-size: 14px;
  text-align: center;
`;

export const ModalGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;

  @media (max-width: ${theme.breakpoints.tablet}) {
    grid-template-columns: 1fr;
  }
`;

export const ModalItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  border: 1px solid ${theme.colors.border.lighter};
  background: ${theme.colors.surfaceMuted};
  border-radius: ${theme.borderRadius.md};
  padding: 12px;
`;

export const ModalLabel = styled.span`
  font-family: "Inter", sans-serif;
  font-size: 12px;
  font-weight: 600;
  color: ${theme.colors.text.muted};
`;

export const ModalValue = styled.span`
  font-family: "Roboto", sans-serif;
  font-size: 14px;
  font-weight: 500;
  color: ${theme.colors.text.primary};
`;
