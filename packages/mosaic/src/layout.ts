export interface MosaicLayoutLeaf {
  readonly id: string
  readonly weight: number
}

export interface MosaicLayoutRect extends MosaicLayoutLeaf {
  readonly x: number
  readonly y: number
  readonly width: number
  readonly height: number
}

export interface MosaicLayoutSize {
  readonly width: number
  readonly height: number
}

interface Rect {
  x: number
  y: number
  width: number
  height: number
}

const MIN_EDGE_PASSES = 8

/**
 * Partitions a rectangle into non-overlapping rects sized proportionally to each leaf's weight,
 * using the squarified treemap algorithm (Bruls, Huizing, van Wijk 1999). Preserves each leaf's
 * `id`; output order follows input order, not the algorithm's internal weight-sorted layout order.
 *
 * Coordinates are left unrounded so that neighboring rects share exact float edges, which lets
 * downstream edge-perturbation logic match seams without an epsilon-fuzzy dedupe pass.
 */
export function computeSquarifiedLayout(
  leaves: readonly MosaicLayoutLeaf[],
  size: MosaicLayoutSize,
  minEdge = 0,
): MosaicLayoutRect[] {
  if (leaves.length === 0 || size.width <= 0 || size.height <= 0) return []

  const weights = floorMinimumArea(
    leaves.map((leaf) => Math.max(1e-6, leaf.weight)),
    size,
    minEdge,
  )
  const total = weights.reduce((sum, weight) => sum + weight, 0)
  const containerArea = size.width * size.height

  const order = leaves
    .map((leaf, index) => ({ id: leaf.id, index, weight: weights[index] ?? 1e-6 }))
    .sort((a, b) => b.weight - a.weight)

  const placed = new Map<string, Rect>()
  let remaining = order.map((entry) => ({
    area: (entry.weight / total) * containerArea,
    id: entry.id,
  }))
  let rect: Rect = { height: size.height, width: size.width, x: 0, y: 0 }

  while (remaining.length > 0) {
    const side = Math.min(rect.width, rect.height)
    const [first, ...rest] = remaining
    if (!first) break

    let row = [first]
    let rowWorst = worstRatio(row, side)

    for (const candidate of rest) {
      const candidateRow = [...row, candidate]
      const candidateWorst = worstRatio(candidateRow, side)
      if (candidateWorst > rowWorst) break
      row = candidateRow
      rowWorst = candidateWorst
    }

    rect = layoutRow(row, rect, placed)
    remaining = remaining.slice(row.length)
  }

  return leaves.map((leaf) => {
    const placedRect = placed.get(leaf.id) ?? { height: 0, width: 0, x: 0, y: 0 }
    return { ...leaf, ...placedRect }
  })
}

function floorMinimumArea(weights: number[], size: MosaicLayoutSize, minEdge: number): number[] {
  if (minEdge <= 0) return weights

  const containerArea = size.width * size.height
  const minAreaFraction = (minEdge * minEdge) / containerArea
  const next = [...weights]

  for (let pass = 0; pass < MIN_EDGE_PASSES; pass += 1) {
    const total = next.reduce((sum, weight) => sum + weight, 0)
    let changed = false

    for (const [i, weight] of next.entries()) {
      const fraction = weight / total
      if (fraction < minAreaFraction) {
        next[i] = minAreaFraction * total
        changed = true
      }
    }

    if (!changed) break
  }

  return next
}

function worstRatio(row: readonly { area: number }[], side: number): number {
  if (row.length === 0 || side <= 0) return Number.POSITIVE_INFINITY

  const areas = row.map((entry) => entry.area)
  const sum = areas.reduce((a, b) => a + b, 0)
  const max = Math.max(...areas)
  const min = Math.min(...areas)

  return Math.max((side * side * max) / (sum * sum), (sum * sum) / (side * side * min))
}

function layoutRow(
  row: readonly { area: number; id: string }[],
  rect: Rect,
  placed: Map<string, Rect>,
): Rect {
  const rowSum = row.reduce((sum, entry) => sum + entry.area, 0)
  const vertical = rect.width >= rect.height
  const side = vertical ? rect.height : rect.width
  const thickness = side > 0 ? rowSum / side : 0

  let cursor = vertical ? rect.y : rect.x
  for (const entry of row) {
    const length = side > 0 ? entry.area / thickness : 0

    placed.set(
      entry.id,
      vertical
        ? { height: length, width: thickness, x: rect.x, y: cursor }
        : { height: thickness, width: length, x: cursor, y: rect.y },
    )
    cursor += length
  }

  return vertical
    ? { height: rect.height, width: rect.width - thickness, x: rect.x + thickness, y: rect.y }
    : { height: rect.height - thickness, width: rect.width, x: rect.x, y: rect.y + thickness }
}
