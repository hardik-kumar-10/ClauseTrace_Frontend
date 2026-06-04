import { useEffect } from 'react'
import clsx from 'clsx'

export default function Drawer({ open, onClose, title, children }) {
  useEffect(() => {
    if (!open) return
    const handler = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [open, onClose])

  return (
    <>
      {/* Backdrop */}
      <div
        className={clsx(
          'fixed inset-0 bg-black/60 z-40 transition-opacity duration-200',
          open ? 'opacity-100' : 'opacity-0 pointer-events-none'
        )}
        onClick={onClose}
      />

      {/* Panel */}
      <aside
        className={clsx(
          'fixed top-0 right-0 h-full w-full max-w-xl bg-surface-raised border-l border-surface-border z-50',
          'transform transition-transform duration-200 overflow-y-auto scrollbar-thin',
          open ? 'translate-x-0' : 'translate-x-full'
        )}
        role="dialog"
        aria-modal="true"
        aria-label={title}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-surface-border sticky top-0 bg-surface-raised">
          <h2 className="text-sm font-semibold text-slate-200">{title}</h2>
          <button
            onClick={onClose}
            className="text-slate-500 hover:text-slate-300 text-lg leading-none"
            aria-label="Close"
          >
            ×
          </button>
        </div>
        <div className="p-6">{children}</div>
      </aside>
    </>
  )
}
