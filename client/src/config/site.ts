export const siteConfig = {
  name: "EscapeHer",
  description:
    "AI-Assisted Women's Emergency Escape & Response System — real-time AI routing, voice Sentinel keywords, dynamic stealth modes, and verified guardian dispatch networks.",
  tagline: "Your silent guardian in moments that matter",
  url: process.env.NEXT_PUBLIC_APP_URL || "https://escapeher.vercel.app",
  ogImage: "/og-image.png",
  creator: "EscapeHer Team",
  keywords: [
    "women safety",
    "emergency response",
    "AI safety",
    "personal security",
    "SOS app",
    "safe route",
    "guardian network",
  ],
  links: {
    github: "https://github.com/kamalsolanki143/EscapeHer",
  },
  contact: {
    email: "support@escapeher.app",
  },
} as const;

export type SiteConfig = typeof siteConfig;
