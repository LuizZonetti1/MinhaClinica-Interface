import styled from "styled-components";
import { theme } from "../../../themes/themes";

export const PageWrapper = styled.div`
  padding: 32px;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

export const TopRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;

  @media (max-width: ${theme.breakpoints?.tablet ?? "768px"}) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

export const TitleBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

export const PageTitle = styled.h1`
  margin: 0;
  font-family: "Roboto", sans-serif;
  font-size: 32px;
  font-weight: 700;
  color: ${theme.colors.text.primary};
`;

export const PageSubtitle = styled.p`
  margin: 0;
  font-family: "Roboto", sans-serif;
  font-size: 15px;
  color: ${theme.colors.text.muted};
`;

export const MarkAllBtn = styled.button`
  border: 1px solid ${theme.colors.primary};
  padding: 8px 16px;
  border-radius: ${theme.borderRadius.sm};
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  background: transparent;
  color: ${theme.colors.primary};
  transition: background 0.15s, color 0.15s;

  &:hover {
    background: ${theme.colors.primary};
    color: #fff;
  }

  &:disabled {
    opacity: 0.4;
    cursor: default;
  }
`;

export const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 64px 32px;
  color: ${theme.colors.text.muted};
  font-size: 1rem;
`;

export const NotifList = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export const NotifCard = styled.li<{ $unread: boolean }>`
  display: flex;
  align-items: flex-start;
  gap: 14px;
  padding: 14px 18px;
  border-radius: ${theme.borderRadius.md};
  background: ${({ $unread }) => ($unread ? theme.colors.surfaceHover : theme.colors.surface)};
  border: 1px solid ${({ $unread }) => ($unread ? theme.colors.border.focus : theme.colors.border.light)};
  cursor: ${({ $unread }) => ($unread ? "pointer" : "default")};
  transition: background 0.15s;

  &:hover {
    background: ${theme.colors.surfaceHover};
  }
`;

export const IconWrap = styled.span<{ $color: string }>`
  flex-shrink: 0;
  width: 34px;
  height: 34px;
  border-radius: 50%;
  background: ${({ $color }) => $color}22;
  color: ${({ $color }) => $color};
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const CardContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex: 1;
  min-width: 0;
`;

export const CardSubject = styled.span<{ $unread: boolean }>`
  font-size: 0.9rem;
  font-weight: ${({ $unread }) => ($unread ? 700 : 500)};
  color: ${theme.colors.text.primary};
`;

export const CardMessage = styled.p`
  margin: 0;
  font-size: 0.85rem;
  color: ${theme.colors.text.secondary};
  line-height: 1.4;
`;

export const CardMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 4px;
`;

export const CardTime = styled.span`
  font-size: 0.75rem;
  color: ${theme.colors.text.muted};
`;

export const UnreadBadge = styled.span`
  font-size: 0.7rem;
  font-weight: 700;
  color: #fff;
  background: ${theme.colors.primary};
  padding: 2px 8px;
  border-radius: 99px;
`;
