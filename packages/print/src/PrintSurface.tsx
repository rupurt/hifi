import type { CSSProperties, PropsWithChildren } from 'react'
import type { PrintThemeName } from './grammar'

export interface PrintSurfaceProps extends PropsWithChildren {
  readonly className?: string
  readonly theme?: PrintThemeName
}

const printStyles: Record<PrintThemeName, CSSProperties> = {
  broadsheet: {
    background: '#eee9dd',
    color: '#181713',
    fontFamily: 'Georgia, Times, serif',
  },
  magazine: {
    background: 'linear-gradient(145deg, #f34b39 0 48%, #f2e7d3 48%)',
    color: '#171515',
    fontFamily: 'Arial, Helvetica, sans-serif',
  },
  technical: {
    backgroundColor: '#f0eee7',
    backgroundImage:
      'linear-gradient(rgb(25 64 91 / 0.09) 1px, transparent 1px), linear-gradient(90deg, rgb(25 64 91 / 0.09) 1px, transparent 1px)',
    backgroundSize: '20px 20px',
    color: '#19364a',
    fontFamily: 'ui-monospace, SFMono-Regular, monospace',
  },
  poster: {
    background: '#f4c62d',
    color: '#201e18',
    fontFamily: 'Impact, Haettenschweiler, sans-serif',
    textTransform: 'uppercase',
  },
}

export function PrintSurface({ children, className, theme = 'broadsheet' }: PrintSurfaceProps) {
  return (
    <section
      className={className}
      style={{
        ...printStyles[theme],
        border: '1px solid rgb(30 28 22 / 0.3)',
        boxShadow: '8px 10px 0 rgb(26 23 18 / 0.16)',
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
