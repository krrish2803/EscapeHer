export const APP_NAME = "EscapeHer";

export const APP_DESCRIPTION =
  "AI-Assisted Women's Emergency Escape & Response System";

export const APP_TAGLINE = "Your silent guardian in moments that matter";

export const HEARTBEAT_INTERVAL_MS = 15000;

export const LOCATION_UPDATE_INTERVAL_MS = 10000;

export const EMERGENCY_COUNTDOWN_SECONDS = 5;

export const MAX_TRUSTED_CONTACTS = 10;

export const MAX_SENTINEL_KEYWORDS = 5;

export const EVIDENCE_TYPES = ["audio", "video", "photo", "text", "location"] as const;

export const EMERGENCY_SEVERITY_LEVELS = ["low", "medium", "high", "critical"] as const;

export const TRIGGER_METHODS = ["button", "voice", "shake", "pin", "auto"] as const;

export const CONTACT_RELATIONSHIPS = [
  "parent",
  "sibling",
  "spouse",
  "friend",
  "colleague",
  "neighbor",
  "guardian",
  "other",
] as const;

export const BLOOD_GROUPS = [
  "A+",
  "A-",
  "B+",
  "B-",
  "AB+",
  "AB-",
  "O+",
  "O-",
] as const;

export const SAFE_PLACE_TYPES = [
  "police_station",
  "hospital",
  "fire_station",
  "shelter",
  "public_place",
] as const;

export const TOKEN_KEY = "escapeher_token";
export const USER_KEY = "escapeher_user";
export const THEME_KEY = "escapeher_theme";

export const TOAST_DURATION = 4000;

export const DEBOUNCE_DELAY = 300;
