import {
  type MosaicMaterial,
  MosaicSurface,
  MosaicTile,
  type MosaicThemeName,
  getMosaicMaterialStyle,
  mosaicGrammar,
  mosaicThemeMaterials,
} from '@hifi/mosaic'
import { useNavigate, useSearch } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { ControlCatalog } from './ControlCatalog'
import { FoundationCatalog } from './FoundationCatalog'
import { MosaicMaterialLab } from './ProgrammableMaterialLabs'
import { StyleguideNav } from './StyleguideNav'
import { StyleguideSection } from './StyleguideSection'
import { ThemePicker } from './ThemePicker'
import { mosaicStyles } from './stylex/mosaic.stylex'
import { className, sharedStyles, stylexProps } from './stylex/shared.stylex'

export function MosaicStyleguide() {
  const { theme } = useSearch({ from: '/styleguide/mosaic' })
  const navigate = useNavigate({ from: '/styleguide/mosaic' })
  const selectedTheme =
    mosaicGrammar.themes.find((candidate) => candidate.name === theme) ?? mosaicGrammar.themes[0]
  const preset = mosaicThemeMaterials[selectedTheme.name as MosaicThemeName]
  const [material, setMaterial] = useState<MosaicMaterial>(preset)

  useEffect(() => setMaterial(preset), [preset])

  const materialStyle = getMosaicMaterialStyle(material)
  const pageStyle = mosaicStyles.generatedPage({
    accent: material.accentColor,
    accentText: material.accentTextColor,
    background: material.backgroundColor,
    backgroundImage: String(materialStyle.backgroundImage),
    backgroundPosition: String(materialStyle.backgroundPosition),
    backgroundSize: String(materialStyle.backgroundSize),
    cell: `${material.cellSize}px`,
    foreground: material.foregroundColor,
    joint: material.jointColor,
    jointWidth: `${material.jointWidth}px`,
    radius: `${material.radius}px`,
    relief: `${material.relief}px`,
    secondary: material.secondaryColor,
    tile: material.tileColor,
    tileText: material.tileTextColor,
  })

  return (
    <main
      {...stylexProps(sharedStyles.grammarPage, mosaicStyles.page, pageStyle)}
      data-generated-theme="true"
      data-theme={selectedTheme.name}
    >
      <header className={className(mosaicStyles.hero)}>
        <div className={className(mosaicStyles.heroCopy)}>
          <p className={className(sharedStyles.grammarKicker)}>04 / Modular grammar</p>
          <h1 className={className(mosaicStyles.heroTitle)}>
            MEANING
            <span className={className(mosaicStyles.heroTitleInset)}>IN PIECES</span>
          </h1>
          <p className={className(sharedStyles.grammarIntro, mosaicStyles.heroIntro)}>
            Mosaic makes hierarchy spatial. Color identifies regions, scale establishes priority,
            and every message occupies a solid tile designed to remain readable.
          </p>
          <dl className={className(mosaicStyles.heroFacts)}>
            <div className={className(mosaicStyles.heroFact)}>
              <dt className={className(mosaicStyles.heroFactLabel)}>Pattern</dt>
              <dd className={className(mosaicStyles.heroFactValue)}>{material.pattern}</dd>
            </div>
            <div className={className(mosaicStyles.heroFact)}>
              <dt className={className(mosaicStyles.heroFactLabel)}>Cell</dt>
              <dd className={className(mosaicStyles.heroFactValue)}>{material.cellSize}px</dd>
            </div>
            <div className={className(mosaicStyles.heroFact)}>
              <dt className={className(mosaicStyles.heroFactLabel)}>Joint</dt>
              <dd className={className(mosaicStyles.heroFactValue)}>{material.jointWidth}px</dd>
            </div>
          </dl>
        </div>

        <MosaicSurface className={className(mosaicStyles.composition)} material={material}>
          <div className={className(mosaicStyles.compositionGrid)}>
            <MosaicTile
              className={className(mosaicStyles.featureTile)}
              material={material}
              rowSpan={2}
              span={2}
            >
              <span className={className(mosaicStyles.tileEyebrow)}>Composition 04</span>
              <strong className={className(mosaicStyles.featureNumber)}>24</strong>
              <span className={className(mosaicStyles.tileFooter)}>units / assembled</span>
            </MosaicTile>
            <MosaicTile material={material} tone="accent">
              <span className={className(mosaicStyles.tileEyebrow)}>State</span>
              <strong className={className(mosaicStyles.tileValue)}>Live</strong>
            </MosaicTile>
            <div aria-hidden="true" className={className(mosaicStyles.colorTile)} />
            <MosaicTile
              className={className(mosaicStyles.statementTile)}
              material={material}
              span={2}
              tone="neutral"
            >
              <strong>THE WHOLE IS LEGIBLE BECAUSE EACH PART IS CLEAR.</strong>
            </MosaicTile>
            <div aria-hidden="true" className={className(mosaicStyles.secondaryTile)} />
            <MosaicTile material={material} tone="accent">
              <span className={className(mosaicStyles.tileEyebrow)}>Offset</span>
              <strong className={className(mosaicStyles.tileValue)}>
                {Math.round(material.offset * 100)}
              </strong>
            </MosaicTile>
          </div>
        </MosaicSurface>
      </header>

      <StyleguideNav />

      <StyleguideSection
        description="Set the palette and its explicit text pairs, then tune the tile pattern, joint, cell, offset, relief, and variation applied to the entire grammar."
        id="material-heading"
        index="01"
        title="Assemble a visual system"
      >
        <ThemePicker
          grammar="mosaic"
          label="Starting composition"
          onChange={(name) => {
            void navigate({ replace: true, search: { theme: name } })
          }}
          themes={mosaicGrammar.themes}
          value={selectedTheme.name}
        />
        <MosaicMaterialLab
          material={material}
          onChange={setMaterial}
          onReset={() => setMaterial(preset)}
        />
      </StyleguideSection>

      <FoundationCatalog />
      <ControlCatalog grammarLabel="mosaic" />
    </main>
  )
}
