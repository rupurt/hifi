import {
  KineticButton,
  type KineticMaterial,
  KineticSurface,
  type KineticThemeName,
  kineticGrammar,
  kineticThemeMaterials,
} from '@hifi/kinetic'
import { useNavigate, useSearch } from '@tanstack/react-router'
import { type CSSProperties, useEffect, useState } from 'react'
import { ControlCatalog } from './ControlCatalog'
import { FoundationCatalog } from './FoundationCatalog'
import { KineticMaterialLab } from './ProgrammableMaterialLabs'
import { StyleguideNav } from './StyleguideNav'
import { StyleguideSection } from './StyleguideSection'
import { ThemePicker } from './ThemePicker'
import './styles/kinetic.css'

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
  const pageStyle = {
    '--control-accent': material.accentColor,
    '--control-accent-contrast': material.backgroundColor,
    '--control-border': `color-mix(in srgb, ${material.foregroundColor} 38%, transparent)`,
    '--control-radius': `${material.radius}px`,
    '--control-shadow': `0 ${Math.max(2, material.travel * 0.5)}px 0 color-mix(in srgb, ${material.foregroundColor} 28%, transparent), 0 ${Math.max(5, material.travel)}px ${Math.max(10, material.mass * 8)}px color-mix(in srgb, ${material.foregroundColor} 16%, transparent)`,
    '--control-surface': `color-mix(in srgb, ${material.backgroundColor} 91%, white)`,
    '--control-surface-strong': material.backgroundColor,
    '--generated-control-accent': material.accentColor,
    '--generated-control-accent-contrast': material.backgroundColor,
    '--generated-control-border': `color-mix(in srgb, ${material.foregroundColor} 38%, transparent)`,
    '--generated-control-muted': `color-mix(in srgb, ${material.foregroundColor} 61%, transparent)`,
    '--generated-control-shadow': `0 ${Math.max(2, material.travel * 0.45)}px 0 color-mix(in srgb, ${material.foregroundColor} 28%, transparent), 0 ${Math.max(5, material.travel)}px ${Math.max(10, material.mass * 7)}px color-mix(in srgb, ${material.foregroundColor} 14%, transparent)`,
    '--generated-control-surface': `color-mix(in srgb, ${material.backgroundColor} 91%, white)`,
    '--generated-control-surface-strong': material.backgroundColor,
    '--generated-control-text': material.foregroundColor,
    '--guide-ink': material.foregroundColor,
    '--guide-line': `color-mix(in srgb, ${material.foregroundColor} 34%, transparent)`,
    '--guide-muted': `color-mix(in srgb, ${material.foregroundColor} 63%, transparent)`,
    '--kinetic-accent': material.accentColor,
    '--kinetic-actuation': material.actuation,
    '--kinetic-background': material.backgroundColor,
    '--kinetic-damping': material.damping,
    '--kinetic-detents': material.detents,
    '--kinetic-duration': `${duration}ms`,
    '--kinetic-foreground': material.foregroundColor,
    '--kinetic-friction': material.friction,
    '--kinetic-mass': material.mass,
    '--kinetic-radius': `${material.radius}px`,
    '--kinetic-restitution': material.restitution,
    '--kinetic-stiffness': material.stiffness,
    '--kinetic-travel': `${material.travel}px`,
  } as CSSProperties

  return (
    <main
      className="grammar-page kinetic-page"
      data-generated-theme="true"
      data-theme={selectedTheme.name}
      style={pageStyle}
    >
      <header className="kinetic-hero">
        <div className="kinetic-index" aria-hidden="true">
          <span>FORCE</span>
          <i />
          <span>STATE</span>
        </div>
        <div className="kinetic-hero-copy">
          <p className="grammar-kicker">05 / Physical grammar</p>
          <h1>
            FORCE
            <span>BECOMES STATE.</span>
          </h1>
          <p className="grammar-intro">
            Kinetic gives controls mass, travel, resistance, thresholds, and consequence. Motion is
            not decoration here; it explains how an interface behaves.
          </p>
          <a className="grammar-jump-link" href="#material-heading">
            Enter the mechanism bench <span aria-hidden="true">↓</span>
          </a>
        </div>

        <KineticSurface className="kinetic-hero-machine" material={material}>
          <div className="kinetic-machine-rail" aria-hidden="true">
            {MACHINE_RAIL_TICKS.map((tick) => (
              <i key={tick} />
            ))}
          </div>
          <div className="kinetic-machine-readout">
            <span>ACTUATOR / A05</span>
            <output>{String(count).padStart(3, '0')}</output>
            <small>{material.response} response</small>
          </div>
          <KineticButton
            className="kinetic-hero-button"
            material={material}
            onClick={() => setCount((current) => current + 1)}
            type="button"
          >
            <span>PRESS</span>
            <small>{material.travel.toFixed(1)} mm travel</small>
          </KineticButton>
          <div className="kinetic-machine-plate">
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
