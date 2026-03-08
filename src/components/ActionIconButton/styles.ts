import styled, { css } from "styled-components";
import type { ActionIconButtonVariant } from "./index";

const buttonStyles: Record<ActionIconButtonVariant, ReturnType<typeof css>> = {
  view: css`
    background-color: #d9f4e3;
    color: #16a34a;
  `,
  edit: css`
    background-color: #dbeafe;
    color: #2563eb;
  `,
  delete: css`
    background-color: #fee2e2;
    color: #ef4444;
  `,
};

export const StyledActionIconButton = styled.button<{ $variant: ActionIconButtonVariant }>`
  width: 34px;
  height: 34px;
  border: none;
  border-radius: 10px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: filter 0.15s ease-in-out;

  ${({ $variant }) => buttonStyles[$variant]}

  &:hover {
    filter: brightness(0.95);
  }

  svg {
    width: 14px;
    height: 14px;
  }
`;
