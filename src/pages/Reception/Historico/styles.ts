import styled from "styled-components";
import { theme } from "../../../themes/themes";

// --- Page Layout --------------------------------------------------------------

export const PageWrapper = styled.div`
  padding: 32px;
`;

export const TopRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 24px;

  @media (max-width: ${theme.breakpoints.tablet}) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

export const PageTitle = styled.h1`
  margin: 0;
  font-family: "Roboto", sans-serif;
  font-size: 24px;
  font-weight: 700;
  color: ${theme.colors.text.primary};

  @media (max-width: ${theme.breakpoints.wide}) {
    font-size: 22px;
  }

  @media (max-width: ${theme.breakpoints.tablet}) {
    font-size: 20px;
  }
`;

export const FiltersRow = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 24px;

  @media (max-width: ${theme.breakpoints.desktop}) {
    flex-direction: column;
    align-items: stretch;
  }
`;

export const SearchField = styled.div`
  width: 380px;
  max-width: 100%;

  @media (max-width: ${theme.breakpoints.desktop}) {
    width: 100%;
  }
`;

export const StatusMessage = styled.p<{ $variant?: "error" | "info" }>`
  font-family: "Roboto", sans-serif;
  font-size: 14px;
  color: ${({ $variant }) =>
    $variant === "error" ? theme.colors.error : theme.colors.text.secondary};
  text-align: center;
  padding: 16px 0;
`;

// --- Patient Card List --------------------------------------------------------

export const PatientList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const PatientCard = styled.div<{ $expanded?: boolean }>`
  background: ${theme.colors.surface};
  border: 1px solid ${({ $expanded }) =>
    $expanded ? theme.colors.primary : theme.colors.border.light};
  border-radius: ${theme.borderRadius.md};
  transition: border-color 0.15s;
`;

export const PatientRow = styled.button`
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  padding: 14px 16px;
  background: none;
  border: none;
  cursor: pointer;
  text-align: left;
  color: inherit;

  &:hover {
    background: ${theme.colors.surfaceMuted};
  }
`;

export const PatientAvatar = styled.div<{ $bgColor: string }>`
  flex-shrink: 0;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: ${({ $bgColor }) => $bgColor};
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 14px;
  color: #fff;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

export const PatientMeta = styled.div`
  flex: 1;
  min-width: 0;
`;

export const PatientName = styled.p`
  font-family: "Roboto", sans-serif;
  font-size: 15px;
  font-weight: 600;
  color: ${theme.colors.text.primary};
  margin: 0 0 2px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const PatientEmail = styled.p`
  font-family: "Roboto", sans-serif;
  font-size: 13px;
  color: ${theme.colors.text.secondary};
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const PatientStats = styled.div`
  display: flex;
  align-items: center;
  gap: 24px;
  flex-shrink: 0;

  @media (max-width: 640px) {
    display: none;
  }
`;

export const StatPill = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 2px;
`;

export const StatLabel = styled.span`
  font-family: "Roboto", sans-serif;
  font-size: 11px;
  color: ${theme.colors.text.secondary};
  text-transform: uppercase;
  letter-spacing: 0.04em;
`;

export const StatValue = styled.span`
  font-family: "Roboto", sans-serif;
  font-size: 14px;
  font-weight: 600;
  color: ${theme.colors.text.primary};
`;

export const ChevronWrapper = styled.div<{ $open: boolean }>`
  flex-shrink: 0;
  display: flex;
  align-items: center;
  color: ${theme.colors.text.secondary};
  transform: rotate(${({ $open }) => ($open ? "180deg" : "0deg")});
  transition: transform 0.2s ease;
`;

// --- Accordion Body -----------------------------------------------------------

export const AccordionBody = styled.div`
  border-top: 1px solid ${theme.colors.border.light};
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export const AccordionLoadingRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px 0;
  font-family: "Roboto", sans-serif;
  font-size: 14px;
  color: ${theme.colors.text.secondary};
`;

export const AccordionEmptyRow = styled.div`
  font-family: "Roboto", sans-serif;
  font-size: 14px;
  color: ${theme.colors.text.secondary};
  text-align: center;
  padding: 12px 0;
`;

// --- Appointment Entry --------------------------------------------------------

export const AppointmentEntry = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 14px;
  background: ${theme.colors.surfaceMuted};
  border-radius: ${theme.borderRadius.sm};
  flex-wrap: wrap;
`;

export const ApptDate = styled.div`
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 52px;
`;

export const ApptDay = styled.span`
  font-family: "Roboto", sans-serif;
  font-size: 18px;
  font-weight: 700;
  color: ${theme.colors.text.primary};
  line-height: 1;
`;

export const ApptMonthYear = styled.span`
  font-family: "Roboto", sans-serif;
  font-size: 11px;
  color: ${theme.colors.text.secondary};
  text-transform: uppercase;
  letter-spacing: 0.04em;
`;

export const ApptDivider = styled.div`
  width: 1px;
  height: 36px;
  background: ${theme.colors.border.light};
  flex-shrink: 0;

  @media (max-width: 500px) {
    display: none;
  }
`;

export const ApptInfo = styled.div`
  flex: 1;
  min-width: 0;
`;

export const ApptProfessional = styled.p`
  font-family: "Roboto", sans-serif;
  font-size: 14px;
  font-weight: 600;
  color: ${theme.colors.text.primary};
  margin: 0 0 2px;
`;

export const ApptMeta = styled.p`
  font-family: "Roboto", sans-serif;
  font-size: 12px;
  color: ${theme.colors.text.secondary};
  margin: 0;
`;

export const ApptStatusBadge = styled.span<{ $status: string }>`
  flex-shrink: 0;
  font-family: "Roboto", sans-serif;
  font-size: 12px;
  font-weight: 600;
  padding: 3px 10px;
  border-radius: 999px;
  white-space: nowrap;

  ${({ $status }) => {
    switch ($status) {
      case "DONE":
      case "COMPLETED":
        return `
          background: var(--mc-status-done-bg, ${theme.colors.featureBg.green});
          color: var(--mc-status-done-text, #15803d);
          border: 1px solid var(--mc-status-done-border, #bbf7d0);
        `;
      case "CANCELLED":
      case "RESCHEDULED":
      case "NO_SHOW":
        return `
          background: var(--mc-status-cancelled-bg, #fee2e2);
          color: var(--mc-status-cancelled-text, #b91c1c);
          border: 1px solid var(--mc-status-cancelled-border, #fecaca);
        `;
      case "IN_PROGRESS":
        return `
          background: var(--mc-status-progress-bg, ${theme.colors.featureBg.blue});
          color: var(--mc-status-progress-text, #1d4ed8);
          border: 1px solid var(--mc-status-progress-border, #bfdbfe);
        `;
      case "CHECKED_IN":
        return `
          background: var(--mc-status-checkin-bg, #fef9c3);
          color: var(--mc-status-checkin-text, #a16207);
          border: 1px solid var(--mc-status-checkin-border, #fde68a);
        `;
      default:
        return `
          background: var(--mc-status-waiting-bg, #f1f5f9);
          color: var(--mc-status-waiting-text, #475569);
          border: 1px solid var(--mc-status-waiting-border, #e2e8f0);
        `;
    }
  }}
`;

// --- Appointment Dropdown -----------------------------------------------------

export const ApptDropdownWrapper = styled.div`
  position: relative;
  flex-shrink: 0;
`;

export const ApptEditButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: ${theme.borderRadius.sm};
  border: 1px solid ${theme.colors.border.light};
  background: ${theme.colors.surface};
  color: ${theme.colors.text.secondary};
  cursor: pointer;
  transition: background 0.15s, color 0.15s;

  &:hover {
    background: ${theme.colors.surfaceMuted};
    color: ${theme.colors.primary};
  }
`;

export const ApptDocsButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 5px;
  height: 28px;
  padding: 0 10px;
  border-radius: ${theme.borderRadius.sm};
  border: 1px solid ${theme.colors.border.light};
  background: ${theme.colors.surface};
  color: ${theme.colors.text.secondary};
  font-family: "Roboto", sans-serif;
  font-size: 12px;
  font-weight: 500;
  white-space: nowrap;
  cursor: pointer;
  flex-shrink: 0;
  transition: background 0.15s, color 0.15s;

  &:hover {
    background: ${theme.colors.featureBg.blue};
    color: ${theme.colors.primary};
    border-color: #bfdbfe;
  }
`;

export const ApptDropdownMenu = styled.div`
  position: absolute;
  right: 0;
  top: calc(100% + 4px);
  min-width: 180px;
  background: ${theme.colors.surface};
  border: 1px solid ${theme.colors.border.light};
  border-radius: ${theme.borderRadius.md};
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
  z-index: 100;
  overflow: hidden;
`;

export const ApptDropdownItem = styled.button<{ $active?: boolean }>`
  display: block;
  width: 100%;
  padding: 9px 14px;
  text-align: left;
  font-family: "Roboto", sans-serif;
  font-size: 13px;
  font-weight: ${({ $active }) => ($active ? 600 : 400)};
  color: ${({ $active }) => ($active ? theme.colors.primary : theme.colors.text.primary)};
  background: ${({ $active }) => ($active ? theme.colors.featureBg.blue : "transparent")};
  border: none;
  cursor: pointer;
  transition: background 0.12s;

  &:hover {
    background: ${theme.colors.surfaceMuted};
  }
`;
