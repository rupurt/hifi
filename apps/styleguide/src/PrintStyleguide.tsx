import {
  getPrintMaterialStyle,
  type PrintMaterial,
  PrintSurface,
  type PrintThemeName,
  printGrammar,
  printThemeMaterials,
} from '@hifi/print'
import { useNavigate, useSearch } from '@tanstack/react-router'
import { type CSSProperties, useEffect, useState } from 'react'
import { ControlCatalog } from './ControlCatalog'
import { FoundationCatalog } from './FoundationCatalog'
import { PrintMaterialLab } from './ProgrammableMaterialLabs'
import { StyleguideNav } from './StyleguideNav'
import { StyleguideSection } from './StyleguideSection'
import { ThemePicker } from './ThemePicker'
import './styles/print.css'

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
  const pageStyle = {
    ...materialStyle,
    '--control-accent': material.accentColor,
    '--control-accent-contrast': material.paperColor,
    '--control-border': material.inkColor,
    '--control-shadow': controlShadow,
    '--control-surface': controlSurface,
    '--control-surface-strong': material.paperColor,
    '--generated-control-accent': material.accentColor,
    '--generated-control-accent-contrast': material.paperColor,
    '--generated-control-border': material.inkColor,
    '--generated-control-shadow': controlShadow,
    '--generated-control-surface': controlSurface,
    '--generated-control-surface-strong': material.paperColor,
    '--generated-control-text': material.inkColor,
    '--guide-display': materialStyle.fontFamily,
    '--guide-font': materialStyle.fontFamily,
    '--guide-ink': material.inkColor,
    '--guide-line': material.inkColor,
    '--guide-muted': `color-mix(in srgb, ${material.inkColor} 68%, transparent)`,
    '--print-accent': material.accentColor,
    '--print-heavy-rule': `${Math.max(3, material.ruleWeight * 3)}px`,
    '--print-rule': `${Math.max(1, material.ruleWeight)}px`,
    textTransform: material.uppercase ? 'uppercase' : undefined,
  } as CSSProperties

  return (
    <main
      className="grammar-page print-page"
      data-generated-theme="true"
      data-theme={selectedTheme.name}
      style={pageStyle}
    >
      <header className="print-masthead">
        <div className="print-edition-line">
          <span>Hifi specimen journal</span>
          <span>Vol. 01 / No. 003</span>
          <span>08 August 2026</span>
        </div>
        <div className="print-nameplate">
          <p className="grammar-kicker">03 / Editorial grammar</p>
          <h1>PRINT</h1>
          <p>Hierarchy you can scan. Rhythm you can trust.</p>
        </div>
      </header>

      <section className="print-lede">
        <div className="print-lede-copy">
          <span className="print-dropcap">P</span>
          <p>
            rint turns interface hierarchy into an editorial act. Rules, columns, scale, ink, and
            whitespace make every control part of a deliberate reading sequence.
          </p>
          <a className="grammar-jump-link" href="#buttons-heading">
            Read the specimens <span aria-hidden="true">↓</span>
          </a>
        </div>
        <PrintSurface className="print-cover" material={material}>
          <div className="print-cover-copy">
            <span>Special material issue</span>
            <strong>{material.name}</strong>
            <p>{selectedTheme.description}</p>
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
