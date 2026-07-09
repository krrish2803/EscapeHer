"use client";

import React from "react";

export interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: "default" | "danger" | "safe";
  onConfirm: () => void;
  onCancel: () => void;
}

const VARIANT_STYLE: Record<NonNullable<ConfirmModalProps["variant"]>, string> = {
  default: "var(--eh-teal-500)",
  danger: "var(--eh-danger-600)",
  safe: "var(--eh-safe-600)",
};

export default function ConfirmModal({
  isOpen,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  variant = "default",
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  if (!isOpen) return null;
  const accent = VARIANT_STYLE[variant];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-6"
      style={{ background: "rgba(22, 38, 42, 0.45)" }}
      role="presentation"
      onClick={onCancel}
    >
      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="eh-confirm-title"
        className="w-full max-w-sm rounded-2xl p-6"
        style={{ background: "var(--eh-surface, #fff)" }}
        onClick={(e) => e.stopPropagation()}
      >
        <h2 id="eh-confirm-title" className="text-base font-semibold" style={{ color: "var(--eh-ink-900)" }}>
          {title}
        </h2>
        {description && (
          <p className="text-sm mt-2" style={{ color: "var(--eh-ink-600)" }}>
            {description}
          </p>
        )}
        <div className="mt-6 flex gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 rounded-xl py-2.5 text-sm font-semibold"
            style={{ background: "var(--eh-mist-50)", color: "var(--eh-ink-900)" }}
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="flex-1 rounded-xl py-2.5 text-sm font-semibold"
            style={{ background: accent, color: "var(--eh-surface, #fff)" }}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
