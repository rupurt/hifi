import {
  getPrintMaterialStyle,
  type PrintMaterial,
  PrintSurface,
  type PrintThemeName,
  printGrammar,
  printThemeMaterials,
} from '@hifi/print'
import { useNavigate, useSearch } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { ControlCatalog } from './ControlCatalog'
import { FoundationCatalog } from './FoundationCatalog'
import { PrintMaterialLab } from './ProgrammableMaterialLabs'
import { StyleguideNav } from './StyleguideNav'
import { StyleguideSection } from './StyleguideSection'
import { ThemePicker } from './ThemePicker'
import { printStyles } from './stylex/print.stylex'
import { className, sharedStyles, stylexProps } from './stylex/shared.stylex'

export function PrintStyleguide() {
  const { theme } = useSearch({ from: '/styleguide/print' })
  const navigate = useNavigate({ from: '/styleguide/print' })
  const selectedTheme =
    printGrammar.themes.find((candidate) => candidate.name === theme) ?? printGrammar.themes[0]
  const preset = printThemeMaterials[selectedTheme.name as PrintThemeName]
  const [material, setMaterial] = useState<PrintMaterial>(preset)

  useEffect(() => setMaterial(preset), [preset])

  const materialStyle = getPrintMaterialStyle(material)
  const controlShadow = `${material.shadowOffset}px ${material.shadowOffset}px 0 color-mix(in srgb, ${material.inkColor} 16%, transparent)`
  const controlSurface = `color-mix(in srgb, ${material.paperColor} 78%, transparent)`
  const pageStyle = printStyles.generatedPage({
    accent: material.accentColor,
    backgroundColor: material.paperColor,
    backgroundImage: materialStyle.backgroundImage,
    backgroundSize:
      materialStyle.backgroundSize === undefined ? undefined : String(materialStyle.backgroundSize),
    controlShadow,
    controlSurface,
    fontFamily: String(materialStyle.fontFamily),
    heavyRule: `${Math.max(3, material.ruleWeight * 3)}px`,
    ink: material.inkColor,
    rule: `${Math.max(1, material.ruleWeight)}px`,
    textTransform: material.uppercase ? 'uppercase' : 'none',
  })

  return (
    <main
      {...stylexProps(sharedStyles.grammarPage, printStyles.page, pageStyle)}
      data-generated-theme="true"
      data-theme={selectedTheme.name}
    >
      <header className={className(printStyles.masthead)}>
        <div className={className(printStyles.editionLine)}>
          <span>Hifi specimen journal</span>
          <span>Vol. 01 / No. 003</span>
          <span>08 August 2026</span>
        </div>
        <div className={className(printStyles.nameplate)}>
          <p className={className(sharedStyles.grammarKicker, printStyles.nameplateKicker)}>
            03 / Editorial grammar
          </p>
          <h1 className={className(printStyles.nameplateTitle)}>PRINT</h1>
          <p className={className(printStyles.nameplateTagline)}>
            Hierarchy you can scan. Rhythm you can trust.
          </p>
        </div>
      </header>

      <section className={className(printStyles.lede)}>
        <div className={className(printStyles.ledeCopy)}>
          <span className={className(printStyles.dropcap)}>P</span>
          <p>
            rint turns interface hierarchy into an editorial act. Rules, columns, scale, ink, and
            whitespace make every control part of a deliberate reading sequence.
          </p>
          <a className={className(sharedStyles.grammarJumpLink)} href="#buttons-heading">
            Read the specimens{' '}
            <span aria-hidden="true" className={className(sharedStyles.grammarJumpGlyph)}>
              ↓
            </span>
          </a>
        </div>
        <PrintSurface className={className(printStyles.cover)} material={material}>
          <div className={className(printStyles.coverCopy)}>
            <span className={className(printStyles.coverMeta)}>Special material issue</span>
            <strong className={className(printStyles.coverTitle)}>{material.name}</strong>
            <p className={className(printStyles.coverDescription)}>{selectedTheme.description}</p>
          </div>
        </PrintSurface>
      </section>

      <StyleguideNav />

      <StyleguideSection
        description="Start from an edition preset, then generate the paper, ink, type, rules, grid, and composition applied to the entire Print grammar."
        id="material-heading"
        index="01"
        title="Compose an editorial theme"
      >
        <ThemePicker
          grammar="print"
          label="Starting edition"
          onChange={(name) => {
            void navigate({ replace: true, search: { theme: name } })
          }}
          themes={printGrammar.themes}
          value={selectedTheme.name}
        />
        <PrintMaterialLab
          material={material}
          onChange={setMaterial}
          onReset={() => setMaterial(preset)}
        />
      </StyleguideSection>

      <FoundationCatalog />
      <ControlCatalog grammarLabel="print" />
    </main>
  )
}
