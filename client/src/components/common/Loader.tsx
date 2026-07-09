"use client";

import React from "react";

interface LoaderProps {
  size?: "sm" | "md" | "lg";
  fullScreen?: boolean;
  label?: string;
}

const SIZE_PX = { sm: 32, md: 48, lg: 64 };

export default function Loader({
  size = "md",
  fullScreen = false,
  label = "Loading…",
}: LoaderProps) {
  const px = SIZE_PX[size];

  const content = (
    <div
      className="flex flex-col items-center justify-center gap-3"
      role="status"
      aria-live="polite"
      aria-label={label}
    >
      <div className="relative" style={{ width: px, height: px }}>
        {/* Outer pulse ring */}
        <span
          className="absolute inset-0 rounded-full animate-ping"
          style={{ background: "var(--eh-teal-500)", opacity: 0.2 }}
        />
        {/* Inner solid circle */}
        <span
          className="absolute rounded-full"
          style={{
            inset: px * 0.22,
            background: "var(--eh-teal-500)",
          }}
        />
      </div>
      <p className="text-sm" style={{ color: "var(--eh-ink-600)" }}>
        {label}
      </p>
    </div>
  );

  if (fullScreen) {
    return (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center"
        style={{ background: "var(--eh-mist-50)" }}
      >
        {content}
      </div>
    );
  }

  return content;
}
