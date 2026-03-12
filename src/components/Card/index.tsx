import type { CardProps } from "../../types/components";
import { StyledCard } from "./styles";

export const Card = ({ children, padding = "large" }: CardProps) => {
  return <StyledCard $padding={padding}>{children}</StyledCard>;
};
