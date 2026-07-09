/**
 * Zod schemas for validating report-related AI inputs and outputs.
 */
import { z } from "zod";

export const ReportTypeSchema = z.enum([
  "incident",
  "evidence_summary",
  "complaint_draft",
  "safety_analysis",
]);

export const ReportFormatSchema = z.enum(["pdf", "json", "text"]);

export const GenerateReportInputSchema = z.object({
  type: ReportTypeSchema,
  incidentId: z.string().min(1).optional(),
  sessionId: z.string().min(1).optional(),
  format: ReportFormatSchema.optional().default("text"),
  additionalContext: z.string().max(2000).optional(),
  userId: z.string().min(1),
});

export const ComplaintDraftInputSchema = z.object({
  incidentTitle: z.string().min(1),
  description: z.string().min(10),
  date: z.string().datetime(),
  location: z.object({
    address: z.string().optional(),
    latitude: z.number().min(-90).max(90),
    longitude: z.number().min(-180).max(180),
  }),
  severity: z.enum(["low", "medium", "high", "critical"]),
  evidence: z.array(
    z.object({
      type: z.enum(["audio", "video", "photo", "text", "location"]),
      description: z.string().optional(),
      capturedAt: z.string().datetime(),
    })
  ),
  complainantName: z.string().optional(),
  additionalContext: z.string().max(2000).optional(),
});

export const ReportOutputSchema = z.object({
  id: z.string().min(1),
  type: ReportTypeSchema,
  title: z.string().min(1),
  content: z.string().min(1),
  format: ReportFormatSchema,
  aiGenerated: z.boolean(),
  metadata: z.record(z.unknown()).optional(),
  generatedAt: z.string().datetime(),
});

export type ReportType = z.infer<typeof ReportTypeSchema>;
export type ReportFormat = z.infer<typeof ReportFormatSchema>;
export type GenerateReportInput = z.infer<typeof GenerateReportInputSchema>;
export type ComplaintDraftInput = z.infer<typeof ComplaintDraftInputSchema>;
export type ReportOutput = z.infer<typeof ReportOutputSchema>;
