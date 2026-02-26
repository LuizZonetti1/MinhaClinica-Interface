import { Navigate, Outlet } from "react-router";
import { useAuth } from "../contexts";

/**
 * Wrapper de rota que exige autenticação.
 * Se o usuário não estiver logado, redireciona para /login.
 * Usado como elemento pai de rotas protegidas:
 *
 * <Route element={<PrivateRoutes />}>
 *   <Route path="/dashboard" element={<Dashboard />} />
 * </Route>
 */
export const PrivateRoutes = () => {
  const { isAuthenticated, isLoading } = useAuth();

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

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};
