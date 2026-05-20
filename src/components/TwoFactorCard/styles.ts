import styled from "styled-components";
import { theme } from "../../themes/themes";

export const Card = styled.div`
  background-color: ${theme.colors.surface};
  border: 1px solid ${theme.colors.border.light};
  border-radius: ${theme.borderRadius.lg};
  padding: 28px;
  box-shadow: ${theme.shadows.sm};
  margin-bottom: 24px;
  display: flex;
  flex-direction: column;
`;

export const CardTitle = styled.h3`
  margin: 0 0 24px;
  font-family: "Roboto", sans-serif;
  font-size: 15px;
  font-weight: 600;
  color: ${theme.colors.text.primary};
  padding-bottom: 16px;
  border-bottom: 1px solid ${theme.colors.border.lighter};
  display: flex;
  align-items: center;
`;

export const StatusRow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  font-family: "Roboto", sans-serif;
  font-size: 14px;
  color: ${theme.colors.text.secondary};
`;

export const StatusBadge = styled.span<{ $enabled: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  white-space: nowrap;
  background-color: ${({ $enabled }) =>
    $enabled ? theme.colors.success + "20" : theme.colors.error + "18"};
  color: ${({ $enabled }) => ($enabled ? theme.colors.success : theme.colors.error)};
`;

export const StepTitle = styled.p`
  font-family: "Roboto", sans-serif;
  font-size: 14px;
  font-weight: 600;
  color: ${theme.colors.text.primary};
  margin: 0 0 8px;
`;

export const StepHint = styled.p`
  font-family: "Roboto", sans-serif;
  font-size: 13px;
  font-weight: 400;
  color: ${theme.colors.text.muted};
  margin: 0 0 12px;
  line-height: 1.5;
`;

export const QRImage = styled.img`
  width: 180px;
  height: 180px;
  align-self: center;
  border: 1px solid ${theme.colors.border.light};
  border-radius: 8px;
  margin-bottom: 12px;
`;

export const SecretBox = styled.code`
  display: block;
  background: ${theme.colors.surfaceMuted};
  border: 1px solid ${theme.colors.border.light};
  border-radius: 6px;
  padding: 8px 12px;
  font-size: 13px;
  letter-spacing: 2px;
  color: ${theme.colors.text.primary};
  word-break: break-all;
  margin-bottom: 4px;
`;
