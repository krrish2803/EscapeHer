"use client";

import React from "react";
import HeartbeatIndicator, {
  type HeartbeatStatus,
} from "@/components/heartbeat/HeartbeatIndicator";

export interface HeartbeatStatusProps {
  status: HeartbeatStatus;
  lastCheckInSeconds?: number;
  intervalSeconds?: number;
  className?: string;
}

/**
 * HeartbeatStatus — thin wrapper around Kamaljit's HeartbeatIndicator.
 * Adds a contextual banner below the indicator for the dashboard/emergency
 * screens so it can be slotted into different layouts without repetition.
 */
export default function HeartbeatStatus({
  status,
  lastCheckInSeconds,
  intervalSeconds = 30,
  className = "",
}: HeartbeatStatusProps) {
  const isAlert = status === "missed" || status === "escalated";

  return (
    <div
      className={`rounded-3xl p-8 flex flex-col items-center gap-6 border transition-all duration-500 shadow-sm ${
        isAlert
          ? "border-[var(--eh-danger-600)] bg-[var(--eh-danger-100)]/20 shadow-[0_0_35px_rgba(226,114,114,0.15)]"
          : "border-[var(--eh-mist-200)] bg-[var(--eh-surface)] hover:border-[var(--eh-teal-500)]/25"
      } ${className}`}
    >
      <HeartbeatIndicator
        status={status}
        lastCheckInSeconds={lastCheckInSeconds}
        intervalSeconds={intervalSeconds}
        size="lg"
      />
      {isAlert && (
        <p
          className="text-xs text-center font-bold animate-pulse tracking-wide uppercase"
          style={{ color: "var(--eh-danger-600)" }}
        >
          Automatic escalation triggered — notifying next contact.
        </p>
      )}
    </div>
  );
}
