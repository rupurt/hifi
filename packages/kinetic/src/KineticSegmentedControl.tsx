import type { HTMLAttributes, KeyboardEvent, ReactNode } from 'react'
import type { KineticThemeName } from './grammar.js'
import { type KineticMaterial, kineticThemeMaterials } from './material.js'

export interface KineticSegmentedControlOption<Value extends string> {
  readonly disabled?: boolean
  readonly label: ReactNode
  readonly value: Value
}

export interface KineticSegmentedControlProps<Value extends string>
  extends Omit<HTMLAttributes<HTMLFieldSetElement>, 'children' | 'onChange'> {
  readonly ariaLabel: string
  readonly material?: KineticMaterial
  readonly onValueChange?: (value: Value) => void
  readonly options: readonly KineticSegmentedControlOption<Value>[]
  readonly theme?: KineticThemeName
  readonly value: Value
}

export function KineticSegmentedControl<Value extends string>({
  ariaLabel,
  className,
  material,
  onValueChange,
  options,
  style,
  theme = 'precision',
  value,
  ...props
}: KineticSegmentedControlProps<Value>) {
  const selectedMaterial = material ?? kineticThemeMaterials[theme]
  const shadowColor = `color-mix(in srgb, ${selectedMaterial.backgroundColor} 38%, black)`

  return (
    <fieldset
      {...props}
      aria-label={ariaLabel}
      className={className}
      data-kinetic-response={selectedMaterial.response}
      style={{
        border: 0,
        display: 'inline-flex',
        isolation: 'isolate',
        margin: 0,
        padding: 0,
        ...style,
      }}
    >
      {options.map((option, index) => {
        const selected = option.value === value
        return (
          <button
            aria-pressed={selected}
            data-selected={selected}
            disabled={option.disabled}
            key={option.value}
            onClick={() => onValueChange?.(option.value)}
            onKeyDown={moveSegmentFocus}
            style={{
              background: selected
                ? selectedMaterial.accentColor
                : `color-mix(in srgb, ${selectedMaterial.backgroundColor} 92%, white)`,
              border: `1px solid ${selectedMaterial.foregroundColor}`,
              borderRadius:
                options.length === 1
                  ? selectedMaterial.radius
                  : index === 0
                    ? `${selectedMaterial.radius}px 0 0 ${selectedMaterial.radius}px`
                    : index === options.length - 1
                      ? `0 ${selectedMaterial.radius}px ${selectedMaterial.radius}px 0`
                      : 0,
              boxShadow: selected
                ? `inset 2px 2px 4px color-mix(in srgb, ${shadowColor} 46%, transparent), inset -1px -1px 0 color-mix(in srgb, white 24%, transparent)`
                : `inset 1px 1px 0 color-mix(in srgb, white 54%, transparent), inset -1px -1px 0 color-mix(in srgb, ${shadowColor} 34%, transparent)`,
              color: selected
                ? selectedMaterial.backgroundColor
                : selectedMaterial.foregroundColor,
              cursor: option.disabled ? 'not-allowed' : 'pointer',
              font: 'inherit',
              fontWeight: 700,
              marginLeft: index === 0 ? 0 : -1,
              minHeight: 38,
              opacity: option.disabled ? 0.55 : 1,
              paddingInline: 10,
              position: 'relative',
              zIndex: selected ? 1 : 0,
            }}
            type="button"
          >
            {option.label}
          </button>
        )
      })}
    </fieldset>
  )
}

function moveSegmentFocus(event: KeyboardEvent<HTMLButtonElement>) {
  if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return
  const parent = event.currentTarget.parentElement
  if (!parent) return
  const controls = Array.from(parent.children).filter(
    (child): child is HTMLButtonElement => child instanceof HTMLButtonElement && !child.disabled,
  )
  const current = controls.indexOf(event.currentTarget)
  if (current < 0 || controls.length === 0) return
  event.preventDefault()
  const target =
    event.key === 'Home'
      ? 0
      : event.key === 'End'
        ? controls.length - 1
        : (current + (event.key === 'ArrowRight' ? 1 : -1) + controls.length) % controls.length
  controls[target]?.focus()
}
