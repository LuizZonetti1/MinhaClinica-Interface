import { Navigate } from "react-router";

/**
 * Protege a rota /registro/completo.
 * Só permite acesso se houver um token temporário válido no localStorage,
 * gerado após a verificação de e-mail bem-sucedida.
 */
export const RegisterCompleteGuard = ({ children }: { children: React.ReactNode }) => {
  const hasToken = Boolean(localStorage.getItem("@minhaclinica:token"));

  if (!hasToken) {
    return <Navigate to="/registro/inicial" replace />;
  }

  return <>{children}</>;
};
