import { NavLink } from 'react-router';
import styled from 'styled-components';
import { theme } from '../../themes/themes';

export const SidebarWrapper = styled.aside`
  width: 256px;
  min-width: 256px;
  height: 100vh;
  background-color: ${theme.colors.dark};
  display: flex;
  flex-direction: column;
  position: sticky;
  top: 0;
  overflow-y: auto;
`;

export const LogoRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 28px 16px 20px;
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
