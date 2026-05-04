import { api } from "../config/api";
import type { LoginPayload, LoginResponse } from "../types/auth";
import { storeAuthToken } from "../utils/authStorage";

// POST /api/auth/login
export const login = async (payload: LoginPayload, rememberMe = false): Promise<LoginResponse> => {
  const { data } = await api.post<LoginResponse>("/auth/login", payload);
  storeAuthToken(data.token, rememberMe);
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
