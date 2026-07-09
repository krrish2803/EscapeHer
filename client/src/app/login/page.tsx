"use client";

import React from "react";
import Link from "next/link";
import Logo from "@/components/common/Logo";
import LoginForm from "@/components/forms/LoginForm";

export default function LoginPage() {
  return (
    <main
      className="min-h-dvh flex items-center justify-center px-4 py-12 eh-page"
      style={{ background: "var(--eh-mist-50)" }}
    >
      <div
        className="w-full max-w-sm space-y-8 rounded-2xl p-8"
        style={{ background: "var(--eh-surface, #fff)", border: "1px solid var(--eh-mist-200)" }}
      >
        {/* Logo */}
        <div className="flex flex-col items-center gap-3">
          <Logo variant="full" size="md" />
          <p className="text-sm text-center" style={{ color: "var(--eh-ink-600)" }}>
            Your AI-powered safety companion
          </p>
        </div>

        {/* Heading */}
        <div>
          <h1
            className="text-xl font-bold"
            style={{ color: "var(--eh-ink-900)", fontFamily: "var(--eh-font-display)" }}
          >
            Welcome back
          </h1>
          <p className="text-sm mt-1" style={{ color: "var(--eh-ink-600)" }}>
            Sign in to access your safety dashboard.
          </p>
        </div>

        {/* Form */}
        <LoginForm />

        {/* Footer links */}
        <div className="space-y-3 pt-2">
          <p className="text-sm text-center" style={{ color: "var(--eh-ink-600)" }}>
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="font-semibold" style={{ color: "var(--eh-teal-500)" }}>
              Create one
            </Link>
          </p>
          <p className="text-sm text-center">
            <Link href="/forgot-password" className="text-xs" style={{ color: "var(--eh-ink-600)" }}>
              Forgot password?
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
