import {
  getTextureMaterialStyle,
  type TextureMaterial,
  TextureSurface,
  type TextureThemeName,
  textureGrammar,
  textureThemeMaterials,
} from '@hifi/texture'
import { useNavigate, useSearch } from '@tanstack/react-router'
import { type CSSProperties, useEffect, useState } from 'react'
import { ControlCatalog } from './ControlCatalog'
import { FoundationCatalog } from './FoundationCatalog'
import { TextureMaterialLab } from './ProgrammableMaterialLabs'
import { StyleguideNav } from './StyleguideNav'
import { StyleguideSection } from './StyleguideSection'
import { ThemePicker } from './ThemePicker'
import './styles/texture.css'

export function TextureStyleguide() {
  const { theme } = useSearch({ from: '/styleguide/texture' })
  const navigate = useNavigate({ from: '/styleguide/texture' })
  const selectedTheme =
    textureGrammar.themes.find((candidate) => candidate.name === theme) ?? textureGrammar.themes[0]
  const preset = textureThemeMaterials[selectedTheme.name as TextureThemeName]
  const [material, setMaterial] = useState<TextureMaterial>(preset)

  useEffect(() => setMaterial(preset), [preset])

  const materialStyle = getTextureMaterialStyle(material)
  const controlBorder = `color-mix(in srgb, ${material.foregroundColor} 38%, transparent)`
  const controlShadow = `inset 0 1px 0 color-mix(in srgb, ${material.highlightColor} 28%, transparent), ${Math.max(1, material.shadowDepth * 0.22)}px ${Math.max(2, material.shadowDepth * 0.36)}px ${Math.max(6, material.shadowDepth)}px color-mix(in srgb, ${material.foregroundColor} 15%, transparent)`
  const controlSurface = `color-mix(in srgb, ${material.backgroundColor} 82%, transparent)`
  const pageStyle = {
    ...materialStyle,
    '--control-accent': material.accentColor,
    '--control-accent-contrast': material.backgroundColor,
    '--control-border': controlBorder,
    '--control-radius': `${material.borderRadius}px`,
    '--control-shadow': controlShadow,
    '--control-surface': controlSurface,
    '--control-surface-strong': material.backgroundColor,
    '--generated-control-accent': material.accentColor,
    '--generated-control-accent-contrast': material.backgroundColor,
    '--generated-control-border': controlBorder,
    '--generated-control-muted': `color-mix(in srgb, ${material.foregroundColor} 64%, transparent)`,
    '--generated-control-shadow': controlShadow,
    '--generated-control-surface': controlSurface,
    '--generated-control-surface-strong': material.backgroundColor,
    '--generated-control-text': material.foregroundColor,
    '--generated-texture-image': materialStyle.backgroundImage,
    '--generated-texture-size': materialStyle.backgroundSize,
    '--guide-ink': material.foregroundColor,
    '--guide-line': `color-mix(in srgb, ${material.foregroundColor} 42%, transparent)`,
    '--guide-muted': `color-mix(in srgb, ${material.foregroundColor} 67%, transparent)`,
  } as CSSProperties

  return (
    <main
      className="grammar-page texture-page"
      data-generated-theme="true"
      data-theme={selectedTheme.name}
      style={pageStyle}
    >
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

        <TextureSurface className="texture-hero-sample" material={material}>
          <div className="texture-sample-copy">
            <span>Material sample / {material.name}</span>
            <strong>Made to be handled.</strong>
            <p>{selectedTheme.description}</p>
            <div aria-hidden="true" className="texture-stitch-line" />
          </div>
        </TextureSurface>
      </header>

      <StyleguideNav />

      <StyleguideSection
        description="Start from a substrate preset, then generate the pattern, palette, geometry, and relief applied to the entire Texture grammar."
        id="material-heading"
        index="01"
        title="Generate a tactile theme"
      >
        <ThemePicker
          label="Starting preset"
          onChange={(name) => {
            void navigate({ replace: true, search: { theme: name } })
          }}
          themes={textureGrammar.themes}
          value={selectedTheme.name}
        />
        <TextureMaterialLab
          material={material}
          onChange={setMaterial}
          onReset={() => setMaterial(preset)}
        />
      </StyleguideSection>

      <FoundationCatalog />
      <ControlCatalog grammarLabel="texture" />
    </main>
  )
}
