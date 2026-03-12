import type { BadgeProps } from "../../types/components";
import { StyledBadge } from "./styles";

export type { BadgeVariant } from "../../types/components";

export const Badge = ({ variant, children }: BadgeProps) => {
  return <StyledBadge $variant={variant}>{children}</StyledBadge>;
};
