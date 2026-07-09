"use client";

import React from "react";
import { PhoneIncoming, Navigation, ShieldAlert, Volume2, CheckCircle2 } from "lucide-react";
import HeartbeatIndicator, { HeartbeatStatus } from "../heartbeat/HeartbeatIndicator";

export interface EmergencyModalProps {
  isOpen: boolean;
  heartbeatStatus: HeartbeatStatus;
  elapsedSeconds: number;
  onFakeCall: () => void;
  onSafeRoute: () => void;
  onCallPolice: () => void;
  onSiren: () => void;
  onConfirmSafe: () => void;
}

function formatElapsed(s: number) {
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec.toString().padStart(2, "0")}`;
}

const ACTIONS = [
  { key: "fakeCall", label: "Fake call", icon: PhoneIncoming },
  { key: "safeRoute", label: "Smart safe route", icon: Navigation },
  { key: "callPolice", label: "Call police", icon: ShieldAlert },
  { key: "siren", label: "Emergency siren", icon: Volume2 },
] as const;

export default function EmergencyModal({
  isOpen,
  heartbeatStatus,
  elapsedSeconds,
  onFakeCall,
  onSafeRoute,
  onCallPolice,
  onSiren,
  onConfirmSafe,
}: EmergencyModalProps) {
  if (!isOpen) return null;

  const handlers: Record<(typeof ACTIONS)[number]["key"], () => void> = {
    fakeCall: onFakeCall,
    safeRoute: onSafeRoute,
    callPolice: onCallPolice,
    siren: onSiren,
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Active emergency session"
      className="fixed inset-0 z-50 flex flex-col"
      style={{ background: "var(--eh-mist-50)" }}
    >
      <div className="flex flex-col items-center gap-2 pt-10 pb-6 px-6">
        <HeartbeatIndicator status={heartbeatStatus} size="md" />
        <p className="text-xs font-mono mt-1" style={{ color: "var(--eh-ink-600)" }}>
          Session active · {formatElapsed(elapsedSeconds)}
        </p>
      </div>

      <div className="flex-1 px-6">
        <p className="text-xs font-semibold uppercase tracking-wide mb-3" style={{ color: "var(--eh-ink-600)" }}>
          What you need is right here
        </p>
        <div className="grid grid-cols-2 gap-3">
          {ACTIONS.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              type="button"
              onClick={handlers[key]}
              className="flex flex-col items-start gap-3 rounded-2xl p-4 text-left transition-transform active:scale-[0.98]"
              style={{ background: "var(--eh-surface, #fff)", border: "1px solid var(--eh-mist-200)" }}
            >
              <span
                className="flex h-10 w-10 items-center justify-center rounded-full"
                style={{ background: "var(--eh-teal-100)" }}
              >
                <Icon size={20} color="var(--eh-teal-700)" />
              </span>
              <span className="text-sm font-semibold" style={{ color: "var(--eh-ink-900)" }}>
                {label}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="p-6">
        <button
          type="button"
          onClick={onConfirmSafe}
          className="flex w-full items-center justify-center gap-2 rounded-2xl py-4 text-base font-semibold"
          style={{ background: "var(--eh-safe-600)", color: "var(--eh-surface, #fff)" }}
        >
          <CheckCircle2 size={20} />
          I&apos;m safe
        </button>
        <p className="text-center text-[11px] mt-2" style={{ color: "var(--eh-ink-600)" }}>
          This ends the session and lets your trusted contacts know.
        </p>
      </div>
    </div>
  );
}
