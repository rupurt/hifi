import { TextureSurface, type TextureThemeName, textureGrammar } from '@hifi/texture'
import { useNavigate, useSearch } from '@tanstack/react-router'
import { ControlCatalog } from './ControlCatalog'
import { FoundationCatalog } from './FoundationCatalog'
import { StyleguideSection } from './StyleguideSection'
import { StyleguideNav } from './StyleguideNav'
import { ThemePicker } from './ThemePicker'
import './styles/texture.css'

export function TextureStyleguide() {
  const { theme } = useSearch({ from: '/styleguide/texture' })
  const navigate = useNavigate({ from: '/styleguide/texture' })
  const selectedTheme =
    textureGrammar.themes.find((candidate) => candidate.name === theme) ?? textureGrammar.themes[0]

  return (
    <main className="grammar-page texture-page" data-theme={selectedTheme.name}>
      <header className="grammar-hero texture-hero">
        <div className="texture-swatch-mark" aria-hidden="true">
          HIFI / MATTER 002
        </div>
        <div className="grammar-hero-copy">
          <p className="grammar-kicker">02 / Material grammar</p>
          <h1>
            Interfaces
            <br />
            you can <em>feel.</em>
          </h1>
          <p className="grammar-intro">
            Texture gives digital controls tooth, grain, weave, and pressure. Surfaces communicate
            their use through tactility before a label has to explain them.
          </p>
          <a className="grammar-jump-link" href="#buttons-heading">
            Handle the controls <span aria-hidden="true">↓</span>
          </a>
        </div>

        <TextureSurface
          className="texture-hero-sample"
          theme={selectedTheme.name as TextureThemeName}
        >
          <div className="texture-sample-copy">
            <span>Material sample / {selectedTheme.label}</span>
            <strong>Made to be handled.</strong>
            <p>{selectedTheme.description}</p>
            <div aria-hidden="true" className="texture-stitch-line" />
          </div>
        </TextureSurface>
      </header>

      <StyleguideNav />

      <StyleguideSection
        description="Fiber, weave, density, and relief alter the surface while preserving a familiar control vocabulary."
        id="material-heading"
        index="01"
        title="Choose the substrate"
      >
        <ThemePicker
          onChange={(name) => {
            void navigate({ replace: true, search: { theme: name } })
          }}
          themes={textureGrammar.themes}
          value={selectedTheme.name}
        />
      </StyleguideSection>

      <FoundationCatalog />
      <ControlCatalog grammarLabel="texture" />
    </main>
  )
}
