import {
  getSignalMaterialStyle,
  type SignalMaterial,
  SignalSurface,
  type SignalThemeName,
  signalGrammar,
  signalThemeMaterials,
} from '@hifi/signal'
import { useNavigate, useSearch } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { ControlCatalog } from './ControlCatalog'
import { FoundationCatalog } from './FoundationCatalog'
import { SignalMaterialLab } from './ProgrammableMaterialLabs'
import { StyleguideNav } from './StyleguideNav'
import { StyleguideSection } from './StyleguideSection'
import { ThemePicker } from './ThemePicker'
import { className, sharedStyles, stylexProps } from './stylex/shared.stylex'
import { signalStyles } from './stylex/signal.stylex'

export function SignalStyleguide() {
  const { theme } = useSearch({ from: '/styleguide/signal' })
  const navigate = useNavigate({ from: '/styleguide/signal' })
  const selectedTheme =
    signalGrammar.themes.find((candidate) => candidate.name === theme) ?? signalGrammar.themes[0]
  const preset = signalThemeMaterials[selectedTheme.name as SignalThemeName]
  const [material, setMaterial] = useState<SignalMaterial>(preset)

  useEffect(() => setMaterial(preset), [preset])

  const materialStyle = getSignalMaterialStyle(material)
  const pageStyle = signalStyles.generatedPage({
    background: material.backgroundColor,
    backgroundImage: materialStyle.backgroundImage,
    backgroundSize:
      materialStyle.backgroundSize === undefined ? undefined : String(materialStyle.backgroundSize),
    bloom: `${material.bloom}px`,
    boxShadow: materialStyle.boxShadow,
    decay: `${material.decay}s`,
    emission: material.emissionColor,
    focus: material.focus,
    grid: `${material.gridSize}px`,
    intensity: material.intensity,
    noise: material.noise,
    rate: `${Math.max(0.3, 60 / material.scanRate)}s`,
    secondary: material.secondaryColor,
    textShadow: materialStyle.textShadow,
    trace: `${material.traceWidth}px`,
  })

  return (
    <main
      {...stylexProps(sharedStyles.grammarPage, signalStyles.page, pageStyle)}
      data-generated-theme="true"
      data-theme={selectedTheme.name}
    >
      <header className={className(signalStyles.hero)}>
        <div className={className(signalStyles.heroCopy)}>
          <p className={className(sharedStyles.grammarKicker)}>04 / Emissive grammar</p>
          <h1 className={className(signalStyles.heroTitle)}>
            INFORMATION
            <span className={className(signalStyles.heroTitleTrace)}>LEAVES A TRACE</span>
          </h1>
          <p className={className(sharedStyles.grammarIntro)}>
            Signal treats light, frequency, persistence, and silence as interface material. It is a
            grammar for instruments that must be read in motion.
          </p>
          <ul aria-label="Rendering capabilities" className={className(signalStyles.capabilities)}>
            <li className={className(signalStyles.capability)}>SDR baseline</li>
            <li className={className(signalStyles.capability)}>HDR progressive</li>
            <li className={className(signalStyles.capability)}>Audio opt-in</li>
          </ul>
        </div>

        <SignalSurface className={className(signalStyles.instrument)} material={material}>
          <div className={className(signalStyles.radar)} aria-hidden="true">
            <i className={className(signalStyles.radarRing)} />
            <i className={className(signalStyles.radarRing, signalStyles.radarRingInner)} />
            <i className={className(signalStyles.radarHorizontal)} />
            <i className={className(signalStyles.radarVertical)} />
            <i className={className(signalStyles.radarSweep)} />
            <b className={className(signalStyles.radarTarget)} />
          </div>
          <div className={className(signalStyles.readout)}>
            <span className={className(signalStyles.meta)}>LIVE / CH 04</span>
            <strong className={className(signalStyles.readoutValue)}>
              {material.scanRate.toFixed(0)}.0
            </strong>
            <small className={className(signalStyles.meta)}>cycles per field</small>
          </div>
          <div className={className(signalStyles.heroFooter, signalStyles.meta)}>
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
          grammar="signal"
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
