import styled, { css } from "styled-components";
import { theme } from "../../themes/themes";
import type { BadgeVariant } from "./index";

const variantStyles: Record<BadgeVariant, ReturnType<typeof css>> = {
  info: css`
    background-color: #eaf2ff;
    color: ${theme.colors.primaryHover};
  `,
  success: css`
    background-color: #d9f4e3;
    color: ${theme.colors.successHover};
  `,
  neutral: css`
    background-color: ${theme.colors.border.lighter};
    color: ${theme.colors.text.secondary};
  `,
};

export const StyledBadge = styled.span<{ $variant: BadgeVariant }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 999px;
  padding: 5px 12px;
  font-family: "Roboto", sans-serif;
  font-size: 13px;
  font-weight: 600;
  line-height: 1.1;

  ${({ $variant }) => variantStyles[$variant]}
`;
