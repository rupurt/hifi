import { LiquidSurface, type LiquidThemeName, liquidGrammar } from '@hifi/liquid'
import { useNavigate, useSearch } from '@tanstack/react-router'
import { ControlCatalog } from './ControlCatalog'
import { FoundationCatalog } from './FoundationCatalog'
import { StyleguideSection } from './StyleguideSection'
import { StyleguideNav } from './StyleguideNav'
import { ThemePicker } from './ThemePicker'
import './styles/liquid.css'

export function LiquidStyleguide() {
  const { theme } = useSearch({ from: '/styleguide/liquid' })
  const navigate = useNavigate({ from: '/styleguide/liquid' })
  const selectedTheme =
    liquidGrammar.themes.find((candidate) => candidate.name === theme) ?? liquidGrammar.themes[0]

  return (
    <main className="grammar-page liquid-page" data-theme={selectedTheme.name}>
      <div aria-hidden="true" className="liquid-atmosphere">
        <span className="liquid-orb liquid-orb-a" />
        <span className="liquid-orb liquid-orb-b" />
        <span className="liquid-orb liquid-orb-c" />
        <span className="liquid-grid" />
      </div>

      <header className="grammar-hero liquid-hero">
        <div className="grammar-hero-copy">
          <p className="grammar-kicker">01 / Active grammar</p>
          <h1>
            Light,
            <br />
            <em>held in motion.</em>
          </h1>
          <p className="grammar-intro">
            Liquid bends the world behind an interface. Refraction, blur, tint, and luminous edges
            preserve context while controls rise into focus.
          </p>
          <a className="grammar-jump-link" href="#buttons-heading">
            Explore controls <span aria-hidden="true">↓</span>
          </a>
        </div>

        <div className="liquid-hero-visual">
          <LiquidSurface
            className="liquid-primary-lens"
            theme={selectedTheme.name as LiquidThemeName}
          >
            <div className="liquid-lens-copy">
              <span>{selectedTheme.label} glass</span>
              <strong>Context stays alive beneath the surface.</strong>
              <p>{selectedTheme.description}</p>
              <button type="button">Enter the field</button>
            </div>
          </LiquidSurface>
          <div className="liquid-float-card liquid-float-card-a">
            <span>Refraction</span>
            <strong>1.46</strong>
          </div>
          <div className="liquid-float-card liquid-float-card-b">
            <span>Light field</span>
            <strong>Active</strong>
          </div>
        </div>
      </header>

      <StyleguideNav />

      <StyleguideSection
        description="The optical behavior changes while the grammar's structure remains stable. Select a variant to apply it to every specimen below."
        id="material-heading"
        index="01"
        title="A spectrum of glass"
      >
        <ThemePicker
          onChange={(name) => {
            void navigate({ replace: true, search: { theme: name } })
          }}
          themes={liquidGrammar.themes}
          value={selectedTheme.name}
        />
      </StyleguideSection>

      <FoundationCatalog />
      <ControlCatalog grammarLabel="liquid" />
    </main>
  )
}
