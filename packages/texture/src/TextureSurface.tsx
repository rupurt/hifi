import type { CSSProperties, PropsWithChildren } from 'react'
import type { TextureThemeName } from './grammar'

export interface TextureSurfaceProps extends PropsWithChildren {
  readonly className?: string
  readonly theme?: TextureThemeName
}

const textureBackgrounds: Record<TextureThemeName, CSSProperties> = {
  paper: {
    backgroundColor: '#e9dfca',
    backgroundImage:
      'radial-gradient(circle at 20% 30%, rgb(81 62 40 / 0.08) 0 1px, transparent 1.5px), radial-gradient(circle at 70% 65%, rgb(255 255 255 / 0.55) 0 1px, transparent 1.5px)',
    backgroundSize: '18px 17px, 21px 23px',
  },
  canvas: {
    backgroundColor: '#b9aa8b',
    backgroundImage:
      'repeating-linear-gradient(0deg, transparent 0 5px, rgb(45 38 29 / 0.1) 5px 6px), repeating-linear-gradient(90deg, transparent 0 5px, rgb(255 255 255 / 0.18) 5px 6px)',
  },
  grain: {
    backgroundColor: '#30333a',
    backgroundImage:
      'radial-gradient(circle at 25% 25%, rgb(255 255 255 / 0.14) 0 0.7px, transparent 1px)',
    backgroundSize: '5px 5px',
    color: '#f4f0e8',
  },
  fabric: {
    backgroundColor: '#7e3151',
    backgroundImage:
      'repeating-linear-gradient(45deg, transparent 0 4px, rgb(255 255 255 / 0.08) 4px 5px), repeating-linear-gradient(-45deg, transparent 0 4px, rgb(20 5 12 / 0.1) 4px 5px)',
    color: '#fff8f2',
  },
}

export function TextureSurface({ children, className, theme = 'paper' }: TextureSurfaceProps) {
  return (
    <section
      className={className}
      style={{
        ...textureBackgrounds[theme],
        border: '1px solid rgb(44 36 24 / 0.22)',
        borderRadius: 8,
        boxShadow: '0 24px 50px rgb(42 29 16 / 0.2)',
        display: 'grid',
        minHeight: 320,
        padding: 48,
        placeItems: 'center',
        textAlign: 'center',
      }}
    >
      {children}
    </section>
  )
}
