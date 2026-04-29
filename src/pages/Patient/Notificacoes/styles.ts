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
  gap: 8px;
`;

export const NotifCard = styled.li<{ $unread: boolean }>`
  display: flex;
  gap: 14px;
  padding: 18px 20px;
  background: ${({ $unread }) =>
        $unread
            ? `rgba(59,130,246,0.06)`
            : `${theme.colors.surface}`};
  border: 1px solid ${({ $unread }) =>
        $unread ? "rgba(59,130,246,0.2)" : theme.colors.border.light};
  border-radius: ${theme.borderRadius.md};
  cursor: pointer;
  transition: box-shadow 0.15s, background 0.15s;

  &:hover {
    box-shadow: ${theme.shadows?.card ?? "0 2px 12px rgba(0,0,0,0.08)"};
    background: ${theme.colors.surfaceMuted};
  }
`;

export const IconWrap = styled.div<{ $color: string }>`
  flex-shrink: 0;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${({ $color }) => $color};
  color: #fff;
`;

export const CardContent = styled.div`
  flex: 1;
  min-width: 0;
`;

export const CardSubject = styled.p<{ $unread: boolean }>`
  margin: 0 0 4px;
  font-size: 0.92rem;
  font-weight: ${({ $unread }) => ($unread ? 700 : 500)};
  color: ${theme.colors.text.primary};
`;

export const CardMessage = styled.p`
  margin: 0 0 6px;
  font-size: 0.85rem;
  color: ${theme.colors.text.secondary};
  line-height: 1.5;
`;

export const CardMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

export const CardTime = styled.span`
  font-size: 0.78rem;
  color: ${theme.colors.text.muted};
`;

export const UnreadBadge = styled.span`
  font-size: 0.72rem;
  font-weight: 700;
  padding: 2px 8px;
  border-radius: 999px;
  background: ${theme.colors.primary};
  color: #fff;
`;
