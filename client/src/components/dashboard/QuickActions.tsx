"use client";

import React from "react";
import Link from "next/link";
import {
  ShieldAlert,
  Navigation,
  Phone,
  Users,
  Mic,
  History,
} from "lucide-react";

interface ActionItem {
  href: string;
  icon: React.ElementType;
  label: string;
  sublabel: string;
  accentBg: string;
  accentColor: string;
  /** Mark as primary — larger, full-width card */
  primary?: boolean;
}

const ACTIONS: ActionItem[] = [
  {
    href: "/danger-mode",
    icon: ShieldAlert,
    label: "Danger Mode",
    sublabel: "Activate emergency session",
    accentBg: "var(--eh-danger-100)",
    accentColor: "var(--eh-danger-600)",
    primary: true,
  },
  {
    href: "/emergency/safe-route",
    icon: Navigation,
    label: "Safe Route",
    sublabel: "Police · Hospital · Public",
    accentBg: "var(--eh-teal-100)",
    accentColor: "var(--eh-teal-700)",
  },
  {
    href: "/emergency/fake-call",
    icon: Phone,
    label: "Fake Call",
    sublabel: "Escape a situation",
    accentBg: "var(--eh-blue-300)",
    accentColor: "var(--eh-blue-600)",
  },
  {
    href: "/profile",
    icon: Users,
    label: "Trusted Contacts",
    sublabel: "Manage your network",
    accentBg: "var(--eh-teal-100)",
    accentColor: "var(--eh-teal-700)",
  },
  {
    href: "/history",
    icon: History,
    label: "History",
    sublabel: "Incident timeline",
    accentBg: "var(--eh-spark-200)",
    accentColor: "var(--eh-spark-500)",
  },
  {
    href: "/history",
    icon: Mic,
    label: "Evidence",
    sublabel: "Audio logs & AI summary",
    accentBg: "var(--eh-teal-100)",
    accentColor: "var(--eh-teal-700)",
  },
];

interface QuickActionsProps {
  className?: string;
}

export default function QuickActions({ className = "" }: QuickActionsProps) {
  const [primary, ...rest] = ACTIONS;

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Primary — Danger Mode: full-width, prominent */}
      <Link
        href={primary.href}
        className="flex items-center gap-4 rounded-2xl p-4 border-2 border-[var(--eh-danger-600)] bg-[var(--eh-surface)] hover:bg-[var(--eh-danger-100)]/10 hover:shadow-[0_0_25px_rgba(226,114,114,0.08)] transition-all duration-300 active:scale-[0.98]"
      >
        <span
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full"
          style={{ background: primary.accentBg }}
        >
          <primary.icon size={24} color={primary.accentColor} />
        </span>
        <div className="flex-1 min-w-0">
          <p className="text-base font-bold" style={{ color: "var(--eh-danger-600)", fontFamily: "var(--eh-font-display)" }}>
            {primary.label}
          </p>
          <p className="text-xs mt-0.5" style={{ color: "var(--eh-ink-600)" }}>
            {primary.sublabel}
          </p>
        </div>
        <span
          className="shrink-0 rounded-full px-3 py-1 text-xs font-semibold"
          style={{ background: "var(--eh-danger-600)", color: "var(--eh-surface, #fff)" }}
        >
          SOS
        </span>
      </Link>

      {/* Grid of secondary actions */}
      <div className="grid grid-cols-2 gap-3">
        {rest.map(({ href, icon: Icon, label, sublabel, accentBg, accentColor }) => (
          <Link
            key={label}
            href={href}
            className="flex flex-col gap-3 rounded-2xl p-4 border border-[var(--eh-mist-200)] bg-[var(--eh-surface)] hover:border-[var(--eh-teal-500)]/40 hover:bg-[var(--eh-teal-100)]/5 hover:shadow-[0_0_20px_rgba(63,191,174,0.05)] transition-all duration-300 active:scale-[0.98]"
          >
            <span
              className="flex h-10 w-10 items-center justify-center rounded-full"
              style={{ background: accentBg }}
            >
              <Icon size={18} color={accentColor} />
            </span>
            <div>
              <p className="text-sm font-semibold" style={{ color: "var(--eh-ink-900)" }}>
                {label}
              </p>
              <p className="text-xs mt-0.5" style={{ color: "var(--eh-ink-600)" }}>
                {sublabel}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
