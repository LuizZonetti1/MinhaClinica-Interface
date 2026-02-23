import { forwardRef } from 'react';
import type { InputHTMLAttributes } from 'react';
import { Container, Label, InputWrapper, StyledInput, ErrorMessage } from './styles';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, icon, iconPosition = 'left', fullWidth = false, ...props }, ref) => {
    return (
      <Container $fullWidth={fullWidth}>
        {label && <Label>{label}</Label>}
        <InputWrapper $hasError={!!error}>
          {icon && iconPosition === 'left' && <span className="icon left">{icon}</span>}
          <StyledInput ref={ref} $hasIcon={!!icon} $iconPosition={iconPosition} {...props} />
          {icon && iconPosition === 'right' && <span className="icon right">{icon}</span>}
        </InputWrapper>
        {error && <ErrorMessage>{error}</ErrorMessage>}
      </Container>
    );
  }
);

Input.displayName = 'Input';
