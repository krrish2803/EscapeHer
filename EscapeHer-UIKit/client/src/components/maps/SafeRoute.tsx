"use client";

import React from "react";
import { ShieldCheck, Hospital, Building2, Navigation2 } from "lucide-react";

export type SafeDestinationType = "police" | "hospital" | "public";

export interface SafeRouteProps {
  destinationName: string;
  destinationType: SafeDestinationType;
  distanceKm: number;
  etaMinutes: number;
  address?: string;
  /** Slot for the real map/route render. Falls back to a placeholder. */
  children?: React.ReactNode;
  onStartNavigation?: () => void;
  className?: string;
}

const TYPE_CONFIG: Record<SafeDestinationType, { label: string; icon: React.ElementType }> = {
  police: { label: "Police station", icon: ShieldCheck },
  hospital: { label: "Hospital", icon: Hospital },
  public: { label: "Public place", icon: Building2 },
};

export default function SafeRoute({
  destinationName,
  destinationType,
  distanceKm,
  etaMinutes,
  address,
  children,
  onStartNavigation,
  className = "",
}: SafeRouteProps) {
  const { label, icon: Icon } = TYPE_CONFIG[destinationType];

  return (
    <div
      className={`overflow-hidden rounded-2xl ${className}`}
      style={{ background: "var(--eh-surface, #fff)", border: "1px solid var(--eh-mist-200)" }}
    >
      <div className="flex items-start gap-3 px-4 py-3">
        <span
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full"
          style={{ background: "var(--eh-teal-100)" }}
        >
          <Icon size={20} color="var(--eh-teal-700)" />
        </span>
        <div className="min-w-0">
          <p className="text-[11px] font-semibold uppercase tracking-wide" style={{ color: "var(--eh-teal-700)" }}>
            {label}
          </p>
          <p className="text-sm font-semibold truncate" style={{ color: "var(--eh-ink-900)" }}>
            {destinationName}
          </p>
          {address && (
            <p className="text-xs truncate" style={{ color: "var(--eh-ink-600)" }}>
              {address}
            </p>
          )}
        </div>
      </div>

      <div className="relative aspect-[4/3] w-full" style={{ background: "var(--eh-mist-50)" }}>
        {children ? (
          children
        ) : (
          <svg viewBox="0 0 320 240" className="absolute inset-0 h-full w-full" aria-hidden="true">
            <path
              d="M 40 210 C 100 160, 120 120, 160 120 S 240 60, 280 30"
              fill="none"
              stroke="var(--eh-teal-500)"
              strokeWidth="4"
              strokeLinecap="round"
              strokeDasharray="2 12"
            />
            <circle cx="40" cy="210" r="7" fill="var(--eh-danger-600)" />
            <circle cx="280" cy="30" r="7" fill="var(--eh-safe-600)" />
          </svg>
        )}
      </div>

      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-baseline gap-3">
          <span className="text-sm font-semibold" style={{ color: "var(--eh-ink-900)" }}>
            {distanceKm < 1 ? `${Math.round(distanceKm * 1000)} m` : `${distanceKm.toFixed(1)} km`}
          </span>
          <span className="text-xs" style={{ color: "var(--eh-ink-600)" }}>
            ~{etaMinutes} min away
          </span>
        </div>
        <button
          type="button"
          onClick={onStartNavigation}
          className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold"
          style={{ background: "var(--eh-teal-500)", color: "var(--eh-surface, #fff)" }}
        >
          <Navigation2 size={14} />
          Start
        </button>
      </div>
    </div>
  );
}
