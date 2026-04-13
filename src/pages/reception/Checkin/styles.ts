import styled from "styled-components";
import { theme } from "../../../themes/themes";

export const PageWrapper = styled.div`
  padding: 32px;
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

// ─── Header ───────────────────────────────────────────────────────────────────

export const PageHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const PageTitle = styled.h1`
  margin: 0;
  font-family: "Roboto", sans-serif;
  font-size: 24px;
  font-weight: 700;
  color: ${theme.colors.text.primary};
`;

export const PageDate = styled.span`
  font-family: "Roboto", sans-serif;
  font-size: 14px;
  color: ${theme.colors.text.muted};
`;

// ─── List Card ────────────────────────────────────────────────────────────────

export const ListCard = styled.div`
  background-color: ${theme.colors.surface};
  border: 1.25px solid ${theme.colors.border.lighter};
  border-radius: ${theme.borderRadius.lg};
  box-shadow: ${theme.shadows.sm};
`;

// ─── Section header ───────────────────────────────────────────────────────────

export const SectionHeader = styled.div<{ $variant: "waiting" | "active" | "done" | "cancelled" }>`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 24px;
  background-color: ${theme.colors.surfaceMuted};
  border-bottom: 1.25px solid ${theme.colors.border.lighter};

  &:first-child {
    border-top-left-radius: ${theme.borderRadius.lg};
    border-top-right-radius: ${theme.borderRadius.lg};
  }
`;

export const SectionTitle = styled.span<{ $variant: "waiting" | "active" | "done" | "cancelled" }>`
  flex: 1;
  font-family: "Roboto", sans-serif;
  font-size: 14px;
  font-weight: 600;

  ${({ $variant }) => {
    switch ($variant) {
      case "waiting":
        return "color: var(--mc-status-waiting-text);";
      case "active":
        return "color: var(--mc-status-progress-text);";
      case "done":
        return "color: var(--mc-status-done-text);";
      case "cancelled":
        return "color: var(--mc-status-cancelled-text);";
    }
  }}
`;

export const SectionCount = styled.span<{ $variant: "waiting" | "active" | "done" | "cancelled" }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 24px;
  height: 24px;
  padding: 0 6px;
  border-radius: 9999px;
  font-family: "Roboto", sans-serif;
  font-size: 13px;
  font-weight: 700;

  ${({ $variant }) => {
    switch ($variant) {
      case "waiting":
        return "background-color: var(--mc-status-waiting-bg); color: var(--mc-status-waiting-text); border: 1px solid var(--mc-status-waiting-border);";
      case "active":
        return "background-color: var(--mc-status-progress-bg); color: var(--mc-status-progress-text); border: 1px solid var(--mc-status-progress-border);";
      case "done":
        return "background-color: var(--mc-status-done-bg); color: var(--mc-status-done-text); border: 1px solid var(--mc-status-done-border);";
      case "cancelled":
        return "background-color: var(--mc-status-cancelled-bg); color: var(--mc-status-cancelled-text); border: 1px solid var(--mc-status-cancelled-border);";
    }
  }}
`;

// ─── Appointment Row ──────────────────────────────────────────────────────────

export const AppointmentRow = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px 24px;
  border-bottom: 1.25px solid ${theme.colors.border.lighter};

  &:last-child {
    border-bottom: none;
  }
`;

export const AvatarCircle = styled.div<{ $variant: "waiting" | "active" | "done" | "cancelled" }>`
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

  ${({ $variant }) => {
    switch ($variant) {
      case "waiting":
        return "background-color: var(--mc-status-waiting-bg); color: var(--mc-status-waiting-text);";
      case "active":
        return "background-color: var(--mc-status-checkin-bg); color: var(--mc-status-checkin-text);";
      case "done":
        return "background-color: var(--mc-status-done-bg); color: var(--mc-status-done-text);";
      case "cancelled":
        return "background-color: var(--mc-status-cancelled-bg); color: var(--mc-status-cancelled-text);";
    }
  }}

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 50%;
  }
`;

export const PatientInfo = styled.div`
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

export const PatientName = styled.p`
  margin: 0;
  font-family: "Roboto", sans-serif;
  font-size: 15px;
  font-weight: 600;
  color: ${theme.colors.text.primary};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const AppointmentMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  font-family: "Roboto", sans-serif;
  font-size: 13px;
  color: ${theme.colors.text.muted};
`;

// ─── Status badge ─────────────────────────────────────────────────────────────

export const StatusBadge = styled.span<{
  $variant: "waiting" | "checkin" | "progress" | "done" | "cancelled";
}>`
  display: inline-block;
  font-family: "Roboto", sans-serif;
  font-size: 12px;
  font-weight: 500;
  padding: 4px 12px;
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

// ─── Actions ──────────────────────────────────────────────────────────────────

export const ActionsCell = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
`;

export const CheckinButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 14px;
  border-radius: 8px;
  border: none;
  background-color: #16a34a;
  color: #ffffff;
  font-family: "Roboto", sans-serif;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  white-space: nowrap;
  transition: background-color 0.15s;

  &:hover {
    background-color: #15803d;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

export const EditIconButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 8px;
  border: 1.25px solid ${theme.colors.border.light};
  background-color: ${theme.colors.surface};
  color: ${theme.colors.text.muted};
  cursor: pointer;
  flex-shrink: 0;
  transition: background-color 0.15s, color 0.15s;

  &:hover {
    background-color: ${theme.colors.surfaceMuted};
    color: ${theme.colors.text.primary};
  }
`;

// ─── Dropdown ─────────────────────────────────────────────────────────────────

export const DropdownWrapper = styled.div`
  position: relative;
`;

export const DropdownMenu = styled.ul`
  position: absolute;
  right: 0;
  top: calc(100% + 6px);
  z-index: 100;
  list-style: none;
  margin: 0;
  padding: 6px 0;
  min-width: 180px;
  background-color: ${theme.colors.surface};
  border: 1px solid ${theme.colors.border.light};
  border-radius: ${theme.borderRadius.sm};
  box-shadow: ${theme.shadows.md};
`;

export const DropdownItem = styled.li<{ $active?: boolean }>`
  padding: 9px 14px;
  font-family: "Roboto", sans-serif;
  font-size: 13px;
  font-weight: ${({ $active }) => ($active ? "600" : "400")};
  color: ${({ $active }) => ($active ? theme.colors.primaryHover : theme.colors.text.primary)};
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;

  &:hover {
    background-color: ${theme.colors.surfaceMuted};
  }
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

// ─── History Modal ────────────────────────────────────────────────────────────

export const HistoryModalBody = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

export const HistorySectionTitle = styled.p`
  margin: 0 0 10px;
  font-family: "Roboto", sans-serif;
  font-size: 11px;
  font-weight: 700;
  color: ${theme.colors.text.secondary};
  text-transform: uppercase;
  letter-spacing: 0.6px;
`;

export const HistoryApptCard = styled.div`
  background: ${theme.colors.surfaceMuted};
  border: 1px solid ${theme.colors.border.lighter};
  border-radius: ${theme.borderRadius.md};
  padding: 14px 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const HistoryApptRow = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  font-family: "Roboto", sans-serif;
  font-size: 13px;
`;

export const HistoryApptLabel = styled.span`
  color: ${theme.colors.text.muted};
  flex-shrink: 0;
  min-width: 90px;
`;

export const HistoryApptValue = styled.span`
  color: ${theme.colors.text.primary};
  font-weight: 600;
`;

export const HistoryTimeline = styled.div`
  display: flex;
  flex-direction: column;
`;

export const HistoryEntry = styled.div`
  display: flex;
  gap: 12px;
  align-items: flex-start;
  padding-bottom: 16px;
  position: relative;

  &:not(:last-child)::before {
    content: "";
    position: absolute;
    left: 6px;
    top: 16px;
    bottom: 0;
    width: 2px;
    background: ${theme.colors.border.lighter};
  }
`;

export const HistoryDot = styled.div<{ $latest?: boolean }>`
  width: 14px;
  height: 14px;
  border-radius: 50%;
  flex-shrink: 0;
  margin-top: 2px;
  background: ${({ $latest }) => ($latest ? theme.colors.primary : theme.colors.border.default)};
  border: 2px solid
    ${({ $latest }) => ($latest ? theme.colors.primary : theme.colors.border.light)};
`;

export const HistoryEntryBody = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

export const HistoryEntryLabel = styled.span`
  font-family: "Roboto", sans-serif;
  font-size: 14px;
  font-weight: 600;
  color: ${theme.colors.text.primary};
`;

export const HistoryEntryTime = styled.span`
  font-family: "Roboto", sans-serif;
  font-size: 12px;
  color: ${theme.colors.text.muted};
`;

export const HistoryChangeRow = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
  flex-wrap: wrap;
`;

export const HistoryChangeSelect = styled.select`
  flex: 1;
  min-width: 160px;
  height: 38px;
  padding: 0 12px;
  border: 1.25px solid ${theme.colors.border.light};
  border-radius: ${theme.borderRadius.md};
  background: ${theme.colors.surface};
  font-family: "Roboto", sans-serif;
  font-size: 13px;
  color: ${theme.colors.text.primary};
  outline: none;
  cursor: pointer;

  &:focus {
    border-color: ${theme.colors.border.focus};
  }
`;

export const HistoryApplyButton = styled.button`
  height: 38px;
  padding: 0 20px;
  border: none;
  border-radius: ${theme.borderRadius.md};
  background: ${theme.colors.primary};
  color: #fff;
  font-family: "Roboto", sans-serif;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  white-space: nowrap;
  transition: background 0.15s;

  &:hover:not(:disabled) {
    background: ${theme.colors.primaryHover};
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;
