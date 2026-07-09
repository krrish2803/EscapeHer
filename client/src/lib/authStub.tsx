"use client";

/**
 * Stub AuthContext — replace with Kamal's real Firebase implementation.
 * TODO: replace with Kamal's real implementation
 *
 * Real interface will come from client/src/context/AuthContext.tsx +
 * client/src/hooks/useAuth.ts once Krrish/Kamal wire Firebase Auth.
 */

import React, { createContext, useContext, useState } from "react";
import { removeToken, removeStoredUser } from "@/lib/helpers";
import { disconnectSocket } from "@/lib/socket";

export interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  phoneNumber: string | null;
}

export interface AuthContextValue {
  user: User | null;
  isInitializing: boolean;
  isAuthenticated: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

/** Stub provider — simulates a signed-in user for local development. */
export function AuthContextProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>({
    uid: "stub-uid-001",
    email: "user@example.com",
    displayName: "Muskan",
    photoURL: null,
    phoneNumber: null,
  });

  const value: AuthContextValue = {
    user,
    isInitializing: false,
    isAuthenticated: user !== null,
    signIn: async (email: string, password: string) => {
      setUser({
        uid: "stub-uid-001",
        email: email || "user@example.com",
        displayName: "Muskan",
        photoURL: null,
        phoneNumber: null,
      });
    },
    signUp: async (email: string, password: string, name: string) => {
      setUser({
        uid: "stub-uid-001",
        email: email || "user@example.com",
        displayName: name || "Muskan",
        photoURL: null,
        phoneNumber: null,
      });
    },
    signOut: async () => {
      setUser(null);
      removeToken();
      removeStoredUser();
      disconnectSocket();
    },
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    // Gracefully return a sensible default when used outside the provider
    // TODO: replace with Kamal's real implementation
    return {
      user: null,
      isInitializing: false,
      isAuthenticated: false,
      signIn: async () => {},
      signUp: async () => {},
      signOut: async () => {},
    };
  }
  return ctx;
}
