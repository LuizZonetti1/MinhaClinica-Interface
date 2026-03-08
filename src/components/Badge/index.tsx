import type { ReactNode } from "react";
import { StyledBadge } from "./styles";

export type BadgeVariant = "info" | "success" | "neutral";

interface BadgeProps {
  variant: BadgeVariant;
  children: ReactNode;
}

export const Badge = ({ variant, children }: BadgeProps) => {
  return <StyledBadge $variant={variant}>{children}</StyledBadge>;
};
