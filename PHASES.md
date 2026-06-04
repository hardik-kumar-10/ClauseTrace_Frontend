# ClauseTrace Frontend — Development Phases

> Scaffold is complete. These phases take the project from "files exist" to
> "fully functional, tested, and demo-ready."

---

## Phase 1 — Dev Environment & Shell
**Goal:** Every route loads without crashing. Dev server is usable.

### Tasks
- [ ] Create `.env.local` from `.env.example`
- [ ] Run `npm run dev` — fix any import/path errors
- [ ] Verify all 4 routes render (even if blank/skeleton)
- [ ] Create `mock/socket-server.js` — a local Socket.io server that emits fake
      `transcript:segment`, `entity:extracted`, `match:historical`, `incident:state`
      events on a loop so frontend dev can proceed without the real backend
- [ ] Add `"mock": "node mock/socket-server.js"` script to `package.json`

### Done when
All 4 pages open in browser without console errors. Mock server emits events and browser console shows them.

---

## Phase 2 — War Room Static UI (No live data)
**Goal:** The 4-panel layout looks correct with hardcoded mock data. No socket needed.

### Tasks
- [ ] **DashboardGrid**: confirm 2×2 desktop / stacked mobile layout, fix panel heights so they fill viewport without overflow
- [ ] **Header**: MTTR clock ticking, severity badge, state label, Close Incident button visible
- [ ] **TranscriptPanel**: render 5–10 hardcoded segments; entity legend visible; inline `<mark>` highlights rendering
- [ ] **TranscriptSegment**: speaker label, timestamp, interim muted style, highlighted spans
- [ ] **EntityPanel**: render grouped entities by type; all 5 entity type sections showing badges; click selects/deselects
- [ ] **MatchCard**: similarity colour coding (green ≥80%, amber ≥60%, grey below); "View full incident" button
- [ ] **MatchesPanel**: list of 3 hardcoded MatchCards; selected-entity filter label shown
- [ ] **StateMapPanel**: all 5 state steps rendered; active step highlighted; transition timeline list
- [ ] **PanelShell**: manually test all 5 states (`loading`, `empty`, `live`, `error`, `stale`) by temporarily passing each as a prop
- [ ] **Drawer**: opens/closes; Escape key closes; backdrop click closes; scroll works inside
- [ ] **Responsive**: at 768 px viewport, panels stack vertically, all readable

### Done when
A screenshot of the dashboard could be used in a capstone slide deck. All panels look intentional, not broken.

---

## Phase 3 — Real-time Socket Integration
**Goal:** The war room updates live from the mock socket server (or real backend).

### Tasks
- [ ] Connect `useSocket(incidentId)` in `WarRoomPage` — verify socket connects on mount, disconnects on unmount
- [ ] `StatusIndicator` shows "Connected" once socket is up
- [ ] **Transcript streaming**: new segments appear at the bottom as the mock server emits them
- [ ] **Auto-scroll**: transcript scrolls to bottom automatically; pauses when user scrolls up; "Resume live scroll" button appears and works
- [ ] **Interim → final**: mock server emits same `segmentId` twice (once `isFinal: false`, once `isFinal: true`) — verify old row is replaced, not duplicated
- [ ] **Entity extraction**: entities appear in EntityPanel live; de-duplication working (same value+type not added twice)
- [ ] **Inline highlighting**: when entities arrive, previously received transcript segments re-render with highlight spans
- [ ] **Historical matches**: `match:historical` event updates MatchesPanel; clicking an entity in EntityPanel shows the "Filtered by" label
- [ ] **Incident state**: `incident:state` event moves the active step in StateMapPanel; transition timeline grows
- [ ] **rAF buffer**: manually fire 200 events/second from mock server — confirm no visible UI freeze or dropped frames
- [ ] **Disconnect/reconnect**: kill the mock server and restart it — UI shows "Reconnecting" then "Connected" without page reload; no data lost

### Done when
A full simulated incident can be watched live in the browser from start to finish using only the mock server.

---

## Phase 4 — REST API Integration
**Goal:** Every REST-backed screen works against the real (or mocked) API.

### Tasks
- [ ] **LandingPage**: `GET /api/incidents?active=true` populates the list; "New Incident" calls `POST /api/incidents` and navigates to the new war room
- [ ] **WarRoomPage mount**: `GET /api/incidents/:id` loads incident metadata into `incidentStore` before socket connects — header shows title/severity immediately
- [ ] **Close Incident**: `POST /api/incidents/:id/close` called; page navigates to `/incident/:id/postmortem` when ready
- [ ] **PostMortemPage**: `GET /api/incidents/:id/postmortem` loads all sections; loading skeleton shows while waiting; error message shown if still generating
- [ ] **IncidentDrawer**: clicking "View full incident" on a MatchCard opens drawer and fetches past incident post-mortem via same endpoint
- [ ] **HistoryPage**: `GET /api/incidents` with `query`, `severity`, `page` params; search input triggers re-fetch with 300 ms debounce; "Load more" pagination works
- [ ] Axios 401/403 interceptor: redirect to login page (placeholder) if backend adds auth

### Done when
All screens work end-to-end with either the real backend or a JSON mock server (`json-server` or `msw`).

---

## Phase 5 — Post-Mortem & Export
**Goal:** Post-mortem is readable, complete, and all three export paths work.

### Tasks
- [ ] All PRD sections render: Summary, Timeline, Root Cause, Resolution, Action Items, Affected Services
- [ ] "Auto-generated" badge clearly visible
- [ ] **Download Markdown**: clicking button downloads a `.md` file with correct content
- [ ] **PDF**: `window.print()` produces a readable printout; add `print:` Tailwind variants to hide export toolbar and colour backgrounds correctly in print media
- [ ] **Copy to clipboard**: button label switches to "✓ Copied" for 2 seconds; clipboard contains full Markdown

### Done when
A complete post-mortem can be exported in all three formats without errors.

---

## Phase 6 — Polish & Non-Functional Requirements
**Goal:** Meets every NFR in §7 of the PRD.

### Tasks
- [ ] **Virtual scrolling**: if transcript exceeds ~200 segments, switch to `@tanstack/virtual` windowed list to keep DOM size bounded
- [ ] **Latency**: measure time from socket event receipt to DOM update — target < 200 ms
- [ ] **Lighthouse**: run audit in Chrome DevTools; reach Performance ≥ 80; fix any blocking resources or oversized images
- [ ] **Keyboard navigation**: Tab through panels, Enter/Space on entity badges and match cards, Escape closes drawer
- [ ] **Colour contrast**: check all entity highlight colours with APCA or WCAG AA; pair every colour with an icon (not colour alone)
- [ ] **Error boundaries**: add a React `ErrorBoundary` at page level so a crash in one panel doesn't blank the whole screen
- [ ] **Tablet layout**: test at 768–1023 px width; confirm tabbed/stacked layout is usable
- [ ] **Initial load**: measure dashboard first-contentful-paint on a standard connection; target < 3 s

### Done when
Lighthouse Performance ≥ 80. No accessibility failures in axe DevTools. Disconnect/reconnect cycle works reliably 5 times in a row.

---

## Phase 7 — Acceptance Testing & Demo Prep
**Goal:** Every acceptance criterion in §11 of the PRD is demonstrably met.

### Tasks
- [ ] **AC-1**: Run simulated incident — live transcript appears with correctly highlighted entities
- [ ] **AC-2**: Historical fixes appear and update as new entities are extracted; confirm they render within the 2 s latency budget
- [ ] **AC-3**: Backend state transition (`INVESTIGATING → MITIGATING`) reflected in StateMapPanel in real time
- [ ] **AC-4**: Closing an incident navigates to a complete, exportable post-mortem
- [ ] **AC-5**: Force disconnect during a live session → reconnect → no page reload, no data loss
- [ ] Cross-browser smoke test: Chrome, Edge, Firefox
- [ ] Record a 2–3 min demo video walking through a full incident lifecycle for capstone submission

### Done when
All 5 acceptance criteria pass in a live demo. The app is deployed to Vercel.

---

## Phase Summary

| Phase | Focus | Estimated Effort |
|---|---|---|
| 1 | Dev environment + mock server | 0.5–1 day |
| 2 | Static war-room UI | 2–3 days |
| 3 | Socket / real-time | 2–3 days |
| 4 | REST API integration | 1–2 days |
| 5 | Post-mortem + export | 0.5–1 day |
| 6 | Polish + NFRs | 1–2 days |
| 7 | Acceptance testing + demo | 1 day |

**Total: ~9–13 days of focused work**
