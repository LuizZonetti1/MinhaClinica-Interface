import { NavLink } from 'react-router';
import styled from 'styled-components';
import { theme } from '../../themes/themes';

export const SidebarWrapper = styled.aside<{ $mobileOpen: boolean }>`
  width: 256px;
  min-width: 256px;
  height: 100dvh;
  background-color: ${theme.colors.dark};
  display: flex;
  flex-direction: column;
  position: sticky;
  top: 0;
  overflow-y: auto;
  z-index: 20;

  @media (max-width: ${theme.breakpoints.tablet}) {
    position: fixed;
    left: 0;
    top: 0;
    bottom: 0;
    width: min(280px, 84vw);
    min-width: 0;
    transform: ${({ $mobileOpen }) => ($mobileOpen ? "translateX(0)" : "translateX(-100%)")};
    transition: transform 0.2s ease;
    box-shadow: ${theme.shadows.lg};
  }
`;

export const SidebarOverlay = styled.button<{ $visible: boolean }>`
  position: fixed;
  inset: 0;
  border: none;
  background: rgba(15, 23, 42, 0.45);
  cursor: pointer;
  opacity: ${({ $visible }) => ($visible ? 1 : 0)};
  pointer-events: ${({ $visible }) => ($visible ? "auto" : "none")};
  transition: opacity 0.2s ease;
  z-index: 19;
  display: none;

  @media (max-width: ${theme.breakpoints.tablet}) {
    display: block;
  }
`;

export const MobileCloseButton = styled.button`
  display: none;
  width: 32px;
  height: 32px;
  border: 1px solid rgba(255, 255, 255, 0.22);
  border-radius: ${theme.borderRadius.sm};
  background: transparent;
  color: ${theme.colors.text.inverse};
  align-items: center;
  justify-content: center;
  cursor: pointer;
  flex-shrink: 0;

  svg {
    width: 16px;
    height: 16px;
  }

  @media (max-width: ${theme.breakpoints.tablet}) {
    display: inline-flex;
  }
`;

export const LogoRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding: 28px 16px 20px;
`;

export const LogoIdentity = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
`;

export const LogoIconWrapper = styled.div`
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  svg {
    width: 18px;
    height: 18px;
    color: ${theme.colors.text.inverse};
  }
`;

export const LogoText = styled.span`
  font-family: 'Roboto', sans-serif;
  font-size: 16px;
  font-weight: 700;
  color: ${theme.colors.text.inverse};
`;

export const Nav = styled.nav`
  display: flex;
  flex-direction: column;
  padding: 0 16px;
  gap: 0;
  flex: 1;
`;

export const NavItem = styled(NavLink)`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  border-radius: ${theme.borderRadius.sm};
  text-decoration: none;
  cursor: pointer;
  transition: background-color 0.15s;
  margin-bottom: 4px;

  font-family: 'Roboto', sans-serif;
  font-size: 14px;
  font-weight: 400;
  color: ${theme.colors.text.onDark};

  svg {
    width: 20px;
    height: 20px;
    flex-shrink: 0;
    color: ${theme.colors.text.onDark};
  }

  &:hover {
    background-color: rgba(255, 255, 255, 0.07);
  }

  &.active {
    background-color: ${theme.colors.primaryHover};
    color: ${theme.colors.text.inverse};
    font-weight: 500;

    svg {
      color: ${theme.colors.text.inverse};
    }
  }
`;

export const UserSection = styled.div`
  border-top: 1.5px solid ${theme.colors.border.dark};
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const UserRow = styled.button`
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  background: transparent;
  border: none;
  border-radius: ${theme.borderRadius.sm};
  padding: 6px 8px;
  margin: -6px -8px;
  text-align: left;
  cursor: pointer;
  transition: background-color 0.15s;

  &:hover {
    background-color: rgba(255, 255, 255, 0.07);
  }

  &:disabled {
    cursor: default;
  }

  &:disabled:hover {
    background-color: transparent;
  }
`;

export const Avatar = styled.div`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background-color: ${theme.colors.primaryHover};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }

  span {
    font-family: 'Roboto', sans-serif;
    font-size: 14px;
    font-weight: 600;
    color: ${theme.colors.text.inverse};
  }
`;

export const UserInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

export const UserName = styled.p`
  font-family: 'Roboto', sans-serif;
  font-size: 14px;
  font-weight: 500;
  color: ${theme.colors.text.inverse};
  margin: 0;
`;

export const UserRole = styled.p`
  font-family: 'Roboto', sans-serif;
  font-size: 12px;
  font-weight: 400;
  color: ${theme.colors.text.disabled};
  margin: 0;
`;

export const LogoutButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  transition: opacity 0.15s;

  font-family: 'Roboto', sans-serif;
  font-size: 14px;
  font-weight: 400;
  color: ${theme.colors.text.disabled};

  svg {
    width: 16px;
    height: 16px;
    color: ${theme.colors.text.disabled};
  }

  &:hover {
    opacity: 0.75;
  }
`;

export const NotificationButton = styled.button`
  position: relative;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  border-radius: ${theme.borderRadius.sm};
  border: none;
  margin-bottom: 4px;
  cursor: pointer;
  text-align: left;
  width: 100%;
  background: transparent;
  transition: background-color 0.15s;

  font-family: 'Roboto', sans-serif;
  font-size: 14px;
  font-weight: 400;
  color: ${theme.colors.text.onDark};

  svg {
    width: 20px;
    height: 20px;
    flex-shrink: 0;
    color: ${theme.colors.text.onDark};
  }

  &:hover {
    background-color: rgba(255, 255, 255, 0.07);
  }

  &.active {
    background-color: ${theme.colors.primaryHover};
    color: ${theme.colors.text.inverse};

    svg {
      color: ${theme.colors.text.inverse};
    }
  }
`;

export const NotificationBadge = styled.span`
  position: absolute;
  top: 8px;
  left: 28px;
  min-width: 17px;
  height: 17px;
  border-radius: 999px;
  padding: 0 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  font-weight: 700;
  background: #EF4444;
  color: #fff;
  pointer-events: none;
`;
