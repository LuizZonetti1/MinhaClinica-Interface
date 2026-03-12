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
 * Página intermediária que recebe o redirect do backend após a verificação
 * do e-mail da clínica.
 *
 * O destino é determinado pelo claim `role` do JWT temporário:
 *   ADMIN        → /clinica/registro/completo
 *   PROFESSIONAL → /profissional/registro/completo
 *   RECEPTIONIST → /recepcao/registro/completo
 *
 * Fluxo:
 *   backend /api/clinics/verify-email/:token → 302 → /clinica/completar-cadastro?tempToken=JWT
 *     → decodeJwtPayload(token).role → destino
 */
const ClinicCompleteRedirect = () => {
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const tempToken = searchParams.get("tempToken");

    if (tempToken) {
      storeAuthToken(tempToken);

      const payload = decodeJwtPayload(tempToken);
      const normalizedRole =
        typeof payload.role === "string" ? payload.role.toUpperCase() : payload.role;

      switch (normalizedRole) {
        case "PROFESSIONAL":
          window.location.replace("/profissional/registro/completo");
          break;
        case "RECEPTIONIST":
          window.location.replace("/recepcao/registro/completo");
          break;
        case "ADMIN":
        default:
          window.location.replace("/clinica/registro/completo");
      }
    } else {
      window.location.replace("/clinica/registro/inicial");
    }
  }, [searchParams]);

  return null;
};

export default ClinicCompleteRedirect;
