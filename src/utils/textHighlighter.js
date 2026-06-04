import { ENTITY_TYPES } from '@/config/entityTypes'

/**
 * Splits `text` into alternating plain/highlighted runs based on entity values.
 * Returns: Array<{ text: string, entity?: Entity }>
 *
 * Used by TranscriptSegment to render inline entity highlights (FE-03).
 */
export function highlightEntities(text, entities = []) {
  if (!entities.length) return [{ text }]

  const sorted = [...entities].sort((a, b) => b.value.length - a.value.length)
  const runs = []
  let remaining = text

  while (remaining.length) {
    let earliest = null
    let earliestIdx = Infinity

    for (const entity of sorted) {
      const idx = remaining.toLowerCase().indexOf(entity.value.toLowerCase())
      if (idx !== -1 && idx < earliestIdx) {
        earliest = entity
        earliestIdx = idx
      }
    }

    if (!earliest) {
      runs.push({ text: remaining })
      break
    }

    if (earliestIdx > 0) runs.push({ text: remaining.slice(0, earliestIdx) })

    runs.push({
      text:   remaining.slice(earliestIdx, earliestIdx + earliest.value.length),
      entity: earliest,
    })

    remaining = remaining.slice(earliestIdx + earliest.value.length)
  }

  return runs
}
