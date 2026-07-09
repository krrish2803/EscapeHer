/**
 * Validation utilities for AI inputs and outputs.
 * Ensures data integrity before sending to Gemini and after parsing responses.
 */

/**
 * Validate that a value is a valid latitude (-90 to 90).
 */
export function isValidLatitude(lat: unknown): lat is number {
  return typeof lat === "number" && !isNaN(lat) && lat >= -90 && lat <= 90;
}

/**
 * Validate that a value is a valid longitude (-180 to 180).
 */
export function isValidLongitude(lng: unknown): lng is number {
  return typeof lng === "number" && !isNaN(lng) && lng >= -180 && lng <= 180;
}

/**
 * Validate a coordinate pair.
 */
export function isValidCoordinates(lat: unknown, lng: unknown): boolean {
  return isValidLatitude(lat) && isValidLongitude(lng);
}

/**
 * Validate a risk level string.
 */
export function isValidRiskLevel(level: unknown): level is string {
  return (
    typeof level === "string" &&
    ["low", "medium", "high", "critical"].includes(level)
  );
}

/**
 * Validate a trigger method string.
 */
export function isValidTriggerMethod(method: unknown): method is string {
  return (
    typeof method === "string" &&
    ["button", "voice", "shake", "pin", "auto"].includes(method)
  );
}

/**
 * Validate an ISO 8601 timestamp string.
 */
export function isValidTimestamp(ts: unknown): ts is string {
  if (typeof ts !== "string") return false;
  const date = new Date(ts);
  return !isNaN(date.getTime());
}

/**
 * Validate an evidence type string.
 */
export function isValidEvidenceType(type: unknown): type is string {
  return (
    typeof type === "string" &&
    ["audio", "video", "photo", "text", "location"].includes(type)
  );
}

/**
 * Validate an emergency analysis response from Gemini.
 */
export function validateEmergencyAnalysis(data: unknown): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (!data || typeof data !== "object") {
    return { valid: false, errors: ["Response is not an object"] };
  }

  const obj = data as Record<string, unknown>;

  if (!isValidRiskLevel(obj.riskLevel)) {
    errors.push("Invalid or missing riskLevel");
  }
  if (typeof obj.assessment !== "string" || obj.assessment.length === 0) {
    errors.push("Invalid or missing assessment");
  }
  if (!Array.isArray(obj.recommendations) || obj.recommendations.length === 0) {
    errors.push("Invalid or empty recommendations array");
  }
  if (!Array.isArray(obj.nearbyResources)) {
    errors.push("Invalid or missing nearbyResources array");
  }
  if (typeof obj.estimatedResponseTime !== "string") {
    errors.push("Invalid or missing estimatedResponseTime");
  }

  return { valid: errors.length === 0, errors };
}

/**
 * Validate an incident report response from Gemini.
 */
export function validateIncidentReport(data: unknown): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (!data || typeof data !== "object") {
    return { valid: false, errors: ["Response is not an object"] };
  }

  const obj = data as Record<string, unknown>;

  if (typeof obj.title !== "string" || obj.title.length === 0) {
    errors.push("Invalid or missing title");
  }
  if (typeof obj.summary !== "string" || obj.summary.length === 0) {
    errors.push("Invalid or missing summary");
  }
  if (!Array.isArray(obj.timeline) || obj.timeline.length === 0) {
    errors.push("Invalid or empty timeline array");
  }
  if (typeof obj.evidenceAnalysis !== "string") {
    errors.push("Invalid or missing evidenceAnalysis");
  }
  if (!Array.isArray(obj.recommendations) || obj.recommendations.length < 3) {
    errors.push("Recommendations must contain at least 3 items");
  }
  if (typeof obj.conclusion !== "string") {
    errors.push("Invalid or missing conclusion");
  }

  return { valid: errors.length === 0, errors };
}

/**
 * Validate a safe route response from Gemini.
 */
export function validateSafeRoute(data: unknown): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (!data || typeof data !== "object") {
    return { valid: false, errors: ["Response is not an object"] };
  }

  const obj = data as Record<string, unknown>;

  if (
    typeof obj.safetyScore !== "number" ||
    obj.safetyScore < 1 ||
    obj.safetyScore > 10
  ) {
    errors.push("safetyScore must be a number between 1 and 10");
  }
  if (!Array.isArray(obj.recommendations) || obj.recommendations.length < 3) {
    errors.push("Recommendations must contain at least 3 items");
  }
  if (!Array.isArray(obj.avoidAreas)) {
    errors.push("Invalid or missing avoidAreas array");
  }
  if (!Array.isArray(obj.safeStops)) {
    errors.push("Invalid or missing safeStops array");
  }
  if (typeof obj.estimatedTime !== "string") {
    errors.push("Invalid or missing estimatedTime");
  }
  if (typeof obj.generalAdvice !== "string") {
    errors.push("Invalid or missing generalAdvice");
  }

  return { valid: errors.length === 0, errors };
}

/**
 * Validate a heartbeat analysis response from Gemini.
 */
export function validateHeartbeatAnalysis(data: unknown): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (!data || typeof data !== "object") {
    return { valid: false, errors: ["Response is not an object"] };
  }

  const obj = data as Record<string, unknown>;

  if (
    typeof obj.status !== "string" ||
    !["normal", "warning", "alert", "critical"].includes(obj.status)
  ) {
    errors.push("Invalid or missing status");
  }
  if (!Array.isArray(obj.anomalies)) {
    errors.push("Invalid or missing anomalies array");
  }
  if (!isValidRiskLevel(obj.riskLevel)) {
    errors.push("Invalid or missing riskLevel");
  }
  if (!Array.isArray(obj.recommendations)) {
    errors.push("Invalid or missing recommendations array");
  }

  return { valid: errors.length === 0, errors };
}
