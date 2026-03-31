import styled from "styled-components";
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

export const FormCard = styled.form`
  background: ${theme.colors.surface};
  border: 1px solid ${theme.colors.border.default};
  border-radius: ${theme.borderRadius.md};
  padding: 20px 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const FormTitle = styled.h2`
  margin: 0;
  font-family: "Roboto", sans-serif;
  font-size: 16px;
  font-weight: 600;
  color: ${theme.colors.text.primary};
`;

export const FormFields = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const SearchWrapper = styled.div`
  position: relative;
`;

export const TodayAppointmentsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const TodayAppointmentItem = styled.button<{ $disabled?: boolean }>`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 14px;
  border: 1px solid ${theme.colors.border.default};
  border-radius: ${theme.borderRadius.md};
  background: ${theme.colors.surface};
  cursor: ${({ $disabled }) => ($disabled ? "not-allowed" : "pointer")};
  opacity: ${({ $disabled }) => ($disabled ? 0.65 : 1)};
  text-align: left;
  transition: border-color 0.15s ease, background 0.15s ease;

  &:hover {
    border-color: ${({ $disabled }) => ($disabled ? theme.colors.border.default : theme.colors.primary)};
    background: ${({ $disabled }) => ($disabled ? theme.colors.surface : theme.colors.surfaceMuted)};
  }
`;

export const TodayAppointmentsEmpty = styled.div`
  padding: 12px 14px;
  border: 1px dashed ${theme.colors.border.default};
  border-radius: ${theme.borderRadius.md};
  font-family: "Roboto", sans-serif;
  font-size: 13px;
  color: ${theme.colors.text.muted};
`;

export const SearchResultList = styled.ul`
  position: absolute;
  top: calc(100% + 4px);
  left: 0;
  right: 0;
  z-index: 10;
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
  font-family: "Roboto", sans-serif;
  font-size: 14px;
  transition: background 0.15s ease;

  &:hover {
    background: ${({ $disabled }) => ($disabled ? "transparent" : theme.colors.surfaceMuted)};
  }
`;

export const SearchResultInfo = styled.div`
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

export const SearchResultName = styled.span`
  font-family: "Roboto", sans-serif;
  font-size: 14px;
  font-weight: 600;
  color: ${theme.colors.text.primary};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const SearchResultMeta = styled.span`
  font-family: "Roboto", sans-serif;
  font-size: 12px;
  color: ${theme.colors.text.secondary};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const SelectedPatientCard = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 12px 16px;
  background: ${theme.colors.featureBg.blue};
  border: 1px solid ${theme.colors.primary}40;
  border-radius: ${theme.borderRadius.md};
`;

export const SelectedPatientContent = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 0;
`;

export const SelectedPatientInfo = styled.div`
  min-width: 0;
`;

export const SelectedPatientName = styled.p`
  margin: 0;
  font-family: "Roboto", sans-serif;
  font-size: 14px;
  font-weight: 600;
  color: ${theme.colors.text.primary};
`;

export const SelectedPatientMeta = styled.p`
  margin: 0;
  font-family: "Roboto", sans-serif;
  font-size: 12px;
  color: ${theme.colors.text.secondary};
`;

export const SelectedPatientClear = styled.button`
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
  transition: background 0.15s ease, color 0.15s ease;

  &:hover {
    background: ${theme.colors.border.light};
    color: ${theme.colors.error};
  }
`;

export const FormTextareaWrapper = styled.div`
  border: 2px solid ${theme.colors.border.lighter};
  border-radius: ${theme.borderRadius.md};
  background: ${theme.colors.surface};
  transition: border-color 0.2s;

  &:focus-within {
    border-color: ${theme.colors.border.focus};
  }
`;

export const FormTextarea = styled.textarea`
  display: block;
  width: 100%;
  min-height: 100px;
  padding: 12px;
  border: none;
  background: none;
  outline: none;
  resize: vertical;
  font-family: "Roboto", sans-serif;
  font-size: 14px;
  font-weight: 400;
  color: ${theme.colors.text.primary};
  box-sizing: border-box;

  &::placeholder {
    color: ${theme.colors.text.disabled};
    font-size: 13px;
  }
`;

export const FormActions = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 10px;
`;

export const CommentsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const CommentCard = styled.div`
  background: ${theme.colors.surface};
  border: 1px solid ${theme.colors.border.light};
  border-radius: ${theme.borderRadius.md};
  padding: 20px 24px;
  display: flex;
  flex-direction: column;
  gap: 14px;
`;

export const CommentCardHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;

  @media (max-width: ${theme.breakpoints.mobile}) {
    flex-direction: column;
  }
`;

export const CommentLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

export const CommentAvatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  overflow: hidden;
  background-color: ${theme.colors.primary};
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: "Roboto", sans-serif;
  font-size: 13px;
  font-weight: 700;
  flex-shrink: 0;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }
`;

export const CommentInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

export const CommentPatientName = styled.span`
  font-family: "Roboto", sans-serif;
  font-size: 14px;
  font-weight: 600;
  color: ${theme.colors.text.primary};
`;

export const CommentPatientSubtitle = styled.span`
  font-family: "Roboto", sans-serif;
  font-size: 12px;
  font-weight: 400;
  color: ${theme.colors.text.muted};
`;

export const CommentRight = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  flex-shrink: 0;
  flex-wrap: wrap;
`;

export const CommentDate = styled.span`
  font-family: "Roboto", sans-serif;
  font-size: 13px;
  font-weight: 400;
  color: ${theme.colors.text.muted};
  white-space: nowrap;
`;

export const CommentCardBody = styled.div`
  padding-left: 52px;

  @media (max-width: ${theme.breakpoints.mobile}) {
    padding-left: 0;
  }
`;

export const CommentText = styled.p`
  margin: 0;
  font-family: "Roboto", sans-serif;
  font-size: 14px;
  font-weight: 400;
  color: ${theme.colors.text.secondary};
  line-height: 1.6;
`;

export const CommentCardFooter = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 8px;
`;

export const EditButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  height: 34px;
  padding: 0 14px;
  border-radius: 8px;
  border: 1px solid ${theme.colors.border.default};
  background: ${theme.colors.surface};
  font-family: "Roboto", sans-serif;
  font-size: 13px;
  font-weight: 500;
  color: ${theme.colors.text.secondary};
  cursor: pointer;
  transition: border-color 0.15s ease, color 0.15s ease, opacity 0.15s ease;

  &:hover:not(:disabled) {
    border-color: ${theme.colors.primary};
    color: ${theme.colors.primary};
  }

  &:disabled {
    opacity: 0.55;
    cursor: not-allowed;
  }
`;

export const DeleteButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 34px;
  height: 34px;
  border-radius: 8px;
  border: none;
  background: rgba(239, 68, 68, 0.1);
  color: ${theme.colors.error};
  cursor: pointer;
  transition: background-color 0.15s ease;

  &:hover {
    background: rgba(239, 68, 68, 0.2);
  }

  &:disabled {
    opacity: 0.55;
    cursor: not-allowed;
  }
`;

export const EmptyState = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  font-family: "Roboto", sans-serif;
  font-size: 14px;
  color: ${theme.colors.text.muted};
  background: ${theme.colors.surface};
  border: 1px solid ${theme.colors.border.light};
  border-radius: ${theme.borderRadius.md};
`;

export const ConfirmMessage = styled.p`
  margin: 0;
  font-family: "Roboto", sans-serif;
  font-size: 14px;
  color: ${theme.colors.text.secondary};
  line-height: 1.5;
`;
