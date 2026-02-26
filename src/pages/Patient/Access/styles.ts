import styled from "styled-components";
import { theme } from "../../../themes/themes";

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${theme.spacing.lg};
  width: 100%;
`;

export const Title = styled.h1`
  font-family: 'Roboto', sans-serif;
  font-size: 26px;
  font-weight: 700;
  color: ${theme.colors.text.primary};
  margin: 0;
`;

export const Subtitle = styled.p`
  font-family: 'Roboto', sans-serif;
  font-size: 15px;
  font-weight: 400;
  color: ${theme.colors.text.muted};
  margin: 0;
`;

export const ActionsContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: ${theme.spacing.lg};
  margin-top: ${theme.spacing.sm};
`;

export const ActionCard = styled.button`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.xl};
  width: 100%;
  padding: ${theme.spacing.xl};
  background-color: ${theme.colors.surface};
  border: 2px solid ${theme.colors.border.light};
  border-radius: ${theme.borderRadius.md};
  cursor: pointer;
  text-align: left;
  transition: all 0.2s;

  &:hover {
    border-color: ${theme.colors.primary};
    background-color: ${theme.colors.background};
    box-shadow: ${theme.shadows.md};
    transform: translateY(-1px);
  }

  .icon-wrapper {
    flex-shrink: 0;
    width: 52px;
    height: 52px;
    border-radius: ${theme.borderRadius.md};
    background-color: ${theme.colors.featureBg.blue};
    color: ${theme.colors.primaryHover};
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .icon-wrapper.secondary {
    background-color: ${theme.colors.featureBg.green};
    color: ${theme.colors.successHover};
  }
`;

export const ActionTitle = styled.span`
  display: block;
  font-family: 'Roboto', sans-serif;
  font-size: 16px;
  font-weight: 600;
  color: ${theme.colors.text.primary};
  margin-bottom: 4px;
`;

export const ActionSubtitle = styled.span`
  display: block;
  font-family: 'Roboto', sans-serif;
  font-size: 13px;
  font-weight: 400;
  color: ${theme.colors.text.muted};
`;

export const Divider = styled.div`
  display: flex;
  align-items: center;
  width: 100%;

  &::before,
  &::after {
    content: '';
    flex: 1;
    height: 1px;
    background-color: ${theme.colors.border.light};
  }
`;

export const DividerText = styled.span`
  font-family: 'Roboto', sans-serif;
  font-size: 13px;
  color: ${theme.colors.text.muted};
  padding: 0 ${theme.spacing.lg};
`;
