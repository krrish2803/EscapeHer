/**
 * Zod schemas for validating summary-related AI inputs and outputs.
 * Covers evidence summaries, heartbeat analyses, and safe route suggestions.
 */
import { z } from "zod";

/* ── Evidence Summary ──────────────────────────────────────────────── */

export const EvidenceSummaryInputSchema = z.object({
  sessionId: z.string().min(1),
  userId: z.string().min(1),
  evidence: z.array(
    z.object({
      id: z.string().min(1),
      type: z.enum(["audio", "video", "photo", "text", "location"]),
      description: z.string().optional(),
      capturedAt: z.string().datetime(),
      metadata: z.record(z.unknown()).optional(),
    })
  ),
  sessionStart: z.string().datetime(),
  sessionEnd: z.string().datetime(),
  locationHistory: z
    .array(
      z.object({
        lat: z.number().min(-90).max(90),
        lng: z.number().min(-180).max(180),
        timestamp: z.string().datetime(),
      })
    )
    .optional(),
});

export type EvidenceSummaryInput = z.infer<typeof EvidenceSummaryInputSchema>;

/* ── Heartbeat Analysis ────────────────────────────────────────────── */

export const HeartbeatAnalysisInputSchema = z.object({
  userId: z.string().min(1),
  userName: z.string().min(1),
  heartbeatData: z.array(
    z.object({
      latitude: z.number().min(-90).max(90),
      longitude: z.number().min(-180).max(180),
      timestamp: z.string().datetime(),
      batteryLevel: z.number().min(0).max(100).optional(),
      networkStatus: z.enum(["online", "offline", "weak"]).optional(),
      isMoving: z.boolean().optional(),
      speed: z.number().min(0).optional(),
    })
  ),
  averagePingInterval: z.number().positive(),
  lastKnownActivity: z.string().datetime(),
});

export const HeartbeatAnalysisOutputSchema = z.object({
  status: z.enum(["normal", "warning", "alert", "critical"]),
  anomalies: z.array(
    z.object({
      type: z.enum([
        "sudden_stop",
        "erratic_movement",
        "prolonged_inactivity",
        "signal_loss",
        "unusual_speed",
        "unusual_location",
      ]),
      description: z.string().min(1),
      detectedAt: z.string().datetime(),
      confidence: z.number().min(0).max(1),
    })
  ),
  riskLevel: z.enum(["low", "medium", "high", "critical"]),
  recommendations: z.array(z.string()),
});

export type HeartbeatAnalysisInput = z.infer<typeof HeartbeatAnalysisInputSchema>;
export type HeartbeatAnalysisOutput = z.infer<typeof HeartbeatAnalysisOutputSchema>;

/* ── Safe Route ────────────────────────────────────────────────────── */

export const SafeRouteInputSchema = z.object({
  originLat: z.number().min(-90).max(90),
  originLng: z.number().min(-180).max(180),
  destLat: z.number().min(-90).max(90),
  destLng: z.number().min(-180).max(180),
  timeOfDay: z.string().optional(),
  dayOfWeek: z.string().optional(),
  travelMode: z.enum(["walking", "driving", "transit"]).optional().default("walking"),
  additionalContext: z.string().max(2000).optional(),
});

export const SafeRouteOutputSchema = z.object({
  safetyScore: z.number().min(1).max(10),
  recommendations: z.array(z.string()).min(3),
  avoidAreas: z.array(z.string()),
  safeStops: z.array(z.string()),
  estimatedTime: z.string().min(1),
  generalAdvice: z.string().min(1),
  emergencyTips: z.array(z.string()).min(2).optional(),
});

export type SafeRouteInput = z.infer<typeof SafeRouteInputSchema>;
export type SafeRouteOutput = z.infer<typeof SafeRouteOutputSchema>;

/* ── Emergency Analysis ────────────────────────────────────────────── */

export const EmergencyAnalysisInputSchema = z.object({
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  address: z.string().optional(),
  triggerMethod: z.enum(["button", "voice", "shake", "pin", "auto"]),
  timestamp: z.string().datetime(),
  additionalContext: z.string().max(2000).optional(),
  batteryLevel: z.number().min(0).max(100).optional(),
  networkStatus: z.enum(["online", "offline", "weak"]).optional(),
});

export const EmergencyAnalysisOutputSchema = z.object({
  riskLevel: z.enum(["low", "medium", "high", "critical"]),
  assessment: z.string().min(1).max(500),
  recommendations: z.array(z.string()).min(3).max(6),
  nearbyResources: z.array(z.string()),
  estimatedResponseTime: z.string().min(1),
  escalationAdvice: z.string().optional(),
});

export type EmergencyAnalysisInput = z.infer<typeof EmergencyAnalysisInputSchema>;
export type EmergencyAnalysisOutput = z.infer<typeof EmergencyAnalysisOutputSchema>;
