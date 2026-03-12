import type { QuickAccessCardProps } from "../../types/components";
import { CardWrapper, QuickIcon, QuickLabel } from "./styles";

export const QuickAccessCard = ({ icon, label, color, onClick }: QuickAccessCardProps) => {
  return (
    <CardWrapper $color={color} onClick={onClick} role="button">
      <QuickIcon src={icon} alt={label} />
      <QuickLabel $color={color}>{label}</QuickLabel>
    </CardWrapper>
  );
};
