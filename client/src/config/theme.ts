import { COLORS, GRADIENT } from "@/constants/colors";

export const themeConfig = {
  colors: COLORS,
  gradients: GRADIENT,

  fonts: {
    sans: "var(--font-geist-sans), system-ui, -apple-system, sans-serif",
    mono: "var(--font-geist-mono), ui-monospace, monospace",
  },

  borderRadius: {
    sm: "0.375rem",
    md: "0.5rem",
    lg: "0.75rem",
    xl: "1rem",
    "2xl": "1.5rem",
    full: "9999px",
  },

  spacing: {
    container: {
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
    },
    sidebar: "280px",
    navbar: "64px",
  },

  animation: {
    fast: "150ms",
    normal: "300ms",
    slow: "500ms",
    pulse: "2s",
  },

  shadows: {
    sm: "0 1px 2px rgba(0, 0, 0, 0.4)",
    md: "0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -2px rgba(0, 0, 0, 0.2)",
    lg: "0 10px 15px -3px rgba(0, 0, 0, 0.3), 0 4px 6px -4px rgba(0, 0, 0, 0.2)",
    xl: "0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 8px 10px -6px rgba(0, 0, 0, 0.2)",
    glow: "0 0 20px rgba(225, 29, 72, 0.3)",
    dangerGlow: "0 0 30px rgba(239, 68, 68, 0.5)",
  },

  glass: {
    background: "rgba(24, 24, 27, 0.6)",
    border: "1px solid rgba(63, 63, 70, 0.4)",
    backdropBlur: "blur(16px)",
  },
} as const;

export type ThemeConfig = typeof themeConfig;
