import {
  type LiquidMaterial,
  LiquidSurface,
  type LiquidThemeName,
  liquidGrammar,
  liquidThemeMaterials,
} from '@hifi/liquid'
import { useNavigate, useSearch } from '@tanstack/react-router'
import { type CSSProperties, useEffect, useState } from 'react'
import { ControlCatalog } from './ControlCatalog'
import { FoundationCatalog } from './FoundationCatalog'
import { LiquidInteractionCatalog } from './LiquidInteractionCatalog'
import { StyleguideNav } from './StyleguideNav'
import { StyleguideSection } from './StyleguideSection'
import { ThemePicker } from './ThemePicker'
import './styles/liquid.css'

export function LiquidStyleguide() {
  const { theme } = useSearch({ from: '/styleguide/liquid' })
  const navigate = useNavigate({ from: '/styleguide/liquid' })
  const selectedTheme =
    liquidGrammar.themes.find((candidate) => candidate.name === theme) ?? liquidGrammar.themes[0]
  const preset = liquidThemeMaterials[selectedTheme.name as LiquidThemeName]
  const [material, setMaterial] = useState<LiquidMaterial>(preset)

  useEffect(() => setMaterial(preset), [preset])

  const tint = `${Math.round(material.tint.r * 255)} ${Math.round(material.tint.g * 255)} ${Math.round(material.tint.b * 255)}`
  const pageStyle = {
    '--control-radius': `${Math.min(material.cornerRadius, 32)}px`,
    '--generated-liquid-blur': `${material.blur}px`,
    '--liquid-accent': `rgb(${tint})`,
    '--liquid-accent-contrast': '#07101e',
    '--liquid-control-radius': `${Math.min(material.cornerRadius, 32)}px`,
    '--liquid-glass': `rgb(${tint} / ${Math.min(0.36, material.tint.a + 0.04)})`,
    '--liquid-glass-strong': `rgb(${tint} / ${Math.min(0.5, material.tint.a + 0.14)})`,
    background: `radial-gradient(circle at 12% 12%, rgb(${tint} / 0.24), transparent 28%), radial-gradient(circle at 82% 28%, color-mix(in srgb, rgb(${tint}) 30%, #25c7ff), transparent 32%), radial-gradient(circle at 58% 78%, color-mix(in srgb, rgb(${tint}) 22%, #ff56ae), transparent 33%), #080d22`,
  } as CSSProperties

  return (
    <main
      className="grammar-page liquid-page"
      data-generated-theme="true"
      data-theme={selectedTheme.name}
      style={pageStyle}
    >
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
          <LiquidSurface className="liquid-primary-lens" material={material}>
            <div className="liquid-lens-copy">
              <span>{material.name}</span>
              <strong>Context stays alive beneath the surface.</strong>
              <p>{selectedTheme.description}</p>
              <button type="button">Enter the field</button>
            </div>
          </LiquidSurface>
          <div className="liquid-float-card liquid-float-card-a">
            <span>Refraction</span>
            <strong>{material.ior.toFixed(2)}</strong>
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
          label="Starting preset"
          onChange={(name) => {
            void navigate({ replace: true, search: { theme: name } })
          }}
          themes={liquidGrammar.themes}
          value={selectedTheme.name}
        />
      </StyleguideSection>

      <FoundationCatalog />
      <LiquidInteractionCatalog
        key={selectedTheme.name}
        onMaterialChange={setMaterial}
        theme={selectedTheme.name as LiquidThemeName}
      />
      <ControlCatalog grammarLabel="liquid" hideInteractionSections />
    </main>
  )
}
