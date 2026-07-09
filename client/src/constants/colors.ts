export const COLORS = {
  primary: {
    50: "#fff1f2",
    100: "#ffe4e6",
    200: "#fecdd3",
    300: "#fda4af",
    400: "#fb7185",
    500: "#f43f5e",
    600: "#e11d48",
    700: "#be123c",
    800: "#9f1239",
    900: "#881337",
    950: "#4c0519",
  },
  accent: {
    50: "#fdf4ff",
    100: "#fae8ff",
    200: "#f5d0fe",
    300: "#f0abfc",
    400: "#e879f9",
    500: "#d946ef",
    600: "#c026d3",
    700: "#a21caf",
    800: "#86198f",
    900: "#701a75",
    950: "#4a044e",
  },
  neutral: {
    50: "#fafafa",
    100: "#f4f4f5",
    200: "#e4e4e7",
    300: "#d4d4d8",
    400: "#a1a1aa",
    500: "#71717a",
    600: "#52525b",
    700: "#3f3f46",
    800: "#27272a",
    900: "#18181b",
    950: "#09090b",
  },
  success: {
    light: "#4ade80",
    DEFAULT: "#22c55e",
    dark: "#16a34a",
  },
  warning: {
    light: "#fbbf24",
    DEFAULT: "#f59e0b",
    dark: "#d97706",
  },
  danger: {
    light: "#f87171",
    DEFAULT: "#ef4444",
    dark: "#dc2626",
  },
  info: {
    light: "#60a5fa",
    DEFAULT: "#3b82f6",
    dark: "#2563eb",
  },
} as const;

export const SEVERITY_COLORS: Record<string, string> = {
  low: COLORS.info.DEFAULT,
  medium: COLORS.warning.DEFAULT,
  high: COLORS.danger.light,
  critical: COLORS.danger.dark,
};

export const STATUS_COLORS: Record<string, string> = {
  idle: COLORS.neutral[400],
  triggered: COLORS.warning.DEFAULT,
  active: COLORS.danger.DEFAULT,
  resolved: COLORS.success.DEFAULT,
  cancelled: COLORS.neutral[500],
};

export const GRADIENT = {
  primary: "linear-gradient(135deg, #e11d48 0%, #be123c 50%, #9f1239 100%)",
  accent: "linear-gradient(135deg, #d946ef 0%, #a21caf 100%)",
  dark: "linear-gradient(135deg, #18181b 0%, #09090b 100%)",
  glass: "linear-gradient(135deg, rgba(244,63,94,0.1) 0%, rgba(217,70,239,0.05) 100%)",
  hero: "linear-gradient(135deg, rgba(225,29,72,0.15) 0%, rgba(168,85,247,0.1) 50%, rgba(9,9,11,0.95) 100%)",
} as const;
