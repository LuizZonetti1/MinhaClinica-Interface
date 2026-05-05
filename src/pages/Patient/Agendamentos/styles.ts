import styled, { css } from "styled-components";
import { theme } from "../../../themes/themes";

export const PageWrapper = styled.div`
  padding: 32px;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const TopRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 2px;

  @media (max-width: ${theme.breakpoints.tablet}) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

export const PageTitle = styled.h1`
  margin: 0;
  font-family: "Roboto", sans-serif;
  font-size: 34px;
  font-weight: 700;
  color: ${theme.colors.text.primary};
`;

export const SearchRow = styled.div`
  margin-top: 4px;
`;

export const FiltersRow = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 2px;
`;

export const FilterChip = styled.button<{ $active: boolean }>`
  height: 32px;
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

export const AppointmentsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const AppointmentCard = styled.div`
  background: ${theme.colors.surface};
  border: 1px solid ${theme.colors.border.light};
  border-radius: ${theme.borderRadius.lg};
  box-shadow: ${theme.shadows.sm};
  overflow: hidden;
`;

export const AppointmentTopBar = styled.div`
  min-height: 34px;
  background: ${theme.colors.surfaceMuted};
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding: 6px 16px;
`;

export type AppointmentBadgeVariant =
  | "confirmed"
  | "pending"
  | "cancelled"
  | "completed"
  | "waiting"
  | "progress"
  | "rescheduled"
  | "default";

const badgeVariantStyles: Record<AppointmentBadgeVariant, ReturnType<typeof css>> = {
  confirmed: css`
    color: var(--mc-status-checkin-text, #166534);
    background: var(--mc-status-checkin-bg, #dcfce7);
    border: 1px solid var(--mc-status-checkin-border, #86efac);
  `,
  pending: css`
    color: var(--mc-status-waiting-text, #92400e);
    background: var(--mc-status-waiting-bg, #fef3c7);
    border: 1px solid var(--mc-status-waiting-border, #fcd34d);
  `,
  cancelled: css`
    color: var(--mc-status-cancelled-text, #991b1b);
    background: var(--mc-status-cancelled-bg, #fee2e2);
    border: 1px solid var(--mc-status-cancelled-border, #fca5a5);
  `,
  completed: css`
    color: var(--mc-status-done-text, #374151);
    background: var(--mc-status-done-bg, #f3f4f6);
    border: 1px solid var(--mc-status-done-border, #d1d5db);
  `,
  waiting: css`
    color: var(--mc-status-waiting-text, #92400e);
    background: var(--mc-status-waiting-bg, #fef3c7);
    border: 1px solid var(--mc-status-waiting-border, #fcd34d);
  `,
  progress: css`
    color: var(--mc-status-progress-text, #1e40af);
    background: var(--mc-status-progress-bg, #dbeafe);
    border: 1px solid var(--mc-status-progress-border, #93c5fd);
  `,
  rescheduled: css`
    color: #5b21b6;
    background: #ede9fe;
    border: 1px solid #c4b5fd;
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

export const AppointmentBody = styled.div`
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
  font-size: 27px;
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

export const ConfirmPresenceButton = styled.button`
  height: 32px;
  border: 1px solid #bbf7d0;
  background: #f0fdf4;
  color: #15803d;
  border-radius: 8px;
  padding: 0 12px;
  font-family: "Roboto", sans-serif;
  font-size: 13px;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;

  &:hover:not(:disabled) {
    filter: brightness(1.06);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export const CancelButton = styled.button`
  height: 32px;
  border: 1px solid var(--mc-action-border, #fecaca);
  background: var(--mc-action-delete-bg, #fee2e2);
  color: var(--mc-action-delete-text, #dc2626);
  border-radius: 8px;
  padding: 0 12px;
  font-family: "Roboto", sans-serif;
  font-size: 13px;
  font-weight: 600;
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

export const BookingForm = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const BookingGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;

  @media (max-width: ${theme.breakpoints.tablet}) {
    grid-template-columns: 1fr;
  }
`;

export const BookingField = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

export const BookingLabel = styled.label`
  font-family: "Roboto", sans-serif;
  font-size: 13px;
  font-weight: 600;
  color: ${theme.colors.text.secondary};
`;

export const BookingInput = styled.input`
  height: 42px;
  width: 100%;
  border-radius: ${theme.borderRadius.md};
  border: 1px solid ${theme.colors.border.default};
  background: ${theme.colors.surface};
  color: ${theme.colors.text.primary};
  padding: 0 12px;
  font-family: "Roboto", sans-serif;
  font-size: 14px;
  outline: none;

  &:focus {
    border-color: ${theme.colors.border.focus};
  }
`;

export const BookingSelect = styled.select`
  height: 42px;
  width: 100%;
  border-radius: ${theme.borderRadius.md};
  border: 1px solid ${theme.colors.border.default};
  background: ${theme.colors.surface};
  color: ${theme.colors.text.primary};
  padding: 0 12px;
  font-family: "Roboto", sans-serif;
  font-size: 14px;
  outline: none;
  cursor: pointer;

  &:focus {
    border-color: ${theme.colors.border.focus};
  }

  &:disabled {
    opacity: 0.65;
    cursor: not-allowed;
  }
`;

export const BookingTextarea = styled.textarea`
  min-height: 82px;
  width: 100%;
  border-radius: ${theme.borderRadius.md};
  border: 1px solid ${theme.colors.border.default};
  background: ${theme.colors.surface};
  color: ${theme.colors.text.primary};
  padding: 10px 12px;
  font-family: "Roboto", sans-serif;
  font-size: 14px;
  outline: none;
  resize: vertical;

  &:focus {
    border-color: ${theme.colors.border.focus};
  }
`;

export const BookingHint = styled.span`
  font-family: "Roboto", sans-serif;
  font-size: 12px;
  color: ${theme.colors.text.muted};
`;

export const ClinicResultsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  max-height: 168px;
  overflow-y: auto;
  padding: 6px;
  border: 1px solid ${theme.colors.border.light};
  border-radius: ${theme.borderRadius.md};
  background: ${theme.colors.surfaceMuted};
`;

export const ClinicResultButton = styled.button<{ $selected: boolean }>`
  border: 1px solid
    ${({ $selected }) => ($selected ? theme.colors.primary : theme.colors.border.default)};
  background: ${({ $selected }) => ($selected ? theme.colors.featureBg.blue : theme.colors.surface)};
  color: ${({ $selected }) => ($selected ? theme.colors.primary : theme.colors.text.primary)};
  border-radius: ${theme.borderRadius.md};
  min-height: 46px;
  padding: 9px 11px;
  text-align: left;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  font-family: "Roboto", sans-serif;
  transition: all 0.16s ease;
  box-shadow: ${({ $selected }) => ($selected ? theme.shadows.sm : "none")};

  .clinic-info {
    display: flex;
    flex-direction: column;
    gap: 2px;
    min-width: 0;
  }

  .clinic-info > * {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  svg {
    flex-shrink: 0;
    color: ${({ $selected }) => ($selected ? theme.colors.primary : theme.colors.text.muted)};
  }

  &:hover {
    border-color: ${theme.colors.primary};
    background: ${theme.colors.featureBg.blue};
    color: ${theme.colors.primary};
    transform: translateY(-1px) scale(1.002);
    box-shadow: ${theme.shadows.sm};
  }

  &:active {
    transform: translateY(0);
  }

  &:focus-visible {
    outline: none;
    box-shadow: 0 0 0 2px ${theme.colors.border.focus};
  }
`;

export const ClinicResultTitle = styled.span`
  font-size: 13px;
  font-weight: 600;
`;

export const ClinicResultMeta = styled.span`
  font-size: 12px;
  color: ${theme.colors.text.muted};
`;

export const SlotsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(92px, 1fr));
  gap: 8px;
`;

export const SlotButton = styled.button<{ $selected: boolean; $available: boolean }>`
  height: 36px;
  border-radius: ${theme.borderRadius.sm};
  border: 1px solid
    ${({ $selected, $available }) =>
      $selected
        ? theme.colors.primary
        : $available
          ? theme.colors.border.default
          : theme.colors.border.lighter};
  background: ${({ $selected, $available }) =>
    $selected
      ? theme.colors.primary
      : $available
        ? theme.colors.surface
        : theme.colors.surfaceMuted};
  color: ${({ $selected, $available }) =>
    $selected
      ? theme.colors.text.inverse
      : $available
        ? theme.colors.text.primary
        : theme.colors.text.disabled};
  font-family: "Roboto", sans-serif;
  font-size: 13px;
  font-weight: ${({ $selected }) => ($selected ? 600 : 500)};
  cursor: ${({ $available }) => ($available ? "pointer" : "not-allowed")};

  &:hover:not(:disabled) {
    border-color: ${theme.colors.primary};
    color: ${({ $selected }) => ($selected ? theme.colors.text.inverse : theme.colors.primary)};
  }
`;

export const BookingEmpty = styled.p`
  margin: 0;
  font-family: "Roboto", sans-serif;
  font-size: 13px;
  color: ${theme.colors.text.muted};
`;

// ─── Detail / Reschedule Modal ────────────────────────────────────────────────

export const ModalActionSection = styled.div`
  margin-top: 20px;
  padding-top: 16px;
  border-top: 1px solid ${theme.colors.border.lighter};
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const ModalNotice = styled.p`
  margin: 0;
  font-family: "Roboto", sans-serif;
  font-size: 12px;
  color: ${theme.colors.text.muted};
`;

export const ModalActionRow = styled.div`
  display: flex;
  gap: 8px;

  @media (max-width: ${theme.breakpoints.tablet}) {
    flex-direction: column;
  }
`;

export const ModalRescheduleBtn = styled.button`
  flex: 1;
  height: 40px;
  border: 1px solid ${theme.colors.primary};
  background: ${theme.colors.primary};
  color: ${theme.colors.text.inverse};
  border-radius: ${theme.borderRadius.md};
  font-family: "Roboto", sans-serif;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  transition: filter 0.15s ease;

  &:hover:not(:disabled) {
    filter: brightness(1.08);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export const ModalCancelBtn = styled.button`
  flex: 1;
  height: 40px;
  border: 1px solid var(--mc-status-cancelled-border, #fca5a5);
  background: var(--mc-status-cancelled-bg, #fee2e2);
  color: var(--mc-status-cancelled-text, #dc2626);
  border-radius: ${theme.borderRadius.md};
  font-family: "Roboto", sans-serif;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: filter 0.15s ease;

  &:hover:not(:disabled) {
    filter: brightness(1.06);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export const ModalInfoBanner = styled.div`
  background: var(--mc-status-progress-bg, #dbeafe);
  border: 1px solid var(--mc-status-progress-border, #93c5fd);
  border-radius: ${theme.borderRadius.md};
  padding: 12px 14px;
  font-family: "Roboto", sans-serif;
  font-size: 13px;
  color: var(--mc-status-progress-text, #1e40af);
  display: flex;
  flex-direction: column;
  gap: 3px;
`;

export const ModalWarningBox = styled.div`
  background: var(--mc-status-cancelled-bg, #fee2e2);
  border: 1px solid var(--mc-status-cancelled-border, #fca5a5);
  border-radius: ${theme.borderRadius.md};
  padding: 16px;
  font-family: "Roboto", sans-serif;
  font-size: 14px;
  color: var(--mc-status-cancelled-text, #991b1b);
  line-height: 1.6;
`;

export const RescheduleForm = styled.div`
  display: flex;
  flex-direction: column;
  gap: 14px;
`;
