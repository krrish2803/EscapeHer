"use client";

import { useContext } from "react";
import { ThemeContext, type ThemeContextValue } from "@/context/ThemeContext";

/**
 * Hook to access the ThemeContext.
 * Must be used within a <ThemeProvider>.
 */
export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
