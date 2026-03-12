import { api } from "../config/api";
import { storeAuthToken } from "../utils/authStorage";
import type {
    RegisterCompletePayload,
    RegisterCompleteResponse,
    RegisterStartPayload,
    RegisterStartResponse,
    ResendVerificationPayload,
    VerifyEmailResponse,
} from "../types/auth";

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

// GET /api/auth/verify-email/:token?type=patient
export const verifyEmail = async (
    token: string,
    type?: string,
): Promise<VerifyEmailResponse> => {
    const { data } = await api.get<VerifyEmailResponse>(
        `/auth/verify-email/${token}`,
        { params: type ? { type } : undefined },
    );

    const tempToken =
        data.tempToken ??
        (data as unknown as Record<string, string>).token ??
        (data as unknown as Record<string, string>).accessToken ??
        (data as unknown as Record<string, string>).registrationToken;

    if (!tempToken) {
        throw new Error("Token temporario nao encontrado na resposta do servidor.");
    }

    storeAuthToken(tempToken);
    return { ...data, tempToken };
};

// POST /api/auth/register/resend-verification
export const resendVerification = async (
    payload: ResendVerificationPayload,
): Promise<void> => {
    await api.post("/auth/register/resend-verification", payload);
};

// POST /api/auth/register/complete
export const registerComplete = async (
    payload: RegisterCompletePayload,
): Promise<RegisterCompleteResponse> => {
    const { data } = await api.post<RegisterCompleteResponse>(
        "/auth/register/complete",
        payload,
    );

    storeAuthToken(data.accessToken);
    return data;
};
