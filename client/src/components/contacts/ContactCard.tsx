"use client";

import React from "react";
import { Phone, MessageCircle, MoreVertical } from "lucide-react";

export type ContactAlertStatus = "idle" | "notified" | "delivered" | "pending";

export interface ContactCardProps {
  name: string;
  relation: string;
  phone: string;
  avatarUrl?: string;
  alertStatus?: ContactAlertStatus;
  onCall?: () => void;
  onMessage?: () => void;
  onMore?: () => void;
  className?: string;
}

const STATUS_LABEL: Record<ContactAlertStatus, { text: string; color: string; bg: string }> = {
  idle: { text: "Not alerted", color: "var(--eh-ink-600)", bg: "var(--eh-mist-200)" },
  pending: { text: "Sending…", color: "var(--eh-spark-500)", bg: "var(--eh-spark-200)" },
  notified: { text: "Notified", color: "var(--eh-teal-500)", bg: "var(--eh-teal-100)" },
  delivered: { text: "Confirmed seen", color: "var(--eh-safe-600)", bg: "var(--eh-safe-100)" },
};

function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join("");
}

export default function ContactCard({
  name,
  relation,
  phone,
  avatarUrl,
  alertStatus = "idle",
  onCall,
  onMessage,
  onMore,
  className = "",
}: ContactCardProps) {
  const status = STATUS_LABEL[alertStatus];

  return (
    <div
      className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 rounded-2xl p-4 border border-[var(--eh-mist-200)] bg-[var(--eh-surface)] hover:border-[var(--eh-teal-500)]/25 hover:shadow-sm transition-all duration-300 ${className}`}
    >
      <div className="flex items-center gap-4 w-full sm:w-auto flex-1 min-w-0">
        {avatarUrl ? (
          <img src={avatarUrl} alt="" className="h-12 w-12 rounded-full object-cover shrink-0 ring-2 ring-[var(--eh-teal-100)]" />
        ) : (
          <span
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-sm font-bold shadow-inner"
            style={{ background: "var(--eh-teal-100)", color: "var(--eh-teal-700)" }}
          >
            {initials(name)}
          </span>
        )}

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <p className="text-sm font-bold truncate" style={{ color: "var(--eh-ink-900)" }}>
              {name}
            </p>
            <span
              className="text-[9px] font-bold px-2 py-0.5 rounded-full shrink-0 uppercase tracking-wide"
              style={{ color: status.color, background: status.bg }}
            >
              {status.text}
            </span>
          </div>
          <p className="text-xs truncate mt-0.5" style={{ color: "var(--eh-ink-600)" }}>
            {relation} · {phone}
          </p>
        </div>
      </div>

      <div className="flex items-center justify-end gap-1.5 w-full sm:w-auto border-t border-[var(--eh-mist-200)] pt-2.5 sm:border-t-0 sm:pt-0 shrink-0">
        <button
          type="button"
          onClick={onCall}
          aria-label={`Call ${name}`}
          className="rounded-xl transition-all duration-200 hover:bg-[var(--eh-teal-100)] text-[var(--eh-teal-700)] active:scale-95 flex h-11 w-11 items-center justify-center"
        >
          <Phone size={15} />
        </button>
        <button
          type="button"
          onClick={onMessage}
          aria-label={`Message ${name}`}
          className="rounded-xl transition-all duration-200 hover:bg-[var(--eh-teal-100)] text-[var(--eh-teal-700)] active:scale-95 flex h-11 w-11 items-center justify-center"
        >
          <MessageCircle size={15} />
        </button>
        <button
          type="button"
          onClick={onMore}
          aria-label={`More options for ${name}`}
          className="rounded-xl transition-all duration-200 hover:bg-[var(--eh-mist-50)] text-[var(--eh-ink-600)] active:scale-95 flex h-11 w-11 items-center justify-center"
        >
          <MoreVertical size={15} />
        </button>
      </div>
    </div>
  );
}
