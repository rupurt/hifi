import { computeSquarifiedLayout, type MosaicLayoutLeaf, type MosaicLayoutSize } from './layout.js'
import { hashEdgeSeed, mulberry32 } from './prng.js'

export type MosaicGeometryPattern = 'grid' | 'tessellation' | 'leadwork' | 'pixel'

/** The subset of `MosaicMaterial` the geometry pipeline needs. Kept as a narrow, standalone
 * shape so `layout.ts`/`geometry.ts` stay independently testable ahead of the material schema. */
export interface MosaicGeometryMaterial {
  readonly cellSize: number
  readonly edgeSegments: number
  readonly jointColor: string
  readonly jointWidth: number
  readonly lightAngle: number
  readonly pattern: MosaicGeometryPattern
  readonly perturbation: number
  readonly radius: number
  readonly relief: number
  readonly seed: number
  readonly tempo: number
}

export interface MosaicTileGeometry {
  readonly id: string
  readonly left: number
  readonly top: number
  readonly width: number
  readonly height: number
  readonly clipPath: string
  readonly filter: string
  readonly settleDelayMs: number
}

export interface Point {
  readonly x: number
  readonly y: number
}

/**
 * Computes each tile's on-screen box, irregular grout-eroded silhouette, bevel filter, and
 * settle-in stagger delay from a real weight-driven treemap partition of the container.
 */
export function computeMosaicGeometry(
  leaves: readonly MosaicLayoutLeaf[],
  size: MosaicLayoutSize,
  material: MosaicGeometryMaterial,
): MosaicTileGeometry[] {
  const rects = computeSquarifiedLayout(leaves, size, material.cellSize)
  if (rects.length === 0) return []

  const filter = computeBevelFilter(material)
  const overscan = material.perturbation * Math.min(size.width, size.height) * 0.2
  const focus = { x: size.width / 2, y: size.height / 2 }
  const halfDiagonal = Math.hypot(size.width, size.height) / 2 || 1

  return rects.map((rect) => {
    const center = { x: rect.x + rect.width / 2, y: rect.y + rect.height / 2 }
    const settleDelayMs =
      (Math.hypot(center.x - focus.x, center.y - focus.y) / halfDiagonal) * material.tempo

    if (material.pattern === 'grid') {
      const inset = material.jointWidth / 2
      return {
        clipPath: 'none',
        filter,
        height: Math.max(0, rect.height - inset * 2),
        id: rect.id,
        left: rect.x + inset,
        settleDelayMs,
        top: rect.y + inset,
        width: Math.max(0, rect.width - inset * 2),
      }
    }

    const polygon = buildTilePolygon(rect, size, material)
    const clipPath = `polygon(${polygon
      .map(
        (point) =>
          `${(point.x - rect.x + overscan).toFixed(2)}px ${(point.y - rect.y + overscan).toFixed(2)}px`,
      )
      .join(', ')})`

    return {
      clipPath,
      filter,
      height: rect.height + overscan * 2,
      id: rect.id,
      left: rect.x - overscan,
      settleDelayMs,
      top: rect.y - overscan,
      width: rect.width + overscan * 2,
    }
  })
}

/** Two stacked `drop-shadow()`s — not `box-shadow`, which is clipped away by `clip-path` in
 * current browsers. `filter` follows the rendered silhouette, so it works uniformly across
 * every pattern including plain rects. Mirrors `KineticButton`'s offset-shadow + soft-highlight
 * structure, computed from a real light angle instead of a hardcoded diagonal. */
export function computeBevelFilter(
  material: Pick<MosaicGeometryMaterial, 'jointColor' | 'lightAngle' | 'relief'>,
): string {
  const angleRad = (material.lightAngle * Math.PI) / 180
  const dx = Math.sin(angleRad)
  const dy = -Math.cos(angleRad)
  const lift = Math.max(0, material.relief)
  const blur = Math.max(2, lift * 1.6)
  const shadowColor = `color-mix(in srgb, ${material.jointColor} 55%, transparent)`
  const highlightColor = 'color-mix(in srgb, white 45%, transparent)'

  return [
    `drop-shadow(${round(-dx * lift)}px ${round(-dy * lift)}px ${round(blur)}px ${shadowColor})`,
    `drop-shadow(${round(dx * lift * 0.35)}px ${round(dy * lift * 0.35)}px ${round(
      Math.max(1, blur * 0.4),
    )}px ${highlightColor})`,
  ].join(' ')
}

function buildTilePolygon(
  rect: { readonly x: number; readonly y: number; readonly width: number; readonly height: number },
  containerSize: MosaicLayoutSize,
  material: MosaicGeometryMaterial,
): Point[] {
  const corners: readonly [Point, Point, Point, Point] = [
    { x: rect.x, y: rect.y },
    { x: rect.x + rect.width, y: rect.y },
    { x: rect.x + rect.width, y: rect.y + rect.height },
    { x: rect.x, y: rect.y + rect.height },
  ]
  // Each edge as an explicit [from, to] pair, built from literal tuple indices so every
  // element is precisely typed as Point (never `Point | undefined`) regardless of how the
  // edges are later iterated.
  const edges: readonly [Point, Point][] = [
    [corners[0], corners[1]],
    [corners[1], corners[2]],
    [corners[2], corners[3]],
    [corners[3], corners[0]],
  ]
  const epsilon = 0.01
  const isBoundary: readonly [boolean, boolean, boolean, boolean] = [
    rect.y <= epsilon,
    rect.x + rect.width >= containerSize.width - epsilon,
    rect.y + rect.height >= containerSize.height - epsilon,
    rect.x <= epsilon,
  ]

  interface Node {
    readonly point: Point
    readonly corner: boolean
    readonly prevInterior: boolean
    readonly nextInterior: boolean
  }

  const nodes: Node[] = []
  for (const [i, [from, to]] of edges.entries()) {
    const boundary = isBoundary[i] ?? false
    const prevBoundary = isBoundary[(i + 3) % 4] ?? false
    const edgeInterior = !boundary

    nodes.push({
      corner: true,
      nextInterior: edgeInterior,
      point: from,
      prevInterior: !prevBoundary,
    })

    if (edgeInterior) {
      const edgeLength = Math.hypot(to.x - from.x, to.y - from.y)
      const amplitude = material.perturbation * edgeLength * 0.18
      for (const point of perturbedInteriorPoints(
        material.seed,
        from,
        to,
        material.edgeSegments,
        amplitude,
      )) {
        nodes.push({ corner: false, nextInterior: false, point, prevInterior: false })
      }
    }
  }

  const chamferRadius = material.pattern === 'pixel' ? 0 : material.radius
  const chamfered: Point[] = []
  for (const [i, node] of nodes.entries()) {
    const prev = nodes[(i - 1 + nodes.length) % nodes.length]
    const next = nodes[(i + 1) % nodes.length]

    if (
      !node.corner ||
      chamferRadius <= 0 ||
      !(node.prevInterior && node.nextInterior) ||
      !prev ||
      !next
    ) {
      chamfered.push(node.point)
      continue
    }

    chamfered.push(
      moveToward(node.point, prev.point, chamferRadius),
      moveToward(node.point, next.point, chamferRadius),
    )
  }

  const quantizeStep =
    material.pattern === 'leadwork' ? material.cellSize / 8 : material.pattern === 'pixel' ? 4 : 0
  const quantized = quantizeStep > 0 ? quantize(chamfered, quantizeStep) : chamfered

  return erodeTowardCentroid(quantized, material.jointWidth)
}

/** Two neighboring tiles walking the same edge in opposite directions call this with `from`/`to`
 * swapped. Canonicalizing endpoint order internally means both compute the identical set of
 * world-space points, then each returns them in its own local walking order. */
export function perturbedInteriorPoints(
  seed: number,
  from: Point,
  to: Point,
  segments: number,
  amplitude: number,
): Point[] {
  if (segments <= 0 || amplitude <= 0) return []

  const forward = from.x < to.x || (from.x === to.x && from.y < to.y)
  const canonicalStart = forward ? from : to
  const canonicalEnd = forward ? to : from
  const dx = canonicalEnd.x - canonicalStart.x
  const dy = canonicalEnd.y - canonicalStart.y
  const length = Math.hypot(dx, dy)
  const normal = length > 0 ? { x: -dy / length, y: dx / length } : { x: 0, y: 0 }
  const random = mulberry32(
    hashEdgeSeed(seed, canonicalStart.x, canonicalStart.y, canonicalEnd.x, canonicalEnd.y),
  )

  const canonicalPoints: Point[] = []
  for (let i = 1; i <= segments; i += 1) {
    const t = i / (segments + 1)
    const displacement = (random() * 2 - 1) * amplitude
    canonicalPoints.push({
      x: canonicalStart.x + dx * t + normal.x * displacement,
      y: canonicalStart.y + dy * t + normal.y * displacement,
    })
  }

  return forward ? canonicalPoints : canonicalPoints.slice().reverse()
}

function moveToward(from: Point, to: Point, maxDistance: number): Point {
  const dx = to.x - from.x
  const dy = to.y - from.y
  const distance = Math.hypot(dx, dy)
  if (distance === 0) return from

  const amount = Math.min(maxDistance, distance * 0.4)
  const t = amount / distance
  return { x: from.x + dx * t, y: from.y + dy * t }
}

function quantize(points: Point[], step: number): Point[] {
  return points.map((point) => ({
    x: Math.round(point.x / step) * step,
    y: Math.round(point.y / step) * step,
  }))
}

function erodeTowardCentroid(points: Point[], jointWidth: number): Point[] {
  if (points.length === 0) return points

  const centroid = {
    x: points.reduce((sum, point) => sum + point.x, 0) / points.length,
    y: points.reduce((sum, point) => sum + point.y, 0) / points.length,
  }

  return points.map((point) => moveToward(point, centroid, jointWidth / 2))
}

function round(value: number): number {
  return Math.round(value * 100) / 100
}

/**
 * A ready-to-use `clip-path: polygon(...)` string for a single chamfered rect — the same
 * corner-cut used on interior treemap corners in `buildTilePolygon`, extracted standalone for
 * fixed-size controls (checkboxes, radio marks) that don't need a full tile layout. The chamfer
 * is clamped to half the shorter side so the polygon never self-intersects.
 */
export function chamferedRectPath(width: number, height: number, chamfer: number): string {
  const w = Math.max(0, width)
  const h = Math.max(0, height)
  const c = Math.max(0, Math.min(chamfer, Math.min(w, h) / 2))

  if (c <= 0) {
    return `polygon(0px 0px, ${round(w)}px 0px, ${round(w)}px ${round(h)}px, 0px ${round(h)}px)`
  }

  const points: Point[] = [
    { x: c, y: 0 },
    { x: w - c, y: 0 },
    { x: w, y: c },
    { x: w, y: h - c },
    { x: w - c, y: h },
    { x: c, y: h },
    { x: 0, y: h - c },
    { x: 0, y: c },
  ]

  return `polygon(${points.map((point) => `${round(point.x)}px ${round(point.y)}px`).join(', ')})`
}
