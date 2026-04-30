import styled from "styled-components";
import { theme } from "../../../themes/themes";

// ─── Shared ───────────────────────────────────────────────────────────────────

export const PageWrapper = styled.div`
  padding: 32px;
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

export const PageTitle = styled.h1`
  font-family: 'Roboto', sans-serif;
  font-size: 24px;
  font-weight: 700;
  color: ${theme.colors.text.primary};
  margin: 0;
`;

// ─── Gate screen ──────────────────────────────────────────────────────────────

export const SectionCard = styled.div`
  background: ${theme.colors.surface};
  border: 1px solid ${theme.colors.border.light};
  border-radius: ${theme.borderRadius.lg};
  padding: 28px 32px;
`;

export const SectionQuestion = styled.h2`
  font-family: 'Roboto', sans-serif;
  font-size: 18px;
  font-weight: 600;
  color: ${theme.colors.text.primary};
  margin: 0 0 8px;
`;

export const SectionSubtitle = styled.p`
  font-family: 'Roboto', sans-serif;
  font-size: 14px;
  font-weight: 400;
  color: ${theme.colors.text.secondary};
  margin: 0 0 24px;
`;

export const OptionsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;

  @media (max-width: ${theme.breakpoints.tablet}) {
    grid-template-columns: 1fr;
  }
`;

export const OptionCard = styled.button<{ $variant: "blue" | "green" }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 32px 24px;
  border-radius: ${theme.borderRadius.md};
  border: 1px solid transparent;
  cursor: pointer;
  text-align: center;
  transition: box-shadow 0.2s, transform 0.15s, border-color 0.2s;
  background: ${({ $variant }) =>
    $variant === "blue" ? theme.colors.featureBg.blue : theme.colors.featureBg.green};

  &:hover {
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
    transform: translateY(-2px);
    border-color: ${({ $variant }) =>
      $variant === "blue" ? theme.colors.primary : theme.colors.success};
  }

  &:active {
    transform: translateY(0);
  }
`;

export const OptionIconWrap = styled.div<{ $variant: "blue" | "green" }>`
  width: 64px;
  height: 64px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${({ $variant }) =>
    $variant === "blue" ? theme.colors.primary : theme.colors.success};
  flex-shrink: 0;
`;

export const OptionTitle = styled.span`
  font-family: 'Roboto', sans-serif;
  font-size: 16px;
  font-weight: 600;
  color: ${theme.colors.text.primary};
`;

export const OptionLink = styled.span<{ $variant: "blue" | "green" }>`
  font-family: 'Roboto', sans-serif;
  font-size: 13px;
  font-weight: 500;
  color: ${({ $variant }) =>
    $variant === "blue" ? theme.colors.primary : theme.colors.success};
`;

// ─── Wizard shell ─────────────────────────────────────────────────────────────

export const StepperWrapper = styled.div`
  max-width: 420px;
  width: 100%;
  margin: 0 auto;
`;

export const StepCard = styled.div`
  background: ${theme.colors.surface};
  border: 1px solid ${theme.colors.border.light};
  border-radius: ${theme.borderRadius.lg};
  padding: 28px 32px;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

export const StepTitle = styled.h2`
  font-family: 'Roboto', sans-serif;
  font-size: 18px;
  font-weight: 600;
  color: ${theme.colors.text.primary};
  margin: 0;
`;

// ─── Form primitives (shared across steps) ───────────────────────────────────

export const FormGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;

  @media (max-width: ${theme.breakpoints.tablet}) {
    grid-template-columns: 1fr;
  }
`;

export const FieldBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  min-width: 0;
`;

export const FieldLabel = styled.label`
  font-family: 'Roboto', sans-serif;
  font-size: 14px;
  font-weight: 500;
  color: ${theme.colors.text.secondary};
`;

export const FieldError = styled.span`
  font-family: 'Roboto', sans-serif;
  font-size: 12px;
  color: ${theme.colors.error};
`;

export const FormSelect = styled.select`
  height: 48px;
  width: 100%;
  padding: 0 36px 0 ${theme.spacing.md};
  border: 2px solid ${theme.colors.border.lighter};
  border-radius: ${theme.borderRadius.md};
  background: ${theme.colors.surface};
  font-family: 'Roboto', sans-serif;
  font-size: 14px;
  font-weight: 400;
  color: ${theme.colors.text.primary};
  outline: none;
  cursor: pointer;
  transition: border-color 0.2s;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%236B7280' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 14px center;

  &:focus {
    border-color: ${theme.colors.border.focus};
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

export const FormActions = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 12px;
  padding-top: 4px;
`;

// ─── Step 1 — Patient search ──────────────────────────────────────────────────

export const SearchWrapper = styled.div`
  position: relative;
`;

export const SearchResultList = styled.ul`
  position: absolute;
  top: calc(100% + 4px);
  left: 0;
  right: 0;
  z-index: 100;
  background: ${theme.colors.surface};
  border: 1px solid ${theme.colors.border.default};
  border-radius: ${theme.borderRadius.md};
  box-shadow: ${theme.shadows.md};
  list-style: none;
  margin: 0;
  padding: 4px 0;
  max-height: 240px;
  overflow-y: auto;
`;

export const SearchResultItem = styled.li<{ $disabled?: boolean }>`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 16px;
  cursor: ${({ $disabled }) => ($disabled ? "default" : "pointer")};
  color: ${({ $disabled }) => ($disabled ? theme.colors.text.muted : theme.colors.text.primary)};
  font-family: 'Roboto', sans-serif;
  font-size: 14px;
  transition: background 0.15s;

  &:hover {
    background: ${({ $disabled }) => ($disabled ? "transparent" : theme.colors.surfaceMuted)};
  }
`;

export const PatientAvatar = styled.div<{ $size?: number }>`
  width: ${({ $size = 36 }) => `${$size}px`};
  height: ${({ $size = 36 }) => `${$size}px`};
  border-radius: 50%;
  overflow: hidden;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${theme.colors.featureBg.blue};
  color: ${theme.colors.primary};
  font-family: 'Roboto', sans-serif;
  font-size: 12px;
  font-weight: 700;
  border: 1px solid ${theme.colors.border.light};

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }
`;

export const SearchResultInfo = styled.div`
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

export const SearchResultName = styled.span`
  font-family: 'Roboto', sans-serif;
  font-size: 14px;
  font-weight: 600;
  color: ${theme.colors.text.primary};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const SearchResultMeta = styled.span`
  font-family: 'Roboto', sans-serif;
  font-size: 12px;
  color: ${theme.colors.text.secondary};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const SelectedBadge = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  background: ${theme.colors.featureBg.blue};
  border: 1px solid ${theme.colors.primary}40;
  border-radius: ${theme.borderRadius.md};
  gap: 12px;
`;

export const SelectedBadgeContent = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 0;
`;

export const SelectedBadgeInfo = styled.div`
  min-width: 0;
`;

export const SelectedBadgeName = styled.p`
  font-family: 'Roboto', sans-serif;
  font-size: 14px;
  font-weight: 600;
  color: ${theme.colors.text.primary};
  margin: 0;
`;

export const SelectedBadgeSub = styled.p`
  font-family: 'Roboto', sans-serif;
  font-size: 12px;
  color: ${theme.colors.text.secondary};
  margin: 0;
`;

export const SelectedBadgeClear = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  border: none;
  background: none;
  color: ${theme.colors.text.muted};
  cursor: pointer;
  flex-shrink: 0;
  transition: background 0.15s, color 0.15s;

  &:hover {
    background: ${theme.colors.border.light};
    color: ${theme.colors.error};
  }
`;

// ─── Step 2 — Slots ───────────────────────────────────────────────────────────

export const SlotSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const SlotSectionTitle = styled.h3`
  font-family: 'Roboto', sans-serif;
  font-size: 15px;
  font-weight: 600;
  color: ${theme.colors.text.primary};
  margin: 0;
`;

export const SlotGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(76px, 1fr));
  gap: 8px;
`;

export const SlotBtn = styled.button<{ $available: boolean; $selected: boolean }>`
  height: 40px;
  border-radius: ${theme.borderRadius.sm};
  border: 1.5px solid
    ${({ $selected, $available }) =>
      $selected
        ? theme.colors.primary
        : $available
          ? theme.colors.border.default
          : theme.colors.border.lighter};
  background: ${({ $selected, $available }) =>
    $selected ? theme.colors.primary : $available ? theme.colors.surface : theme.colors.surfaceMuted};
  color: ${({ $selected, $available }) =>
    $selected
      ? theme.colors.text.inverse
      : $available
        ? theme.colors.text.primary
        : theme.colors.text.disabled};
  font-family: 'Roboto', sans-serif;
  font-size: 13px;
  font-weight: ${({ $selected }) => ($selected ? 600 : 400)};
  cursor: ${({ $available }) => ($available ? "pointer" : "not-allowed")};
  transition: all 0.15s;

  &:hover:not(:disabled) {
    border-color: ${theme.colors.primary};
    color: ${({ $selected }) =>
      $selected ? theme.colors.text.inverse : theme.colors.primary};
  }
`;

export const SlotsEmpty = styled.p`
  font-family: 'Roboto', sans-serif;
  font-size: 14px;
  color: ${theme.colors.text.muted};
  text-align: center;
  padding: 16px 0;
  margin: 0;
`;

// ─── Step 3 — Confirmation summary ───────────────────────────────────────────

export const SummaryTableWrapper = styled.div`
  border: 1px solid ${theme.colors.border.light};
  border-radius: ${theme.borderRadius.md};
  overflow: hidden;
`;

export const SummaryTable = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

export const SummaryRow = styled.tr`
  border-bottom: 1px solid ${theme.colors.border.lighter};

  &:last-child {
    border-bottom: none;
  }
`;

export const SummaryLabel = styled.td`
  padding: 12px 20px;
  font-family: 'Roboto', sans-serif;
  font-size: 14px;
  font-weight: 400;
  color: ${theme.colors.text.muted};
  background: ${theme.colors.background};
  width: 140px;
  white-space: nowrap;
`;

export const SummaryValue = styled.td`
  padding: 12px 20px;
  font-family: 'Roboto', sans-serif;
  font-size: 14px;
  font-weight: 500;
  color: ${theme.colors.text.primary};
  text-align: right;
`;

export const ObservationsSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

export const ObservationsTextarea = styled.textarea`
  width: 100%;
  min-height: 88px;
  padding: ${theme.spacing.md};
  border: 2px solid ${theme.colors.border.lighter};
  border-radius: ${theme.borderRadius.md};
  background: ${theme.colors.surface};
  font-family: 'Roboto', sans-serif;
  font-size: 14px;
  font-weight: 400;
  color: ${theme.colors.text.primary};
  outline: none;
  resize: vertical;
  transition: border-color 0.2s;
  box-sizing: border-box;

  &::placeholder {
    color: ${theme.colors.text.disabled};
    font-size: 13px;
  }

  &:focus {
    border-color: ${theme.colors.border.focus};
  }
`;

export const ConfirmButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  height: 44px;
  padding: 0 24px;
  border-radius: ${theme.borderRadius.md};
  border: none;
  background: ${theme.colors.success};
  color: ${theme.colors.text.inverse};
  font-family: 'Roboto', sans-serif;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s, box-shadow 0.2s;

  &:hover:not(:disabled) {
    background: ${theme.colors.successHover};
    box-shadow: 0 4px 12px rgba(22, 163, 74, 0.3);
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;
