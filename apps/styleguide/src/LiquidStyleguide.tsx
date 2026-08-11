import {
  type LiquidMaterial,
  type LiquidThemeName,
  liquidGrammar,
  liquidThemeMaterials,
} from '@hifi/liquid'
import { useNavigate, useSearch } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { ControlCatalog } from './ControlCatalog'
import { FoundationCatalog } from './FoundationCatalog'
import { LiquidEmissionField } from './LiquidEmissionField'
import { LiquidHeroMaterial } from './LiquidHeroMaterial'
import { LiquidInteractionCatalog } from './LiquidInteractionCatalog'
import { LiquidThemePicker } from './LiquidThemePicker'
import { liquidFabrics } from './liquidFabrics'
import { StyleguideNav } from './StyleguideNav'
import { StyleguideSection } from './StyleguideSection'
import { liquidStyles } from './stylex/liquid.stylex'
import { className, sharedStyles, stylexProps } from './stylex/shared.stylex'

export function LiquidStyleguide() {
  const { theme } = useSearch({ from: '/styleguide/liquid' })
  const navigate = useNavigate({ from: '/styleguide/liquid' })
  const selectedTheme =
    liquidGrammar.themes.find((candidate) => candidate.name === theme) ?? liquidGrammar.themes[0]
  const preset = liquidThemeMaterials[selectedTheme.name as LiquidThemeName]
  const [material, setMaterial] = useState<LiquidMaterial>(preset)
  const [transmission, setTransmission] = useState(50)
  const [relief, setRelief] = useState(50)

  useEffect(() => {
    setMaterial(preset)
    setRelief(50)
    setTransmission(50)
  }, [preset])

  const tint = `${Math.round(material.tint.r * 255)} ${Math.round(material.tint.g * 255)} ${Math.round(material.tint.b * 255)}`
  const fabric = liquidFabrics[selectedTheme.name as LiquidThemeName]
  const pageStyle = liquidStyles.generatedPage({
    accent: `rgb(${tint})`,
    backgroundColor: fabric.backgroundColor,
    backgroundImage: `linear-gradient(rgb(3 7 22 / ${fabric.pageShade * 0.44}), rgb(3 7 22 / ${fabric.pageShade * 0.44})), ${fabric.backgroundImage}`,
    backgroundSize: `auto, ${fabric.backgroundSize}`,
    blur: `${material.blur}px`,
    controlRadius: `${Math.min(material.cornerRadius, 32)}px`,
    glass: `rgb(${tint} / ${Math.min(0.36, material.tint.a + 0.04)})`,
    glassStrong: `rgb(${tint} / ${Math.min(0.5, material.tint.a + 0.14)})`,
    waveA: fabric.waveA,
    waveB: fabric.waveB,
    waveC: fabric.waveC,
  })

  function changeTransmission(value: number) {
    const position = value / 100
    const offset = position - 0.5

    setTransmission(value)
    setMaterial((current) => ({
      ...current,
      blur: clamp(preset.blur * (1.5 - position), 0, 32),
      opacity: clamp(preset.opacity + offset * 0.24, 0.42, 0.98),
      tint: {
        ...current.tint,
        a: clamp(preset.tint.a - offset * 0.22, 0.03, 0.5),
      },
    }))
  }

  function changeRelief(value: number) {
    const position = value / 100
    const scale = 0.6 + position * 0.8

    setRelief(value)
    setMaterial((current) => ({
      ...current,
      bezelWidth: clamp(preset.bezelWidth * scale, 6, 72),
      contentDepth: clamp(preset.contentDepth * scale, 8, 96),
      displacementFactor: clamp(preset.displacementFactor * scale, 0.2, 2),
      specularOpacity: clamp(preset.specularOpacity * (0.8 + position * 0.4), 0.2, 1),
      thickness: clamp(preset.thickness * scale, 8, 96),
    }))
  }

  function changeMaterial(nextMaterial: LiquidMaterial) {
    const nextTransmission = (1.5 - nextMaterial.blur / Math.max(0.001, preset.blur)) * 100
    const nextRelief = (nextMaterial.thickness / preset.thickness - 0.6) * 125

    setMaterial(nextMaterial)
    setTransmission(Math.round(clamp(nextTransmission, 0, 100)))
    setRelief(Math.round(clamp(nextRelief, 0, 100)))
  }

  return (
    <main
      {...stylexProps(sharedStyles.grammarPage, liquidStyles.page, pageStyle)}
      data-generated-theme="true"
      data-theme={selectedTheme.name}
    >
      <div aria-hidden="true" className={className(liquidStyles.atmosphere)}>
        <span className={className(liquidStyles.fabricVeil)} />
        <LiquidEmissionField />
        <span className={className(liquidStyles.reliefSheet)} />
      </div>

      <div className={className(liquidStyles.contentLayer)}>
        <header className={className(sharedStyles.grammarHero)}>
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
            <LiquidHeroMaterial
              description={selectedTheme.description}
              index={liquidGrammar.themes.indexOf(selectedTheme)}
              label={selectedTheme.label}
              material={material}
              onReliefChange={changeRelief}
              onTransmissionChange={changeTransmission}
              relief={relief}
              theme={selectedTheme.name as LiquidThemeName}
              transmission={transmission}
            />
          </div>
        </header>

        <StyleguideNav />

        <StyleguideSection
          description="Each material carries its own optical field. Select one to place that fabric beneath the entire route and apply its glass constraints to every specimen."
          id="material-heading"
          index="01"
          title="A spectrum of glass"
        >
          <LiquidThemePicker
            label="Choose a material field"
            onChange={(name) => {
              void navigate({ replace: true, search: { theme: name } })
            }}
            value={selectedTheme.name as LiquidThemeName}
          />
        </StyleguideSection>

        <FoundationCatalog />
        <LiquidInteractionCatalog
          key={selectedTheme.name}
          material={material}
          onMaterialChange={changeMaterial}
          theme={selectedTheme.name as LiquidThemeName}
        />
        <ControlCatalog grammarLabel="liquid" hideInteractionSections />
      </div>
    </main>
  )
}

function clamp(value: number, minimum: number, maximum: number) {
  return Math.min(maximum, Math.max(minimum, value))
}
