import { Frame, Glass, GlassContainer, LiquidCanvas } from '@liquid-dom/react'
import type { CSSProperties, PropsWithChildren } from 'react'
import type { LiquidThemeName } from './grammar.js'
import { type LiquidMaterial, liquidThemeMaterials } from './material.js'
import { supportsLiquidDomRendering } from './support.js'

export interface LiquidSurfaceProps extends PropsWithChildren {
  readonly className?: string
  readonly material?: LiquidMaterial
  readonly theme?: LiquidThemeName
}

const hostStyle: CSSProperties = {
  alignItems: 'center',
  background:
    'radial-gradient(circle at 15% 15%, #ff8cc6 0, transparent 36%), radial-gradient(circle at 88% 20%, #70d7ff 0, transparent 34%), linear-gradient(135deg, #32225e, #0d4c69)',
  borderRadius: 40,
  display: 'flex',
  justifyContent: 'center',
  minHeight: 320,
  overflow: 'hidden',
  position: 'relative',
}

const contentStyle: CSSProperties = {
  display: 'grid',
  inset: 0,
  padding: 48,
  placeItems: 'center',
  pointerEvents: 'none',
  position: 'absolute',
  textAlign: 'center',
  zIndex: 1,
}

export function LiquidSurface({
  children,
  className,
  material,
  theme = 'clear',
}: LiquidSurfaceProps) {
  const selected = material ?? liquidThemeMaterials[theme]
  const supportsRenderer = supportsLiquidDomRendering()

  if (!supportsRenderer) {
    return (
      <section
        className={className}
        data-liquid-renderer="css-fallback"
        style={{
          ...hostStyle,
          backdropFilter: `blur(${selected.blur}px)`,
          backgroundColor: toCssColor(selected.tint),
          border: '1px solid rgb(255 255 255 / 0.35)',
          boxShadow: 'inset 0 1px 0 rgb(255 255 255 / 0.42), 0 24px 70px rgb(8 8 35 / 0.3)',
        }}
      >
        {children}
      </section>
    )
  }

  return (
    <section className={className} data-liquid-renderer="webgpu" style={hostStyle}>
      <LiquidCanvas style={{ height: '100%', inset: 0, position: 'absolute', width: '100%' }}>
        <GlassContainer
          bezelWidth={selected.bezelWidth}
          blur={selected.blur}
          contentDepth={selected.contentDepth}
          contentIor={selected.contentIor}
          dispersion={selected.dispersion}
          displacementBlur={selected.displacementBlur}
          displacementFactor={selected.displacementFactor}
          ior={selected.ior}
          opacity={selected.opacity}
          spacing={24}
          specularOpacity={selected.specularOpacity}
          specularSharpness={selected.specularSharpness}
          specularStrength={selected.specularStrength}
          surfaceProfile={selected.surfaceProfile}
          thickness={selected.thickness}
          tint={selected.tint}
        >
          <Frame height={230} width={460}>
            <Glass
              cornerRadius={selected.cornerRadius}
              cornerSmoothing={selected.cornerSmoothing}
            />
          </Frame>
        </GlassContainer>
      </LiquidCanvas>
      <div style={contentStyle}>{children}</div>
    </section>
  )
}

function toCssColor({ a, b, g, r }: LiquidMaterial['tint']) {
  return `rgb(${Math.round(r * 255)} ${Math.round(g * 255)} ${Math.round(b * 255)} / ${a})`
}
