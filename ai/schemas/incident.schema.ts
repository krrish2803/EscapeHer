/**
 * Zod schemas for validating incident-related AI inputs and outputs.
 */
import { z } from "zod";

export const LocationSchema = z.object({
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  address: z.string().optional(),
  accuracy: z.number().positive().optional(),
});

export const EvidenceItemSchema = z.object({
  id: z.string().min(1),
  type: z.enum(["audio", "video", "photo", "text", "location"]),
  description: z.string().optional(),
  capturedAt: z.string().datetime(),
  metadata: z.record(z.unknown()).optional(),
});

export const TimelineEventSchema = z.object({
  time: z.string().datetime(),
  event: z.string().min(1),
});

export const IncidentInputSchema = z.object({
  sessionId: z.string().min(1),
  userName: z.string().min(1),
  startTime: z.string().datetime(),
  endTime: z.string().datetime(),
  triggerMethod: z.enum(["button", "voice", "shake", "pin", "auto"]),
  severity: z.enum(["low", "medium", "high", "critical"]),
  location: LocationSchema,
  evidence: z.array(EvidenceItemSchema),
  locationHistory: z.array(
    z.object({
      lat: z.number(),
      lng: z.number(),
      timestamp: z.string().datetime(),
    })
  ),
  contactsNotified: z.array(z.string()).optional(),
});

export const IncidentReportOutputSchema = z.object({
  title: z.string().min(1),
  summary: z.string().min(50).max(1000),
  timeline: z.array(TimelineEventSchema).min(1),
  evidenceAnalysis: z.string().min(1),
  locationAnalysis: z.string().optional(),
  riskAssessment: z.string().min(1),
  recommendations: z.array(z.string()).min(3),
  conclusion: z.string().min(1),
});

export type IncidentInput = z.infer<typeof IncidentInputSchema>;
export type IncidentReportOutput = z.infer<typeof IncidentReportOutputSchema>;
export type LocationData = z.infer<typeof LocationSchema>;
export type EvidenceItem = z.infer<typeof EvidenceItemSchema>;
export type TimelineEvent = z.infer<typeof TimelineEventSchema>;
