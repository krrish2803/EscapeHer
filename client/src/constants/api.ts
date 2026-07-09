export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export const SOCKET_URL =
  process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:5000";

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: "/auth/login",
    SIGNUP: "/auth/signup",
    LOGOUT: "/auth/logout",
    ME: "/auth/me",
    REFRESH: "/auth/refresh",
    FORGOT_PASSWORD: "/auth/forgot-password",
    RESET_PASSWORD: "/auth/reset-password",
  },
  USER: {
    PROFILE: "/user/profile",
    UPDATE: "/user/profile",
    AVATAR: "/user/avatar",
    SETTINGS: "/user/settings",
  },
  EMERGENCY: {
    TRIGGER: "/emergency/trigger",
    STATUS: "/emergency/status",
    RESOLVE: "/emergency/resolve",
    CANCEL: "/emergency/cancel",
    HISTORY: "/emergency/history",
    ACTIVE: "/emergency/active",
    STATS: "/emergency/stats",
  },
  HEARTBEAT: {
    PING: "/heartbeat/ping",
    STATUS: "/heartbeat/status",
    HISTORY: "/heartbeat/history",
  },
  CONTACTS: {
    LIST: "/contacts",
    CREATE: "/contacts",
    UPDATE: "/contacts",
    DELETE: "/contacts",
    VERIFY: "/contacts/verify",
  },
  REPORTS: {
    LIST: "/reports",
    GENERATE: "/reports/generate",
    DOWNLOAD: "/reports/download",
    DELETE: "/reports",
  },
  MAPS: {
    SAFE_ROUTE: "/maps/safe-route",
    NEARBY_SAFE_PLACES: "/maps/nearby-safe-places",
    GEOCODE: "/maps/geocode",
  },
  AI: {
    ANALYZE: "/ai/analyze",
    SUMMARIZE: "/ai/summarize",
    COMPLAINT: "/ai/complaint-draft",
    RISK_ASSESSMENT: "/ai/risk-assessment",
  },
} as const;

export const API_TIMEOUT = 30000;

export const UPLOAD_MAX_SIZE = 10 * 1024 * 1024; // 10MB
