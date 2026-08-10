import {
  type LiquidMaterial,
  LiquidSurface,
  type LiquidThemeName,
  liquidGrammar,
  liquidThemeMaterials,
} from '@hifi/liquid'
import { useNavigate, useSearch } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { ControlCatalog } from './ControlCatalog'
import { FoundationCatalog } from './FoundationCatalog'
import { LiquidInteractionCatalog } from './LiquidInteractionCatalog'
import { StyleguideNav } from './StyleguideNav'
import { StyleguideSection } from './StyleguideSection'
import { ThemePicker } from './ThemePicker'
import { liquidStyles } from './stylex/liquid.stylex'
import { className, sharedStyles, stylexProps } from './stylex/shared.stylex'

export function LiquidStyleguide() {
  const { theme } = useSearch({ from: '/styleguide/liquid' })
  const navigate = useNavigate({ from: '/styleguide/liquid' })
  const selectedTheme =
    liquidGrammar.themes.find((candidate) => candidate.name === theme) ?? liquidGrammar.themes[0]
  const preset = liquidThemeMaterials[selectedTheme.name as LiquidThemeName]
  const [material, setMaterial] = useState<LiquidMaterial>(preset)

  useEffect(() => setMaterial(preset), [preset])

  const tint = `${Math.round(material.tint.r * 255)} ${Math.round(material.tint.g * 255)} ${Math.round(material.tint.b * 255)}`
  const pageStyle = liquidStyles.generatedPage({
    accent: `rgb(${tint})`,
    backgroundImage: `radial-gradient(circle at 12% 12%, rgb(${tint} / 0.24), transparent 28%), radial-gradient(circle at 82% 28%, color-mix(in srgb, rgb(${tint}) 30%, #25c7ff), transparent 32%), radial-gradient(circle at 58% 78%, color-mix(in srgb, rgb(${tint}) 22%, #ff56ae), transparent 33%)`,
    blur: `${material.blur}px`,
    controlRadius: `${Math.min(material.cornerRadius, 32)}px`,
    glass: `rgb(${tint} / ${Math.min(0.36, material.tint.a + 0.04)})`,
    glassStrong: `rgb(${tint} / ${Math.min(0.5, material.tint.a + 0.14)})`,
  })

  return (
    <main
      {...stylexProps(sharedStyles.grammarPage, liquidStyles.page, pageStyle)}
      data-generated-theme="true"
      data-theme={selectedTheme.name}
    >
      <div aria-hidden="true" className={className(liquidStyles.atmosphere)}>
        <span className={className(liquidStyles.orb, liquidStyles.orbA)} />
        <span className={className(liquidStyles.orb, liquidStyles.orbB)} />
        <span className={className(liquidStyles.orb, liquidStyles.orbC)} />
        <span className={className(liquidStyles.grid)} />
      </div>

      <header className={className(sharedStyles.grammarHero, liquidStyles.contentLayer)}>
        <div className={className(sharedStyles.grammarHeroCopy)}>
          <p className={className(sharedStyles.grammarKicker)}>01 / Active grammar</p>
          <h1 className={className(sharedStyles.grammarHeroTitle)}>
            Light,
            <br />
            <em className={className(liquidStyles.heroEmphasis)}>held in motion.</em>
          </h1>
          <p className={className(sharedStyles.grammarIntro)}>
            Liquid bends the world behind an interface. Refraction, blur, tint, and luminous edges
            preserve context while controls rise into focus.
          </p>
          <a className={className(sharedStyles.grammarJumpLink)} href="#buttons-heading">
            Explore controls{' '}
            <span aria-hidden="true" className={className(sharedStyles.grammarJumpGlyph)}>
              ↓
            </span>
          </a>
        </div>

        <div className={className(liquidStyles.heroVisual)}>
          <LiquidSurface className={className(liquidStyles.primaryLens)} material={material}>
            <div className={className(liquidStyles.lensCopy)}>
              <span className={className(liquidStyles.lensMeta)}>{material.name}</span>
              <strong className={className(liquidStyles.lensTitle)}>
                Context stays alive beneath the surface.
              </strong>
              <p className={className(liquidStyles.lensCopyText)}>{selectedTheme.description}</p>
              <button className={className(liquidStyles.lensButton)} type="button">
                Enter the field
              </button>
            </div>
          </LiquidSurface>
          <div className={className(liquidStyles.floatCard, liquidStyles.floatCardA)}>
            <span className={className(liquidStyles.floatLabel)}>Refraction</span>
            <strong className={className(liquidStyles.floatValue)}>
              {material.ior.toFixed(2)}
            </strong>
          </div>
          <div className={className(liquidStyles.floatCard, liquidStyles.floatCardB)}>
            <span className={className(liquidStyles.floatLabel)}>Light field</span>
            <strong className={className(liquidStyles.floatValue)}>Active</strong>
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
          grammar="liquid"
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
