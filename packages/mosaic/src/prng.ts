/** A small, fast, deterministic PRNG. Returns a function producing floats in [0, 1). */
export function mulberry32(seed: number): () => number {
  let state = seed >>> 0

  return () => {
    state = (state + 0x6d2b79f5) >>> 0
    let t = state
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

/**
 * Derives a seed for a point shared by two neighboring tiles walking the same edge from
 * opposite directions. Canonicalizing endpoint order and quantizing to 0.001px means both
 * neighbors compute the identical seed independently, with no shared mutable state.
 */
export function hashEdgeSeed(seed: number, x1: number, y1: number, x2: number, y2: number): number {
  const [ax, ay, bx, by] = x1 < x2 || (x1 === x2 && y1 < y2) ? [x1, y1, x2, y2] : [x2, y2, x1, y1]

  let hash = seed >>> 0
  for (const value of [ax, ay, bx, by]) {
    hash = Math.imul(hash ^ Math.round(value * 1000), 2654435761) >>> 0
  }
  return hash >>> 0
}
