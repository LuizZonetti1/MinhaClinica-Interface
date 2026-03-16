import type { StatCardProps } from "../../types/components";
import { CardWrapper, IconBox, StatLabel, StatValue } from "./styles";

export const StatCard = ({ icon, iconBg, label, value }: StatCardProps) => {
  return (
    <CardWrapper>
      <IconBox $bgColor={iconBg}>
        {typeof icon === "string" ? <img src={icon} alt={label} /> : <span aria-hidden>{icon}</span>}
      </IconBox>
      <div>
        <StatLabel>{label}</StatLabel>
        <StatValue>{value}</StatValue>
      </div>
    </CardWrapper>
  );
};
