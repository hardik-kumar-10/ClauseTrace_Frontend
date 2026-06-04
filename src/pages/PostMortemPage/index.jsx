import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import PostMortemViewer from '@/features/postmortem/PostMortemViewer'
import Skeleton from '@/components/ui/Skeleton'
import { postmortemApi } from '@/services/api/postmortemApi'

export default function PostMortemPage() {
  const { id }   = useParams()
  const [pm,      setPm]     = useState(null)
  const [loading, setLoading] = useState(true)
  const [error,   setError]  = useState(null)

  useEffect(() => {
    postmortemApi.get(id)
      .then(setPm)
      .catch(() => setError('Post-mortem not ready yet. It may still be generating.'))
      .finally(() => setLoading(false))
  }, [id])

  return (
    <div className="min-h-screen bg-surface">
      <header className="h-14 flex items-center justify-between px-8 border-b border-surface-border">
        <Link to="/" className="text-base font-bold tracking-tight text-slate-100">ClauseTrace</Link>
        <Link to={`/incident/${id}`} className="text-sm text-blue-400 hover:text-blue-300">
          ← Back to War Room
        </Link>
      </header>

      {loading && <Skeleton lines={12} className="max-w-3xl mx-auto mt-10" />}

      {error && (
        <div className="max-w-3xl mx-auto mt-10 p-6 rounded-xl border border-surface-border bg-surface-raised text-slate-400 text-sm">
          {error}
        </div>
      )}

      {pm && <PostMortemViewer postmortem={pm} />}
    </div>
  )
}
