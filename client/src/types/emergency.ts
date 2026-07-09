export type EmergencyStatus = "idle" | "triggered" | "active" | "resolved" | "cancelled";

export type EmergencySeverity = "low" | "medium" | "high" | "critical";

export interface EmergencySession {
  _id: string;
  userId: string;
  status: EmergencyStatus;
  severity: EmergencySeverity;
  triggerMethod: "button" | "voice" | "shake" | "pin" | "auto";
  location: {
    latitude: number;
    longitude: number;
    address?: string;
    accuracy?: number;
  };
  safeRoute?: SafeRouteData;
  contactsNotified: string[];
  evidenceCollected: string[];
  aiAnalysis?: string;
  resolvedAt?: string;
  cancelledAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SafeRouteData {
  origin: { lat: number; lng: number };
  destination: { lat: number; lng: number };
  waypoints: { lat: number; lng: number }[];
  estimatedTime: number;
  distance: number;
  safetyScore: number;
  routeType: "fastest" | "safest" | "balanced";
}

export interface HeartbeatData {
  _id: string;
  userId: string;
  sessionId?: string;
  location: {
    latitude: number;
    longitude: number;
  };
  batteryLevel?: number;
  networkStatus: "online" | "offline" | "weak";
  isMoving: boolean;
  speed?: number;
  timestamp: string;
}

export interface LocationPing {
  latitude: number;
  longitude: number;
  timestamp: string;
  accuracy?: number;
}

export interface EmergencyTriggerPayload {
  triggerMethod: EmergencySession["triggerMethod"];
  location: {
    latitude: number;
    longitude: number;
    address?: string;
  };
  severity?: EmergencySeverity;
}

export interface EmergencyStats {
  totalSessions: number;
  activeSessions: number;
  resolvedSessions: number;
  averageResponseTime: number;
}
