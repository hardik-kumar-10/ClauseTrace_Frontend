# ClauseTrace Frontend — Architecture

## Stack

| Concern | Choice | Why |
|---|---|---|
| Framework | React 18 + Vite | Functional components, concurrent features, fast HMR |
| Styling | Tailwind CSS | Utility-first, dark-mode palette baked into config |
| Real-time | Socket.io client | Matches backend transport; handles reconnects natively |
| State | Zustand | Minimal boilerplate; stable selectors; no provider wrapping |
| HTTP | Axios | Timeout config, interceptors for auth headers |
| Routing | React Router v6 | File-like routes, nested layouts |
| Deployment | Vercel | Push-to-deploy from main |

---

## Directory Layout

```
src/
├── App.jsx                        ← Router root (4 routes)
├── main.jsx                       ← ReactDOM entry
├── index.css                      ← Tailwind directives + scrollbar utilities
│
├── config/
│   ├── entityTypes.js             ← Entity type → color/icon/label  (single source of truth)
│   └── incidentStates.js          ← State machine labels + colors
│
├── services/
│   ├── socket/
│   │   ├── socketClient.js        ← Singleton io() instance
│   │   ├── socketEvents.js        ← Event name constants
│   │   └── useSocket.js           ← Hook: join room, wire events → stores, rAF flush buffer
│   └── api/
│       ├── incidentsApi.js        ← REST CRUD for incidents
│       └── postmortemApi.js       ← REST GET for post-mortem
│
├── store/                         ← Zustand stores (one per domain)
│   ├── incidentStore.js           ← incident metadata + state history
│   ├── transcriptStore.js         ← segments array (upsert-by-id)
│   ├── entitiesStore.js           ← entities map + selected entity + getGrouped()
│   ├── matchesStore.js            ← historical match results
│   └── uiStore.js                 ← socketStatus, drawer open/close
│
├── hooks/
│   ├── useAutoScroll.js           ← Pause-on-scroll, resume-to-bottom
│   └── useElapsedTime.js          ← Live HH:MM:SS timer
│
├── utils/
│   ├── textHighlighter.js         ← Splits text into plain/highlighted runs for inline entity tags
│   └── formatters.js              ← date-fns wrappers (time, date, relative, pct)
│
├── components/
│   ├── ui/
│   │   ├── PanelShell.jsx         ← 5-state wrapper (loading/empty/live/error/stale) — every panel uses this
│   │   ├── Skeleton.jsx           ← Animated placeholder lines
│   │   ├── StatusIndicator.jsx    ← Socket connected/reconnecting/disconnected dot
│   │   └── Drawer.jsx             ← Slide-in side panel (used for past incident detail)
│   └── layout/
│       ├── DashboardGrid.jsx      ← 2×2 grid desktop / stacked tablet
│       └── Header.jsx             ← Incident title, severity, MTTR clock, Close button
│
├── features/                      ← Feature modules (co-located component + sub-components)
│   ├── transcript/
│   │   ├── TranscriptPanel.jsx    ← Panel A: auto-scroll list, legend, pause affordance
│   │   └── TranscriptSegment.jsx  ← Single line: speaker, timestamp, inline entity highlights
│   ├── entities/
│   │   ├── EntityPanel.jsx        ← Panel B: grouped by type, click to filter matches
│   │   └── EntityBadge.jsx        ← Clickable entity pill with confidence %
│   ├── historicalMatches/
│   │   ├── MatchesPanel.jsx       ← Panel C: list of MatchCards + drawer trigger
│   │   ├── MatchCard.jsx          ← Title, similarity %, root cause, resolution, date
│   │   └── IncidentDrawer.jsx     ← Fetches & renders full past incident on demand
│   ├── incidentState/
│   │   └── StateMapPanel.jsx      ← Panel D: progress steps + transition timeline
│   └── postmortem/
│       ├── PostMortemViewer.jsx   ← Structured sections + export toolbar
│       └── PostMortemExport.jsx   ← downloadMarkdown(), downloadPDF(), copyToClipboard()
│
└── pages/                         ← Route-level components (thin orchestrators)
    ├── LandingPage/index.jsx      ← Active incident list, New Incident button
    ├── WarRoomPage/index.jsx      ← Mounts socket hook + DashboardGrid
    ├── PostMortemPage/index.jsx   ← Fetches & renders PostMortemViewer
    └── HistoryPage/index.jsx      ← Search/filter + paginated incident list
```

---

## Data Flow

```
Discord Listener Bot
        │  (audio)
        ▼
    Backend (Node)
        │  Socket.io events
        ├─ transcript:segment  ─────────────────────────────┐
        ├─ entity:extracted    ──────────────────────────┐  │
        ├─ match:historical    ───────────────────────┐  │  │
        └─ incident:state      ────────────────────┐  │  │  │
                                                   │  │  │  │
                                          useSocket.js (rAF flush buffer)
                                                   │  │  │  │
                                     ┌─────────────┘  │  │  │
                                     │  ┌─────────────┘  │  │
                                     │  │  ┌─────────────┘  │
                                     │  │  │  ┌─────────────┘
                                     ▼  ▼  ▼  ▼
                              Zustand stores (incidentStore, transcriptStore,
                                             entitiesStore, matchesStore)
                                                   │
                                          React re-renders
                                    (TranscriptPanel, EntityPanel,
                                     MatchesPanel, StateMapPanel)

    Backend REST API
        ├─ GET /incidents        →  LandingPage, HistoryPage
        ├─ GET /incidents/:id    →  WarRoomPage (initial load)
        └─ GET /incidents/:id/postmortem  →  PostMortemPage, IncidentDrawer
```

---

## Key Architectural Decisions

### 1. rAF Flush Buffer (FE-13)
`useSocket.js` never writes directly to a store from a socket event callback.  
Instead it pushes events into a `bufferRef` (no state, no re-render) and a
`requestAnimationFrame` loop drains the buffer once per frame. This bounds
re-renders to ~60/s regardless of event volume.

### 2. Centralized Entity Config (`src/config/entityTypes.js`)
All entity type → color/icon/label mappings live in one file. Adding a new
backend entity type requires editing only this file — no hunt across styling,
panels, or the highlighter. (Satisfies §7 maintainability requirement.)

### 3. PanelShell Enforces 5 UI States
Every data panel renders through `PanelShell`, which accepts a `status` prop
and handles `loading / empty / live / error / stale` uniformly. Panels never
render a blank div — loading skeletons and error retries are guaranteed.

### 4. Upsert-by-ID Transcript (FE-02)
`transcriptStore.addSegments` merges incoming segments by `segmentId`. This
correctly handles backend resending a final segment to replace an interim
segment without duplicating rows.

### 5. Disconnect/Reconnect Resilience (FE-12)
`useSocket` re-emits `incident:join` on every `reconnect` event so the server
re-associates the socket with the room. The transcript and entity stores keep
their last-known data during disconnect; `PanelShell` dims them via the
`isStale` flag derived from `uiStore.socketStatus`.

### 6. Route → Page → Feature boundary
Pages are thin: they fetch initial REST data, mount the socket hook, and
compose feature panels. Feature panels own their own store subscriptions.
This keeps pages testable in isolation by mocking stores.

---

## Routes

| Path | Component | Responsibility |
|---|---|---|
| `/` | LandingPage | List active incidents; create new |
| `/incident/:id` | WarRoomPage | Full 4-panel war room |
| `/incident/:id/postmortem` | PostMortemPage | Read-only post-mortem + export |
| `/history` | HistoryPage | Searchable past incidents |

---

## Environment Variables

| Variable | Default | Purpose |
|---|---|---|
| `VITE_SOCKET_URL` | `http://localhost:3001` | Socket.io server |
| `VITE_API_BASE_URL` | `http://localhost:3001/api` | REST API base |

Copy `.env.example` → `.env.local` and fill in values.

---

## Getting Started

```bash
npm install
cp .env.example .env.local
# edit .env.local with backend URLs
npm run dev
```
