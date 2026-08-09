import {
  getSignalMaterialStyle,
  type SignalMaterial,
  SignalSurface,
  type SignalThemeName,
  signalGrammar,
  signalThemeMaterials,
} from '@hifi/signal'
import { useNavigate, useSearch } from '@tanstack/react-router'
import { type CSSProperties, useEffect, useState } from 'react'
import { ControlCatalog } from './ControlCatalog'
import { FoundationCatalog } from './FoundationCatalog'
import { SignalMaterialLab } from './ProgrammableMaterialLabs'
import { StyleguideNav } from './StyleguideNav'
import { StyleguideSection } from './StyleguideSection'
import { ThemePicker } from './ThemePicker'
import './styles/signal.css'

export function SignalStyleguide() {
  const { theme } = useSearch({ from: '/styleguide/signal' })
  const navigate = useNavigate({ from: '/styleguide/signal' })
  const selectedTheme =
    signalGrammar.themes.find((candidate) => candidate.name === theme) ?? signalGrammar.themes[0]
  const preset = signalThemeMaterials[selectedTheme.name as SignalThemeName]
  const [material, setMaterial] = useState<SignalMaterial>(preset)

  useEffect(() => setMaterial(preset), [preset])

  const materialStyle = getSignalMaterialStyle(material)
  const pageStyle = {
    ...materialStyle,
    '--control-accent': material.emissionColor,
    '--control-accent-contrast': material.backgroundColor,
    '--control-border': `color-mix(in srgb, ${material.emissionColor} 30%, transparent)`,
    '--control-radius': '2px',
    '--control-shadow': `0 0 ${Math.max(4, material.bloom * 0.5)}px color-mix(in srgb, ${material.emissionColor} 14%, transparent)`,
    '--control-surface': `color-mix(in srgb, ${material.backgroundColor} 88%, ${material.emissionColor})`,
    '--control-surface-strong': material.backgroundColor,
    '--generated-control-accent': material.emissionColor,
    '--generated-control-accent-contrast': material.backgroundColor,
    '--generated-control-border': `color-mix(in srgb, ${material.emissionColor} 28%, transparent)`,
    '--generated-control-muted': `color-mix(in srgb, ${material.secondaryColor} 58%, transparent)`,
    '--generated-control-shadow': `0 0 ${Math.max(4, material.bloom * 0.45)}px color-mix(in srgb, ${material.emissionColor} 13%, transparent)`,
    '--generated-control-surface': `color-mix(in srgb, ${material.backgroundColor} 92%, ${material.emissionColor})`,
    '--generated-control-surface-strong': material.backgroundColor,
    '--generated-control-text': material.secondaryColor,
    '--guide-ink': material.secondaryColor,
    '--guide-line': `color-mix(in srgb, ${material.emissionColor} 29%, transparent)`,
    '--guide-muted': `color-mix(in srgb, ${material.secondaryColor} 62%, transparent)`,
    '--signal-background': material.backgroundColor,
    '--signal-emission': material.emissionColor,
    '--signal-secondary': material.secondaryColor,
    '--signal-trace-width': `${material.traceWidth}px`,
  } as CSSProperties

  return (
    <main
      className="grammar-page signal-page"
      data-generated-theme="true"
      data-theme={selectedTheme.name}
      style={pageStyle}
    >
      <header className="signal-hero">
        <div className="signal-hero-copy">
          <p className="grammar-kicker">04 / Emissive grammar</p>
          <h1>
            INFORMATION
            <span>LEAVES A TRACE</span>
          </h1>
          <p className="grammar-intro">
            Signal treats light, frequency, persistence, and silence as interface material. It is a
            grammar for instruments that must be read in motion.
          </p>
          <ul aria-label="Rendering capabilities" className="signal-capabilities">
            <li>SDR baseline</li>
            <li>HDR progressive</li>
            <li>Audio opt-in</li>
          </ul>
        </div>

        <SignalSurface className="signal-hero-instrument" material={material}>
          <div className="signal-radar" aria-hidden="true">
            <i />
            <i />
            <i />
            <b />
          </div>
          <div className="signal-hero-readout">
            <span>LIVE / CH 04</span>
            <strong>{material.scanRate.toFixed(0)}.0</strong>
            <small>cycles per field</small>
          </div>
          <div className="signal-hero-footer">
            <span>{material.name}</span>
            <span>Persistence {material.decay.toFixed(2)} s</span>
          </div>
        </SignalSurface>
      </header>

      <StyleguideNav />

      <StyleguideSection
        description="Tune the emitted palette, scan behavior, persistence, focus, noise, waveform, and optional audio monitor. Every change propagates through the grammar below."
        id="material-heading"
        index="01"
        title="Calibrate an emissive field"
      >
        <ThemePicker
          label="Starting instrument"
          onChange={(name) => {
            void navigate({ replace: true, search: { theme: name } })
          }}
          themes={signalGrammar.themes}
          value={selectedTheme.name}
        />
        <SignalMaterialLab
          material={material}
          onChange={setMaterial}
          onReset={() => setMaterial(preset)}
        />
      </StyleguideSection>

      <FoundationCatalog />
      <ControlCatalog grammarLabel="signal" />
    </main>
  )
}
