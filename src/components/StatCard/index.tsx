import { CardWrapper, IconBox, StatLabel, StatValue } from './styles';

interface StatCardProps {
  icon: string;
  iconBg: string;
  label: string;
  value: string;
}

export const StatCard = ({ icon, iconBg, label, value }: StatCardProps) => {
  return (
    <CardWrapper>
      <IconBox $bgColor={iconBg}>
        <img src={icon} alt={label} />
      </IconBox>
      <div>
        <StatLabel>{label}</StatLabel>
        <StatValue>{value}</StatValue>
      </div>
    </CardWrapper>
  );
};
