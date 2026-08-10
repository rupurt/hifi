import {
  getTextureMaterialStyle,
  type TextureMaterial,
  TextureSurface,
  type TextureThemeName,
  textureGrammar,
  textureThemeMaterials,
} from '@hifi/texture'
import { useNavigate, useSearch } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { ControlCatalog } from './ControlCatalog'
import { FoundationCatalog } from './FoundationCatalog'
import { TextureMaterialLab } from './ProgrammableMaterialLabs'
import { StyleguideNav } from './StyleguideNav'
import { StyleguideSection } from './StyleguideSection'
import { ThemePicker } from './ThemePicker'
import { className, sharedStyles, stylexProps } from './stylex/shared.stylex'
import { textureStyles } from './stylex/texture.stylex'

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
  const pageStyle = textureStyles.generatedPage({
    accent: material.accentColor,
    accentContrast: material.backgroundColor,
    backgroundColor: material.backgroundColor,
    backgroundImage: materialStyle.backgroundImage,
    backgroundSize:
      materialStyle.backgroundSize === undefined ? undefined : String(materialStyle.backgroundSize),
    border: controlBorder,
    controlRadius: `${material.borderRadius}px`,
    controlShadow,
    controlSurface,
    foreground: material.foregroundColor,
  })

  return (
    <main
      {...stylexProps(sharedStyles.grammarPage, textureStyles.page, pageStyle)}
      data-generated-theme="true"
      data-theme={selectedTheme.name}
    >
      <header className={className(sharedStyles.grammarHero, textureStyles.hero)}>
        <div className={className(textureStyles.swatchMark)} aria-hidden="true">
          HIFI / MATTER 002
        </div>
        <div className={className(sharedStyles.grammarHeroCopy)}>
          <p className={className(sharedStyles.grammarKicker)}>02 / Material grammar</p>
          <h1 className={className(sharedStyles.grammarHeroTitle)}>
            Interfaces
            <br />
            you can <em className={className(textureStyles.heroEmphasis)}>feel.</em>
          </h1>
          <p className={className(sharedStyles.grammarIntro)}>
            Texture gives digital controls tooth, grain, weave, and pressure. Surfaces communicate
            their use through tactility before a label has to explain them.
          </p>
          <a className={className(sharedStyles.grammarJumpLink)} href="#buttons-heading">
            Handle the controls{' '}
            <span aria-hidden="true" className={className(sharedStyles.grammarJumpGlyph)}>
              ↓
            </span>
          </a>
        </div>

        <TextureSurface className={className(textureStyles.heroSample)} material={material}>
          <div className={className(textureStyles.sampleCopy)}>
            <span className={className(textureStyles.sampleMeta)}>
              Material sample / {material.name}
            </span>
            <strong className={className(textureStyles.sampleTitle)}>Made to be handled.</strong>
            <p className={className(textureStyles.sampleCopyText)}>{selectedTheme.description}</p>
            <div aria-hidden="true" className={className(textureStyles.stitchLine)} />
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
          grammar="texture"
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
