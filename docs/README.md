# EscapeHer Documentation

> **AI-Assisted Women's Emergency Escape & Response System**

## Overview

EscapeHer is a comprehensive AI-powered safety platform designed to provide women with immediate, intelligent emergency response capabilities. The system combines real-time AI analysis, live location tracking, evidence collection, and a verified guardian dispatch network to create a robust safety net.

## Documentation Structure

| Document | Description |
|---|---|
| [System Architecture](./architecture/system-architecture.md) | High-level system design, components, and data flow |
| [AI Architecture](./architecture/ai-architecture.md) | Gemini AI integration, prompt engineering, and processing pipeline |
| [API Endpoints](./api/endpoints.md) | Complete REST API reference for all server endpoints |
| [Deployment Guide](./setup/deployment.md) | Step-by-step deployment instructions for Vercel and Render |
| [AI Workflow](./workflow/ai-workflow.md) | End-to-end AI processing workflow documentation |

## Tech Stack

### Frontend
- **Next.js 15** — React 19 framework with App Router
- **TypeScript** — Type-safe development
- **Tailwind CSS v4** — Utility-first styling
- **shadcn/ui** — Accessible component library
- **Framer Motion** — Animations and transitions
- **Socket.IO Client** — Real-time communication
- **Leaflet** — Interactive mapping

### Backend
- **Node.js + Express.js** — REST API server
- **MongoDB Atlas + Mongoose** — Database and ODM
- **JWT** — Authentication
- **Socket.IO** — WebSocket communication
- **Firebase Admin** — Push notifications and file storage
- **Multer** — File upload handling

### AI
- **Google Gemini API** — Emergency analysis, evidence summarisation, complaint drafting, incident reports, and safe route suggestions
- **Zod** — Schema validation for AI inputs and outputs

### Deployment
- **Vercel** — Frontend hosting with edge functions
- **Render** — Backend API and WebSocket server
- **MongoDB Atlas** — Cloud database

## Key Features

1. **Emergency Trigger System** — One-tap, voice sentinel, shake detection, and PIN-based triggers
2. **Real-Time Location Tracking** — Continuous GPS heartbeat with anomaly detection
3. **AI Risk Assessment** — Instant situation analysis via Google Gemini
4. **Evidence Collection** — Audio, video, photo, and text evidence capture
5. **Trusted Contact Network** — Verified guardian dispatch with priority ordering
6. **Safe Route Suggestions** — AI-powered safety-aware routing
7. **Incident Reports** — AI-generated comprehensive reports
8. **Complaint Drafting** — AI-assisted formal legal complaints
9. **Stealth Mode** — Discreet operation mode for high-risk situations
10. **Heartbeat Monitoring** — Automatic anomaly detection and alerts

## Getting Started

### Prerequisites
- Node.js >= 18
- npm >= 9
- MongoDB Atlas account
- Google Gemini API key
- Firebase project (for notifications)

### Quick Start

```bash
# Clone the repository
git clone https://github.com/kamalsolanki143/EscapeHer.git
cd EscapeHer

# Install client dependencies
cd client && npm install

# Install server dependencies
cd ../server && npm install

# Configure environment variables
cp .env.example .env
# Edit .env with your credentials

# Start development servers
cd ../client && npm run dev   # Frontend on :3000
cd ../server && npm run dev   # Backend on :5000
```

See the [Deployment Guide](./setup/deployment.md) for production setup.

## License

MIT License — see [LICENSE](../LICENSE) for details.
