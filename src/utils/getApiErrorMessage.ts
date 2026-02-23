import { isAxiosError } from "axios";

/**
 * Extrai a mensagem de erro de uma resposta da API (AxiosError).
 * Suporta os formatos:
 *   { message: "erro" }
 *   { message: ["erro1", "erro2"] }          — NestJS class-validator
 *   { error: "Erro de validação", details: ["campo inválido"] } — backend próprio
 */
export const getApiErrorMessage = (error: unknown, fallback: string): string => {
    if (isAxiosError(error)) {
        const body = error.response?.data;

        // Formato próprio do backend: { error, details }
        if (body?.details) {
            const details = body.details;
            if (Array.isArray(details) && details.length > 0) return details.join(" | ");
        }

        // Formato { error: "string" }
        if (typeof body?.error === "string") return body.error;

        // Formato NestJS: { message: string | string[] }
        const msg = body?.message;
        if (Array.isArray(msg)) return msg.join(" | ");
        if (typeof msg === "string") return msg;

        console.error("[API Error]", error.response?.status, body);
    }
    return fallback;
};
