import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import { mosaicThemeMaterials } from './material'
import { MosaicTile } from './MosaicTile'

describe('MosaicTile', () => {
  it('renders its tone palette as a full-size content box', () => {
    const markup = renderToStaticMarkup(
      createElement(
        MosaicTile,
        { material: mosaicThemeMaterials.stained, tone: 'accent' },
        'Content',
      ),
    )

    expect(markup).toContain(mosaicThemeMaterials.stained.accentColor)
    expect(markup).toContain(mosaicThemeMaterials.stained.accentTextColor)
    expect(markup).toContain('width:100%')
    expect(markup).toContain('height:100%')
  })

  it('defaults to the tile tone and the modular preset', () => {
    const markup = renderToStaticMarkup(createElement(MosaicTile, {}, 'Content'))

    expect(markup).toContain(mosaicThemeMaterials.modular.tileColor)
  })
})
