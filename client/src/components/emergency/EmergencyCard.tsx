"use client";

import React from "react";
import { AlertTriangle, Clock, Radio, Users } from "lucide-react";
import type { AlertLevel } from "@/lib/emergencyStub";

export interface EmergencyCardProps {
  sessionId: string;
  startedAt: Date;
  alertLevel: AlertLevel;
  elapsedSeconds: number;
  contactsAlerted: number;
  isRecording: boolean;
  className?: string;
}

const ALERT_LEVEL_LABEL: Record<AlertLevel, string> = {
  1: "Level 1 — Friends notified",
  2: "Level 2 — Family notified",
  3: "Level 3 — Emergency contacts",
  4: "Level 4 — Services alerted",
};

function formatElapsed(s: number) {
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m.toString().padStart(2, "0")}:${sec.toString().padStart(2, "0")}`;
}

export default function EmergencyCard({
  sessionId,
  startedAt,
  alertLevel,
  elapsedSeconds,
  contactsAlerted,
  isRecording,
  className = "",
}: EmergencyCardProps) {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div
      className={`rounded-2xl overflow-hidden ${className}`}
      style={{
        background: "var(--eh-danger-100)",
        border: "1px solid var(--eh-danger-600)",
      }}
      role="status"
      aria-label="Active emergency session status"
      aria-live="polite"
      data-prev-mounted={mounted ? "true" : "false"}
    >
      {/* Header bar */}
      <div
        className="flex items-center gap-2 px-4 py-3"
        style={{ background: "var(--eh-danger-600)" }}
      >
        <AlertTriangle size={16} color="var(--eh-surface, #fff)" strokeWidth={2.5} />
        <span
          className="text-sm font-bold uppercase tracking-wide flex-1"
          style={{ color: "var(--eh-surface, #fff)" }}
        >
          Emergency Active
        </span>
        {isRecording && (
          <span className="flex items-center gap-1">
            {/* Live recording dot */}
            <span className="relative flex h-2 w-2">
              <span
                className="absolute inline-flex h-full w-full rounded-full animate-ping"
                style={{ background: "rgba(255,255,255,0.7)" }}
              />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-white" />
            </span>
            <span className="text-[11px] font-semibold" style={{ color: "rgba(255,255,255,0.9)" }}>
              REC
            </span>
          </span>
        )}
      </div>

      {/* Body */}
      <div className="p-4 grid grid-cols-2 gap-3">
        {/* Elapsed */}
        <div
          className="rounded-xl p-3 flex flex-col gap-1"
          style={{ background: "var(--eh-surface, #fff)" }}
        >
          <Clock size={14} color="var(--eh-ink-600)" />
          <span
            className="text-lg font-bold font-mono-eh"
            style={{ color: "var(--eh-danger-600)", fontFamily: "var(--eh-font-mono)" }}
          >
            {formatElapsed(elapsedSeconds)}
          </span>
          <span className="text-[11px]" style={{ color: "var(--eh-ink-600)" }}>
            Session duration
          </span>
        </div>

        {/* Contacts alerted */}
        <div
          className="rounded-xl p-3 flex flex-col gap-1"
          style={{ background: "var(--eh-surface, #fff)" }}
        >
          <Users size={14} color="var(--eh-ink-600)" />
          <span
            className="text-lg font-bold"
            style={{ color: "var(--eh-ink-900)", fontFamily: "var(--eh-font-sans)" }}
          >
            {contactsAlerted}
          </span>
          <span className="text-[11px]" style={{ color: "var(--eh-ink-600)" }}>
            Contacts alerted
          </span>
        </div>

        {/* Alert level — spans full width */}
        <div
          className="col-span-2 rounded-xl p-3 flex items-center gap-3"
          style={{ background: "var(--eh-surface, #fff)" }}
        >
          <span
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full"
            style={{ background: "var(--eh-danger-100)" }}
          >
            <Radio size={16} color="var(--eh-danger-600)" />
          </span>
          <div>
            <p className="text-xs" style={{ color: "var(--eh-ink-600)" }}>
              Alert escalation
            </p>
            <p className="text-sm font-semibold" style={{ color: "var(--eh-ink-900)" }}>
              {ALERT_LEVEL_LABEL[alertLevel]}
            </p>
          </div>
        </div>
      </div>

      {/* Session ID — forensic feel */}
      <div className="px-4 pb-3">
        <p
          className="text-[10px]"
          style={{
            color: "var(--eh-ink-600)",
            fontFamily: "var(--eh-font-mono)",
            opacity: 0.7,
          }}
        >
          Session ID: {sessionId} · Started: {mounted ? startedAt.toLocaleTimeString() : ""}
        </p>
      </div>
    </div>
  );
}
