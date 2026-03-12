import axios from "axios";
import { clearAuthStorage, getAuthToken } from "../utils/authStorage";

export const api = axios.create({
    baseURL: (import.meta.env.VITE_API_URL ?? "http://localhost:3000") + "/api",
    headers: {
        "Content-Type": "application/json",
    },
});

// Rotas públicas que não devem receber o header Authorization
const PUBLIC_ROUTES = [
    "/auth/register/start",
    "/auth/register/resend-verification",
    "/auth/verify-email",
    "/auth/login",
];

const isPublicRoute = (url?: string) =>
    PUBLIC_ROUTES.some((route) => url?.includes(route));

// Injeta o token de autenticação automaticamente em cada requisição
api.interceptors.request.use((config) => {
    const token = getAuthToken();
    if (token && !isPublicRoute(config.url)) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Redireciona para login se o token expirar (apenas em rotas autenticadas)
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401 && !isPublicRoute(error.config?.url)) {
            clearAuthStorage();
            window.location.href = "/login";
        }
        return Promise.reject(error);
    },
);
