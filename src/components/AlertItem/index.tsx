import type { AlertItemProps } from "../../types/components";
import { AlertIcon, AlertText, AlertWrapper } from "./styles";

export const AlertItem = ({ type, icon, message }: AlertItemProps) => {
  return (
    <AlertWrapper $type={type}>
      <AlertIcon src={icon} alt={type} />
      <AlertText>{message}</AlertText>
    </AlertWrapper>
  );
};
