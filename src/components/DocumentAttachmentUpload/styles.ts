import styled, { css } from "styled-components";
import { theme } from "../../themes/themes";

// ─── Wrappers ─────────────────────────────────────────────────────────────────

export const AttachmentSection = styled.div`
  margin-top: ${theme.spacing.xl};
  padding-top: ${theme.spacing.xl};
  border-top: 2px dashed ${theme.colors.border.light};

  @media print {
    display: none;
  }
`;

export const AttachmentSectionTitle = styled.h3`
  font-size: 0.875rem;
  font-weight: 600;
  color: ${theme.colors.text.primary};
  margin: 0 0 ${theme.spacing.md};
`;

// ─── Upload zone ──────────────────────────────────────────────────────────────

export const UploadZone = styled.label<{ $dragOver?: boolean; $disabled?: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: ${theme.spacing.sm};
  padding: ${theme.spacing.xl};
  border: 2px dashed ${theme.colors.border.default};
  border-radius: ${theme.borderRadius.md};
  background: ${theme.colors.surfaceMuted};
  cursor: pointer;
  transition: border-color 0.15s, background 0.15s;

  ${({ $dragOver }) =>
    $dragOver &&
    css`
      border-color: ${theme.colors.primary};
      background: ${theme.colors.featureBg.blue};
    `}

  ${({ $disabled }) =>
    $disabled &&
    css`
      opacity: 0.5;
      pointer-events: none;
    `}

  &:hover:not([data-disabled]) {
    border-color: ${theme.colors.primary};
  }
`;

export const UploadZoneInput = styled.input`
  display: none;
`;

export const UploadZoneText = styled.span`
  font-size: 0.8125rem;
  color: ${theme.colors.text.secondary};
  text-align: center;
`;

export const UploadZoneHint = styled.span`
  font-size: 0.75rem;
  color: ${theme.colors.text.muted};
`;

// ─── Attachment list ──────────────────────────────────────────────────────────

export const AttachmentList = styled.ul`
  list-style: none;
  margin: ${theme.spacing.md} 0 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.sm};
`;

export const AttachmentItem = styled.li`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.sm};
  padding: ${theme.spacing.sm} ${theme.spacing.md};
  border: 1px solid ${theme.colors.border.light};
  border-radius: ${theme.borderRadius.sm};
  background: ${theme.colors.surface};
`;

export const AttachmentThumb = styled.img`
  width: 40px;
  height: 40px;
  object-fit: cover;
  border-radius: 4px;
  flex-shrink: 0;
  border: 1px solid ${theme.colors.border.light};
`;

export const AttachmentFilePlaceholder = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 4px;
  flex-shrink: 0;
  background: ${theme.colors.surfaceMuted};
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid ${theme.colors.border.light};
`;

export const AttachmentInfo = styled.div`
  flex: 1;
  min-width: 0;
`;

export const AttachmentFileName = styled.span`
  display: block;
  font-size: 0.8125rem;
  font-weight: 500;
  color: ${theme.colors.text.primary};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const AttachmentFileMeta = styled.span`
  display: block;
  font-size: 0.6875rem;
  color: ${theme.colors.text.muted};
`;

export const AttachmentActions = styled.div`
  display: flex;
  gap: ${theme.spacing.xs};
  flex-shrink: 0;
`;

export const AttachmentIconBtn = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  background: transparent;
  color: ${theme.colors.text.muted};
  transition: background 0.15s, color 0.15s;

  &:hover {
    background: ${theme.colors.surfaceHover};
    color: ${theme.colors.text.primary};
  }

  &[data-danger] {
    &:hover {
      background: #fee2e2;
      color: ${theme.colors.error};
    }
  }

  &:disabled {
    opacity: 0.4;
    pointer-events: none;
  }
`;

export const AttachmentError = styled.p`
  margin: ${theme.spacing.sm} 0 0;
  font-size: 0.75rem;
  color: ${theme.colors.error};
`;
