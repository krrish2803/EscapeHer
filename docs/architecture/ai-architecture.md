# AI Architecture

## Overview

EscapeHer's AI layer is powered by Google Gemini and handles six core tasks:

1. **Emergency Analysis** — Real-time risk assessment when an emergency is triggered
2. **Evidence Summary** — Chronological narrative from collected evidence
3. **Complaint Drafting** — Formal legal complaint letters
4. **Incident Reports** — Structured reports from session data
5. **Heartbeat Analysis** — Anomaly detection in location/heartbeat data
6. **Safe Route Suggestions** — Safety-aware routing recommendations

## Architecture Diagram

```
┌──────────────────────────────────────────────────┐
│                  AI Module (ai/)                 │
│                                                  │
│  ┌─────────────────┐  ┌─────────────────────┐   │
│  │  configs/        │  │  prompts/            │   │
│  │  gemini.config   │  │  emergency-analysis  │   │
│  │  prompts.config  │  │  evidence-summary    │   │
│  └────────┬────────┘  │  complaint-draft     │   │
│           │           │  incident-report     │   │
│           │           │  heartbeat           │   │
│           │           │  safe-route          │   │
│           │           └──────────┬──────────┘   │
│           │                      │               │
│  ┌────────┴──────────────────────┴────────────┐  │
│  │              Prompt Engine                  │  │
│  │  interpolateTemplate() + promptConfigs      │  │
│  └────────┬───────────────────────────────────┘  │
│           │                                      │
│  ┌────────┴───────────────────────────────────┐  │
│  │              Gemini Service                 │  │
│  │  generateText() / generateJSON()            │  │
│  │  analyzeEmergency() / summarizeEvidence()   │  │
│  │  draftComplaint() / generateIncidentReport()│  │
│  │  suggestSafeRoute()                         │  │
│  └────────┬───────────────────────────────────┘  │
│           │                                      │
│  ┌────────┴──────────────┐  ┌─────────────────┐  │
│  │  utils/               │  │  schemas/        │  │
│  │  parser.ts            │  │  incident.schema │  │
│  │  formatter.ts         │  │  report.schema   │  │
│  │  validator.ts         │  │  summary.schema  │  │
│  └───────────────────────┘  └─────────────────┘  │
└──────────────────────────────────────────────────┘
```

## Prompt Engineering Strategy

### Template System

All prompts use a **configuration-driven** approach defined in `configs/prompts.config.ts`:

```typescript
{
  key: "emergencyAnalysis",
  systemPrompt: "...",       // Role and behavioral instructions
  userTemplate: "...",       // Template with {{variable}} placeholders
  outputFormat: "json",      // Expected response format
  maxTokens: 2048,           // Token budget
  temperature: 0.5           // Creativity control
}
```

Templates are interpolated at runtime using `interpolateTemplate()`, which replaces `{{key}}` placeholders with actual data values.

### Prompt Files

Each task has a dedicated markdown prompt file in `ai/prompts/` containing:
- **System Role** — AI persona and behavioral constraints
- **Instructions** — Output format, tone, and quality requirements
- **Expected Input** — JSON schema of the input data
- **Expected Output** — JSON schema or structure of the desired response
- **Quality Criteria** — Acceptance criteria for AI output validation

### Safety Settings

Gemini safety thresholds are configured in `configs/gemini.config.ts`:

| Category | Threshold |
|---|---|
| Harassment | BLOCK_MEDIUM_AND_ABOVE |
| Hate Speech | BLOCK_MEDIUM_AND_ABOVE |
| Sexually Explicit | BLOCK_MEDIUM_AND_ABOVE |
| Dangerous Content | BLOCK_ONLY_HIGH |

The `DANGEROUS_CONTENT` threshold is set lower because the platform legitimately discusses emergency situations.

## Validation Pipeline

Every AI response passes through a three-stage validation pipeline:

1. **Format Validation** — `parser.ts` extracts JSON from potentially noisy responses
2. **Schema Validation** — `schemas/*.schema.ts` (Zod) validates the structure
3. **Content Validation** — `validator.ts` checks domain-specific constraints

```
AI Response → stripCodeFences() → extractJSON() → Zod.parse() → validateX() → Clean Data
```

## Retry Strategy

The Gemini service uses exponential backoff for transient failures:

| Attempt | Delay |
|---|---|
| 1st retry | 1 second |
| 2nd retry | 2 seconds |
| 3rd retry | 4 seconds (capped at 10s) |

After 3 failures, the request is rejected with an error.

## Token Budget Management

Each task type has a dedicated token budget to control costs and response times:

| Task | Max Tokens |
|---|---|
| Emergency Analysis | 2,048 |
| Evidence Summary | 4,096 |
| Complaint Draft | 4,096 |
| Incident Report | 4,096 |
| Safe Route | 1,024 |
| Heartbeat Analysis | 512 |
