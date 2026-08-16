import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import { mosaicThemeMaterials } from './material'
import { MosaicSurface } from './MosaicSurface'
import { MosaicTile } from './MosaicTile'

describe('MosaicSurface', () => {
  it('renders the grout background and pattern attribute from the material', () => {
    const markup = renderToStaticMarkup(
      createElement(
        MosaicSurface,
        { material: mosaicThemeMaterials.tessellated },
        createElement(MosaicTile, { key: 'a', weight: 2 }, 'One'),
        createElement(MosaicTile, { key: 'b', weight: 1 }, 'Two'),
      ),
    )

    expect(markup).toContain('data-mosaic-pattern="tessellation"')
    expect(markup).toContain(mosaicThemeMaterials.tessellated.jointColor)
  })

  it('falls back to a proportionally weighted flex layout before measuring (SSR has no ResizeObserver)', () => {
    const markup = renderToStaticMarkup(
      createElement(
        MosaicSurface,
        { material: mosaicThemeMaterials.modular },
        createElement(MosaicTile, { key: 'a', weight: 3 }, 'One'),
        createElement(MosaicTile, { key: 'b', weight: 1 }, 'Two'),
      ),
    )

    expect(markup).toContain('flex-grow:3')
    expect(markup).toContain('flex-grow:1')
    expect(markup).not.toContain('clip-path')
  })

  it('does not crash under SSR where window is undefined', () => {
    expect(() =>
      renderToStaticMarkup(
        createElement(
          MosaicSurface,
          { material: mosaicThemeMaterials.pixel },
          createElement(MosaicTile, { key: 'a' }, 'One'),
        ),
      ),
    ).not.toThrow()
  })
})
