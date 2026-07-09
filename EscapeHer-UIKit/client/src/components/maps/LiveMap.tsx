"use client";

import React from "react";
import { MapPin } from "lucide-react";

export interface LiveMapProps {
  latitude: number;
  longitude: number;
  accuracyMeters?: number;
  lastUpdatedSeconds?: number;
  isLive?: boolean;
  /**
   * Slot for the actual map render (e.g. @react-google-maps/api's
   * <GoogleMap>). If omitted, a branded placeholder is shown so this
   * component can ship before maps are wired up.
   */
  children?: React.ReactNode;
  className?: string;
}

function formatCoord(n: number) {
  return n.toFixed(5);
}

function formatAgo(s: number) {
  if (s < 60) return `${Math.round(s)}s ago`;
  return `${Math.floor(s / 60)}m ago`;
}

export default function LiveMap({
  latitude,
  longitude,
  accuracyMeters,
  lastUpdatedSeconds,
  isLive = true,
  children,
  className = "",
}: LiveMapProps) {
  return (
    <div
      className={`overflow-hidden rounded-2xl ${className}`}
      style={{ background: "var(--eh-surface, #fff)", border: "1px solid var(--eh-mist-200)" }}
    >
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-2">
          {isLive && (
            <span className="relative flex h-2 w-2">
              <span
                className="absolute inline-flex h-full w-full rounded-full animate-ping"
                style={{ background: "var(--eh-danger-600)", opacity: 0.6 }}
              />
              <span className="relative inline-flex h-2 w-2 rounded-full" style={{ background: "var(--eh-danger-600)" }} />
            </span>
          )}
          <span className="text-xs font-semibold uppercase tracking-wide" style={{ color: "var(--eh-ink-900)" }}>
            {isLive ? "Live location" : "Last known location"}
          </span>
        </div>
        {lastUpdatedSeconds !== undefined && (
          <span className="text-[11px] font-mono" style={{ color: "var(--eh-ink-600)" }}>
            {formatAgo(lastUpdatedSeconds)}
          </span>
        )}
      </div>

      <div
        className="relative aspect-[4/3] w-full"
        style={{ background: "var(--eh-mist-50)" }}
      >
        {children ? (
          children
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <div
              className="absolute inset-0 opacity-40"
              style={{
                backgroundImage:
                  "linear-gradient(var(--eh-mist-200) 1px, transparent 1px), linear-gradient(90deg, var(--eh-mist-200) 1px, transparent 1px)",
                backgroundSize: "24px 24px",
              }}
              aria-hidden="true"
            />
            <span
              className="absolute rounded-full"
              style={{ width: 64, height: 64, background: "var(--eh-teal-100)" }}
              aria-hidden="true"
            />
            <MapPin size={28} color="var(--eh-teal-700)" className="relative" fill="var(--eh-teal-500)" />
          </div>
        )}
      </div>

      <div className="flex items-center justify-between px-4 py-2.5">
        <span className="text-[11px] font-mono" style={{ color: "var(--eh-ink-600)" }}>
          {formatCoord(latitude)}, {formatCoord(longitude)}
        </span>
        {accuracyMeters !== undefined && (
          <span className="text-[11px]" style={{ color: "var(--eh-ink-600)" }}>
            ±{Math.round(accuracyMeters)}m accuracy
          </span>
        )}
      </div>
    </div>
  );
}
