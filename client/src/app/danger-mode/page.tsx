"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Shield, Wifi, Mic, MapPin, Users, ChevronLeft } from "lucide-react";
import DangerButton from "@/components/emergency/DangerButton";
import ConfirmModal from "@/components/modals/ConfirmModal";
import { useEmergency } from "@/lib/emergencyStub";
// TODO: replace with Kamal's real implementation when EmergencyContext is wired

const FEATURE_PILLS = [
  { icon: MapPin, label: "Live GPS" },
  { icon: Users, label: "Alerts contacts" },
  { icon: Mic, label: "Records audio" },
  { icon: Wifi, label: "Syncs live" },
];

export default function DangerModePage() {
  const router = useRouter();
  const { activateDangerMode } = useEmergency();
  const [showConfirm, setShowConfirm] = useState(false);
  const [pendingActivate, setPendingActivate] = useState<(() => Promise<void>) | null>(null);

  const handleSosPress = async () => {
    // Show confirm dialog before firing
    return new Promise<void>((resolve) => {
      setPendingActivate(() => async () => {
        await activateDangerMode();
        router.push("/emergency");
        resolve();
      });
      setShowConfirm(true);
    });
  };

  const handleConfirm = async () => {
    setShowConfirm(false);
    if (pendingActivate) await pendingActivate();
  };

  return (
    <main
      className="min-h-dvh flex flex-col eh-page"
      style={{ background: "var(--eh-mist-50)" }}
    >
      {/* Top nav */}
      <nav className="flex items-center gap-3 px-4 pt-safe-top pt-4 pb-2">
        <button
          type="button"
          onClick={() => router.back()}
          aria-label="Go back"
          className="flex h-10 w-10 items-center justify-center rounded-full transition-colors active:scale-95"
          style={{ background: "var(--eh-surface, #fff)", border: "1px solid var(--eh-mist-200)" }}
        >
          <ChevronLeft size={20} color="var(--eh-ink-900)" />
        </button>
        <h1
          className="text-base font-semibold"
          style={{ color: "var(--eh-ink-900)", fontFamily: "var(--eh-font-sans)" }}
        >
          Danger Mode
        </h1>
      </nav>

      {/* Hero section */}
      <section className="flex flex-1 flex-col items-center justify-center gap-8 px-6 py-8">
        {/* Status badge */}
        <div
          className="flex items-center gap-2 rounded-full px-4 py-2"
          style={{ background: "var(--eh-surface, #fff)", border: "1px solid var(--eh-mist-200)" }}
        >
          <Shield size={14} color="var(--eh-teal-500)" />
          <span className="text-xs font-semibold" style={{ color: "var(--eh-ink-900)" }}>
            System ready
          </span>
          <span className="h-1.5 w-1.5 rounded-full" style={{ background: "var(--eh-safe-600)" }} />
        </div>

        {/* Headline */}
        <div className="text-center max-w-xs">
          <h2
            className="text-2xl font-bold leading-tight"
            style={{ color: "var(--eh-ink-900)", fontFamily: "var(--eh-font-display)" }}
          >
            One press.
            <br />
            <span style={{ color: "var(--eh-teal-500)" }}>We&apos;ve got you.</span>
          </h2>
          <p className="mt-2 text-sm" style={{ color: "var(--eh-ink-600)" }}>
            Hold the button to activate your emergency session instantly.
          </p>
        </div>

        {/* THE BUTTON */}
        <DangerButton onActivate={handleSosPress} />

        {/* Feature pills */}
        <div className="flex flex-wrap justify-center gap-2 max-w-xs">
          {FEATURE_PILLS.map(({ icon: Icon, label }) => (
            <span
              key={label}
              className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium"
              style={{
                background: "var(--eh-surface, #fff)",
                border: "1px solid var(--eh-mist-200)",
                color: "var(--eh-ink-600)",
              }}
            >
              <Icon size={12} color="var(--eh-teal-500)" />
              {label}
            </span>
          ))}
        </div>
      </section>

      {/* Bottom info card */}
      <section className="px-4 pb-safe-bottom pb-6">
        <div
          className="rounded-2xl p-4"
          style={{ background: "var(--eh-surface, #fff)", border: "1px solid var(--eh-mist-200)" }}
        >
          <p
            className="text-xs font-semibold uppercase tracking-wide mb-2"
            style={{ color: "var(--eh-teal-700)" }}
          >
            What happens when you activate
          </p>
          <ol className="space-y-1.5">
            {[
              "Trusted contacts are alerted with your live location",
              "Audio recording starts immediately",
              "Heartbeat Protocol begins — automatic escalation if you stop responding",
              "Your emergency session stays open until you confirm you're safe",
            ].map((step, i) => (
              <li key={i} className="flex items-start gap-2">
                <span
                  className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full text-[10px] font-bold mt-0.5"
                  style={{ background: "var(--eh-teal-100)", color: "var(--eh-teal-700)" }}
                >
                  {i + 1}
                </span>
                <span className="text-xs" style={{ color: "var(--eh-ink-600)" }}>
                  {step}
                </span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Confirm modal */}
      <ConfirmModal
        isOpen={showConfirm}
        title="Activate Danger Mode?"
        description="This will alert your trusted contacts, start GPS tracking, and begin audio recording immediately."
        confirmLabel="Yes, activate"
        cancelLabel="Cancel"
        variant="danger"
        onConfirm={handleConfirm}
        onCancel={() => setShowConfirm(false)}
      />
    </main>
  );
}
