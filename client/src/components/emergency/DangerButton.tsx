"use client";

import React, { useState, useCallback } from "react";
import { ShieldAlert, Loader2 } from "lucide-react";

export interface DangerButtonProps {
  onActivate: () => Promise<void>;
  disabled?: boolean;
  className?: string;
}

/**
 * DangerButton — the core SOS trigger.
 *
 * Design goals (panic/stress use-case):
 * - Massive touch target (min 180px diameter on mobile)
 * - Single, unmissable call-to-action — nothing else competes visually
 * - Pulsing ring to draw the eye instantly
 * - --eh-danger-600 used CORRECTLY: only because tapping this initiates a live danger state
 * - Hold-to-confirm pattern (1.5s press) prevents accidental triggers
 * - Accessible: role=button, aria-label, aria-busy, keyboard support
 */

const HOLD_DURATION_MS = 1500;

export default function DangerButton({
  onActivate,
  disabled = false,
  className = "",
}: DangerButtonProps) {
  const [isHolding, setIsHolding] = useState(false);
  const [progress, setProgress] = useState(0); // 0–100
  const [isActivating, setIsActivating] = useState(false);
  const timerRef = React.useRef<ReturnType<typeof setInterval> | null>(null);
  const startRef = React.useRef<number>(0);

  const startHold = useCallback(() => {
    if (disabled || isActivating) return;
    startRef.current = Date.now();
    setIsHolding(true);
    setProgress(0);

    timerRef.current = setInterval(() => {
      const elapsed = Date.now() - startRef.current;
      const pct = Math.min((elapsed / HOLD_DURATION_MS) * 100, 100);
      setProgress(pct);

      if (pct >= 100) {
        clearInterval(timerRef.current!);
        setIsHolding(false);
        setIsActivating(true);
        onActivate().finally(() => setIsActivating(false));
      }
    }, 16);
  }, [disabled, isActivating, onActivate]);

  const cancelHold = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    setIsHolding(false);
    setProgress(0);
  }, []);

  // SVG ring progress
  const radius = 86;
  const circ = 2 * Math.PI * radius;
  const dashOffset = circ - (progress / 100) * circ;

  return (
    <div className={`flex flex-col items-center gap-5 select-none ${className}`}>
      {/* Outer pulsing rings — draw the eye to the button */}
      <div className="relative flex items-center justify-center" style={{ width: 220, height: 220 }}>
        {/* Outermost ambient ring */}
        <span
          className="absolute inset-0 rounded-full"
          style={{
            background: "var(--eh-danger-600)",
            opacity: 0.08,
            animation: "eh-danger-ring-1 2.4s ease-in-out infinite",
          }}
          aria-hidden="true"
        />
        {/* Mid pulsing ring */}
        <span
          className="absolute rounded-full"
          style={{
            inset: 14,
            background: "var(--eh-danger-600)",
            opacity: 0.12,
            animation: "eh-danger-ring-2 2.4s ease-in-out infinite 0.6s",
          }}
          aria-hidden="true"
        />

        {/* SVG progress ring — fills as user holds */}
        <svg
          className="absolute inset-0 -rotate-90"
          width="220"
          height="220"
          viewBox="0 0 220 220"
          aria-hidden="true"
        >
          {/* Track */}
          <circle
            cx="110"
            cy="110"
            r={radius}
            fill="none"
            stroke="var(--eh-danger-100)"
            strokeWidth="5"
          />
          {/* Progress fill */}
          {isHolding && (
            <circle
              cx="110"
              cy="110"
              r={radius}
              fill="none"
              stroke="var(--eh-danger-600)"
              strokeWidth="5"
              strokeLinecap="round"
              strokeDasharray={circ}
              strokeDashoffset={dashOffset}
              style={{ transition: "stroke-dashoffset 0.016s linear" }}
            />
          )}
        </svg>

        {/* Inner background ring */}
        <span
          className="absolute rounded-full"
          style={{
            inset: 28,
            background: "var(--eh-danger-100)",
          }}
          aria-hidden="true"
        />

        {/* The button itself */}
        <button
          type="button"
          aria-label="Activate Danger Mode — hold for 1.5 seconds to confirm"
          aria-busy={isActivating}
          aria-disabled={disabled || isActivating}
          onPointerDown={startHold}
          onPointerUp={cancelHold}
          onPointerLeave={cancelHold}
          onPointerCancel={cancelHold}
          onKeyDown={(e) => {
            if (e.key === " " || e.key === "Enter") startHold();
          }}
          onKeyUp={(e) => {
            if (e.key === " " || e.key === "Enter") cancelHold();
          }}
          className="relative flex flex-col items-center justify-center rounded-full transition-transform"
          style={{
            width: 144,
            height: 144,
            background: disabled || isActivating
              ? "var(--eh-ink-600)"
              : "var(--eh-danger-600)",
            color: "var(--eh-surface, #fff)",
            boxShadow: isHolding
              ? "0 0 0 8px rgba(194, 59, 59, 0.25), 0 8px 40px rgba(194, 59, 59, 0.45)"
              : "0 4px 24px rgba(194, 59, 59, 0.35)",
            transform: isHolding ? "scale(0.96)" : "scale(1)",
            transition: "transform 0.1s, box-shadow 0.2s",
            cursor: disabled || isActivating ? "not-allowed" : "pointer",
            WebkitTapHighlightColor: "transparent",
          }}
        >
          {isActivating ? (
            <Loader2 size={40} className="animate-spin" />
          ) : (
            <ShieldAlert size={40} strokeWidth={1.75} />
          )}
          <span
            className="mt-2 text-[13px] font-bold uppercase tracking-widest"
            style={{ fontFamily: "var(--eh-font-sans)" }}
          >
            {isActivating ? "Activating…" : isHolding ? "Hold…" : "SOS"}
          </span>
        </button>
      </div>

      {/* Label below button */}
      <div className="text-center px-4">
        <p
          className="text-sm font-semibold"
          style={{ color: "var(--eh-ink-900)" }}
        >
          {isActivating
            ? "Starting emergency session…"
            : isHolding
            ? `Hold for ${((HOLD_DURATION_MS - (progress / 100) * HOLD_DURATION_MS) / 1000).toFixed(1)}s…`
            : "Hold to activate Danger Mode"}
        </p>
        <p className="text-xs mt-1" style={{ color: "var(--eh-ink-600)" }}>
          Alerts contacts · Starts GPS tracking · Begins recording
        </p>
      </div>

      {/* Keyframes injected inline for self-containment */}
      <style>{`
        @keyframes eh-danger-ring-1 {
          0%, 100% { transform: scale(1); opacity: 0.08; }
          50% { transform: scale(1.06); opacity: 0.14; }
        }
        @keyframes eh-danger-ring-2 {
          0%, 100% { transform: scale(1); opacity: 0.12; }
          50% { transform: scale(1.1); opacity: 0.06; }
        }
      `}</style>
    </div>
  );
}
