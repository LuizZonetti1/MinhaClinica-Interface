import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router";

/**
 * Página intermediária que recebe o redirect do backend após a verificação do email.
 *
 * Fluxo:
 *   [email link] → backend /api/auth/verify-email/:token
 *     → 302 redirect → /completar-cadastro?tempToken=JWT
 *       → este componente salva o JWT e navega para /registro/completo
 */
const CompleteRedirect = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const tempToken = searchParams.get("tempToken");

    if (tempToken) {
      localStorage.setItem("@minhaclinica:token", tempToken);
      navigate("/registro/completo", { replace: true });
    } else {
      // Token ausente na URL — volta ao início do cadastro
      navigate("/registro/inicial", { replace: true });
    }
  }, [searchParams, navigate]);

  return null;
};

export default CompleteRedirect;
