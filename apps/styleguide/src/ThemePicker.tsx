import type { GrammarTheme } from '@hifi/core'
import { className, sharedStyles } from './stylex/shared.stylex'

interface ThemePickerProps {
  readonly grammar: 'kinetic' | 'liquid' | 'print' | 'signal' | 'texture'
  readonly label?: string
  readonly onChange: (name: string) => void
  readonly themes: readonly GrammarTheme[]
  readonly value: string
}

export function ThemePicker({
  grammar,
  label = 'Material theme',
  onChange,
  themes,
  value,
}: ThemePickerProps) {
  return (
    <fieldset className={className(sharedStyles.themePicker)}>
      <legend className={className(sharedStyles.themePickerLabel)}>{label}</legend>
      <div
        className={className(
          sharedStyles.themePickerOptions,
          grammar === 'print' && sharedStyles.themePickerPrintOptions,
        )}
      >
        {themes.map((theme, index) => (
          <button
            aria-pressed={theme.name === value}
            className={className(
              sharedStyles.themePickerOption,
              grammar === 'liquid' && sharedStyles.themePickerLiquid,
              grammar === 'texture' && sharedStyles.themePickerTexture,
              grammar === 'print' && sharedStyles.themePickerPrint,
              grammar === 'print' && index === 0 && sharedStyles.themePickerPrintFirst,
              grammar === 'signal' && sharedStyles.themePickerSignal,
              grammar === 'kinetic' && sharedStyles.themePickerKinetic,
              theme.name === value && sharedStyles.themePickerOptionActive,
              grammar === 'liquid' && theme.name === value && sharedStyles.themePickerLiquidActive,
              grammar === 'texture' &&
                theme.name === value &&
                sharedStyles.themePickerTextureActive,
              grammar === 'print' && theme.name === value && sharedStyles.themePickerPrintActive,
              grammar === 'signal' && theme.name === value && sharedStyles.themePickerSignalActive,
              grammar === 'kinetic' &&
                theme.name === value &&
                sharedStyles.themePickerKineticActive,
            )}
            key={theme.name}
            onClick={() => onChange(theme.name)}
            type="button"
          >
            <span className={className(sharedStyles.themePickerName)}>{theme.label}</span>
            <small
              className={className(
                sharedStyles.themePickerDescription,
                grammar === 'print' &&
                  theme.name === value &&
                  sharedStyles.themePickerPrintDescriptionActive,
              )}
            >
              {theme.description}
            </small>
          </button>
        ))}
      </div>
    </fieldset>
  )
}
