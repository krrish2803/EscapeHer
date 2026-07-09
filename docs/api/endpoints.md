# API Endpoints Reference

> Base URL: `http://localhost:5000/api` (development) | `https://api.escapeher.app/api` (production)

All protected endpoints require a `Bearer` token in the `Authorization` header.

---

## Authentication

### POST `/auth/signup`
Create a new user account.

**Body:**
```json
{
  "name": "string (required)",
  "email": "string (required)",
  "password": "string (required, min 8 chars)",
  "phone": "string (required)"
}
```

**Response:** `201`
```json
{
  "success": true,
  "token": "jwt_token",
  "user": { ... }
}
```

### POST `/auth/login`
Authenticate and receive a JWT token.

**Body:**
```json
{
  "email": "string (required)",
  "password": "string (required)"
}
```

**Response:** `200`
```json
{
  "success": true,
  "token": "jwt_token",
  "user": { ... }
}
```

### POST `/auth/logout`
🔒 **Protected** — Invalidate the current session.

**Response:** `200`
```json
{ "success": true, "message": "Logged out successfully" }
```

### GET `/auth/me`
🔒 **Protected** — Get the currently authenticated user.

**Response:** `200`
```json
{
  "success": true,
  "data": { "user object" }
}
```

---

## User Profile

### GET `/user/profile`
🔒 **Protected** — Get the user's full profile.

### PUT `/user/profile`
🔒 **Protected** — Update the user's profile.

**Body:**
```json
{
  "name": "string",
  "phone": "string",
  "address": "string",
  "city": "string",
  "state": "string",
  "bloodGroup": "string",
  "medicalConditions": "string",
  "allergies": "string",
  "sentinelKeywords": ["array of strings"],
  "emergencyPin": "string",
  "stealthMode": "boolean"
}
```

### POST `/user/avatar`
🔒 **Protected** — Upload a profile avatar (multipart form data).

---

## Emergency

### POST `/emergency/trigger`
🔒 **Protected** — Trigger a new emergency session.

**Body:**
```json
{
  "triggerMethod": "button | voice | shake | pin | auto",
  "location": {
    "latitude": "number",
    "longitude": "number",
    "address": "string (optional)"
  },
  "severity": "low | medium | high | critical (optional, default: high)"
}
```

**Response:** `201`
```json
{
  "success": true,
  "data": { "emergency session object" }
}
```

### GET `/emergency/active`
🔒 **Protected** — Get the user's currently active emergency session.

### POST `/emergency/cancel`
🔒 **Protected** — Cancel an active emergency session.

**Body:**
```json
{ "sessionId": "string" }
```

### POST `/emergency/resolve`
🔒 **Protected** — Resolve an active emergency session.

**Body:**
```json
{ "sessionId": "string" }
```

### GET `/emergency/history`
🔒 **Protected** — Get the user's emergency session history.

**Query:** `?page=1&limit=10`

### GET `/emergency/stats`
🔒 **Protected** — Get emergency statistics for the user.

---

## Heartbeat

### POST `/heartbeat/ping`
🔒 **Protected** — Send a heartbeat ping with location data.

**Body:**
```json
{
  "latitude": "number",
  "longitude": "number",
  "batteryLevel": "number (optional)",
  "networkStatus": "online | offline | weak",
  "isMoving": "boolean",
  "speed": "number (optional)"
}
```

### GET `/heartbeat/status`
🔒 **Protected** — Get the user's current heartbeat status.

### GET `/heartbeat/history`
🔒 **Protected** — Get heartbeat history.

**Query:** `?sessionId=xxx&limit=50`

---

## Trusted Contacts

### GET `/contacts`
🔒 **Protected** — List all trusted contacts.

### POST `/contacts`
🔒 **Protected** — Add a new trusted contact.

**Body:**
```json
{
  "name": "string",
  "phone": "string",
  "email": "string (optional)",
  "relationship": "parent | sibling | spouse | friend | colleague | neighbor | guardian | other",
  "priority": "number (optional)",
  "notifyOnEmergency": "boolean (default: true)",
  "notifyOnHeartbeatLoss": "boolean (default: false)"
}
```

### PUT `/contacts/:id`
🔒 **Protected** — Update a trusted contact.

### DELETE `/contacts/:id`
🔒 **Protected** — Remove a trusted contact.

### POST `/contacts/verify`
🔒 **Protected** — Send a verification request to a contact.

---

## Reports

### GET `/reports`
🔒 **Protected** — List all generated reports.

**Query:** `?type=incident&page=1&limit=10`

### POST `/reports/generate`
🔒 **Protected** — Generate a new AI report.

**Body:**
```json
{
  "type": "incident | evidence_summary | complaint_draft | safety_analysis",
  "incidentId": "string (optional)",
  "sessionId": "string (optional)",
  "format": "pdf | json | text (default: text)",
  "additionalContext": "string (optional)"
}
```

### GET `/reports/download/:id`
🔒 **Protected** — Download a report file.

### DELETE `/reports/:id`
🔒 **Protected** — Delete a report.

---

## Maps

### POST `/maps/safe-route`
🔒 **Protected** — Get AI-powered safe route suggestions.

**Body:**
```json
{
  "originLat": "number",
  "originLng": "number",
  "destLat": "number",
  "destLng": "number",
  "timeOfDay": "string (optional)",
  "travelMode": "walking | driving | transit (optional)"
}
```

### GET `/maps/nearby-safe-places`
🔒 **Protected** — Find nearby safe places.

**Query:** `?lat=number&lng=number&radius=5000&type=police_station`

### GET `/maps/geocode`
🔒 **Protected** — Reverse geocode coordinates to an address.

**Query:** `?lat=number&lng=number`

---

## AI

### POST `/ai/analyze`
🔒 **Protected** — Get AI analysis of an emergency situation.

### POST `/ai/summarize`
🔒 **Protected** — Generate an AI evidence summary.

### POST `/ai/complaint-draft`
🔒 **Protected** — Generate an AI complaint draft.

### POST `/ai/risk-assessment`
🔒 **Protected** — Get an AI risk assessment.

---

## Socket.IO Events

### Client → Server

| Event | Payload | Description |
|---|---|---|
| `emergency:trigger` | `{ latitude, longitude, severity }` | Trigger an emergency |
| `emergency:cancel` | `sessionId` | Cancel an emergency |
| `heartbeat:ping` | `{ latitude, longitude, batteryLevel? }` | Send a heartbeat |
| `location:update` | `{ latitude, longitude, accuracy? }` | Update location |

### Server → Client

| Event | Payload | Description |
|---|---|---|
| `emergency:update` | Emergency session data | Emergency status update |
| `emergency:resolved` | `{ sessionId }` | Emergency resolved |
| `heartbeat:ack` | `{ timestamp }` | Heartbeat acknowledged |
| `contact:notified` | `{ contactId, status }` | Contact notification status |
| `alert:received` | `{ message, severity }` | Alert notification |
| `location:update` | Location data | Tracked user location |

---

## Error Responses

All errors follow a consistent format:

```json
{
  "success": false,
  "message": "Human-readable error message",
  "error": "Error details (development only)",
  "statusCode": 400
}
```

| Status Code | Meaning |
|---|---|
| 400 | Bad Request — validation failed |
| 401 | Unauthorized — invalid or missing token |
| 403 | Forbidden — insufficient permissions |
| 404 | Not Found |
| 429 | Too Many Requests — rate limited |
| 500 | Internal Server Error |
