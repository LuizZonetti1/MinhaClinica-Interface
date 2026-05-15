import styled from "styled-components";
import { theme } from "../../../themes/themes";

export const PageWrapper = styled.div`
  padding: 32px;
`;

export const PageTitle = styled.h1`
  margin: 0 0 28px;
  font-family: "Roboto", sans-serif;
  font-size: 24px;
  font-weight: 700;
  color: ${theme.colors.text.primary};
`;

export const FormCard = styled.div`
  background-color: ${theme.colors.surface};
  border: 1px solid ${theme.colors.border.light};
  border-radius: ${theme.borderRadius.lg};
  padding: 28px;
  box-shadow: ${theme.shadows.sm};
  margin-bottom: 24px;
`;

export const FormCardTitle = styled.h2`
  margin: 0 0 24px;
  font-family: "Roboto", sans-serif;
  font-size: 15px;
  font-weight: 600;
  color: ${theme.colors.text.primary};
  padding-bottom: 16px;
  border-bottom: 1px solid ${theme.colors.border.lighter};
`;

export const AvatarUploadArea = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  margin-bottom: 28px;
`;

export const AvatarWrapper = styled.div`
  position: relative;
  width: 80px;
  height: 80px;
  cursor: pointer;
  border-radius: 50%;
`;

export const AvatarCircle = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background-color: ${theme.colors.surfaceMuted};
  border: 2px solid ${theme.colors.border.light};
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: "Roboto", sans-serif;
  font-size: 26px;
  font-weight: 700;
  color: ${theme.colors.text.secondary};
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

export const AvatarOverlay = styled.div`
  position: absolute;
  inset: 0;
  border-radius: 50%;
  background-color: rgba(0, 0, 0, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.2s;
  color: #ffffff;

  ${AvatarWrapper}:hover & {
    opacity: 1;
  }
`;

export const AvatarHint = styled.span`
  font-family: "Roboto", sans-serif;
  font-size: 13px;
  color: ${theme.colors.text.muted};
`;

export const FormGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;

  @media (max-width: ${theme.breakpoints.tablet}) {
    grid-template-columns: 1fr;
  }
`;

export const FullWidthField = styled.div`
  margin-bottom: 16px;
`;

export const PasswordRequirements = styled.p`
  margin: 10px 0 0;
  font-family: "Roboto", sans-serif;
  font-size: 12px;
  line-height: 1.45;
  color: ${theme.colors.text.muted};
`;

export const ActionRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 8px;
`;

// ─── Multi-role toggles ──────────────────────────────────────────────────────

export const RoleCheckboxList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0;
`;

export const RoleCheckboxItem = styled.label<{ $disabled?: boolean }>`
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 14px 4px;
  cursor: ${({ $disabled }) => ($disabled ? "not-allowed" : "pointer")};
  opacity: ${({ $disabled }) => ($disabled ? 0.55 : 1)};
  border-bottom: 1px solid ${theme.colors.border.lighter};

  &:last-child {
    border-bottom: none;
  }
`;

export const RoleToggle = styled.span<{ $checked?: boolean; $disabled?: boolean }>`
  position: relative;
  display: inline-block;
  flex-shrink: 0;
  width: 44px;
  height: 24px;
  border-radius: 12px;
  background: ${({ $checked }) => ($checked ? theme.colors.primary : "#d1d5db")};
  transition: background 0.2s;
  cursor: ${({ $disabled }) => ($disabled ? "not-allowed" : "pointer")};

  &::after {
    content: "";
    position: absolute;
    top: 2px;
    left: ${({ $checked }) => ($checked ? "22px" : "2px")};
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: #ffffff;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.25);
    transition: left 0.2s;
  }
`;

export const RoleCheckboxInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
  flex: 1;
`;

export const RoleCheckboxLabel = styled.span`
  font-family: "Roboto", sans-serif;
  font-size: 14px;
  font-weight: 500;
  color: ${theme.colors.text.primary};
`;

export const RoleCheckboxDesc = styled.span`
  font-family: "Roboto", sans-serif;
  font-size: 12px;
  color: ${theme.colors.text.muted};
`;
