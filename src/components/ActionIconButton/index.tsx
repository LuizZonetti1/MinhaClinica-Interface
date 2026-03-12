import type { ActionIconButtonProps } from "../../types/components";
import { StyledActionIconButton } from "./styles";

export type { ActionIconButtonVariant } from "../../types/components";

export const ActionIconButton = ({ variant, icon, type, ...props }: ActionIconButtonProps) => {
  return (
    <StyledActionIconButton type={type ?? "button"} $variant={variant} {...props}>
      {icon}
    </StyledActionIconButton>
  );
};
