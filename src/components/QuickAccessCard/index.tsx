import { CardWrapper, QuickIcon, QuickLabel } from './styles';

interface QuickAccessCardProps {
  icon: string;
  label: string;
  color: string;
  onClick?: () => void;
}

export const QuickAccessCard = ({ icon, label, color, onClick }: QuickAccessCardProps) => {
  return (
    <CardWrapper $color={color} onClick={onClick} role="button">
      <QuickIcon src={icon} alt={label} />
      <QuickLabel $color={color}>{label}</QuickLabel>
    </CardWrapper>
  );
};
