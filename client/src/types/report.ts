export type ReportType = "incident" | "evidence_summary" | "complaint_draft" | "safety_analysis";

export type ReportFormat = "pdf" | "json" | "text";

export interface Report {
  _id: string;
  userId: string;
  incidentId?: string;
  sessionId?: string;
  type: ReportType;
  title: string;
  content: string;
  format: ReportFormat;
  aiGenerated: boolean;
  metadata?: Record<string, unknown>;
  fileUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface GenerateReportPayload {
  type: ReportType;
  incidentId?: string;
  sessionId?: string;
  format?: ReportFormat;
  additionalContext?: string;
}

export interface ReportSummary {
  totalReports: number;
  byType: Record<ReportType, number>;
  recentReports: Report[];
}
