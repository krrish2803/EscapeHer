"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import EmergencyModal from "@/components/modals/EmergencyModal";
import EmergencyCard from "@/components/emergency/EmergencyCard";
import LiveMap from "@/components/maps/LiveMap";
import ConfirmModal from "@/components/modals/ConfirmModal";
import { useEmergency } from "@/lib/emergencyStub";
// TODO: replace with Kamal's real implementation

export default function EmergencyPage() {
  const router = useRouter();
  const { isActive, session, confirmSafe } = useEmergency();
  const [elapsed, setElapsed] = useState(0);
  const [showSirenActive, setShowSirenActive] = useState(false);
  const [showConfirmSafe, setShowConfirmSafe] = useState(false);

  // Live elapsed timer
  useEffect(() => {
    if (!isActive || !session) return;
    const interval = setInterval(() => {
      const diff = Math.floor((Date.now() - session.startedAt.getTime()) / 1000);
      setElapsed(diff);
    }, 1000);
    return () => clearInterval(interval);
  }, [isActive, session]);

  // If no active session, redirect to danger-mode page
  // In prod, EmergencyContext (Kamal) will have already set session from backend
  useEffect(() => {
    // TODO: Uncomment when real EmergencyContext is in place
    // if (!isActive) router.replace("/danger-mode");
  }, [isActive, router]);

  // --- Action handlers ---
  const handleFakeCall = () => {
    // TODO: wire to FakeCall screen/modal once built
    // For now, simulate with a phone call to a safe number
    console.log("[emergency] fake call triggered");
    router.push("/emergency/fake-call");
  };

  const handleSafeRoute = () => {
    // TODO: wire SafeRoute component + Google Maps
    console.log("[emergency] safe route triggered");
    router.push("/emergency/safe-route");
  };

  const handleCallPolice = () => {
    // TODO: replace with tel: link to local emergency number
    window.location.href = "tel:100";
  };

  const handleSiren = () => {
    setShowSirenActive(true);
    // TODO: Kamal's AudioContext siren implementation
    setTimeout(() => setShowSirenActive(false), 5000);
  };

  const handleConfirmSafe = () => {
    setShowConfirmSafe(true);
  };

  const handleConfirmSafeConfirmed = async () => {
    setShowConfirmSafe(false);
    await confirmSafe();
    router.replace("/dashboard");
  };

  // Use real session data; fall back to demo data for local dev
  const demoSession = {
    sessionId: session?.sessionId ?? "demo-001",
    startedAt: session?.startedAt ?? new Date("2026-07-08T22:14:03.000Z"),
    alertLevel: session?.alertLevel ?? 1,
    heartbeatStatus: session?.heartbeatStatus ?? "monitoring",
    latitude: session?.latitude ?? 28.6139,
    longitude: session?.longitude ?? 77.209,
    accuracyMeters: session?.accuracyMeters ?? 12,
    isRecording: session?.isRecording ?? true,
  } as const;

  return (
    <main
      className="min-h-dvh flex flex-col"
      style={{ background: "var(--eh-mist-50)" }}
      aria-label="Active emergency session"
    >
      {/* Live map strip at top (wrapped — not rebuilt) */}
      <LiveMap
        latitude={demoSession.latitude}
        longitude={demoSession.longitude}
        accuracyMeters={demoSession.accuracyMeters}
        lastUpdatedSeconds={elapsed > 0 ? 3 : undefined}
        isLive={true}
        className="rounded-none border-x-0 border-t-0"
      >
        {/* TODO: pass real <GoogleMap> here as children once Krrish wires Maps API */}
      </LiveMap>

      {/* Emergency status card */}
      <div className="px-4 pt-4">
        <EmergencyCard
          sessionId={demoSession.sessionId}
          startedAt={demoSession.startedAt}
          alertLevel={demoSession.alertLevel}
          elapsedSeconds={elapsed}
          contactsAlerted={2}
          isRecording={demoSession.isRecording}
        />
      </div>

      {/* Escape Assistant modal — always open on this screen */}
      <EmergencyModal
        isOpen={true}
        heartbeatStatus={demoSession.heartbeatStatus}
        elapsedSeconds={elapsed}
        onFakeCall={handleFakeCall}
        onSafeRoute={handleSafeRoute}
        onCallPolice={handleCallPolice}
        onSiren={handleSiren}
        onConfirmSafe={handleConfirmSafe}
      />

      {/* Siren active overlay */}
      {showSirenActive && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center"
          style={{ background: "color-mix(in srgb, var(--eh-danger-600) 85%, transparent)" }}
          aria-live="assertive"
          aria-label="Emergency siren active"
        >
          <div className="text-center">
            <div
              className="mx-auto mb-4 h-20 w-20 rounded-full animate-ping"
              style={{ background: "color-mix(in srgb, var(--eh-surface, #fff) 30%, transparent)" }}
            />
            <p className="text-2xl font-bold text-white">🚨 Siren Active</p>
            <p className="text-sm text-white/80 mt-2">Auto-stops in 5 seconds</p>
          </div>
        </div>
      )}

      {/* Confirm safe modal */}
      <ConfirmModal
        isOpen={showConfirmSafe}
        title="Are you safe?"
        description="This will end your emergency session and notify all your contacts that you're safe."
        confirmLabel="Yes, I'm safe"
        cancelLabel="Not yet"
        variant="safe"
        onConfirm={handleConfirmSafeConfirmed}
        onCancel={() => setShowConfirmSafe(false)}
      />
    </main>
  );
}
