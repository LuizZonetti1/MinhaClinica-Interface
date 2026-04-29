import styled, { keyframes } from "styled-components";
import { theme } from "../../themes/themes";

const dropIn = keyframes`
  from { opacity: 0; transform: translateY(-8px) scale(0.97); }
  to   { opacity: 1; transform: translateY(0) scale(1); }
`;

const spin = keyframes`
  to { transform: rotate(360deg); }
`;

export const Overlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 1100;
  background: transparent;
`;

export const Caret = styled.div<{ $top: number; $centerX: number }>`
  position: fixed;
  top: ${({ $top }) => $top}px;
  left: ${({ $centerX }) => $centerX}px;
  transform: translateX(-50%);
  z-index: 1103;
  pointer-events: none;

  &::before,
  &::after {
    content: '';
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    width: 0;
    height: 0;
    border-left: 8px solid transparent;
    border-right: 8px solid transparent;
  }

  &::before {
    top: 0;
    border-bottom: 9px solid ${theme.colors.border.light};
  }

  &::after {
    top: 2px;
    border-bottom: 8px solid ${theme.colors.surface};
  }
`;

export const Panel = styled.aside<{ $top: number; $right: number }>`
  position: fixed;
  top: ${({ $top }) => $top}px;
  right: ${({ $right }) => $right}px;
  z-index: 1102;
  width: min(380px, calc(100vw - 16px));
  max-height: min(540px, calc(100vh - ${({ $top }) => $top}px - 16px));
  display: flex;
  flex-direction: column;
  background: ${theme.colors.surface};
  border: 1px solid ${theme.colors.border.light};
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.18), 0 2px 8px rgba(0, 0, 0, 0.06);
  animation: ${dropIn} 0.18s ease;
  overflow: hidden;
`;

export const PanelHeader = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 16px 12px;
  border-bottom: 1px solid ${theme.colors.border.light};
  gap: 8px;
  flex-shrink: 0;
`;

export const PanelTitle = styled.h2`
  margin: 0;
  font-size: 1rem;
  font-weight: 700;
  color: ${theme.colors.text.primary};
  flex: 1;
`;

export const HeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
`;

export const IconButton = styled.button`
  width: 32px;
  height: 32px;
  border: 0;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  background: transparent;
  color: ${theme.colors.text.secondary};
  transition: background 0.15s, color 0.15s;

  &:hover {
    background: ${theme.colors.surfaceMuted};
    color: ${theme.colors.text.primary};
  }
`;

export const MarkAllButton = styled.button`
  border: 0;
  border-radius: ${theme.borderRadius.sm};
  padding: 5px 10px;
  font-size: 0.76rem;
  font-weight: 600;
  cursor: pointer;
  background: transparent;
  color: ${theme.colors.primary};
  transition: background 0.15s;

  &:hover {
    background: ${theme.colors.surfaceMuted};
  }

  &:disabled {
    opacity: 0.4;
    cursor: default;
  }
`;

export const List = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
  overflow-y: auto;
  flex: 1;
  max-height: 400px;
`;

export const LoadingState = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 48px 0;
`;

export const Spinner = styled.span`
  display: inline-block;
  width: 32px;
  height: 32px;
  border: 3px solid ${theme.colors.border.light};
  border-top-color: ${theme.colors.primary};
  border-radius: 50%;
  animation: ${spin} 0.7s linear infinite;
`;

export const EmptyState = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  color: ${theme.colors.text.muted};
  font-size: 0.88rem;
  padding: 48px 2rem;
`;

export const NotifItem = styled.li<{ $unread: boolean }>`
  display: flex;
  gap: 10px;
  padding: 12px 16px;
  border-bottom: 1px solid ${theme.colors.border.lighter};
  cursor: pointer;
  background: ${({ $unread }) => ($unread ? "rgba(59,130,246,0.05)" : "transparent")};
  transition: background 0.12s;

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background: ${theme.colors.surfaceMuted};
  }
`;

export const IconWrap = styled.div<{ $color: string }>`
  flex-shrink: 0;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${({ $color }) => $color};
  color: #fff;
`;

export const NotifContent = styled.div`
  flex: 1;
  min-width: 0;
`;

export const NotifSubject = styled.p<{ $unread: boolean }>`
  margin: 0 0 2px;
  font-size: 0.85rem;
  font-weight: ${({ $unread }) => ($unread ? 700 : 500)};
  color: ${theme.colors.text.primary};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const NotifMessage = styled.p`
  margin: 0 0 4px;
  font-size: 0.82rem;
  color: ${theme.colors.text.secondary};
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

export const NotifTime = styled.span`
  font-size: 0.75rem;
  color: ${theme.colors.text.muted};
`;

export const UnreadDot = styled.span`
  flex-shrink: 0;
  margin-top: 6px;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${theme.colors.primary};
`;

export const DeleteButton = styled.button`
  flex-shrink: 0;
  align-self: center;
  width: 26px;
  height: 26px;
  border: 0;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  background: transparent;
  color: transparent;
  transition: background 0.15s, color 0.15s;
  margin-left: 4px;

  ${NotifItem}:hover & {
    color: ${theme.colors.text.muted};
  }

  &:hover {
    background: ${theme.colors.error}22;
    color: ${theme.colors.error} !important;
  }
`;

export const PanelFooter = styled.footer`
  padding: 10px 16px;
  border-top: 1px solid ${theme.colors.border.light};
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const DetailBody = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 24px;
`;

export const DetailHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
`;

export const DetailIconWrap = styled.div<{ $color: string }>`
  flex-shrink: 0;
  width: 52px;
  height: 52px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${({ $color }) => $color};
  color: #fff;
`;

export const DetailTypeLabel = styled.span`
  font-size: 0.78rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: ${theme.colors.text.muted};
`;

export const DetailMessageText = styled.p`
  margin: 0;
  font-size: 0.92rem;
  line-height: 1.75;
  color: ${theme.colors.text.primary};
  white-space: pre-wrap;
  word-break: break-word;
`;

export const DetailMeta = styled.dl`
  margin: 0;
  padding: 16px;
  border-radius: ${theme.borderRadius.sm};
  background: ${theme.colors.surfaceMuted};
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 8px 16px;
  align-items: baseline;
`;

export const DetailMetaLabel = styled.dt`
  font-size: 0.78rem;
  font-weight: 600;
  color: ${theme.colors.text.muted};
  white-space: nowrap;
`;

export const DetailMetaValue = styled.dd`
  margin: 0;
  font-size: 0.82rem;
  color: ${theme.colors.text.secondary};
`;

export const SendButton = styled.button`
  width: 100%;
  padding: 9px 16px;
  border-radius: ${theme.borderRadius.sm};
  border: 0;
  font-size: 0.88rem;
  font-weight: 600;
  cursor: pointer;
  background: ${theme.colors.primary};
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: background 0.15s;

  &:hover {
    background: ${theme.colors.primaryHover};
  }
`;
