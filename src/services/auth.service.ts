import { api } from "../config/api";
import type { LoginPayload, LoginResponse } from "../types/auth";
import { storeAuthToken } from "../utils/authStorage";

// POST /api/auth/login
export const login = async (payload: LoginPayload, rememberMe = false): Promise<LoginResponse> => {
  const { data } = await api.post<LoginResponse>("/auth/login", payload);
  storeAuthToken(data.token, rememberMe);
  return data;
};
