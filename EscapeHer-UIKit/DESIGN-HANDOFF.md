# EscapeHer — UI/UX handoff (Kamaljit)

Design direction: **trust & calm**. Most safety apps go loud and red by
default; this one stays composed, so red is reserved only for a live,
active danger state and never used decoratively. The logo is a pair of
protective wings cradling a small spark — echoed as the "living pulse"
in `HeartbeatIndicator`, which is the signature visual of the kit.

## What's inside

```
public/logo/
  icon-mark.svg         mark only, transparent bg
  logo-full.svg         mark + wordmark, for headers/README
  logo-mono-white.svg   single-color, for dark surfaces/footers
  favicon.svg           app-icon badge version

public/icons/           4 brand line-icons (lucide-style, 24x24, stroke=currentColor)
  pulse-wave.svg  siren-alert.svg  safe-route-pin.svg  shield-lock.svg

client/src/components/
  providers/ThemeProvider.tsx    <- design tokens live here
  providers/AuthProvider.tsx     <- branded loading shell only
  providers/QueryProvider.tsx    <- React Query boilerplate
  heartbeat/HeartbeatIndicator.tsx
  timeline/IncidentTimeline.tsx
  contacts/ContactCard.tsx, ContactList.tsx
  charts/EmergencyChart.tsx, ResponseChart.tsx
  modals/EmergencyModal.tsx, ConfirmModal.tsx, ContactModal.tsx
  maps/LiveMap.tsx, SafeRoute.tsx
```

## Color tokens (defined in `ThemeProvider.tsx`, use via Tailwind arbitrary values)

| Token | Hex (light) | Meaning |
|---|---|---|
| `--eh-teal-500` | `#159A8D` | Primary brand color |
| `--eh-blue-600` | `#2C6E8F` | Trust / secondary |
| `--eh-spark-500` | `#E8A33D` | Hope / awaiting-confirmation accent |
| `--eh-danger-600` | `#C23B3B` | **Only** for a live/active danger state |
| `--eh-safe-600` | `#2E9A6A` | Confirmed-safe state |
| `--eh-ink-900` / `--eh-ink-600` | `#16262A` / `#4B6068` | Text |
| `--eh-mist-50` / `--eh-mist-200` | `#F3F7F6` / `#E1EAE8` | Backgrounds / hairlines |

Dark-mode values are already included (`[data-theme="dark"]` block) —
they'll apply automatically once `ThemeContext`/`useTheme` toggles the
`data-theme` attribute. Example usage in any component:
`className="bg-[var(--eh-teal-500)] text-[var(--eh-mist-50)]"`.

## Type system

- Display/headings: **Manrope** (700–800)
- Body/UI: **Inter**
- Timestamps, coordinates, incident IDs: **IBM Plex Mono** — this is
  deliberate, it gives the evidence/timeline views a verified,
  forensic feel that plain UI text doesn't.

Fonts aren't bundled (kept these files dependency-free). Add once, in
`layout.tsx`, e.g. with `next/font/google` for Manrope + Inter, and
either `next/font/google` (IBM Plex Mono) or a `<link>` to Google Fonts.

## Dependencies these components expect

```
npm install lucide-react recharts @tanstack/react-query
```

## Notes for whoever wires these up

- `LiveMap` and `SafeRoute` render a branded placeholder in place of a
  real map. Pass the actual `<GoogleMap>`/marker render as `children`
  and the placeholder disappears automatically — no prop changes
  needed on this end.
- `AuthProvider` here is presentational only (a branded loading
  screen) — real session logic stays in `AuthContext`/`useAuth`. Pass
  it `isInitializing` from that context.
- Everything is a client component (`"use client"`) since these all
  hold state or animate.

## Committing this to the repo

```bash
git clone https://github.com/kamalsolanki143/EscapeHer.git
cd EscapeHer
# copy the client/ and public/ folders from this kit into place
git checkout -b design/ui-kit-kamaljit
git add client/src/components public/logo public/icons
git commit -m "Add EscapeHer UI kit: logo, design tokens, and UI/UX components"
git push origin design/ui-kit-kamaljit
# then open a PR so the team can review before merging to main
```
