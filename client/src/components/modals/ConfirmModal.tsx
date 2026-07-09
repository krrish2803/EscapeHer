"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";

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
  const accent = VARIANT_STYLE[variant];

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-6"
          role="presentation"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-[var(--eh-ink-900)]/45 backdrop-blur-[4px]"
            onClick={onCancel}
            aria-hidden="true"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 8 }}
            transition={{ type: "spring", stiffness: 380, damping: 30 }}
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="eh-confirm-title"
            className="relative w-full max-w-sm rounded-3xl p-6 shadow-2xl z-10 border border-[var(--eh-mist-200)]"
            style={{ background: "var(--eh-surface, #fff)" }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 id="eh-confirm-title" className="text-base font-bold" style={{ color: "var(--eh-ink-900)" }}>
              {title}
            </h2>
            {description && (
              <p className="text-sm mt-2 leading-relaxed" style={{ color: "var(--eh-ink-600)" }}>
                {description}
              </p>
            )}
            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={onCancel}
                className="flex-1 rounded-2xl py-3 text-sm font-semibold transition-all duration-200 hover:bg-[var(--eh-mist-100)] active:scale-98"
                style={{ 
                  background: "var(--eh-mist-50)", 
                  color: "var(--eh-ink-900)",
                  border: "1px solid var(--eh-mist-200)"
                }}
              >
                {cancelLabel}
              </button>
              <button
                type="button"
                onClick={onConfirm}
                className="flex-1 rounded-2xl py-3 text-sm font-semibold transition-all duration-200 hover:brightness-105 active:scale-98 text-white"
                style={{ 
                  background: accent,
                  border: "none"
                }}
              >
                {confirmLabel}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
