import type { ButtonHTMLAttributes, ReactNode } from "react";
import { StyledActionIconButton } from "./styles";

export type ActionIconButtonVariant = "view" | "edit" | "delete";

interface ActionIconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant: ActionIconButtonVariant;
  icon: ReactNode;
}

export const ActionIconButton = ({ variant, icon, type, ...props }: ActionIconButtonProps) => {
  return (
    <StyledActionIconButton type={type ?? "button"} $variant={variant} {...props}>
      {icon}
    </StyledActionIconButton>
  );
};
