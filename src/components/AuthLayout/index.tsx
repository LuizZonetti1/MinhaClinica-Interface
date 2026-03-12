import type { AuthLayoutProps } from "../../types/components";
import { Container, Content } from "./styles";

export const AuthLayout = ({ children }: AuthLayoutProps) => {
  return (
    <Container>
      <Content>{children}</Content>
    </Container>
  );
};
