"use client";

import {
  createContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import { apiGet, apiPost } from "@/lib/api";
import {
  setToken,
  getToken,
  removeToken,
  setStoredUser,
  getStoredUser,
  removeStoredUser,
} from "@/lib/helpers";
import { API_ENDPOINTS } from "@/constants/api";
import { DEFAULT_REDIRECT_AFTER_LOGIN, DEFAULT_REDIRECT_AFTER_LOGOUT } from "@/constants/routes";
import type { User, AuthCredentials, SignupPayload, AuthResponse } from "@/types/user";
import type { ApiResponse } from "@/types/api";

export interface AuthContextValue {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (credentials: AuthCredentials) => Promise<void>;
  signup: (payload: SignupPayload) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  clearError: () => void;
  // Compatibility aliases for stub replacements
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  signOut: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextValue | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [token, setTokenState] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const isAuthenticated = !!user && !!token;

  /* ── Bootstrap: rehydrate from localStorage ──────────────────────── */
  useEffect(() => {
    const savedToken = getToken();
    const savedUser = getStoredUser();
    const timer = setTimeout(() => {
      if (savedToken && savedUser) {
        setTokenState(savedToken);
        setUser(savedUser);
      }
      setIsLoading(false);
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  /* ── Refresh the user profile from the server ────────────────────── */
  const refreshUser = useCallback(async () => {
    try {
      const res = await apiGet<ApiResponse<User>>(API_ENDPOINTS.AUTH.ME);
      if (res.success && res.data) {
        setUser(res.data);
        setStoredUser(res.data);
      }
    } catch {
      removeToken();
      removeStoredUser();
      setUser(null);
      setTokenState(null);
    }
  }, []);

  /* ── Login ───────────────────────────────────────────────────────── */
  const login = useCallback(
    async (credentials: AuthCredentials) => {
      setIsLoading(true);
      setError(null);
      try {
        const res = await apiPost<AuthResponse>(API_ENDPOINTS.AUTH.LOGIN, credentials);
        if (res.success && res.data) {
          setToken(res.data.token);
          setTokenState(res.data.token);
          setStoredUser(res.data.user);
          setUser(res.data.user);
          router.push(DEFAULT_REDIRECT_AFTER_LOGIN);
        } else {
          const errMessage = res.message || "Login failed";
          setError(errMessage);
          throw new Error(errMessage);
        }
      } catch (err: unknown) {
        const data = (err as { response?: { data?: { message?: string; errors?: string[] } } })?.response?.data;
        const message = data?.errors && Array.isArray(data.errors) && data.errors.length > 0
          ? `${data.message}: ${data.errors.join(', ')}`
          : data?.message || (err as Error).message || "An unexpected error occurred";
        setError(message);
        throw new Error(message);
      } finally {
        setIsLoading(false);
      }
    },
    [router]
  );

  /* ── Signup ──────────────────────────────────────────────────────── */
  const signup = useCallback(
    async (payload: SignupPayload) => {
      setIsLoading(true);
      setError(null);
      try {
        const res = await apiPost<AuthResponse>(API_ENDPOINTS.AUTH.SIGNUP, payload);
        if (res.success && res.data) {
          setToken(res.data.token);
          setTokenState(res.data.token);
          setStoredUser(res.data.user);
          setUser(res.data.user);
          router.push(DEFAULT_REDIRECT_AFTER_LOGIN);
        } else {
          const errMessage = res.message || "Signup failed";
          setError(errMessage);
          throw new Error(errMessage);
        }
      } catch (err: unknown) {
        const data = (err as { response?: { data?: { message?: string; errors?: string[] } } })?.response?.data;
        const message = data?.errors && Array.isArray(data.errors) && data.errors.length > 0
          ? `${data.message}: ${data.errors.join(', ')}`
          : data?.message || (err as Error).message || "An unexpected error occurred";
        setError(message);
        throw new Error(message);
      } finally {
        setIsLoading(false);
      }
    },
    [router]
  );

  /* ── Logout ──────────────────────────────────────────────────────── */
  const logout = useCallback(async () => {
    try {
      await apiPost(API_ENDPOINTS.AUTH.LOGOUT);
    } catch {
      // Ignore server errors — clear local state regardless
    } finally {
      removeToken();
      removeStoredUser();
      setUser(null);
      setTokenState(null);
      router.push(DEFAULT_REDIRECT_AFTER_LOGOUT);
    }
  }, [router]);

  const clearError = useCallback(() => setError(null), []);

  const signIn = useCallback(
    async (email: string, password: string) => {
      await login({ email, password });
    },
    [login]
  );

  const signUp = useCallback(
    async (email: string, password: string, name: string) => {
      await signup({ email, password, name, phone: "" });
    },
    [signup]
  );

  const signOut = useCallback(async () => {
    await logout();
  }, [logout]);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated,
        isLoading,
        error,
        login,
        signup,
        logout,
        refreshUser,
        clearError,
        signIn,
        signUp,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
