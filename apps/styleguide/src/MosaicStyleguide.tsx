import {
  type MosaicMaterial,
  MosaicSurface,
  MosaicTile,
  type MosaicThemeName,
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

  const pageStyle = mosaicStyles.generatedPage({
    accent: material.accentColor,
    accentText: material.accentTextColor,
    background: material.backgroundColor,
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
          <MosaicTile
            className={className(mosaicStyles.featureTile)}
            material={material}
            weight={4}
          >
            <span className={className(mosaicStyles.tileEyebrow)}>Composition 04</span>
            <strong className={className(mosaicStyles.featureNumber)}>24</strong>
            <span className={className(mosaicStyles.tileFooter)}>units / assembled</span>
          </MosaicTile>
          <MosaicTile material={material} tone="accent" weight={1}>
            <span className={className(mosaicStyles.tileEyebrow)}>State</span>
            <strong className={className(mosaicStyles.tileValue)}>Live</strong>
          </MosaicTile>
          <MosaicTile material={material} tone="neutral" weight={1} />
          <MosaicTile
            className={className(mosaicStyles.statementTile)}
            material={material}
            tone="neutral"
            weight={2}
          >
            <strong>THE WHOLE IS LEGIBLE BECAUSE EACH PART IS CLEAR.</strong>
          </MosaicTile>
          <MosaicTile material={material} tone="tile" weight={1} />
          <MosaicTile material={material} tone="accent" weight={1}>
            <span className={className(mosaicStyles.tileEyebrow)}>Perturbation</span>
            <strong className={className(mosaicStyles.tileValue)}>
              {Math.round(material.perturbation * 100)}
            </strong>
          </MosaicTile>
        </MosaicSurface>
      </header>

      <StyleguideNav />

      <StyleguideSection
        description="Set the palette and its explicit text pairs, then tune the tile pattern, joint, chamfer, relief, light angle, and seeded perturbation applied to the entire grammar."
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
