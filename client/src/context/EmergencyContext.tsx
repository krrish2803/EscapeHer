"use client";

import {
  createContext,
  useState,
  useCallback,
  useEffect,
  useRef,
  type ReactNode,
} from "react";
import { apiPost, apiGet } from "@/lib/api";
import { getSocket, disconnectSocket } from "@/lib/socket";
import { API_ENDPOINTS } from "@/constants/api";
import { HEARTBEAT_INTERVAL_MS } from "@/lib/constants";
import type {
  EmergencySession,
  EmergencyStatus,
  EmergencyTriggerPayload,
  HeartbeatData,
  EmergencyStats,
} from "@/types/emergency";
import type { ApiResponse } from "@/types/api";

export interface EmergencyContextValue {
  activeSession: EmergencySession | null;
  status: EmergencyStatus;
  heartbeat: HeartbeatData | null;
  stats: EmergencyStats | null;
  isTriggering: boolean;
  error: string | null;
  triggerEmergency: (payload: EmergencyTriggerPayload) => Promise<void>;
  cancelEmergency: () => Promise<void>;
  resolveEmergency: () => Promise<void>;
  startHeartbeat: () => void;
  stopHeartbeat: () => void;
  refreshStats: () => Promise<void>;
  clearError: () => void;
}

export const EmergencyContext = createContext<EmergencyContextValue | undefined>(
  undefined
);

interface EmergencyProviderProps {
  children: ReactNode;
}

export function EmergencyProvider({ children }: EmergencyProviderProps) {
  const [activeSession, setActiveSession] = useState<EmergencySession | null>(null);
  const [status, setStatus] = useState<EmergencyStatus>("idle");
  const [heartbeat, setHeartbeat] = useState<HeartbeatData | null>(null);
  const [stats, setStats] = useState<EmergencyStats | null>(null);
  const [isTriggering, setIsTriggering] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const heartbeatIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  /* ── Subscribe to socket events on mount ─────────────────────────── */
  useEffect(() => {
    const socket = getSocket();

    socket.on("emergency:update", (data: unknown) => {
      const session = data as EmergencySession;
      setActiveSession(session);
      setStatus(session.status);
    });

    socket.on("emergency:resolved", () => {
      setActiveSession(null);
      setStatus("resolved");
    });

    socket.on("heartbeat:ack", (data: unknown) => {
      setHeartbeat(data as HeartbeatData);
    });

    return () => {
      socket.off("emergency:update");
      socket.off("emergency:resolved");
      socket.off("heartbeat:ack");
    };
  }, []);

  /* ── Check for an already-active session on mount ────────────────── */
  useEffect(() => {
    async function checkActive() {
      try {
        const res = await apiGet<ApiResponse<EmergencySession>>(
          API_ENDPOINTS.EMERGENCY.ACTIVE
        );
        if (res.success && res.data) {
          setActiveSession(res.data);
          setStatus(res.data.status);
        }
      } catch {
        // No active session
      }
    }
    checkActive();
  }, []);

  /* ── Trigger Emergency ───────────────────────────────────────────── */
  const triggerEmergency = useCallback(
    async (payload: EmergencyTriggerPayload) => {
      setIsTriggering(true);
      setError(null);
      try {
        const res = await apiPost<ApiResponse<EmergencySession>>(
          API_ENDPOINTS.EMERGENCY.TRIGGER,
          payload
        );
        if (res.success && res.data) {
          setActiveSession(res.data);
          setStatus("active");

          const socket = getSocket();
          socket.emit("emergency:trigger", {
            latitude: payload.location.latitude,
            longitude: payload.location.longitude,
            severity: payload.severity || "high",
          });
        } else {
          setError(res.message || "Failed to trigger emergency");
        }
      } catch (err: unknown) {
        const message =
          (err as { response?: { data?: { message?: string } } })?.response?.data
            ?.message || "Emergency trigger failed";
        setError(message);
      } finally {
        setIsTriggering(false);
      }
    },
    []
  );

  /* ── Cancel Emergency ────────────────────────────────────────────── */
  const cancelEmergency = useCallback(async () => {
    if (!activeSession) return;
    try {
      await apiPost(API_ENDPOINTS.EMERGENCY.CANCEL, {
        sessionId: activeSession._id,
      });
      const socket = getSocket();
      socket.emit("emergency:cancel", activeSession._id);
      setActiveSession(null);
      setStatus("cancelled");
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || "Cancel failed";
      setError(message);
    }
  }, [activeSession]);

  /* ── Resolve Emergency ───────────────────────────────────────────── */
  const resolveEmergency = useCallback(async () => {
    if (!activeSession) return;
    try {
      await apiPost(API_ENDPOINTS.EMERGENCY.RESOLVE, {
        sessionId: activeSession._id,
      });
      setActiveSession(null);
      setStatus("resolved");
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || "Resolve failed";
      setError(message);
    }
  }, [activeSession]);

  /* ── Heartbeat Management ────────────────────────────────────────── */
  const startHeartbeat = useCallback(() => {
    if (heartbeatIntervalRef.current) return;

    const sendPing = () => {
      if (!navigator.geolocation) return;
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const socket = getSocket();
          socket.emit("heartbeat:ping", {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            batteryLevel: undefined,
          });
        },
        (geoError) => {
          console.warn("[Heartbeat] Geolocation error:", geoError.message);
        },
        { enableHighAccuracy: true, timeout: 10000 }
      );
    };

    sendPing();
    heartbeatIntervalRef.current = setInterval(sendPing, HEARTBEAT_INTERVAL_MS);
  }, []);

  const stopHeartbeat = useCallback(() => {
    if (heartbeatIntervalRef.current) {
      clearInterval(heartbeatIntervalRef.current);
      heartbeatIntervalRef.current = null;
    }
  }, []);

  /* ── Stats ───────────────────────────────────────────────────────── */
  const refreshStats = useCallback(async () => {
    try {
      const res = await apiGet<ApiResponse<EmergencyStats>>(
        API_ENDPOINTS.EMERGENCY.STATS
      );
      if (res.success && res.data) {
        setStats(res.data);
      }
    } catch {
      // Silently fail — stats are non-critical
    }
  }, []);

  const clearError = useCallback(() => setError(null), []);

  /* ── Cleanup on unmount ──────────────────────────────────────────── */
  useEffect(() => {
    return () => {
      stopHeartbeat();
      disconnectSocket();
    };
  }, [stopHeartbeat]);

  return (
    <EmergencyContext.Provider
      value={{
        activeSession,
        status,
        heartbeat,
        stats,
        isTriggering,
        error,
        triggerEmergency,
        cancelEmergency,
        resolveEmergency,
        startHeartbeat,
        stopHeartbeat,
        refreshStats,
        clearError,
      }}
    >
      {children}
    </EmergencyContext.Provider>
  );
}
