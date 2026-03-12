import { Navigate } from "react-router";
import { getAuthToken } from "../utils/authStorage";

/**
 * Protege a rota /profissional/registro/completo.
 * Permite acesso se houver token salvo OU tempToken na URL.
 */
export const ProfessionalRegisterCompleteGuard = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const hasTokenInStorage = Boolean(getAuthToken());
  const hasTokenInUrl = new URLSearchParams(window.location.search).has("tempToken");

  if (!hasTokenInStorage && !hasTokenInUrl) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};
