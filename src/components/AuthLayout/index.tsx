import { Container, Content } from './styles';

interface AuthLayoutProps {
  children: React.ReactNode;
}

export const AuthLayout = ({ children }: AuthLayoutProps) => {
  return (
    <Container>
      <Content>{children}</Content>
    </Container>
  );
};
