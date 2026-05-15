import { Navigate } from "react-router";
import { getAuthToken } from "../utils/authStorage";

/**
 * Protege a rota /clinica/registro/completo.
 * Permite acesso se houver token no localStorage OU tempToken na URL
 * (caso o backend redirecione direto para cá após verificar o e-mail).
 */
export const ClinicRegisterCompleteGuard = ({ children }: { children: React.ReactNode }) => {
  const hasTokenInStorage = Boolean(getAuthToken());
  const hasTokenInUrl = new URLSearchParams(window.location.hash.slice(1)).has("tempToken");

  if (!hasTokenInStorage && !hasTokenInUrl) {
    return <Navigate to="/clinica/registro/inicial" replace />;
  }

  return <>{children}</>;
};
