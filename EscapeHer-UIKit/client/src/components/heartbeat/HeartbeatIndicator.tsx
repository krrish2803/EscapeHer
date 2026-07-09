"use client";

import React from "react";
import { Heart, AlertTriangle, CheckCircle2 } from "lucide-react";

export type HeartbeatStatus = "monitoring" | "awaiting" | "missed" | "escalated" | "confirmed-safe";

export interface HeartbeatIndicatorProps {
  status: HeartbeatStatus;
  /** Seconds since the last confirmed heartbeat. */
  lastCheckInSeconds?: number;
  /** How often the protocol checks in, in seconds. Shown as context. */
  intervalSeconds?: number;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const STATUS_CONFIG: Record<
  HeartbeatStatus,
  { label: string; sub: string; color: string; ring: string; pulsing: boolean; icon: React.ElementType }
> = {
  monitoring: {
    label: "Heartbeat active",
    sub: "Everything checks in on schedule",
    color: "var(--eh-teal-500)",
    ring: "var(--eh-teal-100)",
    pulsing: true,
    icon: Heart,
  },
  awaiting: {
    label: "Awaiting check-in",
    sub: "Waiting for the next response",
    color: "var(--eh-spark-500)",
    ring: "var(--eh-spark-200)",
    pulsing: true,
    icon: Heart,
  },
  missed: {
    label: "Heartbeat missed",
    sub: "No response received in time",
    color: "var(--eh-danger-600)",
    ring: "var(--eh-danger-100)",
    pulsing: true,
    icon: AlertTriangle,
  },
  escalated: {
    label: "Escalating now",
    sub: "Notifying the next contact",
    color: "var(--eh-danger-600)",
    ring: "var(--eh-danger-100)",
    pulsing: true,
    icon: AlertTriangle,
  },
  "confirmed-safe": {
    label: "Confirmed safe",
    sub: "Session closed, no action needed",
    color: "var(--eh-safe-600)",
    ring: "var(--eh-safe-100)",
    pulsing: false,
    icon: CheckCircle2,
  },
};

const SIZE_MAP = {
  sm: { outer: 72, icon: 20 },
  md: { outer: 104, icon: 28 },
  lg: { outer: 152, icon: 40 },
};

function formatSeconds(s: number) {
  if (s < 60) return `${Math.round(s)}s ago`;
  const m = Math.floor(s / 60);
  return `${m}m ago`;
}

export default function HeartbeatIndicator({
  status,
  lastCheckInSeconds,
  intervalSeconds,
  size = "md",
  className = "",
}: HeartbeatIndicatorProps) {
  const cfg = STATUS_CONFIG[status];
  const dims = SIZE_MAP[size];
  const Icon = cfg.icon;

  return (
    <div className={`flex flex-col items-center gap-3 ${className}`}>
      <div className="relative flex items-center justify-center" style={{ width: dims.outer, height: dims.outer }}>
        {cfg.pulsing && (
          <>
            <span
              className="absolute inset-0 rounded-full animate-ping"
              style={{ background: cfg.color, opacity: 0.18 }}
            />
            <span
              className="absolute rounded-full animate-ping"
              style={{
                inset: dims.outer * 0.12,
                background: cfg.color,
                opacity: 0.22,
                animationDelay: "0.35s",
              }}
            />
          </>
        )}
        <span
          className="absolute rounded-full"
          style={{ inset: dims.outer * 0.24, background: cfg.ring }}
        />
        <span
          className="relative flex items-center justify-center rounded-full"
          style={{
            width: dims.outer * 0.46,
            height: dims.outer * 0.46,
            background: cfg.color,
          }}
        >
          <Icon size={dims.icon} color="var(--eh-surface, #fff)" strokeWidth={2.25} />
        </span>
      </div>

      <div className="text-center">
        <p className="text-sm font-semibold" style={{ color: "var(--eh-ink-900)" }}>
          {cfg.label}
        </p>
        <p className="text-xs mt-0.5" style={{ color: "var(--eh-ink-600)" }}>
          {cfg.sub}
        </p>
        {(lastCheckInSeconds !== undefined || intervalSeconds !== undefined) && (
          <p className="text-[11px] mt-1.5 font-mono tracking-tight" style={{ color: "var(--eh-ink-600)" }}>
            {lastCheckInSeconds !== undefined && `Last check-in: ${formatSeconds(lastCheckInSeconds)}`}
            {lastCheckInSeconds !== undefined && intervalSeconds !== undefined && "  ·  "}
            {intervalSeconds !== undefined && `Every ${intervalSeconds}s`}
          </p>
        )}
      </div>
    </div>
  );
}
