import { createContext, type ReactNode, useContext, useEffect, useState } from "react";
import type { UserRole } from "../types/enums";

interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

interface AuthContextData {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  logout: () => void;
  // Funções de verificação de papel
  isPatient: () => boolean;
  isReceptionist: () => boolean;
  isProfessional: () => boolean;
  isAdmin: () => boolean;
  hasRole: (role: UserRole) => boolean;
}

const AuthContext = createContext<AuthContextData | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Carregar usuário do localStorage se houver um token
    const loadUser = () => {
      const token = localStorage.getItem("@minhaclinica:token");
      const storedUser = localStorage.getItem("@minhaclinica:user");

      if (token && storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser) as User;
          setUser(parsedUser);
        } catch (error) {
          console.error("Erro ao carregar usuário:", error);
          localStorage.removeItem("@minhaclinica:user");
          localStorage.removeItem("@minhaclinica:token");
        }
      }
      setIsLoading(false);
    };

    loadUser();
  }, []);

  const handleSetUser = (userData: User | null) => {
    if (userData) {
      localStorage.setItem("@minhaclinica:user", JSON.stringify(userData));
      setUser(userData);
    } else {
      localStorage.removeItem("@minhaclinica:user");
      setUser(null);
    }
  };

  const logout = () => {
    localStorage.removeItem("@minhaclinica:token");
    localStorage.removeItem("@minhaclinica:user");
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
