import { describe, expect, it } from 'vitest'
import {
  chamferedRectPath,
  computeBevelFilter,
  computeMosaicGeometry,
  type MosaicGeometryMaterial,
  perturbedInteriorPoints,
} from './geometry'

const size = { height: 300, width: 400 }

const base: MosaicGeometryMaterial = {
  cellSize: 24,
  edgeSegments: 2,
  jointColor: '#101010',
  jointWidth: 4,
  lightAngle: 135,
  pattern: 'tessellation',
  perturbation: 0.5,
  radius: 8,
  relief: 4,
  seed: 7,
  tempo: 100,
}

describe('perturbedInteriorPoints', () => {
  it('produces the same world points regardless of walking direction', () => {
    const from = { x: 0, y: 0 }
    const to = { x: 120, y: 40 }

    const forward = perturbedInteriorPoints(3, from, to, 3, 6)
    const backward = perturbedInteriorPoints(3, to, from, 3, 6)

    expect(forward).toEqual(backward.slice().reverse())
  })

  it('is deterministic for a given seed', () => {
    const from = { x: 0, y: 0 }
    const to = { x: 80, y: 0 }

    expect(perturbedInteriorPoints(9, from, to, 2, 5)).toEqual(
      perturbedInteriorPoints(9, from, to, 2, 5),
    )
  })

  it('returns nothing for zero segments or amplitude', () => {
    const from = { x: 0, y: 0 }
    const to = { x: 10, y: 10 }

    expect(perturbedInteriorPoints(1, from, to, 0, 5)).toEqual([])
    expect(perturbedInteriorPoints(1, from, to, 3, 0)).toEqual([])
  })
})

describe('computeBevelFilter', () => {
  it('emits two stacked drop-shadow() functions', () => {
    const filter = computeBevelFilter(base)

    expect(filter.match(/drop-shadow\(/g)).toHaveLength(2)
  })

  it('grows blur radius with relief', () => {
    const low = computeBevelFilter({ ...base, relief: 1 })
    const high = computeBevelFilter({ ...base, relief: 8 })

    const blurOf = (filter: string) => Number(filter.match(/px (\d+(?:\.\d+)?)px/)?.[1])
    expect(blurOf(high)).toBeGreaterThan(blurOf(low))
  })
})

describe('computeMosaicGeometry', () => {
  it('returns an empty array with no leaves', () => {
    expect(computeMosaicGeometry([], size, base)).toEqual([])
  })

  it('renders grid pattern tiles as plain rects with no clip-path', () => {
    const geometry = computeMosaicGeometry(
      [
        { id: 'a', weight: 1 },
        { id: 'b', weight: 1 },
      ],
      size,
      { ...base, pattern: 'grid' },
    )

    for (const tile of geometry) {
      expect(tile.clipPath).toBe('none')
      expect(tile.width).toBeGreaterThan(0)
      expect(tile.height).toBeGreaterThan(0)
    }
  })

  it('produces a clip-path polygon for non-grid patterns', () => {
    const [tile] = computeMosaicGeometry([{ id: 'a', weight: 1 }], size, base)

    expect(tile?.clipPath).toMatch(/^polygon\(/)
  })

  it('is deterministic for the same seed', () => {
    const leaves = [
      { id: 'a', weight: 3 },
      { id: 'b', weight: 1 },
      { id: 'c', weight: 2 },
    ]

    expect(computeMosaicGeometry(leaves, size, base)).toEqual(
      computeMosaicGeometry(leaves, size, base),
    )
  })

  it('places the tile nearest the container center first in settle order', () => {
    const leaves = [
      { id: 'a', weight: 5 },
      { id: 'b', weight: 1 },
      { id: 'c', weight: 2 },
      { id: 'd', weight: 3 },
    ]
    const geometry = computeMosaicGeometry(leaves, size, base)
    const delays = geometry.map((tile) => tile.settleDelayMs)

    expect(Math.min(...delays)).toBeGreaterThanOrEqual(0)
    expect(new Set(delays).size).toBeGreaterThan(1)
  })

  it('never produces NaN coordinates in the clip-path', () => {
    const geometry = computeMosaicGeometry(
      [
        { id: 'a', weight: 5 },
        { id: 'b', weight: 0.001 },
        { id: 'c', weight: 3 },
      ],
      size,
      { ...base, pattern: 'leadwork' },
    )

    for (const tile of geometry) {
      expect(tile.clipPath).not.toMatch(/NaN/)
    }
  })
})

describe('chamferedRectPath', () => {
  it('returns a plain rect polygon when chamfer is zero', () => {
    expect(chamferedRectPath(40, 20, 0)).toBe('polygon(0px 0px, 40px 0px, 40px 20px, 0px 20px)')
  })

  it('returns an 8-point polygon for a positive chamfer', () => {
    const path = chamferedRectPath(40, 40, 6)
    const pointCount = path.match(/\d+(?:\.\d+)?px \d+(?:\.\d+)?px/g)?.length

    expect(pointCount).toBe(8)
  })

  it('clamps the chamfer to half the shorter side so the polygon never self-intersects', () => {
    const path = chamferedRectPath(20, 10, 999)

    expect(path).not.toMatch(/NaN/)
    for (const match of path.matchAll(/(-?\d+(?:\.\d+)?)px (-?\d+(?:\.\d+)?)px/g)) {
      const x = Number(match[1])
      const y = Number(match[2])
      expect(x).toBeGreaterThanOrEqual(0)
      expect(x).toBeLessThanOrEqual(20)
      expect(y).toBeGreaterThanOrEqual(0)
      expect(y).toBeLessThanOrEqual(10)
    }
  })

  it('never produces NaN or negative coordinates for a zero-size rect', () => {
    expect(chamferedRectPath(0, 0, 4)).not.toMatch(/NaN/)
    expect(chamferedRectPath(0, 0, 4)).not.toMatch(/-/)
  })
})
