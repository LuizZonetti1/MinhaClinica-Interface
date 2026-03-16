import { Link } from "react-router";
import styled from "styled-components";
import { theme } from "../../themes/themes";

export const LayoutWrapper = styled.div`
  display: flex;
  height: 100vh;
  overflow: hidden;
  background-color: ${theme.colors.background};
`;

export const ContentArea = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
  overflow: hidden;
`;

export const TopBar = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 32px;
  height: 64px;
  background-color: ${theme.colors.background};
  border-bottom: 1px solid ${theme.colors.border.lighter};
  position: sticky;
  top: 0;
  z-index: 10;
`;

export const PageTitle = styled.div`
  font-family: "Roboto", sans-serif;
  font-size: 14px;
  font-weight: 500;
  color: ${theme.colors.text.primary};
`;

export const Breadcrumb = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 10px;
`;

export const BreadcrumbText = styled.span<{ $current?: boolean }>`
  color: ${({ $current }) => ($current ? theme.colors.text.primary : theme.colors.text.muted)};
  font-weight: ${({ $current }) => ($current ? 600 : 400)};
`;

export const BreadcrumbLink = styled(Link)<{ $current?: boolean }>`
  text-decoration: none;
  color: ${({ $current }) => ($current ? theme.colors.text.primary : theme.colors.text.muted)};
  font-weight: ${({ $current }) => ($current ? 600 : 400)};
  transition: color 0.15s;

  &:hover {
    color: ${theme.colors.text.link};
  }
`;

export const HeaderRight = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

export const SearchBox = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  background-color: ${theme.colors.surface};
  border: 1.5px solid ${theme.colors.border.light};
  border-radius: ${theme.borderRadius.sm};
  padding: 0 12px;
  height: 36px;
  min-width: 280px;

  svg {
    width: 18px;
    height: 18px;
    color: ${theme.colors.text.muted};
  }

  span {
    font-family: "Roboto", sans-serif;
    font-size: 14px;
    color: ${theme.colors.text.disabled};
  }
`;

export const BellWrapper = styled.div`
  position: relative;
  width: 36px;
  height: 36px;
  border: 1.5px solid ${theme.colors.border.light};
  border-radius: ${theme.borderRadius.sm};
  background-color: ${theme.colors.surface};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background-color 0.15s;

  svg {
    width: 20px;
    height: 20px;
    color: ${theme.colors.text.secondary};
  }

  &:hover {
    background-color: ${theme.colors.surfaceMuted};
  }
`;

export const ThemeToggleButton = styled.button`
  width: 36px;
  height: 36px;
  border: 1.5px solid ${theme.colors.border.light};
  border-radius: ${theme.borderRadius.sm};
  background-color: ${theme.colors.surface};
  color: ${theme.colors.text.secondary};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background-color 0.15s;

  &:hover {
    background-color: ${theme.colors.surfaceMuted};
  }

  svg {
    width: 18px;
    height: 18px;
  }
`;

export const NotificationBadge = styled.span`
  position: absolute;
  top: 2px;
  right: 2px;
  background-color: #ef4444;
  color: white;
  font-family: "Roboto", sans-serif;
  font-size: 10px;
  font-weight: 700;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const ProfileMenuWrapper = styled.div`
  position: relative;
`;

export const HeaderAvatar = styled.button<{ $active: boolean }>`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 1px solid ${theme.colors.border.light};
  background-color: ${theme.colors.primaryHover};
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  padding: 0;
  box-shadow: ${({ $active }) => ($active ? `0 0 0 2px ${theme.colors.border.focus}` : "none")};

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  span {
    font-family: "Roboto", sans-serif;
    font-size: 12px;
    font-weight: 600;
    color: white;
  }
`;

export const ProfileMenuCard = styled.div`
  position: absolute;
  top: calc(100% + 10px);
  right: 0;
  width: 300px;
  background-color: ${theme.colors.surface};
  border: 1px solid ${theme.colors.border.light};
  border-radius: ${theme.borderRadius.md};
  box-shadow: ${theme.shadows.lg};
  overflow: hidden;
  z-index: 20;
`;

export const ProfileMenuHeader = styled.div`
  padding: 14px;
  display: flex;
  gap: 10px;
  border-bottom: 1px solid ${theme.colors.border.lighter};
`;

export const ProfileMenuAvatar = styled.button`
  width: 52px;
  height: 52px;
  border-radius: 50%;
  border: 1px solid ${theme.colors.border.light};
  background-color: ${theme.colors.primaryHover};
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  flex-shrink: 0;
  padding: 0;
  cursor: pointer;
  transition: filter 0.15s, box-shadow 0.15s;

  &:hover {
    filter: brightness(1.03);
  }

  &:focus-visible {
    outline: none;
    box-shadow: 0 0 0 2px ${theme.colors.border.focus};
  }

  &:disabled {
    cursor: default;
    filter: none;
    box-shadow: none;
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  span {
    font-family: "Roboto", sans-serif;
    font-size: 16px;
    font-weight: 700;
    color: ${theme.colors.text.inverse};
  }
`;

export const ProfileMenuIdentity = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  min-width: 0;
`;

export const ProfileMenuName = styled.p`
  font-family: "Roboto", sans-serif;
  font-size: 18px;
  font-weight: 700;
  line-height: 1.2;
  color: ${theme.colors.text.primary};
  margin: 0;
  word-break: break-word;
`;

export const ProfileMenuInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  color: ${theme.colors.text.secondary};

  span {
    font-family: "Roboto", sans-serif;
    font-size: 14px;
    line-height: 1.3;
  }

  svg {
    width: 14px;
    height: 14px;
    flex-shrink: 0;
  }
`;

export const ProfileMenuActions = styled.div`
  padding: 8px;
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

export const ProfileMenuActionButton = styled.button<{ $danger?: boolean }>`
  width: 100%;
  border: none;
  background: transparent;
  border-radius: ${theme.borderRadius.sm};
  height: 38px;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 0 10px;
  cursor: pointer;
  color: ${({ $danger }) => ($danger ? theme.colors.error : theme.colors.text.primary)};
  font-family: "Roboto", sans-serif;
  font-size: 14px;
  font-weight: 500;

  &:hover {
    background-color: ${theme.colors.surfaceMuted};
  }

  &:disabled {
    opacity: 0.45;
    cursor: not-allowed;
  }

  svg {
    width: 16px;
    height: 16px;
  }
`;

export const MainContent = styled.main`
  flex: 1;
  overflow-y: auto;
`;
