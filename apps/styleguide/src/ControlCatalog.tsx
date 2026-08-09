import { useId, useState } from 'react'
import { StyleguideSection } from './StyleguideSection'
import './styles/catalog.css'

interface ControlCatalogProps {
  readonly grammarLabel: string
  readonly hideInteractionSections?: boolean
}

const layers = ['Surface', 'Content', 'Signal'] as const

export function ControlCatalog({
  grammarLabel,
  hideInteractionSections = false,
}: ControlCatalogProps) {
  const radioName = useId()
  const [layer, setLayer] = useState<(typeof layers)[number]>('Content')
  const [enabled, setEnabled] = useState(true)
  const [range, setRange] = useState(68)

  return (
    <div className="control-catalog">
      {hideInteractionSections ? null : (
        <>
          <StyleguideSection
            description={`Commands, selection, binary state, and disabled behavior rendered in the ${grammarLabel} grammar.`}
            id="buttons-heading"
            index="07"
            title="Buttons"
          >
            <div className="catalog-grid catalog-grid-actions">
              <article className="catalog-specimen catalog-specimen-wide">
                <header>
                  <span>Command hierarchy</span>
                  <code>default states</code>
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
            </div>
          </StyleguideSection>

          <StyleguideSection
            description="Native browser controls retain their expected semantics while the grammar supplies material, focus, shape, and hierarchy."
            id="forms-heading"
            index="08"
            title="Forms"
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
        </>
      )}

      <StyleguideSection
        description="Compact labels make state and classification visible without overpowering the content they qualify."
        id="badges-heading"
        index="09"
        title="Badges"
      >
        <div className="catalog-badge-board">
          <article>
            <span>Semantic status</span>
            <div className="catalog-control-row">
              <span className="catalog-badge catalog-badge-positive">Ready</span>
              <span className="catalog-badge catalog-badge-warning">Review</span>
              <span className="catalog-badge catalog-badge-danger">Blocked</span>
              <span className="catalog-badge">Draft</span>
            </div>
          </article>
          <article>
            <span>Classification</span>
            <div className="catalog-control-row">
              <span className="catalog-badge catalog-badge-solid">Liquid</span>
              <span className="catalog-badge">React</span>
              <span className="catalog-badge">Stable API</span>
            </div>
          </article>
          <article>
            <span>Counts</span>
            <div className="catalog-control-row">
              <span className="catalog-count-badge">3</span>
              <span className="catalog-count-badge">12</span>
              <span className="catalog-count-badge">99+</span>
            </div>
          </article>
        </div>
      </StyleguideSection>

      <StyleguideSection
        description="Cards test whether the grammar can group identity, metadata, state, supporting copy, and action into clear reusable objects."
        id="cards-heading"
        index="10"
        title="Cards"
      >
        <div className="catalog-card-grid">
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

          <article className="catalog-metric-card">
            <span>System coverage</span>
            <strong>86%</strong>
            <p>Six new component states documented this week.</p>
            <div className="catalog-sparkline" aria-hidden="true">
              <i />
              <i />
              <i />
              <i />
              <i />
              <i />
              <i />
            </div>
          </article>

          <article className="catalog-action-card">
            <span>Next calibration</span>
            <strong>Reduced transparency</strong>
            <p>Verify that depth and hierarchy survive when material effects are unavailable.</p>
            <button className="catalog-button catalog-button-primary" type="button">
              Start review
            </button>
          </article>
        </div>
      </StyleguideSection>

      <StyleguideSection
        description="Dense data needs durable alignment, unambiguous headers, scannable state, and actions that remain attached to the right row."
        id="tables-heading"
        index="11"
        title="Tables"
      >
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

      <StyleguideSection
        description="Lists make sequence, grouping, progress, and lightweight navigation readable with less structure than a table."
        id="lists-heading"
        index="12"
        title="Lists"
      >
        <div className="catalog-list-grid">
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

          <article className="catalog-list-card catalog-navigation-list">
            <header>
              <span>Navigation list</span>
              <small>Active state</small>
            </header>
            <ul>
              <li>
                <button type="button">
                  <span>Foundations</span>
                  <small>6 sections</small>
                </button>
              </li>
              <li data-state="active">
                <button type="button">
                  <span>Controls</span>
                  <small>3 sections</small>
                </button>
              </li>
              <li>
                <button type="button">
                  <span>Structures</span>
                  <small>5 sections</small>
                </button>
              </li>
            </ul>
          </article>
        </div>
      </StyleguideSection>

      <StyleguideSection
        description="Feedback must carry urgency and meaning through more than color, from quiet status updates to actions that need immediate attention."
        id="feedback-heading"
        index="13"
        title="Feedback"
      >
        <div className="catalog-feedback-grid">
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
          <article className="catalog-feedback-card catalog-feedback-positive" role="status">
            <span className="catalog-feedback-mark" aria-hidden="true">
              ✓
            </span>
            <div>
              <strong>All checks passed</strong>
              <p>Contrast, keyboard focus, and reduced-motion behavior are ready.</p>
            </div>
          </article>
          <article className="catalog-feedback-card catalog-feedback-warning" role="alert">
            <span className="catalog-feedback-mark" aria-hidden="true">
              !
            </span>
            <div>
              <strong>Fallback needs review</strong>
              <p>Verify this surface without blur or GPU rendering before publishing.</p>
            </div>
            <button className="catalog-text-action" type="button">
              Review
            </button>
          </article>
        </div>
      </StyleguideSection>

      <StyleguideSection
        description="The final test combines navigation, metrics, progress, controls, and activity into one small product surface."
        id="composition-heading"
        index="14"
        title="Composition"
      >
        <article className="catalog-composition">
          <header className="catalog-composition-header">
            <div>
              <span>Hifi / Grammar lab</span>
              <strong>Material workspace</strong>
            </div>
            <div className="catalog-composition-actions">
              <span className="catalog-badge catalog-badge-positive">Synced</span>
              <button
                aria-label="More workspace actions"
                className="catalog-icon-button"
                type="button"
              >
                <svg aria-hidden="true" fill="currentColor" viewBox="0 0 24 24">
                  <circle cx="5" cy="12" r="1.5" />
                  <circle cx="12" cy="12" r="1.5" />
                  <circle cx="19" cy="12" r="1.5" />
                </svg>
              </button>
            </div>
          </header>
          <div className="catalog-composition-body">
            <nav aria-label="Composition preview">
              <span>Workspace</span>
              <a aria-current="page" href="#composition-heading">
                Overview
              </a>
              <a href="#material-heading">Material</a>
              <a href="#forms-heading">Controls</a>
              <a href="#feedback-heading">Checks</a>
            </nav>
            <div className="catalog-composition-main">
              <div className="catalog-composition-title">
                <div>
                  <span>Current grammar</span>
                  <strong>{grammarLabel}</strong>
                </div>
                <button className="catalog-button catalog-button-primary" type="button">
                  Publish changes
                </button>
              </div>
              <div className="catalog-composition-metrics">
                <article>
                  <span>Sections</span>
                  <strong>14</strong>
                  <small>Shared contract</small>
                </article>
                <article>
                  <span>Coverage</span>
                  <strong>86%</strong>
                  <small>+8 this week</small>
                </article>
                <article>
                  <span>Open checks</span>
                  <strong>03</strong>
                  <small>2 accessibility</small>
                </article>
              </div>
              <div className="catalog-composition-activity">
                <header>
                  <strong>Recent calibration</strong>
                  <button className="catalog-text-action" type="button">
                    View all
                  </button>
                </header>
                <div>
                  <span className="catalog-count-badge">01</span>
                  <p>
                    <strong>Focus state tuned</strong>
                    <small>Buttons · just now</small>
                  </p>
                  <span className="catalog-badge catalog-badge-positive">Ready</span>
                </div>
                <div>
                  <span className="catalog-count-badge">02</span>
                  <p>
                    <strong>Material fallback added</strong>
                    <small>Cards · 18 min ago</small>
                  </p>
                  <span className="catalog-badge catalog-badge-warning">Review</span>
                </div>
              </div>
            </div>
          </div>
        </article>
      </StyleguideSection>
    </div>
  )
}
