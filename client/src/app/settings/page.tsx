"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import DashboardLayout from "@/components/layout/DashboardLayout";
import PageHeader from "@/components/common/PageHeader";
import {
  Bell, Moon, Wifi, Mic, Shield, ChevronRight, LogOut, Loader2
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useTheme } from "@/hooks/useTheme";

interface ToggleRowProps {
  icon: React.ElementType;
  label: string;
  description: string;
  value: boolean;
  onChange: (v: boolean) => void;
  id: string;
}

function ToggleRow({ icon: Icon, label, description, value, onChange, id }: ToggleRowProps) {
  return (
    <div
      className="flex items-center gap-4 py-4.5 [&:not(:last-child)]:border-b border-[var(--eh-mist-200)]"
    >
      <span
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl"
        style={{ background: "var(--eh-danger-100)" }}
      >
        <Icon size={16} color="var(--eh-danger-600)" />
      </span>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-bold" style={{ color: "var(--eh-ink-900)" }}>{label}</p>
        <p className="text-xs mt-0.5 leading-relaxed" style={{ color: "var(--eh-ink-600)" }}>{description}</p>
      </div>
      {/* Accessible premium toggle switch */}
      <button
        type="button"
        id={id}
        role="switch"
        aria-checked={value}
        aria-label={label}
        onClick={() => onChange(!value)}
        className="relative shrink-0 h-6 w-11 rounded-full transition-all duration-300 overflow-hidden shadow-inner active:scale-95 hover:brightness-105"
        style={{
          background: value ? "var(--eh-danger-600)" : "var(--eh-mist-200)",
        }}
      >
        <span
          className="absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-md transition-all duration-200"
          style={{ left: value ? "calc(100% - 22px)" : "2px" }}
        />
      </button>
    </div>
  );
}

interface LinkRowProps {
  icon: React.ElementType;
  label: string;
  description?: string;
  onClick: () => void;
}

function LinkRow({ icon: Icon, label, description, onClick }: LinkRowProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center gap-4 py-4.5 text-left rounded-xl px-2 transition-all duration-200 hover:bg-[var(--eh-mist-50)] active:scale-[0.98] [&:not(:last-child)]:border-b border-[var(--eh-mist-200)]"
    >
      <span
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl"
        style={{ background: "var(--eh-danger-100)" }}
      >
        <Icon size={16} color="var(--eh-danger-600)" />
      </span>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-bold" style={{ color: "var(--eh-ink-900)" }}>{label}</p>
        {description && <p className="text-xs mt-0.5 text-[var(--eh-ink-600)]">{description}</p>}
      </div>
      <ChevronRight size={16} className="text-[var(--eh-ink-600)]" />
    </button>
  );
}

export default function SettingsPage() {
  const router = useRouter();
  const { signOut } = useAuth();
  const { resolvedTheme, setTheme } = useTheme();
  const [notifications, setNotifications] = useState(true);
  const [offlineMode, setOfflineMode] = useState(true);
  const [autoRecord, setAutoRecord] = useState(true);
  const [signingOut, setSigningOut] = useState(false);

  const darkMode = resolvedTheme === "dark";

  const handleSignOut = async () => {
    setSigningOut(true);
    await signOut();
    router.push("/login");
    setSigningOut(false);
  };

  return (
    <DashboardLayout>
      <div className="px-4 md:px-8 py-8 space-y-8 max-w-4xl mx-auto eh-page">
        <PageHeader title="Settings" subtitle="Manage your app preferences and privacy." />

        {/* Preferences */}
        <section aria-labelledby="prefs-heading">
          <h2
            id="prefs-heading"
            className="text-xs font-bold uppercase tracking-wider mb-3 text-[var(--eh-ink-600)]"
          >
            Preferences
          </h2>
          <div
            className="rounded-2xl px-6 py-1 border border-[var(--eh-mist-200)] bg-[var(--eh-surface)] shadow-sm"
          >
            <ToggleRow
              id="setting-notifications"
              icon={Bell}
              label="Push notifications"
              description="Receive alerts for heartbeat check-ins and escalations"
              value={notifications}
              onChange={setNotifications}
            />
            <ToggleRow
              id="setting-dark-mode"
              icon={Moon}
              label="Dark mode"
              description="Switch the app to a dark colour scheme"
              value={darkMode}
              onChange={(v) => {
                setTheme(v ? "dark" : "light");
              }}
            />
            <ToggleRow
              id="setting-offline"
              icon={Wifi}
              label="Offline mode (low connectivity)"
              description="Cache GPS data and audio locally until sync is possible"
              value={offlineMode}
              onChange={setOfflineMode}
            />
            <ToggleRow
              id="setting-auto-record"
              icon={Mic}
              label="Auto-record on Danger Mode"
              description="Start audio recording automatically when an emergency session begins"
              value={autoRecord}
              onChange={setAutoRecord}
            />
          </div>
        </section>

        {/* Security */}
        <section aria-labelledby="security-heading">
          <h2
            id="security-heading"
            className="text-xs font-bold uppercase tracking-wider mb-3 text-[var(--eh-ink-600)]"
          >
            Security
          </h2>
          <div
            className="rounded-2xl px-6 py-1 border border-[var(--eh-mist-200)] bg-[var(--eh-surface)] shadow-sm"
          >
            <LinkRow
              icon={Shield}
              label="Change password"
              description="Update your account password"
              onClick={() => {
                console.log("[settings] change password");
              }}
            />
            <LinkRow
              icon={Shield}
              label="Emergency PIN"
              description="Set a stealth activation PIN for Danger Mode"
              onClick={() => {
                console.log("[settings] emergency pin");
              }}
            />
          </div>
        </section>

        {/* Sign out */}
        <div>
          <button
            type="button"
            onClick={handleSignOut}
            disabled={signingOut}
            className="flex w-full items-center justify-center gap-2 rounded-2xl py-4 text-sm font-bold border border-[var(--eh-mist-200)] bg-[var(--eh-surface)] text-[var(--eh-danger-600)] hover:bg-[var(--eh-danger-100)]/10 hover:border-[var(--eh-danger-600)]/30 shadow-sm transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {signingOut ? (
              <><Loader2 size={16} className="animate-spin" />Signing out…</>
            ) : (
              <><LogOut size={16} />Sign out</>
            )}
          </button>
        </div>

        {/* App info */}
        <p
          className="text-center text-[10px] tracking-wide"
          style={{ color: "var(--eh-ink-600)", fontFamily: "var(--eh-font-mono)" }}
        >
          EscapeHer v1.0.0 · Built with ♥ for safety
        </p>
      </div>
    </DashboardLayout>
  );
}
