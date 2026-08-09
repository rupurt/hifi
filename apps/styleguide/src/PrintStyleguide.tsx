import { PrintSurface, type PrintThemeName, printGrammar } from '@hifi/print'
import { useNavigate, useSearch } from '@tanstack/react-router'
import { ControlCatalog } from './ControlCatalog'
import { StyleguideSection } from './StyleguideSection'
import { ThemePicker } from './ThemePicker'
import './styles/print.css'

export function PrintStyleguide() {
  const { theme } = useSearch({ from: '/styleguide/print' })
  const navigate = useNavigate({ from: '/styleguide/print' })
  const selectedTheme =
    printGrammar.themes.find((candidate) => candidate.name === theme) ?? printGrammar.themes[0]

  return (
    <main className="grammar-page print-page" data-theme={selectedTheme.name}>
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
          <a className="grammar-jump-link" href="#commands-heading">
            Read the specimens <span aria-hidden="true">↓</span>
          </a>
        </div>
        <PrintSurface className="print-cover" theme={selectedTheme.name as PrintThemeName}>
          <div className="print-cover-copy">
            <span>Special material issue</span>
            <strong>{selectedTheme.label}</strong>
            <p>{selectedTheme.description}</p>
          </div>
        </PrintSurface>
      </section>

      <nav aria-label="Print styleguide sections" className="grammar-local-nav">
        <a href="#material-heading">Edition</a>
        <a href="#commands-heading">Commands</a>
        <a href="#fields-heading">Fields</a>
        <a href="#structures-heading">Structures</a>
      </nav>

      <StyleguideSection
        description="Each edition changes its typographic voice and compositional pressure without abandoning the same semantic hierarchy."
        id="material-heading"
        index="01"
        title="Select an edition"
      >
        <ThemePicker
          label="Editorial theme"
          onChange={(name) => {
            void navigate({ replace: true, search: { theme: name } })
          }}
          themes={printGrammar.themes}
          value={selectedTheme.name}
        />
      </StyleguideSection>

      <ControlCatalog grammarLabel="print" />
    </main>
  )
}
