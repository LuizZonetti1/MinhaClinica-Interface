import styled from "styled-components";
import { theme } from "../../themes/themes";

export const Overlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 1200;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${theme.spacing.xl};
  background: rgba(17, 24, 39, 0.52);
  backdrop-filter: blur(2px);
`;

export const Dialog = styled.div`
  width: min(640px, 100%);
  max-height: min(85vh, 760px);
  display: flex;
  flex-direction: column;
  border: 1px solid ${theme.colors.border.light};
  border-radius: ${theme.borderRadius.lg};
  background: ${theme.colors.surface};
  box-shadow: ${theme.shadows.card};
  overflow: hidden;
`;

export const Header = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${theme.spacing.md};
  padding: ${theme.spacing.lg} ${theme.spacing.xl};
  border-bottom: 1px solid ${theme.colors.border.light};
`;

export const Title = styled.h2`
  margin: 0;
  font-size: 1.15rem;
  font-weight: 700;
  color: ${theme.colors.text.primary};
`;

export const CloseButton = styled.button`
  width: 36px;
  height: 36px;
  border: 0;
  border-radius: ${theme.borderRadius.md};
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  background: ${theme.colors.surfaceMuted};
  color: ${theme.colors.text.secondary};
  transition: background 0.2s ease, color 0.2s ease;

  &:hover {
    background: ${theme.colors.surfaceHover};
    color: ${theme.colors.text.primary};
  }
`;

export const Content = styled.div`
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  padding: ${theme.spacing.xl};
  color: ${theme.colors.text.primary};
`;

export const Actions = styled.footer`
  display: flex;
  justify-content: flex-end;
  gap: ${theme.spacing.md};
  padding: ${theme.spacing.lg} ${theme.spacing.xl};
  border-top: 1px solid ${theme.colors.border.light};
`;
