import { forwardRef } from "react";
import type { InputProps } from "../../types/components";
import { Container, ErrorMessage, InputWrapper, Label, StyledInput } from "./styles";

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      icon,
      iconPosition = "left",
      rightIcon,
      onRightIconClick,
      fullWidth = false,
      ...props
    },
    ref,
  ) => {
    return (
      <Container $fullWidth={fullWidth}>
        {label && <Label>{label}</Label>}
        <InputWrapper $hasError={!!error}>
          {icon && iconPosition === "left" && <span className="icon left">{icon}</span>}
          <StyledInput
            ref={ref}
            $hasIcon={!!icon}
            $iconPosition={iconPosition}
            $hasRightIcon={!!rightIcon}
            {...props}
          />
          {icon && iconPosition === "right" && <span className="icon right">{icon}</span>}
          {rightIcon && (
            <button
              type="button"
              className="icon right"
              onClick={onRightIconClick}
              style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}
            >
              {rightIcon}
            </button>
          )}
        </InputWrapper>
        {error && <ErrorMessage>{error}</ErrorMessage>}
      </Container>
    );
  },
);

Input.displayName = "Input";
