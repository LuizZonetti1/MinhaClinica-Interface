import { Check } from "lucide-react";
import type { StepperProps } from "../../types/components";
import { Container, StepCircle, StepItem, StepLabel, StepLine } from "./styles";

export const Stepper = ({ steps }: StepperProps) => {
  return (
    <Container>
      {steps.map((step, index) => (
        <div key={step.label} style={{ display: "flex", alignItems: "flex-start" }}>
          <StepItem>
            <StepCircle $status={step.status}>
              {step.status === "completed" ? (
                <Check size={14} strokeWidth={3} />
              ) : (
                <span>{index + 1}</span>
              )}
            </StepCircle>
            <StepLabel $status={step.status}>{step.label}</StepLabel>
          </StepItem>
          {index < steps.length - 1 && <StepLine $completed={step.status === "completed"} />}
        </div>
      ))}
    </Container>
  );
};
