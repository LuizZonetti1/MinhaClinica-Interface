import { isAxiosError } from "axios";

/**
 * Extrai a mensagem de erro de uma resposta da API (AxiosError).
 * Suporta os formatos:
 *   { message: "erro" }
 *   { message: ["erro1", "erro2"] }          — NestJS class-validator
 *   { error: "Erro de validação", details: ["campo inválido"] } — backend próprio
 *   { error: "Erro de validação", details: [{...}] }           — objetos de validação
 */
export const getApiErrorMessage = (error: unknown, fallback: string): string => {
    if (isAxiosError(error)) {
        const body = error.response?.data;

        // Log completo para diagnóstico
        console.error("[API Error]", error.response?.status, JSON.stringify(body, null, 2));

        // Formato próprio do backend: { error, details }
        if (body?.details) {
            const details = body.details as unknown[];
            if (Array.isArray(details) && details.length > 0) {
                return details
                    .map((d) => {
                        if (typeof d === "string") return d;
                        if (typeof d === "object" && d !== null) {
                            const obj = d as Record<string, unknown>;
                            // NestJS class-validator: { property, constraints: { rule: "msg" } }
                            if (obj.constraints && typeof obj.constraints === "object") {
                                return Object.values(obj.constraints as Record<string, string>).join(", ");
                            }
                            // { message: "..." }
                            if (typeof obj.message === "string") return obj.message;
                            // { msg: "..." }
                            if (typeof obj.msg === "string") return obj.msg;
                        }
                        return JSON.stringify(d);
                    })
                    .join(" | ");
            }
        }

        // Formato { error: "string" }
        if (typeof body?.error === "string") return body.error;

        // Formato NestJS: { message: string | string[] }
        const msg = body?.message;
        if (Array.isArray(msg)) return msg.join(" | ");
        if (typeof msg === "string") return msg;
    }
    return fallback;
};
