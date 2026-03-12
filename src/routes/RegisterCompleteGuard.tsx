import { Navigate } from "react-router";
import { getAuthToken } from "../utils/authStorage";

/**
 * Protege a rota /registro/completo.
 * Só permite acesso se houver um token temporário válido no localStorage,
 * gerado após a verificação de e-mail bem-sucedida.
 */
export const RegisterCompleteGuard = ({ children }: { children: React.ReactNode }) => {
  const hasToken = Boolean(getAuthToken());

  if (!hasToken) {
    return <Navigate to="/registro/inicial" replace />;
  }

  return <>{children}</>;
};
