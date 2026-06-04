import { useState } from 'react'
import { downloadMarkdown, downloadPDF, copyToClipboard } from './PostMortemExport'
import { fmt } from '@/utils/formatters'

function Section({ title, children }) {
  return (
    <section className="space-y-2">
      <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-widest border-b border-surface-border pb-1">
        {title}
      </h3>
      <div className="text-slate-300 text-sm leading-relaxed">{children}</div>
    </section>
  )
}

export default function PostMortemViewer({ postmortem }) {
  const [copied, setCopied] = useState(false)
  const pm = postmortem

  async function handleCopy() {
    await copyToClipboard(pm)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8 py-8 px-4 print:px-0 print:py-0">
      {/* Header */}
      <div className="space-y-1">
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 font-semibold">
            Auto-generated
          </span>
          <span>ClauseTrace AI · Incident {pm.incidentId}</span>
        </div>
        <h1 className="text-2xl font-bold text-slate-100">{pm.title}</h1>
        <p className="text-sm text-slate-500">{fmt.date(pm.date)} · Severity {pm.severity}</p>
      </div>

      {/* Export controls */}
      <div className="flex gap-3 print:hidden">
        <button onClick={() => downloadMarkdown(pm)}
          className="px-3 py-1.5 text-xs rounded bg-slate-700 hover:bg-slate-600 text-slate-200">
          ↓ Markdown
        </button>
        <button onClick={downloadPDF}
          className="px-3 py-1.5 text-xs rounded bg-slate-700 hover:bg-slate-600 text-slate-200">
          ↓ PDF
        </button>
        <button onClick={handleCopy}
          className="px-3 py-1.5 text-xs rounded bg-slate-700 hover:bg-slate-600 text-slate-200">
          {copied ? '✓ Copied' : '⎘ Copy'}
        </button>
      </div>

      {/* Content */}
      <Section title="Summary"><p>{pm.summary}</p></Section>

      {pm.timeline?.length > 0 && (
        <Section title="Timeline">
          <ol className="space-y-1">
            {pm.timeline.map((t, i) => (
              <li key={i} className="flex gap-3">
                <span className="font-mono text-slate-600 shrink-0">{t.time}</span>
                <span>{t.event}</span>
              </li>
            ))}
          </ol>
        </Section>
      )}

      <Section title="Root Cause"><p>{pm.rootCause}</p></Section>
      <Section title="Resolution"><p>{pm.resolution}</p></Section>

      {pm.actionItems?.length > 0 && (
        <Section title="Action Items">
          <ul className="space-y-1">
            {pm.actionItems.map((a, i) => (
              <li key={i} className="flex gap-2">
                <span className="text-slate-600">□</span> {a}
              </li>
            ))}
          </ul>
        </Section>
      )}

      {pm.affectedServices?.length > 0 && (
        <Section title="Affected Services">
          <div className="flex flex-wrap gap-2">
            {pm.affectedServices.map(s => (
              <span key={s} className="text-xs px-2 py-0.5 rounded bg-surface-border text-slate-300">{s}</span>
            ))}
          </div>
        </Section>
      )}
    </div>
  )
}
