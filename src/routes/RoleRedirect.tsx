import { Navigate } from "react-router";
import { useAuth } from "../contexts";

/**
 * Componente que redireciona o usuário para o dashboard correto
 * baseado no seu papel após o login.
 *
 * Uso: <Route path="/dashboard" element={<RoleRedirect />} />
 */
export const RoleRedirect = () => {
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        Carregando...
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  switch (user.role) {
    case "PATIENT":
      return <Navigate to="/paciente/dashboard" replace />;
    case "RECEPTIONIST":
      return <Navigate to="/recepcao/dashboard" replace />;
    case "PROFESSIONAL":
      return <Navigate to="/profissional/dashboard" replace />;
    case "ADMIN":
      return <Navigate to="/admin/dashboard" replace />;
    default:
      return <Navigate to="/login" replace />;
  }
};
