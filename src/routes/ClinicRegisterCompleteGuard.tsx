import { Navigate } from "react-router";

/**
 * Protege a rota /clinica/registro/completo.
 * Permite acesso se houver token no localStorage OU tempToken na URL
 * (caso o backend redirecione direto para cá após verificar o e-mail).
 */
export const ClinicRegisterCompleteGuard = ({ children }: { children: React.ReactNode }) => {
  const hasTokenInStorage = Boolean(localStorage.getItem("@minhaclinica:token"));
  const hasTokenInUrl = new URLSearchParams(window.location.search).has("tempToken");

  if (!hasTokenInStorage && !hasTokenInUrl) {
    return <Navigate to="/clinica/registro/inicial" replace />;
  }

  return <>{children}</>;
};
