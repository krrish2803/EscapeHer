# AI Workflow

## Overview

This document describes the end-to-end workflow for all AI-powered features in EscapeHer, from user action to final output.

---

## 1. Emergency Analysis Workflow

Triggered when the user activates an emergency.

```
User Action          Client                   Server                    Gemini
───────────         ────────                 ────────                  ────────
Tap SOS button  →   triggerEmergency()   →   POST /emergency/trigger
                                             │
                                             ├── Create session in DB
                                             ├── Notify contacts via Socket.IO
                                             ├── Call gemini.analyzeEmergency()
                                             │       │
                                             │       └── Build prompt from template
                                             │           Interpolate {{variables}}
                                             │           Send to Gemini API    →   AI processes
                                             │                                      │
                                             │       ←── Parse JSON response  ←────┘
                                             │           Validate with Zod
                                             │           Store AI analysis
                                             │
                                             └── Return session + AI analysis
                    ←── Update UI with
                        risk assessment
```

### Processing Steps:
1. Client sends trigger payload with location and method.
2. Server creates an `EmergencySession` document.
3. Server broadcasts via Socket.IO to notify contacts.
4. Server calls `gemini.service.analyzeEmergency()` with session data.
5. Gemini returns a JSON risk assessment.
6. Response is validated with `summary.schema.ts → EmergencyAnalysisOutputSchema`.
7. Analysis is stored in the session document.
8. Client receives the complete session with AI analysis.

---

## 2. Evidence Summary Workflow

Triggered when an emergency session is resolved.

```
Session Resolved →  Server gathers all evidence for the session
                    │
                    ├── Format evidence with formatter.formatEvidenceForPrompt()
                    ├── Format locations with formatter.formatLocationHistory()
                    ├── Interpolate into evidenceSummary template
                    │
                    └── Call gemini.summarizeEvidence()
                            │
                            └── Gemini generates chronological narrative
                                │
                                ←── Parse text response
                                    Store as Incident summary
```

---

## 3. Incident Report Workflow

Triggered by user request via the Reports page.

```
User clicks       Client                   Server                    Gemini
"Generate Report"
───────────       ────────                 ────────                  ────────
                  POST /reports/generate → Validate request
                                           │
                                           ├── Fetch session data
                                           ├── Fetch all evidence
                                           ├── Fetch location history
                                           │
                                           ├── Call gemini.generateIncidentReport()
                                           │       │
                                           │       └── Build prompt with all data
                                           │           Send to Gemini API        →  AI generates
                                           │                                        structured report
                                           │       ←── Parse JSON response  ←──────┘
                                           │           Validate with Zod
                                           │
                                           ├── Create Report document
                                           └── Return report
                  ←── Display report
                      in UI
```

---

## 4. Complaint Draft Workflow

Triggered by user request to draft a legal complaint.

```
User requests    →  POST /ai/complaint-draft
complaint           │
                    ├── Fetch incident data
                    ├── Format with ComplaintDraftInputSchema
                    ├── Call gemini.draftComplaint()
                    │       │
                    │       └── Generate formal complaint letter
                    │
                    ←── Return complaint text
                        User can edit and download
```

---

## 5. Heartbeat Analysis Workflow

Runs automatically on heartbeat data.

```
Heartbeat pings arrive via Socket.IO
│
├── Store in HeartbeatData collection
├── Every N pings, aggregate recent data
│
└── Call gemini.heartbeatAnalysis() (if anomaly suspected)
        │
        └── Analyze movement patterns
            │
            ←── Return anomaly assessment
                │
                ├── If normal → Continue monitoring
                ├── If warning → Alert user
                ├── If alert → Notify contacts
                └── If critical → Auto-trigger emergency
```

---

## 6. Safe Route Workflow

Triggered by user request on the Map page.

```
User enters       Client                   Server                    Gemini
destination
───────────       ────────                 ────────                  ────────
                  POST /maps/safe-route →  Validate coordinates
                                           │
                                           ├── Build SafeRouteInputSchema
                                           ├── Call gemini.suggestSafeRoute()
                                           │       │
                                           │       └── Analyze route safety
                                           │           Consider time of day
                                           │
                                           │       ←── Return safety assessment
                                           │           Validate with Zod
                                           │
                                           └── Return route suggestions
                  ←── Display safety score
                      and recommendations
                      on map
```

---

## Error Handling

All AI workflows include:

1. **Input Validation** — Zod schemas validate data before sending to Gemini.
2. **Retry Logic** — Transient failures retry up to 3 times with exponential backoff.
3. **Output Validation** — Responses are validated against expected schemas.
4. **Fallback** — If AI fails, a default/manual response is used.
5. **Logging** — All AI requests and responses are logged for debugging.

## Performance Targets

| Metric | Target |
|---|---|
| Emergency Analysis | < 3 seconds |
| Evidence Summary | < 10 seconds |
| Incident Report | < 15 seconds |
| Complaint Draft | < 15 seconds |
| Heartbeat Analysis | < 2 seconds |
| Safe Route | < 5 seconds |
