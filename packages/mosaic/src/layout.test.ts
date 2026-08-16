import { describe, expect, it } from 'vitest'
import { computeSquarifiedLayout, type MosaicLayoutRect } from './layout'

const size = { height: 300, width: 400 }

describe('computeSquarifiedLayout', () => {
  it('returns an empty layout for no leaves or a zero-size container', () => {
    expect(computeSquarifiedLayout([], size)).toEqual([])
    expect(computeSquarifiedLayout([{ id: 'a', weight: 1 }], { height: 0, width: 0 })).toEqual([])
  })

  it('fills the whole container with a single leaf', () => {
    const [rect] = computeSquarifiedLayout([{ id: 'a', weight: 1 }], size)

    expect(rect).toMatchObject({ height: 300, width: 400, x: 0, y: 0 })
  })

  it('is deterministic for identical inputs', () => {
    const leaves = [
      { id: 'a', weight: 4 },
      { id: 'b', weight: 1 },
      { id: 'c', weight: 2 },
    ]

    expect(computeSquarifiedLayout(leaves, size)).toEqual(computeSquarifiedLayout(leaves, size))
  })

  it('preserves input order in its output regardless of internal weight sorting', () => {
    const leaves = [
      { id: 'small', weight: 1 },
      { id: 'big', weight: 9 },
    ]

    const rects = computeSquarifiedLayout(leaves, size)

    expect(rects.map((rect) => rect.id)).toEqual(['small', 'big'])
  })

  it('sizes area proportionally to weight', () => {
    const rects = computeSquarifiedLayout(
      [
        { id: 'a', weight: 2 },
        { id: 'b', weight: 1 },
      ],
      size,
    )
    const areaOf = (rect: MosaicLayoutRect) => rect.width * rect.height
    const a = mustFind(rects, 'a')
    const b = mustFind(rects, 'b')

    expect(areaOf(a) / areaOf(b)).toBeCloseTo(2, 1)
  })

  it('produces non-overlapping rects that cover the container area', () => {
    const leaves = [
      { id: 'a', weight: 5 },
      { id: 'b', weight: 3 },
      { id: 'c', weight: 1 },
      { id: 'd', weight: 2 },
      { id: 'e', weight: 4 },
    ]
    const rects = computeSquarifiedLayout(leaves, size)

    for (const [i, a] of rects.entries()) {
      for (const b of rects.slice(i + 1)) {
        expect(overlaps(a, b)).toBe(false)
      }
    }

    const totalArea = rects.reduce((sum, rect) => sum + rect.width * rect.height, 0)
    expect(totalArea).toBeCloseTo(size.width * size.height, 0)
  })

  it('floors a near-zero weight up to at least the minimum area', () => {
    // With several comparably-weighted siblings (matching realistic weight ranges), the floor
    // pass has room to place the tiny leaf without forcing it into a full-container sliver —
    // unlike a two-leaf split, where the minority rect must span a full container edge and no
    // area floor can guarantee both dimensions independently. Area is what the pass controls.
    const leaves = [
      { id: 'a', weight: 4 },
      { id: 'b', weight: 3 },
      { id: 'tiny', weight: 0.001 },
      { id: 'c', weight: 2 },
    ]
    const rects = computeSquarifiedLayout(leaves, size, 24)
    const tiny = mustFind(rects, 'tiny')

    expect(tiny.width * tiny.height).toBeGreaterThanOrEqual(24 * 24 - 1)
  })

  it('never produces NaN or negative dimensions for zero or negative weights', () => {
    const rects = computeSquarifiedLayout(
      [
        { id: 'a', weight: 0 },
        { id: 'b', weight: -3 },
        { id: 'c', weight: 5 },
      ],
      size,
    )

    for (const rect of rects) {
      expect(Number.isNaN(rect.width)).toBe(false)
      expect(Number.isNaN(rect.height)).toBe(false)
      expect(rect.width).toBeGreaterThanOrEqual(0)
      expect(rect.height).toBeGreaterThanOrEqual(0)
    }
  })
})

function mustFind(rects: readonly MosaicLayoutRect[], id: string): MosaicLayoutRect {
  const rect = rects.find((candidate) => candidate.id === id)
  if (!rect) throw new Error(`Expected a rect with id ${id}`)
  return rect
}

function overlaps(a: MosaicLayoutRect, b: MosaicLayoutRect): boolean {
  const epsilon = 1e-6
  return (
    a.x + a.width > b.x + epsilon &&
    b.x + b.width > a.x + epsilon &&
    a.y + a.height > b.y + epsilon &&
    b.y + b.height > a.y + epsilon
  )
}
