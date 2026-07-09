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
      className={`flex items-center gap-3 rounded-2xl p-3 ${className}`}
      style={{ background: "var(--eh-surface, #fff)", border: "1px solid var(--eh-mist-200)" }}
    >
      {avatarUrl ? (
        <img src={avatarUrl} alt="" className="h-11 w-11 rounded-full object-cover shrink-0" />
      ) : (
        <span
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-sm font-semibold"
          style={{ background: "var(--eh-teal-100)", color: "var(--eh-teal-700)" }}
        >
          {initials(name)}
        </span>
      )}

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p className="text-sm font-semibold truncate" style={{ color: "var(--eh-ink-900)" }}>
            {name}
          </p>
          <span
            className="text-[10px] font-medium px-1.5 py-0.5 rounded-full shrink-0"
            style={{ color: status.color, background: status.bg }}
          >
            {status.text}
          </span>
        </div>
        <p className="text-xs truncate" style={{ color: "var(--eh-ink-600)" }}>
          {relation} · {phone}
        </p>
      </div>

      <div className="flex items-center gap-1 shrink-0">
        <button
          type="button"
          onClick={onCall}
          aria-label={`Call ${name}`}
          className="p-2 rounded-full transition-colors hover:bg-[var(--eh-mist-50)]"
        >
          <Phone size={16} color="var(--eh-teal-700)" />
        </button>
        <button
          type="button"
          onClick={onMessage}
          aria-label={`Message ${name}`}
          className="p-2 rounded-full transition-colors hover:bg-[var(--eh-mist-50)]"
        >
          <MessageCircle size={16} color="var(--eh-teal-700)" />
        </button>
        <button
          type="button"
          onClick={onMore}
          aria-label={`More options for ${name}`}
          className="p-2 rounded-full transition-colors hover:bg-[var(--eh-mist-50)]"
        >
          <MoreVertical size={16} color="var(--eh-ink-600)" />
        </button>
      </div>
    </div>
  );
}
