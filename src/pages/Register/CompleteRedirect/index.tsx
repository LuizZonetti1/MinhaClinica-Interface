import { useEffect } from "react";
import { useSearchParams } from "react-router";
import { storeAuthToken } from "../../../utils/authStorage";

/**
 * Decodifica o payload de um JWT sem validar a assinatura.
 * Seguro para uso no frontend pois só lemos claims públicos (role, id, etc.).
 */
function decodeJwtPayload(token: string): Record<string, unknown> {
  try {
    const base64 = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
    const json = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => `%${c.charCodeAt(0).toString(16).padStart(2, "0")}`)
        .join(""),
    );
    return JSON.parse(json) as Record<string, unknown>;
  } catch {
    return {};
  }
}

/**
 * Retorna a rota de destino com base no claim `role` do token temporário.
 *
 * O backend embute `role` no JWT gerado após a verificação do e-mail:
 *   ADMIN        → cadastro do dono da clínica
 *   PATIENT      → cadastro do paciente
 *   PROFESSIONAL → cadastro do profissional
 *   RECEPTIONIST → cadastro do recepcionista
 */
function resolveDestination(role: unknown): string {
  const normalizedRole = typeof role === "string" ? role.toUpperCase() : role;

  switch (normalizedRole) {
    case "ADMIN":
      return "/clinica/registro/completo";
    case "PATIENT":
      return "/registro/completo";
    case "PROFESSIONAL":
      return "/profissional/registro/completo";
    case "RECEPTIONIST":
      return "/recepcao/registro/completo";
    default:
      return "/registro/inicial";
  }
}

/**
 * Página intermediária que recebe o redirect do backend após a verificação do email.
 *
 * Os fluxos de paciente, clínica, profissional e recepção redirecionam para
 * /completar-cadastro?tempToken=JWT.
 * O destino final é determinado decodificando o claim `role` do JWT, eliminando
 * qualquer dependência de flags no localStorage (que seriam perdidas em nova aba).
 *
 * Fluxo:
 *   backend → 302 → /completar-cadastro?tempToken=JWT
 *     → decodeJwtPayload(token).role → resolveDestination(role)
 */
const CompleteRedirect = () => {
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const tempToken = searchParams.get("tempToken");

    if (tempToken) {
      storeAuthToken(tempToken);

      // Limpa flag legada caso ainda exista de versões anteriores
      localStorage.removeItem("@minhaclinica:registration_flow");

      const payload = decodeJwtPayload(tempToken);
      const destination = resolveDestination(payload.role);

      window.location.replace(destination);
    } else {
      window.location.replace("/registro/inicial");
    }
  }, [searchParams]);

  return null;
};

export default CompleteRedirect;
