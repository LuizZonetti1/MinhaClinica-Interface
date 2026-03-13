const cssVar = (name: string, fallback: string) => `var(--mc-${name}, ${fallback})`;

export const theme = {
  colors: {
    primary: "#3B82F6",
    primaryHover: "#2563EB",
    primaryActive: "#1E40AF",

    secondary: "#6366F1",
    secondaryHover: "#4F46E5",
    secondaryActive: "#4338CA",

    success: "#22C55E",
    successHover: "#16A34A",
    successActive: "#15803D",

    warning: "#EAB308",
    warningHover: "#CA8A04",
    warningActive: "#A16207",

    error: "#EF4444",
    errorHover: "#DC2626",
    errorActive: "#B91C1C",

    info: "#0EA5E9",
    infoHover: "#0284C7",
    infoActive: "#0369A1",

    background: cssVar("color-background", "#F9FAFB"),
    surface: cssVar("color-surface", "#FFFFFF"),
    surfaceMuted: cssVar("color-surface-muted", "#F1F5F9"),
    surfaceHover: cssVar("color-surface-hover", "#E2E8F0"),

    dark: cssVar("color-dark", "#1F2937"),
    darker: cssVar("color-darker", "#111827"),

    featureBg: {
      blue: cssVar("feature-bg-blue", "#DBEAFE"),
      green: cssVar("feature-bg-green", "#DCFCE7"),
      purple: cssVar("feature-bg-purple", "#F3E8FF"),
      orange: cssVar("feature-bg-orange", "#FFEDD5"),
    },

    gradients: {
      primary: cssVar(
        "gradient-primary",
        "linear-gradient(135deg, #3B82F6 0%, #1E40AF 100%)",
      ),
      hero: cssVar("gradient-hero", "linear-gradient(180deg, #3B82F6 0%, #2563EB 100%)"),
      cta: cssVar("gradient-cta", "linear-gradient(157.6deg, #2563EB 0%, #1E40AF 100%)"),
    },

    text: {
      primary: cssVar("text-primary", "#111827"),
      secondary: cssVar("text-secondary", "#4B5563"),
      muted: cssVar("text-muted", "#6B7280"),
      disabled: cssVar("text-disabled", "#9CA3AF"),
      inverse: cssVar("text-inverse", "#FFFFFF"),
      link: cssVar("text-link", "#3B82F6"),
      linkHover: cssVar("text-link-hover", "#2563EB"),
      onDark: cssVar("text-on-dark", "#D1D5DB"),
    },

    border: {
      light: cssVar("border-light", "#E5E7EB"),
      default: cssVar("border-default", "#D1D5DB"),
      focus: cssVar("border-focus", "#3B82F6"),
      divider: cssVar("border-divider", "#CBD5E1"),
      error: cssVar("border-error", "#EF4444"),
      dark: cssVar("border-dark", "#374151"),
      lighter: cssVar("border-lighter", "#F3F4F6"),
    },
  },

  borderRadius: {
    sm: "8px",
    md: "12px",
    lg: "16px",
    xl: "20px",
  },

  spacing: {
    xs: "4px",
    sm: "8px",
    md: "12px",
    lg: "16px",
    xl: "24px",
    xxl: "32px",
    xxxl: "48px",
    xxxxl: "64px",
  },

  shadows: {
    sm: "0px 1px 2px rgba(0, 0, 0, 0.05)",
    md: "0px 2px 4px rgba(0, 0, 0, 0.10), 0px 4px 6px rgba(0, 0, 0, 0.10)",
    lg: "0px 4px 12px rgba(0, 0, 0, 0.15)",
    xl: "0px 8px 16px rgba(0, 0, 0, 0.20)",
    card: "0px 25px 50px rgba(0, 0, 0, 0.35)",
  },

  breakpoints: {
    mobile: "480px",
    tablet: "768px",
    desktop: "1024px",
    wide: "1280px",
  },
};
