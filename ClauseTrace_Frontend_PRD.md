# ClauseTrace AI — Frontend Product Requirements Document (PRD)

**Document Owner:** Frontend & UI/UX Team (Kumar Kashish, Hardik Kumar)
**Project:** ClauseTrace AI — Intelligent Incident War Room
**Version:** 1.0
**Last Updated:** March 2026
**Status:** Draft for Capstone Review

---

## 1. Overview

The ClauseTrace AI frontend is a **mission-control-style web dashboard** that serves as the live operator surface during a production incident "War Room" call. It renders, in real time, the streamed transcript of the call, the technical entities extracted from that transcript, suggested historical fixes pulled from cross-incident memory, the evolving state of the incident, and the auto-generated post-mortem on closure.

The frontend is a **presentation and interaction layer only**. It holds no business logic for transcription, entity extraction, or search; it consumes data pushed by the backend over a Socket.io channel and renders REST responses. The design priority is **glanceability under pressure** — an on-call engineer must be able to absorb critical state in seconds while actively diagnosing a fault.

### 1.1 Goals

- Display live transcription, extracted entities, suggested fixes, and incident state in a single responsive interface (maps to Objective iii).
- Surface relevant historical context within ~2 seconds of it being produced by the backend, so the UI never becomes the bottleneck.
- Provide a clean, readable post-mortem viewer with export capability.
- Achieve usable performance on standard laptop screens (primary) and degrade gracefully on tablet widths.

### 1.2 Non-Goals

- The frontend does **not** capture or process audio. Audio ingestion happens via the Discord Listener Bot on the backend.
- The frontend does **not** run ML inference, embeddings, or vector search.
- No native mobile app in this scope (responsive web only).
- No user authentication beyond a basic session/role gate (full auth is a backend concern, treated as a dependency below).

---

## 2. Target Users & Personas

| Persona | Role in War Room | Primary Need from UI |
|---|---|---|
| **On-call Engineer (primary)** | Actively diagnosing the fault | Hands-free context: live entities + matched past incidents without manual searching |
| **Incident Commander** | Coordinates the response | Big-picture incident state, timeline, who/what is in scope |
| **Observer / SRE** | Provides telemetry context | Read-only view of transcript and entities |
| **Post-incident Reviewer** | Writes/reads the post-mortem | Clean, complete, exportable post-mortem report |

---

## 3. Tech Stack & Constraints

- **Framework:** React.js (functional components + hooks)
- **Styling:** Tailwind CSS (utility-first, no heavy component library required)
- **Real-time transport:** Socket.io client (bidirectional streaming with the backend)
- **HTTP:** REST calls (e.g. `fetch`/`axios`) for non-streaming reads such as incident history and post-mortem retrieval
- **State management:** React state + context for session/incident-scoped state; a lightweight store (e.g. Zustand or Redux Toolkit) if global state grows
- **Hosting / Deployment:** Vercel (CI/CD on push to main)
- **Browser support:** Latest 2 versions of Chrome, Edge, Firefox; Safari best-effort

**Constraint:** The UI must remain responsive (no dropped frames, no UI lock) while receiving a continuous stream of transcript chunks and entity events. All streaming updates must be batched/throttled where necessary to avoid re-render storms.

---

## 4. Information Architecture

Single primary route — the **War Room Dashboard** — composed of coordinated panels, plus a secondary **Post-Mortem** view and an **Incident History** browse view.

```
/                       → Landing / active-incidents list
/incident/:id           → Live War Room Dashboard (primary screen)
/incident/:id/postmortem → Post-Mortem report viewer
/history                → Searchable list of past incidents
```

---

## 5. Screens & Panels

### 5.1 War Room Dashboard (Primary Screen)

A four-quadrant mission-control layout. All panels share one incident context and update live.

#### Panel A — Live Transcript
- Renders the streaming ASR transcript as it arrives, newest at the bottom, auto-scrolling (with a "pause auto-scroll" affordance when the user scrolls up).
- Each transcript segment shows speaker label (if available) and timestamp.
- **Inline entity highlighting:** error codes, stack traces, file paths, API endpoints, and service names are visually tagged within the transcript text (color-coded by entity type, with a legend).
- Interim (low-confidence) ASR text is shown in a muted style and replaced/firmed up as the backend finalizes it.

#### Panel B — Extracted Technical Entities
- A live, de-duplicated list of entities pulled from the transcript, grouped by type (Error Code, Stack Trace, File Path, API Endpoint, Service Name).
- Each entity is clickable → triggers/highlights the related historical matches in Panel C.
- Shows extraction confidence visually where provided by the backend.

#### Panel C — Suggested Historical Fixes (Cross-Incident Memory)
- Displays the top-N semantically similar past incidents returned by the backend's vector search.
- Each result card: incident title, similarity score, date, root cause summary, and the resolution that worked.
- "View full incident" expands the past incident's detail/post-mortem in a side drawer.
- Empty/loading/error states are first-class (see §8).

#### Panel D — Incident State Map
- A visual state indicator of the incident lifecycle: e.g. `Detected → Investigating → Mitigating → Monitoring → Resolved`.
- Shows current state, time-in-state, and a compact timeline of state transitions.
- Surfaces the live "state mapping" of which entities/services are currently implicated.

#### Global Dashboard Elements
- **Header:** incident ID/title, severity, elapsed time (live MTTR clock), connection status indicator (Socket.io connected/reconnecting/offline), and a "Close Incident" action.
- **Close Incident** triggers the backend post-mortem generation and routes the user to the Post-Mortem view when ready.

### 5.2 Post-Mortem Report Viewer
- Renders the LLM-generated structured post-mortem: summary, timeline, root cause, action items, affected services, and resolution.
- Clearly shows that the document was auto-generated and the source incident.
- **Export** to Markdown/PDF and copy-to-clipboard.
- Read-only in v1 (editing is a stretch goal).

### 5.3 Incident History / Search
- Searchable, filterable list of past incidents (by service, date range, entity, severity).
- Each row links to that incident's post-mortem.
- This is the human-facing entry point to the same searchable knowledge base the AI queries.

### 5.4 Landing / Active Incidents
- Lists currently active War Room sessions; selecting one joins its live dashboard.
- "New Incident" creates a session and (on the backend) provisions the listener bot.

---

## 6. Functional Requirements

| ID | Requirement | Priority |
|---|---|---|
| FE-01 | Establish and maintain a Socket.io connection scoped to the active incident; show live connection status. | Must |
| FE-02 | Render streaming transcript segments in order with timestamps and (optional) speaker labels. | Must |
| FE-03 | Highlight recognized technical entities inline within transcript text, color-coded by type with a legend. | Must |
| FE-04 | Maintain a live, de-duplicated entity panel grouped by entity type. | Must |
| FE-05 | Display top-N historical fix suggestions returned by the backend, with similarity score and resolution. | Must |
| FE-06 | Clicking an entity highlights/filters the related historical matches. | Should |
| FE-07 | Render the incident state map with current state, time-in-state, and transition timeline. | Must |
| FE-08 | Provide a "Close Incident" action that requests post-mortem generation and navigates to the report when ready. | Must |
| FE-09 | Render the auto-generated post-mortem and support export (Markdown/PDF) and copy. | Must |
| FE-10 | Provide a searchable/filterable incident history view backed by REST endpoints. | Should |
| FE-11 | Auto-scroll transcript with a pause-on-manual-scroll affordance. | Should |
| FE-12 | Gracefully handle reconnects: buffer/replay missed events or re-fetch incident state on reconnect. | Must |
| FE-13 | Batch/throttle high-frequency streaming updates to prevent re-render thrash. | Must |
| FE-14 | Responsive layout: full quad-panel on desktop, stacked/tabbed on tablet widths. | Should |

---

## 7. Non-Functional Requirements

- **Latency budget:** UI must render an incoming entity/match event within ~200ms of receipt so the end-to-end "verbal → on-screen context" stays within the 2-second product target.
- **Responsiveness:** No UI freeze under a sustained stream; long transcripts must virtualize/window the rendered DOM if needed.
- **Accessibility:** Sufficient color contrast for entity highlights (don't rely on color alone — pair with labels/icons); keyboard navigation for primary actions.
- **Resilience:** Connection drops must be visible and recoverable without a page reload.
- **Performance:** Initial dashboard load under ~3s on a standard connection; Lighthouse performance score ≥ 80.
- **Maintainability:** Component-driven structure; entity-type styling and config centralized so new entity types can be added without touching many files.

---

## 8. UI States (per data-driven panel)

Every data panel must explicitly handle:
- **Loading** — skeleton/placeholder while initial data or the socket connects.
- **Empty** — e.g. "No entities extracted yet," "No similar incidents found."
- **Streaming/Live** — actively updating, with a subtle live indicator.
- **Error** — backend/socket error with a retry affordance; never a blank panel.
- **Stale/Reconnecting** — connection lost; show last-known data dimmed plus a reconnect status.

---

## 9. Data Contracts (Frontend Expectations)

The frontend depends on the backend providing the following (exact schemas owned by the Backend PRD). Illustrative shapes:

**Socket event: `transcript:segment`**
```json
{ "incidentId": "string", "segmentId": "string", "speaker": "string|null",
  "text": "string", "isFinal": true, "ts": "ISO-8601" }
```

**Socket event: `entity:extracted`**
```json
{ "incidentId": "string", "entityId": "string",
  "type": "ERROR_CODE|STACK_TRACE|FILE_PATH|API_ENDPOINT|SERVICE_NAME",
  "value": "string", "confidence": 0.0, "sourceSegmentId": "string" }
```

**Socket event: `match:historical`**
```json
{ "incidentId": "string", "matches": [
  { "pastIncidentId": "string", "title": "string", "similarity": 0.0,
    "rootCause": "string", "resolution": "string", "date": "ISO-8601" } ] }
```

**Socket event: `incident:state`**
```json
{ "incidentId": "string", "state": "DETECTED|INVESTIGATING|MITIGATING|MONITORING|RESOLVED",
  "since": "ISO-8601" }
```

**REST: `GET /api/incidents/:id/postmortem`** → structured post-mortem object.
**REST: `GET /api/incidents?query=...`** → paginated incident history.

---

## 10. Dependencies & Risks

- **Backend availability:** All live data depends on the backend Socket.io server and REST API being up and emitting the contracts above. Frontend development should use a mock socket/server to proceed in parallel.
- **Stream volume:** A fast-talking War Room could produce high-frequency events; throttling strategy (FE-13) is a known risk to validate during integration (Phase 3).
- **Entity-type drift:** If the backend adds entity types, the frontend legend/styling must stay in sync — mitigated by centralized config (§7).
- **Reconnect correctness:** Replaying vs. re-fetching on reconnect (FE-12) needs a clear contract with the backend to avoid duplicate/missing segments.

---

## 11. Acceptance Criteria (Capstone-aligned)

- The dashboard renders live transcription with correctly highlighted technical entities during a simulated incident call.
- Historical fix suggestions appear and update as entities are extracted, with the UI rendering matches within the latency budget.
- The incident state map reflects backend state transitions in real time.
- Closing an incident produces and displays a complete, exportable post-mortem.
- The UI survives a forced socket disconnect/reconnect without a page reload and without losing incident context.
- Demonstrated on the simulated incident scenarios used for project evaluation (Phase 4 testing).

---

## 12. Out of Scope (v1) / Future Work

- In-dashboard editing of post-mortems.
- Multi-incident split-screen / war-room-of-war-rooms.
- Native mobile apps.
- Live audio waveform/visualizer in the UI.
- Role-based fine-grained permissions UI (depends on backend auth maturity).
