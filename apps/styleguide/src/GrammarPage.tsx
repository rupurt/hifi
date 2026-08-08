import { LiquidSurface, type LiquidThemeName } from '@hifi/liquid'
import { PrintSurface, type PrintThemeName } from '@hifi/print'
import { TextureSurface, type TextureThemeName } from '@hifi/texture'
import { Link } from '@tanstack/react-router'
import { grammarRegistry, isGrammarName } from './grammars'
import { grammarRoute } from './router'

interface PreviewCopyProps {
  readonly eyebrow: string
  readonly heading: string
  readonly description: string
}

function PreviewCopy({ description, eyebrow, heading }: PreviewCopyProps) {
  return (
    <div className="preview-copy">
      <span>{eyebrow}</span>
      <strong>{heading}</strong>
      <p>{description}</p>
      <button type="button">A component</button>
    </div>
  )
}

export function GrammarPage() {
  const { grammar } = grammarRoute.useParams()
  const { theme } = grammarRoute.useSearch()
  const navigate = grammarRoute.useNavigate()

  if (!isGrammarName(grammar)) {
    return (
      <main className="not-found">
        <p className="eyebrow">Unknown grammar</p>
        <h1>“{grammar}” is not in the collection.</h1>
        <Link to="/">Return to the grammar index</Link>
      </main>
    )
  }

  const definition = grammarRegistry[grammar]
  const selectedTheme =
    definition.themes.find((candidate) => candidate.name === theme) ?? definition.themes[0]

  const previewCopy = {
    eyebrow: `${definition.label} / ${selectedTheme.label}`,
    heading: 'One grammar, many surfaces.',
    description: selectedTheme.description,
  }

  return (
    <main className="styleguide-page">
      <header className="styleguide-heading">
        <div>
          <p className="eyebrow">{definition.status} grammar</p>
          <h1>{definition.label}</h1>
          <p>{definition.description}</p>
        </div>
        <label className="theme-control">
          <span>Theme</span>
          <select
            onChange={(event) => {
              void navigate({ replace: true, search: { theme: event.target.value } })
            }}
            value={selectedTheme.name}
          >
            {definition.themes.map((candidate) => (
              <option key={candidate.name} value={candidate.name}>
                {candidate.label}
              </option>
            ))}
          </select>
        </label>
      </header>

      <section aria-labelledby="material-preview" className="specimen-section">
        <div className="section-heading">
          <p className="eyebrow">Material</p>
          <h2 id="material-preview">Theme specimen</h2>
        </div>

        {grammar === 'liquid' && (
          <LiquidSurface theme={selectedTheme.name as LiquidThemeName}>
            <PreviewCopy {...previewCopy} />
          </LiquidSurface>
        )}
        {grammar === 'texture' && (
          <TextureSurface theme={selectedTheme.name as TextureThemeName}>
            <PreviewCopy {...previewCopy} />
          </TextureSurface>
        )}
        {grammar === 'print' && (
          <PrintSurface theme={selectedTheme.name as PrintThemeName}>
            <PreviewCopy {...previewCopy} />
          </PrintSurface>
        )}
      </section>

      <section aria-labelledby="theme-foundations" className="specimen-section">
        <div className="section-heading">
          <p className="eyebrow">Foundations</p>
          <h2 id="theme-foundations">Theme vocabulary</h2>
        </div>
        <div className="theme-grid">
          {definition.themes.map((candidate, index) => (
            <article className="theme-card" key={candidate.name}>
              <span>{String(index + 1).padStart(2, '0')}</span>
              <h3>{candidate.label}</h3>
              <p>{candidate.description}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  )
}
