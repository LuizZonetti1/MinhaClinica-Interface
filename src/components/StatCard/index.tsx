import type { StatCardProps } from "../../types/components";
import { CardWrapper, IconBox, StatLabel, StatValue } from "./styles";

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
