import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";

type ThemeMode = "light" | "dark";

interface ThemeModeContextData {
  mode: ThemeMode;
  setMode: (nextMode: ThemeMode) => void;
  toggleMode: () => void;
}

interface ThemeModeProviderProps {
  children: ReactNode;
}

const THEME_MODE_STORAGE_KEY = "mc-theme-mode";

const ThemeModeContext = createContext<ThemeModeContextData | undefined>(undefined);

const getStoredThemeMode = (): ThemeMode | null => {
  if (typeof window === "undefined") return null;
  const storedValue = window.localStorage.getItem(THEME_MODE_STORAGE_KEY);
  if (storedValue === "light" || storedValue === "dark") {
    return storedValue;
  }
  return null;
};

const getInitialThemeMode = (): ThemeMode => {
  const storedMode = getStoredThemeMode();
  if (storedMode) return storedMode;

  if (typeof window !== "undefined") {
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }

  return "light";
};

export function ThemeModeProvider({ children }: ThemeModeProviderProps) {
  const [mode, setMode] = useState<ThemeMode>(getInitialThemeMode);

  useEffect(() => {
    if (typeof document === "undefined") return;

    const root = document.documentElement;
    root.setAttribute("data-theme", mode);
    root.style.colorScheme = mode;

    if (typeof window !== "undefined") {
      window.localStorage.setItem(THEME_MODE_STORAGE_KEY, mode);
    }
  }, [mode]);

  useEffect(() => {
    return () => {
      if (typeof document === "undefined") return;

      const root = document.documentElement;
      root.setAttribute("data-theme", "light");
      root.style.colorScheme = "light";
    };
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleStorage = (event: StorageEvent) => {
      if (event.key !== THEME_MODE_STORAGE_KEY) return;
      if (event.newValue !== "light" && event.newValue !== "dark") return;
      setMode(event.newValue);
    };

    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  const toggleMode = () => {
    setMode((currentMode) => (currentMode === "dark" ? "light" : "dark"));
  };

  const value = useMemo(
    () => ({
      mode,
      setMode,
      toggleMode,
    }),
    [mode],
  );

  return <ThemeModeContext.Provider value={value}>{children}</ThemeModeContext.Provider>;
}

export const useThemeMode = (): ThemeModeContextData => {
  const context = useContext(ThemeModeContext);

  if (!context) {
    throw new Error("useThemeMode deve ser usado dentro de um ThemeModeProvider");
  }

  return context;
};
