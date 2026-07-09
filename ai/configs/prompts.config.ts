/**
 * Prompt configuration registry for all EscapeHer AI tasks.
 * Each entry maps a task key to its system prompt, user prompt template,
 * and expected output format.
 */

export interface PromptConfig {
  /** Unique key for this prompt */
  key: string;
  /** System-level instruction */
  systemPrompt: string;
  /** User prompt template — use {{variable}} placeholders */
  userTemplate: string;
  /** Expected output format */
  outputFormat: "json" | "text" | "markdown";
  /** Maximum tokens for this task */
  maxTokens: number;
  /** Temperature override (optional) */
  temperature?: number;
}

export const promptConfigs: Record<string, PromptConfig> = {
  emergencyAnalysis: {
    key: "emergencyAnalysis",
    systemPrompt:
      "You are an emergency safety analyst AI for EscapeHer, an AI-powered women's safety platform. Your role is to analyze emergency situations quickly and provide actionable risk assessments. Always prioritize the user's immediate safety. Be concise, factual, and specific.",
    userTemplate: `Analyze this emergency situation:

Location: {{latitude}}, {{longitude}}
Address: {{address}}
Trigger Method: {{triggerMethod}}
Time: {{timestamp}}
Additional Context: {{additionalContext}}

Provide a risk assessment as JSON with: riskLevel, assessment, recommendations, nearbyResources, estimatedResponseTime.`,
    outputFormat: "json",
    maxTokens: 2048,
    temperature: 0.5,
  },

  evidenceSummary: {
    key: "evidenceSummary",
    systemPrompt:
      "You are a forensic evidence analyst AI for EscapeHer. Your role is to compile and summarize evidence collected during emergency sessions into clear, chronological narratives suitable for law enforcement or legal proceedings. Maintain an objective, factual tone throughout.",
    userTemplate: `Summarize the following evidence collected during an emergency session:

Evidence Items:
{{evidence}}

Session Duration: {{duration}}
Location History: {{locationHistory}}

Produce a professional summary including timeline, key observations, location analysis, and identified patterns.`,
    outputFormat: "text",
    maxTokens: 4096,
  },

  complaintDraft: {
    key: "complaintDraft",
    systemPrompt:
      "You are a legal assistant AI for EscapeHer. You draft formal complaint letters based on incident data. The complaints must be suitable for submission to law enforcement. Use a professional, formal tone and include all relevant details.",
    userTemplate: `Draft a formal complaint letter based on the following incident:

Incident Title: {{title}}
Description: {{description}}
Date: {{date}}
Location: {{location}}
Evidence: {{evidence}}
Severity: {{severity}}

Include: formal header, clear description, timeline, evidence references, investigation request, signature space.`,
    outputFormat: "text",
    maxTokens: 4096,
  },

  incidentReport: {
    key: "incidentReport",
    systemPrompt:
      "You are an incident report generator AI for EscapeHer. Generate structured, comprehensive incident reports from session and evidence data. Reports should be clear, well-organized, and actionable.",
    userTemplate: `Generate an incident report from the following data:

Session ID: {{sessionId}}
User: {{userName}}
Start Time: {{startTime}}
End Time: {{endTime}}
Trigger: {{triggerMethod}}
Evidence: {{evidence}}
Location History: {{locationHistory}}

Provide a JSON report with: title, summary, timeline, evidenceAnalysis, riskAssessment, recommendations, conclusion.`,
    outputFormat: "json",
    maxTokens: 4096,
  },

  heartbeatAnalysis: {
    key: "heartbeatAnalysis",
    systemPrompt:
      "You are a safety monitoring AI for EscapeHer. Analyze heartbeat and location data patterns to detect anomalies that may indicate danger. Flag unusual patterns such as sudden stops, erratic movement, or prolonged inactivity.",
    userTemplate: `Analyze the following heartbeat data:

User: {{userName}}
Recent Pings:
{{heartbeatData}}

Detect any anomalies and provide a JSON response with: status, anomalies, riskLevel, recommendations.`,
    outputFormat: "json",
    maxTokens: 512,
    temperature: 0.3,
  },

  safeRoute: {
    key: "safeRoute",
    systemPrompt:
      "You are a safety routing AI for EscapeHer. Provide safety-aware route recommendations between locations. Consider time of day, area safety, and available safe stops. Prioritize the user's physical safety above travel efficiency.",
    userTemplate: `Suggest the safest route considerations:

Origin: {{originLat}}, {{originLng}}
Destination: {{destLat}}, {{destLng}}
Time of Day: {{timeOfDay}}
Context: {{additionalContext}}

Provide a JSON response with: safetyScore (1-10), recommendations, avoidAreas, safeStops, estimatedTime, generalAdvice.`,
    outputFormat: "json",
    maxTokens: 1024,
    temperature: 0.5,
  },
};

/**
 * Interpolate template variables into a prompt string.
 * Replaces {{key}} placeholders with values from the data object.
 */
export function interpolateTemplate(
  template: string,
  data: Record<string, string | number | undefined>
): string {
  return template.replace(/\{\{(\w+)\}\}/g, (_, key: string) => {
    const value = data[key];
    if (value === undefined || value === null) return "";
    return String(value);
  });
}

export default promptConfigs;
