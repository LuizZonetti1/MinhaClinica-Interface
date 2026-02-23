import { Check } from 'lucide-react';
import { Container, StepItem, StepCircle, StepLabel, StepLine } from './styles';

interface Step {
  label: string;
  status: 'completed' | 'active' | 'inactive';
}

interface StepperProps {
  steps: Step[];
}

export const Stepper = ({ steps }: StepperProps) => {
  return (
    <Container>
      {steps.map((step, index) => (
        <div key={index} style={{ display: 'flex', alignItems: 'flex-start' }}>
          <StepItem>
            <StepCircle $status={step.status}>
              {step.status === 'completed' ? (
                <Check size={14} strokeWidth={3} />
              ) : (
                <span>{index + 1}</span>
              )}
            </StepCircle>
            <StepLabel $status={step.status}>{step.label}</StepLabel>
          </StepItem>
          {index < steps.length - 1 && <StepLine $completed={step.status === 'completed'} />}
        </div>
      ))}
    </Container>
  );
};
