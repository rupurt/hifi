import { afterEach, describe, expect, it, vi } from 'vitest'
import { supportsLiquidDomRendering } from './support'

describe('liquid-dom rendering support', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('requires WebGPU and the HTML-in-Canvas queue method', () => {
    vi.stubGlobal('navigator', { gpu: {} })
    vi.stubGlobal('GPUQueue', class GPUQueue {})

    expect(supportsLiquidDomRendering()).toBe(false)
  })

  it('recognizes a browser with the complete rendering capability', () => {
    class GPUQueue {
      copyElementImageToTexture() {}
    }

    vi.stubGlobal('navigator', { gpu: {} })
    vi.stubGlobal('GPUQueue', GPUQueue)

    expect(supportsLiquidDomRendering()).toBe(true)
  })
})
