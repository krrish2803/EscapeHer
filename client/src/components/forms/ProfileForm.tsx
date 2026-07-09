"use client";

import React, { useState } from "react";
import { User, Mail, Phone, Camera, Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export default function ProfileForm() {
  const { user } = useAuth();
  const [displayName, setDisplayName] = useState(user?.name ?? "");
  const [phone, setPhone] = useState(user?.phone ?? "");
  const [email] = useState(user?.email ?? ""); // email is read-only (Firebase Auth)
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // TODO: call PATCH /api/profile (Krrish's API) and update Firebase displayName (Kamal)
    await new Promise((r) => setTimeout(r, 800)); // stub delay
    setLoading(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4" aria-label="Edit profile form">
      {/* Success banner */}
      {saved && (
        <div
          className="rounded-xl px-4 py-3 text-sm"
          style={{ background: "var(--eh-safe-100)", color: "var(--eh-safe-600)", border: "1px solid var(--eh-safe-600)" }}
          role="status"
        >
          Profile updated successfully.
        </div>
      )}

      {/* Avatar row */}
      <div className="flex items-center gap-4">
        <div className="relative">
          <span
            className="flex h-16 w-16 items-center justify-center rounded-full text-xl font-bold"
            style={{ background: "var(--eh-teal-100)", color: "var(--eh-teal-700)" }}
          >
            {displayName.charAt(0).toUpperCase() || "U"}
          </span>
          <button
            type="button"
            aria-label="Change profile photo"
            className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full"
            style={{ background: "var(--eh-teal-500)", border: "2px solid var(--eh-surface, #fff)" }}
          >
            <Camera size={12} color="var(--eh-surface, #fff)" />
          </button>
        </div>
        <div>
          <p className="text-sm font-semibold" style={{ color: "var(--eh-ink-900)" }}>
            {displayName || "Your Name"}
          </p>
          <p className="text-xs" style={{ color: "var(--eh-ink-600)" }}>
            Tap the camera to change photo
          </p>
          {/* TODO: wire to Firebase Storage (Kamal) + Krrish's avatar upload API */}
        </div>
      </div>

      {/* Full name */}
      <div className="space-y-1.5">
        <label htmlFor="profile-name" className="block text-sm font-medium" style={{ color: "var(--eh-ink-900)" }}>
          Full name
        </label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2">
            <User size={16} color="var(--eh-ink-600)" />
          </span>
          <input
            id="profile-name"
            type="text"
            autoComplete="name"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            className="eh-input pl-9"
            placeholder="Your full name"
          />
        </div>
      </div>

      {/* Email (read-only) */}
      <div className="space-y-1.5">
        <label htmlFor="profile-email" className="block text-sm font-medium" style={{ color: "var(--eh-ink-900)" }}>
          Email address <span className="text-xs font-normal" style={{ color: "var(--eh-ink-600)" }}>(read-only)</span>
        </label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2">
            <Mail size={16} color="var(--eh-ink-600)" />
          </span>
          <input
            id="profile-email"
            type="email"
            value={email}
            readOnly
            className="eh-input pl-9 opacity-60 cursor-not-allowed"
          />
        </div>
      </div>

      {/* Phone */}
      <div className="space-y-1.5">
        <label htmlFor="profile-phone" className="block text-sm font-medium" style={{ color: "var(--eh-ink-900)" }}>
          Phone number
        </label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2">
            <Phone size={16} color="var(--eh-ink-600)" />
          </span>
          <input
            id="profile-phone"
            type="tel"
            autoComplete="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="eh-input pl-9"
            placeholder="+91 98765 43210"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="eh-btn-primary w-full"
        aria-busy={loading}
      >
        {loading ? (
          <>
            <Loader2 size={16} className="animate-spin" />
            Saving…
          </>
        ) : (
          "Save changes"
        )}
      </button>
    </form>
  );
}
