"use client";

/**
 * Stub EmergencyContext — replace with Kamal's real implementation.
 * TODO: replace with Kamal's real implementation
 *
 * Real interface will come from client/src/context/EmergencyContext.tsx
 * once Krrish wires backend session endpoints and Kamal wires Heartbeat logic.
 */

import React, { createContext, useContext, useState } from "react";
import type { HeartbeatStatus } from "@/components/heartbeat/HeartbeatIndicator";

export type AlertLevel = 1 | 2 | 3 | 4; // 1=Friend, 2=Family, 3=EmergencyContact, 4=Services

export interface EmergencySession {
  sessionId: string;
  startedAt: Date;
  alertLevel: AlertLevel;
  heartbeatStatus: HeartbeatStatus;
  elapsedSeconds: number;
  latitude: number;
  longitude: number;
  accuracyMeters: number;
  isRecording: boolean;
}

export interface EmergencyContextValue {
  isActive: boolean;
  session: EmergencySession | null;
  activateDangerMode: () => Promise<void>;
  confirmSafe: () => Promise<void>;
  updateHeartbeat: (status: HeartbeatStatus) => void;
}

const EmergencyContext = createContext<EmergencyContextValue | null>(null);

/** Stub provider with simulated idle state. */
export function EmergencyContextProvider({ children }: { children: React.ReactNode }) {
  const [isActive, setIsActive] = useState(false);
  const [session, setSession] = useState<EmergencySession | null>(null);

  const activateDangerMode = async () => {
    // TODO: replace with Kamal's real implementation — call Krrish's POST /api/emergency/start
    console.warn("[EmergencyContext stub] activateDangerMode — replace with real impl");
    setIsActive(true);
    setSession({
      sessionId: `stub-${Date.now()}`,
      startedAt: new Date(),
      alertLevel: 1,
      heartbeatStatus: "monitoring",
      elapsedSeconds: 0,
      latitude: 28.6139,
      longitude: 77.209,
      accuracyMeters: 12,
      isRecording: true,
    });
  };

  const confirmSafe = async () => {
    // TODO: replace with Kamal's real implementation — call Krrish's POST /api/emergency/end
    console.warn("[EmergencyContext stub] confirmSafe — replace with real impl");
    setIsActive(false);
    setSession(null);
  };

  const updateHeartbeat = (status: HeartbeatStatus) => {
    // TODO: replace with Kamal's real implementation
    if (session) setSession({ ...session, heartbeatStatus: status });
  };

  return (
    <EmergencyContext.Provider
      value={{ isActive, session, activateDangerMode, confirmSafe, updateHeartbeat }}
    >
      {children}
    </EmergencyContext.Provider>
  );
}

export function useEmergency(): EmergencyContextValue {
  const ctx = useContext(EmergencyContext);
  if (!ctx) {
    // TODO: replace with Kamal's real implementation
    return {
      isActive: false,
      session: null,
      activateDangerMode: async () => {},
      confirmSafe: async () => {},
      updateHeartbeat: () => {},
    };
  }
  return ctx;
}
