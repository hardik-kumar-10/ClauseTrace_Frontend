/**
 * Four-quadrant war-room layout.
 * Desktop: 2×2 grid.  Tablet (<1024px): stacked single column (FE-14).
 */
export default function DashboardGrid({ panelA, panelB, panelC, panelD }) {
  return (
    <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-3 p-3 min-h-0 overflow-hidden">
      {/* Panel A — Transcript (left-top) */}
      <div className="min-h-0">{panelA}</div>

      {/* Panel B — Entities (right-top) */}
      <div className="min-h-0">{panelB}</div>

      {/* Panel C — Historical Matches (left-bottom) */}
      <div className="min-h-0">{panelC}</div>

      {/* Panel D — Incident State Map (right-bottom) */}
      <div className="min-h-0">{panelD}</div>
    </div>
  )
}
