import type { ButtonHTMLAttributes } from 'react'
import type { KineticThemeName } from './grammar.js'
import { type KineticMaterial, kineticThemeMaterials } from './material.js'

export interface KineticBinaryControlProps
  extends Omit<
    ButtonHTMLAttributes<HTMLButtonElement>,
    'aria-checked' | 'aria-label' | 'children' | 'role'
  > {
  readonly ariaLabel: string
  readonly checked: boolean
  readonly material?: KineticMaterial
  readonly onCheckedChange?: (checked: boolean) => void
  readonly theme?: KineticThemeName
}

export function KineticBinaryControl({
  ariaLabel,
  checked,
  disabled,
  material,
  onCheckedChange,
  onClick,
  style,
  theme = 'precision',
  ...props
}: KineticBinaryControlProps) {
  const selected = material ?? kineticThemeMaterials[theme]
  const duration = Math.round(
    Math.min(420, Math.max(70, 56000 / selected.stiffness + selected.damping * 2.2)),
  )
  const shadowColor = `color-mix(in srgb, ${selected.backgroundColor} 38%, black)`

  return (
    <button
      {...props}
      aria-checked={checked}
      aria-label={ariaLabel}
      data-checked={checked}
      data-kinetic-response={selected.response}
      disabled={disabled}
      onClick={(event) => {
        if (!disabled) onCheckedChange?.(!checked)
        onClick?.(event)
      }}
      role="switch"
      style={{
        appearance: 'none',
        background: checked
          ? `color-mix(in srgb, ${selected.accentColor} 55%, ${selected.backgroundColor})`
          : `color-mix(in srgb, ${selected.backgroundColor} 82%, black)`,
        border: `1px solid ${selected.foregroundColor}`,
        borderRadius: 999,
        boxShadow: `inset 1px 2px 3px color-mix(in srgb, ${shadowColor} 52%, transparent)`,
        cursor: disabled ? 'not-allowed' : 'pointer',
        height: 32,
        opacity: disabled ? 0.55 : 1,
        padding: 3,
        width: 58,
        ...style,
      }}
      type={props.type ?? 'button'}
    >
      <span
        aria-hidden="true"
        style={{
          background: `color-mix(in srgb, ${selected.backgroundColor} 92%, white)`,
          border: `1px solid ${selected.foregroundColor}`,
          borderRadius: '50%',
          boxShadow: `inset 1px 1px 0 color-mix(in srgb, white 48%, transparent), inset -1px -1px 0 color-mix(in srgb, ${shadowColor} 34%, transparent), 1px 2px 0 color-mix(in srgb, ${shadowColor} 54%, transparent)`,
          display: 'block',
          height: 24,
          transform: `translateX(${checked ? 25 : 0}px)`,
          transition: `transform ${duration}ms cubic-bezier(0.2, 1, 0.25, 1)`,
          width: 24,
        }}
      />
    </button>
  )
}
