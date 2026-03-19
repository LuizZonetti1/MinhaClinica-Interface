import type { QuickAccessCardProps } from "../../types/components";
import { CardWrapper, QuickIcon, QuickLabel } from "./styles";

export const QuickAccessCard = ({ icon, label, color, onClick }: QuickAccessCardProps) => {
  return (
    <CardWrapper $color={color} onClick={onClick} role="button">
      <QuickIcon $color={color} aria-hidden>
        {typeof icon === "string" ? <img src={icon} alt="" /> : icon}
      </QuickIcon>
      <QuickLabel $color={color}>{label}</QuickLabel>
    </CardWrapper>
  );
};
