import { api } from "../config/api";
import type {
  LoginPayload,
  LoginResponse,
  TwoFAStatusResponse,
  TwoFAValidatePayload,
  TwoFAValidateResponse,
} from "../types/auth";
import { storeAuthToken } from "../utils/authStorage";

const DEVICE_TOKEN_KEY = "mc_device_token";

// POST /api/auth/login
export const login = async (payload: LoginPayload, rememberMe = false): Promise<LoginResponse> => {
  const deviceToken = localStorage.getItem(DEVICE_TOKEN_KEY) ?? undefined;
  const { data } = await api.post<LoginResponse>("/auth/login", { ...payload, deviceToken });
  // Só armazena o token quando NÃO há 2FA pendente
  if (!data.requires2FA && data.token) {
    storeAuthToken(data.token, rememberMe);
  }
  return data;
};

// POST /api/auth/forgot-password
export const forgotPassword = async (email: string): Promise<{ message: string }> => {
  const { data } = await api.post<{ message: string }>("/auth/forgot-password", { email });
  return data;
};

// POST /api/auth/reset-password
export const resetPassword = async (
  token: string,
  password: string,
  confirmPassword: string,
): Promise<{ message: string }> => {
  const { data } = await api.post<{ message: string }>("/auth/reset-password", {
    token,
    password,
    confirmPassword,
  });
  return data;
};

// ─── 2FA ──────────────────────────────────────────────────────────────────────

// GET /api/auth/2fa/status
export const get2FAStatus = async (): Promise<TwoFAStatusResponse> => {
  const { data } = await api.get<TwoFAStatusResponse>("/auth/2fa/status");
  return data;
};

// POST /api/auth/2fa/enable
export const enable2FA = async (): Promise<{ message: string }> => {
  const { data } = await api.post<{ message: string }>("/auth/2fa/enable");
  return data;
};

// POST /api/auth/2fa/validate  (validar durante login)
export const validate2FA = async (
  payload: TwoFAValidatePayload,
  rememberMe = false,
): Promise<TwoFAValidateResponse> => {
  const { data } = await api.post<TwoFAValidateResponse>("/auth/2fa/validate", payload);
  storeAuthToken(data.token, rememberMe);
  // Armazena o deviceToken para ser enviado nos próximos logins
  localStorage.setItem(DEVICE_TOKEN_KEY, data.deviceToken);
  return data;
};

// DELETE /api/auth/2fa  (desativar)
export const disable2FA = async (): Promise<{ message: string }> => {
  const { data } = await api.delete<{ message: string }>("/auth/2fa");
  // Remove o deviceToken local pois todos foram revogados
  localStorage.removeItem(DEVICE_TOKEN_KEY);
  return data;
};

// POST /api/auth/2fa/resend  (reenviar código durante login)
export const resend2FA = async (tempToken: string): Promise<{ message: string }> => {
  const { data } = await api.post<{ message: string }>("/auth/2fa/resend", { tempToken });
  return data;
};
