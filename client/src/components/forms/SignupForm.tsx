"use client";

import React, { useState } from "react";
import { Eye, EyeOff, Mail, Lock, User, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

interface SignupFormProps {
  onSuccess?: () => void;
}

export default function SignupForm({ onSuccess }: SignupFormProps) {
  const { signUp } = useAuth();
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError("Passwords don't match.");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    setLoading(true);
    try {
      await signUp(email, password, name);
      if (onSuccess) {
        onSuccess();
      } else {
        router.push("/dashboard");
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Sign-up failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4" aria-label="Create account form">
      {error && (
        <div
          className="rounded-xl px-4 py-3 text-sm"
          style={{ background: "var(--eh-danger-100)", color: "var(--eh-danger-600)", border: "1px solid var(--eh-danger-600)" }}
          role="alert"
        >
          {error}
        </div>
      )}

      {/* Name */}
      <div className="space-y-1.5">
        <label htmlFor="signup-name" className="block text-sm font-medium" style={{ color: "var(--eh-ink-900)" }}>
          Full name
        </label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2">
            <User size={16} color="var(--eh-ink-600)" />
          </span>
          <input
            id="signup-name"
            type="text"
            autoComplete="name"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            className="eh-input pl-9"
          />
        </div>
      </div>

      {/* Email */}
      <div className="space-y-1.5">
        <label htmlFor="signup-email" className="block text-sm font-medium" style={{ color: "var(--eh-ink-900)" }}>
          Email address
        </label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2">
            <Mail size={16} color="var(--eh-ink-600)" />
          </span>
          <input
            id="signup-email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="eh-input pl-9"
          />
        </div>
      </div>

      {/* Password */}
      <div className="space-y-1.5">
        <label htmlFor="signup-password" className="block text-sm font-medium" style={{ color: "var(--eh-ink-900)" }}>
          Password <span className="text-xs font-normal" style={{ color: "var(--eh-ink-600)" }}>(min. 8 characters)</span>
        </label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2">
            <Lock size={16} color="var(--eh-ink-600)" />
          </span>
          <input
            id="signup-password"
            type={showPassword ? "text" : "password"}
            autoComplete="new-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="eh-input pl-9 pr-10"
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            aria-label={showPassword ? "Hide password" : "Show password"}
            className="absolute right-3 top-1/2 -translate-y-1/2"
          >
            {showPassword ? <EyeOff size={16} color="var(--eh-ink-600)" /> : <Eye size={16} color="var(--eh-ink-600)" />}
          </button>
        </div>
      </div>

      {/* Confirm password */}
      <div className="space-y-1.5">
        <label htmlFor="signup-confirm-password" className="block text-sm font-medium" style={{ color: "var(--eh-ink-900)" }}>
          Confirm password
        </label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2">
            <Lock size={16} color="var(--eh-ink-600)" />
          </span>
          <input
            id="signup-confirm-password"
            type={showPassword ? "text" : "password"}
            autoComplete="new-password"
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="••••••••"
            className="eh-input pl-9"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="eh-btn-primary w-full mt-2"
        aria-busy={loading}
      >
        {loading ? (
          <>
            <Loader2 size={16} className="animate-spin" />
            Creating account…
          </>
        ) : (
          "Create account"
        )}
      </button>
    </form>
  );
}
