import clsx from 'clsx'
import Skeleton from './Skeleton'
import { useUiStore } from '@/store/uiStore'

/**
 * Wrapper that enforces the 5 required panel states for every data panel:
 * loading → empty → live → error → stale/reconnecting  (§8 of PRD)
 */
export default function PanelShell({ title, status, children, onRetry, className }) {
  const socketStatus = useUiStore(s => s.socketStatus)
  const isStale      = socketStatus !== 'connected' && status === 'live'

  return (
    <section
      className={clsx(
        'flex flex-col bg-surface-raised border border-surface-border rounded-xl overflow-hidden',
        className
      )}
    >
      {/* Panel header */}
      <header className="flex items-center justify-between px-4 py-2.5 border-b border-surface-border shrink-0">
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest">
          {title}
        </span>
        {status === 'live' && !isStale && (
          <span className="flex items-center gap-1.5 text-xs text-emerald-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Live
          </span>
        )}
        {isStale && (
          <span className="text-xs text-amber-400 animate-pulse">Reconnecting…</span>
        )}
      </header>

      {/* Panel body */}
      <div className="flex-1 overflow-auto scrollbar-thin min-h-0">
        {status === 'loading' && <Skeleton />}

        {status === 'error' && (
          <div className="flex flex-col items-center justify-center h-full gap-3 py-10 text-slate-500">
            <span className="text-sm">Failed to load data</span>
            {onRetry && (
              <button
                onClick={onRetry}
                className="text-xs text-blue-400 underline hover:text-blue-300"
              >
                Retry
              </button>
            )}
          </div>
        )}

        {status === 'empty' && (
          <div className="flex items-center justify-center h-full py-10 text-slate-600 text-sm">
            No data yet
          </div>
        )}

        {(status === 'live' || status === 'stale') && (
          <div className={clsx(isStale && 'opacity-50 pointer-events-none')}>
            {children}
          </div>
        )}
      </div>
    </section>
  )
}
