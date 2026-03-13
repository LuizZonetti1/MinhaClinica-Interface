import type { ToggleProps } from "../../types/components";
import { Knob, Track } from "./styles";

export const Toggle = ({ checked, onChange, disabled = false }: ToggleProps) => {
  return (
    <Track
      $checked={checked}
      $disabled={disabled}
      role="switch"
      aria-checked={checked}
      tabIndex={0}
      onClick={() => !disabled && onChange(!checked)}
      onKeyDown={(e) => {
        if ((e.key === "Enter" || e.key === " ") && !disabled) {
          e.preventDefault();
          onChange(!checked);
        }
      }}
    >
      <Knob $checked={checked} />
    </Track>
  );
};
