/**
 * Gemini AI configuration for the EscapeHer AI module.
 * Defines model parameters, safety settings, and prompt engineering defaults.
 */

export const geminiConfig = {
  /** Model identifier */
  model: process.env.GEMINI_MODEL || "gemini-2.0-flash",

  /** API key — sourced from environment */
  apiKey: process.env.GEMINI_API_KEY || "",

  /** Generation parameters */
  generation: {
    temperature: 0.7,
    topP: 0.9,
    topK: 40,
    maxOutputTokens: 4096,
    candidateCount: 1,
  },

  /** Content safety thresholds */
  safety: [
    { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
    { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
    { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
    { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_ONLY_HIGH" },
  ],

  /** Retry configuration for transient failures */
  retry: {
    maxAttempts: 3,
    baseDelayMs: 1000,
    maxDelayMs: 10000,
  },

  /** Token budget limits per request type */
  tokenBudgets: {
    emergencyAnalysis: 2048,
    evidenceSummary: 4096,
    complaintDraft: 4096,
    incidentReport: 4096,
    safeRoute: 1024,
    heartbeatAnalysis: 512,
  },
} as const;

export type GeminiConfig = typeof geminiConfig;

export default geminiConfig;
