import styled, { css } from "styled-components";
import type { ActionIconButtonVariant } from "./index";

const buttonStyles: Record<ActionIconButtonVariant, ReturnType<typeof css>> = {
  view: css`
    background-color: var(--mc-action-view-bg, #d9f4e3);
    color: var(--mc-action-view-text, #16a34a);
  `,
  edit: css`
    background-color: var(--mc-action-edit-bg, #dbeafe);
    color: var(--mc-action-edit-text, #2563eb);
  `,
  delete: css`
    background-color: var(--mc-action-delete-bg, #fee2e2);
    color: var(--mc-action-delete-text, #ef4444);
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
  border: 1px solid var(--mc-action-border, rgba(15, 23, 42, 0.08));
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
