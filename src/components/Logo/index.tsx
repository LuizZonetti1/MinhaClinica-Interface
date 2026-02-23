import { Stethoscope } from "lucide-react";
import { IconWrapper, LogoContainer, Subtitle, TextWrapper, Title } from "./styles";

interface LogoProps {
  showSubtitle?: boolean;
  variant?: "default" | "auth";
}

export const Logo = ({ showSubtitle = true, variant = "default" }: LogoProps) => {
  return (
    <LogoContainer $variant={variant}>
      <IconWrapper $variant={variant}>
        <Stethoscope size={variant === "auth" ? 16 : 28} strokeWidth={2.5} />
      </IconWrapper>
      <TextWrapper>
        <Title $variant={variant}>Minha Clínica</Title>
        {showSubtitle && variant === "default" && <Subtitle>Gestão Inteligente de Saúde</Subtitle>}
      </TextWrapper>
    </LogoContainer>
  );
};
