"use client";

import React from "react";
import { UserPlus, ShieldOff } from "lucide-react";
import ContactCard, { ContactAlertStatus } from "./ContactCard";

export interface ContactListItem {
  id: string;
  name: string;
  relation: string;
  phone: string;
  avatarUrl?: string;
  alertStatus?: ContactAlertStatus;
}

export interface ContactListProps {
  contacts: ContactListItem[];
  onCall?: (id: string) => void;
  onMessage?: (id: string) => void;
  onMore?: (id: string) => void;
  onAddContact?: () => void;
  className?: string;
}

export default function ContactList({
  contacts,
  onCall,
  onMessage,
  onMore,
  onAddContact,
  className = "",
}: ContactListProps) {
  if (contacts.length === 0) {
    return (
      <div
        className={`flex flex-col items-center gap-3 rounded-2xl p-8 text-center ${className}`}
        style={{ background: "var(--eh-mist-50)", border: "1px dashed var(--eh-mist-200)" }}
      >
        <ShieldOff size={28} color="var(--eh-ink-600)" />
        <div>
          <p className="text-sm font-semibold" style={{ color: "var(--eh-ink-900)" }}>
            No trusted contacts yet
          </p>
          <p className="text-xs mt-1" style={{ color: "var(--eh-ink-600)" }}>
            Add someone who should be alerted the moment Danger Mode starts.
          </p>
        </div>
        <button
          type="button"
          onClick={onAddContact}
          className="mt-1 flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold"
          style={{ background: "var(--eh-teal-500)", color: "var(--eh-surface, #fff)" }}
        >
          <UserPlus size={16} />
          Add trusted contact
        </button>
      </div>
    );
  }

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      {contacts.map((c) => (
        <ContactCard
          key={c.id}
          name={c.name}
          relation={c.relation}
          phone={c.phone}
          avatarUrl={c.avatarUrl}
          alertStatus={c.alertStatus}
          onCall={() => onCall?.(c.id)}
          onMessage={() => onMessage?.(c.id)}
          onMore={() => onMore?.(c.id)}
        />
      ))}
      <button
        type="button"
        onClick={onAddContact}
        className="mt-1 flex items-center justify-center gap-1.5 rounded-2xl py-3 text-sm font-semibold transition-colors hover:bg-[var(--eh-mist-50)]"
        style={{ border: "1px dashed var(--eh-mist-200)", color: "var(--eh-teal-700)" }}
      >
        <UserPlus size={16} />
        Add trusted contact
      </button>
    </div>
  );
}
