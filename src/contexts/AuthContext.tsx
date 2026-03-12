import { createContext, useContext, useEffect, useState } from "react";
import type { AuthContextData, AuthProviderProps, User } from "../types/auth";
import type { UserRole } from "../types/enums";
import {
  clearAuthStorage,
  clearStoredAuthUser,
  getAuthToken,
  getStoredAuthUser,
  storeAuthUser,
} from "../utils/authStorage";

const AuthContext = createContext<AuthContextData | undefined>(undefined);

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Carrega usuário da sessão (persistente ou temporária) se houver token válido.
    const loadUser = () => {
      const token = getAuthToken();
      const storedUser = getStoredAuthUser();

      if (token && storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser) as User;
          setUser(parsedUser);
        } catch (error) {
          console.error("Erro ao carregar usuário:", error);
          clearAuthStorage();
        }
      }
      setIsLoading(false);
    };

    loadUser();
  }, []);

  const handleSetUser = (userData: User | null) => {
    if (userData) {
      storeAuthUser(userData);
      setUser(userData);
    } else {
      clearStoredAuthUser();
      setUser(null);
    }
  };

  const logout = () => {
    clearAuthStorage();
    setUser(null);
  };

  const isPatient = () => user?.role === "PATIENT";
  const isReceptionist = () => user?.role === "RECEPTIONIST";
  const isProfessional = () => user?.role === "PROFESSIONAL";
  const isAdmin = () => user?.role === "ADMIN";
  const hasRole = (role: UserRole) => user?.role === role;

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        setUser: handleSetUser,
        logout,
        isPatient,
        isReceptionist,
        isProfessional,
        isAdmin,
        hasRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextData {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  }

  return context;
}
