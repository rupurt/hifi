import { useId, useState } from 'react'
import { StyleguideSection } from './StyleguideSection'
import './styles/catalog.css'

interface ControlCatalogProps {
  readonly grammarLabel: string
}

const layers = ['Surface', 'Content', 'Signal'] as const

export function ControlCatalog({ grammarLabel }: ControlCatalogProps) {
  const radioName = useId()
  const [layer, setLayer] = useState<(typeof layers)[number]>('Content')
  const [enabled, setEnabled] = useState(true)
  const [range, setRange] = useState(68)

  return (
    <div className="control-catalog">
      <StyleguideSection
        description={`Commands, selection, binary state, and disabled behavior rendered in the ${grammarLabel} grammar.`}
        id="commands-heading"
        index="02"
        title="Commands & selection"
      >
        <div className="catalog-grid catalog-grid-actions">
          <article className="catalog-specimen catalog-specimen-wide">
            <header>
              <span>Buttons</span>
              <code>command</code>
            </header>
            <div className="catalog-control-row">
              <button className="catalog-button catalog-button-primary" type="button">
                Continue
              </button>
              <button className="catalog-button" type="button">
                Save draft
              </button>
              <button className="catalog-button catalog-button-danger" type="button">
                Remove
              </button>
              <button className="catalog-button" disabled type="button">
                Disabled
              </button>
              <button aria-label="Add item" className="catalog-icon-button" type="button">
                <svg aria-hidden="true" fill="none" viewBox="0 0 24 24">
                  <path d="M12 5v14M5 12h14" />
                </svg>
              </button>
            </div>
          </article>

          <article className="catalog-specimen">
            <header>
              <span>Segmented control</span>
              <code>single select</code>
            </header>
            <fieldset className="catalog-segmented">
              <legend className="visually-hidden">Composition layer</legend>
              {layers.map((candidate) => (
                <button
                  aria-pressed={candidate === layer}
                  key={candidate}
                  onClick={() => setLayer(candidate)}
                  type="button"
                >
                  {candidate}
                </button>
              ))}
            </fieldset>
          </article>

          <article className="catalog-specimen">
            <header>
              <span>Binary control</span>
              <code>switch</code>
            </header>
            <div className="catalog-switch-row">
              <button
                aria-checked={enabled}
                aria-label="Enable live material"
                className="catalog-switch"
                onClick={() => setEnabled((current) => !current)}
                role="switch"
                type="button"
              >
                <span />
              </button>
              <div>
                <strong>{enabled ? 'Material active' : 'Material quiet'}</strong>
                <small>Preserves a familiar binary state.</small>
              </div>
            </div>
          </article>

          <article className="catalog-specimen">
            <header>
              <span>Status</span>
              <code>badges</code>
            </header>
            <div className="catalog-control-row">
              <span className="catalog-badge catalog-badge-positive">Ready</span>
              <span className="catalog-badge catalog-badge-warning">Review</span>
              <span className="catalog-badge catalog-badge-danger">Blocked</span>
              <span className="catalog-badge">Draft</span>
            </div>
          </article>
        </div>
      </StyleguideSection>

      <StyleguideSection
        description="Native browser controls retain their expected semantics while the grammar supplies material, focus, shape, and hierarchy."
        id="fields-heading"
        index="03"
        title="Fields & choices"
      >
        <form className="catalog-form" onSubmit={(event) => event.preventDefault()}>
          <div className="catalog-field-grid">
            <label className="catalog-field">
              <span>Text input</span>
              <input defaultValue="High fidelity" type="text" />
              <small>Free-form content</small>
            </label>
            <label className="catalog-field">
              <span>Search</span>
              <input defaultValue="material grammar" type="search" />
              <small>Query with native clearing behavior</small>
            </label>
            <label className="catalog-field">
              <span>Number</span>
              <input defaultValue="24" min="0" type="number" />
              <small>Numeric input with steppers</small>
            </label>
            <label className="catalog-field">
              <span>Select</span>
              <select defaultValue="medium">
                <option value="subtle">Subtle</option>
                <option value="medium">Medium</option>
                <option value="expressive">Expressive</option>
              </select>
              <small>Bounded native selection</small>
            </label>
            <label className="catalog-field catalog-field-wide">
              <span>Textarea</span>
              <textarea defaultValue="A coherent visual language should hold together from the smallest control to the broadest application surface." />
              <small>Longer composition and notes</small>
            </label>
            <label className="catalog-field catalog-range-field">
              <span>
                Range
                <output>{range}%</output>
              </span>
              <input
                max="100"
                min="0"
                onChange={(event) => setRange(event.currentTarget.valueAsNumber)}
                type="range"
                value={range}
              />
              <small>Continuous bounded value</small>
            </label>
          </div>

          <div className="catalog-choice-grid">
            <fieldset className="catalog-choice-group">
              <legend>Checkboxes</legend>
              <label>
                <input defaultChecked type="checkbox" />
                <span>Show material effects</span>
              </label>
              <label>
                <input type="checkbox" />
                <span>Increase contrast</span>
              </label>
              <label>
                <input disabled type="checkbox" />
                <span>Unavailable option</span>
              </label>
            </fieldset>

            <fieldset className="catalog-choice-group">
              <legend>Radio choices</legend>
              <label>
                <input defaultChecked name={radioName} type="radio" />
                <span>Automatic</span>
              </label>
              <label>
                <input name={radioName} type="radio" />
                <span>Light</span>
              </label>
              <label>
                <input name={radioName} type="radio" />
                <span>Dark</span>
              </label>
            </fieldset>

            <div className="catalog-picker-group">
              <label className="catalog-field">
                <span>Color</span>
                <input defaultValue="#6558f5" type="color" />
              </label>
              <label className="catalog-field">
                <span>Date</span>
                <input defaultValue="2026-08-08" type="date" />
              </label>
              <label className="catalog-field">
                <span>File</span>
                <input type="file" />
              </label>
            </div>
          </div>
        </form>
      </StyleguideSection>

      <StyleguideSection
        description="Controls live inside information structures. These specimens test whether the grammar still communicates hierarchy, state, and action at application scale."
        id="structures-heading"
        index="04"
        title="Cards, feedback & data"
      >
        <div className="catalog-structure-grid">
          <article className="catalog-object-card">
            <header>
              <span>Featured object</span>
              <span className="catalog-badge catalog-badge-positive">Live</span>
            </header>
            <strong>Material study 024</strong>
            <p>A composed object with identity, supporting copy, state, and a clear next action.</p>
            <div className="catalog-card-meter" aria-hidden="true">
              <span />
            </div>
            <button className="catalog-text-action" type="button">
              Open study <span aria-hidden="true">→</span>
            </button>
          </article>

          <article className="catalog-feedback-card" role="status">
            <span className="catalog-feedback-mark" aria-hidden="true">
              i
            </span>
            <div>
              <strong>Theme applied successfully</strong>
              <p>The current material tokens are active across every specimen on this route.</p>
            </div>
            <button aria-label="Dismiss message" type="button">
              ×
            </button>
          </article>

          <article className="catalog-list-card">
            <header>
              <span>Ordered work</span>
              <small>3 items</small>
            </header>
            <ol>
              <li data-state="complete">
                <span>01</span>
                <div>
                  <strong>Choose a grammar</strong>
                  <small>Material premise established</small>
                </div>
              </li>
              <li data-state="active">
                <span>02</span>
                <div>
                  <strong>Calibrate controls</strong>
                  <small>Current specimen family</small>
                </div>
              </li>
              <li>
                <span>03</span>
                <div>
                  <strong>Compose an interface</strong>
                  <small>Pending system validation</small>
                </div>
              </li>
            </ol>
          </article>
        </div>

        <section aria-label="Component readiness" className="catalog-table-shell">
          <div className="catalog-table-heading">
            <div>
              <span>Component inventory</span>
              <strong>Grammar readiness</strong>
            </div>
            <button className="catalog-button" type="button">
              Filter
            </button>
          </div>
          <table className="catalog-table">
            <thead>
              <tr>
                <th scope="col">Primitive</th>
                <th scope="col">Family</th>
                <th scope="col">Theme coverage</th>
                <th scope="col">State</th>
                <th scope="col">Action</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th scope="row">Button</th>
                <td>Command</td>
                <td>4 / 4</td>
                <td>
                  <span className="catalog-badge catalog-badge-positive">Ready</span>
                </td>
                <td>
                  <button className="catalog-table-action" type="button">
                    Inspect
                  </button>
                </td>
              </tr>
              <tr>
                <th scope="row">Text input</th>
                <td>Field</td>
                <td>4 / 4</td>
                <td>
                  <span className="catalog-badge catalog-badge-warning">Review</span>
                </td>
                <td>
                  <button className="catalog-table-action" type="button">
                    Compare
                  </button>
                </td>
              </tr>
              <tr>
                <th scope="row">Data table</th>
                <td>Structure</td>
                <td>2 / 4</td>
                <td>
                  <span className="catalog-badge">Draft</span>
                </td>
                <td>
                  <button className="catalog-table-action" type="button">
                    Continue
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </section>
      </StyleguideSection>
    </div>
  )
}
