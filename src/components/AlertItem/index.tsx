import type { AlertItemProps } from "../../types/components";
import { AlertIcon, AlertText, AlertWrapper } from "./styles";

export const AlertItem = ({ type, icon, message }: AlertItemProps) => {
  return (
    <AlertWrapper $type={type}>
      <AlertIcon $type={type} aria-hidden>
        {typeof icon === "string" ? <img src={icon} alt="" /> : icon}
      </AlertIcon>
      <AlertText>{message}</AlertText>
    </AlertWrapper>
  );
};
