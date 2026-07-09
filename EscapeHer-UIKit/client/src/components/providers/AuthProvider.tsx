"use client";

import React from "react";

export interface AuthProviderProps {
  children: React.ReactNode;
  /** Passed down from the real auth logic (AuthContext/useAuth). */
  isInitializing?: boolean;
}

/**
 * Presentational shell only. Real Firebase/session logic lives in
 * AuthContext.tsx + useAuth.ts. This component just decides what the
 * screen looks like *while* that logic is resolving, so a user never
 * sees a blank white flash before we know if they're signed in.
 */
export default function AuthProvider({ children, isInitializing = false }: AuthProviderProps) {
  if (isInitializing) {
    return (
      <div
        className="flex min-h-screen w-full flex-col items-center justify-center gap-4"
        style={{ background: "var(--eh-mist-50)" }}
        role="status"
        aria-live="polite"
      >
        <div className="relative h-16 w-16">
          <span
            className="absolute inset-0 rounded-full animate-ping"
            style={{ background: "var(--eh-teal-500)", opacity: 0.25 }}
          />
          <span
            className="absolute inset-3 rounded-full"
            style={{ background: "var(--eh-teal-500)" }}
          />
        </div>
        <p className="text-sm" style={{ color: "var(--eh-ink-600)" }}>
          Checking your session…
        </p>
      </div>
    );
  }

  return <>{children}</>;
}
