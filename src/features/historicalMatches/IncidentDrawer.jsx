import { useState, useEffect } from 'react'
import Drawer from '@/components/ui/Drawer'
import Skeleton from '@/components/ui/Skeleton'
import { useUiStore } from '@/store/uiStore'
import { postmortemApi } from '@/services/api/postmortemApi'
import { fmt } from '@/utils/formatters'

export default function IncidentDrawer() {
  const incidentId = useUiStore(s => s.activeDrawerIncidentId)
  const closeDrawer = useUiStore(s => s.closeDrawer)

  const [data,    setData]    = useState(null)
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState(null)

  useEffect(() => {
    if (!incidentId) { setData(null); return }
    setLoading(true)
    setError(null)
    postmortemApi.get(incidentId)
      .then(setData)
      .catch(() => setError('Could not load this incident.'))
      .finally(() => setLoading(false))
  }, [incidentId])

  return (
    <Drawer open={!!incidentId} onClose={closeDrawer} title="Past Incident Detail">
      {loading && <Skeleton lines={8} />}
      {error   && <p className="text-sm text-red-400">{error}</p>}
      {data && (
        <div className="space-y-5 text-sm">
          <h3 className="text-base font-semibold text-slate-100">{data.title}</h3>
          <p className="text-slate-400 text-xs">{fmt.date(data.date)}</p>

          {[
            { label: 'Summary',          key: 'summary' },
            { label: 'Root Cause',       key: 'rootCause' },
            { label: 'Resolution',       key: 'resolution' },
            { label: 'Affected Services',key: 'affectedServices' },
          ].map(({ label, key }) => data[key] && (
            <section key={key}>
              <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">{label}</h4>
              <p className="text-slate-300 leading-relaxed">
                {Array.isArray(data[key]) ? data[key].join(', ') : data[key]}
              </p>
            </section>
          ))}
        </div>
      )}
    </Drawer>
  )
}
