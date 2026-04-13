import styled from "styled-components";
import { theme } from "../../../themes/themes";

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

export const SummaryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  margin-bottom: 24px;

  @media (max-width: ${theme.breakpoints.tablet}) {
    grid-template-columns: 1fr;
  }
`;

export const SummaryCard = styled.div<{ $borderColor: string }>`
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 20px 24px;
  background-color: ${theme.colors.surface};
  border: 1px solid ${theme.colors.border.light};
  border-left: 4px solid ${({ $borderColor }) => $borderColor};
  border-radius: ${theme.borderRadius.md};
`;

export const SummaryLabel = styled.span`
  font-family: "Roboto", sans-serif;
  font-size: 13px;
  font-weight: 500;
  color: ${theme.colors.text.muted};
  text-transform: uppercase;
  letter-spacing: 0.03em;
`;

export const SummaryValue = styled.span`
  font-family: "Roboto", sans-serif;
  font-size: 28px;
  font-weight: 700;
  color: ${theme.colors.text.primary};
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

export const TableCard = styled.div`
  background-color: ${theme.colors.surface};
  border: 1px solid ${theme.colors.border.light};
  border-radius: ${theme.borderRadius.lg};
  overflow: auto;
`;

export const TableElement = styled.table`
  width: 100%;
  min-width: 880px;
  border-collapse: collapse;

  td {
    padding: 16px 24px;
    font-family: "Roboto", sans-serif;
    font-size: 15px;
    color: ${theme.colors.text.primary};
    border-top: 1px solid ${theme.colors.border.light};
    vertical-align: middle;

    @media (max-width: ${theme.breakpoints.wide}) {
      font-size: 14px;
    }
  }
`;

export const TableHeaderRow = styled.tr`
  background-color: ${theme.colors.surfaceMuted};
`;

export const TableHeaderCell = styled.th`
  text-align: left;
  padding: 14px 24px;
  font-family: "Roboto", sans-serif;
  font-size: 13px;
  letter-spacing: 0.04em;
  font-weight: 700;
  color: ${theme.colors.text.secondary};

  @media (max-width: ${theme.breakpoints.wide}) {
    font-size: 12px;
  }
`;

export const TableRow = styled.tr``;

export const PatientCell = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
`;

export const Avatar = styled.div<{ $bgColor: string }>`
  width: 38px;
  height: 38px;
  border-radius: 999px;
  background-color: ${({ $bgColor }) => $bgColor};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${theme.colors.text.inverse};
  font-family: "Roboto", sans-serif;
  font-size: 13px;
  font-weight: 700;
  flex-shrink: 0;
`;

export const PatientMeta = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

export const PatientName = styled.span`
  font-family: "Roboto", sans-serif;
  font-size: 16px;
  font-weight: 700;
  color: ${theme.colors.text.primary};

  @media (max-width: ${theme.breakpoints.wide}) {
    font-size: 15px;
  }
`;

export const PatientEmail = styled.span`
  font-family: "Roboto", sans-serif;
  font-size: 13px;
  font-weight: 400;
  color: ${theme.colors.text.muted};

  @media (max-width: ${theme.breakpoints.wide}) {
    font-size: 12px;
  }
`;

export const ActionsGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const EmptyStateCell = styled.td`
  text-align: center;
  color: ${theme.colors.text.secondary};
  padding: 24px;
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

export const PatientStats = styled.div`
  display: flex;
  align-items: center;
  gap: 24px;
  flex-shrink: 0;
  margin-left: auto;

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

export const ViewDetailsButton = styled.button`
  flex-shrink: 0;
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 5px 12px;
  border-radius: ${theme.borderRadius.sm};
  border: 1px solid ${theme.colors.border.light};
  background: ${theme.colors.surface};
  color: ${theme.colors.text.secondary};
  font-family: "Roboto", sans-serif;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.15s, color 0.15s, border-color 0.15s;

  &:hover {
    background: ${theme.colors.featureBg.blue};
    color: ${theme.colors.primary};
    border-color: ${theme.colors.primary};
  }

  @media (max-width: 768px) {
    display: none;
  }
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

// --- Legacy (StatusMessage) ---------------------------------------------------

export const StatusMessage = styled.p<{ $variant?: "error" | "success" }>`
  font-family: "Roboto", sans-serif;
  font-size: 14px;
  color: ${({ $variant }) =>
    $variant === "error"
      ? theme.colors.error
      : $variant === "success"
        ? theme.colors.success
        : theme.colors.text.secondary};
  text-align: center;
  padding: 16px 0;
`;

export const PhoneText = styled.span`
  font-family: "Roboto", sans-serif;
  font-size: 14px;
  color: ${theme.colors.text.secondary};
`;

export const DetailSection = styled.section`
  display: flex;
  flex-direction: column;
  gap: 12px;

  & + & {
    margin-top: 20px;
    padding-top: 20px;
    border-top: 1px solid ${theme.colors.border.light};
  }
`;

export const DetailSectionTitle = styled.h3`
  margin: 0;
  font-family: "Roboto", sans-serif;
  font-size: 16px;
  font-weight: 700;
  color: ${theme.colors.text.primary};
`;

export const DetailsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px 16px;

  @media (max-width: ${theme.breakpoints.tablet}) {
    grid-template-columns: 1fr;
  }
`;

export const DetailItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 10px 12px;
  border: 1px solid ${theme.colors.border.light};
  border-radius: ${theme.borderRadius.md};
  background-color: ${theme.colors.surfaceMuted};
`;

export const DetailLabel = styled.span`
  font-family: "Roboto", sans-serif;
  font-size: 12px;
  font-weight: 600;
  color: ${theme.colors.text.secondary};
`;

export const DetailValue = styled.span`
  font-family: "Roboto", sans-serif;
  font-size: 14px;
  font-weight: 500;
  color: ${theme.colors.text.primary};
  white-space: pre-wrap;
`;

export const ReportsEmpty = styled.p`
  margin: 0;
  padding: 14px 16px;
  border-radius: ${theme.borderRadius.md};
  border: 1px solid ${theme.colors.border.light};
  background: ${theme.colors.surfaceMuted};
  color: ${theme.colors.text.secondary};
  font-family: "Roboto", sans-serif;
  font-size: 14px;
`;

export const ReportsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const ReportCard = styled.article`
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 14px;
  border-radius: ${theme.borderRadius.md};
  border: 1px solid ${theme.colors.border.light};
  background: ${theme.colors.surface};
`;

export const ReportHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
`;

export const ReportTitle = styled.h4`
  margin: 0;
  font-family: "Roboto", sans-serif;
  font-size: 15px;
  font-weight: 700;
  color: ${theme.colors.text.primary};
`;

export const ReportMeta = styled.p`
  margin: 0;
  font-family: "Roboto", sans-serif;
  font-size: 13px;
  color: ${theme.colors.text.secondary};
`;

export const ReportGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;

  @media (max-width: ${theme.breakpoints.tablet}) {
    grid-template-columns: 1fr;
  }
`;

export const ReportAttachments = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;

  a {
    display: inline-flex;
    align-items: center;
    padding: 6px 10px;
    border-radius: ${theme.borderRadius.sm};
    border: 1px solid ${theme.colors.border.default};
    background: ${theme.colors.surfaceMuted};
    color: ${theme.colors.text.link};
    text-decoration: none;
    font-family: "Roboto", sans-serif;
    font-size: 12px;
    font-weight: 600;

    &:hover {
      text-decoration: underline;
    }
  }
`;
