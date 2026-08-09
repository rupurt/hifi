import type { GrammarTheme } from '@hifi/core'

interface ThemePickerProps {
  readonly label?: string
  readonly onChange: (name: string) => void
  readonly themes: readonly GrammarTheme[]
  readonly value: string
}

export function ThemePicker({
  label = 'Material theme',
  onChange,
  themes,
  value,
}: ThemePickerProps) {
  return (
    <fieldset className="theme-picker">
      <legend className="theme-picker-label">{label}</legend>
      <div className="theme-picker-options">
        {themes.map((theme) => (
          <button
            aria-pressed={theme.name === value}
            className="theme-picker-option"
            key={theme.name}
            onClick={() => onChange(theme.name)}
            type="button"
          >
            <span>{theme.label}</span>
            <small>{theme.description}</small>
          </button>
        ))}
      </div>
    </fieldset>
  )
}
