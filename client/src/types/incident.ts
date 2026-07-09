export type IncidentSeverity = "low" | "medium" | "high" | "critical";

export type IncidentStatus = "reported" | "investigating" | "resolved" | "archived";

export interface Incident {
  _id: string;
  userId: string;
  sessionId?: string;
  title: string;
  description: string;
  severity: IncidentSeverity;
  status: IncidentStatus;
  location: {
    latitude: number;
    longitude: number;
    address?: string;
  };
  evidence: Evidence[];
  aiSummary?: string;
  timeline: TimelineEvent[];
  createdAt: string;
  updatedAt: string;
}

export interface Evidence {
  _id: string;
  incidentId: string;
  type: "audio" | "video" | "photo" | "text" | "location";
  url: string;
  description?: string;
  metadata?: Record<string, unknown>;
  capturedAt: string;
  createdAt: string;
}

export interface TimelineEvent {
  _id: string;
  type: "trigger" | "notification" | "location" | "evidence" | "status_change" | "ai_analysis" | "resolution";
  description: string;
  metadata?: Record<string, unknown>;
  timestamp: string;
}

export interface CreateIncidentPayload {
  title: string;
  description: string;
  severity: IncidentSeverity;
  location: {
    latitude: number;
    longitude: number;
    address?: string;
  };
}
