import { api } from "../config/api";
import type {
    LoginPayload,
    LoginResponse,
    RegisterCompletePayload,
    RegisterCompleteResponse,
    RegisterStartPayload,
    RegisterStartResponse,
    ResendVerificationPayload,
    VerifyEmailResponse,
} from "../types/auth";

// ─── Login ────────────────────────────────────────────────────────────────────
// POST /api/auth/login
export const login = async (payload: LoginPayload): Promise<LoginResponse> => {
    const { data } = await api.post<LoginResponse>("/auth/login", payload);
    localStorage.setItem("@minhaclinica:token", data.token);
    return data;
};

// ─── Etapa 1: Início ──────────────────────────────────────────────────────────
// POST /api/auth/register/start
export const registerStart = async (
    payload: RegisterStartPayload,
): Promise<RegisterStartResponse> => {
    const { data } = await api.post<RegisterStartResponse>(
        "/auth/register/start",
        payload,
    );
    return data;
};

// ─── Etapa 2a: Verificar token do e-mail ─────────────────────────────────────
// GET /api/auth/verify-email/:token?type=patient
export const verifyEmail = async (
    token: string,
    type?: string,
): Promise<VerifyEmailResponse> => {
    const { data } = await api.get<VerifyEmailResponse>(
        `/auth/verify-email/${token}`,
        { params: type ? { type } : undefined },
    );

    // Log temporário para diagnóstico — remover após confirmar nome do campo
    console.log("[verifyEmail] resposta do backend:", data);

    // Suporta variações do nome do campo retornado pelo backend
    const tempToken =
        data.tempToken ??
        (data as unknown as Record<string, string>).token ??
        (data as unknown as Record<string, string>).accessToken ??
        (data as unknown as Record<string, string>).registrationToken;

    if (!tempToken) {
        console.error("[verifyEmail] token não encontrado na resposta:", data);
        throw new Error("Token temporário não encontrado na resposta do servidor.");
    }

    localStorage.setItem("@minhaclinica:token", tempToken);
    return { ...data, tempToken };
};

// ─── Etapa 2b: Reenviar e-mail de verificação ────────────────────────────────
// POST /api/auth/register/resend-verification
export const resendVerification = async (
    payload: ResendVerificationPayload,
): Promise<void> => {
    await api.post("/auth/register/resend-verification", payload);
};

// ─── Etapa 3: Completar cadastro ─────────────────────────────────────────────
// POST /api/auth/register/complete  🔒 tempRegistrationAuth
export const registerComplete = async (
    payload: RegisterCompletePayload,
): Promise<RegisterCompleteResponse> => {
    JSON.stringify(payload, null, 2);
    const { data } = await api.post<RegisterCompleteResponse>(
        "/auth/register/complete",
        payload,
    );
    // Substitui o token temporário pelo token definitivo de sessão
    localStorage.setItem("@minhaclinica:token", data.accessToken);
    return data;
};
