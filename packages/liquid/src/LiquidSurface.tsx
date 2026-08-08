import { Frame, Glass, GlassContainer, LiquidCanvas } from '@liquid-dom/react'
import type { CSSProperties, PropsWithChildren } from 'react'
import type { LiquidThemeName } from './grammar'

export interface LiquidSurfaceProps extends PropsWithChildren {
  readonly className?: string
  readonly theme?: LiquidThemeName
}

const settings: Record<
  LiquidThemeName,
  { readonly blur: number; readonly opacity: number; readonly fallback: string }
> = {
  clear: { blur: 6, opacity: 0.72, fallback: 'rgb(255 255 255 / 0.16)' },
  tinted: { blur: 10, opacity: 0.82, fallback: 'rgb(137 116 255 / 0.2)' },
  frosted: { blur: 18, opacity: 0.9, fallback: 'rgb(255 255 255 / 0.3)' },
  blurred: { blur: 28, opacity: 0.78, fallback: 'rgb(214 235 255 / 0.22)' },
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

export function LiquidSurface({ children, className, theme = 'clear' }: LiquidSurfaceProps) {
  const selected = settings[theme]
  const supportsWebGpu = typeof navigator !== 'undefined' && 'gpu' in navigator

  if (!supportsWebGpu) {
    return (
      <section
        className={className}
        data-liquid-renderer="css-fallback"
        style={{
          ...hostStyle,
          backdropFilter: `blur(${selected.blur}px)`,
          backgroundColor: selected.fallback,
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
        <GlassContainer blur={selected.blur} opacity={selected.opacity} spacing={24}>
          <Frame height={230} width={460}>
            <Glass cornerRadius={38} />
          </Frame>
        </GlassContainer>
      </LiquidCanvas>
      <div style={contentStyle}>{children}</div>
    </section>
  )
}
