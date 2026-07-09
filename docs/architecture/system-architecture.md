# System Architecture

## Overview

EscapeHer follows a three-tier architecture with a Next.js frontend, Express.js API server, and MongoDB Atlas database, enhanced by Google Gemini AI for intelligent emergency analysis.

```
┌──────────────────────────────────────────────────────────────┐
│                        CLIENT LAYER                          │
│                                                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────┐   │
│  │   Next.js    │  │   React 19   │  │   Tailwind CSS   │   │
│  │   App Router │  │   Components │  │   + shadcn/ui    │   │
│  └──────┬───────┘  └──────┬───────┘  └──────────────────┘   │
│         │                 │                                   │
│  ┌──────┴─────────────────┴────────┐                         │
│  │  Context Providers              │                         │
│  │  AuthContext │ EmergencyContext  │                         │
│  │  ThemeContext                    │                         │
│  └──────┬──────────────────────────┘                         │
│         │                                                     │
│  ┌──────┴──────────────────────────┐                         │
│  │  API Client (Axios)             │                         │
│  │  Socket.IO Client               │                         │
│  │  Firebase SDK                   │                         │
│  └──────┬──────────────────────────┘                         │
└─────────┼────────────────────────────────────────────────────┘
          │ HTTPS / WSS
┌─────────┼────────────────────────────────────────────────────┐
│         ▼          SERVER LAYER                              │
│  ┌──────────────────────────────────────────────────────┐    │
│  │                  Express.js Server                    │    │
│  │                                                       │    │
│  │  ┌───────────┐ ┌───────────┐ ┌─────────────────┐    │    │
│  │  │  Routes   │ │Controllers│ │   Middleware     │    │    │
│  │  │           │ │           │ │  Auth │ CORS     │    │    │
│  │  │  /auth    │ │  auth     │ │  Rate Limiter    │    │    │
│  │  │  /user    │ │  user     │ │  Error Handler   │    │    │
│  │  │  /emergency│ │  emergency│ │  Logger │ Upload │    │    │
│  │  │  /heartbeat│ │  heartbeat│ │                  │    │    │
│  │  │  /contacts│ │  contacts │ └─────────────────┘    │    │
│  │  │  /reports │ │  reports  │                         │    │
│  │  │  /maps    │ │  maps     │ ┌─────────────────┐    │    │
│  │  │  /ai      │ │  ai       │ │   Services      │    │    │
│  │  └───────────┘ └───────────┘ │  auth.service    │    │    │
│  │                               │  emergency.svc   │    │    │
│  │  ┌───────────────────────┐   │  heartbeat.svc   │    │    │
│  │  │     Socket.IO         │   │  incident.svc    │    │    │
│  │  │  Emergency events     │   │  report.service  │    │    │
│  │  │  Heartbeat events     │   │  maps.service    │    │    │
│  │  │  Location tracking    │   │  socket.service  │    │    │
│  │  └───────────────────────┘   │  notification    │    │    │
│  │                               │  gemini.service  │    │    │
│  └──────────────────────────────┴─────────────────┘──┘──┘    │
└─────────┬────────────────────────────────────────────────────┘
          │
┌─────────┼────────────────────────────────────────────────────┐
│         ▼          DATA LAYER                                │
│  ┌──────────────────────────────────┐  ┌──────────────────┐  │
│  │       MongoDB Atlas              │  │   Firebase       │  │
│  │                                  │  │   Cloud Storage  │  │
│  │  Collections:                    │  │   FCM            │  │
│  │  ├── users                       │  └──────────────────┘  │
│  │  ├── emergency_sessions          │                        │
│  │  ├── trusted_contacts            │  ┌──────────────────┐  │
│  │  ├── incidents                   │  │   Google Gemini  │  │
│  │  ├── evidence                    │  │   AI API         │  │
│  │  ├── heartbeats                  │  └──────────────────┘  │
│  │  └── location_pings              │                        │
│  └──────────────────────────────────┘                        │
└──────────────────────────────────────────────────────────────┘
```

## Component Breakdown

### Frontend (Next.js 15)

| Layer | Responsibility |
|---|---|
| **App Router** | File-based routing, layouts, and server components |
| **Context Providers** | Global state management (Auth, Emergency, Theme) |
| **Components** | Reusable UI components organized by feature domain |
| **Hooks** | Custom React hooks (useAuth, useEmergency, useLocation, useSocket, useTheme) |
| **Lib** | API client, Socket.IO client, Firebase SDK, helpers |
| **Config** | Firebase, routes, site metadata, theme tokens |
| **Constants** | API endpoints, colors, route definitions |
| **Types** | TypeScript interfaces for all domain entities |

### Backend (Express.js)

| Layer | Responsibility |
|---|---|
| **Routes** | HTTP endpoint definitions and request routing |
| **Controllers** | Request handling, validation, and response formatting |
| **Services** | Business logic, database operations, external API calls |
| **Middleware** | Auth (JWT), CORS, rate limiting, error handling, logging, file upload |
| **Models** | Mongoose schemas and model definitions |
| **Validators** | Request body validation with express-validator |
| **Utils** | Response helpers, logging, general utilities |
| **Config** | Database, CORS, Socket.IO, Gemini AI configuration |

### Data Flow

1. **Emergency Trigger** → Client emits trigger → Server creates session → AI analyzes → Contacts notified → Evidence collection starts
2. **Heartbeat Loop** → Client sends periodic pings → Server stores location → AI monitors for anomalies → Alerts if abnormal
3. **Report Generation** → User requests report → Server gathers data → AI generates structured report → Client displays/downloads

## Security Architecture

- **Authentication**: JWT tokens with HTTP-only cookies
- **Authorization**: Role-based access control
- **Rate Limiting**: Express rate limiter on sensitive endpoints
- **Input Validation**: Zod (frontend) + express-validator (backend)
- **CORS**: Whitelist-based origin control
- **Helmet**: Security headers
- **Data Encryption**: HTTPS in transit, bcrypt for passwords
