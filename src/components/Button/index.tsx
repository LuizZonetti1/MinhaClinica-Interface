import type { ButtonProps } from "../../types/components";
import { StyledButton } from "./styles";

export type { ButtonSize, ButtonVariant } from "../../types/components";

export const Button = ({
  variant = "primary",
  size = "medium",
  fullWidth = false,
  icon,
  iconPosition = "left",
  children,
  ...props
}: ButtonProps) => {
  return (
    <StyledButton $variant={variant} $size={size} $fullWidth={fullWidth} {...props}>
      {icon && iconPosition === "left" && <span className="icon">{icon}</span>}
      {children}
      {icon && iconPosition === "right" && <span className="icon">{icon}</span>}
    </StyledButton>
  );
};
