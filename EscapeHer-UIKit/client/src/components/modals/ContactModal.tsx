"use client";

import React, { useState } from "react";
import { X } from "lucide-react";

export interface ContactFormValues {
  name: string;
  relation: string;
  phone: string;
}

export interface ContactModalProps {
  isOpen: boolean;
  mode?: "add" | "edit";
  initialValues?: Partial<ContactFormValues>;
  onSave: (values: ContactFormValues) => void;
  onClose: () => void;
}

const inputStyle: React.CSSProperties = {
  background: "var(--eh-mist-50)",
  border: "1px solid var(--eh-mist-200)",
  color: "var(--eh-ink-900)",
};

export default function ContactModal({
  isOpen,
  mode = "add",
  initialValues,
  onSave,
  onClose,
}: ContactModalProps) {
  const [name, setName] = useState(initialValues?.name ?? "");
  const [relation, setRelation] = useState(initialValues?.relation ?? "");
  const [phone, setPhone] = useState(initialValues?.phone ?? "");

  if (!isOpen) return null;

  const canSave = name.trim().length > 0 && phone.trim().length > 0;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSave) return;
    onSave({ name: name.trim(), relation: relation.trim(), phone: phone.trim() });
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4"
      style={{ background: "rgba(22, 38, 42, 0.45)" }}
      role="presentation"
      onClick={onClose}
    >
      <form
        onSubmit={handleSubmit}
        role="dialog"
        aria-modal="true"
        aria-label={mode === "add" ? "Add trusted contact" : "Edit trusted contact"}
        className="w-full max-w-sm rounded-2xl p-6"
        style={{ background: "var(--eh-surface, #fff)" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold" style={{ color: "var(--eh-ink-900)" }}>
            {mode === "add" ? "Add trusted contact" : "Edit contact"}
          </h2>
          <button type="button" onClick={onClose} aria-label="Close" className="p-1 rounded-full hover:bg-[var(--eh-mist-50)]">
            <X size={18} color="var(--eh-ink-600)" />
          </button>
        </div>

        <div className="flex flex-col gap-3">
          <label className="text-xs font-medium" style={{ color: "var(--eh-ink-600)" }}>
            Name
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Full name"
              className="mt-1 w-full rounded-xl px-3 py-2 text-sm outline-none"
              style={inputStyle}
              required
            />
          </label>

          <label className="text-xs font-medium" style={{ color: "var(--eh-ink-600)" }}>
            Relationship
            <input
              value={relation}
              onChange={(e) => setRelation(e.target.value)}
              placeholder="Sister, friend, roommate…"
              className="mt-1 w-full rounded-xl px-3 py-2 text-sm outline-none"
              style={inputStyle}
            />
          </label>

          <label className="text-xs font-medium" style={{ color: "var(--eh-ink-600)" }}>
            Phone number
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+1 555 123 4567"
              type="tel"
              className="mt-1 w-full rounded-xl px-3 py-2 text-sm outline-none"
              style={inputStyle}
              required
            />
          </label>
        </div>

        <button
          type="submit"
          disabled={!canSave}
          className="mt-6 w-full rounded-xl py-2.5 text-sm font-semibold disabled:opacity-50"
          style={{ background: "var(--eh-teal-500)", color: "var(--eh-surface, #fff)" }}
        >
          {mode === "add" ? "Add contact" : "Save changes"}
        </button>
      </form>
    </div>
  );
}
