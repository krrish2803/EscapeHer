"use client";

import React, { useState } from "react";
import { User, Phone, Heart, Loader2 } from "lucide-react";

export interface ContactFormData {
  name: string;
  phone: string;
  relation: string;
}

interface ContactFormProps {
  initial?: Partial<ContactFormData>;
  onSubmit: (data: ContactFormData) => Promise<void>;
  onCancel?: () => void;
  submitLabel?: string;
}

const RELATION_OPTIONS = [
  "Sister", "Brother", "Mother", "Father", "Friend",
  "Partner", "Colleague", "Neighbour", "Other",
];

export default function ContactForm({
  initial = {},
  onSubmit,
  onCancel,
  submitLabel = "Save contact",
}: ContactFormProps) {
  const [name, setName] = useState(initial.name ?? "");
  const [phone, setPhone] = useState(initial.phone ?? "");
  const [relation, setRelation] = useState(initial.relation ?? "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!name.trim() || !phone.trim()) {
      setError("Name and phone number are required.");
      return;
    }
    setLoading(true);
    try {
      await onSubmit({ name: name.trim(), phone: phone.trim(), relation });
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to save contact.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4" aria-label="Add trusted contact">
      {error && (
        <div
          className="rounded-xl px-4 py-3 text-sm"
          style={{ background: "var(--eh-danger-100)", color: "var(--eh-danger-600)", border: "1px solid var(--eh-danger-600)" }}
          role="alert"
        >
          {error}
        </div>
      )}

      {/* Name */}
      <div className="space-y-1.5">
        <label htmlFor="contact-name" className="block text-sm font-medium" style={{ color: "var(--eh-ink-900)" }}>
          Contact name
        </label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2"><User size={16} color="var(--eh-ink-600)" /></span>
          <input
            id="contact-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="eh-input pl-9"
            placeholder="Full name"
            required
          />
        </div>
      </div>

      {/* Phone */}
      <div className="space-y-1.5">
        <label htmlFor="contact-phone" className="block text-sm font-medium" style={{ color: "var(--eh-ink-900)" }}>
          Phone number
        </label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2"><Phone size={16} color="var(--eh-ink-600)" /></span>
          <input
            id="contact-phone"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="eh-input pl-9"
            placeholder="+91 98765 43210"
            required
          />
        </div>
      </div>

      {/* Relation */}
      <div className="space-y-1.5">
        <label htmlFor="contact-relation" className="block text-sm font-medium" style={{ color: "var(--eh-ink-900)" }}>
          Relationship <span className="text-xs font-normal" style={{ color: "var(--eh-ink-600)" }}>(optional)</span>
        </label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2"><Heart size={16} color="var(--eh-ink-600)" /></span>
          <select
            id="contact-relation"
            value={relation}
            onChange={(e) => setRelation(e.target.value)}
            className="eh-input pl-9 appearance-none"
          >
            <option value="">Select relationship</option>
            {RELATION_OPTIONS.map((r) => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-1">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="eh-btn-ghost flex-1"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          disabled={loading}
          className="eh-btn-primary flex-1"
          aria-busy={loading}
        >
          {loading ? (
            <><Loader2 size={16} className="animate-spin" />Saving…</>
          ) : submitLabel}
        </button>
      </div>
    </form>
  );
}
