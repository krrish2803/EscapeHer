"use client";

import React from "react";

/**
 * EscapeHer design tokens.
 *
 * Direction: "trust & calm" — a teal/blue system that stays composed even
 * in an alert state, so the danger color is reserved ONLY for a live,
 * active emergency and never used decoratively. Exported as a plain object
 * too, so chart libraries (Recharts/Chart.js) that need raw hex strings
 * instead of CSS vars can import EH_TOKENS directly.
 *
 * Usage in Tailwind: bg-[var(--eh-teal-500)] text-[var(--eh-ink-900)]
 * Consumed for actual light/dark switching by ThemeContext + useTheme
 * (Kamal) — this file only defines and injects the token values.
 */
export const EH_TOKENS = {
  light: {
    "--eh-teal-900": "#06322F",
    "--eh-teal-700": "#0E5F58",
    "--eh-teal-500": "#159A8D",
    "--eh-teal-100": "#D9EEEA",
    "--eh-blue-600": "#2C6E8F",
    "--eh-blue-300": "#9FC6DA",
    "--eh-spark-500": "#E8A33D",
    "--eh-spark-200": "#F5D9A8",
    "--eh-danger-600": "#C23B3B",
    "--eh-danger-100": "#F5DEDE",
    "--eh-safe-600": "#2E9A6A",
    "--eh-safe-100": "#DCEFE6",
    "--eh-ink-900": "#16262A",
    "--eh-ink-600": "#4B6068",
    "--eh-mist-50": "#F3F7F6",
    "--eh-mist-200": "#E1EAE8",
    "--eh-surface": "#FFFFFF",
  },
  dark: {
    "--eh-teal-900": "#EAF6F4",
    "--eh-teal-700": "#7FC4B8",
    "--eh-teal-500": "#3FBFAE",
    "--eh-teal-100": "#123B37",
    "--eh-blue-600": "#8FC0D9",
    "--eh-blue-300": "#274A5A",
    "--eh-spark-500": "#F0B65A",
    "--eh-spark-200": "#4A3A1E",
    "--eh-danger-600": "#E27272",
    "--eh-danger-100": "#3A1C1C",
    "--eh-safe-600": "#5CC698",
    "--eh-safe-100": "#173328",
    "--eh-ink-900": "#EAF1F0",
    "--eh-ink-600": "#A9BCC0",
    "--eh-mist-50": "#0C1716",
    "--eh-mist-200": "#16201F",
    "--eh-surface": "#0F1E1C",
  },
} as const;

function tokensToCss(vars: Record<string, string>) {
  return Object.entries(vars)
    .map(([key, value]) => `${key}: ${value};`)
    .join("\n");
}

export interface ThemeProviderProps {
  children: React.ReactNode;
  /** Font stack lives here so every component pulls from one source. */
  fontSans?: string;
  fontMono?: string;
}

/**
 * Injects the EscapeHer token system as CSS custom properties on :root
 * (light) and under [data-theme="dark"] (dark). Purely presentational —
 * pass this a `children` tree; actual theme-switching state lives in
 * ThemeContext/useTheme.
 */
export default function ThemeProvider({
  children,
  fontSans = "'Manrope', 'Segoe UI', system-ui, sans-serif",
  fontMono = "'IBM Plex Mono', ui-monospace, monospace",
}: ThemeProviderProps) {
  return (
    <>
      <style>{`
        :root {
          ${tokensToCss(EH_TOKENS.light)}
          --eh-font-sans: ${fontSans};
          --eh-font-mono: ${fontMono};
        }
        [data-theme="dark"] {
          ${tokensToCss(EH_TOKENS.dark)}
        }
        .eh-root { font-family: var(--eh-font-sans); }
      `}</style>
      <div className="eh-root">{children}</div>
    </>
  );
}
