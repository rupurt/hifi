import { describe, expect, it } from 'vitest'
import { hashEdgeSeed, mulberry32 } from './prng'

describe('mulberry32', () => {
  it('is deterministic for a given seed', () => {
    const a = mulberry32(42)
    const b = mulberry32(42)

    expect([a(), a(), a()]).toEqual([b(), b(), b()])
  })

  it('diverges for different seeds', () => {
    const a = mulberry32(1)
    const b = mulberry32(2)

    expect(a()).not.toBe(b())
  })

  it('produces floats in [0, 1)', () => {
    const next = mulberry32(7)

    for (let i = 0; i < 50; i += 1) {
      const value = next()
      expect(value).toBeGreaterThanOrEqual(0)
      expect(value).toBeLessThan(1)
    }
  })
})

describe('hashEdgeSeed', () => {
  it('is symmetric under endpoint swap', () => {
    const forward = hashEdgeSeed(11, 0, 0, 44, 12)
    const backward = hashEdgeSeed(11, 44, 12, 0, 0)

    expect(forward).toBe(backward)
  })

  it('differs across seeds for the same edge', () => {
    expect(hashEdgeSeed(1, 0, 0, 10, 10)).not.toBe(hashEdgeSeed(2, 0, 0, 10, 10))
  })

  it('differs across distinct edges for the same seed', () => {
    expect(hashEdgeSeed(1, 0, 0, 10, 10)).not.toBe(hashEdgeSeed(1, 0, 0, 10, 11))
  })

  it('is stable under sub-pixel float drift below the quantization threshold', () => {
    const a = hashEdgeSeed(5, 0, 0, 10.0004, 10)
    const b = hashEdgeSeed(5, 0, 0, 10.0002, 10)

    expect(a).toBe(b)
  })
})
