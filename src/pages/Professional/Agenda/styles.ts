import styled, { css } from "styled-components";
import { theme } from "../../../themes/themes";

export const PageWrapper = styled.div`
  padding: 24px 20px 40px;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

export const PageHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
`;

export const PageTitle = styled.h1`
  margin: 0;
  font-family: "Roboto", sans-serif;
  font-size: 24px;
  font-weight: 700;
  color: ${theme.colors.text.primary};
`;

export const Toolbar = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
`;

const buttonBase = css`
  height: 36px;
  border-radius: 10px;
  border: 1px solid ${theme.colors.border.light};
  background: ${theme.colors.surface};
  font-family: "Roboto", sans-serif;
  font-size: 13px;
  font-weight: 500;
  color: ${theme.colors.text.secondary};
  transition: border-color 0.15s ease, color 0.15s ease, background-color 0.15s ease;

  &:hover:not(:disabled) {
    border-color: ${theme.colors.primary};
    color: ${theme.colors.primary};
  }

  &:disabled {
    opacity: 0.65;
    cursor: not-allowed;
  }
`;

export const ToolbarButton = styled.button`
  ${buttonBase};
  padding: 0 14px;
  cursor: pointer;
`;

export const ToolbarGroup = styled.div`
  display: flex;
  align-items: center;
`;

export const ViewToggle = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 2px;
  padding: 2px;
  border-radius: 12px;
  border: 1px solid ${theme.colors.border.light};
  background: ${theme.colors.surface};
`;

export const ViewToggleButton = styled.button<{ $active?: boolean }>`
  ${buttonBase};
  min-width: 72px;
  padding: 0 14px;
  border-color: transparent;
  cursor: ${({ $active }) => ($active ? "default" : "pointer")};
  background: ${({ $active }) => ($active ? theme.colors.primary : "transparent")};
  color: ${({ $active }) => ($active ? theme.colors.text.inverse : theme.colors.text.secondary)};

  &:hover:not(:disabled) {
    border-color: transparent;
    color: ${({ $active }) => ($active ? theme.colors.text.inverse : theme.colors.primary)};
    background: ${({ $active }) => ($active ? theme.colors.primary : theme.colors.surfaceMuted)};
  }
`;

export const MonthNavRow = styled.div`
  display: flex;
  justify-content: center;
`;

export const MonthNavGroup = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 18px;
`;

export const MonthNavButton = styled.button`
  ${buttonBase};
  width: 32px;
  min-width: 32px;
  padding: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
`;

export const MonthNavLabel = styled.h2`
  margin: 0;
  min-width: 220px;
  text-align: center;
  font-family: "Roboto", sans-serif;
  font-size: 18px;
  font-weight: 700;
  color: ${theme.colors.text.primary};
`;

export const ListShell = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const WeekShell = styled.div`
  width: 100%;
  overflow-x: auto;
  padding-bottom: 4px;

  &::-webkit-scrollbar {
    height: 8px;
  }

  &::-webkit-scrollbar-thumb {
    background: ${theme.colors.border.default};
    border-radius: 999px;
  }
`;

export const WeekGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, minmax(210px, 1fr));
  gap: 14px;
  min-width: 980px;
`;

export const WeekDayColumn = styled.section<{
  $selected: boolean;
  $today: boolean;
  $outsideMonth: boolean;
  $disabled: boolean;
}>`
  display: flex;
  flex-direction: column;
  border-radius: 20px;
  border: 1px solid
    ${({ $selected }) => ($selected ? theme.colors.primary : theme.colors.border.light)};
  background: ${theme.colors.surface};
  box-shadow: ${({ $selected }) => ($selected ? theme.shadows.md : theme.shadows.sm)};
  overflow: hidden;
  opacity: ${({ $outsideMonth, $disabled }) => ($disabled ? 0.46 : $outsideMonth ? 0.72 : 1)};
  transition: border-color 0.15s ease, box-shadow 0.15s ease, transform 0.15s ease;
  cursor: ${({ $disabled }) => ($disabled ? "not-allowed" : "pointer")};

  &:hover {
    border-color: ${({ $disabled, $selected }) =>
      $disabled ? ($selected ? theme.colors.primary : theme.colors.border.light) : theme.colors.primary};
    transform: ${({ $disabled }) => ($disabled ? "none" : "translateY(-1px)")};
  }
`;

export const WeekColumnHeader = styled.header<{ $today: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 14px;
  border-bottom: 1px solid ${theme.colors.border.lighter};
  background: ${({ $today }) =>
    $today
      ? "linear-gradient(135deg, rgba(37, 99, 235, 0.14), rgba(37, 99, 235, 0.04))"
      : theme.colors.surfaceMuted};
`;

export const WeekColumnLabel = styled.span`
  display: block;
  font-family: "Roboto", sans-serif;
  font-size: 13px;
  font-weight: 700;
  color: ${theme.colors.text.primary};
`;

export const WeekColumnDate = styled.span`
  display: block;
  margin-top: 4px;
  font-family: "Roboto", sans-serif;
  font-size: 12px;
  color: ${theme.colors.text.muted};
`;

export const WeekColumnNumber = styled.span<{ $today: boolean }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 38px;
  height: 38px;
  border-radius: 12px;
  font-family: "Roboto", sans-serif;
  font-size: 15px;
  font-weight: 700;
  background: ${({ $today }) => ($today ? theme.colors.primary : theme.colors.surface)};
  color: ${({ $today }) => ($today ? theme.colors.text.inverse : theme.colors.text.primary)};
  box-shadow: ${({ $today }) => ($today ? theme.shadows.sm : "none")};
`;

export const WeekColumnBody = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 14px;
  min-height: 280px;
`;

export const WeekBadgeRow = styled.div`
  display: flex;
  align-items: center;
`;

export const WeekAppointmentList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export const WeekAppointmentCard = styled.article<{ $selected: boolean }>`
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 12px;
  border-radius: 16px;
  border: 1px solid
    ${({ $selected }) => ($selected ? "rgba(37, 99, 235, 0.22)" : theme.colors.border.lighter)};
  background: ${({ $selected }) => ($selected ? "rgba(37, 99, 235, 0.05)" : theme.colors.surface)};
`;

export const WeekEmptyState = styled.div`
  min-height: 184px;
  border: 1px dashed ${theme.colors.border.light};
  border-radius: 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 18px 12px;
  font-family: "Roboto", sans-serif;
  font-size: 13px;
  color: ${theme.colors.text.muted};
  text-align: center;
`;

export const DayCard = styled.section<{ $selected: boolean }>`
  border-radius: 18px;
  border: 1px solid
    ${({ $selected }) => ($selected ? theme.colors.primary : theme.colors.border.light)};
  background: ${theme.colors.surface};
  box-shadow: ${({ $selected }) => ($selected ? theme.shadows.md : theme.shadows.sm)};
  overflow: hidden;
  transition: border-color 0.15s ease, box-shadow 0.15s ease;
`;

export const DayCardHeader = styled.header`
  padding: 14px 18px;
  border-bottom: 1px solid ${theme.colors.border.lighter};
  background: ${({ theme: currentTheme }) =>
    currentTheme?.colors?.background ?? theme.colors.background};
`;

export const DayCardTitle = styled.h3`
  margin: 0;
  font-family: "Roboto", sans-serif;
  font-size: 14px;
  font-weight: 700;
  color: ${theme.colors.primaryHover};
`;

export const DayCardBody = styled.div`
  display: flex;
  flex-direction: column;
`;

export const DayCardEmptyMessage = styled.div`
  padding: 18px;
  font-family: "Roboto", sans-serif;
  font-size: 14px;
  color: ${theme.colors.text.muted};
`;

export const AppointmentRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 18px;
  padding: 14px 18px;

  @media (max-width: ${theme.breakpoints.tablet}) {
    flex-direction: column;
    align-items: stretch;
  }
`;

export const AppointmentPrimary = styled.div`
  display: flex;
  align-items: center;
  gap: 18px;
  min-width: 0;

  @media (max-width: ${theme.breakpoints.mobile}) {
    gap: 12px;
  }
`;

export const TimeWrap = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  min-width: 72px;
  color: ${theme.colors.primary};
`;

export const TimeLabel = styled.span`
  font-family: "Roboto", sans-serif;
  font-size: 15px;
  font-weight: 700;
  color: ${theme.colors.primary};
`;

export const AppointmentRowContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
`;

export const AppointmentName = styled.strong`
  font-family: "Roboto", sans-serif;
  font-size: 15px;
  font-weight: 700;
  color: ${theme.colors.text.primary};
`;

export const AppointmentMeta = styled.span`
  font-family: "Roboto", sans-serif;
  font-size: 13px;
  color: ${theme.colors.text.muted};
`;

export const AppointmentRowActions = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  flex-shrink: 0;

  @media (max-width: ${theme.breakpoints.mobile}) {
    justify-content: space-between;
  }
`;

export const StatusBadge = styled.span<{ $variant: "confirmed" | "pending" | "waiting" | "progress" | "done" | "cancelled" }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 28px;
  padding: 0 12px;
  border-radius: 999px;
  font-family: "Roboto", sans-serif;
  font-size: 12px;
  font-weight: 600;
  white-space: nowrap;

  ${({ $variant }) => {
    switch ($variant) {
      case "confirmed":
        return css`
          background: #dcfce7;
          color: #15803d;
        `;
      case "pending":
        return css`
          background: #fef3c7;
          color: #a16207;
        `;
      case "waiting":
        return css`
          background: #e0f2fe;
          color: #0369a1;
        `;
      case "progress":
        return css`
          background: #dbeafe;
          color: #1d4ed8;
        `;
      case "done":
        return css`
          background: #e5e7eb;
          color: #374151;
        `;
      case "cancelled":
        return css`
          background: #fee2e2;
          color: #b91c1c;
        `;
    }
  }}
`;

export const ReportButton = styled.button`
  ${buttonBase};
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-width: 84px;
  padding: 0 12px;
  cursor: pointer;
`;

export const WeekAppointmentFooter = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;

  ${StatusBadge} {
    min-width: 0;
  }

  ${ReportButton} {
    min-width: auto;
    padding: 0 10px;
  }
`;

export const SectionDivider = styled.div`
  height: 1px;
  margin: 0 18px;
  background: ${theme.colors.border.lighter};
`;

export const EmptyState = styled.div`
  padding: 40px 24px;
  border-radius: 18px;
  border: 1px solid ${theme.colors.border.light};
  background: ${theme.colors.surface};
  text-align: center;
  font-family: "Roboto", sans-serif;
  font-size: 14px;
  color: ${theme.colors.text.secondary};
`;
