import { format, formatDistanceToNow } from 'date-fns'

export const fmt = {
  time:     (iso) => format(new Date(iso), 'HH:mm:ss'),
  date:     (iso) => format(new Date(iso), 'dd MMM yyyy'),
  relative: (iso) => formatDistanceToNow(new Date(iso), { addSuffix: true }),
  pct:      (n)   => `${Math.round(n * 100)}%`,
}
