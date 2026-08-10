import {
  KineticButton,
  type KineticMaterial,
  KineticSurface,
  type KineticThemeName,
  kineticGrammar,
  kineticThemeMaterials,
} from '@hifi/kinetic'
import { useNavigate, useSearch } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { ControlCatalog } from './ControlCatalog'
import { FoundationCatalog } from './FoundationCatalog'
import { KineticMaterialLab } from './ProgrammableMaterialLabs'
import { StyleguideNav } from './StyleguideNav'
import { StyleguideSection } from './StyleguideSection'
import { ThemePicker } from './ThemePicker'
import { kineticStyles } from './stylex/kinetic.stylex'
import { className, sharedStyles, stylexProps } from './stylex/shared.stylex'

const MACHINE_RAIL_TICKS = ['0', '1', '2', '3', '4', '5', '6', '7', '8'] as const

export function KineticStyleguide() {
  const { theme } = useSearch({ from: '/styleguide/kinetic' })
  const navigate = useNavigate({ from: '/styleguide/kinetic' })
  const selectedTheme =
    kineticGrammar.themes.find((candidate) => candidate.name === theme) ?? kineticGrammar.themes[0]
  const preset = kineticThemeMaterials[selectedTheme.name as KineticThemeName]
  const [material, setMaterial] = useState<KineticMaterial>(preset)
  const [count, setCount] = useState(0)

  useEffect(() => setMaterial(preset), [preset])

  const duration = Math.round(
    Math.min(500, Math.max(80, 56000 / material.stiffness + material.damping * 2.2)),
  )
  const pageStyle = kineticStyles.generatedPage({
    accent: material.accentColor,
    actuation: material.actuation,
    background: material.backgroundColor,
    controlShadow:
      'inset 1px 1px 0 var(--kinetic-light-highlight), inset -1px -1px 0 var(--kinetic-edge-shadow), var(--kinetic-shadow-x) var(--kinetic-shadow-y) 0 color-mix(in srgb, var(--kinetic-foreground) 28%, transparent), var(--kinetic-shadow-soft-x) var(--kinetic-shadow-soft-y) calc(10px + var(--kinetic-mass) * 8px) var(--kinetic-soft-shadow)',
    damping: material.damping,
    detents: material.detents,
    duration: `${duration}ms`,
    foreground: material.foregroundColor,
    friction: material.friction,
    generatedShadow:
      'inset 1px 1px 0 var(--kinetic-light-highlight), inset -1px -1px 0 var(--kinetic-edge-shadow), var(--kinetic-shadow-x) var(--kinetic-shadow-y) 0 color-mix(in srgb, var(--kinetic-foreground) 28%, transparent), var(--kinetic-shadow-soft-x) var(--kinetic-shadow-soft-y) calc(10px + var(--kinetic-mass) * 7px) color-mix(in srgb, var(--kinetic-foreground) 14%, transparent)',
    mass: material.mass,
    radius: `${material.radius}px`,
    restitution: material.restitution,
    stiffness: material.stiffness,
    surface: `color-mix(in srgb, ${material.backgroundColor} 91%, white)`,
    travel: `${material.travel}px`,
  })

  return (
    <main
      {...stylexProps(sharedStyles.grammarPage, kineticStyles.page, pageStyle)}
      data-generated-theme="true"
      data-theme={selectedTheme.name}
    >
      <header className={className(kineticStyles.hero)}>
        <div className={className(kineticStyles.index)} aria-hidden="true">
          <span>FORCE</span>
          <i className={className(kineticStyles.indexLine)} />
          <span>STATE</span>
        </div>
        <div className={className(kineticStyles.heroCopy)}>
          <p className={className(sharedStyles.grammarKicker)}>05 / Physical grammar</p>
          <h1 className={className(kineticStyles.heroTitle)}>
            FORCE
            <span className={className(kineticStyles.heroTitleAccent)}>BECOMES STATE.</span>
          </h1>
          <p className={className(sharedStyles.grammarIntro)}>
            Kinetic gives controls mass, travel, resistance, thresholds, and consequence. Motion is
            not decoration here; it explains how an interface behaves.
          </p>
          <a className={className(sharedStyles.grammarJumpLink)} href="#material-heading">
            Enter the mechanism bench{' '}
            <span aria-hidden="true" className={className(sharedStyles.grammarJumpGlyph)}>
              ↓
            </span>
          </a>
        </div>

        <KineticSurface className={className(kineticStyles.machine)} material={material}>
          <div className={className(kineticStyles.rail)} aria-hidden="true">
            {MACHINE_RAIL_TICKS.map((tick) => (
              <i className={className(kineticStyles.railTick)} key={tick} />
            ))}
          </div>
          <div className={className(kineticStyles.readout)}>
            <span className={className(kineticStyles.meta)}>ACTUATOR / A05</span>
            <output className={className(kineticStyles.readoutValue)}>
              {String(count).padStart(3, '0')}
            </output>
            <small className={className(kineticStyles.meta)}>{material.response} response</small>
          </div>
          <KineticButton
            className={className(kineticStyles.heroButton)}
            material={material}
            onClick={() => setCount((current) => current + 1)}
            type="button"
          >
            <span className={className(kineticStyles.heroButtonLabel)}>PRESS</span>
            <small className={className(kineticStyles.meta)}>
              {material.travel.toFixed(1)} mm travel
            </small>
          </KineticButton>
          <div className={className(kineticStyles.plate, kineticStyles.meta)}>
            <span>m / {material.mass.toFixed(2)} kg</span>
            <span>k / {material.stiffness.toFixed(0)} N·m</span>
            <span>ζ / {material.damping.toFixed(0)}</span>
          </div>
        </KineticSurface>
      </header>

      <StyleguideNav />

      <StyleguideSection
        description="Configure a physical model—mass, stiffness, damping, friction, travel, actuation, restitution, and detents—then feel that model propagate through every control."
        id="material-heading"
        index="01"
        title="Engineer a response profile"
      >
        <ThemePicker
          grammar="kinetic"
          label="Starting mechanism"
          onChange={(name) => {
            void navigate({ replace: true, search: { theme: name } })
          }}
          themes={kineticGrammar.themes}
          value={selectedTheme.name}
        />
        <KineticMaterialLab
          material={material}
          onChange={setMaterial}
          onReset={() => setMaterial(preset)}
        />
      </StyleguideSection>

      <FoundationCatalog />
      <ControlCatalog grammarLabel="kinetic" />
    </main>
  )
}
