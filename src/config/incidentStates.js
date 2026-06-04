export const INCIDENT_STATES = {
  DETECTED:     { label: 'Detected',     colorClass: 'text-slate-400',   ringClass: 'ring-slate-500' },
  INVESTIGATING:{ label: 'Investigating',colorClass: 'text-amber-400',   ringClass: 'ring-amber-500' },
  MITIGATING:   { label: 'Mitigating',   colorClass: 'text-orange-400',  ringClass: 'ring-orange-500' },
  MONITORING:   { label: 'Monitoring',   colorClass: 'text-blue-400',    ringClass: 'ring-blue-500' },
  RESOLVED:     { label: 'Resolved',     colorClass: 'text-emerald-400', ringClass: 'ring-emerald-500' },
}

export const STATE_SEQUENCE = [
  'DETECTED',
  'INVESTIGATING',
  'MITIGATING',
  'MONITORING',
  'RESOLVED',
]
