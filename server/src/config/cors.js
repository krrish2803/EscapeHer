/**
 * CORS configuration for the Express server.
 * Allows the Next.js frontend and any additional origins defined
 * in the CORS_ORIGINS environment variable.
 */

const ALLOWED_ORIGINS = [
  process.env.CLIENT_URL || "http://localhost:3000",
  "https://escapeher.vercel.app",
];

/* Parse comma-separated additional origins from env */
if (process.env.CORS_ORIGINS) {
  const extra = process.env.CORS_ORIGINS.split(",").map((o) => o.trim()).filter(Boolean);
  ALLOWED_ORIGINS.push(...extra);
}

const corsOptions = {
  origin(origin, callback) {
    /* Allow requests with no origin (mobile apps, curl, server-to-server) */
    if (!origin) {
      return callback(null, true);
    }
    if (ALLOWED_ORIGINS.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error(`Origin ${origin} is not allowed by CORS`));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "X-Requested-With",
    "Accept",
    "Origin",
  ],
  exposedHeaders: ["X-Total-Count", "Content-Disposition"],
  maxAge: 86400, // 24 hours
  optionsSuccessStatus: 200,
};

module.exports = corsOptions;
