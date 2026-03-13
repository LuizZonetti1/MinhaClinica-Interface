import styled from "styled-components";
import { theme } from "../../themes/themes";

export const Track = styled.div<{ $checked: boolean; $disabled: boolean }>`
  width: 48px;
  height: 26px;
  border-radius: 999px;
  background-color: ${({ $checked }) => ($checked ? theme.colors.primary : "#D1D5DB")};
  position: relative;
  cursor: ${({ $disabled }) => ($disabled ? "not-allowed" : "pointer")};
  opacity: ${({ $disabled }) => ($disabled ? 0.5 : 1)};
  transition: background-color 0.2s ease;
  flex-shrink: 0;
  outline: none;

  &:focus-visible {
    box-shadow: 0 0 0 3px ${theme.colors.primary}40;
  }
`;

export const Knob = styled.div<{ $checked: boolean }>`
  width: 20px;
  height: 20px;
  border-radius: 999px;
  background-color: #ffffff;
  position: absolute;
  top: 3px;
  left: ${({ $checked }) => ($checked ? "25px" : "3px")};
  transition: left 0.2s ease;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.25);
`;
