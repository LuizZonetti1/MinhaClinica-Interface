import { isAxiosError } from "axios";

const parseValidationItem = (item: unknown): string => {
  if (typeof item === "string") return item;

  if (typeof item === "object" && item !== null) {
    const obj = item as Record<string, unknown>;

    if (obj.constraints && typeof obj.constraints === "object") {
      const messages = Object.values(obj.constraints as Record<string, unknown>).filter(
        (value): value is string => typeof value === "string" && value.trim().length > 0,
      );

      if (messages.length > 0) return messages.join(", ");
    }

    if (Array.isArray(obj.message)) {
      const messages = obj.message.filter(
        (value): value is string => typeof value === "string" && value.trim().length > 0,
      );

      if (messages.length > 0) return messages.join(", ");
    }

    if (typeof obj.message === "string") return obj.message;
    if (typeof obj.msg === "string") return obj.msg;

    if (Array.isArray(obj.errors)) {
      const nested = normalizeMessagesArray(obj.errors);
      if (nested) return nested;
    }
  }

  return JSON.stringify(item);
};

const normalizeMessagesArray = (value: unknown): string | null => {
  if (!Array.isArray(value) || value.length === 0) return null;

  const parsedMessages = value
    .map(parseValidationItem)
    .map((message) => message.trim())
    .filter(Boolean);

  if (parsedMessages.length === 0) return null;

  return Array.from(new Set(parsedMessages)).join(" | ");
};

/**
 * Extrai a mensagem de erro de uma resposta da API (AxiosError).
 * Suporta os formatos:
 *   { message: "erro" }
 *   { message: ["erro1", "erro2"] }          - NestJS class-validator
 *   { error: "Erro de validacao", details: ["campo invalido"] } - backend proprio
 *   { error: "Erro de validacao", details: [{...}] }            - objetos de validacao
 *   { message: "Erro de validacao", errors: ["..."] }           - formato com errors
 */
export const getApiErrorMessage = (error: unknown, fallback: string): string => {
  if (isAxiosError(error)) {
    const body = error.response?.data;

    // Log completo para diagnostico
    console.error("[API Error]", error.response?.status, JSON.stringify(body, null, 2));

    // Formato proprio do backend: { error, details }
    const detailsMessage = normalizeMessagesArray(body?.details);
    if (detailsMessage) return detailsMessage;

    // Alguns endpoints retornam { message: "...", errors: [...] }
    const errorsMessage = normalizeMessagesArray(body?.errors);
    if (errorsMessage) return errorsMessage;

    // Formato { error: "string" }
    if (typeof body?.error === "string") return body.error;

    // Formato NestJS: { message: string | string[] }
    const msg = body?.message;
    if (Array.isArray(msg)) {
      const parsed = normalizeMessagesArray(msg);
      if (parsed) return parsed;
    }
    if (typeof msg === "string") return msg;
  }

  return fallback;
};
