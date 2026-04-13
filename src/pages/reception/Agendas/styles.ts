import styled from "styled-components";
import { theme } from "../../../themes/themes";

// ─── Page Layout ──────────────────────────────────────────────────────────────

export const PageWrapper = styled.div`
  padding: 32px;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const PageHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 12px;
`;

export const ControlsRow = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
`;

export const AgendaDateInput = styled.input`
  height: 36px;
  padding: 0 12px;
  border: 1.25px solid ${theme.colors.border.light};
  border-radius: ${theme.borderRadius.md};
  background: ${theme.colors.surface};
  font-family: "Roboto", sans-serif;
  font-size: 13px;
  color: ${theme.colors.text.primary};
  outline: none;
  cursor: pointer;
  transition: border-color 0.15s;

  &:focus {
    border-color: ${theme.colors.border.focus};
  }
`;

export const TimeFilterWrap = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 0 12px;
  height: 36px;
  border: 1.25px solid ${theme.colors.border.light};
  border-radius: ${theme.borderRadius.md};
  background: ${theme.colors.surface};
  color: ${theme.colors.text.muted};
  transition: border-color 0.15s;

  &:focus-within {
    border-color: ${theme.colors.border.focus};
  }
`;

export const TimeFilterInput = styled.input`
  border: none;
  outline: none;
  background: transparent;
  font-family: "Roboto", sans-serif;
  font-size: 13px;
  color: ${theme.colors.text.primary};
  width: 130px;

  &::placeholder {
    color: ${theme.colors.text.muted};
  }
`;

export const PageTitle = styled.h1`
  margin: 0;
  font-family: "Roboto", sans-serif;
  font-size: 24px;
  font-weight: 700;
  color: ${theme.colors.text.primary};
`;

// ─── Filter Bar ───────────────────────────────────────────────────────────────

export const FilterBar = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
`;

export const FilterTab = styled.button<{ $active?: boolean }>`
  padding: 7px 16px;
  border-radius: 9999px;
  border: 1.25px solid
    ${({ $active }) => ($active ? theme.colors.primaryHover : theme.colors.border.light)};
  background-color: ${({ $active }) => ($active ? theme.colors.primaryHover : theme.colors.surface)};
  color: ${({ $active }) => ($active ? "#fff" : theme.colors.text.secondary)};
  font-family: "Roboto", sans-serif;
  font-size: 13px;
  font-weight: ${({ $active }) => ($active ? "600" : "400")};
  cursor: pointer;
  white-space: nowrap;
  transition: background-color 0.15s, border-color 0.15s, color 0.15s;

  &:hover:not(:disabled) {
    border-color: ${theme.colors.primaryHover};
    color: ${({ $active }) => ($active ? "#fff" : theme.colors.primaryHover)};
  }
`;

// ─── Date Navigation ──────────────────────────────────────────────────────────

export const DateNavRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
`;

export const DateNavButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 34px;
  height: 34px;
  border-radius: 8px;
  border: 1.25px solid ${theme.colors.border.light};
  background-color: ${theme.colors.surface};
  color: ${theme.colors.text.muted};
  cursor: pointer;
  flex-shrink: 0;
  transition: background-color 0.15s, color 0.15s;

  &:hover:not(:disabled) {
    background-color: ${theme.colors.surfaceMuted};
    color: ${theme.colors.text.primary};
  }

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
`;

export const DateLabel = styled.span`
  font-family: "Roboto", sans-serif;
  font-size: 15px;
  font-weight: 600;
  color: ${theme.colors.text.primary};
  min-width: 300px;
  text-align: center;

  @media (max-width: ${theme.breakpoints.mobile}) {
    min-width: 0;
    font-size: 13px;
  }
`;

// ─── Professionals Grid ───────────────────────────────────────────────────────

export const ProfessionalsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  align-items: start;

  @media (max-width: ${theme.breakpoints.tablet}) {
    grid-template-columns: 1fr;
  }
`;

export const ProfessionalCard = styled.div`
  background-color: ${theme.colors.surface};
  border: 1.25px solid ${theme.colors.border.lighter};
  border-radius: ${theme.borderRadius.lg};
  box-shadow: ${theme.shadows.sm};
  overflow: hidden;
`;

export const ProfCardHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 16px;
  background-color: ${theme.colors.surfaceMuted};
  border-bottom: 1.25px solid ${theme.colors.border.lighter};
`;

export const ProfAvatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: "Roboto", sans-serif;
  font-size: 13px;
  font-weight: 700;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 50%;
  }
`;

export const ProfInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
`;

export const ProfName = styled.p`
  margin: 0;
  font-family: "Roboto", sans-serif;
  font-size: 18px;
  font-weight: 700;
  color: ${theme.colors.text.primary};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const ProfSpecialty = styled.p`
  margin: 0;
  font-family: "Roboto", sans-serif;
  font-size: 14px;
  color: ${theme.colors.text.muted};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

// ─── Slots ────────────────────────────────────────────────────────────────────

export const SlotList = styled.div`
  display: flex;
  flex-direction: column;
`;

export const SlotRow = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 16px;
  border-bottom: 1px solid ${theme.colors.border.lighter};

  &:last-child {
    border-bottom: none;
  }
`;

export const SlotTime = styled.span`
  font-family: "Roboto", sans-serif;
  font-size: 17px;
  font-weight: 600;
  color: ${theme.colors.primaryHover};
  width: 58px;
  flex-shrink: 0;
`;

export const PatientName = styled.span`
  font-family: "Roboto", sans-serif;
  font-size: 17px;
  color: ${theme.colors.text.primary};
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const FreeLabel = styled.span`
  font-family: "Roboto", sans-serif;
  font-size: 17px;
  color: ${theme.colors.text.muted};
  flex: 1;
`;

export const SlotBadge = styled.span<{
  $variant: "waiting" | "checkin" | "progress" | "done" | "cancelled";
}>`
  display: inline-block;
  font-family: "Roboto", sans-serif;
  font-size: 15px;
  font-weight: 600;
  padding: 3px 10px;
  border-radius: 9999px;
  white-space: nowrap;
  flex-shrink: 0;
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
    }
  }}
`;

// ─── Empty / Loading ──────────────────────────────────────────────────────────

export const EmptyState = styled.p`
  padding: 40px 24px;
  text-align: center;
  font-family: "Roboto", sans-serif;
  font-size: 14px;
  color: ${theme.colors.text.muted};
  margin: 0;
`;

export const LoadingState = styled(EmptyState)``;
