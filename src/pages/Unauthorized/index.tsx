import { useNavigate } from "react-router";
import { useAuth } from "../../contexts";
import { BackButton, Container, Message, Title } from "./styles";

export function Unauthorized() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleGoHome = () => {
    // Redireciona para a página inicial baseado no papel do usuário
    if (user?.role === "PATIENT") {
      navigate("/paciente/dashboard");
    } else if (user?.role === "RECEPTIONIST") {
      navigate("/recepcao/dashboard");
    } else if (user?.role === "PROFESSIONAL") {
      navigate("/profissional/dashboard");
    } else if (user?.role === "ADMIN") {
      navigate("/admin/dashboard");
    } else {
      navigate("/");
    }
  };

  return (
    <Container>
      <Title>Acesso Negado</Title>
      <Message>Você não tem permissão para acessar esta página.</Message>
      <Message>
        Papel atual: <strong>{user?.role || "Desconhecido"}</strong>
      </Message>
      <div style={{ display: "flex", gap: "1rem", marginTop: "2rem" }}>
        <BackButton onClick={handleGoBack}>Voltar</BackButton>
        <BackButton onClick={handleGoHome}>Ir para Início</BackButton>
        <BackButton onClick={logout}>Sair</BackButton>
      </div>
    </Container>
  );
}
