import clsx from 'clsx'

export default function Skeleton({ lines = 4, className }) {
  return (
    <div className={clsx('p-4 space-y-2', className)} aria-busy="true">
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className="h-3 rounded bg-surface-border animate-pulse"
          style={{ width: `${70 + (i % 3) * 10}%` }}
        />
      ))}
    </div>
  )
}
