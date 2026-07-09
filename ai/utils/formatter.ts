/**
 * Formatter utilities for preparing data before sending to the AI
 * and formatting AI responses for display or storage.
 */

/**
 * Format a timestamp to a human-readable date-time string.
 */
export function formatTimestamp(iso: string): string {
  const date = new Date(iso);
  if (isNaN(date.getTime())) return "Unknown time";
  return date.toLocaleString("en-IN", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });
}

/**
 * Format duration in milliseconds to a human-readable string.
 */
export function formatDuration(ms: number): string {
  if (ms < 0) return "0s";
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);

  if (hours > 0) {
    return `${hours}h ${minutes % 60}m ${seconds % 60}s`;
  }
  if (minutes > 0) {
    return `${minutes}m ${seconds % 60}s`;
  }
  return `${seconds}s`;
}

/**
 * Format coordinates to a consistent string representation.
 */
export function formatCoordinates(lat: number, lng: number): string {
  return `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
}

/**
 * Format an evidence array into a string suitable for prompt injection.
 */
export function formatEvidenceForPrompt(
  evidence: Array<{
    type: string;
    description?: string;
    capturedAt: string;
    metadata?: Record<string, unknown>;
  }>
): string {
  if (evidence.length === 0) return "No evidence collected.";

  return evidence
    .map((item, index) => {
      const lines = [
        `Evidence #${index + 1}:`,
        `  Type: ${item.type}`,
        `  Captured: ${formatTimestamp(item.capturedAt)}`,
      ];
      if (item.description) {
        lines.push(`  Description: ${item.description}`);
      }
      if (item.metadata && Object.keys(item.metadata).length > 0) {
        lines.push(`  Metadata: ${JSON.stringify(item.metadata)}`);
      }
      return lines.join("\n");
    })
    .join("\n\n");
}

/**
 * Format location history into a string suitable for prompt injection.
 */
export function formatLocationHistory(
  locations: Array<{ lat: number; lng: number; timestamp: string }>
): string {
  if (locations.length === 0) return "No location history available.";

  return locations
    .map(
      (loc, i) =>
        `Point ${i + 1}: ${formatCoordinates(loc.lat, loc.lng)} at ${formatTimestamp(loc.timestamp)}`
    )
    .join("\n");
}

/**
 * Format heartbeat data into a string for prompt injection.
 */
export function formatHeartbeatData(
  pings: Array<{
    latitude: number;
    longitude: number;
    timestamp: string;
    batteryLevel?: number;
    networkStatus?: string;
    isMoving?: boolean;
    speed?: number;
  }>
): string {
  if (pings.length === 0) return "No heartbeat data available.";

  return pings
    .map((ping, i) => {
      const parts = [
        `Ping ${i + 1}: ${formatCoordinates(ping.latitude, ping.longitude)}`,
        `at ${formatTimestamp(ping.timestamp)}`,
      ];
      if (ping.batteryLevel !== undefined) parts.push(`Battery: ${ping.batteryLevel}%`);
      if (ping.networkStatus) parts.push(`Network: ${ping.networkStatus}`);
      if (ping.isMoving !== undefined) parts.push(`Moving: ${ping.isMoving ? "Yes" : "No"}`);
      if (ping.speed !== undefined) parts.push(`Speed: ${ping.speed.toFixed(1)} m/s`);
      return parts.join(" | ");
    })
    .join("\n");
}

/**
 * Format a risk level into a display-friendly string with emoji.
 */
export function formatRiskLevel(level: string): string {
  const levels: Record<string, string> = {
    low: "🟢 Low Risk",
    medium: "🟡 Medium Risk",
    high: "🟠 High Risk",
    critical: "🔴 Critical Risk",
  };
  return levels[level] || `⚪ ${level}`;
}

/**
 * Sanitize a string for safe inclusion in prompts.
 * Removes control characters and truncates to a max length.
 */
export function sanitizeForPrompt(input: string, maxLength = 2000): string {
  const sanitized = input
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, "")
    .trim();
  if (sanitized.length > maxLength) {
    return sanitized.slice(0, maxLength) + "... [truncated]";
  }
  return sanitized;
}
